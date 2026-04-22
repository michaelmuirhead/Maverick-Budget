// Engine builder.
// Handles:
//   - Starting a new EngineProject: player picks features (from unlocked tech)
//     and a name/lineage; assigns programmers; pays the upfront build cost.
//   - Per-tick progression through 4 phases: architecture, implementation,
//     integration, optimization. Similar shape to game development phases.
//   - On completion, the EngineProject is consumed and a GameEngine
//     record is added to state.engines with status "internal_only".
//   - Public release action: pay publicReleaseCost, transition engine to
//     "public_release" so other studios can license it.
//   - License terms mutation: player can update licenseTerms on their engines.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type {
  GameEngine, EngineProject, LicenseTerms, TechBranch,
} from "../types/engine";
import type { Staff } from "../types/staff";

import { ENGINE_FEATURE_BY_ID } from "../data/engineFeatures";
import { TECH_NODE_BY_ID } from "../data/techTree";
import { TRAIT_BY_ID } from "../data/traits";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, dateToIso, isoToDate, isWeekend } from "../core/time";

// ============ CONSTANTS ============

const ENGINE_PHASE_ORDER: EngineProject["phases"][number]["name"][] = [
  "architecture", "implementation", "integration", "optimization",
];

const ENGINE_PHASE_DAYS: Record<string, number> = {
  architecture: 30,
  implementation: 90,
  integration: 45,
  optimization: 30,
};

// Cost per feature — tier-based, in cents
function featureBuildCost(featureId: string): Money {
  const f = ENGINE_FEATURE_BY_ID[featureId];
  if (!f) return 0;
  // Tier 1: $10K, Tier 4: $160K, Tier 7: $1.28M per feature
  return Math.round(10000 * 100 * Math.pow(2, f.tier - 1));
}

// Monthly maintenance = roughly 2% of total build cost
function computeMaintenanceCost(totalBuildCost: Money): Money {
  return Math.round(totalBuildCost * 0.02);
}

// ============ START ENGINE PROJECT ============
export interface StartEngineProjectInput {
  plannedName: string;
  plannedLineageId: string;        // "mav_forge", "mav_engine", etc.
  plannedVersionNumber: number;    // 1 for new lineage, 2+ for successors
  featureIds: string[];            // selected from unlocked tech
  assignedStaffIds: ID[];
}

export function startEngineProject(
  state: GameState,
  input: StartEngineProjectInput
): { state: GameState; projectId: ID | null } {
  // Validate — every feature requested must be granted by a completed tech node
  const completedTech = new Set(state.studio.completedTechIds);
  const availableFeatures = new Set<string>();
  for (const nodeId of completedTech) {
    const node = TECH_NODE_BY_ID[nodeId];
    if (!node) continue;
    for (const f of node.grantsFeatures) availableFeatures.add(f);
  }
  // Player must have pre-unlocked these engine features from start-preset
  for (const pid of state.studio.completedTechIds) {
    const n = TECH_NODE_BY_ID[pid];
    if (n) for (const f of n.grantsFeatures) availableFeatures.add(f);
  }

  for (const fid of input.featureIds) {
    if (!availableFeatures.has(fid)) {
      return {
        state: appendLog(state, {
          category: "engine",
          headline: `Cannot start engine: unknown feature ${fid}`,
          severity: "warning",
        }),
        projectId: null,
      };
    }
  }
  if (input.featureIds.length === 0) {
    return {
      state: appendLog(state, {
        category: "engine",
        headline: `Cannot start engine: pick at least one feature`,
        severity: "warning",
      }),
      projectId: null,
    };
  }

  // Staff must be valid, employed, and free
  const validStaff = input.assignedStaffIds
    .map((id) => state.staff[id])
    .filter((s): s is Staff => !!s && s.status === "employed" && s.currentProjectId === null);
  if (validStaff.length === 0) {
    return {
      state: appendLog(state, {
        category: "engine",
        headline: `Cannot start engine: assign at least one free staff member`,
        severity: "warning",
      }),
      projectId: null,
    };
  }

  // Compute total cost
  const totalCost = input.featureIds.reduce((sum, fid) => sum + featureBuildCost(fid), 0);
  if (state.studio.cash < totalCost) {
    return {
      state: appendLog(state, {
        category: "engine",
        headline: `Cannot afford engine build ($${Math.round(totalCost / 100).toLocaleString()})`,
        severity: "warning",
      }),
      projectId: null,
    };
  }

  let rng = state.rng;
  const [id, r1] = generateId("engproj", rng);
  rng = r1;

  const phases: EngineProject["phases"] = ENGINE_PHASE_ORDER.map((name) => ({
    name,
    completion: 0,
    daysAllocated: ENGINE_PHASE_DAYS[name]!,
    daysSpent: 0,
  }));

  const totalDays = phases.reduce((s, p) => s + p.daysAllocated, 0);
  const today = isoToDate(state.currentDate);
  const target = addDays(today, totalDays);

  const project: EngineProject = {
    id,
    plannedName: input.plannedName,
    plannedLineageId: input.plannedLineageId,
    plannedVersionNumber: input.plannedVersionNumber,
    plannedFeatureIds: [...input.featureIds],
    phases,
    currentPhaseIndex: 0,
    assignedStaffIds: validStaff.map((s) => s.id),
    budget: { total: totalCost, spent: 0 },
    startDate: state.currentDate,
    targetCompletionDate: dateToIso(target),
    cancelled: false,
  };

  // Assign staff
  const staffUpdates: Record<ID, Staff> = {};
  for (const s of validStaff) {
    staffUpdates[s.id] = { ...s, currentProjectId: id };
  }

  let next: GameState = {
    ...state,
    rng,
    staff: { ...state.staff, ...staffUpdates },
    engineProjects: { ...state.engineProjects, [id]: project },
    studio: { ...state.studio, cash: state.studio.cash - totalCost },
  };

  next = appendLog(next, {
    category: "engine",
    headline: `Engine project started: ${input.plannedName}`,
    body: `${input.featureIds.length} features, $${Math.round(totalCost / 100).toLocaleString()} budget, target ${dateToIso(target)}.`,
    severity: "info",
  });

  return { state: next, projectId: id };
}

