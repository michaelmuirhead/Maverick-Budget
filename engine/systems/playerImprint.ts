// Player Publishing Imprint system.
//
// This is the INVERSE of engine/systems/publishers.ts — instead of external
// publishers making offers on the player's games, the player can FOUND their
// own publishing imprint and then offer publishing deals to competitor
// studios. The imprint is just a Publisher record with `ownerStudioId` set
// to the player's studio id, which means:
//   - The existing `tickPublishersMonthly` rollup already passes its passive
//     monthly cash growth through to the player (catalog revenue).
//   - The existing `applyPublisherRevenueCut` already correctly no-ops for
//     player-published games (net zero).
//
// What this file adds on top:
//   - foundPublisherImprint(): creates a brand-new owned Publisher. Costs
//     scale with tier; the imprint starts small (low reputation, modest
//     cash) and earns prestige via signing deals.
//   - signCompetitorToImprint(): offer a competitor's NEXT released game a
//     flat-advance + revenue-share deal. Competitor accepts probabilistically
//     based on their cash need and how generous the terms are. The deal
//     sits in state.competitorPublishingDeals until the competitor ships,
//     at which point the cut is taken off the top of their lifetime revenue.
//   - applyCompetitorPublisherCutOnRelease(): called from competitors.ts
//     releaseCompetitorGame() to deduct the player's publishing cut from
//     the competitor's lifetime revenue and route it into the imprint (and
//     the player's cash, since it's owned).
//   - expireCompetitorPublishingDeals(): nightly cleanup. Any deal whose
//     window passed without a release goes to "expired" — the advance is
//     a sunk cost.
//
// Tuning notes:
//   - Competitor acceptance uses a logistic-ish score on (advance relative
//     to their cash on hand) + (revenue share favorability). Bigger, richer
//     studios are pickier; struggling indies bite more easily.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { GenreId } from "../types/genre";
import type { Publisher, PublisherTier } from "../types/publisher";
import type { CompetitorPublishingDeal } from "../types/competitorPublishingDeal";
import type { Competitor } from "../types/competitor";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, dateToIso, isoToDate } from "../core/time";
import { rngFloat, rngChance } from "../core/rng";

// ============ TUNING ============

// One-time founding cost per tier. Higher tiers are more expensive because
// they come with more starting cash + reputation.
export const IMPRINT_FOUNDING_COST: Record<PublisherTier, Money> = {
  indie_label: 50_000_000,     // $500K
  mid_major:   500_000_000,    // $5M
  major:     4_000_000_000,    // $40M
  mega:     20_000_000_000,    // $200M
};

// Cash the publisher starts with (separate from founding cost — this is
// what lands inside the imprint's treasury, which then compounds via the
// existing tickPublishersMonthly passive growth).
export const IMPRINT_STARTING_CASH: Record<PublisherTier, Money> = {
  indie_label:  20_000_000,    // $200K
  mid_major:   200_000_000,    // $2M
  major:     1_500_000_000,    // $15M
  mega:      6_000_000_000,    // $60M
};

// Reputation the imprint starts with. Competitors gate their willingness-
// to-sign on this and (separately) the advance size.
export const IMPRINT_STARTING_REPUTATION: Record<PublisherTier, number> = {
  indie_label: 15,
  mid_major:   25,
  major:       40,
  mega:        55,
};

// Deal window — if the competitor doesn't ship inside this, the deal dies
// and the advance is a sunk cost.
const DEAL_WINDOW_DAYS = 540; // ~18 months

// Acceptance thresholds — a competitor will consider signing if:
//   - The advance is at least this fraction of their current cash,
//     OR
//   - They're in enough trouble (cash < minCashForPrideCheck) that ANY
//     advance looks attractive.
const ADVANCE_ATTRACTIVENESS_TARGET = 0.35; // advance >= 35% of their cash = very attractive
const STRUGGLING_CASH_THRESHOLD = 50_000_00; // $500K — below this they'll take almost anything

// Share the competitor is willing to give up to a player imprint.
// Ranges map to acceptance-chance modifiers.
const FAVORABLE_SHARE_MAX = 0.25; // <=25% cut is "generous to the competitor"
const PREDATORY_SHARE_MIN = 0.55; // >=55% is predatory, competitor will almost always refuse

