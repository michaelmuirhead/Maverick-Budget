// DLC & Live-service system.
//
// Core flow:
//  1. Player selects a released game still in its live window
//     (within 12 months of release, or with live-service flag)
//  2. Calls createDlc({kind, staff, budget}) — starts a short dev cycle
//  3. tickDlcDevelopment runs daily, accumulating progress
//  4. When complete, releaseDlc fires — extends parent sale curve and/or
//     creates its own revenue stream
//
// Live service: once enabled on a project, a monthly subscription revenue
// flows to the studio based on active players, which declines without
// fresh content cycles.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { DLC, DLCKind, DLCPlan, LiveServiceState } from "../types/dlc";
import type { Staff } from "../types/staff";
import type { Project } from "../types/project";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, isoToDate, dateToIso } from "../core/time";
import { rngFloat, rngChance } from "../core/rng";
import { applyRepHit } from "./reputation";
import { dlcKindAvailableInYear, dlcKindLabel, dlcKindRequiredTechId } from "../types/dlc";

// ============ DLC UNLOCK CHECK ============
// Combines the year gate and the R&D gate. A DLC kind is available iff:
//   - the calendar year has reached its emergedYear, AND
//   - the studio has completed the required tech node (if any).
// Used by both the concept-declare UI and the post-launch create-DLC UI.
export function isDlcKindUnlocked(state: GameState, kind: DLCKind): boolean {
  const year = isoToDate(state.currentDate).year;
  if (!dlcKindAvailableInYear(kind, year)) return false;
  const required = dlcKindRequiredTechId(kind);
  if (required && !state.studio.completedTechIds.includes(required)) return false;
  return true;
}

// Human-readable reason string for why a DLC kind is locked. Null if unlocked.
export function dlcKindLockedReason(state: GameState, kind: DLCKind): string | null {
  const year = isoToDate(state.currentDate).year;
  if (!dlcKindAvailableInYear(kind, year)) {
    // Year gate not yet met.
    const gate =
      kind === "content_pack"     ? 1988 :
      kind === "expansion"        ? 1994 :
      kind === "cosmetic"         ? 2003 :
      kind === "season_pass"      ? 2011 :
      kind === "mmo_live_content" ? 2000 :
      null;
    return gate ? `${dlcKindLabel(kind)} is not yet viable in ${year} (era unlocks ${gate}).` : null;
  }
  const required = dlcKindRequiredTechId(kind);
  if (required && !state.studio.completedTechIds.includes(required)) {
    return `Research ${required.replace("mon_", "").replace(/_/g, " ")} to unlock ${dlcKindLabel(kind)}.`;
  }
  return null;
}

// Hard cap on simultaneous active live services per studio (MGT MMO rules).
export const LIVE_SERVICE_SLOT_CAP = 3;

// Helper — count currently-enabled live services on the studio.
export function countActiveLiveServices(state: GameState): number {
  let n = 0;
  for (const live of Object.values(state.liveServices)) {
    if (live.enabled) n++;
  }
  return n;
}

// Development time + cost by DLC kind
const DLC_PROFILES: Record<DLCKind, { days: number; budgetFraction: number; priceFraction: number }> = {
  expansion:        { days: 180, budgetFraction: 0.35, priceFraction: 0.50 }, // ~6 months, 35% of parent budget, half price
  content_pack:     { days: 60,  budgetFraction: 0.12, priceFraction: 0.15 }, // ~2 months, tiny price
  cosmetic:         { days: 21,  budgetFraction: 0.03, priceFraction: 0.08 }, // weeks — skins/tracks/ornamental
  season_pass:      { days: 45,  budgetFraction: 0.10, priceFraction: 0.25 }, // bundle of planned seasonal content
  mmo_live_content: { days: 40,  budgetFraction: 0.08, priceFraction: 0.15 }, // live-service patch cadence
  patch_free:       { days: 30,  budgetFraction: 0.05, priceFraction: 0 },    // free, builds goodwill
};

