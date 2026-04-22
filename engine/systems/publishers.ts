// Publisher system.
//
// Publishers are industry-facing entities that offer "publishing deals" on games
// in development. A deal exchanges upfront advance cash + marketing budget boost
// for a percentage of the game's revenue over its sales lifetime.
//
// Key flows:
//   1. When a player starts a project, publishers evaluate it (genre fit, budget,
//      studio reputation) and some send offers within a few days.
//   2. Player can accept a deal — gets advance immediately, optionally a marketing
//      budget that increases the sales curve, loses a revenue share.
//   3. As the game sells, the publisher's cut flows daily (integrated with
//      tickActiveSales in release.ts).
//   4. At any time, player can acquire any publisher (if cash >= marketCap).
//      Ownership means the "publisher's cut" goes to the player instead of the
//      publisher's treasury.
//
// Publishers also conceptually publish competitor games — we simulate this
// coarsely via monthly publisher revenue (from competitor releases they cover),
// which grows their cash over time. This is represented by a passive revenue
// stream rather than per-competitor-game tracking for simulation efficiency.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { Publisher, PublishingDeal, PublisherTier } from "../types/publisher";
import type { Project } from "../types/project";
import type { ActiveSale } from "../types/project";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, dateToIso, isoToDate } from "../core/time";
import { rngFloat, rngChance } from "../core/rng";
import { GENRE_BY_ID } from "../data/genres";
import { PUBLISHER_SEEDS } from "../data/publishers";

// ============ CONSTANTS ============
const DEAL_OFFER_WINDOW_DAYS = 30; // publishers' offers sit for ~30 days

// ============ OFFER GENERATION (CONCEPT) ============
// Fired once when the player creates a project. Only INDIE LABELS and
// MID-MAJORS bite at concept — at this point the game is just an idea, so
// only the smaller publishers willing to take a flier on a studio's reputation
// are interested. Majors and megas wait for accumulated quality signal and
// re-evaluate via tickPublisherOffersDuringDev (below).
export function generatePublishingOffersForProject(
  state: GameState,
  projectId: ID
): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  // Only offer deals on in-development projects, not already-released or cancelled
  if (project.status !== "in_development") return state;
  // Only offer deals on a project not already under a deal
  const existingDeal = Object.values(state.publishingDeals).find(
    (d) => d.projectId === projectId && (d.status === "offered" || d.status === "active")
  );
  if (existingDeal) return state;

  let next = state;
  let rng = state.rng;

  for (const publisher of Object.values(state.publishers)) {
    if (publisher.status !== "active") continue;
    // At concept, big publishers stay out — they need to see real work first.
    if (publisher.tier === "major" || publisher.tier === "mega") continue;

    // Reputation gate
    if (state.studio.reputation < publisher.minReputationToSign) continue;

    // Genre fit factor — publishers give better offers for games in their preferred genres
    const isPreferredGenre = publisher.preferredGenres.includes(project.genre);

    // Evaluation chance — is the publisher interested?
    // Base: 55% for preferred genre, 22% otherwise — publishers need to actively
    // scout for talent, and a visible project in their niche is a real opportunity.
    // Scales up with studio reputation and down for bigger publishers who are pickier.
    let interestChance = isPreferredGenre ? 0.55 : 0.22;
    interestChance += state.studio.reputation / 400; // up to +25%
    // Note: major/mega publishers are gated out at concept above; they only pitch
    // mid-development via tickPublisherOffersDuringDev once quality signal is visible.

    const [interested, r1] = rngChance(rng, interestChance);
    rng = r1;
    if (!interested) continue;

    // They can't afford projects bigger than their cash
    const requiredAdvance = Math.round(project.budget.total * publisher.baseAdvanceMultiplier);
    // Keep a safety margin but not 2x — they just need to cover the advance plus some overhead
    if (publisher.cash < requiredAdvance * 1.2) continue;

    // Generate the offer
    // Revenue share — base +/- 5 points of noise, worse by +5 if non-preferred
    const [shareNoise, r2] = rngFloat(rng, -0.05, 0.05);
    rng = r2;
    let revenueShare = publisher.baseRevenueShare + shareNoise;
    if (!isPreferredGenre) revenueShare += 0.05;
    revenueShare = Math.max(0.15, Math.min(0.7, revenueShare));

    // Advance — baseMultiplier of project budget, better for preferred genres + good reputation
    const [advanceNoise, r3] = rngFloat(rng, 0.8, 1.2);
    rng = r3;
    const repBonus = 1 + state.studio.reputation / 200; // up to 1.5x
    const prefBonus = isPreferredGenre ? 1.2 : 1.0;
    const advance = Math.round(
      project.budget.total * publisher.baseAdvanceMultiplier * advanceNoise * repBonus * prefBonus
    );

    // Marketing budget — bumps sales curve
    const marketingBudget = Math.round(
      project.budget.total * publisher.baseMarketingBudgetMultiplier * advanceNoise * prefBonus
    );

    // Bonus for hitting a metacritic score — concept-stage offers from indie/mid_major
    // don't include MC bonuses; those are exclusive to the mid-dev pitches that
    // bigger publishers make once they can actually evaluate the work.
    const metacriticBonusThreshold: number | undefined = undefined;
    const metacriticBonusAmount: Money | undefined = undefined;

    const [dealId, r4] = generateId("deal", rng);
    rng = r4;

    const offeredOn = state.currentDate;
    const expiresOn = dateToIso(
      addDays(isoToDate(state.currentDate), DEAL_OFFER_WINDOW_DAYS)
    );

    const deal: PublishingDeal = {
      id: dealId,
      publisherId: publisher.id,
      projectId,
      status: "offered",
      offeredOn,
      expiresOn,
      revenueShare,
      advanceAmount: advance,
      marketingBudget,
      metacriticBonusThreshold,
      metacriticBonusAmount,
      revenueCollected: 0,
    };

    next = {
      ...next,
      publishingDeals: { ...next.publishingDeals, [dealId]: deal },
    };
    next = appendLog(next, {
      category: "event",
      headline: `${publisher.name} offered a publishing deal on ${project.name}`,
      body: `Advance: $${Math.round(advance / 100).toLocaleString()}. Share: ${(revenueShare * 100).toFixed(0)}%.`,
      severity: "info",
    });
  }

  return { ...next, rng };
}