// ============ PUBLIC API ============

// Found a new publishing imprint owned by the player.
// Charges IMPRINT_FOUNDING_COST[tier] from studio cash; creates a Publisher
// record with ownerStudioId set, status "acquired", and starting cash +
// reputation pulled from the tables above.
export function foundPublisherImprint(
  state: GameState,
  opts: {
    name: string;
    hqCity: string;
    tier: PublisherTier;
    preferredGenres: GenreId[];
  }
): GameState {
  const cost = IMPRINT_FOUNDING_COST[opts.tier];
  if (state.studio.cash < cost) {
    return appendLog(state, {
      category: "finance",
      headline: `Cannot found "${opts.name}" — need ${formatCentsBrief(cost)}`,
      body: `You have ${formatCentsBrief(state.studio.cash)}.`,
      severity: "warning",
    });
  }

  // Validate name is non-empty and unique among existing publishers
  const trimmedName = opts.name.trim();
  if (trimmedName.length === 0) return state;
  const nameTaken = Object.values(state.publishers).some(
    (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (nameTaken) {
    return appendLog(state, {
      category: "finance",
      headline: `Cannot name your imprint "${trimmedName}" — already in use`,
      severity: "warning",
    });
  }

  let rng = state.rng;
  const [id, r1] = generateId("pub", rng);
  rng = r1;

  const startingCash = IMPRINT_STARTING_CASH[opts.tier];
  const startingRep = IMPRINT_STARTING_REPUTATION[opts.tier];

  // Base share / advance multipliers mirror PUBLISHER_SEEDS: smaller tiers
  // lean on smaller advances but bigger shares. Tweak slightly cheaper than
  // external publishers, since the player is footing the bill themselves.
  const baseRevenueShare =
    opts.tier === "mega" ? 0.32 :
    opts.tier === "major" ? 0.35 :
    opts.tier === "mid_major" ? 0.32 :
    0.30;
  const baseAdvanceMultiplier =
    opts.tier === "mega" ? 1.6 :
    opts.tier === "major" ? 1.1 :
    opts.tier === "mid_major" ? 0.75 :
    0.55;
  const baseMarketingBudgetMultiplier =
    opts.tier === "mega" ? 0.9 :
    opts.tier === "major" ? 0.65 :
    opts.tier === "mid_major" ? 0.45 :
    0.30;

  const imprint: Publisher = {
    id,
    name: trimmedName,
    hqCity: opts.hqCity || state.studio.name + " HQ",
    foundedYear: isoToDate(state.currentDate).year,
    tier: opts.tier,
    reputation: startingRep,
    cash: startingCash,
    marketCap: Math.round(startingCash * 4 * (1 + startingRep / 100)),
    preferredGenres: opts.preferredGenres,
    minReputationToSign: 0,
    baseRevenueShare,
    baseAdvanceMultiplier,
    baseMarketingBudgetMultiplier,
    status: "acquired",
    ownerStudioId: state.studio.id,
    publishedGameIds: [],
    lifetimeRevenue: 0,
    ownedStudioIds: [],
    acquiredOn: state.currentDate,
  };

  let next: GameState = {
    ...state,
    rng,
    publishers: { ...state.publishers, [id]: imprint },
    studio: {
      ...state.studio,
      cash: state.studio.cash - cost,
      ownedPublisherIds: [...state.studio.ownedPublisherIds, id],
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Founded publishing imprint: ${trimmedName}`,
    body:
      `${tierLabel(opts.tier)} imprint opened in ${imprint.hqCity}. ` +
      `Founding cost: ${formatCentsBrief(cost)}. Starting treasury: ${formatCentsBrief(startingCash)}.`,
    severity: "success",
  });

  return next;
}

// Offer a competitor a publishing deal on their NEXT released game.
// Resolves synchronously — the competitor either accepts (deal becomes
// "active" and sits in state.competitorPublishingDeals) or declines.
export function signCompetitorToImprint(
  state: GameState,
  opts: {
    publisherId: ID;
    competitorId: ID;
    advanceAmount: Money;
    revenueShare: number; // 0..1
  }
): GameState {
  const imprint = state.publishers[opts.publisherId];
  if (!imprint) return state;
  if (imprint.ownerStudioId !== state.studio.id) {
    return appendLog(state, {
      category: "event",
      headline: `You don't own ${imprint.name}`,
      severity: "warning",
    });
  }
  if (imprint.status !== "acquired") {
    return appendLog(state, {
      category: "event",
      headline: `${imprint.name} is not active`,
      severity: "warning",
    });
  }

  const competitor = state.competitors[opts.competitorId];
  if (!competitor) return state;
  if (competitor.status !== "active") {
    return appendLog(state, {
      category: "event",
      headline: `Cannot sign ${competitor.name}: they are ${competitor.status}`,
      severity: "warning",
    });
  }

  // Prevent double-signing the same competitor with an already-active deal.
  const alreadyActive = Object.values(state.competitorPublishingDeals).find(
    (d) => d.competitorId === opts.competitorId && d.status === "active"
  );
  if (alreadyActive) {
    return appendLog(state, {
      category: "event",
      headline: `${competitor.name} is already signed to another imprint`,
      severity: "warning",
    });
  }

  // Must have the cash to pay the advance now (it's owed upfront).
  if (state.studio.cash < opts.advanceAmount) {
    return appendLog(state, {
      category: "finance",
      headline: `Not enough cash to sign ${competitor.name}`,
      body: `Need ${formatCentsBrief(opts.advanceAmount)}. You have ${formatCentsBrief(state.studio.cash)}.`,
      severity: "warning",
    });
  }

  // Clamp the share inputs to a reasonable range.
  const share = Math.max(0.05, Math.min(0.8, opts.revenueShare));

  // Evaluate acceptance.
  const [accepts, rng] = rollCompetitorAcceptance(
    state.rng,
    competitor,
    imprint,
    opts.advanceAmount,
    share
  );

  // Generate an id for either path — we log both acceptances and declines
  // as state entries so the UI can show the full history.
  let rng2 = rng;
  const [dealId, rAfterId] = generateId("cpd", rng2);
  rng2 = rAfterId;

  const today = state.currentDate;
  const expires = dateToIso(addDays(isoToDate(today), DEAL_WINDOW_DAYS));

  if (!accepts) {
    const declinedDeal: CompetitorPublishingDeal = {
      id: dealId,
      publisherId: imprint.id,
      competitorId: competitor.id,
      advanceAmount: opts.advanceAmount,
      revenueShare: share,
      signedDate: today,
      expiresDate: expires,
      status: "declined",
      revenueCollected: 0,
    };
    const next: GameState = {
      ...state,
      rng: rng2,
      competitorPublishingDeals: {
        ...state.competitorPublishingDeals,
        [dealId]: declinedDeal,
      },
    };
    return appendLog(next, {
      category: "event",
      headline: `${competitor.name} declined ${imprint.name}'s offer`,
      body:
        `Proposed advance ${formatCentsBrief(opts.advanceAmount)} · cut ${(share * 100).toFixed(0)}%. ` +
        `They weren't interested in the terms.`,
      severity: "info",
      relatedIds: { competitorId: competitor.id },
    });
  }

  // Accepted — pay the advance now, create an active deal, bump the
  // competitor's cash (advance is working capital), log the event.
  const activeDeal: CompetitorPublishingDeal = {
    id: dealId,
    publisherId: imprint.id,
    competitorId: competitor.id,
    advanceAmount: opts.advanceAmount,
    revenueShare: share,
    signedDate: today,
    expiresDate: expires,
    status: "active",
    revenueCollected: 0,
  };

  let next: GameState = {
    ...state,
    rng: rng2,
    competitorPublishingDeals: {
      ...state.competitorPublishingDeals,
      [dealId]: activeDeal,
    },
    studio: {
      ...state.studio,
      cash: state.studio.cash - opts.advanceAmount,
    },
    competitors: {
      ...state.competitors,
      [competitor.id]: {
        ...competitor,
        cash: competitor.cash + opts.advanceAmount,
      },
    },
    // The imprint now logically has this competitor on its roster — stamp
    // the competitor id into ownedStudioIds so the directory UI shows them.
    // (Note: this is PUBLISHING, not acquiring — it's a signing, not an
    //  ownership change. We reuse the same field for the UI, but the
    //  publisher does NOT get to control the competitor.)
    publishers: {
      ...state.publishers,
      [imprint.id]: {
        ...imprint,
        publishedGameIds: imprint.publishedGameIds,
      },
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `${imprint.name} signed ${competitor.name}`,
    body:
      `Advance ${formatCentsBrief(opts.advanceAmount)} paid. ` +
      `Your cut on their next release: ${(share * 100).toFixed(0)}%. ` +
      `Deal expires ${expires.split("-").slice(0, 2).join("-")}.`,
    severity: "success",
    relatedIds: { competitorId: competitor.id },
  });

  return next;
}

// Called by releaseCompetitorGame when a competitor ships. If that
// competitor has an active player-imprint deal, deduct the cut from the
// lifetime revenue and route it to the imprint (and thus to the player,
// since the imprint is owned).
//
// Returns the deducted amount so the caller can reduce what goes to the
// competitor's treasury. This keeps the cash flow symmetric with the
// existing engine-royalty deduction.
export function applyCompetitorPublisherCutOnRelease(
  state: GameState,
  competitorId: ID,
  gameId: ID,
  grossLifetimeRevenue: Money
): { state: GameState; cutTaken: Money } {
  const deal = Object.values(state.competitorPublishingDeals).find(
    (d) => d.competitorId === competitorId && d.status === "active"
  );
  if (!deal) return { state, cutTaken: 0 };

  const imprint = state.publishers[deal.publisherId];
  if (!imprint) return { state, cutTaken: 0 };

  const cut = Math.max(0, Math.round(grossLifetimeRevenue * deal.revenueShare));

  const updatedDeal: CompetitorPublishingDeal = {
    ...deal,
    status: "fulfilled",
    appliedToGameId: gameId,
    revenueCollected: cut,
  };

  // The cut goes to the imprint's lifetime revenue. Because the imprint is
  // player-owned (status acquired, ownerStudioId === studio.id), we also
  // credit the player's studio cash + lifetimeRevenue directly.
  const updatedImprint: Publisher = {
    ...imprint,
    lifetimeRevenue: imprint.lifetimeRevenue + cut,
    publishedGameIds: [...imprint.publishedGameIds, gameId],
    // Reputation bounce from a successful publish — capped.
    reputation: Math.min(100, imprint.reputation + 1),
  };

  let next: GameState = {
    ...state,
    competitorPublishingDeals: {
      ...state.competitorPublishingDeals,
      [deal.id]: updatedDeal,
    },
    publishers: { ...state.publishers, [imprint.id]: updatedImprint },
  };

  // Route cash to the player if they own the imprint (they should — this
  // whole system is predicated on ownership — but guard defensively).
  if (imprint.ownerStudioId === state.studio.id) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + cut,
        lifetimeRevenue: next.studio.lifetimeRevenue + cut,
      },
    };
  }

  next = appendLog(next, {
    category: "finance",
    headline: `${imprint.name} collected ${formatCentsBrief(cut)} from ${competitorNameOr(next, competitorId)}`,
    body: `Publishing cut on their release — ${(deal.revenueShare * 100).toFixed(0)}% of ${formatCentsBrief(grossLifetimeRevenue)}.`,
    severity: "success",
    relatedIds: { competitorId },
  });

  return { state: next, cutTaken: cut };
}

