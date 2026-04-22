// Release system: runs when a project finishes its Launch phase.
// Generates per-outlet reviews using personality-driven scoring,
// aggregates into a Metacritic-style score, projects a sales curve,
// updates IP/franchise records, and pays licensor royalties.

import type { GameState } from "../core/state";
import type { ID, QualityAxis } from "../types/core";
import type { Project, IP, ActiveSale } from "../types/project";
import type { Review, ReleaseReception, ReviewOutlet } from "../types/review";
import type { Staff } from "../types/staff";
import type { GameEngine } from "../types/engine";

import { GENRE_BY_ID } from "../data/genres";
import { THEME_BY_ID } from "../data/themes";
import { PLATFORM_BY_ID } from "../data/platforms";
import { outletsActiveInYear } from "../data/reviewOutlets";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate, addDays, dateToIso } from "../core/time";
import { rngGaussian, rngPick, rngInt, rngFloat } from "../core/rng";
import { splitBugsAtRelease, salesDragMultiplier, computeUserScore } from "./bugs";
import {
  evaluateMarketShiftFromRelease, recordCopycatRelease, marketShiftMultiplierFor,
} from "./marketShifts";
import { applyPublisherRevenueCut, payMetacriticBonus } from "./publishers";

// ============ MAIN ENTRY POINT ============

// Scan for projects the player has explicitly approved for release, and ship them.
// Called once per tick from the master dispatcher.
//
// Gate requires BOTH:
//   - project.status === "ready_to_release" (launch phase complete)
//   - flags[`${projectId}_ready_for_release`] (player called approveRelease)
// so a project never ships automatically the moment launch hits 100%.
export function processReadyReleases(state: GameState): GameState {
  let next = state;
  for (const projectId of Object.keys(state.projects)) {
    const project = state.projects[projectId];
    if (!project) continue;
    if (project.status !== "ready_to_release") continue;
    const flagKey = `${projectId}_ready_for_release`;
    if (state.flags[flagKey] && !state.flags[`${projectId}_released`]) {
      next = releaseProject(next, projectId);
    }
  }
  return next;
}

// ============ DAILY SALES TICK ============
// Each ActiveSale pays out a slice of its projected lifetime revenue.
// Curve: launch-week boost, then exponential decay with half-life.
// Royalties (engine + platform) are deducted before cash hits the studio.
export function tickActiveSales(state: GameState): GameState {
  if (Object.keys(state.activeSales).length === 0) return state;

  let next = state;
  const updatedSales: Record<ID, ActiveSale> = {};
  const projectUpdates: Record<ID, Project> = {};

  for (const sale of Object.values(state.activeSales)) {
    if (!sale.active) continue;
    if (sale.daysOnSale >= sale.lifetimeDays) {
      updatedSales[sale.id] = { ...sale, active: false };
      continue;
    }

    // Compute today's share of total projected revenue using a decay curve.
    // The integral of all daily shares over lifetimeDays sums to ~1.0.
    // Then apply the live user-score drag — buggy launches lose sales every day,
    // forgiveness arcs (high userScore) can outsell projection.
    const dragProject = next.projects[sale.projectId];
    const dragMult = dragProject ? salesDragMultiplier(dragProject) : 1;
    const daySharePct = salesCurveShare(sale.daysOnSale, sale) * dragMult;

    const grossRevenue = Math.round(sale.projectedLifetimeRevenue * daySharePct);
    const unitsToday = Math.round(sale.projectedLifetimeUnits * daySharePct);

    // Deduct royalties
    const engineRoyalty = Math.round(grossRevenue * sale.engineRoyaltyRate);
    const platformRoyalty = Math.round(grossRevenue * sale.platformRoyaltyRate);

    // Route the publisher's revenue share (if the project is under an active
    // deal). The function deposits the cut into publisher.cash, increments
    // deal.revenueCollected, and — if the player owns the publisher — refunds
    // the cut back to studio.cash so net effect is zero. Either way, we
    // subtract publisherCut from what we report as the studio's net for THIS
    // sale day so the player sees a clean post-publisher number.
    const { state: afterPublisher, publisherCut } = applyPublisherRevenueCut(next, sale, grossRevenue);
    next = afterPublisher;

    const netRevenue = grossRevenue - engineRoyalty - platformRoyalty - publisherCut;

    // Pay the licensor if the engine belongs to another studio in-game
    // (for now, only the player is a real studio; competitors TBD)
    // Record royalty flow to engine metadata for future engine licensors.

    updatedSales[sale.id] = {
      ...sale,
      daysOnSale: sale.daysOnSale + 1,
      unitsSoldToDate: sale.unitsSoldToDate + unitsToday,
      revenueToDate: sale.revenueToDate + netRevenue,
    };

    // Update the project's running totals too
    const project = next.projects[sale.projectId];
    if (project) {
      projectUpdates[sale.projectId] = {
        ...project,
        lifetimeSales: (project.lifetimeSales ?? 0) + unitsToday,
        lifetimeRevenue: (project.lifetimeRevenue ?? 0) + netRevenue,
      };
    }

    // Cash settlement — add net revenue to studio
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + netRevenue,
        lifetimeRevenue: next.studio.lifetimeRevenue + netRevenue,
      },
    };
  }

  return {
    ...next,
    activeSales: { ...next.activeSales, ...updatedSales },
    projects: { ...next.projects, ...projectUpdates },
  };
}

