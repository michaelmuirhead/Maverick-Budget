// IP management — reboots, licensing-out to third parties.
//
// Design notes
// ------------
// • A reboot resets fatigue → 0 but at a fanAffinity cost (creative gamble:
//   purists complain, but the franchise is refreshed). Tracked via rebootCount.
// • Licensing-out lets the player monetize an IP without spending dev capacity:
//   pays an upfront fee + recurring annual royalty until the term ends. While
//   licensed out, the player cannot ship new sequels themselves (enforced by
//   higher layers — this system just records the state).
// • The recurring fee tick is intentionally NOT here yet; this file is pure
//   action handlers. Wire `tickIpLicenses` in once you want passive income.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { IP } from "../types/project";
import { appendLog } from "../core/log";
import { addDays, isoToDate, dateToIso } from "../core/time";

// ============ TUNABLES ============
export const REBOOT_AFFINITY_COST = 20;
export const REBOOT_FATIGUE_RESET = 0;

// License pricing — based on IP strength (peak score & affinity).
// Upfront ≈ peakScore * affinity * 1000 cents per point. Tunable.
export const LICENSE_UPFRONT_PER_QUALITY_POINT = 1_000;
export const LICENSE_ANNUAL_RATE = 0.18; // annual fee = 18% of upfront
export const DEFAULT_LICENSE_TERM_YEARS = 5;

// ============ RENAME IP ============
// Players can rebrand a franchise freely. The original Project record is
// IMMUTABLE — shipped games keep the name they launched under, forever —
// but the IP banner above them can drift (e.g. first game was "Orc Raider"
// but the franchise becomes "Tides of Magic" after three entries).
//
// Empty / whitespace-only names are rejected; leading/trailing whitespace
// is trimmed; length is clamped to 60 chars to keep the UI sane.
export const IP_NAME_MAX_LENGTH = 60;

export function renameIp(state: GameState, ipId: ID, newName: string): GameState {
  const ip = state.ips[ipId];
  if (!ip) return state;
  const trimmed = newName.trim().slice(0, IP_NAME_MAX_LENGTH);
  if (trimmed.length === 0) return state;
  if (trimmed === ip.name) return state;

  const oldName = ip.name;
  const updated: IP = { ...ip, name: trimmed };
  let next: GameState = { ...state, ips: { ...state.ips, [ipId]: updated } };
  next = appendLog(next, {
    category: "studio",
    headline: `${oldName} renamed to ${trimmed}`,
    body: `Franchise rebranded. New releases under this IP will use the new name.`,
    severity: "info",
    relatedIds: { projectId: ip.originalProjectId },
  });
  return next;
}

// ============ REBOOT IP ============
export function rebootIp(state: GameState, ipId: ID): GameState {
  const ip = state.ips[ipId];
  if (!ip) return state;

  const updated: IP = {
    ...ip,
    fatigue: REBOOT_FATIGUE_RESET,
    fanAffinity: Math.max(0, ip.fanAffinity - REBOOT_AFFINITY_COST),
    rebootCount: (ip.rebootCount ?? 0) + 1,
    lastRebootDate: state.currentDate,
  };

  let next: GameState = { ...state, ips: { ...state.ips, [ipId]: updated } };
  next = appendLog(next, {
    category: "studio",
    headline: `${ip.name} rebooted`,
    body: `Franchise fatigue cleared. Some long-time fans are unhappy (-${REBOOT_AFFINITY_COST} affinity), but the slate is clean for a new direction.`,
    severity: "info",
    relatedIds: { projectId: ip.originalProjectId },
  });
  return next;
}

// ============ LICENSE IP OUT ============
// Hands the IP to a third-party studio for `years` years. Player gets an
// upfront cash payment plus a recurring annual royalty (not yet wired into
// daily tick — this just records the deal).
export function licenseIpOut(
  state: GameState,
  ipId: ID,
  options?: {
    years?: number;
    licenseeId?: ID;
    upfrontOverride?: Money;
    annualOverride?: Money;
  }
): GameState {
  const ip = state.ips[ipId];
  if (!ip) return state;
  if (ip.licensedOut) return state; // already licensed

  const years = options?.years ?? DEFAULT_LICENSE_TERM_YEARS;

  // Quality score = peak metacritic * fanAffinity (both 0-100).
  const qualityPoints = Math.max(1, Math.round((ip.peakScore * ip.fanAffinity) / 100));
  const upfront = options?.upfrontOverride ?? qualityPoints * LICENSE_UPFRONT_PER_QUALITY_POINT;
  const annual = options?.annualOverride ?? Math.round(upfront * LICENSE_ANNUAL_RATE);

  const startIso = state.currentDate;
  const endDate = addDays(isoToDate(startIso), years * 365);
  const endIso = dateToIso(endDate);

  const updatedIp: IP = {
    ...ip,
    licensedOut: true,
    licenseStartDate: startIso,
    licenseEndDate: endIso,
    licenseFeePerYear: annual,
    licenseeId: options?.licenseeId,
  };

  let next: GameState = {
    ...state,
    ips: { ...state.ips, [ipId]: updatedIp },
    studio: { ...state.studio, cash: state.studio.cash + upfront, lifetimeRevenue: state.studio.lifetimeRevenue + upfront },
  };

  next = appendLog(next, {
    category: "studio",
    headline: `Licensed ${ip.name} for ${years} years`,
    body: `Signed a third-party licensing deal worth ${formatCents(upfront)} upfront plus ${formatCents(annual)}/yr through ${endIso}.`,
    severity: "success",
    relatedIds: { projectId: ip.originalProjectId },
  });
  return next;
}