// ============ CREATE DLC ============
export function createDlc(
  state: GameState,
  input: {
    name: string;
    parentProjectId: ID;
    kind: DLCKind;
    assignedStaffIds: ID[];
    fromPlanId?: ID;
  }
): { state: GameState; dlcId?: ID } {
  const parent = state.projects[input.parentProjectId];
  if (!parent) {
    return { state: appendLog(state, {
      category: "event",
      headline: "Cannot create DLC: parent project not found",
      severity: "warning",
    })};
  }
  if (parent.status !== "released") {
    return { state: appendLog(state, {
      category: "event",
      headline: `${parent.name} must be released first`,
      severity: "warning",
    })};
  }
  // Gate: released within 12 months OR has live service
  const hasLive = state.liveServices[parent.id]?.enabled;
  if (parent.actualReleaseDate) {
    const daysSince = daysBetweenIso(parent.actualReleaseDate, state.currentDate);
    if (daysSince > 365 && !hasLive) {
      return { state: appendLog(state, {
        category: "event",
        headline: `${parent.name} is past its live window`,
        body: "DLC can only be made for games within 12 months of release, or with live-service enabled.",
        severity: "warning",
      })};
    }
  }

  // R&D + year gate. Free patches are always allowed; everything else
  // (including MMO live-content) is checked against year + tech node.
  if (input.kind !== "patch_free") {
    if (!isDlcKindUnlocked(state, input.kind)) {
      const reason = dlcKindLockedReason(state, input.kind) ?? `${dlcKindLabel(input.kind)} is locked`;
      return { state: appendLog(state, {
        category: "event",
        headline: `Cannot build ${dlcKindLabel(input.kind)} DLC`,
        body: reason,
        severity: "warning",
        relatedIds: { projectId: parent.id },
      })};
    }
  }

  const profile = DLC_PROFILES[input.kind];
  const budget = Math.round(parent.budget.total * profile.budgetFraction);
  const price = Math.round(6000 * profile.priceFraction); // price in cents, baseline $60 game

  if (state.studio.cash < budget) {
    return { state: appendLog(state, {
      category: "event",
      headline: `Cannot afford DLC ($${Math.round(budget / 100).toLocaleString()})`,
      severity: "warning",
    })};
  }
  if (input.assignedStaffIds.length === 0 && input.kind !== "patch_free") {
    return { state: appendLog(state, {
      category: "event",
      headline: "DLC needs at least one staff member assigned",
      severity: "warning",
    })};
  }

  let rng = state.rng;
  const [dlcId, r1] = generateId("dlc", rng);
  rng = r1;

  const startDate = state.currentDate;
  const estimatedReleaseDate = dateToIso(
    addDays(isoToDate(startDate), profile.days)
  );

  const dlc: DLC = {
    id: dlcId,
    name: input.name,
    parentProjectId: parent.id,
    parentIpId: parent.ipId,
    kind: input.kind,
    status: "in_development",
    fromPlanId: input.fromPlanId,
    startDate,
    estimatedReleaseDate,
    assignedStaffIds: input.assignedStaffIds,
    totalWorkDays: profile.days,
    workDaysCompleted: 0,
    budget,
    spent: 0,
    priceTag: price,
    qualityScore: 0,
  };

  // Assign staff to this DLC
  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of input.assignedStaffIds) {
    const s = state.staff[sid];
    if (!s) continue;
    staffUpdates[sid] = { ...s, currentProjectId: dlcId };
  }

  // If this DLC was born from a concept-time plan, flip the plan status and
  // link it. Keeps the plan row visible on the parent project so UI can show
  // "shipped / in dev / cancelled" status across the declared road-map.
  let updatedProjects = state.projects;
  if (input.fromPlanId) {
    const plan = (parent.dlcPlans ?? []).find((p) => p.id === input.fromPlanId);
    if (plan) {
      const newPlans = (parent.dlcPlans ?? []).map((p) =>
        p.id === input.fromPlanId
          ? { ...p, status: "in_development" as const, linkedDlcId: dlcId }
          : p
      );
      updatedProjects = {
        ...state.projects,
        [parent.id]: { ...parent, dlcPlans: newPlans },
      };
    }
  }

  let next: GameState = {
    ...state,
    rng,
    dlcs: { ...state.dlcs, [dlcId]: dlc },
    projects: updatedProjects,
    staff: { ...state.staff, ...staffUpdates },
    studio: { ...state.studio, cash: state.studio.cash - budget },
  };

  next = appendLog(next, {
    category: "project",
    headline: `DLC development started: ${input.name}`,
    body: `${input.kind.replace("_", " ")} for ${parent.name}. Target release: ${estimatedReleaseDate}.`,
    severity: "success",
    relatedIds: { dlcId, projectId: parent.id },
  });

  return { state: next, dlcId };
}

