// Post-launch bug system: hidden-bug surfacing, passive QA Lab fixes,
// player-triggered patch sprints, and the rolling user score that drags
// post-launch sales when a game shipped (or became) broken.
//
// Tick order (set in core/tick.ts):
//   tickPatchSprints(state)       — advance any active sprints, apply completion bursts
//   tickPostLaunchBugs(state)     — surface hidden bugs, apply passive fixes, recompute userScore
//   tickActiveSales(state)        — consumes the freshly-updated userScore as a sales-drag multiplier
//
// All functions are pure: state in → state out.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { Project, ActiveSale, PatchSprint } from "../types/project";
import type { Staff } from "../types/staff";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate, dateToIso, addDays } from "../core/time";
import { rngChance, rngFloat } from "../core/rng";

// ============ TUNING CONSTANTS ============

// At release, this fraction of leftover bugs ships hidden by default.
// Crunch (techDebt) raises it; QA Lab capacity reduces it.
export const BASE_HIDDEN_RATIO = 0.25;
export const TECH_DEBT_HIDDEN_BOOST_PER_DAY = 0.0015;   // +0.15% per crunch day
export const MAX_HIDDEN_RATIO = 0.85;
export const MIN_HIDDEN_RATIO = 0.05;
export const QA_LAB_HIDDEN_REDUCTION_PER_CAP = 0.012;   // -1.2% per QA Lab seat
export const MAX_QA_LAB_REDUCTION = 0.20;

// Threshold above which the project flips `launchedInBadState` and emits an event.
// Scales roughly with project ambition — a small game with 60 visible bugs is rough,
// a giant game with 60 visible bugs is mostly fine. We compare visibleBugs to a
// "size-aware" threshold = 25 + sqrt(totalDevDays) * 2.
export const BAD_STATE_THRESHOLD_BASE = 25;
export const BAD_STATE_THRESHOLD_PER_SQRT_DAY = 2;

// Post-launch surfacing: hidden bugs leak into visibleBugs at this rate per day.
// Decays exponentially over weeks since launch — most of the surfacing happens
// in the first month, mirroring the real-world "first 30 days are brutal" curve.
export const SURFACE_BASE_RATE_PER_DAY = 0.020;         // 2.0% of remaining hidden / day
export const SURFACE_DECAY_HALF_LIFE_WEEKS = 4;
export const TECH_DEBT_SURFACE_BOOST_PER_DAY = 0.0006;  // crunched games leak faster too

// Storm event: if more than this many bugs surface in a single 7-day window, fire `bug_storm`.
export const BUG_STORM_WINDOW_DAYS = 7;
export const BUG_STORM_THRESHOLD = 30;

// QA Lab capacity contribution to passive post-launch fix rate (bugs/day),
// split across all currently-live games. A tier-1 lab (cap 2) can knock out
// ~0.6 bugs/day total when one game is live; a corporate lab (cap 8) ~2.4/day.
export const QA_LAB_PASSIVE_FIX_PER_CAP = 0.30;
// Floor: even with no QA Lab, a tiny ambient fix rate so unattended bugs aren't permanent.
export const AMBIENT_FIX_RATE_PER_DAY = 0.5;

// Patch sprint: per-staff fix rate per day during an active sprint.
// Higher than passive because the team is fully focused on the released project.
export const PATCH_SPRINT_FIX_PER_STAFF_DAY = 1.8;
// At sprint completion, apply a final burst proportional to days spent (the
// "release engineering" pass — bundling, regression sweep, comms).
export const PATCH_SPRINT_FINAL_BURST_PER_DAY = 0.6;
// Marketing spend on a patch boosts userScore recovery (forgiveness narrative).
export const PATCH_MARKETING_USER_SCORE_BUMP_PER_MILLION_CENTS = 0.4;

// User score decay/recovery curve.
// userScore is recomputed each tick from current visibleBugs and the project's
// metacritic baseline. Many visible bugs depress it; clean games stay near MC.
export const USER_SCORE_BUG_PENALTY_LOG_BASE = 6;       // each 10x in bugs ≈ -8 user-score points
export const USER_SCORE_BUG_PENALTY_SLOPE = 8;
export const USER_SCORE_FLOOR = 5;

