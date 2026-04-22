// Development system: the core loop of making a game.
// Exposes pure functions that take state + inputs and return new state.
//
// Responsibilities:
// - Create a new Project from a GDD (genre, theme, platforms, engine, staff)
// - Run per-tick progression: phase work, design/tech point accumulation, bug modeling
// - Handle crunch toggling with morale/energy cost
// - Auto-transition between phases when current phase reaches 100%
// - Emit log entries for milestones

import type { GameState } from "../core/state";
import type { ID, Money, TargetAudience, QualityAxis, DevPhaseId } from "../types/core";
import type {
  Project, PhaseProgress, PhaseFocusSliders, ProjectBudget,
} from "../types/project";
import type { DLCPlan, DLCKind } from "../types/dlc";
import type { Staff, StaffStats, TraitId } from "../types/staff";
import type { GenreId } from "../types/genre";
import type { ThemeId } from "../types/market";

import { GENRE_BY_ID } from "../data/genres";
import { THEME_BY_ID } from "../data/themes";
import { PLATFORM_BY_ID } from "../data/platforms";
import { TRAIT_BY_ID } from "../data/traits";
import { ENGINE_FEATURE_BY_ID } from "../data/engineFeatures";

import { generateId } from "../core/ids";
import { addDays, dateToIso, isoToDate, compareDate, isWeekend } from "../core/time";
import { appendLog } from "../core/log";
import { rngFloat, rngChance } from "../core/rng";
import { generatePublishingOffersForProject } from "./publishers";
import { maybeGenerateSubscriptionOffer } from "./subscriptions";

// ============ DEV-PHASE BUG TUNING ============

// Each unshipped platform in a project adds this much to per-staff daily bug rate;
// familiarity (prior shipped games on the platform) reduces the bump on a diminishing curve.
const UNFAMILIAR_PLATFORM_BUG_BUMP = 0.12;
const PLATFORM_FAMILIARITY_HALF_LIFE = 3; // games shipped where bump halves

// Every QA Lab seat adds this fraction to dev-time fix-rate during QA phases (beta/polish/launch).
const QA_LAB_DEV_FIX_BONUS_PER_CAP = 0.10;

// Tech debt accrued per crunch-day, weighted by phase (late crunches are worst).
const TECH_DEBT_PER_CRUNCH_DAY_BY_PHASE: Record<DevPhaseId, number> = {
  pre_production: 0.5,
  production: 0.8,
  alpha: 1.1,
  beta: 1.4,
  polish: 1.7,
  launch: 2.0,
};

// Dev-time bug threshold milestones — emit a one-time log each time the running count crosses one.
const BUG_MILESTONES = [100, 250, 500, 1000] as const;

// Project-level multiplier from platform familiarity across all target platforms.
// No platforms or all fully-familiar → 1.0 (no bump).
function platformFamiliarityBugMult(
  platformIds: readonly string[],
  familiarity: Record<string, number>
): number {
  if (platformIds.length === 0) return 1.0;
  let totalBump = 0;
  for (const pid of platformIds) {
    const shipped = familiarity[pid] ?? 0;
    // Half-life decay: 0 games = full bump, 3 games = half bump, 6 games = quarter, etc.
    const decay = Math.pow(0.5, shipped / PLATFORM_FAMILIARITY_HALF_LIFE);
    totalBump += UNFAMILIAR_PLATFORM_BUG_BUMP * decay;
  }
  // Average across platforms so a multi-platform port isn't exponentially penalized.
  return 1 + totalBump / platformIds.length;
}

function qaLabCapacityInOffice(state: GameState): number {
  let cap = 0;
  for (const room of state.office.rooms) {
    if (room.kind === "qa_lab") cap += room.capacity;
  }
  return cap;
}

// ============ PHASE CONFIGURATION ============

// Default phase durations (in CALENDAR days) relative to project scale
// multiplier. Phases now advance `daysSpent` by 1.0/tick so these map
// directly to wall-clock calendar days. Values are scaled 1.25× vs the
// effort-day baselines that preceded the wall-clock fix so games still
// receive the same total output (weekends still multiply output but no
// longer stretch the calendar). Total baseline ≈ 226 calendar days for a
// simple game; scales with genre/scope.
const PHASE_DEFAULT_DAYS: Record<DevPhaseId, number> = {
  pre_production: 25,
  production: 113,
  alpha: 38,
  beta: 25,
  polish: 19,
  launch: 6,
};

const PHASE_ORDER: DevPhaseId[] = [
  "pre_production", "production", "alpha", "beta", "polish", "launch",
];

const PHASE_NAMES: Record<DevPhaseId, string> = {
  pre_production: "Pre-Production",
  production: "Production",
  alpha: "Alpha",
  beta: "Beta",
  polish: "Polish",
  launch: "Launch",
};

