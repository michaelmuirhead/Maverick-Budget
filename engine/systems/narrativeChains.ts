// Narrative chain runtime.
//
// A "chain" is a multi-beat story (see engine/data/narrativeChains.ts) that
// fires across in-game time. Three responsibilities:
//
//  1. Triggering — daily probability roll for any chain that's eligible and
//     not already active or completed. Once triggered, the entry beat fires
//     immediately and the chain enters state.activeChains.
//  2. Advancing — beats with `autoAdvance` schedule a future fire date by
//     setting (nextBeatDate, pendingNextBeatId) on the active chain record.
//     On each tick, any active chain whose nextBeatDate has arrived fires
//     pendingNextBeatId.
//  3. Resolving choices — when the player resolves a chain-linked pending
//     event, advanceChainOnChoice applies the choice effects, then either
//     schedules the next beat the same way or marks the chain complete.
//
// Chains do NOT compete for the daily random-event slot — they have their
// own scheduling track, so a chain beat can fire on the same day as a
// random event without either being suppressed.

import type { GameState } from "../core/state";
import type { PendingEventChoice, ActiveNarrativeChain } from "../core/state";
import type { ChainEffects, NarrativeChainDef } from "../data/narrativeChains";

import { NARRATIVE_CHAINS } from "../data/narrativeChains";
import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate, dateToIso, addDays, compareDate } from "../core/time";
import { rngChance } from "../core/rng";

// ============ EFFECTS APPLICATION ============
function applyChainEffects(state: GameState, effects: ChainEffects | undefined): GameState {
  if (!effects) return state;
  let next = state;

  if (effects.cash !== undefined && effects.cash !== 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + effects.cash,
        // Treat positive cash deltas from chains as windfall revenue so the
        // financial chart records them.
        lifetimeRevenue: effects.cash > 0
          ? next.studio.lifetimeRevenue + effects.cash
          : next.studio.lifetimeRevenue,
      },
    };
  }

  if (effects.reputation !== undefined && effects.reputation !== 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        reputation: Math.max(0, Math.min(100, next.studio.reputation + effects.reputation)),
      },
    };
  }

  if (effects.moraleAll !== undefined && effects.moraleAll !== 0) {
    const staffUpdates: typeof next.staff = {};
    for (const [sid, s] of Object.entries(next.staff)) {
      if (s.status !== "employed") continue;
      staffUpdates[sid] = {
        ...s,
        morale: Math.max(0, Math.min(100, s.morale + effects.moraleAll)),
      };
    }
    next = { ...next, staff: { ...next.staff, ...staffUpdates } };
  }

  if (effects.setFlag) {
    next = {
      ...next,
      flags: { ...next.flags, [effects.setFlag]: true },
    };
  }

  return next;
}

// ============ TRIGGER ELIGIBILITY ============
// Returns true if a chain is eligible to roll for triggering today. Does NOT
// check the probability roll itself — that's done in tickNarrativeChains.
function isChainEligible(state: GameState, def: NarrativeChainDef): boolean {
  // Already running.
  if (state.activeChains[def.id]) return false;
  // Already completed (oneShot is the default; only re-trigger if explicitly
  // marked oneShot=false AND the chain isn't currently active).
  const oneShot = def.oneShot !== false;
  if (oneShot && state.completedChainIds.includes(def.id)) return false;

  const cond = def.triggerConditions;
  if (!cond) return true;

  const today = isoToDate(state.currentDate);
  if (cond.minYear !== undefined && today.year < cond.minYear) return false;
  if (cond.maxYear !== undefined && today.year > cond.maxYear) return false;
  if (cond.minReputation !== undefined && state.studio.reputation < cond.minReputation) return false;
  if (cond.maxReputation !== undefined && state.studio.reputation > cond.maxReputation) return false;

  if (cond.minStaffCount !== undefined) {
    const employed = Object.values(state.staff).filter((s) => s.status === "employed").length;
    if (employed < cond.minStaffCount) return false;
  }
  if (cond.minCash !== undefined && state.studio.cash < cond.minCash) return false;

  if (cond.requiresReleasedGame) {
    const hasRelease = Object.values(state.projects).some((p) => p.status === "released");
    if (!hasRelease) return false;
  }

  if (cond.requiresFlag && !state.flags[cond.requiresFlag]) return false;
  if (cond.blockedByFlag && state.flags[cond.blockedByFlag]) return false;

  return true;
}

// ============ DAILY TICK ============
// Runs every day. Two responsibilities:
//   1. Fire any active chain whose nextBeatDate has arrived → pendingNextBeatId.
//   2. Roll triggers for inactive eligible chains.
//
// Triggers run AFTER advances so a chain can't simultaneously trigger and
// auto-advance on the same day.
export function tickNarrativeChains(state: GameState): GameState {
  let next = state;
  const today = isoToDate(next.currentDate);

  // ---- 1. Advance any active chains whose nextBeatDate has arrived ----
  // Snapshot keys so mutations during iteration don't interfere.
  const activeChainIds = Object.keys(next.activeChains);
  for (const chainId of activeChainIds) {
    const active = next.activeChains[chainId];
    if (!active) continue;
    if (!active.nextBeatDate || !active.pendingNextBeatId) continue;
    const due = isoToDate(active.nextBeatDate);
    if (compareDate(today, due) < 0) continue;  // not yet

    const def = NARRATIVE_CHAINS.find((c) => c.id === chainId);
    if (!def) continue;
    next = fireChainBeat(next, def, active.pendingNextBeatId);
  }

  // ---- 2. Trigger eligibility rolls ----
  // Cap to 1 chain trigger per day so the news feed doesn't get drowned.
  let triggeredThisDay = 0;
  for (const def of NARRATIVE_CHAINS) {
    if (triggeredThisDay >= 1) break;
    if (!isChainEligible(next, def)) continue;
    let rng = next.rng;
    const [roll, r1] = rngChance(rng, def.baseProbability);
    rng = r1;
    next = { ...next, rng };
    if (!roll) continue;
    // Fire the entry beat (beats[0]).
    const entry = def.beats[0];
    if (!entry) continue;
    next = fireChainBeat(next, def, entry.id);
    triggeredThisDay++;
  }

  return next;
}

