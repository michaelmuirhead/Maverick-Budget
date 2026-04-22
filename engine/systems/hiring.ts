// Hiring/firing/pool-refresh actions.
// The hiring pool periodically refreshes with new candidates.
// Player actions: hire a candidate (pays signing bonus), fire an employee (pays severance),
// offer a raise (morale + loyalty boost).

import type { GameState } from "../core/state";
import type { ID, Money, StaffRole } from "../types/core";
import type { Staff } from "../types/staff";
import { generateStaff } from "./staffGenerator";
import { appendLog } from "../core/log";
import { rngInt } from "../core/rng";
import { isoToDate, daysBetween } from "../core/time";

// ============ HIRE A CANDIDATE ============
export function hireCandidate(state: GameState, candidateId: ID): GameState {
  const candidate = state.staff[candidateId];
  if (!candidate || candidate.status !== "candidate") return state;
  if (!state.hiringPool.candidateIds.includes(candidateId)) return state;

  // Signing bonus = 10% of annual salary
  const signingBonus = Math.round(candidate.salary * 0.1);
  if (state.studio.cash < signingBonus) {
    return appendLog(state, {
      category: "staff",
      headline: `Cannot afford to hire ${candidate.name} — need $${(signingBonus / 100).toLocaleString()} signing bonus`,
      severity: "warning",
    });
  }

  const hired: Staff = {
    ...candidate,
    status: "employed",
    hiredOn: state.currentDate,
    morale: Math.max(candidate.morale, 75),
  };

  const next: GameState = {
    ...state,
    staff: { ...state.staff, [candidateId]: hired },
    hiringPool: {
      ...state.hiringPool,
      candidateIds: state.hiringPool.candidateIds.filter((id) => id !== candidateId),
    },
    studio: { ...state.studio, cash: state.studio.cash - signingBonus },
  };

  return appendLog(next, {
    category: "staff",
    headline: `Hired ${candidate.name} — ${roleLabel(candidate.role)}`,
    body: `$${(candidate.salary / 100).toLocaleString()}/yr salary, $${(signingBonus / 100).toLocaleString()} signing bonus.`,
    severity: "success",
    relatedIds: { staffId: candidateId },
  });
}

// ============ FIRE AN EMPLOYEE ============
export function fireStaff(state: GameState, staffId: ID): GameState {
  const staff = state.staff[staffId];
  if (!staff || staff.status !== "employed") return state;

  // Severance = 2 months salary
  const severance = Math.round(staff.salary / 6);

  // Morale penalty for remaining staff — firing someone visible is bad optics
  const staffUpdates: Record<ID, Staff> = {};
  for (const [id, s] of Object.entries(state.staff)) {
    if (id === staffId) {
      staffUpdates[id] = { ...s, status: "resigned", currentProjectId: null };
      continue;
    }
    if (s.status === "employed") {
      staffUpdates[id] = { ...s, morale: Math.max(0, s.morale - 5) };
    }
  }

  // Remove from any project assignments
  const projectUpdates: Record<ID, typeof state.projects[string]> = {};
  for (const project of Object.values(state.projects)) {
    if (project.assignedStaffIds.includes(staffId)) {
      projectUpdates[project.id] = {
        ...project,
        assignedStaffIds: project.assignedStaffIds.filter((id) => id !== staffId),
      };
    }
  }

  const next: GameState = {
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    projects: { ...state.projects, ...projectUpdates },
    studio: { ...state.studio, cash: state.studio.cash - severance },
  };

  return appendLog(next, {
    category: "staff",
    headline: `${staff.name} let go`,
    body: `$${(severance / 100).toLocaleString()} severance paid.`,
    severity: "warning",
    relatedIds: { staffId },
  });
}

// ============ GIVE A RAISE ============
export function giveRaise(state: GameState, staffId: ID, pctIncrease: number): GameState {
  const staff = state.staff[staffId];
  if (!staff || staff.status !== "employed") return state;
  const newSalary = Math.round(staff.salary * (1 + pctIncrease / 100));
  const moraleBump = Math.min(25, pctIncrease * 1.5);
  const loyaltyBump = Math.min(20, pctIncrease);

  const updated: Staff = {
    ...staff,
    salary: newSalary,
    morale: Math.min(100, staff.morale + moraleBump),
    loyalty: Math.min(100, staff.loyalty + loyaltyBump),
  };

  return appendLog({
    ...state,
    staff: { ...state.staff, [staffId]: updated },
  }, {
    category: "staff",
    headline: `${staff.name} got a ${pctIncrease}% raise`,
    body: `New salary: $${(newSalary / 100).toLocaleString()}/yr.`,
    severity: "info",
    relatedIds: { staffId },
  });
}