// Default balanced slider — replaced per phase on project creation
const DEFAULT_SLIDERS: PhaseFocusSliders = {
  gameplay: 20, graphics: 15, sound: 10, story: 15, world: 15, ai: 10, polish: 15,
};

// ============ PROJECT CREATION ============

export interface CreateProjectInput {
  name: string;
  genre: GenreId;
  theme: ThemeId;
  audience: TargetAudience;
  platformIds: string[];
  // null = hand-coded from scratch. Required in pre-engine eras (pre-1993)
  // and a valid throwback choice in any era. No engine boosts apply.
  engineId: ID | null;
  budget: Money;
  assignedStaffIds: ID[];
  ipId?: ID;
  isSequel?: boolean;
  sequelNumber?: number;
  scopeMultiplier?: number;   // 0.5 = quick, 1.0 = standard, 2.0 = ambitious
  // DLC plans declared at concept time. Each becomes a `DLCPlan` row on the
  // project with `plannedAtConcept = true` (which unlocks the season-pass
  // slot). Optional — projects may declare zero plans and add them post-launch.
  dlcPlans?: Array<{ kind: DLCKind; name?: string }>;
}

export function createProject(state: GameState, input: CreateProjectInput): {
  state: GameState;
  projectId: ID;
} {
  const genre = GENRE_BY_ID[input.genre];
  if (!genre) throw new Error(`Unknown genre: ${input.genre}`);

  const scope = input.scopeMultiplier ?? 1.0;
  const timeMult = genre.timeMultiplier * scope;

  let r = state.rng;
  const [id, r1] = generateId("proj", r);
  r = r1;

  // Materialize any DLC plans declared at concept.
  const dlcPlans: DLCPlan[] = [];
  for (const p of input.dlcPlans ?? []) {
    const [planId, rPlan] = generateId("dlcplan", r);
    r = rPlan;
    dlcPlans.push({
      id: planId,
      kind: p.kind,
      name: p.name,
      plannedAtConcept: true,
      status: "planned",
    });
  }

  // Build phase progress entries
  const phases: PhaseProgress[] = PHASE_ORDER.map((phaseId) => ({
    id: phaseId,
    name: PHASE_NAMES[phaseId],
    completion: 0,
    daysAllocated: Math.round(PHASE_DEFAULT_DAYS[phaseId] * timeMult),
    daysSpent: 0,
    sliders: { ...DEFAULT_SLIDERS },
    crunching: false,
    designPoints: 0,
    techPoints: 0,
    bugsGenerated: 0,
    bugsFixed: 0,
  }));

  const totalDays = phases.reduce((s, p) => s + p.daysAllocated, 0);
  const currentDate = isoToDate(state.currentDate);
  const targetRelease = addDays(currentDate, totalDays);

  const budget: ProjectBudget = {
    total: input.budget,
    spent: 0,
    marketing: Math.round(input.budget * 0.15),  // default 15% to marketing
    devKitCosts: 0,
  };

  const project: Project = {
    id,
    name: input.name,
    status: "in_development",
    genre: input.genre,
    theme: input.theme,
    audience: input.audience,
    platformIds: input.platformIds,
    engineId: input.engineId,
    budget,
    ipId: input.ipId,
    isSequel: input.isSequel ?? false,
    sequelNumber: input.sequelNumber,
    phases,
    currentPhaseIndex: 0,
    assignedStaffIds: input.assignedStaffIds,
    startDate: state.currentDate,
    targetReleaseDate: dateToIso(targetRelease),
    qualityAxes: { gameplay: 0, graphics: 0, sound: 0, story: 0, world: 0, ai: 0, polish: 0 },
    // Bug accounting — split fields are 0 during dev; populated at release by splitBugsAtRelease.
    totalBugs: 0,
    visibleBugs: 0,
    hiddenBugs: 0,
    surfacedBugsToDate: 0,
    bugsFixedPostLaunch: 0,
    techDebt: 0,
    userScore: null,
    launchedInBadState: false,
    hypeLevel: 0,
    cancelled: false,
    crunchDaysTotal: 0,
    qualityControlActive: false,
    qcDaysTotal: 0,
    dlcPlans,
  };

  // Assign staff — mark them as on this project (unassign from others)
  const updatedStaff = { ...state.staff };
  for (const staffId of input.assignedStaffIds) {
    const s = updatedStaff[staffId];
    if (s) updatedStaff[staffId] = { ...s, currentProjectId: id };
  }

  // Pay up-front dev kit costs for platforms
  let cash = state.studio.cash;
  let devKitCosts = 0;
  for (const pid of input.platformIds) {
    const plat = PLATFORM_BY_ID[pid];
    if (plat) devKitCosts += plat.devKitCost;
  }
  cash -= devKitCosts;
  budget.devKitCosts = devKitCosts;

  // Update sticky default: the next project the player creates will pre-select
  // this same engine choice (including null = hand-coded) until they pick
  // something else.
  let next: GameState = {
    ...state,
    rng: r,
    staff: updatedStaff,
    projects: { ...state.projects, [id]: project },
    studio: { ...state.studio, cash, lastUsedEngineId: input.engineId },
  };

  next = appendLog(next, {
    category: "project",
    headline: `Project kickoff: ${input.name}`,
    body: `New ${genre.name} project started. Target release: ${dateToIso(targetRelease)}.`,
    severity: "success",
    relatedIds: { projectId: id },
  });

  // Concept-time publishing offers — indie labels and mid-majors approach
  // the player based on studio reputation and genre fit. Bigger publishers
  // (major / mega) wait for actual quality signal and pitch later via
  // tickPublisherOffersDuringDev in the monthly rollup.
  next = generatePublishingOffersForProject(next, id);

  return { state: next, projectId: id };
}