// ============ DAILY DEVELOPMENT TICK ============
export function tickDlcDevelopment(state: GameState): GameState {
  let next = state;
  const updates: Record<ID, DLC> = {};

  for (const dlc of Object.values(state.dlcs)) {
    if (dlc.status !== "in_development") continue;

    // Count available staff (employed, not burned out)
    const workingStaff = dlc.assignedStaffIds
      .map((id) => state.staff[id])
      .filter((s): s is Staff => !!s && s.status === "employed");

    if (workingStaff.length === 0 && dlc.kind !== "patch_free") continue;

    // Daily progress — each staff contributes based on morale/energy
    let dailyProgress = 0;
    for (const s of workingStaff) {
      const fitness = (s.morale + s.energy) / 200; // 0-1
      dailyProgress += fitness;
    }
    // free patches slowly auto-progress even without staff
    if (dlc.kind === "patch_free" && workingStaff.length === 0) dailyProgress = 0.3;

    const newWorkDone = Math.min(dlc.totalWorkDays, dlc.workDaysCompleted + dailyProgress);
    const update: DLC = {
      ...dlc,
      workDaysCompleted: newWorkDone,
    };

    // Auto-release when complete
    if (newWorkDone >= dlc.totalWorkDays) {
      updates[dlc.id] = update;
      next = releaseDlcInternal(next, dlc.id);
    } else {
      updates[dlc.id] = update;
    }
  }

  if (Object.keys(updates).length > 0) {
    // Merge updates (note: internal release may have already updated the dlcs map)
    const merged: Record<ID, DLC> = { ...next.dlcs };
    for (const [id, dlc] of Object.entries(updates)) {
      if (merged[id]?.status === "released") continue; // don't overwrite releases
      merged[id] = dlc;
    }
    next = { ...next, dlcs: merged };
  }

  return next;
}