// ============ ASSIGN / UNASSIGN STAFF TO PROJECT ============
export function assignStaffToProject(
  state: GameState,
  staffId: ID,
  projectId: ID
): GameState {
  const staff = state.staff[staffId];
  const project = state.projects[projectId];
  if (!staff || !project || staff.status !== "employed") return state;
  if (project.assignedStaffIds.includes(staffId)) return state;

  return {
    ...state,
    staff: { ...state.staff, [staffId]: { ...staff, currentProjectId: projectId } },
    projects: {
      ...state.projects,
      [projectId]: { ...project, assignedStaffIds: [...project.assignedStaffIds, staffId] },
    },
  };
}

export function unassignStaffFromProject(
  state: GameState,
  staffId: ID,
  projectId: ID
): GameState {
  const staff = state.staff[staffId];
  const project = state.projects[projectId];
  if (!staff || !project) return state;

  return {
    ...state,
    staff: { ...state.staff, [staffId]: { ...staff, currentProjectId: null } },
    projects: {
      ...state.projects,
      [projectId]: {
        ...project,
        assignedStaffIds: project.assignedStaffIds.filter((id) => id !== staffId),
      },
    },
  };
}

// ============ MONTHLY HIRING POOL REFRESH ============
// Called by the monthly rollup. Purges old candidates not hired in 30 days
// and generates a fresh batch.
export function refreshHiringPool(state: GameState): GameState {
  let rng = state.rng;

  // Remove stale candidates — they've "moved on" if still in pool from last refresh
  const staleIds = state.hiringPool.candidateIds;
  const newStaff = { ...state.staff };
  for (const id of staleIds) {
    delete newStaff[id];
  }

  // Generate new pool — size varies with studio reputation.
  // Higher reputation attracts more candidates.
  const basePoolSize = 4;
  const repBoost = Math.floor(state.studio.reputation / 20);
  const [poolSize, r1] = rngInt(rng, basePoolSize, basePoolSize + 3 + repBoost);
  rng = r1;

  const newCandidateIds: ID[] = [];
  for (let i = 0; i < poolSize; i++) {
    const [candidate, r] = generateStaff(rng);
    rng = r;
    newStaff[candidate.id] = candidate;
    newCandidateIds.push(candidate.id);
  }

  return {
    ...state,
    rng,
    staff: newStaff,
    hiringPool: {
      lastRefreshDate: state.currentDate,
      candidateIds: newCandidateIds,
    },
  };
}

// ============ PAYROLL ============
// Monthly salary payment. Called from monthly rollup.
export function runPayroll(state: GameState): GameState {
  let totalPayroll = 0;
  for (const staff of Object.values(state.staff)) {
    if (staff.status === "employed") {
      totalPayroll += Math.round(staff.salary / 12);
    }
  }
  if (totalPayroll === 0) return state;

  const next: GameState = {
    ...state,
    studio: { ...state.studio, cash: state.studio.cash - totalPayroll },
  };

  return appendLog(next, {
    category: "finance",
    headline: `Monthly payroll: $${Math.round(totalPayroll / 100).toLocaleString()}`,
    severity: "info",
  });
}

// ============ OFF-DUTY STAFF RECOVERY ============
// Daily tick for staff who aren't currently assigned to any project. They
// recover energy/morale/health at restful rates — between-projects downtime
// matters and shouldn't be penalized just because they're idle. Assigned
// staff get their updates inside tickProject; this only fills the gap.
export function tickStaffRecovery(state: GameState): GameState {
  // Find which staff IDs are assigned to any active project's team. We only
  // skip them here — tickProject already updates their meters.
  const assignedIds = new Set<ID>();
  for (const project of Object.values(state.projects)) {
    if (project.status !== "in_development" && project.status !== "ready_to_release") continue;
    for (const sid of project.assignedStaffIds) assignedIds.add(sid);
  }

  const today = isoToDate(state.currentDate);
  const dayOfWeek = ((Date.UTC(today.year, today.month - 1, today.day) / 86400000) % 7 + 7) % 7;
  // 0 = Sunday in JS UTC arithmetic; we treat 0 and 6 as weekend.
  const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

  const staffUpdates: Record<ID, Staff> = {};
  for (const [id, staff] of Object.entries(state.staff)) {
    if (staff.status !== "employed") continue;
    if (assignedIds.has(id)) continue;

    // Off-duty: gentle daily recovery, larger on weekends.
    let newEnergy = staff.energy + (isWeekendDay ? 6 : 2.5);
    let newHealth = staff.health + (isWeekendDay ? 2.5 : 1.2);
    let newMorale = staff.morale;
    // Drift toward 70 (content baseline). Idle staff don't lose morale just
    // for being idle, but they don't gain it either.
    if (newMorale < 70) newMorale += 0.15;
    else if (newMorale > 70) newMorale -= 0.05;

    newEnergy = Math.max(0, Math.min(100, newEnergy));
    newHealth = Math.max(0, Math.min(100, newHealth));
    newMorale = Math.max(0, Math.min(100, newMorale));

    staffUpdates[id] = { ...staff, energy: newEnergy, morale: newMorale, health: newHealth };
  }

  if (Object.keys(staffUpdates).length === 0) return state;
  return { ...state, staff: { ...state.staff, ...staffUpdates } };
}

