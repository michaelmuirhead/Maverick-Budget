// Offensive studio acquisitions (#119).
//
// Lets the player make a hostile-style acquisition of an active competitor
// studio. Unlike publisher acquisitions (which scoop up an entire publishing
// catalog and routing surface), competitor acquisitions are a one-time cash
// outlay that:
//
//   1. Pays competitor.marketCap × ACQUISITION_PREMIUM as upfront cash.
//   2. Marks the competitor `status: "acquired"`, `acquiredBy: <studio.id>`.
//      The competitor stops ticking (tickCompetitors only runs on "active").
//   3. Transfers any owned engine records to the player's studio.
//      (Competitor IPs aren't full IP records in state.ips, so we don't
//      transfer those — they're just a count on the competitor's record.)
//   4. Cancels any in-flight competitor project (clears the flag/metadata
//      slots used by the competitor AI).
//   5. Applies a small reputation bonus (the studio looks bigger and more
//      consequential after a high-profile signing).
//   6. Runs an antitrust check — if the player now controls a "dominant"
//      share of the active studio roster, log a warning event and apply a
//      reputation HIT to balance the bonus. (Hooked up as a log + rep hit
//      for now; richer regulator events live behind #138 in the backlog.)
//
// Cost intentionally rougher than publisher acquisitions (which are 1.15x).
// A hostile competitor takeover should sting a little more.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import { appendLog } from "../core/log";
import { applyRepHit } from "./reputation";

// Premium over marketCap demanded for a competitor takeover.
export const COMPETITOR_ACQUISITION_PREMIUM = 1.2;

// Reputation bump from a successful acquisition (capped at 100 elsewhere).
const ACQUISITION_REP_BONUS = 4;

// Antitrust threshold: if (player + owned competitors) make up more than this
// fraction of the active studio roster, trigger a regulator warning.
const ANTITRUST_SHARE_THRESHOLD = 0.35;
// Reputation hit applied when antitrust scrutiny lands.
const ANTITRUST_REP_PENALTY = 8;
// Decay window for the antitrust rep hit — it's a temporary scar, not a
// permanent one.
const ANTITRUST_DECAY_DAYS = 365 * 3;

// Flag/metadata key shapes match those in systems/competitors.ts. Kept here as
// constants so a rename in one place is caught by tooling immediately.
function competitorFlagKeys(compId: ID): string[] {
  return [
    `comp_${compId}_inprog`,
    `comp_${compId}_sequel`,
  ];
}
function competitorMetadataKeys(compId: ID): string[] {
  return [
    `comp_${compId}_releaseOn`,
    `comp_${compId}_title`,
    `comp_${compId}_genre`,
    `comp_${compId}_engine`,
    `comp_${compId}_budget`,
  ];
}

// Compute the price the player must pay to acquire a given competitor.
// Exposed so the UI can render the same number used at action time.
export function competitorAcquisitionPrice(marketCap: Money): Money {
  return Math.max(0, Math.round(marketCap * COMPETITOR_ACQUISITION_PREMIUM));
}

// ============ MAIN ACTION ============