// ============ FIRE A BEAT ============
// Logs the beat, applies its effects, then handles what happens next:
//   - choices: enqueue a pendingEvent, park the chain.
//   - autoAdvance: schedule the next beat via (nextBeatDate, pendingNextBeatId).
//   - endsChain (or no follow-up): mark chain complete.
export function fireChainBeat(
  state: GameState,
  def: NarrativeChainDef,
  beatId: string
): GameState {
  let next = state;
  const beat = def.beats.find((b) => b.id === beatId);
  if (!beat) return next;

  // 1. Append the news log entry.
  next = appendLog(next, {
    category: "event",
    headline: beat.headline,
    body: beat.body,
    severity: beat.severity ?? "info",
  });

  // 2. Apply beat effects.
  next = applyChainEffects(next, beat.effects);

  // 3. Update / create the active chain record. Wipe any stale scheduling
  // — fields are re-set below depending on how the beat resolves.
  let active: ActiveNarrativeChain = next.activeChains[def.id] ?? {
    chainId: def.id,
    currentBeatId: beat.id,
    startedDate: next.currentDate,
  };
  active = {
    ...active,
    currentBeatId: beat.id,
    nextBeatDate: undefined,
    pendingNextBeatId: undefined,
    pendingEventId: undefined,
  };

  // 4. Decide what happens next.
  if (beat.choices && beat.choices.length > 0) {
    // Park on a pending event. The pending carries the chain pointer so
    // resolveEventChoice can route back into advanceChainOnChoice.
    let rng = next.rng;
    const [pendingId, r1] = generateId("pend", rng);
    rng = r1;
    const pending: PendingEventChoice = {
      id: pendingId,
      // Synthetic eventDefId so the modal can fall back to chain data.
      // Format is `chain:{chainId}:{beatId}`.
      eventDefId: `chain:${def.id}:${beat.id}`,
      spawnedDate: next.currentDate,
      chain: { chainId: def.id, beatId: beat.id },
    };
    active = { ...active, pendingEventId: pendingId };
    next = {
      ...next,
      rng,
      pendingEvents: [...next.pendingEvents, pending],
    };
  } else if (beat.autoAdvance) {
    // Schedule the next beat using the unified scheduling fields.
    const today = isoToDate(next.currentDate);
    const fireDate = dateToIso(addDays(today, beat.autoAdvance.delayDays));
    active = {
      ...active,
      nextBeatDate: fireDate,
      pendingNextBeatId: beat.autoAdvance.nextBeatId,
    };
  } else {
    // Terminal — either explicit endsChain or no follow-up declared.
    const newActive = { ...next.activeChains };
    delete newActive[def.id];
    next = {
      ...next,
      activeChains: newActive,
      completedChainIds: next.completedChainIds.includes(def.id)
        ? next.completedChainIds
        : [...next.completedChainIds, def.id],
    };
    return next;
  }

  // 5. Persist the active chain record.
  next = {
    ...next,
    activeChains: { ...next.activeChains, [def.id]: active },
  };
  return next;
}

// ============ CHOICE RESOLUTION ============
// Called from resolveEventChoice when the resolved pending carries a chain
// pointer. Applies the choice effects, then either schedules the next beat
// or ends the chain.
export function advanceChainOnChoice(
  state: GameState,
  chainId: string,
  beatId: string,
  choiceId: string
): GameState {
  let next = state;
  const def = NARRATIVE_CHAINS.find((c) => c.id === chainId);
  if (!def) return next;
  const beat = def.beats.find((b) => b.id === beatId);
  if (!beat) return next;
  const choice = beat.choices?.find((c) => c.id === choiceId);
  if (!choice) return next;

  // 1. Apply the choice effects.
  next = applyChainEffects(next, choice.effects);

  // 2. Log the choice as a follow-up beat. Use the choice label as headline
  // so the news feed shows the player's decision, not just the prompt.
  next = appendLog(next, {
    category: "event",
    headline: `${def.name}: ${choice.label}`,
    body: choice.description,
    severity: "info",
  });

  // 3. Decide where the chain goes next.
  if (choice.endsChain || !choice.nextBeatId) {
    // Terminal choice — mark chain complete.
    const newActive = { ...next.activeChains };
    delete newActive[chainId];
    next = {
      ...next,
      activeChains: newActive,
      completedChainIds: next.completedChainIds.includes(chainId)
        ? next.completedChainIds
        : [...next.completedChainIds, chainId],
    };
    return next;
  }

  // Schedule the next beat. delay <= 0 fires immediately.
  const delay = choice.delayDays ?? 7;
  if (delay <= 0) {
    return fireChainBeat(next, def, choice.nextBeatId);
  }

  const today = isoToDate(next.currentDate);
  const fireDate = dateToIso(addDays(today, delay));
  const active: ActiveNarrativeChain = {
    ...(next.activeChains[chainId] ?? {
      chainId,
      currentBeatId: beatId,
      startedDate: next.currentDate,
    }),
    currentBeatId: beatId,
    nextBeatDate: fireDate,
    pendingNextBeatId: choice.nextBeatId,
    pendingEventId: undefined,
  };
  next = {
    ...next,
    activeChains: { ...next.activeChains, [chainId]: active },
  };
  return next;
}