// Sales drag multiplier from userScore vs metacritic.
// score parity (user==MC) → 1.0× sales. Big gap below MC → drag down to ~0.45×.
// Big gap above MC (e.g. No Man's Sky redemption arc) → up to 1.20×.
export const SALES_DRAG_FROM_GAP_SLOPE = 0.018;
export const MAX_SALES_DRAG_DOWN = 0.55;                // i.e. multiplier floor 0.45
export const MAX_SALES_DRAG_UP = 0.20;                  // i.e. multiplier ceiling 1.20

// ============ HELPERS ============

function qaLabCapacity(state: GameState): number {
  let cap = 0;
  for (const room of state.office.rooms) {
    if (room.kind === "qa_lab") cap += room.capacity;
  }
  return cap;
}

function liveGameCount(state: GameState): number {
  let n = 0;
  for (const sale of Object.values(state.activeSales)) {
    if (sale.active) n++;
  }
  return n;
}

function badStateThreshold(project: Project): number {
  const totalDevDays = project.phases.reduce((s, p) => s + p.daysAllocated, 0);
  return BAD_STATE_THRESHOLD_BASE + Math.sqrt(Math.max(1, totalDevDays)) * BAD_STATE_THRESHOLD_PER_SQRT_DAY;
}

// ============ AT-RELEASE: SPLIT BUGS INTO VISIBLE / HIDDEN ============

// Called from release.ts at launch time. Returns the split + the threshold
// flag so release.ts can emit the right event.
export interface ReleaseBugSplit {
  visibleBugs: number;
  hiddenBugs: number;
  hiddenRatio: number;        // for logging / debugging
  launchedInBadState: boolean;
}

export function splitBugsAtRelease(state: GameState, project: Project): ReleaseBugSplit {
  const total = Math.max(0, project.totalBugs);
  if (total === 0) {
    return { visibleBugs: 0, hiddenBugs: 0, hiddenRatio: BASE_HIDDEN_RATIO, launchedInBadState: false };
  }

  const techDebtBoost = Math.min(0.40, project.techDebt * TECH_DEBT_HIDDEN_BOOST_PER_DAY);
  const qaCapacity = qaLabCapacity(state);
  const qaReduction = Math.min(MAX_QA_LAB_REDUCTION, qaCapacity * QA_LAB_HIDDEN_REDUCTION_PER_CAP);

  let hiddenRatio = BASE_HIDDEN_RATIO + techDebtBoost - qaReduction;
  hiddenRatio = Math.max(MIN_HIDDEN_RATIO, Math.min(MAX_HIDDEN_RATIO, hiddenRatio));

  const hiddenBugs = Math.round(total * hiddenRatio);
  const visibleBugs = total - hiddenBugs;

  const launchedInBadState = visibleBugs >= badStateThreshold(project);

  return { visibleBugs, hiddenBugs, hiddenRatio, launchedInBadState };
}

// ============ USER SCORE ============

// Compute userScore from current visibleBugs against the project's metacritic baseline.
// More bugs → larger penalty. Metacritic is the ceiling unless the player puts in
// post-launch work (e.g. heavy patch sprint) — in which case userScore can climb above MC.
export function computeUserScore(project: Project, postLaunchPolishBoost: number = 0): number {
  if (project.metacriticScore == null) return USER_SCORE_FLOOR;
  const mc = project.metacriticScore;

  let penalty = 0;
  if (project.visibleBugs > USER_SCORE_BUG_PENALTY_LOG_BASE) {
    penalty = Math.log(project.visibleBugs / USER_SCORE_BUG_PENALTY_LOG_BASE) / Math.log(2) * USER_SCORE_BUG_PENALTY_SLOPE;
  }

  const raw = mc - penalty + postLaunchPolishBoost;
  return Math.max(USER_SCORE_FLOOR, Math.min(100, Math.round(raw)));
}

