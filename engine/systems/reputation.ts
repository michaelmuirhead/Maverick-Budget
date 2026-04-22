// Reputation hits + linear decay.
//
// Per MGT MMO rules (memory, 2026-04-20):
//  - A botched live-service sunset (or other major studio fumble) deducts
//    reputation immediately, but the wound heals: the penalty is restored
//    linearly over the configured decay window (default ~10 in-game years).
//  - We store each hit on Studio.repHits so the UI can show *why* the studio
//    is still under-performing on rep, not just a faceless number drop.
//
// Implementation:
//  - applyRepHit() deducts the penalty up-front, appends a RepHit record,
//    and emits a log entry. Call from any system that wants to register a
//    fading penalty (sunsets, scandals, layoffs, etc.).
//  - tickRepDecay() runs monthly from onMonthStart. Each active hit restores
//    a slice of its penalty (totalPenalty / months), capped so restoredAmount
//    never exceeds totalPenalty. Fully-restored hits drop off the list.
//
// Note: decay only restores reputation up to its pre-hit level *in aggregate*
// — we don't rewind every other rep change in between. This is intentional:
// the player keeps recent gains and the historical scar simply fades.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { RepHit } from "../core/state";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";

// Default decay window — 10 in-game years.
export const DEFAULT_REP_DECAY_DAYS = 365 * 10;

export interface ApplyRepHitInput {
  source: string;                  // human-readable label
  totalPenalty: number;            // positive number; will be deducted from rep
  decayDurationDays?: number;      // defaults to 10 years
  relatedProjectId?: ID;
}

export function applyRepHit(state: GameState, input: ApplyRepHitInput): GameState {
  const penalty = Math.max(0, Math.round(input.totalPenalty));
  if (penalty <= 0) return state;

  let rng = state.rng;
  const [hitId, r1] = generateId("rephit", rng);
  rng = r1;

  const hit: RepHit = {
    id: hitId,
    source: input.source,
    incurredDate: state.currentDate,
    totalPenalty: penalty,
    restoredAmount: 0,
    decayDurationDays: Math.max(30, Math.round(input.decayDurationDays ?? DEFAULT_REP_DECAY_DAYS)),
    relatedProjectId: input.relatedProjectId,
  };

  let next: GameState = {
    ...state,
    rng,
    studio: {
      ...state.studio,
      reputation: Math.max(0, state.studio.reputation - penalty),
      repHits: [...state.studio.repHits, hit],
    },
  };

  next = appendLog(next, {
    category: "studio",
    headline: `Reputation hit: -${penalty} (${input.source})`,
    body: `Will recover linearly over ${Math.round((hit.decayDurationDays / 365) * 10) / 10} years.`,
    severity: "warning",
    relatedIds: input.relatedProjectId ? { projectId: input.relatedProjectId } : undefined,
  });

  return next;
}

// Monthly tick: restore one month's worth of each active hit.
// 30-day month for restoration math (matches the rest of the sim's coarse cadence).
export function tickRepDecay(state: GameState): GameState {
  if (state.studio.repHits.length === 0) return state;

  let totalRestoredThisTick = 0;
  const remainingHits: RepHit[] = [];

  for (const hit of state.studio.repHits) {
    const monthsTotal = Math.max(1, Math.round(hit.decayDurationDays / 30));
    const perMonth = hit.totalPenalty / monthsTotal;
    const newRestored = Math.min(hit.totalPenalty, hit.restoredAmount + perMonth);
    const restoredDelta = newRestored - hit.restoredAmount;
    totalRestoredThisTick += restoredDelta;

    if (newRestored < hit.totalPenalty) {
      remainingHits.push({ ...hit, restoredAmount: newRestored });
    }
    // else: fully restored, drop the hit
  }

  // Apply restoration as integer rep points; bank the fractional remainder
  // in metadata so we don't lose it across months.
  const carriedKey = "rep_decay_carry";
  const prevCarry = Number(state.metadata[carriedKey] ?? 0);
  const totalWithCarry = totalRestoredThisTick + prevCarry;
  const wholePoints = Math.floor(totalWithCarry);
  const newCarry = totalWithCarry - wholePoints;

  const newRep = Math.min(100, state.studio.reputation + wholePoints);

  return {
    ...state,
    studio: {
      ...state.studio,
      reputation: newRep,
      repHits: remainingHits,
    },
    metadata: {
      ...state.metadata,
      [carriedKey]: newCarry,
    },
  };
}

// Selector: how much penalty is currently outstanding (sum of unrestored amounts).
export function totalOutstandingRepPenalty(state: GameState): number {
  let total = 0;
  for (const hit of state.studio.repHits) {
    total += hit.totalPenalty - hit.restoredAmount;
  }
  return Math.round(total);
}