// ============ RELEASE ============
function releaseDlcInternal(state: GameState, dlcId: ID): GameState {
  const dlc = state.dlcs[dlcId];
  if (!dlc || dlc.status !== "in_development") return state;

  const parent = state.projects[dlc.parentProjectId];
  if (!parent) return state;

  let rng = state.rng;

  // Quality — blends parent metacritic with effort (work days, staff quality)
  const parentScore = parent.metacriticScore ?? 60;
  const staffQualitySum = dlc.assignedStaffIds
    .map((id) => state.staff[id])
    .filter((s): s is Staff => !!s)
    .reduce((sum, s) => sum + (s.stats.design + s.stats.tech + s.stats.art) / 3, 0);
  const avgStaffQuality = dlc.assignedStaffIds.length > 0
    ? staffQualitySum / dlc.assignedStaffIds.length
    : 30;
  const effortRatio = dlc.workDaysCompleted / dlc.totalWorkDays;
  const qualityScore = Math.round(
    parentScore * 0.5 + avgStaffQuality * 0.3 + effortRatio * 20
  );

  // Adoption rate — what fraction of parent-game owners buy the DLC
  // Based on kind + parent fan affinity
  const parentIp = parent.ipId ? state.ips[parent.ipId] : undefined;
  const fanBonus = parentIp ? parentIp.fanAffinity / 200 : 0;
  let adoptionRate: number;
  switch (dlc.kind) {
    case "expansion":         adoptionRate = 0.25 + fanBonus; break;
    case "content_pack":      adoptionRate = 0.35 + fanBonus; break;
    case "cosmetic":          adoptionRate = 0.18 + fanBonus; break;
    case "season_pass":       adoptionRate = 0.15 + fanBonus; break;
    case "mmo_live_content":  adoptionRate = 0.40 + fanBonus; break;  // sticky audience
    case "patch_free":        adoptionRate = 0.80; break;              // free patches download rate
  }
  adoptionRate = Math.min(0.75, adoptionRate);

  // Estimate lifetime sales from parent's lifetime sales
  const parentSales = parent.lifetimeSales ?? 0;
  // Quality scales adoption
  const qualityMult = Math.max(0.5, Math.min(1.3, qualityScore / 70));
  const lifetimeSales = Math.round(parentSales * adoptionRate * qualityMult);
  const lifetimeRevenue = lifetimeSales * dlc.priceTag;

  const updatedDlc: DLC = {
    ...dlc,
    status: "released",
    actualReleaseDate: state.currentDate,
    qualityScore,
    adoptionRate,
    lifetimeSales,
    lifetimeRevenue,
  };

  // Payment — for priced DLC, pay out immediately as a lump (simplification)
  // For free patches, just goodwill.
  // If this DLC materialized from a plan, mark that plan as released.
  let updatedProjectsMap = state.projects;
  if (dlc.fromPlanId) {
    const proj = state.projects[dlc.parentProjectId];
    if (proj) {
      const newPlans = (proj.dlcPlans ?? []).map((p) =>
        p.id === dlc.fromPlanId
          ? { ...p, status: "released" as const, linkedDlcId: dlc.id }
          : p
      );
      updatedProjectsMap = {
        ...state.projects,
        [proj.id]: { ...proj, dlcPlans: newPlans },
      };
    }
  }

  let next: GameState = {
    ...state,
    rng,
    dlcs: { ...state.dlcs, [dlc.id]: updatedDlc },
    projects: updatedProjectsMap,
  };

  if (lifetimeRevenue > 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + lifetimeRevenue,
        lifetimeRevenue: next.studio.lifetimeRevenue + lifetimeRevenue,
      },
    };
  }

  // Free staff from this DLC
  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of dlc.assignedStaffIds) {
    const s = next.staff[sid];
    if (s && s.currentProjectId === dlc.id) {
      staffUpdates[sid] = { ...s, currentProjectId: null };
    }
  }
  if (Object.keys(staffUpdates).length > 0) {
    next = { ...next, staff: { ...next.staff, ...staffUpdates } };
  }

  // Extend parent's IP fan affinity slightly on good DLC
  if (parent.ipId && qualityScore >= 70) {
    const ip = next.ips[parent.ipId];
    if (ip) {
      next = {
        ...next,
        ips: {
          ...next.ips,
          [parent.ipId]: {
            ...ip,
            fanAffinity: Math.min(100, ip.fanAffinity + 3),
            lifetimeRevenue: ip.lifetimeRevenue + lifetimeRevenue,
          },
        },
      };
    }
  }

  // Live service — if this was a season pass or content pack and parent has
  // live service, bump the content cycle count
  const live = next.liveServices[parent.id];
  if (live?.enabled && (dlc.kind === "season_pass" || dlc.kind === "content_pack" || dlc.kind === "mmo_live_content")) {
    next = {
      ...next,
      liveServices: {
        ...next.liveServices,
        [parent.id]: {
          ...live,
          contentCycleCount: live.contentCycleCount + 1,
          lastContentDate: state.currentDate,
          // Fresh content revitalizes the player base
          activePlayers: Math.round(live.activePlayers * 1.15),
        },
      },
    };
  }

  next = appendLog(next, {
    category: "release",
    headline: `${dlc.name} released (DLC for ${parent.name})`,
    body: lifetimeRevenue > 0
      ? `Quality ${qualityScore}. Sold ${lifetimeSales.toLocaleString()} units, $${Math.round(lifetimeRevenue / 100).toLocaleString()}.`
      : `Free patch. Goodwill built.`,
    severity: qualityScore >= 70 ? "success" : "info",
    relatedIds: { dlcId: dlc.id, projectId: parent.id },
  });

  return next;
}