// Sales-drag multiplier: consumed by tickActiveSales. Computed from current
// userScore vs metacritic. Always in [1 - MAX_SALES_DRAG_DOWN, 1 + MAX_SALES_DRAG_UP].
export function salesDragMultiplier(project: Project): number {
  if (project.metacriticScore == null || project.userScore == null) return 1;
  const gap = project.userScore - project.metacriticScore;
  let mult = 1 + gap * SALES_DRAG_FROM_GAP_SLOPE;
  mult = Math.max(1 - MAX_SALES_DRAG_DOWN, Math.min(1 + MAX_SALES_DRAG_UP, mult));
  return mult;
}

// ============ DAILY POST-LAUNCH BUG TICK ============

// Surface hidden bugs and apply passive QA-Lab fixes for every released project
// that still has an active sale. Recomputes userScore from the updated visibleBugs.
// Emits threshold/storm events.
export function tickPostLaunchBugs(state: GameState): GameState {
  if (Object.keys(state.activeSales).length === 0) return state;

  const qaCapacity = qaLabCapacity(state);
  const liveCount = Math.max(1, liveGameCount(state));
  const qaPassivePerGamePerDay = (qaCapacity * QA_LAB_PASSIVE_FIX_PER_CAP) / liveCount;

  let next = state;
  let rng = state.rng;
  const projectUpdates: Record<ID, Project> = {};

  for (const sale of Object.values(state.activeSales)) {
    if (!sale.active) continue;
    const project = next.projects[sale.projectId];
    if (!project) continue;

    // ---- 1. Hidden → visible surfacing ----
    const weeksSinceLaunch = sale.daysOnSale / 7;
    const decayFactor = Math.pow(0.5, weeksSinceLaunch / SURFACE_DECAY_HALF_LIFE_WEEKS);
    const techDebtSurfaceBoost = project.techDebt * TECH_DEBT_SURFACE_BOOST_PER_DAY;
    const surfaceRate = (SURFACE_BASE_RATE_PER_DAY + techDebtSurfaceBoost) * decayFactor;

    let surfacedToday = 0;
    if (project.hiddenBugs > 0) {
      surfacedToday = Math.round(project.hiddenBugs * surfaceRate);
      // Always at least a trickle if there are hidden bugs left and we're in the first quarter
      if (surfacedToday === 0 && project.hiddenBugs > 0 && weeksSinceLaunch < 12) {
        const [chance, r2] = rngChance(rng, Math.min(0.5, surfaceRate * 5));
        rng = r2;
        if (chance) surfacedToday = 1;
      }
    }

    // ---- 2. Passive fix from QA Lab + ambient ----
    const passiveFixCapacity = qaPassivePerGamePerDay + AMBIENT_FIX_RATE_PER_DAY;
    let passiveFixedToday = Math.min(project.visibleBugs + surfacedToday, Math.round(passiveFixCapacity));
    if (passiveFixedToday < 0) passiveFixedToday = 0;

    // ---- 3. Apply ----
    const newVisible = Math.max(0, project.visibleBugs + surfacedToday - passiveFixedToday);
    const newHidden = Math.max(0, project.hiddenBugs - surfacedToday);
    const newTotal = newVisible + newHidden;

    let updated: Project = {
      ...project,
      visibleBugs: newVisible,
      hiddenBugs: newHidden,
      totalBugs: newTotal,
      surfacedBugsToDate: project.surfacedBugsToDate + surfacedToday,
      bugsFixedPostLaunch: project.bugsFixedPostLaunch + passiveFixedToday,
    };

    // ---- 4. Recompute userScore ----
    updated.userScore = computeUserScore(updated);

    projectUpdates[project.id] = updated;

    // ---- 5. Events ----
    // 5a. Bug storm — too many surfacing in a short window
    if (surfacedToday >= BUG_STORM_THRESHOLD) {
      next = appendLog(next, {
        category: "release",
        headline: `${project.name} bug storm — ${surfacedToday} new issues reported today`,
        body: "Players are surfacing serious problems. Consider a patch sprint.",
        severity: "danger",
        relatedIds: { projectId: project.id },
      });
    }

    // 5b. User-score crash — prior score vs new score
    const prior = project.userScore ?? project.metacriticScore ?? 0;
    if (prior - (updated.userScore ?? prior) >= 8) {
      next = appendLog(next, {
        category: "release",
        headline: `${project.name} user score dropped to ${updated.userScore}`,
        body: `Down from ${prior} as bugs pile up.`,
        severity: "warning",
        relatedIds: { projectId: project.id },
      });
    }
  }

  next = {
    ...next,
    rng,
    projects: { ...next.projects, ...projectUpdates },
  };

  return next;
}