// Compute the fraction of total lifetime revenue earned on a given day.
// O(1) using the precomputed curveTotalWeight.
function salesCurveShare(daysSinceRelease: number, sale: ActiveSale): number {
  const t = daysSinceRelease;
  const hl = sale.decayHalfLife;
  let weight = Math.pow(0.5, t / hl);
  if (t < 7) weight *= sale.launchWeekBoost;
  return sale.curveTotalWeight > 0 ? weight / sale.curveTotalWeight : 0;
}

// ============ PUBLIC SALES-CURVE HELPERS ============
// Pure functions that mirror the release-time curve math so the
// release-approval UI can preview "if you ship at MC X, here's the shape"
// without duplicating constants. Any change here MUST stay in sync with the
// inline math inside releaseProject() — they describe the same curve.

export interface SalesCurveParams {
  /** Days the title stays on the active-sales tick. Score-tiered. */
  lifetimeDays: number;
  /** Multiplier applied to days 0–6 to model launch-week front-loading. */
  launchWeekBoost: number;
  /** Decay half-life in days; daily weight halves every halfLife. */
  decayHalfLife: number;
  /** Sum of all daily weights — used to normalize daily share to a fraction of lifetime. */
  curveTotalWeight: number;
}

/**
 * Resolve the curve parameters that {@link releaseProject} would use for a
 * release at the given Metacritic score. Pure — depends only on the score.
 */
export function salesCurveParamsForScore(metacritic: number): SalesCurveParams {
  const lifetimeDays =
    metacritic >= 90 ? 720 :
    metacritic >= 80 ? 540 :
    metacritic >= 70 ? 365 :
    metacritic >= 50 ? 240 :
    metacritic >= 35 ? 120 :
    60;
  const launchWeekBoost =
    metacritic >= 85 ? 3.5 :
    metacritic >= 70 ? 2.8 :
    metacritic >= 50 ? 2.2 :
    1.8;
  const decayHalfLife = Math.round(lifetimeDays / 4);

  let curveTotalWeight = 0;
  for (let d = 0; d < lifetimeDays; d++) {
    let w = Math.pow(0.5, d / decayHalfLife);
    if (d < 7) w *= launchWeekBoost;
    curveTotalWeight += w;
  }
  return { lifetimeDays, launchWeekBoost, decayHalfLife, curveTotalWeight };
}

/** Daily share of total lifetime revenue at day `t`, in [0, 1]. Pure. */
export function salesCurveDailyShare(t: number, p: SalesCurveParams): number {
  if (t < 0 || t >= p.lifetimeDays) return 0;
  let w = Math.pow(0.5, t / p.decayHalfLife);
  if (t < 7) w *= p.launchWeekBoost;
  return p.curveTotalWeight > 0 ? w / p.curveTotalWeight : 0;
}