// ============ CANCEL ENGINE PROJECT ============
export function cancelEngineProject(state: GameState, projectId: ID): GameState {
  const proj = state.engineProjects[projectId];
  if (!proj || proj.cancelled) return state;

  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of proj.assignedStaffIds) {
    const s = state.staff[sid];
    if (s && s.currentProjectId === projectId) {
      staffUpdates[sid] = { ...s, currentProjectId: null };
    }
  }

  return appendLog({
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    engineProjects: {
      ...state.engineProjects,
      [projectId]: { ...proj, cancelled: true, assignedStaffIds: [] },
    },
  }, {
    category: "engine",
    headline: `Engine project cancelled: ${proj.plannedName}`,
    severity: "warning",
  });
}

// ============ DAILY ENGINE BUILD TICK ============
export function tickEngineBuilds(state: GameState): GameState {
  if (Object.keys(state.engineProjects).length === 0) return state;

  const today = isoToDate(state.currentDate);
  const weekend = isWeekend(today);
  const outputMult = weekend ? 0.3 : 1.0;

  let next = state;
  const projectUpdates: Record<ID, EngineProject> = {};
  const completedProjects: EngineProject[] = [];
  const staffUpdates: Record<ID, Staff> = {};

  for (const proj of Object.values(state.engineProjects)) {
    if (proj.cancelled) continue;
    const phase = proj.phases[proj.currentPhaseIndex];
    if (!phase) continue;
    // Fully complete? Skip.
    if (proj.currentPhaseIndex >= proj.phases.length - 1 && phase.completion >= 100) continue;

    const staff = proj.assignedStaffIds
      .map((id) => state.staff[id])
      .filter((s): s is Staff => !!s && s.status === "employed");
    if (staff.length === 0) continue;

    // Progress rate: each staff contributes based on tech stat.
    // Baseline: a 60-tech staff produces 1.0 phase-day per day.
    let phaseDaysAdvanced = 0;
    for (const s of staff) {
      let rate = s.stats.tech / 60;
      // Trait bonuses
      for (const tid of s.traits) {
        if (tid === "code_wizard") rate *= 1.3;
        if (tid === "innovator") rate *= 1.15;
        if (tid === "visionary") rate *= 1.25;
        if (tid === "perfectionist") rate *= 0.85;
        if (tid === "speed_demon") rate *= 1.2;
      }
      // Morale/energy
      const moraleMult = 0.6 + (s.morale / 100) * 0.6;
      const energyMult = 0.5 + (s.energy / 100) * 0.5;
      rate *= moraleMult * energyMult * outputMult;

      phaseDaysAdvanced += rate;

      // Energy/morale drift from engine work
      const newEnergy = Math.max(0, Math.min(100, s.energy - 0.6 + (weekend ? 6 : 1)));
      let newMorale = s.morale;
      if (newMorale < 70) newMorale += 0.15;
      staffUpdates[s.id] = {
        ...(staffUpdates[s.id] ?? s),
        energy: newEnergy,
        morale: Math.max(0, Math.min(100, newMorale)),
      };
    }

    const newDaysSpent = phase.daysSpent + phaseDaysAdvanced;
    const newCompletion = Math.min(100, (newDaysSpent / phase.daysAllocated) * 100);

    const newPhases = [...proj.phases];
    newPhases[proj.currentPhaseIndex] = {
      ...phase,
      daysSpent: newDaysSpent,
      completion: newCompletion,
    };

    let newCurrentPhaseIndex = proj.currentPhaseIndex;
    if (newCompletion >= 100 && proj.currentPhaseIndex < proj.phases.length - 1) {
      newCurrentPhaseIndex++;
    }

    const updated: EngineProject = {
      ...proj,
      phases: newPhases,
      currentPhaseIndex: newCurrentPhaseIndex,
    };

    projectUpdates[proj.id] = updated;

    // Final phase complete?
    if (newCurrentPhaseIndex === proj.phases.length - 1 && newCompletion >= 100) {
      completedProjects.push(updated);
    }
  }

  next = {
    ...next,
    staff: { ...next.staff, ...staffUpdates },
    engineProjects: { ...next.engineProjects, ...projectUpdates },
  };

  // Finalize completed engines
  for (const proj of completedProjects) {
    next = finalizeEngine(next, proj);
  }

  return next;
}

