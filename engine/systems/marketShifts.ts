// Market-mover system.
//
// Per MGT MMO/market rules (memory, 2026-04-20):
//   1. A successful release CAN trigger an industry "shift" for its
//      (genre × theme) combo. The shift boosts demand for the same combo
//      across the industry for 18-48 months.
//   2. Trigger conditions (non-MMO):
//        - lifetime sales reaches the era's 90th-percentile threshold
//        - peak hype ≥ 80
//      Critical acclaim is NOT required — a hype-driven smash counts.
//   3. MMO trigger uses peak concurrent subscribers (live-service player
//      count) instead of peak hype. The sales threshold still applies.
//   4. Tier scales with how far the release exceeds threshold:
//        - trend       (≤ +25% over threshold) → ×1.25 for 18 months
//        - wave        (+25% to +75%)          → ×1.50 for 30 months
//        - era_definer (> +75%)                → ×1.75 for 48 months
//   5. Each subsequent release in the same combo bumps copycatCount and
//      shaves SATURATION_PER_COPYCAT off the effective multiplier.
//   6. After endDate, the shift moves to playedOutShifts where the same
//      combo *undershoots* baseline (×PLAYED_OUT_MULTIPLIER) for
//      PLAYED_OUT_DAYS, then expires entirely.
//
// All multipliers are looked up via marketShiftMultiplierFor() and applied
// inside projectSales() in release.ts.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { GenreId } from "../types/genre";
import type { ThemeId, MarketShift, MarketShiftTier } from "../types";

import {
  TIER_DURATION_DAYS, TIER_MULTIPLIER, PLAYED_OUT_MULTIPLIER, PLAYED_OUT_DAYS,
  effectiveMultiplier, tierLabel,
} from "../types/marketShift";
import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, isoToDate, dateToIso } from "../core/time";

// ============ ERA-NORMALIZED SALES THRESHOLD ============
// 90th-percentile lifetime-sales benchmark for a "this game moved the market"
// release. Calibrated to actual industry numbers (rough — tuned later).
//
// Returned in *units* (not money), since release.ts computes lifetime units
// before revenue.
export function era90thPercentileSales(year: number): number {
  if (year < 1980)  return 80_000;
  if (year < 1985)  return 250_000;
  if (year < 1990)  return 600_000;
  if (year < 1995)  return 1_500_000;
  if (year < 2000)  return 3_000_000;
  if (year < 2005)  return 5_000_000;
  if (year < 2010)  return 7_000_000;
  if (year < 2015)  return 9_000_000;
  if (year < 2020)  return 11_000_000;
  if (year < 2025)  return 13_000_000;
  return 15_000_000;
}

// Equivalent "smash CCU" threshold for MMO triggers — the spec says we use
// peak concurrent subscribers in lieu of hype, but still gated by the
// lifetime-sales threshold (which for MMOs corresponds to total accounts).
export function mmoPeakCcuThreshold(year: number): number {
  if (year < 2000)  return 5_000;
  if (year < 2005)  return 50_000;
  if (year < 2010)  return 250_000;
  if (year < 2015)  return 500_000;
  return 1_000_000;
}

// ============ EVALUATE TRIGGER FROM A FRESH RELEASE ============
// Called from release.ts immediately after the ActiveSale is created with a
// projected lifetime-sales number. Inspects the release and either spawns a
// MarketShift or no-ops.
export function evaluateMarketShiftFromRelease(
  state: GameState,
  input: {
    projectId: ID;
    projectName: string;
    genre: GenreId;
    theme: ThemeId;
    projectedLifetimeSales: number;
    peakHype: number;            // 0-100 — current hype at release
    isMmo?: boolean;             // true for live-service launches
    peakCcu?: number;            // for MMOs — peak concurrent users
  }
): GameState {
  const year = isoToDate(state.currentDate).year;
  const threshold = era90thPercentileSales(year);
  if (input.projectedLifetimeSales < threshold) return state;

  // Hype / CCU gate
  if (input.isMmo) {
    if ((input.peakCcu ?? 0) < mmoPeakCcuThreshold(year)) return state;
  } else {
    if (input.peakHype < 80) return state;
  }

  // Tier from how much it exceeded threshold
  const overshoot = input.projectedLifetimeSales / threshold;
  let tier: MarketShiftTier;
  if (overshoot >= 1.75) tier = "era_definer";
  else if (overshoot >= 1.25) tier = "wave";
  else tier = "trend";

  let rng = state.rng;
  const [shiftId, r1] = generateId("shift", rng);
  rng = r1;

  const startDate = state.currentDate;
  const endDate = dateToIso(addDays(isoToDate(startDate), TIER_DURATION_DAYS[tier]));

  const shift: MarketShift = {
    id: shiftId,
    genre: input.genre,
    theme: input.theme,
    sourceProjectId: input.projectId,
    sourceProjectName: input.projectName,
    sourceStudioName: state.studio.name,
    isMmoTriggered: !!input.isMmo,
    startDate,
    endDate,
    tier,
    baseMultiplier: TIER_MULTIPLIER[tier],
    copycatCount: 0,
  };

  let next: GameState = {
    ...state,
    rng,
    market: {
      ...state.market,
      activeShifts: [...state.market.activeShifts, shift],
    },
  };

  next = appendLog(next, {
    category: "market",
    headline: `Market mover: ${input.projectName} starts a ${tierLabel(tier)}`,
    body: `${input.genre} × ${input.theme} demand boosted ×${shift.baseMultiplier.toFixed(2)} for ${Math.round(TIER_DURATION_DAYS[tier] / 30)} months. Expect copycats.`,
    severity: "success",
    relatedIds: { projectId: input.projectId },
  });

  return next;
}