// ============ RELEASE A PROJECT ============
export function releaseProject(state: GameState, projectId: ID): GameState {
  const project = state.projects[projectId];
  // Accept both statuses so the function can still be called by legacy
  // paths / saves that hold in_development at launch complete; the primary
  // gate is ready_to_release set by the launch-phase transition.
  if (!project) return state;
  if (project.status !== "ready_to_release" && project.status !== "in_development") return state;

  const year = isoToDate(state.currentDate).year;

  // 0. Split bugs into visible (review-affecting) and hidden (will surface post-launch).
  // Hidden ratio is driven by techDebt (crunch) and reduced by QA Lab capacity.
  const bugSplit = splitBugsAtRelease(state, project);

  // 1. Compute base quality (0-100) from accumulated axis points + bug penalty.
  // Penalty uses VISIBLE bugs only — hidden bugs are, by definition, unknown to reviewers.
  const baseQuality = computeBaseQuality(project);
  const bugPenalty = computeBugPenaltyFromVisible(bugSplit.visibleBugs);
  const finalQuality = Math.max(5, baseQuality - bugPenalty);

  // 2. Generate reviews from era-appropriate outlets
  const outlets = outletsActiveInYear(year);
  const { reviews, rng: rngAfterReviews } = generateReviews(
    state.rng,
    project,
    outlets,
    finalQuality
  );

  // 3. Aggregate metacritic score
  const metacritic = computeMetacritic(reviews, outlets);

  // 4. Project sales over time — create a sales curve
  let { lifetimeSales, lifetimeRevenue, rng: rngAfterSales } = projectSales(
    rngAfterReviews,
    project,
    state,
    metacritic,
    year
  );

  // Subscription buyout adjustment: if the player accepted a service deal at
  // ready_to_release, eat the agreed-upon chunk of lifetime units/revenue
  // before the active-sale curve is built. The flat cash payment was already
  // settled at acceptance time (see acceptSubscriptionOffer in subscriptions.ts);
  // here we just cap the upside.
  if (project.subscriptionDealAccepted && project.subscriptionSalesReductionPct) {
    const keepFrac = Math.max(0, 1 - project.subscriptionSalesReductionPct);
    lifetimeSales = Math.max(1000, Math.round(lifetimeSales * keepFrac));
    lifetimeRevenue = Math.round(lifetimeRevenue * keepFrac);
  }

  // 5. Resolve royalty rates for the ongoing sale.
  // Hand-coded projects (engineId === null) pay no engine royalty.
  const engine = project.engineId ? state.engines[project.engineId] : undefined;
  let engineRoyaltyRate = 0;
  // Use the resolved engine type (non-undefined) so the spread into state.engines typechecks.
  const engineUpdates: Record<ID, GameEngine> = {};
  if (engine) {
    // Player pays royalty only on engines they don't own
    if (engine.ownerStudioId !== state.studio.id) {
      engineRoyaltyRate = engine.licenseTerms.royaltyRate ?? 0;
    }
    engineUpdates[engine.id] = {
      ...engine,
      projectsBuilt: engine.projectsBuilt + 1,
    };
  }

  // Average platform royalty across all platforms
  let platformRoyaltyRate = 0;
  if (project.platformIds.length > 0) {
    let sum = 0;
    for (const pid of project.platformIds) {
      const plat = PLATFORM_BY_ID[pid];
      if (plat) sum += plat.royaltyRate;
    }
    platformRoyaltyRate = sum / project.platformIds.length;
  }

  // 6. Update IP (create new one if original, update existing if sequel)
  const { ipId, ipUpdates, rng: rngAfterIp } = updateIpForRelease(
    rngAfterSales,
    state,
    project,
    metacritic,
    lifetimeRevenue
  );

  // 7. Reputation impact on studio
  const repDelta = reputationDeltaFromScore(metacritic);
  const genreRepDelta = Math.round(repDelta * 1.5);

  // 8. Build the reception record
  // Launch-day fan reception: deterministic snapshot using the seeded RNG.
  // Players are slightly harsher than critics on average (-2 nudge), with a
  // small Gaussian spread. Live drift happens on Project.userScore via
  // tickPostLaunchBugs — this snapshot is the day-one number only.
  const [userScoreNoise, rngAfterUserScore] = rngGaussian(rngAfterIp, -2, 5);
  const initialUserScore = Math.max(5, Math.min(100, Math.round(metacritic + userScoreNoise)));
  const [, rngAfterRecId] = generateId("rcpt", rngAfterUserScore);
  const reception: ReleaseReception = {
    projectId,
    metacriticScore: metacritic,
    reviewIds: reviews.map((r) => r.id),
    userScore: initialUserScore,
    awardsWon: [],
  };

  // 9. Create the ActiveSale record — sales will pay out over time.
  // Curve params (lifetime days, launch-week boost, decay half-life) are
  // sourced from salesCurveParamsForScore() so the release-approval UI
  // can preview the exact same curve without duplicating the constants.
  const { lifetimeDays, launchWeekBoost, decayHalfLife, curveTotalWeight } =
    salesCurveParamsForScore(metacritic);

  const [saleId, rngAfterSaleId] = generateId("sale", rngAfterRecId);
  const activeSale: ActiveSale = {
    id: saleId,
    projectId,
    releaseDate: state.currentDate,
    lifetimeDays,
    daysOnSale: 0,
    projectedLifetimeUnits: lifetimeSales,
    projectedLifetimeRevenue: lifetimeRevenue,
    unitsSoldToDate: 0,
    revenueToDate: 0,
    launchWeekBoost,
    decayHalfLife,
    curveTotalWeight,
    engineRoyaltyRate,
    platformRoyaltyRate,
    engineId: engine?.id ?? null,
    active: true,
  };

  // 10. Released project record — no immediate cash; revenue accrues via ActiveSale.
  // Apply the bug split + initialize userScore from metacritic.
  const releasedProject: Project = {
    ...project,
    status: "released",
    actualReleaseDate: state.currentDate,
    metacriticScore: metacritic,
    reviewIds: reviews.map((r) => r.id),
    lifetimeSales: 0,           // accumulates via sale ticks
    lifetimeRevenue: 0,          // accumulates via sale ticks
    ipId: ipId,
    // Bug accounting at launch
    visibleBugs: bugSplit.visibleBugs,
    hiddenBugs: bugSplit.hiddenBugs,
    totalBugs: bugSplit.visibleBugs + bugSplit.hiddenBugs,
    launchedInBadState: bugSplit.launchedInBadState,
    userScore: initialUserScore, // launch-day fan reception; drifts via tickPostLaunchBugs
  };

  // Unassign staff + give them gamesWorkedOn credit + morale boost
  const staffUpdates: Record<ID, Staff> = {};
  for (const staffId of project.assignedStaffIds) {
    const s = state.staff[staffId];
    if (!s) continue;
    const morale = Math.min(100, s.morale + (metacritic >= 80 ? 15 : metacritic >= 60 ? 5 : -5));
    staffUpdates[staffId] = {
      ...s,
      currentProjectId: s.currentProjectId === projectId ? null : s.currentProjectId,
      gamesWorkedOn: [...s.gamesWorkedOn, projectId],
      morale,
      reputation: Math.min(100, s.reputation + Math.round(metacritic / 20)),
    };
  }

  // Reviews as records
  const newReviews: Record<ID, Review> = {};
  for (const r of reviews) newReviews[r.id] = r;

  // Bump platform familiarity for every platform we just shipped on.
  // Future projects targeting these platforms will generate fewer dev-phase bugs.
  const newPlatformFamiliarity = { ...state.studio.platformFamiliarity };
  for (const pid of project.platformIds) {
    newPlatformFamiliarity[pid] = (newPlatformFamiliarity[pid] ?? 0) + 1;
  }

  let next: GameState = {
    ...state,
    rng: rngAfterSaleId,
    projects: { ...state.projects, [projectId]: releasedProject },
    activeSales: { ...state.activeSales, [saleId]: activeSale },
    reviews: { ...state.reviews, ...newReviews },
    receptions: { ...state.receptions, [projectId]: reception },
    staff: { ...state.staff, ...staffUpdates },
    engines: { ...state.engines, ...engineUpdates },
    ips: { ...state.ips, ...ipUpdates },
    studio: {
      ...state.studio,
      reputation: Math.max(0, Math.min(100, state.studio.reputation + repDelta)),
      genreReputations: {
        ...state.studio.genreReputations,
        [project.genre]: Math.max(
          0,
          Math.min(100, (state.studio.genreReputations[project.genre] ?? 0) + genreRepDelta)
        ),
      },
      platformFamiliarity: newPlatformFamiliarity,
      gamesReleased: state.studio.gamesReleased + 1,
      ownedIpIds: ipId && !state.studio.ownedIpIds.includes(ipId)
        ? [...state.studio.ownedIpIds, ipId]
        : state.studio.ownedIpIds,
    },
    flags: { ...state.flags, [`${projectId}_released`]: true },
  };

  // 11. Log the release
  const scoreEmoji =
    metacritic >= 90 ? "🏆" : metacritic >= 80 ? "⭐" :
    metacritic >= 70 ? "👍" : metacritic >= 50 ? "" : "💔";
  const severity: "success" | "info" | "warning" | "danger" =
    metacritic >= 75 ? "success" : metacritic >= 50 ? "info" : "danger";

  next = appendLog(next, {
    category: "release",
    headline: `${project.name} released — Metacritic ${metacritic}${scoreEmoji ? " " + scoreEmoji : ""}`,
    body: `Projected ${lifetimeSales.toLocaleString()} units over ${lifetimeDays} days on sale.`,
    severity,
    relatedIds: { projectId },
  });

  // Bad-state launch — surface this loudly so the player knows a patch sprint is warranted.
  // Mirrors the Cyberpunk / No Man's Sky moment: critics may still be okay-ish, but players will revolt.
  if (bugSplit.launchedInBadState) {
    next = appendLog(next, {
      category: "release",
      headline: `${project.name} launched in a bad state — ${bugSplit.visibleBugs} visible bugs at launch`,
      body: `${bugSplit.hiddenBugs} more bugs are still hidden and will surface as players hammer on the game. A patch sprint is strongly recommended.`,
      severity: "danger",
      relatedIds: { projectId },
    });
  }

  // Pay any metacritic bonus the publisher promised (no-op if no deal,
  // no bonus clause, or score below threshold).
  next = payMetacriticBonus(next, projectId);

  // Market-mover evaluation — does this release start an industry shift?
  // Uses peak hype as the gate (MMO triggers via peak CCU happen later from
  // the live-service tick). Then bump copycat counts on any active shifts
  // that share this project's (genre × theme).
  next = evaluateMarketShiftFromRelease(next, {
    projectId,
    projectName: project.name,
    genre: project.genre,
    theme: project.theme,
    projectedLifetimeSales: lifetimeSales,
    peakHype: project.hypeLevel,
    isMmo: false,
  });
  next = recordCopycatRelease(next, {
    projectId,
    genre: project.genre,
    theme: project.theme,
  });

  return next;
}