// ============ QUALITY AXIS → SLIDER MAPPING ============

// Slider keys are parallel to QualityAxis names, so this is 1:1.
function axisFromSlider(k: keyof PhaseFocusSliders): QualityAxis {
  return k as QualityAxis;
}

// ============ STAFF CONTRIBUTION ============

// Returns the design & tech points produced by a single staff per day,
// given the current phase's sliders and the engine's axis boosts.
// Also returns their bug generation rate.
interface StaffOutput {
  designPoints: number;
  techPoints: number;
  bugRate: number;
  energyCost: number;
  // Net trait sum for crunch_tolerance — exposed so the per-day burnout
  // calc in tickProject doesn't have to recompute trait effects.
  crunchTolerance: number;
}

function computeStaffOutput(
  staff: Staff,
  sliders: PhaseFocusSliders,
  engineAxisBoosts: Partial<Record<QualityAxis, number>>,
  genreAffinities: Partial<Record<GenreId, number>>,
  genreId: GenreId,
  crunching: boolean
): StaffOutput {
  // Composer role specialization — Composers are audio specialists, so their
  // sound output is significantly amplified vs. any other role with the same
  // sound stat. This is what elevates audio to a true 5th craft pillar:
  // hiring a Composer is now a distinct strategic decision the way hiring a
  // Programmer or Artist is. Other roles still contribute to sound at the
  // base 1:1 rate via their `sound` stat — Composers just specialize.
  const composerSoundMult = staff.role === "composer" ? 1.6 : 1.0;

  // Weighted contribution per axis — each axis gets a share of focus
  // and is multiplied by the staff's relevant skill
  const skillForAxis: Record<QualityAxis, number> = {
    gameplay: staff.stats.design * 0.6 + staff.stats.tech * 0.4,
    graphics: staff.stats.art * 0.8 + staff.stats.tech * 0.2,
    sound:    staff.stats.sound * composerSoundMult,
    story:    staff.stats.writing,
    world:    staff.stats.design * 0.5 + staff.stats.art * 0.3 + staff.stats.writing * 0.2,
    ai:       staff.stats.tech * 0.7 + staff.stats.design * 0.3,
    polish:   staff.stats.tech * 0.4 + staff.stats.art * 0.3 + staff.stats.design * 0.3,
  };

  // Sum weighted skill contribution across all axes
  const sliderTotal = Object.values(sliders).reduce((s, v) => s + v, 0) || 100;
  let totalOutput = 0;
  for (const key of Object.keys(sliders) as (keyof PhaseFocusSliders)[]) {
    const share = sliders[key] / sliderTotal;
    const axisSkill = skillForAxis[axisFromSlider(key)];
    const engineBoost = engineAxisBoosts[axisFromSlider(key)] ?? 0;
    totalOutput += share * axisSkill * (1 + engineBoost);
  }

  // Speed multiplier from stat
  const speedMult = 0.5 + staff.stats.speed / 200;
  totalOutput *= speedMult;

  // Trait modifiers
  let bugMod = 0;
  let crunchTolerance = 0;
  let statMods: Partial<Record<keyof StaffStats, number>> = {};
  let genreBonus = 0;
  for (const tid of staff.traits) {
    const def = TRAIT_BY_ID[tid];
    if (!def) continue;
    for (const eff of def.effects) {
      if (eff.type === "bug_rate") bugMod += eff.value;
      else if (eff.type === "crunch_tolerance") crunchTolerance += eff.value;
      else if (eff.type === "stat_mod") statMods[eff.stat] = (statMods[eff.stat] ?? 0) + eff.value;
      else if (eff.type === "genre_affinity" && eff.genre === genreId) genreBonus += eff.value;
    }
  }

  // Apply specialization bonuses
  const spec = genreAffinities[genreId];
  if (spec) totalOutput *= (1 + spec);
  if (genreBonus) totalOutput *= (1 + genreBonus);

  // Morale/energy/health modulation. Health is the long-term burnout meter —
  // depletes slowly under sustained crunch, recovers on rest days. At the
  // floor a burned-out dev still produces ~65% — meaningful drag, not zeroed.
  const moraleMult = 0.6 + (staff.morale / 100) * 0.6; // 0.6 at 0, 1.2 at 100
  const energyMult = 0.5 + (staff.energy / 100) * 0.5; // 0.5 at 0, 1.0 at 100
  const healthMult = 0.65 + (staff.health / 100) * 0.35; // 0.65 at 0, 1.0 at 100
  totalOutput *= moraleMult * energyMult * healthMult;

  // Crunch multiplier
  if (crunching) totalOutput *= 1.4;

  // Output breakdown: 70% design points, 30% tech points in normal phases
  const designPoints = totalOutput * 0.7;
  const techPoints = totalOutput * 0.3;

  // Base bug rate scales inversely with tech/polish; trait modifiers stack.
  // Floor of 0.08 means even legendary, fully-specialized staff (basePolish ~99)
  // still roll meaningful bugs — no game ships truly clean. Below, this floor
  // bites only at the very top of the skill curve; lower-skill staff get the
  // linear penalty (0.5 - skill/250) which is much higher.
  const basePolishSkill = (staff.stats.tech + skillForAxis.polish) / 2;
  let bugRate = Math.max(0.08, 0.5 - basePolishSkill / 250) + bugMod;
  if (crunching) bugRate *= 1.8;
  // Burned-out devs make sloppier work — bug rate climbs as health drops below 50.
  if (staff.health < 50) bugRate += (50 - staff.health) * 0.005;
  bugRate = Math.max(0, bugRate);

  // Energy cost per day
  let energyCost = 0.8;
  if (crunching) {
    energyCost = 4;
    // Crunch tolerance reduces energy drain; burnout prone amplifies
    energyCost *= Math.max(0.4, 1 - crunchTolerance / 100);
  }

  return { designPoints, techPoints, bugRate, energyCost, crunchTolerance };
}