// ============ PATCH SPRINTS ============

export interface StartPatchSprintInput {
  projectId: ID;
  name: string;
  plannedDays: number;          // typical: 14-90
  assignedStaffIds: ID[];       // staff to pull onto this sprint
  marketingSpend?: Money;       // optional comms spend
}

export function startPatchSprint(state: GameState, input: StartPatchSprintInput): {
  state: GameState;
  sprintId: ID;
} | { state: GameState; error: string } {
  const project = state.projects[input.projectId];
  if (!project) return { state, error: "Unknown project" };
  if (project.status !== "released") return { state, error: "Project not released" };
  if (input.plannedDays < 3) return { state, error: "Sprint must be at least 3 days" };
  if (input.assignedStaffIds.length === 0) return { state, error: "No staff assigned" };

  // Block if any other patch sprint already active for this project
  for (const s of Object.values(state.patchSprints)) {
    if (s.projectId === input.projectId && s.status === "active") {
      return { state, error: "Another patch sprint is already active for this project" };
    }
  }

  // Validate staff
  const validStaff: Staff[] = [];
  for (const sid of input.assignedStaffIds) {
    const s = state.staff[sid];
    if (s && s.status === "employed") validStaff.push(s);
  }
  if (validStaff.length === 0) return { state, error: "No valid staff" };

  let rng = state.rng;
  const [sid, r1] = generateId("patch", rng);
  rng = r1;

  const sprint: PatchSprint = {
    id: sid,
    projectId: input.projectId,
    name: input.name,
    status: "active",
    startDate: state.currentDate,
    plannedDays: input.plannedDays,
    daysSpent: 0,
    assignedStaffIds: validStaff.map((s) => s.id),
    marketingSpend: input.marketingSpend ?? 0,
    bugsFixedSoFar: 0,
    finalBurstApplied: false,
  };

  // Pull staff onto this project
  const staffUpdates: Record<ID, Staff> = {};
  for (const s of validStaff) {
    staffUpdates[s.id] = { ...s, currentProjectId: input.projectId };
  }

  // Charge marketing spend immediately (if any)
  const cash = state.studio.cash - (input.marketingSpend ?? 0);

  let next: GameState = {
    ...state,
    rng,
    studio: { ...state.studio, cash },
    staff: { ...state.staff, ...staffUpdates },
    patchSprints: { ...state.patchSprints, [sid]: sprint },
  };

  next = appendLog(next, {
    category: "release",
    headline: `Patch sprint started: ${input.name} (${project.name})`,
    body: `${validStaff.length} staff committed for ${input.plannedDays} days.`,
    severity: "info",
    relatedIds: { projectId: input.projectId },
  });

  return { state: next, sprintId: sid };
}

export function cancelPatchSprint(state: GameState, sprintId: ID): GameState {
  const sprint = state.patchSprints[sprintId];
  if (!sprint || sprint.status !== "active") return state;

  // Release staff
  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of sprint.assignedStaffIds) {
    const s = state.staff[sid];
    if (s && s.currentProjectId === sprint.projectId) {
      staffUpdates[sid] = { ...s, currentProjectId: null };
    }
  }

  const cancelled: PatchSprint = {
    ...sprint,
    status: "cancelled",
    endDate: state.currentDate,
  };
  let next: GameState = {
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    patchSprints: { ...state.patchSprints, [sprintId]: cancelled },
  };
  next = appendLog(next, {
    category: "release",
    headline: `Patch sprint cancelled: ${sprint.name}`,
    severity: "warning",
    relatedIds: { projectId: sprint.projectId },
  });
  return next;
}

