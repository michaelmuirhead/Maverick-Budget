// R&D system.
// Players assign staff to research projects. Each day, assigned researchers
// produce tech points based on their tech/design stats. When a research project
// reaches its required points, the tech node is marked completed in the studio's
// completedTechIds; that unlocks features for engines, new genres, and platforms.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { ResearchProject } from "../types/engine";
import type { Staff } from "../types/staff";

import { TECH_NODE_BY_ID, researchableNodes } from "../data/techTree";
import { TRAIT_BY_ID } from "../data/traits";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate, isWeekend } from "../core/time";

// ============ START A RESEARCH PROJECT ============
// Validates the node is researchable, then creates a ResearchProject with
// the given staff assignment. The assigned staff are marked as on this research
// (they can't be on a development project simultaneously — same currentProjectId slot).
export function startResearch(
  state: GameState,
  nodeId: string,
  assignedStaffIds: ID[]
): GameState {
  const node = TECH_NODE_BY_ID[nodeId];
  if (!node) return state;

  // Must not already be completed
  if (state.studio.completedTechIds.includes(nodeId)) return state;

  // Year must have reached emergedYear
  const year = isoToDate(state.currentDate).year;
  if (year < node.emergedYear) {
    return appendLog(state, {
      category: "event",
      headline: `Research not yet viable: ${node.name}`,
      body: `${node.name} requires ${node.emergedYear} at earliest.`,
      severity: "warning",
    });
  }

  // All prerequisites must be completed
  const missing = node.prerequisites.filter(
    (p) => !state.studio.completedTechIds.includes(p)
  );
  if (missing.length > 0) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot start research: ${node.name}`,
      body: `Missing prerequisites: ${missing.map((id) => TECH_NODE_BY_ID[id]?.name ?? id).join(", ")}`,
      severity: "warning",
    });
  }

  // Must have at least one valid researcher assigned
  const validStaff = assignedStaffIds
    .map((id) => state.staff[id])
    .filter((s): s is Staff => !!s && s.status === "employed");
  if (validStaff.length === 0) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot start research: no staff assigned`,
      severity: "warning",
    });
  }

  // Check none of them are already on a dev/research project
  for (const s of validStaff) {
    if (s.currentProjectId !== null) {
      return appendLog(state, {
        category: "event",
        headline: `${s.name} already assigned to another project`,
        severity: "warning",
      });
    }
  }

  let rng = state.rng;
  const [id, r1] = generateId("rsch", rng);
  rng = r1;

  const research: ResearchProject = {
    id,
    nodeId,
    assignedStaffIds: validStaff.map((s) => s.id),
    pointsAccumulated: 0,
    pointsRequired: node.techPointsRequired,
    startDate: state.currentDate,
    completed: false,
  };

  // Update staff assignments — use research ID as currentProjectId
  const staffUpdates: Record<ID, Staff> = {};
  for (const s of validStaff) {
    staffUpdates[s.id] = { ...s, currentProjectId: id };
  }

  let next: GameState = {
    ...state,
    rng,
    staff: { ...state.staff, ...staffUpdates },
    researchProjects: { ...state.researchProjects, [id]: research },
  };

  next = appendLog(next, {
    category: "event",
    headline: `Research started: ${node.name}`,
    body: `${validStaff.length} researcher${validStaff.length > 1 ? "s" : ""} assigned. ${node.techPointsRequired} tech points required.`,
    severity: "info",
  });

  return next;
}

// ============ CANCEL A RESEARCH PROJECT ============
export function cancelResearch(state: GameState, researchId: ID): GameState {
  const research = state.researchProjects[researchId];
  if (!research || research.completed) return state;

  // Unassign staff
  const staffUpdates: Record<ID, Staff> = {};
  for (const staffId of research.assignedStaffIds) {
    const s = state.staff[staffId];
    if (s && s.currentProjectId === researchId) {
      staffUpdates[staffId] = { ...s, currentProjectId: null };
    }
  }

  const node = TECH_NODE_BY_ID[research.nodeId];

  return appendLog({
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    researchProjects: {
      ...state.researchProjects,
      [researchId]: { ...research, completed: false, assignedStaffIds: [] },
    },
  }, {
    category: "event",
    headline: `Research cancelled: ${node?.name ?? "unknown"}`,
    severity: "warning",
  });
}