// ============ QUALITY COMPUTATION ============

// Exported wrapper so UI (release-approval sales preview) can read the same
// base-quality number the release engine uses. Excludes bug penalty because
// visible bugs aren't known until reviews roll — the UI represents the
// "production quality" floor the player has built toward.
export function computeProjectBaseQuality(project: Project): number {
  return computeBaseQuality(project);
}

function computeBaseQuality(project: Project): number {
  // Weight each quality axis by its genre's axisWeights.
  // Each axis value is an accumulated-points figure (can be thousands);
  // normalize by dividing by a scale factor and clamping to 0-100.
  const genre = GENRE_BY_ID[project.genre]!;
  let weighted = 0;
  let totalWeight = 0;
  for (const [axis, weight] of Object.entries(genre.axisWeights) as [QualityAxis, number][]) {
    const axisValue = project.qualityAxes[axis] ?? 0;
    // Normalize: 5000 points = 100 quality on that axis (tune this as we balance)
    const normalized = Math.min(100, (axisValue / 50));
    weighted += normalized * weight;
    totalWeight += weight;
  }
  const base = totalWeight > 0 ? weighted / totalWeight : 0;

  // Theme × Genre synergy multiplier
  const theme = THEME_BY_ID[project.theme];
  const themeAffinity = theme?.genreAffinity[project.genre] ?? 0.5;
  const synergyMult = 0.7 + themeAffinity * 0.4; // 0.7 to 1.1
  return Math.min(100, base * synergyMult);
}