// ============ ENABLE LIVE SERVICE ============
// Convert a released game into a live service — enables continuous content
// and monthly subscription revenue.
export function enableLiveService(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  if (project.status !== "released") {
    return appendLog(state, {
      category: "event",
      headline: `${project.name} must be released to enable live service`,
      severity: "warning",
    });
  }
  if (state.liveServices[projectId]?.enabled) {
    return appendLog(state, {
      category: "event",
      headline: `${project.name} already has live service`,
      severity: "warning",
    });
  }
  // Hard cap — studios may run no more than LIVE_SERVICE_SLOT_CAP simultaneous
  // live games. Sunset (or let auto-sunset retire) something to free a slot.
  if (countActiveLiveServices(state) >= LIVE_SERVICE_SLOT_CAP) {
    return appendLog(state, {
      category: "event",
      headline: `Live-service cap reached (${LIVE_SERVICE_SLOT_CAP}/${LIVE_SERVICE_SLOT_CAP})`,
      body: "Sunset an existing live game before enabling another. The studio can't credibly support more than three at once.",
      severity: "warning",
      relatedIds: { projectId },
    });
  }

  // Seed player count based on parent's lifetime sales + recent release bonus
  const baseSales = project.lifetimeSales ?? 50000;
  const activePlayers = Math.max(1000, Math.round(baseSales * 0.2));

  // Monthly sub rev — $5/month avg * active * 0.2 (not all pay)
  const monthlySubRev = Math.round(activePlayers * 500 * 0.2);

  const live: LiveServiceState = {
    projectId,
    enabled: true,
    startDate: state.currentDate,
    activePlayers,
    monthlySubscriptionRevenue: monthlySubRev,
    contentCycleCount: 0,
    lastContentDate: state.currentDate,
  };

  let next: GameState = {
    ...state,
    liveServices: { ...state.liveServices, [projectId]: live },
  };

  next = appendLog(next, {
    category: "release",
    headline: `${project.name} is now a live service`,
    body: `${activePlayers.toLocaleString()} active players at launch. $${Math.round(monthlySubRev / 100).toLocaleString()}/month projected.`,
    severity: "success",
    relatedIds: { projectId },
  });

  return next;
}

// ============ MONTHLY LIVE SERVICE TICK ============
// Collects subscription revenue; player count decays without fresh content.
export function tickLiveServicesMonthly(state: GameState): GameState {
  let next = state;
  let totalMonthlyRevenue = 0;
  const updates: Record<ID, LiveServiceState> = {};

  for (const live of Object.values(state.liveServices)) {
    if (!live.enabled) continue;
    if (live.sunsetDate && live.sunsetDate <= state.currentDate) continue;

    const daysSinceContent = daysBetweenIso(live.lastContentDate, state.currentDate);
    // Player decay — 5% per month without fresh content, 2% with recent
    const hasFreshContent = daysSinceContent < 90;
    const decayRate = hasFreshContent ? 0.02 : 0.07;
    const newActivePlayers = Math.max(0, Math.round(live.activePlayers * (1 - decayRate)));

    // Revenue = players * base ARPU
    const monthlyRev = Math.round(newActivePlayers * 500 * 0.2);
    totalMonthlyRevenue += monthlyRev;

    // Auto-sunset when active players fall below 500
    const shouldSunset = newActivePlayers < 500;

    updates[live.projectId] = {
      ...live,
      activePlayers: newActivePlayers,
      monthlySubscriptionRevenue: monthlyRev,
      enabled: !shouldSunset,
      sunsetDate: shouldSunset ? state.currentDate : live.sunsetDate,
    };

    if (shouldSunset) {
      const project = next.projects[live.projectId];
      next = appendLog(next, {
        category: "release",
        headline: `Live service sunset: ${project?.name ?? "project"}`,
        body: `Active player count dropped below viable threshold.`,
        severity: "warning",
      });
      // Reputation scar — bigger games leave bigger scars when they fail.
      // Penalty scales with how successful the live service originally was.
      const peakPlayers = Math.max(live.activePlayers, 1000);
      const penalty = Math.min(15, Math.max(2, Math.round(Math.log10(peakPlayers) * 1.5)));
      next = applyRepHit(next, {
        source: `Sunset failure: ${project?.name ?? "project"}`,
        totalPenalty: penalty,
        relatedProjectId: live.projectId,
      });
    }
  }

  if (totalMonthlyRevenue > 0) {
    next = {
      ...next,
      liveServices: { ...next.liveServices, ...updates },
      studio: {
        ...next.studio,
        cash: next.studio.cash + totalMonthlyRevenue,
        lifetimeRevenue: next.studio.lifetimeRevenue + totalMonthlyRevenue,
      },
    };
    const activeCount = Object.values(updates).filter((l) => l.enabled).length;
    if (activeCount > 0) {
      next = appendLog(next, {
        category: "finance",
        headline: `Live-service subscription revenue: $${Math.round(totalMonthlyRevenue / 100).toLocaleString()}`,
        body: `From ${activeCount} active live service${activeCount > 1 ? "s" : ""}.`,
        severity: "success",
      });
    }
  } else if (Object.keys(updates).length > 0) {
    next = { ...next, liveServices: { ...next.liveServices, ...updates } };
  }

  return next;
}