// ============ PER-TICK PROGRESSION ============

// Advance every active project by one day. Mutates state immutably.
export function tickDevelopment(state: GameState): GameState {
  let next = state;
  for (const projectId of Object.keys(state.projects)) {
    next = tickProject(next, projectId);
  }
  return next;
}

function tickProject(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  // Tick if either:
  //   (a) project is in active development (normal case), OR
  //   (b) project is parked at the release gate AND a QC Push is running —
  //       lets the player keep burning down bugs / tech debt while waiting
  //       to approve the release. Without QC active we skip the tick so a
  //       gated project just sits there with no drift.
  if (
    project.status !== "in_development" &&
    !(project.status === "ready_to_release" && project.qualityControlActive)
  ) {
    return state;
  }

  const phase = project.phases[project.currentPhaseIndex];
  if (!phase) return state;

  const today = isoToDate(state.currentDate);
  const weekend = isWeekend(today);
  // Weekends advance the calendar but produce half the output and much better recovery.
  // If crunching, staff work weekends too (full output).
  const workingWeekend = phase.crunching;
  const isRestDay = weekend && !workingWeekend;

  // Quality Control Push — when active, staff pivot from feature work to
  // bug hunting: phase progress slows drastically, new-bug generation is
  // suppressed, and fix rate climbs to patch-sprint levels across every phase.
  const qcActive = project.qualityControlActive;
  const qcProgressMult = qcActive ? 0.25 : 1.0;

  const genre = GENRE_BY_ID[project.genre]!;
  const assigned = project.assignedStaffIds
    .map((id) => state.staff[id])
    .filter((s): s is Staff => !!s && s.status === "employed");

  if (assigned.length === 0) {
    // No one working — project idles. Log warning once.
    if (phase.daysSpent === 0 && !state.flags[`${projectId}_nostaff_warned`]) {
      return appendLog({ ...state, flags: { ...state.flags, [`${projectId}_nostaff_warned`]: true } }, {
        category: "project",
        headline: `${project.name} has no assigned staff`,
        severity: "warning",
        relatedIds: { projectId },
      });
    }
    return state;
  }

  // Engine axis boosts (sum of its features' boosts).
  // Hand-coded projects (engineId === null) get no boosts — pre-1993 games
  // and modern throwbacks rely entirely on staff skill.
  const engine = project.engineId ? state.engines[project.engineId] : undefined;
  const engineAxisBoosts: Partial<Record<QualityAxis, number>> = {};
  if (engine) {
    for (const fid of engine.featureIds) {
      const f = ENGINE_FEATURE_BY_ID[fid];
      if (!f) continue;
      for (const [axis, boost] of Object.entries(f.axisBoost)) {
        engineAxisBoosts[axis as QualityAxis] = (engineAxisBoosts[axis as QualityAxis] ?? 0) + (boost ?? 0);
      }
    }
  }

  // Accumulate this day's contributions
  let dayDesignPoints = 0;
  let dayTechPoints = 0;
  let dayBugChance = 0;
  let totalEnergyCost = 0;

  // Per-axis accumulation for final quality
  const dayAxisContribution: Record<QualityAxis, number> = {
    gameplay: 0, graphics: 0, sound: 0, story: 0, world: 0, ai: 0, polish: 0,
  };

  const staffUpdates: Record<ID, Staff> = {};

  for (const staff of assigned) {
    const out = computeStaffOutput(
      staff,
      phase.sliders,
      engineAxisBoosts,
      staff.specializations,
      project.genre,
      phase.crunching
    );

    // Weekend scaling (unless crunching forces a work weekend)
    const outputMult = isRestDay ? 0.3 : 1.0; // skeleton crew checks in on weekends

    dayDesignPoints += out.designPoints * outputMult;
    dayTechPoints += out.techPoints * outputMult;
    dayBugChance += out.bugRate * outputMult;
    totalEnergyCost += out.energyCost * outputMult;

    // Distribute output across axes proportional to sliders
    const sliderTotal = Object.values(phase.sliders).reduce((s, v) => s + v, 0) || 100;
    for (const key of Object.keys(phase.sliders) as (keyof PhaseFocusSliders)[]) {
      const share = phase.sliders[key] / sliderTotal;
      dayAxisContribution[axisFromSlider(key)] +=
        (out.designPoints + out.techPoints) * share * outputMult;
    }

    // Update staff energy + morale
    let newEnergy = staff.energy - out.energyCost * outputMult;
    // Recovery: small on weekdays, large on weekends
    if (isRestDay) {
      newEnergy += 8;      // restful weekend
    } else if (!phase.crunching) {
      newEnergy += 1.2;    // normal workday recovery
    }
    newEnergy = Math.max(0, Math.min(100, newEnergy));

    // Morale dynamics
    let newMorale = staff.morale;
    // Natural drift toward 70 (content baseline) at 0.2/day
    if (newMorale < 70) newMorale += 0.2;
    else if (newMorale > 70) newMorale -= 0.05;
    // Crunch penalty
    if (phase.crunching) newMorale -= 0.3;
    // Working a weekend without crunch flag still costs a bit (implicit crunch)
    if (weekend && workingWeekend) newMorale -= 0.15;
    // Rest day gives a small morale bump
    if (isRestDay) newMorale += 0.3;
    // QC Push is a grind — small morale tax on working days
    if (qcActive && !isRestDay) newMorale -= 0.1;
    // Burnout — if energy hits 0, morale drops faster
    if (newEnergy <= 5) newMorale -= 0.5;
    newMorale = Math.max(0, Math.min(100, newMorale));

    // Burnout (health) dynamics — long-term grind tracker, distinct from
    // energy. Energy snaps back over a weekend; health takes weeks. Crunch
    // chips health hard, with crunch_tolerance softening the blow (and
    // burnout_prone amplifying it via its built-in -50 tolerance).
    let newHealth = staff.health;
    if (phase.crunching) {
      const burnoutLoss = 2.5 * Math.max(0.3, 1 - out.crunchTolerance / 100);
      newHealth -= burnoutLoss * (isRestDay ? 0.6 : 1.0);
    } else if (weekend && workingWeekend) {
      // Implicit crunch — overtime without the flag still grinds.
      newHealth -= 0.6;
    } else if (qcActive && !isRestDay) {
      // QC Push is a grind, even without the crunch flag.
      newHealth -= 0.4;
    } else if (isRestDay) {
      newHealth += 3.5; // restful weekend
    } else {
      // Normal workday: tiny drift toward 80 (content baseline).
      if (newHealth < 80) newHealth += 0.4;
      else if (newHealth > 80) newHealth -= 0.05;
    }
    // Crashed energy compounds burnout — exhausted staff lose health faster.
    if (newEnergy <= 5 && !isRestDay) newHealth -= 0.8;
    newHealth = Math.max(0, Math.min(100, newHealth));

    staffUpdates[staff.id] = { ...staff, energy: newEnergy, morale: newMorale, health: newHealth };
  }

  // Apply platform familiarity bug bump — unfamiliar platforms generate more bugs.
  const platformMult = platformFamiliarityBugMult(project.platformIds, state.studio.platformFamiliarity);
  dayBugChance *= platformMult;

  // Quality Control Push suppresses new bug generation entirely — the whole
  // team is in cleanup mode, not shipping risky new feature work.
  if (qcActive) dayBugChance = 0;

  // Apply bug generation — each staff has a chance per day
  let rng = state.rng;
  let bugsThisDay = 0;
  for (let i = 0; i < assigned.length; i++) {
    const perStaffBugRate = dayBugChance / assigned.length;
    const [rolled, next] = rngChance(rng, Math.min(0.95, perStaffBugRate));
    rng = next;
    if (rolled) bugsThisDay++;
  }

  // Bug fixing during development:
  //   - QC Push: aggressive fix rate across EVERY phase (supersedes phaseIsQA).
  //   - Otherwise, only Beta/Polish/Launch phases fix bugs as part of normal work.
  let bugsFixedThisDay = 0;
  const phaseIsQA = phase.id === "beta" || phase.id === "polish" || phase.id === "launch";
  const outputMultForFix = isRestDay ? 0.3 : 1.0;
  const qaLabCap = qaLabCapacityInOffice(state);
  const qaLabMult = 1 + qaLabCap * QA_LAB_DEV_FIX_BONUS_PER_CAP;
  if (qcActive) {
    const projectBugs = state.projects[projectId]!.totalBugs;
    const totalSpeed = assigned.reduce((s, st) => s + st.stats.speed, 0);
    // Patch-sprint-level fix rate: a per-head constant plus a speed-weighted
    // term, boosted by QA Lab capacity. Scaled to be meaningfully stronger
    // than the passive beta/polish fix trickle.
    const fixPotential =
      (assigned.length * 1.4 + totalSpeed * 0.015) * outputMultForFix * qaLabMult;
    bugsFixedThisDay = Math.min(projectBugs, Math.round(fixPotential));
  } else if (phaseIsQA) {
    const projectBugs = state.projects[projectId]!.totalBugs;
    // Fix rate scales with polish slider and staff speed.
    // QA Lab capacity boosts the dev-time fix rate — that's what makes the room more than ornament.
    const polishWeight = phase.sliders.polish / 100;
    const totalSpeed = assigned.reduce((s, st) => s + st.stats.speed, 0);
    const fixPotential =
      totalSpeed * 0.02 * (0.5 + polishWeight) * outputMultForFix * qaLabMult;
    bugsFixedThisDay = Math.min(projectBugs, Math.round(fixPotential));
  }

  // Updated phase
  // Calendar days always tick by 1 — the phase completion bar tracks real
  // days elapsed, not effort-days. Weekends and QC Push still affect OUTPUT
  // (design/tech points, quality axes, bug rates scale by outputMult /
  // qcProgressMult below) — they just don't stretch the calendar. This
  // keeps `daysSpent / daysAllocated` in sync with the wall clock so the UI
  // reading matches actual time passing.
  const dayProgressIncrement = 1.0;
  const newDaysSpent = phase.daysSpent + dayProgressIncrement;
  const newCompletion = Math.min(100, (newDaysSpent / phase.daysAllocated) * 100);
  const updatedPhase: PhaseProgress = {
    ...phase,
    daysSpent: newDaysSpent,
    completion: newCompletion,
    // Under QC Push, design/tech feature work is scaled way down — staff are
    // hunting bugs, not building new systems.
    designPoints: phase.designPoints + dayDesignPoints * qcProgressMult,
    techPoints: phase.techPoints + dayTechPoints * qcProgressMult,
    bugsGenerated: phase.bugsGenerated + bugsThisDay,
    bugsFixed: phase.bugsFixed + bugsFixedThisDay,
  };
  const newPhases = [...project.phases];
  newPhases[project.currentPhaseIndex] = updatedPhase;

  // Track salary against project budget (accounting only — studio cash is
  // deducted monthly by runPayroll, not per day).
  const dailySalaryShare = assigned.reduce((s, st) => s + st.salary / 365, 0);

  // Updated axes — scaled by qcProgressMult so quality accrual slows under QC.
  const newAxes = { ...project.qualityAxes };
  for (const k of Object.keys(dayAxisContribution) as QualityAxis[]) {
    newAxes[k] += dayAxisContribution[k] * qcProgressMult;
  }

  // Updated project
  let newTotalBugs = project.totalBugs + bugsThisDay - bugsFixedThisDay;
  if (newTotalBugs < 0) newTotalBugs = 0;

  // Tech debt accrues from crunch days, weighted by phase (late crunches are worst).
  // Rest-day crunch still counts but at reduced rate, since skeleton-crew crunching is less damaging.
  const techDebtMult = TECH_DEBT_PER_CRUNCH_DAY_BY_PHASE[phase.id];
  const techDebtToday = phase.crunching
    ? techDebtMult * (isRestDay ? 0.4 : 1.0)
    : 0;
  // QC Push also chips away at existing tech debt — targeted refactors and
  // cleanup shipped alongside the bug burndown.
  const techDebtReduction = qcActive
    ? 0.4 * assigned.length * (isRestDay ? 0.3 : 1.0)
    : 0;
  const newTechDebt = Math.max(0, project.techDebt + techDebtToday - techDebtReduction);

  let newCrunchDaysTotal = project.crunchDaysTotal + (phase.crunching ? 1 : 0);
  const newQcDaysTotal = project.qcDaysTotal + (qcActive && !isRestDay ? 1 : 0);

  let updatedProject: Project = {
    ...project,
    phases: newPhases,
    qualityAxes: newAxes,
    totalBugs: newTotalBugs,
    techDebt: newTechDebt,
    crunchDaysTotal: newCrunchDaysTotal,
    qcDaysTotal: newQcDaysTotal,
    budget: { ...project.budget, spent: project.budget.spent + Math.round(dailySalaryShare) },
  };

  // Milestone log events — one-time when crossing each bug threshold upward during dev.
  // Flags live on gameState.flags, keyed by project + milestone, so they never re-fire.
  let milestoneLog: { headline: string; severity: "warning" | "danger"; milestone: number } | null = null;
  let newFlags = state.flags;
  for (const m of BUG_MILESTONES) {
    const flagKey = `${projectId}_bugs_${m}`;
    if (project.totalBugs < m && newTotalBugs >= m && !state.flags[flagKey]) {
      newFlags = { ...newFlags, [flagKey]: true };
      const severity: "warning" | "danger" = m >= 500 ? "danger" : "warning";
      milestoneLog = {
        headline: `${project.name} has ${m}+ known bugs`,
        severity,
        milestone: m,
      };
      // Only log the highest crossed in one tick
    }
  }

  // Auto-transition to next phase
  if (newCompletion >= 100 && project.currentPhaseIndex < PHASE_ORDER.length - 1) {
    updatedProject = { ...updatedProject, currentPhaseIndex: project.currentPhaseIndex + 1 };
    const nextPhaseName = PHASE_NAMES[PHASE_ORDER[project.currentPhaseIndex + 1]!];
    let next: GameState = {
      ...state,
      rng,
      staff: { ...state.staff, ...staffUpdates },
      projects: { ...state.projects, [projectId]: updatedProject },
      flags: newFlags,
    };
    if (milestoneLog) {
      next = appendLog(next, {
        category: "project",
        headline: milestoneLog.headline,
        severity: milestoneLog.severity,
        relatedIds: { projectId },
      });
    }
    return appendLog(next, {
      category: "project",
      headline: `${project.name} entering ${nextPhaseName}`,
      severity: "info",
      relatedIds: { projectId },
    });
  }

  // If final phase (launch) completes, transition to ready_to_release.
  // The project is now awaiting the player's explicit ship approval — it will
  // NOT auto-release. approveRelease() sets the `_ready_for_release` flag,
  // which processReadyReleases then consumes alongside status === "ready_to_release".
  // Explicit `status === "in_development"` guard: we now allow tickProject to
  // run for ready_to_release projects when QC is active, so we MUST NOT re-fire
  // the gate transition each tick — only flip on the first crossing.
  if (
    project.status === "in_development" &&
    newCompletion >= 100 &&
    project.currentPhaseIndex === PHASE_ORDER.length - 1
  ) {
    // First time reaching the gate: flip status and announce.
    updatedProject = { ...updatedProject, status: "ready_to_release" };
    let next: GameState = {
      ...state,
      rng,
      staff: { ...state.staff, ...staffUpdates },
      projects: { ...state.projects, [projectId]: updatedProject },
      flags: newFlags,
    };
    if (milestoneLog) {
      next = appendLog(next, {
        category: "project",
        headline: milestoneLog.headline,
        severity: milestoneLog.severity,
        relatedIds: { projectId },
      });
    }
    next = appendLog(next, {
      category: "project",
      headline: `${project.name} is ready for release!`,
      body: "Launch phase complete. Approve the release when you're ready — until then it sits at the gate.",
      severity: "success",
      relatedIds: { projectId },
    });
    // Era-gated: a subscription service may now pitch a flat-cash buyout in
    // exchange for catalog inclusion. No-op if no service qualifies for the
    // year/quality/reputation triple. Only fires once per project (the helper
    // checks for existing offer + accepted-deal flags).
    next = maybeGenerateSubscriptionOffer(next, projectId);
    return next;
  }

  let next: GameState = {
    ...state,
    rng,
    staff: { ...state.staff, ...staffUpdates },
    projects: { ...state.projects, [projectId]: updatedProject },
    flags: newFlags,
  };
  if (milestoneLog) {
    next = appendLog(next, {
      category: "project",
      headline: milestoneLog.headline,
      severity: milestoneLog.severity,
      relatedIds: { projectId },
    });
  }
  return next;
}