// ============ STAFF QUIT RISK TICK ============
// Small daily chance that staff with low morale/loyalty resign.
// Mercenary staff accept better offers; loyal staff rarely leave.
export function tickStaffAttrition(state: GameState): GameState {
  // Only check once a month (day 1) to avoid spammy daily resignations
  const today = isoToDate(state.currentDate);
  if (today.day !== 1) return state;

  let next = state;
  let rng = state.rng;

  for (const [id, staff] of Object.entries(state.staff)) {
    if (staff.status !== "employed") continue;
    // Base quit risk is near zero; rises steeply as morale drops
    let quitChance = 0;
    if (staff.morale < 40) quitChance += (40 - staff.morale) * 0.002;
    if (staff.morale < 15) quitChance += 0.05; // severely disgruntled
    if (staff.loyalty < 30) quitChance += (30 - staff.loyalty) * 0.001;
    // Burnout adds its own quit pressure — sustained high crunch leads to
    // people walking out even if morale/loyalty look OK on paper.
    if (staff.health < 30) quitChance += (30 - staff.health) * 0.0015;
    if (staff.health < 10) quitChance += 0.04; // truly burned out
    // Trait effects
    let burnoutProne = false;
    for (const tid of staff.traits) {
      if (tid === "mercenary") quitChance += 0.01;
      if (tid === "loyal") quitChance *= 0.3;
      if (tid === "prima_donna") quitChance += 0.005;
      if (tid === "burnout_prone") burnoutProne = true;
      // Generic quit_risk effect from trait definitions
      // (charismatic = -0.4, prima_donna = +0.3, mercenary = +0.2, etc.)
      // Already partly handled above; the trait definitions remain the
      // canonical source for finer effects but this loop reads only ids.
    }
    // Burnout-prone staff with low health amplify further.
    if (burnoutProne && staff.health < 50) quitChance += 0.015;
    quitChance = Math.min(0.25, quitChance);

    if (quitChance <= 0) continue;
    const [roll, r1] = rngInt(rng, 0, 10000);
    rng = r1;
    if (roll / 10000 < quitChance) {
      // Resignation — pick the leading reason for the log body so the player
      // can tell whether to fix morale, fix burnout, or both.
      const reasons: string[] = [];
      if (staff.health < 30) reasons.push("burned out");
      if (staff.morale < 40) reasons.push("morale collapsed");
      if (staff.loyalty < 30) reasons.push("no loyalty left");
      const reasonBody = reasons.length
        ? `Reason: ${reasons.join(", ")}.`
        : "Took a better offer elsewhere.";
      const resigned: Staff = { ...staff, status: "resigned", currentProjectId: null };
      // Unassign from any projects
      const projectUpdates: Record<ID, typeof state.projects[string]> = {};
      for (const project of Object.values(next.projects)) {
        if (project.assignedStaffIds.includes(id)) {
          projectUpdates[project.id] = {
            ...project,
            assignedStaffIds: project.assignedStaffIds.filter((sid) => sid !== id),
          };
        }
      }
      next = {
        ...next,
        staff: { ...next.staff, [id]: resigned },
        projects: { ...next.projects, ...projectUpdates },
      };
      next = appendLog(next, {
        category: "staff",
        headline: `${staff.name} resigned`,
        body: reasonBody,
        severity: "danger",
        relatedIds: { staffId: id },
      });
    }
  }

  return { ...next, rng };
}

// ---- helpers ----
function roleLabel(role: StaffRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
