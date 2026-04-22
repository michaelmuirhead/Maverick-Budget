// Subscription buyout decisions at release.
//
// At the ready_to_release transition, era-appropriate subscription services
// (Game Pass, Apple Arcade, MavSynth, etc.) may pitch the player a flat-cash
// buyout in exchange for inclusion in their catalog. The trade is upside for
// certainty: accept now and you get a guaranteed payment plus a small
// reputation bump from catalog prestige, but the active sale projection at
// release is multiplied by (1 - salesReductionPct) — between a quarter and
// half of normal lifetime units evaporate because subscribers play it "free"
// instead of buying it.
//
// Lifecycle:
//   1. development.ts (ready_to_release transition) → maybeGenerateSubscriptionOffer
//   2. UI surfaces offer on project detail page → acceptSubscriptionOffer / declineSubscriptionOffer
//   3. tick.ts daily → expireSubscriptionOffers (auto-decline if window passes)
//   4. release.ts releaseProject → if subscriptionDealAccepted, apply salesReductionPct
//      to projectedLifetimeUnits/Revenue + pay the flat cash + apply the rep bump
//
// Game-design intent: a strategic alternative to "ship and pray" for projects
// the player thinks will under-perform — flatten the variance. For likely
// hits, the offer becomes a bad deal because you're cashing out below your
// expected lifetime revenue. Reputation/strength of studio shifts the
// payment up, so prestigious studios get courted harder.

import type { GameState } from "../core/state";
import type { ID, Money } from "../types/core";
import type { Project, SubscriptionOffer } from "../types/project";
import { isoToDate, addDays, dateToIso } from "../core/time";
import { rngFloat, rngPick } from "../core/rng";
import { appendLog } from "../core/log";
import { PLATFORM_BY_ID } from "../data/platforms";

// ============ SERVICE CATALOG ============
// Era-gated. Active when (year >= startYear) && (endYear == null || year <= endYear).
// `payoutBaseMultiplier` is applied to the rough projected sales the service
// would absorb so the offer roughly matches "60-80% of cash you'd otherwise
// earn from those subscribers" — which is the actual deal-shape across eras.

interface SubscriptionService {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  // Fraction of unit sales the service eats (subscribers don't buy retail).
  salesReductionPct: number;
  // Reputation prestige from being in the catalog (0-3).
  reputationBonus: number;
  // Multiplier on the player's "addressable subscriber revenue" baseline.
  payoutBaseMultiplier: number;
  // Studio reputation floor — services don't court no-name studios early on.
  // Eased once subscription services mature (see era thresholds below).
  minStudioReputation: number;
  // Project base-quality floor — services pre-screen against a quality bar.
  minBaseQuality: number;
}

const SERVICES: readonly SubscriptionService[] = [
  // Sega Channel — first attempt at a games subscription. Cartridge-era cable
  // bundle. Tiny reach so payout is small but it pioneered the model.
  {
    id: "sega_channel",
    name: "Sega Channel",
    startYear: 1994,
    endYear: 1998,
    salesReductionPct: 0.18,
    reputationBonus: 0,
    payoutBaseMultiplier: 0.55,
    minStudioReputation: 25,
    minBaseQuality: 50,
  },
  // GameTap — Turner-era PC subscription, mid-2000s.
  {
    id: "gametap",
    name: "GameTap",
    startYear: 2005,
    endYear: 2012,
    salesReductionPct: 0.22,
    reputationBonus: 1,
    payoutBaseMultiplier: 0.6,
    minStudioReputation: 20,
    minBaseQuality: 45,
  },
  // PlayStation Plus (the Instant Game Collection era, then PS Now / PS Plus
  // Premium). We model it as "running the whole way" since it kept evolving.
  {
    id: "ps_plus_collection",
    name: "Maverick PSN+ Collection",
    startYear: 2010,
    endYear: null,
    salesReductionPct: 0.28,
    reputationBonus: 1,
    payoutBaseMultiplier: 0.65,
    minStudioReputation: 25,
    minBaseQuality: 50,
  },
  // Xbox Game Pass — the genre-defining buyout that reshaped the industry.
  {
    id: "gamepass",
    name: "Maverick Game Pass",
    startYear: 2017,
    endYear: null,
    salesReductionPct: 0.40,
    reputationBonus: 2,
    payoutBaseMultiplier: 0.85,
    minStudioReputation: 15,    // famously courted indies hard
    minBaseQuality: 45,
  },
  // Apple Arcade — premium curated, usually exclusivity, smaller-game focused.
  {
    id: "apple_arcade",
    name: "Apple Arcade",
    startYear: 2019,
    endYear: null,
    salesReductionPct: 0.35,
    reputationBonus: 2,
    payoutBaseMultiplier: 0.75,
    minStudioReputation: 20,
    minBaseQuality: 55,
  },
  // MavSynth Neural Catalog — in-world late-game streaming-with-haptics tier.
  {
    id: "mavsynth_neural",
    name: "MavSynth Neural Catalog",
    startYear: 2035,
    endYear: null,
    salesReductionPct: 0.50,
    reputationBonus: 3,
    payoutBaseMultiplier: 1.10,
    minStudioReputation: 30,
    minBaseQuality: 60,
  },
];