// ============ MID-DEVELOPMENT QUALITY-DRIVEN OFFERS ============
// Runs monthly during development. For each in-development project, re-evaluates
// publisher interest using the project's ACCUMULATED quality signal (how good
// the game is shaping up to be). This is the path by which bigger publishers
// (major / mega) find their way to a promising game — they need to see work
// before they commit.
//
// Gating logic:
//   - Compute a 0-100 quality signal = weighted average of qualityAxes, using
//     the genre's axisWeights (same shape as release-time base quality, but
//     computed on in-progress points).
//   - Each tier has a minimum signal threshold:
//       indie_label : 0   (always — but the concept path already covers them)
//       mid_major   : 25
//       major       : 50
//       mega        : 70
//   - A publisher only pitches once per project (any prior deal history —
//     offered / active / declined / expired — blocks another pitch).
//   - Terms scale with "headroom" above the threshold: the better it looks,
//     the bigger the advance + marketing package and the softer the revenue
//     share.
//
// Call site: engine/core/tick.ts onMonthStart. Cheap to run — O(projects × publishers).
export function tickPublisherOffersDuringDev(state: GameState): GameState {
  let next = state;
  let rng = state.rng;

  for (const project of Object.values(state.projects)) {
    if (project.status !== "in_development") continue;

    // Already under an active deal — nothing more to pitch.
    const existingActive = Object.values(next.publishingDeals).find(
      (d) => d.projectId === project.id && d.status === "active"
    );
    if (existingActive) continue;

    // Publishers already on record for this project (any status) — don't re-pitch.
    const priorPublisherIds = new Set(
      Object.values(next.publishingDeals)
        .filter((d) => d.projectId === project.id)
        .map((d) => d.publisherId)
    );

    const signal = computeQualitySignal(project);

    for (const publisher of Object.values(next.publishers)) {
      if (publisher.status !== "active") continue;
      if (priorPublisherIds.has(publisher.id)) continue;

      // Reputation gate (shared with concept path)
      if (next.studio.reputation < publisher.minReputationToSign) continue;

      // Tier gate on quality signal — how good does the game need to look
      // before this tier of publisher bothers?
      const threshold = tierSignalThreshold(publisher.tier);
      if (signal < threshold) continue;

      const isPreferredGenre = publisher.preferredGenres.includes(project.genre);
      const headroom = Math.max(0, Math.min(1, (signal - threshold) / 30));

      // Interest chance — tier's base sniff rate, boosted by signal headroom
      // and genre fit, capped so a single month never guarantees every tier pitches.
      let interestChance = tierBaseInterest(publisher.tier);
      interestChance *= isPreferredGenre ? 1.35 : 0.75;
      interestChance *= 1 + headroom * 0.8;
      interestChance = Math.min(0.75, interestChance);

      const [interested, r1] = rngChance(rng, interestChance);
      rng = r1;
      if (!interested) continue;

      // Afford check — advance scales up with quality headroom.
      const advanceBase = project.budget.total * publisher.baseAdvanceMultiplier;
      const requiredAdvance = Math.round(advanceBase * (1 + headroom * 0.5));
      if (publisher.cash < requiredAdvance * 1.2) continue;

      // Terms — better than concept-phase offers:
      //  - Revenue share noise skews downward (publisher takes slightly less)
      //  - Advance and marketing both scale with quality headroom
      const [shareNoise, r2] = rngFloat(rng, -0.07, 0.03);
      rng = r2;
      let revenueShare = publisher.baseRevenueShare + shareNoise;
      if (!isPreferredGenre) revenueShare += 0.04;
      revenueShare = Math.max(0.12, Math.min(0.65, revenueShare));

      const [advanceNoise, r3] = rngFloat(rng, 0.9, 1.3);
      rng = r3;
      const repBonus = 1 + next.studio.reputation / 200;
      const prefBonus = isPreferredGenre ? 1.25 : 1.0;
      const qualityBonus = 1 + headroom * 0.6;
      const advance = Math.round(
        advanceBase * advanceNoise * repBonus * prefBonus * qualityBonus
      );
      const marketingBudget = Math.round(
        project.budget.total * publisher.baseMarketingBudgetMultiplier * advanceNoise * prefBonus * qualityBonus
      );

      // Metacritic bonus — majors/megas put real money on hitting a score.
      let metacriticBonusThreshold: number | undefined;
      let metacriticBonusAmount: Money | undefined;
      if (publisher.tier === "major" || publisher.tier === "mega") {
        metacriticBonusThreshold = publisher.tier === "mega" ? 85 : 80;
        metacriticBonusAmount = Math.round(advance * 0.35);
      } else if (publisher.tier === "mid_major") {
        // mid_majors include a smaller bonus when the game is clearly strong
        metacriticBonusThreshold = 75;
        metacriticBonusAmount = Math.round(advance * 0.2);
      }

      const [dealId, r4] = generateId("deal", rng);
      rng = r4;

      const offeredOn = next.currentDate;
      const expiresOn = dateToIso(
        addDays(isoToDate(next.currentDate), DEAL_OFFER_WINDOW_DAYS)
      );

      const deal: PublishingDeal = {
        id: dealId,
        publisherId: publisher.id,
        projectId: project.id,
        status: "offered",
        offeredOn,
        expiresOn,
        revenueShare,
        advanceAmount: advance,
        marketingBudget,
        metacriticBonusThreshold,
        metacriticBonusAmount,
        revenueCollected: 0,
      };

      next = {
        ...next,
        publishingDeals: { ...next.publishingDeals, [dealId]: deal },
      };
      next = appendLog(next, {
        category: "event",
        headline: `${publisher.name} wants to publish ${project.name}`,
        body: `${tierLabel(publisher.tier)} — advance $${Math.round(advance / 100).toLocaleString()}, their cut ${(revenueShare * 100).toFixed(0)}%. They like what they've seen so far.`,
        severity: "info",
        relatedIds: { projectId: project.id },
      });
    }
  }

  return { ...next, rng };
}