// ============ FINALIZE COMPLETED ENGINE ============
function finalizeEngine(state: GameState, proj: EngineProject): GameState {
  let rng = state.rng;
  const [engineId, r1] = generateId("eng", rng);
  rng = r1;

  const year = isoToDate(state.currentDate).year;

  // Compute per-branch tiers from features
  const branchTiers: Record<TechBranch, number> = {
    graphics: 0, audio: 0, networking: 0, simulation: 0, platform: 0,
    ai_tools: 0, monetization: 0, input_ux: 0,
  };
  for (const fid of proj.plannedFeatureIds) {
    const f = ENGINE_FEATURE_BY_ID[fid];
    if (!f) continue;
    if (f.tier > branchTiers[f.branch]) branchTiers[f.branch] = f.tier;
  }
  // Overall tier = min non-zero branch tier (weakest branch gates capability)
  const nonZero = Object.values(branchTiers).filter((v) => v > 0);
  const overallTier = nonZero.length > 0 ? Math.min(...nonZero) : 1;

  // Default license terms — internal only, with fee/royalty defaults if publicly released later
  const defaultTerms: LicenseTerms = {
    licenseFee: Math.round(proj.budget.total * 0.15), // 15% of build cost as default fee
    royaltyRate: 0.05,
    minCommitmentMonths: 0,
    openSource: false,
  };

  const engine: GameEngine = {
    id: engineId,
    name: proj.plannedName,
    shortName: proj.plannedName.length <= 12 ? proj.plannedName : undefined,
    lineageId: proj.plannedLineageId,
    versionNumber: proj.plannedVersionNumber,
    origin: "player",
    ownerStudioId: state.studio.id,
    status: "internal_only",
    featureIds: [...proj.plannedFeatureIds],
    branchTiers,
    overallTier,
    buildCost: proj.budget.total,
    monthlyMaintenanceCost: computeMaintenanceCost(proj.budget.total),
    publicReleaseCost: Math.round(proj.budget.total * 0.3),
    licenseTerms: defaultTerms,
    startedYear: isoToDate(proj.startDate).year,
    releasedYear: year,
    currentness: 100,
    engineReputation: 20, // starts humble, grows with use
    projectsBuilt: 0,
    totalLicensees: 0,
  };

  // Unassign staff, bump their morale for shipping
  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of proj.assignedStaffIds) {
    const s = state.staff[sid];
    if (!s) continue;
    staffUpdates[sid] = {
      ...s,
      currentProjectId: null,
      morale: Math.min(100, s.morale + 12),
      reputation: Math.min(100, s.reputation + 3),
    };
  }

  // Remove the engine project (completed), add to engines, update studio-owned list
  const newEngineProjects = { ...state.engineProjects };
  delete newEngineProjects[proj.id];

  let next: GameState = {
    ...state,
    rng,
    staff: { ...state.staff, ...staffUpdates },
    engineProjects: newEngineProjects,
    engines: { ...state.engines, [engineId]: engine },
    studio: {
      ...state.studio,
      ownedEngineIds: [...state.studio.ownedEngineIds, engineId],
    },
  };

  next = appendLog(next, {
    category: "engine",
    headline: `Engine complete: ${engine.name}`,
    body: `Tier ${overallTier} engine now available for internal projects. Monthly maintenance: $${Math.round(engine.monthlyMaintenanceCost / 100).toLocaleString()}.`,
    severity: "success",
    relatedIds: { engineId },
  });

  return next;
}