// 14-day window — long enough for the player to consider, short enough that
// the offer doesn't sit indefinitely while the project is parked at the gate.
const OFFER_WINDOW_DAYS = 14;

// ============ OFFER GENERATION ============

/**
 * Called from development.ts at the in_development → ready_to_release
 * transition. Picks one era-appropriate service (or returns state unchanged
 * if none qualify) and writes a SubscriptionOffer onto the project.
 *
 * Already-released, already-offered, or accepted-deal projects skip silently.
 */
export function maybeGenerateSubscriptionOffer(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project) return state;
  if (project.status !== "ready_to_release") return state;
  if (project.subscriptionOffer || project.subscriptionDealAccepted) return state;

  const year = isoToDate(state.currentDate).year;
  const baseQuality = roughBaseQualityForOffer(project);
  const studioRep = state.studio.reputation;

  // Filter to services active this year and willing to court this studio/project.
  const eligible = SERVICES.filter(
    (s) =>
      year >= s.startYear &&
      (s.endYear === null || year <= s.endYear) &&
      studioRep >= s.minStudioReputation &&
      baseQuality >= s.minBaseQuality
  );
  if (eligible.length === 0) return state;

  // Roll a service. The largest, latest-era services should pitch most often
  // since they have the catalog appetite — bias by payoutBaseMultiplier.
  const totalWeight = eligible.reduce((s, srv) => s + srv.payoutBaseMultiplier, 0);
  const [roll, rngAfterPick] = rngFloat(state.rng, 0, totalWeight);
  let acc = 0;
  let service: SubscriptionService = eligible[0]!;
  for (const srv of eligible) {
    acc += srv.payoutBaseMultiplier;
    if (roll <= acc) {
      service = srv;
      break;
    }
  }

  // Estimate "addressable subscriber revenue" — the slice of lifetime revenue
  // the service is offering to swap out. Cheap projection that doesn't depend
  // on the full release-time sales math.
  const projectedRevenueEstimate = roughProjectedRevenue(project, baseQuality, state, year);
  const swappedRevenue = projectedRevenueEstimate * service.salesReductionPct;

  // Add small variance so two near-identical projects don't get identical offers.
  const [variance, rngAfterVar] = rngFloat(rngAfterPick, 0.85, 1.15);
  const flatPayment = Math.max(
    100_000_00, // floor at $100K — never insulting
    Math.round(swappedRevenue * service.payoutBaseMultiplier * variance)
  );

  const offer: SubscriptionOffer = {
    serviceId: service.id,
    serviceName: service.name,
    flatPayment,
    salesReductionPct: service.salesReductionPct,
    reputationBonus: service.reputationBonus,
    generatedDate: state.currentDate,
    expiresDate: dateToIso(addDays(isoToDate(state.currentDate), OFFER_WINDOW_DAYS)),
  };

  const updatedProject: Project = { ...project, subscriptionOffer: offer };
  const next: GameState = {
    ...state,
    rng: rngAfterVar,
    projects: { ...state.projects, [projectId]: updatedProject },
  };

  return appendLog(next, {
    category: "release", // closest existing category — these are platform-holder deals
    headline: `${service.name} wants ${project.name} in their catalog`,
    body: `Offer: $${(flatPayment / 100).toLocaleString()} flat, ${Math.round(service.salesReductionPct * 100)}% lifetime unit sales reduction. ${OFFER_WINDOW_DAYS}-day window.`,
    severity: "info",
    relatedIds: { projectId },
  });
}

// ============ PLAYER ACTIONS ============

export function acceptSubscriptionOffer(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project || !project.subscriptionOffer) return state;
  if (project.subscriptionDealAccepted) return state;
  if (project.status !== "ready_to_release") return state;

  const offer = project.subscriptionOffer;

  // Pay flat cash + apply rep bump. Sales reduction is applied later inside
  // releaseProject when the active sale record is constructed — so the same
  // reduction pct is recorded here for that handoff.
  const updatedProject: Project = {
    ...project,
    subscriptionDealAccepted: true,
    subscriptionServiceName: offer.serviceName,
    subscriptionPayment: offer.flatPayment,
    subscriptionSalesReductionPct: offer.salesReductionPct,
    // Keep the offer object on the project for record-keeping post-accept.
  };

  const next: GameState = {
    ...state,
    projects: { ...state.projects, [projectId]: updatedProject },
    studio: {
      ...state.studio,
      cash: state.studio.cash + offer.flatPayment,
      lifetimeRevenue: state.studio.lifetimeRevenue + offer.flatPayment,
      reputation: Math.min(100, state.studio.reputation + offer.reputationBonus),
    },
  };

  return appendLog(next, {
    category: "release",
    headline: `Signed ${project.name} to ${offer.serviceName}`,
    body: `+$${(offer.flatPayment / 100).toLocaleString()} flat${offer.reputationBonus > 0 ? `, +${offer.reputationBonus} reputation` : ""}. Lifetime unit sales will be reduced by ${Math.round(offer.salesReductionPct * 100)}%.`,
    severity: "success",
    relatedIds: { projectId },
  });
}