// Review-time bug penalty: only VISIBLE bugs hit reviews. Hidden bugs surface post-launch
// and depress the rolling user score (and sales) instead — see engine/systems/bugs.ts.
function computeBugPenaltyFromVisible(visibleBugs: number): number {
  if (visibleBugs <= 0) return 0;
  return Math.min(30, Math.log10(visibleBugs + 1) * 8);
}

// ============ REVIEW GENERATION ============

function generateReviews(
  rng: GameState["rng"],
  project: Project,
  outlets: readonly ReviewOutlet[],
  baseQuality: number
): { reviews: Review[]; rng: GameState["rng"] } {
  let r = rng;

  // Sample 6-8 outlets, weighted by influence + genre specialty
  const [count, r1] = rngInt(r, 6, 8);
  r = r1;

  // Score outlets by interest in this release
  const weighted = outlets.map((o) => {
    let w = o.influence;
    if (o.genreSpecialty === project.genre) w *= 2.5;
    return { outlet: o, weight: w };
  }).sort((a, b) => b.weight - a.weight);

  // Take the top N but with a bit of randomness so the top-influence outlets
  // don't always cover — we pick count * 1.5 candidates, shuffle, take first N
  const candidatePool = weighted.slice(0, Math.max(count, Math.min(weighted.length, count + 4)));
  const reviews: Review[] = [];
  const usedOutletIds = new Set<string>();

  for (let i = 0; i < count && i < candidatePool.length; i++) {
    // Pick next unused outlet from candidate pool, weighted by remaining
    const remaining = candidatePool.filter((c) => !usedOutletIds.has(c.outlet.id));
    if (remaining.length === 0) break;
    const [idx, nextR] = rngInt(r, 0, remaining.length - 1);
    r = nextR;
    const outlet = remaining[idx]!.outlet;
    usedOutletIds.add(outlet.id);

    // Score = baseQuality + outlet bias + personality modifiers + randomness
    let score = baseQuality + outlet.scoreBias * 100;

    // Personality modifiers
    const genre = GENRE_BY_ID[project.genre]!;
    switch (outlet.personality) {
      case "hype_chaser":
        score += Math.min(10, project.hypeLevel / 10); // marketing matters more
        break;
      case "cynical":
        score -= 5; // baseline grumpy
        break;
      case "tech_focused":
        // Weight graphics/polish heavier — if engine was weak, this hurts
        score += (project.qualityAxes.graphics / 50 - baseQuality) * 0.3;
        score += (project.qualityAxes.polish / 50 - baseQuality) * 0.2;
        break;
      case "narrative_focused":
        score += (project.qualityAxes.story / 50 - baseQuality) * 0.4;
        break;
      case "audio_focused":
        // Mirrors tech_focused / narrative_focused pattern — outlets that
        // care about sound either reward strong soundtracks or punish weak
        // mixing, regardless of how the genre's default weights treat it.
        // Weighting parity with narrative_focused (0.4) — sound is now a
        // first-class craft pillar in their eyes.
        score += (project.qualityAxes.sound / 50 - baseQuality) * 0.4;
        break;
      case "hardcore":
        score += (project.qualityAxes.gameplay / 50 - baseQuality) * 0.3;
        score -= 3; // harder to please
        break;
      case "casual":
        score += (project.qualityAxes.polish / 50 - baseQuality) * 0.2;
        if (project.audience === "kids" || project.audience === "everyone") score += 3;
        break;
      case "indie":
        // Big budgets annoy them; small budgets get bonus
        if (project.budget.total > 10000000000) score -= 5;
        else if (project.budget.total < 1000000000) score += 4;
        break;
      case "genre_specialist":
        if (outlet.genreSpecialty === project.genre) score += 3;
        else score -= 2;
        break;
      case "streamer":
        // Rewards chaotic, viral-friendly games (high gameplay + sound)
        score += Math.min(5, project.hypeLevel / 15);
        break;
      case "speedrunner":
        score += (project.qualityAxes.gameplay / 50 - baseQuality) * 0.3;
        break;
    }

    // Gaussian noise per outlet
    const [noise, nextR2] = rngGaussian(r, 0, outlet.biasStdDev * 100);
    r = nextR2;
    score += noise;

    // Clamp
    score = Math.max(1, Math.min(100, Math.round(score)));

    // Build axis breakdown (per-axis normalized score)
    const axisScores: Record<string, number> = {};
    for (const [axis, val] of Object.entries(project.qualityAxes)) {
      axisScores[axis] = Math.round(Math.min(100, (val as number) / 50));
    }

    const [id, nextR3] = generateId("rev", r);
    r = nextR3;

    const blurb = generateBlurb(outlet, score, project);

    reviews.push({
      id,
      projectId: project.id,
      outletId: outlet.id,
      score,
      blurb,
      publishedDate: project.actualReleaseDate ?? "",
      axisScores,
    });
  }

  return { reviews, rng: r };
}