// ============ PUBLIC RELEASE ============
// Move an internal_only engine to public_release, paying the upfront cost.
export function publiclyReleaseEngine(
  state: GameState,
  engineId: ID,
  licenseTerms?: Partial<LicenseTerms>
): GameState {
  const engine = state.engines[engineId];
  if (!engine) return state;
  if (engine.ownerStudioId !== state.studio.id) return state;
  if (engine.status !== "internal_only") {
    return appendLog(state, {
      category: "engine",
      headline: `${engine.name} cannot be publicly released from status '${engine.status}'`,
      severity: "warning",
    });
  }
  const cost = engine.publicReleaseCost ?? 0;
  if (state.studio.cash < cost) {
    return appendLog(state, {
      category: "engine",
      headline: `Cannot afford public release of ${engine.name} ($${Math.round(cost / 100).toLocaleString()})`,
      severity: "warning",
    });
  }

  const newTerms: LicenseTerms = {
    ...engine.licenseTerms,
    ...(licenseTerms ?? {}),
  };

  const updated: GameEngine = {
    ...engine,
    status: "public_release",
    licenseTerms: newTerms,
  };

  let next: GameState = {
    ...state,
    engines: { ...state.engines, [engineId]: updated },
    studio: { ...state.studio, cash: state.studio.cash - cost },
  };

  next = appendLog(next, {
    category: "engine",
    headline: `${engine.name} publicly released`,
    body: newTerms.openSource
      ? "Released as open source — no license fee, no royalty."
      : `Licensing: $${Math.round(newTerms.licenseFee / 100).toLocaleString()} + ${(newTerms.royaltyRate * 100).toFixed(1)}% royalty.`,
    severity: "success",
    relatedIds: { engineId },
  });

  return next;
}

// ============ UPDATE LICENSE TERMS ============
// Adjust terms on a player-owned public engine (e.g. drop fee, raise royalty).
export function updateEngineLicenseTerms(
  state: GameState,
  engineId: ID,
  terms: Partial<LicenseTerms>
): GameState {
  const engine = state.engines[engineId];
  if (!engine || engine.ownerStudioId !== state.studio.id) return state;
  if (engine.status !== "public_release") return state;

  const newTerms: LicenseTerms = { ...engine.licenseTerms, ...terms };
  return {
    ...state,
    engines: {
      ...state.engines,
      [engineId]: { ...engine, licenseTerms: newTerms },
    },
  };
}

// ============ DEPRECATE ENGINE ============
// Happens manually or automatically when a successor engine is built.
export function deprecateEngine(state: GameState, engineId: ID): GameState {
  const engine = state.engines[engineId];
  if (!engine || engine.ownerStudioId !== state.studio.id) return state;
  if (engine.status === "deprecated" || engine.status === "discontinued") return state;

  const year = isoToDate(state.currentDate).year;
  return {
    ...state,
    engines: {
      ...state.engines,
      [engineId]: { ...engine, status: "deprecated", deprecatedYear: year },
    },
  };
}

// ============ DAILY ENGINE MAINTENANCE TICK ============
// Engines' currentness drifts down over time; maintenance slows the decay.
// Called from master tick (light work — only runs once/month).
export function tickEngineCurrentness(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  // Run only on month start
  if (today.day !== 1) return state;

  let next = state;
  const updates: Record<ID, GameEngine> = {};

  for (const eng of Object.values(state.engines)) {
    // Only tick engines that are actively in use
    if (eng.status === "discontinued") continue;

    // Base decay = 1 point/month for internal_only, 0.7 for public, 2 for deprecated
    let decay = 1.0;
    if (eng.status === "public_release") decay = 0.7;
    else if (eng.status === "deprecated") decay = 2.5;

    // Third-party engines age naturally too
    if (eng.origin === "third_party") {
      decay = 1.2;
    }

    const newCurrentness = Math.max(0, eng.currentness - decay);
    if (newCurrentness !== eng.currentness) {
      updates[eng.id] = { ...eng, currentness: newCurrentness };
    }
  }

  if (Object.keys(updates).length > 0) {
    next = { ...next, engines: { ...next.engines, ...updates } };
  }
  return next;
}