export function acquireCompetitor(state: GameState, competitorId: ID): GameState {
  const comp = state.competitors[competitorId];
  if (!comp) return state;

  if (comp.status !== "active") {
    return appendLog(state, {
      category: "competitor",
      headline: `Cannot acquire ${comp.name}: studio is ${comp.status}`,
      severity: "warning",
      relatedIds: { competitorId },
    });
  }

  const price = competitorAcquisitionPrice(comp.marketCap);
  if (state.studio.cash < price) {
    return appendLog(state, {
      category: "finance",
      headline: `Cannot afford to acquire ${comp.name}`,
      body: `Need ${formatBriefCents(price)}, you have ${formatBriefCents(state.studio.cash)}.`,
      severity: "warning",
    });
  }

  // ---- Charge the cash, mark the competitor acquired ----
  let next: GameState = {
    ...state,
    studio: {
      ...state.studio,
      cash: state.studio.cash - price,
    },
    competitors: {
      ...state.competitors,
      [competitorId]: {
        ...comp,
        status: "acquired",
        acquiredBy: state.studio.id,
        // Wipe their active project ids — they won't ship anything new.
        activeProjectIds: [],
      },
    },
  };

  // ---- Transfer owned engines into the studio's roster ----
  const transferredEngineIds: ID[] = [];
  if (comp.ownedEngineIds.length > 0) {
    const existing = new Set(next.studio.ownedEngineIds);
    const updatedEngines = { ...next.engines };
    for (const eid of comp.ownedEngineIds) {
      const eng = updatedEngines[eid];
      if (!eng) continue;
      // Reassign ownership to the player's studio. Keep maintenance + status.
      updatedEngines[eid] = { ...eng, ownerStudioId: next.studio.id };
      if (!existing.has(eid)) transferredEngineIds.push(eid);
    }
    next = {
      ...next,
      engines: updatedEngines,
      studio: {
        ...next.studio,
        ownedEngineIds: [...next.studio.ownedEngineIds, ...transferredEngineIds],
      },
    };
  }

  // ---- Clear in-flight competitor project flags / metadata ----
  const newFlags = { ...next.flags };
  for (const k of competitorFlagKeys(competitorId)) {
    if (k in newFlags) delete newFlags[k];
  }
  const newMetadata = { ...next.metadata };
  for (const k of competitorMetadataKeys(competitorId)) {
    if (k in newMetadata) delete newMetadata[k];
  }
  next = { ...next, flags: newFlags, metadata: newMetadata };

  // ---- Reputation bump (success / clout) ----
  next = {
    ...next,
    studio: {
      ...next.studio,
      reputation: Math.min(100, next.studio.reputation + ACQUISITION_REP_BONUS),
    },
  };

  // ---- Headline log ----
  next = appendLog(next, {
    category: "competitor",
    headline: `Acquired ${comp.name} for ${formatBriefCents(price)}`,
    body:
      `Hostile takeover complete. ` +
      (transferredEngineIds.length > 0
        ? `${transferredEngineIds.length} engine(s) transferred to your studio. `
        : "") +
      `+${ACQUISITION_REP_BONUS} reputation.`,
    severity: "success",
    relatedIds: { competitorId },
  });

  // ---- Antitrust check ----
  next = maybeTriggerAntitrust(next, comp.name);

  return next;
}

// ============ ANTITRUST ============

function maybeTriggerAntitrust(state: GameState, justAcquiredName: string): GameState {
  const allComps = Object.values(state.competitors);
  // Active studio universe = active competitors + the player.
  const activeCount = allComps.filter((c) => c.status === "active").length + 1;
  // Studios under the player's umbrella: directly acquired by the player +
  // those owned by publishers whose ownerStudioId is the player.
  const playerOwnedCompetitorIds = new Set<ID>();
  for (const c of allComps) {
    if (c.status === "acquired" && c.acquiredBy === state.studio.id) {
      playerOwnedCompetitorIds.add(c.id);
    }
  }
  for (const p of Object.values(state.publishers)) {
    if (p.ownerStudioId !== state.studio.id) continue;
    for (const cid of p.ownedStudioIds) {
      playerOwnedCompetitorIds.add(cid);
    }
  }
  const playerControlledCount = playerOwnedCompetitorIds.size + 1; // +1 for the player

  // Total denominator: active rivals still standing + everyone the player owns
  // (acquired competitors don't appear in `active` because their status is
  // "acquired") + the player.
  const denom = activeCount + playerOwnedCompetitorIds.size;
  const share = denom > 0 ? playerControlledCount / denom : 0;
  if (share <= ANTITRUST_SHARE_THRESHOLD) return state;

  const sharePct = (share * 100).toFixed(0);
  let next = appendLog(state, {
    category: "event",
    headline: `Antitrust regulators open inquiry into ${state.studio.name}`,
    body:
      `Your studio + subsidiaries now control roughly ${sharePct}% of active developers. ` +
      `The press has opinions about the ${justAcquiredName} deal. ` +
      `Reputation hit: -${ANTITRUST_REP_PENALTY} (decays over 3 years).`,
    severity: "warning",
  });
  next = applyRepHit(next, {
    source: `Antitrust scrutiny: ${justAcquiredName} acquisition`,
    totalPenalty: ANTITRUST_REP_PENALTY,
    decayDurationDays: ANTITRUST_DECAY_DAYS,
  });
  return next;
}

// ============ HELPERS ============

function formatBriefCents(cents: Money): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
  if (dollars >= 1_000_000)     return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000)         return `$${Math.round(dollars / 1_000)}K`;
  return `$${Math.round(dollars).toLocaleString()}`;
}