// ---- helpers for the mid-dev pass ----

function computeQualitySignal(project: Project): number {
  const genre = GENRE_BY_ID[project.genre];
  if (!genre) return 0;
  let weighted = 0;
  let totalWeight = 0;
  for (const [axis, weight] of Object.entries(genre.axisWeights) as [keyof typeof project.qualityAxes, number][]) {
    const axisValue = project.qualityAxes[axis] ?? 0;
    // Same normalization as release-time computeBaseQuality: 50 points = 1 score point
    const normalized = Math.min(100, axisValue / 50);
    weighted += normalized * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

function tierSignalThreshold(tier: PublisherTier): number {
  switch (tier) {
    case "indie_label": return 0;
    case "mid_major":   return 25;
    case "major":       return 50;
    case "mega":        return 70;
  }
}

function tierBaseInterest(tier: PublisherTier): number {
  // Monthly probability that a publisher of this tier even considers pitching,
  // before genre/quality-headroom modifiers.
  switch (tier) {
    case "indie_label": return 0.30;
    case "mid_major":   return 0.22;
    case "major":       return 0.14;
    case "mega":        return 0.09;
  }
}

function tierLabel(tier: PublisherTier): string {
  switch (tier) {
    case "indie_label": return "Indie label";
    case "mid_major":   return "Mid-major";
    case "major":       return "Major publisher";
    case "mega":        return "Mega publisher";
  }
}

// ============ PLAYER ACTIONS ============

// Accept a publishing deal — credits advance, adds marketing budget to project,
// moves deal to "active" status.
export function acceptPublishingDeal(state: GameState, dealId: ID): GameState {
  const deal = state.publishingDeals[dealId];
  if (!deal || deal.status !== "offered") return state;
  if (deal.expiresOn < state.currentDate) return state;

  const project = state.projects[deal.projectId];
  if (!project) return state;

  const publisher = state.publishers[deal.publisherId];
  if (!publisher) return state;

  // Pay advance; bump project marketing budget so the sales curve reflects
  // publisher marketing reach. budget.total tracks overall spend; budget.marketing
  // is what actually affects the sales curve via the marketing multiplier.
  const updatedProject: Project = {
    ...project,
    budget: {
      ...project.budget,
      total: project.budget.total + deal.marketingBudget,
      marketing: project.budget.marketing + deal.marketingBudget,
    },
    publishingDealId: deal.id,
  };

  const updatedDeal: PublishingDeal = {
    ...deal,
    status: "active",
    acceptedOn: state.currentDate,
  };

  let next: GameState = {
    ...state,
    projects: { ...state.projects, [project.id]: updatedProject },
    publishingDeals: { ...state.publishingDeals, [deal.id]: updatedDeal },
    studio: {
      ...state.studio,
      cash: state.studio.cash + deal.advanceAmount,
      lifetimeRevenue: state.studio.lifetimeRevenue + deal.advanceAmount,
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Signed publishing deal: ${publisher.name} × ${project.name}`,
    body: `Advance of $${Math.round(deal.advanceAmount / 100).toLocaleString()} paid. Publisher takes ${(deal.revenueShare * 100).toFixed(0)}% of revenue.`,
    severity: "success",
  });

  // Expire any competing offers on the same project
  const competingUpdates: Record<ID, PublishingDeal> = {};
  for (const d of Object.values(next.publishingDeals)) {
    if (d.id !== deal.id && d.projectId === deal.projectId && d.status === "offered") {
      competingUpdates[d.id] = { ...d, status: "expired" };
    }
  }
  if (Object.keys(competingUpdates).length > 0) {
    next = {
      ...next,
      publishingDeals: { ...next.publishingDeals, ...competingUpdates },
    };
  }

  return next;
}

// Decline a deal
export function declinePublishingDeal(state: GameState, dealId: ID): GameState {
  const deal = state.publishingDeals[dealId];
  if (!deal || deal.status !== "offered") return state;

  return {
    ...state,
    publishingDeals: {
      ...state.publishingDeals,
      [dealId]: { ...deal, status: "declined" },
    },
  };
}

// ============ ACQUIRE A PUBLISHER ============
// Player pays publisher's market cap to acquire them. Once acquired, any
// publisher cut on their published games flows to the player instead of the
// publisher's treasury.
export function acquirePublisher(state: GameState, publisherId: ID): GameState {
  const publisher = state.publishers[publisherId];
  if (!publisher) return state;
  if (publisher.status !== "active") {
    return appendLog(state, {
      category: "event",
      headline: `Cannot acquire ${publisher.name}: status is ${publisher.status}`,
      severity: "warning",
    });
  }
  // Slight premium over market cap — acquisitions cost 1.15x
  const price = Math.round(publisher.marketCap * 1.15);
  if (state.studio.cash < price) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot afford to acquire ${publisher.name}`,
      body: `Needs $${Math.round(price / 100).toLocaleString()}. You have $${Math.round(state.studio.cash / 100).toLocaleString()}.`,
      severity: "warning",
    });
  }

  const updated: Publisher = {
    ...publisher,
    status: "acquired",
    ownerStudioId: state.studio.id,
    acquiredOn: state.currentDate,
  };

  let next: GameState = {
    ...state,
    publishers: { ...state.publishers, [publisher.id]: updated },
    studio: {
      ...state.studio,
      cash: state.studio.cash - price,
      ownedPublisherIds: [...state.studio.ownedPublisherIds, publisher.id],
      // Publishers count as market cap — they become part of the studio's assets
      marketCap: state.studio.marketCap + publisher.marketCap,
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Acquired ${publisher.name} for $${Math.round(price / 100).toLocaleString()}`,
    body: `All future publishing revenue from ${publisher.name} now flows to your studio.`,
    severity: "success",
  });

  return next;
}

// ============ DAILY PUBLISHER REVENUE FROM SALES ============
// Called from tickActiveSales (in release.ts) — for each active sale that has
// an associated publishing deal, route a fraction of gross revenue to the
// publisher (or to the player, if they own the publisher).
// Returns: [updated state, publisher cut deducted from player]
export function applyPublisherRevenueCut(
  state: GameState,
  sale: ActiveSale,
  grossRevenueToday: Money
): { state: GameState; publisherCut: Money } {
  const project = state.projects[sale.projectId];
  if (!project || !project.publishingDealId) {
    return { state, publisherCut: 0 };
  }
  const deal = state.publishingDeals[project.publishingDealId];
  if (!deal || deal.status !== "active") {
    return { state, publisherCut: 0 };
  }
  const publisher = state.publishers[deal.publisherId];
  if (!publisher) {
    return { state, publisherCut: 0 };
  }

  const cut = Math.round(grossRevenueToday * deal.revenueShare);

  // If the player owns the publisher, the cut goes back into studio cash
  // (so net effect on player is zero — they keep 100% of their own revenue)
  const playerOwnsPublisher = publisher.ownerStudioId === state.studio.id;

  let next: GameState = {
    ...state,
    publishingDeals: {
      ...state.publishingDeals,
      [deal.id]: { ...deal, revenueCollected: deal.revenueCollected + cut },
    },
    publishers: {
      ...state.publishers,
      [publisher.id]: {
        ...publisher,
        lifetimeRevenue: publisher.lifetimeRevenue + cut,
        cash: playerOwnsPublisher ? publisher.cash : publisher.cash + cut,
      },
    },
  };

  if (playerOwnsPublisher) {
    // Refund the cut back to studio — net zero impact on player revenue
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + cut,
        lifetimeRevenue: next.studio.lifetimeRevenue + cut,
      },
    };
  }

  return { state: next, publisherCut: cut };
}

// ============ POST-RELEASE: METACRITIC BONUS ============
// Called when a game is released — if the deal has a metacritic bonus and
// the game hit the threshold, pay it out.
export function payMetacriticBonus(
  state: GameState,
  projectId: ID
): GameState {
  const project = state.projects[projectId];
  if (!project || !project.publishingDealId) return state;
  if (project.metacriticScore === undefined) return state;

  const deal = state.publishingDeals[project.publishingDealId];
  if (!deal || deal.bonusPaid) return state;
  if (deal.metacriticBonusThreshold === undefined || deal.metacriticBonusAmount === undefined) {
    return state;
  }
  if (project.metacriticScore < deal.metacriticBonusThreshold) return state;

  const publisher = state.publishers[deal.publisherId];
  if (!publisher) return state;

  const bonus = deal.metacriticBonusAmount;

  let next: GameState = {
    ...state,
    publishingDeals: {
      ...state.publishingDeals,
      [deal.id]: { ...deal, bonusPaid: true },
    },
    publishers: {
      ...state.publishers,
      [publisher.id]: { ...publisher, cash: Math.max(0, publisher.cash - bonus) },
    },
    studio: {
      ...state.studio,
      cash: state.studio.cash + bonus,
      lifetimeRevenue: state.studio.lifetimeRevenue + bonus,
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `${publisher.name} paid Metacritic bonus: $${Math.round(bonus / 100).toLocaleString()}`,
    body: `${project.name} hit the ${deal.metacriticBonusThreshold}+ score target.`,
    severity: "success",
  });

  return next;
}

// ============ PERIODIC PUBLISHER ROLLUPS ============
// Runs monthly. Grows publisher cash from passive revenue (simulating them
// publishing games we don't track in detail), expires stale offers, and
// recomputes market caps.
export function tickPublishersMonthly(state: GameState): GameState {
  let next = state;

  // Expire stale offered deals
  const dealUpdates: Record<ID, PublishingDeal> = {};
  for (const d of Object.values(state.publishingDeals)) {
    if (d.status === "offered" && d.expiresOn < state.currentDate) {
      dealUpdates[d.id] = { ...d, status: "expired" };
    }
  }
  if (Object.keys(dealUpdates).length > 0) {
    next = {
      ...next,
      publishingDeals: { ...next.publishingDeals, ...dealUpdates },
    };
  }

  // Grow publisher cash from passive revenue
  // Each publisher earns 1-3% of their current cash per month from existing catalog
  // (coarse abstraction of them publishing other games over time)
  const publisherUpdates: Record<ID, Publisher> = {};
  let rng = state.rng;
  for (const p of Object.values(state.publishers)) {
    if (p.status !== "active" && p.status !== "acquired") continue;
    const [growthRate, r1] = rngFloat(rng, 0.01, 0.03);
    rng = r1;
    // Preferred-genre heavy publishers do slightly better
    const genrePopularityBoost = 1 + (p.preferredGenres.length / 20);
    const earned = Math.round(p.cash * growthRate * genrePopularityBoost);
    // If owned by player, this revenue routes to player
    if (p.ownerStudioId === state.studio.id && p.status === "acquired") {
      next = {
        ...next,
        studio: {
          ...next.studio,
          cash: next.studio.cash + earned,
          lifetimeRevenue: next.studio.lifetimeRevenue + earned,
        },
      };
      publisherUpdates[p.id] = {
        ...p,
        lifetimeRevenue: p.lifetimeRevenue + earned,
      };
    } else {
      publisherUpdates[p.id] = {
        ...p,
        cash: p.cash + earned,
        lifetimeRevenue: p.lifetimeRevenue + earned,
        // Recompute market cap — 4x cash + reputation premium
        marketCap: Math.round((p.cash + earned) * 4 * (1 + p.reputation / 100)),
      };
    }
  }
  if (Object.keys(publisherUpdates).length > 0) {
    next = {
      ...next,
      rng,
      publishers: { ...next.publishers, ...publisherUpdates },
    };
  }

  return next;
}

// ============ YEARLY PUBLISHER FOUNDING ============
// Mirrors maybeSpawnNewCompetitor. Every January 1, any PUBLISHER_SEEDS whose
// foundedYear has just arrived are instantiated into state.publishers.
// Unlike competitors (probabilistic spawns), publishers are deterministic —
// the seed list defines the historical industry, and each entry founds on
// its stated year. This keeps the publisher roster stable across saves.
export function maybeFoundNewPublisher(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  if (today.month !== 1 || today.day !== 1) return state;

  const year = today.year;
  const existingIds = new Set(Object.keys(state.publishers));
  const arriving = PUBLISHER_SEEDS.filter(
    (s) => s.foundedYear === year && !existingIds.has(s.id)
  );
  if (arriving.length === 0) return state;

  let rng = state.rng;
  const newPublishers: Record<string, Publisher> = {};
  const headlines: Array<{ headline: string; body: string }> = [];

  for (const seed of arriving) {
    const [cashVar, rC] = rngFloat(rng, 0.8, 1.25);
    rng = rC;
    const cash = Math.round(seed.startingCash * cashVar);
    const reputation = seed.startingReputation;

    newPublishers[seed.id] = {
      id: seed.id,
      name: seed.name,
      hqCity: seed.hqCity,
      foundedYear: seed.foundedYear,
      tier: seed.tier,
      reputation,
      cash,
      marketCap: Math.round(cash * 4 * (1 + reputation / 100)),
      preferredGenres: seed.preferredGenres,
      minReputationToSign: seed.minReputationToSign,
      baseRevenueShare: seed.baseRevenueShare,
      baseAdvanceMultiplier: seed.baseAdvanceMultiplier,
      baseMarketingBudgetMultiplier: seed.baseMarketingBudgetMultiplier,
      status: "active",
      publishedGameIds: [],
      lifetimeRevenue: 0,
      // Mid-game-founded publishers start with no studio portfolio. Future
      // acquire-studio logic wires children in.
      ownedStudioIds: [],
    };

    headlines.push({
      headline: `${seed.name} opens for business in ${seed.hqCity}`,
      body: `A new ${tierLabel(seed.tier)} publisher enters the industry.`,
    });
  }

  let next: GameState = {
    ...state,
    rng,
    publishers: { ...state.publishers, ...newPublishers },
  };
  for (const h of headlines) {
    next = appendLog(next, { category: "market", headline: h.headline, body: h.body });
  }
  return next;
}