function generateBlurb(outlet: ReviewOutlet, score: number, project: Project): string {
  const genre = GENRE_BY_ID[project.genre]?.name ?? "game";
  const high = score >= 85;
  const good = score >= 70 && score < 85;
  const mid = score >= 50 && score < 70;
  const low = score < 50;

  switch (outlet.blurbStyle) {
    case "snarky":
      if (high) return `Somehow, against all odds, ${project.name} doesn't completely ruin the ${genre} genre.`;
      if (good) return `${project.name} is... fine? I guess? Sure.`;
      if (mid) return `If you squint, you can almost see a better ${genre} underneath ${project.name}.`;
      return `${project.name} is exactly the kind of game we expected — disappointing.`;
    case "earnest":
      if (high) return `${project.name} is a triumph. A rare and genuinely moving ${genre} experience.`;
      if (good) return `${project.name} delivers on its promises. Recommended for ${genre} fans.`;
      if (mid) return `${project.name} has real heart, even when the execution stumbles.`;
      return `${project.name} tries so hard that it hurts to see it fall short.`;
    case "technical":
      if (high) return `Architecturally excellent. ${project.name} sets a new bar for ${genre} design.`;
      if (good) return `${project.name} executes its systems cleanly with few rough edges.`;
      if (mid) return `${project.name} shows competence but lacks the polish top-tier ${genre}s demand.`;
      return `${project.name} exhibits fundamental issues that undermine its ambitions.`;
    case "breathless":
      if (high) return `INCREDIBLE. ${project.name} is the ${genre} of the year — maybe the decade!`;
      if (good) return `${project.name} blew us away with its scope and energy.`;
      if (mid) return `${project.name} has moments of brilliance amid uneven pacing.`;
      return `${project.name} fails to live up to the hype, sadly.`;
    case "detached":
      if (high) return `${project.name} accomplishes what it sets out to do with considerable skill.`;
      if (good) return `A competent entry in the ${genre} space.`;
      if (mid) return `${project.name} is neither exceptional nor regrettable.`;
      return `${project.name} does not achieve its aims.`;
    case "meme":
      if (high) return `${project.name} hits different. 10/10 no notes.`;
      if (good) return `${project.name} is actually kinda based.`;
      if (mid) return `${project.name} is mid. Like, full mid.`;
      return `${project.name} is not it, chief.`;
  }
}