// ============ PLAYER ACTIONS ============

export function setPhaseSliders(
  state: GameState,
  projectId: ID,
  phaseIndex: number,
  sliders: PhaseFocusSliders
): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  const phase = project.phases[phaseIndex];
  if (!phase) return state;

  // Normalize to sum = 100
  const total = Object.values(sliders).reduce((s, v) => s + v, 0);
  if (total <= 0) return state;
  const normalized: PhaseFocusSliders = {
    gameplay: Math.round((sliders.gameplay / total) * 100),
    graphics: Math.round((sliders.graphics / total) * 100),
    sound:    Math.round((sliders.sound / total) * 100),
    story:    Math.round((sliders.story / total) * 100),
    world:    Math.round((sliders.world / total) * 100),
    ai:       Math.round((sliders.ai / total) * 100),
    polish:   Math.round((sliders.polish / total) * 100),
  };

  const newPhases = [...project.phases];
  newPhases[phaseIndex] = { ...phase, sliders: normalized };
  return {
    ...state,
    projects: {
      ...state.projects,
      [projectId]: { ...project, phases: newPhases },
    },
  };
}

export function setPhaseCrunch(
  state: GameState,
  projectId: ID,
  phaseIndex: number,
  crunching: boolean
): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  const phase = project.phases[phaseIndex];
  if (!phase) return state;
  const newPhases = [...project.phases];
  newPhases[phaseIndex] = { ...phase, crunching };
  return {
    ...state,
    projects: {
      ...state.projects,
      [projectId]: { ...project, phases: newPhases },
    },
  };
}