// ============ DLC PLAN MUTATORS ============
// Add a new DLC plan to a project that has already shipped (post-launch
// declaration). Plans added here are flagged plannedAtConcept = false, which
// loses the season-pass slot per MGT DLC rule §1. UI should hide season-pass
// when adding post-launch.
export function addDlcPlanToProject(
  state: GameState,
  input: { projectId: ID; kind: DLCKind; name?: string }
): GameState {
  const project = state.projects[input.projectId];
  if (!project) return state;

  const isAtConcept = project.status === "concept";
  // Season passes can only be declared at concept.
  if (input.kind === "season_pass" && !isAtConcept) {
    return appendLog(state, {
      category: "event",
      headline: "Season pass must be declared at concept",
      body: "Add it during the New Project flow — post-launch declaration loses the season-pass slot.",
      severity: "warning",
      relatedIds: { projectId: project.id },
    });
  }
  // R&D + year gate (skip only for always-free patches; MMO live-content now
  // requires the mon_mmo_live_service tech node + year 2000).
  if (input.kind !== "patch_free") {
    if (!isDlcKindUnlocked(state, input.kind)) {
      const reason = dlcKindLockedReason(state, input.kind) ?? `${dlcKindLabel(input.kind)} is locked`;
      return appendLog(state, {
        category: "event",
        headline: `Cannot declare ${dlcKindLabel(input.kind)} plan`,
        body: reason,
        severity: "warning",
        relatedIds: { projectId: project.id },
      });
    }
  }

  let rng = state.rng;
  const [planId, r1] = generateId("dlcplan", rng);
  rng = r1;

  const plan: DLCPlan = {
    id: planId,
    kind: input.kind,
    name: input.name,
    plannedAtConcept: isAtConcept,
    status: "planned",
  };

  return {
    ...state,
    rng,
    projects: {
      ...state.projects,
      [project.id]: {
        ...project,
        dlcPlans: [...(project.dlcPlans ?? []), plan],
      },
    },
  };
}

// Remove a planned (not yet built) DLC plan from a project. No-op if the plan
// has already converted into a real DLC.
export function removeDlcPlan(
  state: GameState,
  input: { projectId: ID; planId: ID }
): GameState {
  const project = state.projects[input.projectId];
  if (!project) return state;
  const plan = (project.dlcPlans ?? []).find((p) => p.id === input.planId);
  if (!plan || plan.status !== "planned") return state;

  return {
    ...state,
    projects: {
      ...state.projects,
      [project.id]: {
        ...project,
        dlcPlans: (project.dlcPlans ?? []).filter((p) => p.id !== input.planId),
      },
    },
  };
}

// ============ HELPERS ============
function daysBetweenIso(from: string, to: string): number {
  const fd = new Date(from + "T00:00:00Z").getTime();
  const td = new Date(to + "T00:00:00Z").getTime();
  return Math.floor((td - fd) / (1000 * 60 * 60 * 24));
}