// ============ COPYCAT TRACKING ============
// Called from release.ts on every release (player or competitor) to bump the
// saturation counter of any active shifts that match the release's combo.
// Skip the source release itself.
export function recordCopycatRelease(
  state: GameState,
  input: { projectId: ID; genre: GenreId; theme: ThemeId }
): GameState {
  if (state.market.activeShifts.length === 0) return state;
  let bumped = false;
  const updated = state.market.activeShifts.map((shift) => {
    if (shift.sourceProjectId === input.projectId) return shift;       // not its own copycat
    if (shift.genre !== input.genre) return shift;
    if (shift.theme !== input.theme) return shift;
    bumped = true;
    return { ...shift, copycatCount: shift.copycatCount + 1 };
  });
  if (!bumped) return state;
  return {
    ...state,
    market: { ...state.market, activeShifts: updated },
  };
}

// ============ MULTIPLIER LOOKUP ============
// Returns the demand multiplier currently applied to a (genre × theme) combo.
// 1.0 = neutral. Active shifts boost; played-out shifts undershoot.
// If both apply (a wave just ended and another is active), use the active.
export function marketShiftMultiplierFor(
  state: GameState,
  genre: GenreId,
  theme: ThemeId
): number {
  for (const shift of state.market.activeShifts) {
    if (shift.genre === genre && shift.theme === theme) {
      return effectiveMultiplier(shift);
    }
  }
  for (const shift of state.market.playedOutShifts) {
    if (shift.genre === genre && shift.theme === theme) {
      return PLAYED_OUT_MULTIPLIER;
    }
  }
  return 1.0;
}

// Returns the active shift for the (genre × theme) if any — used by UI.
export function activeShiftFor(
  state: GameState,
  genre: GenreId,
  theme: ThemeId
): MarketShift | undefined {
  return state.market.activeShifts.find(
    (s) => s.genre === genre && s.theme === theme
  );
}

// ============ MONTHLY ROTATION ============
// Move expired active shifts into the played-out bucket; remove played-out
// shifts whose undershoot window has also expired.
export function tickMarketShifts(state: GameState): GameState {
  const today = state.currentDate;

  // Partition active by whether they've expired
  const stillActive: MarketShift[] = [];
  const newlyExpired: MarketShift[] = [];
  for (const shift of state.market.activeShifts) {
    if (shift.endDate <= today) newlyExpired.push(shift);
    else stillActive.push(shift);
  }

  // Drop played-out shifts whose undershoot window has elapsed
  const stillPlayedOut: MarketShift[] = [];
  for (const shift of state.market.playedOutShifts) {
    const playedOutEndIso = dateToIso(addDays(isoToDate(shift.endDate), PLAYED_OUT_DAYS));
    if (playedOutEndIso > today) stillPlayedOut.push(shift);
  }

  if (newlyExpired.length === 0 && stillPlayedOut.length === state.market.playedOutShifts.length) {
    // No-op: nothing changed.
    return state;
  }

  let next: GameState = {
    ...state,
    market: {
      ...state.market,
      activeShifts: stillActive,
      playedOutShifts: [...stillPlayedOut, ...newlyExpired],
    },
  };

  for (const shift of newlyExpired) {
    next = appendLog(next, {
      category: "market",
      headline: `${tierLabel(shift.tier)} winding down: ${shift.genre} × ${shift.theme}`,
      body: `Sparked by ${shift.sourceProjectName}. The combo will undershoot demand for the next 12 months as the market moves on.`,
      severity: "info",
      relatedIds: { projectId: shift.sourceProjectId },
    });
  }

  return next;
}

// Helper for UI / future competitor pivots: list combos currently amplified.
export function listActiveShifts(state: GameState): MarketShift[] {
  return state.market.activeShifts;
}