// Daily-tick cleanup. Any active deal past its expiresDate goes to expired.
// The advance is already paid and gone — this just changes status for UI.
export function expireCompetitorPublishingDeals(state: GameState): GameState {
  const updates: Record<ID, CompetitorPublishingDeal> = {};
  for (const deal of Object.values(state.competitorPublishingDeals)) {
    if (deal.status === "active" && deal.expiresDate < state.currentDate) {
      updates[deal.id] = { ...deal, status: "expired" };
    }
  }
  if (Object.keys(updates).length === 0) return state;

  let next: GameState = {
    ...state,
    competitorPublishingDeals: {
      ...state.competitorPublishingDeals,
      ...updates,
    },
  };

  for (const d of Object.values(updates)) {
    const imprint = next.publishers[d.publisherId];
    const competitor = next.competitors[d.competitorId];
    next = appendLog(next, {
      category: "finance",
      headline: `Deal expired: ${imprint?.name ?? "—"} × ${competitor?.name ?? "—"}`,
      body: `${competitor?.name ?? "They"} never shipped within the deal window. Advance is a sunk cost.`,
      severity: "warning",
      relatedIds: { competitorId: d.competitorId },
    });
  }

  return next;
}

// ============ INTERNAL HELPERS ============

// Decide whether a competitor agrees to the proposed deal.
// Returns [accepts, updatedRng].
function rollCompetitorAcceptance(
  rng: GameState["rng"],
  competitor: Competitor,
  imprint: Publisher,
  advance: Money,
  share: number
): [boolean, GameState["rng"]] {
  // Predatory share — hard refusal (leaves a tiny chance for desperate studios).
  if (share >= PREDATORY_SHARE_MIN && competitor.cash >= STRUGGLING_CASH_THRESHOLD) {
    return rngChance(rng, 0.03);
  }

  // Base score. Starts at 0, we push toward +/− 1.
  let score = 0;

  // ---- Advance attractiveness ----
  // Advance relative to their cash: bigger = more tempting.
  const cashFloor = Math.max(competitor.cash, 1);
  const advanceRatio = advance / cashFloor;
  if (advanceRatio >= ADVANCE_ATTRACTIVENESS_TARGET) {
    score += 0.55;
  } else if (advanceRatio >= 0.1) {
    score += 0.25;
  } else if (advanceRatio >= 0.03) {
    score += 0.05;
  } else {
    score -= 0.2;
  }

  // If they're genuinely struggling, ANY advance is life-saving.
  if (competitor.cash < STRUGGLING_CASH_THRESHOLD) {
    score += 0.4;
  }

  // ---- Share favorability ----
  if (share <= FAVORABLE_SHARE_MAX) {
    score += 0.35;
  } else if (share <= 0.40) {
    score += 0.05;
  } else if (share <= 0.50) {
    score -= 0.2;
  } else {
    score -= 0.45;
  }

  // ---- Prestige / reputation gap ----
  // Higher-tier / high-rep imprints can sign studios more easily.
  const repGap = imprint.reputation - competitor.reputation;
  score += Math.max(-0.3, Math.min(0.3, repGap / 100));

  // Strategy modifiers — blockbuster / prestige studios are pickier;
  // volume / indie / casual studios sign more readily.
  switch (competitor.strategy) {
    case "blockbuster": score -= 0.25; break;
    case "prestige":    score -= 0.15; break;
    case "innovator":   score -= 0.05; break;
    case "copycat":     score += 0.05; break;
    case "casual":      score += 0.1; break;
    case "volume":      score += 0.1; break;
    case "indie":       score += 0.15; break;
    case "hardcore":    score -= 0.05; break;
  }

  // Map score → probability in [0.02, 0.95].
  const prob = Math.max(0.02, Math.min(0.95, 0.5 + score));

  return rngChance(rng, prob);
}

