// Market-mover / industry shift records.
//
// Per MGT MMO/market rules (memory, 2026-04-20):
//   A successful release shifts industry demand for its genre × theme combo
//   for 18–48 in-game months. Trigger requires strong sales (era 90th+
//   percentile) AND peak hype ≥ 80. Doesn't require critical acclaim — a
//   hype-fueled commercial smash counts.
//
//   Three dominance tiers — trend / wave / era-definer — with multiplicative
//   demand boosts of ×1.25 / ×1.50 / ×1.75 respectively.
//
//   Each copycat release in the same genre × theme decays the bonus
//   slightly (saturation). When the wave expires the genre × theme
//   undershoots its baseline by ~12 months ("played out" effect).
//
//   MMOs (live-service projects) trigger on peak concurrent subscriber
//   count rather than peak hype — they're a slow-burn medium.

import type { ID } from "./core";
import type { GenreId } from "./genre";
import type { ThemeId } from "./market";

export type MarketShiftTier = "trend" | "wave" | "era_definer";

export interface MarketShift {
  id: ID;
  // The combo this shift moves the market for
  genre: GenreId;
  theme: ThemeId;

  // Origin
  sourceProjectId: ID;
  sourceProjectName: string;
  sourceStudioName?: string;
  isMmoTriggered: boolean;     // true if triggered by a live-service peak CCU rather than hype

  // Lifecycle (ISO dates)
  startDate: string;
  endDate: string;             // wave start + tier-specific duration

  // Effect
  tier: MarketShiftTier;
  baseMultiplier: number;      // 1.25 / 1.50 / 1.75
  // Saturation: each copycat release in the same genre × theme nibbles at the bonus.
  // Effective multiplier = max(1.05, baseMultiplier - copycatCount * SATURATION_PER_COPYCAT)
  copycatCount: number;
}

// Multiplier applied while a shift is active.
export const TIER_MULTIPLIER: Record<MarketShiftTier, number> = {
  trend: 1.25,
  wave: 1.50,
  era_definer: 1.75,
};

// Total active duration in days (mid-range of 18-48 months from spec).
export const TIER_DURATION_DAYS: Record<MarketShiftTier, number> = {
  trend: 18 * 30,
  wave: 30 * 30,
  era_definer: 48 * 30,
};

// Each copycat release shaves this much off the multiplier (additive).
export const SATURATION_PER_COPYCAT = 0.04;

// Floor — even a saturated wave still moves the needle a hair.
export const MIN_EFFECTIVE_MULTIPLIER = 1.05;

// "Played out" undershoot — once a wave ends, the same combo undershoots
// baseline by this much for PLAYED_OUT_DAYS.
export const PLAYED_OUT_MULTIPLIER = 0.85;
export const PLAYED_OUT_DAYS = 365;

// ============ HELPERS ============
export function tierLabel(tier: MarketShiftTier): string {
  switch (tier) {
    case "trend":       return "Trend";
    case "wave":        return "Wave";
    case "era_definer": return "Era-definer";
  }
}

export function effectiveMultiplier(shift: MarketShift): number {
  const raw = shift.baseMultiplier - shift.copycatCount * SATURATION_PER_COPYCAT;
  return Math.max(MIN_EFFECTIVE_MULTIPLIER, raw);
}