// ============ DAILY R&D TICK ============
// For each active research project, sum tech-point contribution from researchers
// and advance. If the node completes, unlock it for the studio.
export function tickResearch(state: GameState): GameState {
  if (Object.keys(state.researchProjects).length === 0) return state;

  const today = isoToDate(state.currentDate);
  const weekend = isWeekend(today);
  const outputMult = weekend ? 0.3 : 1.0;

  let next = state;
  const researchUpdates: Record<ID, ResearchProject> = {};
  const newlyCompletedNodeIds: string[] = [];
  const staffMoraleUpdates: Record<ID, Staff> = {};

  for (const research of Object.values(state.researchProjects)) {
    if (research.completed) continue;

    const researchers = research.assignedStaffIds
      .map((id) => state.staff[id])
      .filter((s): s is Staff => !!s && s.status === "employed" && s.currentProjectId === research.id);

    if (researchers.length === 0) continue;

    // Tech points per researcher per day.
    // Base = (tech * 0.6 + design * 0.4) / 10 points/day for an average researcher.
    // Modifiers from traits and morale/energy apply.
    let dayPoints = 0;
    for (const s of researchers) {
      let contribution = (s.stats.tech * 0.6 + s.stats.design * 0.4) / 10;

      // Trait modifiers
      for (const tid of s.traits) {
        const def = TRAIT_BY_ID[tid];
        if (!def) continue;
        for (const eff of def.effects) {
          if (eff.type === "stat_mod" && eff.stat === "tech") {
            contribution += eff.value / 20; // ~5% per tech stat boost
          }
        }
        // Innovator and code wizard traits get explicit R&D boosts
        if (tid === "innovator") contribution *= 1.2;
        if (tid === "code_wizard") contribution *= 1.15;
        if (tid === "visionary") contribution *= 1.3;
      }

      // Morale/energy multiplier
      const moraleMult = 0.6 + (s.morale / 100) * 0.6;
      const energyMult = 0.5 + (s.energy / 100) * 0.5;
      contribution *= moraleMult * energyMult * outputMult;

      dayPoints += contribution;

      // Small energy cost for researchers, morale perk for novel work
      const newEnergy = Math.max(0, Math.min(100, s.energy - 0.6 + (weekend ? 6 : 1)));
      let newMorale = s.morale;
      if (newMorale < 70) newMorale += 0.2;
      staffMoraleUpdates[s.id] = { ...s, energy: newEnergy, morale: Math.max(0, Math.min(100, newMorale)) };
    }

    const newPoints = research.pointsAccumulated + dayPoints;
    const completed = newPoints >= research.pointsRequired;

    researchUpdates[research.id] = {
      ...research,
      pointsAccumulated: Math.min(research.pointsRequired, newPoints),
      completed,
    };

    if (completed) {
      newlyCompletedNodeIds.push(research.nodeId);
      // Unassign staff on completion
      for (const s of researchers) {
        staffMoraleUpdates[s.id] = {
          ...(staffMoraleUpdates[s.id] ?? s),
          currentProjectId: null,
          // Morale bump for completing a research project
          morale: Math.min(100, (staffMoraleUpdates[s.id]?.morale ?? s.morale) + 8),
        };
      }
    }
  }

  next = {
    ...next,
    staff: { ...next.staff, ...staffMoraleUpdates },
    researchProjects: { ...next.researchProjects, ...researchUpdates },
  };

  if (newlyCompletedNodeIds.length > 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        completedTechIds: [...next.studio.completedTechIds, ...newlyCompletedNodeIds],
      },
    };
    for (const nodeId of newlyCompletedNodeIds) {
      const node = TECH_NODE_BY_ID[nodeId];
      next = appendLog(next, {
        category: "event",
        headline: `Research complete: ${node?.name ?? nodeId}`,
        body: `New features unlocked: ${(node?.grantsFeatures ?? []).join(", ")}`,
        severity: "success",
      });
    }
  }

  return next;
}

// ============ SELECTORS ============
// Get the list of tech nodes the studio can currently start researching.
export function availableResearchNodes(state: GameState) {
  const year = isoToDate(state.currentDate).year;
  const completed = new Set(state.studio.completedTechIds);
  // Exclude any already in an active research project
  const inProgress = new Set(
    Object.values(state.researchProjects)
      .filter((r) => !r.completed)
      .map((r) => r.nodeId)
  );
  return researchableNodes(year, completed).filter((n) => !inProgress.has(n.id));
}