export function cancelProject(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  // Unassign staff
  const staffUpdates: Record<ID, Staff> = {};
  for (const staffId of project.assignedStaffIds) {
    const s = state.staff[staffId];
    if (s && s.currentProjectId === projectId) {
      staffUpdates[staffId] = { ...s, currentProjectId: null };
    }
  }
  const cancelled: Project = { ...project, status: "cancelled", cancelled: true };
  let next: GameState = {
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    projects: { ...state.projects, [projectId]: cancelled },
    studio: { ...state.studio, gamesCancelled: state.studio.gamesCancelled + 1 },
  };
  next = appendLog(next, {
    category: "project",
    headline: `${project.name} cancelled`,
    severity: "warning",
    relatedIds: { projectId },
  });
  return next;
}

// ============ QUALITY CONTROL PUSH ============

// Toggle the Quality Control Push on or off for an in-development project.
// When activated, the team pivots to aggressive bug-hunting across every
// phase (not just beta/polish/launch). Turning QC on also disables crunch
// on the current phase — the two modes don't mix, QC is its own grind.
export function toggleQualityControl(
  state: GameState,
  projectId: ID,
  active: boolean
): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  // QC can run during normal development OR while the project is parked at the
  // release gate — the player should be able to keep hunting bugs right up
  // until they click APPROVE RELEASE.
  if (project.status !== "in_development" && project.status !== "ready_to_release") return state;
  // No-op if already in the requested state.
  if (project.qualityControlActive === active) return state;

  let phases = project.phases;
  if (active) {
    const phase = project.phases[project.currentPhaseIndex];
    if (phase && phase.crunching) {
      phases = [...project.phases];
      phases[project.currentPhaseIndex] = { ...phase, crunching: false };
    }
  }

  const updated: Project = {
    ...project,
    qualityControlActive: active,
    phases,
  };

  let next: GameState = {
    ...state,
    projects: { ...state.projects, [projectId]: updated },
  };

  next = appendLog(next, {
    category: "project",
    headline: active
      ? `Quality Control Push started on ${project.name}`
      : `Quality Control Push ended on ${project.name}`,
    body: active
      ? "Team pivots to bug hunting. Phase progress slows and new bugs stop generating."
      : `Team resumes feature work. ${project.qcDaysTotal} total days spent on QC.`,
    severity: "info",
    relatedIds: { projectId },
  });

  return next;
}

// ============ RELEASE APPROVAL GATE ============

// Player-triggered approval to ship a project that's sitting in "ready_to_release".
// Sets the `${projectId}_ready_for_release` flag that processReadyReleases
// watches for — paired with status === "ready_to_release", this is what
// unblocks the actual release on the next tick.
export function approveRelease(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  if (project.status !== "ready_to_release") return state;
  // Idempotent — if already approved, no-op.
  if (state.flags[`${projectId}_ready_for_release`]) return state;

  let next: GameState = {
    ...state,
    flags: { ...state.flags, [`${projectId}_ready_for_release`]: true },
  };
  next = appendLog(next, {
    category: "project",
    headline: `Release approved: ${project.name}`,
    body: "Shipping on the next tick. Critics are sharpening their knives.",
    severity: "success",
    relatedIds: { projectId },
  });
  return next;
}