function tierLabel(tier: PublisherTier): string {
  switch (tier) {
    case "indie_label": return "Indie-label";
    case "mid_major":   return "Mid-major";
    case "major":       return "Major";
    case "mega":        return "Mega";
  }
}

function formatCentsBrief(cents: Money): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
  if (dollars >= 1_000_000)     return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000)         return `$${Math.round(dollars / 1_000)}K`;
  return `$${Math.round(dollars).toLocaleString()}`;
}

function competitorNameOr(state: GameState, id: ID): string {
  return state.competitors[id]?.name ?? "an unknown studio";
}

// Intentional: tune a new deal's default suggested advance and share for the
// UI. The UI uses these to prefill the sign-up form; the acceptance math is
// still the source of truth.
export function suggestedDealTerms(
  competitor: Competitor,
  imprint: Publisher
): { advance: Money; revenueShare: number } {
  // Suggest ~25% of their cash as a starting advance, floored at $100K.
  const advance = Math.max(10_000_000, Math.round(competitor.cash * 0.25));
  // Share nudged by imprint tier — mega imprints demand more.
  const share =
    imprint.tier === "mega" ? 0.45 :
    imprint.tier === "major" ? 0.40 :
    imprint.tier === "mid_major" ? 0.35 :
    0.30;
  return { advance, revenueShare: share };
}