export function declineSubscriptionOffer(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  if (!project || !project.subscriptionOffer) return state;
  if (project.subscriptionDealAccepted) return state;

  const offer = project.subscriptionOffer;
  const updatedProject: Project = { ...project, subscriptionOffer: null };

  const next: GameState = {
    ...state,
    projects: { ...state.projects, [projectId]: updatedProject },
  };

  return appendLog(next, {
    category: "release",
    headline: `Passed on ${offer.serviceName} for ${project.name}`,
    body: "Going to market on traditional sales.",
    severity: "info",
    relatedIds: { projectId },
  });
}

// ============ DAILY EXPIRY TICK ============
// If the offer's expiresDate has passed and it hasn't been accepted, clear
// the offer (treat as auto-decline). Cheap O(projects); no work if no offers.
export function expireSubscriptionOffers(state: GameState): GameState {
  const todayIso = state.currentDate;
  let next = state;
  for (const project of Object.values(state.projects)) {
    if (!project.subscriptionOffer) continue;
    if (project.subscriptionDealAccepted) continue;
    if (project.subscriptionOffer.expiresDate >= todayIso) continue;

    const expired = project.subscriptionOffer;
    const updated: Project = { ...project, subscriptionOffer: null };
    next = {
      ...next,
      projects: { ...next.projects, [project.id]: updated },
    };
    next = appendLog(next, {
      category: "release",
      headline: `${expired.serviceName} buyout offer for ${project.name} expired`,
      body: "No response received in window — going to market on traditional sales.",
      severity: "info",
      relatedIds: { projectId: project.id },
    });
  }
  return next;
}

// ============ SUPPORT: ROUGH PROJECTIONS ============
// These are deliberately cheaper than the release-time math. They produce a
// ballpark figure for the offer amount without invoking the full review/IP
// pipeline (which we can't run pre-release).

function roughBaseQualityForOffer(project: Project): number {
  // Average accumulated quality across all axes, scaled to 0-100.
  let sum = 0;
  let count = 0;
  for (const v of Object.values(project.qualityAxes)) {
    sum += Math.min(100, v / 50);
    count++;
  }
  return count > 0 ? Math.round(sum / count) : 0;
}

function roughProjectedRevenue(
  project: Project,
  baseQuality: number,
  state: GameState,
  year: number
): number {
  // Sum addressable market across project's platforms — mirror release-time
  // projection but skip the full audience/genre product (rough enough).
  let marketPotential = 0;
  for (const pid of project.platformIds) {
    const plat = PLATFORM_BY_ID[pid];
    if (!plat) continue;
    const installed = state.market.platformInstallBase[pid] ?? 0;
    marketPotential += installed * 1_000_000 * 0.4; // crude audience/genre fit
  }

  // Convert quality to a sales multiplier. baseQuality 60 = ~1.0x.
  const scoreMult = Math.pow(Math.max(20, baseQuality) / 60, 2.0);
  const conversion = 0.010 * scoreMult;
  const lifetimeUnits = Math.max(1000, marketPotential * conversion);

  // Rough average price (cents) by platform kind.
  const avgPrice = roughUnitPrice(project.platformIds, year);
  return lifetimeUnits * avgPrice;
}

function roughUnitPrice(platformIds: readonly string[], year: number): number {
  let total = 0;
  let count = 0;
  for (const pid of platformIds) {
    const plat = PLATFORM_BY_ID[pid];
    if (!plat) continue;
    let price = 4000;
    if (plat.kind === "mobile") price = 300;
    else if (plat.kind === "arcade") price = 50;
    else if (plat.kind === "cloud") price = 2000;
    else if (plat.kind === "pc") price = 3000;
    else if (plat.kind === "neural") price = 8000;
    else price = year < 1990 ? 3000 : year < 2000 ? 5000 : year < 2015 ? 6000 : 6500;
    total += price;
    count++;
  }
  return count > 0 ? Math.round(total / count) : 4000;
}

// Suppress rngPick unused-import warning — leaving the import in case
// future per-service flavor variants add picks (e.g., randomized sub-tier).
void rngPick;