// Advance every active patch sprint by one day. Apply daily fix output and,
// when the sprint completes, apply the final burst, optional marketing bump,
// release staff, and emit `patch_released`.
export function tickPatchSprints(state: GameState): GameState {
  if (Object.keys(state.patchSprints).length === 0) return state;

  let next = state;
  const sprintUpdates: Record<ID, PatchSprint> = {};
  const projectUpdates: Record<ID, Project> = {};
  const staffUpdates: Record<ID, Staff> = {};

  for (const sprint of Object.values(state.patchSprints)) {
    if (sprint.status !== "active") continue;
    const project = (projectUpdates[sprint.projectId] ?? next.projects[sprint.projectId]) as Project | undefined;
    if (!project) continue;

    const assigned = sprint.assignedStaffIds
      .map((sid) => next.staff[sid])
      .filter((s): s is Staff => !!s && s.status === "employed");

    // Daily fix output — scale by avg polish skill (tech + design) / 2 vs 50
    let avgPolish = 0;
    if (assigned.length > 0) {
      const sum = assigned.reduce((s, st) => s + (st.stats.tech + st.stats.design) / 2, 0);
      avgPolish = sum / assigned.length;
    }
    const polishMult = 0.6 + avgPolish / 100;       // 0.6× at zero skill, 1.6× at full
    const dailyFix = assigned.length * PATCH_SPRINT_FIX_PER_STAFF_DAY * polishMult;

    const fixesToday = Math.min(project.visibleBugs, Math.round(dailyFix));

    let updatedProject: Project = {
      ...project,
      visibleBugs: Math.max(0, project.visibleBugs - fixesToday),
      bugsFixedPostLaunch: project.bugsFixedPostLaunch + fixesToday,
    };
    updatedProject.totalBugs = updatedProject.visibleBugs + updatedProject.hiddenBugs;
    updatedProject.userScore = computeUserScore(updatedProject);

    const updatedSprint: PatchSprint = {
      ...sprint,
      daysSpent: sprint.daysSpent + 1,
      bugsFixedSoFar: sprint.bugsFixedSoFar + fixesToday,
    };

    // ---- Completion ----
    if (updatedSprint.daysSpent >= sprint.plannedDays && !updatedSprint.finalBurstApplied) {
      // Final burst
      const burstSize = Math.min(
        updatedProject.visibleBugs,
        Math.round(sprint.plannedDays * assigned.length * PATCH_SPRINT_FINAL_BURST_PER_DAY * polishMult)
      );
      updatedProject = {
        ...updatedProject,
        visibleBugs: Math.max(0, updatedProject.visibleBugs - burstSize),
        bugsFixedPostLaunch: updatedProject.bugsFixedPostLaunch + burstSize,
      };
      updatedProject.totalBugs = updatedProject.visibleBugs + updatedProject.hiddenBugs;

      // Marketing-driven user-score bump (forgiveness narrative)
      const marketingBumpUSD = sprint.marketingSpend / 1_000_000;  // cents → millions of cents
      const userScoreBump = marketingBumpUSD * PATCH_MARKETING_USER_SCORE_BUMP_PER_MILLION_CENTS;
      updatedProject.userScore = computeUserScore(updatedProject, userScoreBump);

      updatedSprint.status = "completed";
      updatedSprint.endDate = state.currentDate;
      updatedSprint.finalBurstApplied = true;
      updatedSprint.bugsFixedSoFar += burstSize;

      // Release staff
      for (const s of assigned) {
        if (s.currentProjectId === sprint.projectId) {
          staffUpdates[s.id] = { ...s, currentProjectId: null };
        }
      }

      next = appendLog(next, {
        category: "release",
        headline: `Patch released: ${sprint.name} (${updatedProject.name})`,
        body: `${updatedSprint.bugsFixedSoFar} bugs fixed. User score now ${updatedProject.userScore}.`,
        severity: "success",
        relatedIds: { projectId: sprint.projectId },
      });
    }

    sprintUpdates[sprint.id] = updatedSprint;
    projectUpdates[sprint.projectId] = updatedProject;
  }

  next = {
    ...next,
    staff: { ...next.staff, ...staffUpdates },
    projects: { ...next.projects, ...projectUpdates },
    patchSprints: { ...next.patchSprints, ...sprintUpdates },
  };

  return next;
}