// ============ METACRITIC AGGREGATION ============

function computeMetacritic(reviews: readonly Review[], outlets: readonly ReviewOutlet[]): number {
  if (reviews.length === 0) return 0;
  const byId = new Map(outlets.map((o) => [o.id, o] as const));
  let weightedSum = 0;
  let totalWeight = 0;
  for (const r of reviews) {
    const o = byId.get(r.outletId);
    const w = o ? o.influence : 50;
    weightedSum += r.score * w;
    totalWeight += w;
  }
  return Math.round(weightedSum / totalWeight);
}

// ============ SALES PROJECTION ============

function projectSales(
  rng: GameState["rng"],
  project: Project,
  state: GameState,
  metacritic: number,
  year: number
): { lifetimeSales: number; lifetimeRevenue: number; rng: GameState["rng"] } {
  let r = rng;

  // Base potential: sum of platform install bases × audience fit × genre affinity
  let marketPotential = 0;
  for (const pid of project.platformIds) {
    const plat = PLATFORM_BY_ID[pid];
    if (!plat) continue;
    const installed = state.market.platformInstallBase[pid] ?? 0; // in millions
    // "everyone" audience averages across all demographic buckets
    const audienceFit = project.audience === "everyone"
      ? (plat.audienceProfile.kids + plat.audienceProfile.teens +
         plat.audienceProfile.young_adults + plat.audienceProfile.mature) / 4
      : plat.audienceProfile[project.audience] ?? 0.5;
    const genreAffinity = plat.genreAffinity[project.genre] ?? 0.5;
    // A platform with 50M installed, 0.7 audience fit, 0.8 genre = 50M × 0.56 = 28M addressable
    marketPotential += installed * 1_000_000 * audienceFit * genreAffinity;
  }

  // Score multiplier — 60 MC = 1.0x baseline.
  //   Curve: Math.pow(mc/60, 3.0) gives steep quality sensitivity.
  //   Below MC 50, a "flop cliff" kicks in — bad reviews kill word of mouth
  //   multiplicatively, so a MC 30 game isn't just a weaker MC 60, it's
  //   returned to store shelves and warehoused.
  //   Reference curve:
  //     MC 20 → 0.003   MC 30 → 0.013   MC 40 → 0.190   MC 50 → 0.579
  //     MC 60 → 1.000   MC 70 → 1.588   MC 80 → 2.370   MC 90 → 3.375
  let scoreMultiplier = Math.pow(metacritic / 60, 3.0);
  if (metacritic < 50) {
    // Additional penalty: (mc/50)^2 — at MC 30, further 36% multiplier
    //                                 at MC 40, further 64% multiplier
    scoreMultiplier *= Math.pow(metacritic / 50, 2.0);
  }

  // Hype → marketing impact. Note: marketing can prop up a mediocre game
  // but can't save a flop — multiplicative with scoreMultiplier, not
  // additive, so a 0.01 score mult × 1.3 marketing is still 0.013.
  // Defensive: a malformed budget (undefined / NaN) would otherwise cascade
  // through Math.log10 → conversion → Math.max(1000, NaN) and produce a
  // NaN sale. Treat any non-finite budget as zero marketing spend.
  const rawMarketingBudget = project.budget?.marketing;
  const marketingBudget = Number.isFinite(rawMarketingBudget) ? rawMarketingBudget : 0;
  const marketingMultiplier = 1 + Math.log10(marketingBudget / 100000 + 1) * 0.15;

  // Franchise bonus — sequels get fan affinity boost
  let franchiseMult = 1.0;
  if (project.ipId) {
    const ip = state.ips[project.ipId];
    if (ip) {
      franchiseMult = 1 + ip.fanAffinity / 200;  // +50% at max affinity
      // Fatigue hurts — too many sequels saturate the market
      franchiseMult *= Math.max(0.5, 1 - ip.fatigue / 200);
    }
  }

  // Active market-mover boost (or played-out undershoot) for this combo.
  // 1.0 = neutral; >1 = a wave amplifying demand for this genre × theme;
  // <1 = the combo is "played out" after a recent wave.
  const shiftMult = marketShiftMultiplierFor(state, project.genre, project.theme);

  // Conversion rate: what fraction of addressable market actually buys.
  // 1.0% baseline for a 60 MC game (was 1.5% — dropped to make flops flop;
  // great games still earn via scoreMultiplier which exceeds 3x at MC 90).
  const conversion = 0.010 * scoreMultiplier * marketingMultiplier * franchiseMult * shiftMult;

  // Randomness
  const [variance, r2] = rngFloat(r, 0.8, 1.25);
  r = r2;

  // Defensive NaN clamp: Math.max(1000, NaN) === NaN — so guard explicitly.
  const rawSales = marketPotential * conversion * variance;
  const lifetimeSales = Number.isFinite(rawSales)
    ? Math.max(1000, Math.round(rawSales))
    : 1000;

  // Price per unit — era and platform dependent (cents)
  const avgPrice = estimateUnitPrice(project.platformIds, year);
  const lifetimeRevenue = lifetimeSales * (Number.isFinite(avgPrice) ? avgPrice : 4000);

  return { lifetimeSales, lifetimeRevenue, rng: r };
}