// ============ REVOKE / END LICENSE EARLY ============
// Useful for a UI "cancel deal" button (likely with a reputation penalty).
export function revokeIpLicense(state: GameState, ipId: ID): GameState {
  const ip = state.ips[ipId];
  if (!ip || !ip.licensedOut) return state;

  const updatedIp: IP = {
    ...ip,
    licensedOut: false,
    licenseStartDate: undefined,
    licenseEndDate: undefined,
    licenseFeePerYear: undefined,
    licenseeId: undefined,
  };

  let next: GameState = { ...state, ips: { ...state.ips, [ipId]: updatedIp } };
  next = appendLog(next, {
    category: "studio",
    headline: `Licensing deal for ${ip.name} ended`,
    body: `IP is back in-house and available for new projects.`,
    severity: "info",
    relatedIds: { projectId: ip.originalProjectId },
  });
  return next;
}

// ============ MONTHLY LICENSING REVENUE ============
// Licensed-out IPs pay a monthly fraction of their annual license fee.
// Also expires any license whose end date has passed.
export function tickIpLicensingRevenue(state: GameState): GameState {
  let next = state;
  let totalMonthly = 0;
  const updates: Record<ID, IP> = {};

  for (const ip of Object.values(state.ips)) {
    if (!ip.licensedOut) continue;

    // License expiration: return the IP to the studio.
    if (ip.licenseEndDate && ip.licenseEndDate <= state.currentDate) {
      updates[ip.id] = {
        ...ip,
        licensedOut: false,
        licenseStartDate: undefined,
        licenseEndDate: undefined,
        licenseFeePerYear: undefined,
        licenseeId: undefined,
      };
      next = appendLog(next, {
        category: "studio",
        headline: `License for ${ip.name} expired`,
        body: "Franchise is back in-house and available for new projects.",
        severity: "info",
        relatedIds: { projectId: ip.originalProjectId },
      });
      continue;
    }

    // Monthly royalty = 1/12 of the annual fee.
    const annual = ip.licenseFeePerYear ?? 0;
    if (annual > 0) {
      const monthly = Math.round(annual / 12);
      totalMonthly += monthly;
      updates[ip.id] = {
        ...ip,
        lifetimeRevenue: (ip.lifetimeRevenue ?? 0) + monthly,
      };
    }
  }

  if (totalMonthly > 0) {
    next = {
      ...next,
      ips: { ...next.ips, ...updates },
      studio: {
        ...next.studio,
        cash: next.studio.cash + totalMonthly,
        lifetimeRevenue: next.studio.lifetimeRevenue + totalMonthly,
      },
    };
    next = appendLog(next, {
      category: "finance",
      headline: `IP licensing revenue: ${formatCents(totalMonthly)}`,
      body: `From ${Object.values(state.ips).filter((i) => i.licensedOut).length} licensed franchises.`,
      severity: "success",
    });
  } else if (Object.keys(updates).length > 0) {
    // Updates exist but were pure expirations (no revenue this month).
    next = { ...next, ips: { ...next.ips, ...updates } };
  }

  return next;
}

// ============ MONTHLY FATIGUE DECAY ============
// Franchise fatigue drains 2 points per month so resting an over-released
// IP is a valid alternative to the rebootIp action.
export function tickIpFatigueDecay(state: GameState): GameState {
  const updates: Record<ID, IP> = {};
  for (const ip of Object.values(state.ips)) {
    if ((ip.fatigue ?? 0) <= 0) continue;
    updates[ip.id] = { ...ip, fatigue: Math.max(0, (ip.fatigue ?? 0) - 2) };
  }
  if (Object.keys(updates).length === 0) return state;
  return { ...state, ips: { ...state.ips, ...updates } };
}

// ---- internal ----
function formatCents(c: number): string {
  const d = c / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000) return `$${(d / 1_000).toFixed(0)}K`;
  return `$${d.toFixed(0)}`;
}