function estimateUnitPrice(platformIds: readonly string[], year: number): number {
  // Rough per-platform pricing, in cents. Mobile is much cheaper; PC/console AAA around $40-60.
  let total = 0;
  let count = 0;
  for (const pid of platformIds) {
    const plat = PLATFORM_BY_ID[pid];
    if (!plat) continue;
    let price = 4000; // $40 baseline
    if (plat.kind === "mobile") price = 300; // mostly F2P or $3
    else if (plat.kind === "arcade") price = 50; // per-play, averaged
    else if (plat.kind === "cloud") price = 2000; // subscription / bundles
    else if (plat.kind === "pc") price = 3000; // sales, keys
    else if (plat.kind === "neural") price = 8000; // premium in-era
    else price = year < 1990 ? 3000 : year < 2000 ? 5000 : year < 2015 ? 6000 : 6500;
    total += price;
    count++;
  }
  return count > 0 ? Math.round(total / count) : 4000;
}

// ============ IP / FRANCHISE UPDATES ============

function updateIpForRelease(
  rng: GameState["rng"],
  state: GameState,
  project: Project,
  metacritic: number,
  lifetimeRevenue: number
): { ipId: ID; ipUpdates: Record<ID, IP>; rng: GameState["rng"] } {
  let r = rng;
  const ipUpdates: Record<ID, IP> = {};

  // Existing IP (sequel)
  if (project.ipId) {
    const ip = state.ips[project.ipId];
    if (ip) {
      const affinityDelta = metacritic >= 80 ? 12 : metacritic >= 60 ? 5 : -8;
      // Fatigue builds faster on rapid sequels
      const fatigueDelta = project.isSequel ? 15 : 0;
      ipUpdates[ip.id] = {
        ...ip,
        fanAffinity: Math.max(0, Math.min(100, ip.fanAffinity + affinityDelta)),
        fatigue: Math.max(0, Math.min(100, ip.fatigue + fatigueDelta)),
        projectIds: [...ip.projectIds, project.id],
        lastReleaseDate: project.actualReleaseDate ?? state.currentDate,
        peakScore: Math.max(ip.peakScore, metacritic),
        lifetimeRevenue: ip.lifetimeRevenue + lifetimeRevenue,
      };
      return { ipId: ip.id, ipUpdates, rng: r };
    }
  }

  // New IP — every original release automatically establishes a franchise
  // record. Fan affinity scales with quality: a flop spawns a near-dead IP
  // (low affinity, hard to build on) while a hit spawns a strong one.
  // Players can rename the IP on the /ips page if they want the franchise
  // to carry a different banner than the first game's title.
  const [id, r2] = generateId("ip", r);
  r = r2;
  // Affinity curve:
  //   MC  20 →   0
  //   MC  40 →  ~8
  //   MC  60 →  20
  //   MC  70 →  30
  //   MC  80 →  45
  //   MC  95 →  70
  const baseAffinity = Math.max(0, Math.round((metacritic - 20) * 0.9));
  const fanAffinity = Math.min(70, baseAffinity);
  const newIp: IP = {
    id,
    name: project.name,
    originalProjectId: project.id,
    genreId: project.genre,
    themeId: project.theme,
    fanAffinity,
    fatigue: 0,
    projectIds: [project.id],
    lastReleaseDate: project.actualReleaseDate ?? state.currentDate,
    peakScore: metacritic,
    lifetimeRevenue,
  };
  ipUpdates[id] = newIp;
  return { ipId: id, ipUpdates, rng: r };
}

// ============ REPUTATION IMPACT ============

function reputationDeltaFromScore(metacritic: number): number {
  if (metacritic >= 95) return 12;
  if (metacritic >= 85) return 7;
  if (metacritic >= 75) return 4;
  if (metacritic >= 65) return 2;
  if (metacritic >= 50) return 0;
  if (metacritic >= 35) return -3;
  return -6;
}
