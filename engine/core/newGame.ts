// Initializes a fresh GameState from player inputs at the new-game screen.
// Applies the starting era preset, spawns the founder, spins up competitors,
// hydrates third-party engines available at the start year, sets up office,
// and queues the first hiring pool.

import type { GameState } from "./state";
import type { Staff } from "../types/staff";
import type { Competitor } from "../types/competitor";
import type { GameEngine } from "../types/engine";
import type { Office } from "../types/office";
import type { Publisher } from "../types/publisher";

import { STARTING_PRESET_BY_ID } from "../data/eras";
import { COMPETITOR_SEEDS } from "../data/competitorSeeds";
import { PUBLISHER_SEEDS } from "../data/publishers";
import { OFFICE_TIER_BY_ID } from "../data/officeRooms";
import { thirdPartyEnginesAvailableInYear, hydrateThirdPartyEngine } from "../data/thirdPartyEngines";
import { PLATFORMS } from "../data/platforms";

import { createRng, rngInt, rngFloat } from "./rng";
import { generateId } from "./ids";
import { makeDate, dateToIso } from "./time";
import { generateStaff } from "../systems/staffGenerator";

export interface NewGameOptions {
  seed?: number;
  startingPresetId: string;        // from STARTING_ERA_PRESETS
  studioName: string;
  founderName: string;
  founderArchetype: "programmer" | "designer" | "artist";
  founderCity: string;
}

export function createNewGameState(options: NewGameOptions): GameState {
  const preset = STARTING_PRESET_BY_ID[options.startingPresetId];
  if (!preset) throw new Error(`Unknown starting preset: ${options.startingPresetId}`);

  const seed = options.seed ?? Math.floor(Math.random() * 0xffffffff);
  let rng = createRng(seed);

  const startDate = makeDate(preset.startYear, 1, 1);
  const startIso = dateToIso(startDate);

  // ============ STUDIO ============
  const [studioId, r1] = generateId("studio", rng);
  rng = r1;

  // ============ FOUNDER (first staff) ============
  const founderRole =
    options.founderArchetype === "programmer" ? "programmer" :
    options.founderArchetype === "designer" ? "designer" : "artist";

  const [founderBase, rFounder] = generateStaff(rng, {
    role: founderRole,
    forceTier: "senior",  // founder starts as a senior
    minAge: 28,
    maxAge: 45,
  });
  rng = rFounder;

  const founder: Staff = {
    ...founderBase,
    name: options.founderName,
    status: "employed",
    hiredOn: startIso,
    morale: 90,
    loyalty: 100,
    salary: 0, // founder doesn't draw salary until studio has cash cushion
  };

  // ============ OFFICE ============
  const officeTier = OFFICE_TIER_BY_ID[preset.startingOfficeTier as keyof typeof OFFICE_TIER_BY_ID]
    ?? OFFICE_TIER_BY_ID.garage;
  const [officeId, r2] = generateId("office", rng);
  rng = r2;

  const office: Office = {
    id: officeId,
    tier: officeTier.tier,
    city: options.founderCity,
    rooms: [],
    gridWidth: officeTier.gridWidth,
    gridHeight: officeTier.gridHeight,
    monthlyRent: officeTier.monthlyRent,
    totalCapacity: 0,
    amenityScore: 0,
  };

  // ============ THIRD-PARTY ENGINES ============
  const availableEngines = thirdPartyEnginesAvailableInYear(preset.startYear);
  const engines: Record<string, GameEngine> = {};
  for (const seed of availableEngines) {
    const hydrated = hydrateThirdPartyEngine(seed, preset.startYear);
    engines[hydrated.id] = hydrated;
  }

  // ============ COMPETITORS ============
  // Only spawn competitors that were founded on or before start year
  const activeCompSeeds = COMPETITOR_SEEDS.filter((c) => c.foundedYear <= preset.startYear);
  const competitors: Record<string, Competitor> = {};
  // Reverse map: parent publisher seed id -> [generated competitor ids]. Used
  // below to populate Publisher.ownedStudioIds when we hydrate publishers.
  // We only link to publishers whose foundedYear is also <= startYear; if the
  // parent publisher won't be founded until later, the child competitor simply
  // starts independent until that publisher arrives (future M&A tick can
  // back-fill the relationship).
  const publisherSeedById = new Map(PUBLISHER_SEEDS.map((p) => [p.id, p]));
  const childrenByPublisherId: Record<string, string[]> = {};
  for (const seed of activeCompSeeds) {
    const [id, rCompId] = generateId("comp", rng);
    rng = rCompId;
    // Scale reputation up if they've been around longer than start year
    const yearsSinceFounded = preset.startYear - seed.foundedYear;
    const reputationBoost = Math.min(40, yearsSinceFounded * 3);
    // Random cash variance
    const [cashVar, rCashVar] = rngFloat(rng, 0.7, 1.3);
    rng = rCashVar;

    // Resolve parent publisher — only if that publisher is also hydrated by
    // start year. Otherwise the studio starts independent.
    let parentPublisherId: string | undefined;
    if (seed.parentPublisherId) {
      const parentSeed = publisherSeedById.get(seed.parentPublisherId);
      if (parentSeed && parentSeed.foundedYear <= preset.startYear) {
        parentPublisherId = seed.parentPublisherId;
        (childrenByPublisherId[parentPublisherId] ||= []).push(id);
      }
    }

    competitors[id] = {
      id,
      name: seed.name,
      founderName: seed.founderName,
      hqCity: seed.hqCity,
      foundedYear: seed.foundedYear,
      strategy: seed.strategy,
      cash: Math.round(seed.startingCash * cashVar),
      staffCount: seed.startingStaffCount + Math.floor(yearsSinceFounded * 1.5),
      reputation: Math.min(100, seed.startingReputation + reputationBoost),
      marketCap: Math.round(seed.startingCash * 3 * cashVar),
      releasedProjectIds: [],
      activeProjectIds: [],
      ownedIpIds: [],
      ownedEngineIds: [],
      preferredGenres: seed.preferredGenres,
      genreReputations: {},
      status: "active",
      annualRevenue: [],
      lastDecisionDate: startIso,
      parentPublisherId,
    };
  }

  // ============ INITIAL HIRING POOL ============
  const [poolSize, rPool] = rngInt(rng, 4, 7);
  rng = rPool;
  const candidateStaff: Record<string, Staff> = {};
  const candidateIds: string[] = [];
  for (let i = 0; i < poolSize; i++) {
    const [candidate, rC] = generateStaff(rng);
    rng = rC;
    candidateStaff[candidate.id] = candidate;
    candidateIds.push(candidate.id);
  }

  // ============ PUBLISHERS ============
  // Hydrate publisher seeds whose foundedYear has passed by start year.
  // The rest get founded on Jan 1 of their seed year via maybeFoundNewPublisher.
  // Placed after staff/hiring so my RNG consumption doesn't shift those draws —
  // keeps the fixed-seed smoke test deterministic across this change.
  const activePubSeeds = PUBLISHER_SEEDS.filter((p) => p.foundedYear <= preset.startYear);
  const publishers: Record<string, Publisher> = {};
  for (const seed of activePubSeeds) {
    // Reputation drift: publishers that have been around longer get a modest bump,
    // capped so a 1980 start doesn't hand indie labels mega-tier rep overnight.
    const yearsSinceFounded = preset.startYear - seed.foundedYear;
    const reputationBoost = Math.min(20, Math.floor(yearsSinceFounded * 1.5));
    const [cashVar, rCashVar] = rngFloat(rng, 0.8, 1.25);
    rng = rCashVar;
    const cash = Math.round(seed.startingCash * cashVar);
    const reputation = Math.min(100, seed.startingReputation + reputationBoost);

    publishers[seed.id] = {
      id: seed.id,
      name: seed.name,
      hqCity: seed.hqCity,
      foundedYear: seed.foundedYear,
      tier: seed.tier,
      reputation,
      cash,
      // Same formula tickPublishersMonthly uses on recompute so the first
      // monthly roll doesn't snap to a different number immediately.
      marketCap: Math.round(cash * 4 * (1 + reputation / 100)),
      preferredGenres: seed.preferredGenres,
      minReputationToSign: seed.minReputationToSign,
      baseRevenueShare: seed.baseRevenueShare,
      baseAdvanceMultiplier: seed.baseAdvanceMultiplier,
      baseMarketingBudgetMultiplier: seed.baseMarketingBudgetMultiplier,
      status: "active",
      publishedGameIds: [],
      lifetimeRevenue: 0,
      // Wired from CompetitorSeed.parentPublisherId above — the list of
      // studios this publisher owns at game start. Kept in sync by future
      // acquire-studio logic.
      ownedStudioIds: childrenByPublisherId[seed.id] ?? [],
    };
  }

  // ============ MARKET STATE ============
  const platformInstallBase: Record<string, number> = {};
  for (const p of PLATFORMS) {
    if (preset.startYear >= p.launchYear && preset.startYear < p.discontinuedYear) {
      // Estimate current install base based on year relative to peak
      const yearsFromPeak = Math.abs(preset.startYear - p.peakYear);
      const lifecycleLength = p.discontinuedYear - p.launchYear;
      const peakPhase = Math.max(0.15, 1 - yearsFromPeak / Math.max(3, lifecycleLength / 2));
      platformInstallBase[p.id] = p.peakInstallBase * peakPhase;
    }
  }

  // ============ ASSEMBLE STATE ============
  const state: GameState = {
    version: 1,
    rng,
    seed,

    currentDate: startIso,
    startDate: startIso,
    gameSpeed: 0,  // start paused — UI unpauses after tutorial/briefing
    daysElapsed: 0,

    startingPresetId: preset.id,

    studio: {
      id: studioId,
      name: options.studioName,
      founderName: options.founderName,
      founderArchetype: options.founderArchetype,
      foundedDate: startIso,
      cash: preset.startingCash,
      debt: 0,
      lifetimeRevenue: 0,
      // Seed the financials time series with the opening balance so the chart
      // has an anchor point on day 1. Subsequent samples get appended at the
      // start of each month by the tick dispatcher.
      cashHistory: [
        {
          date: startIso,
          cash: preset.startingCash,
          lifetimeRevenue: 0,
          debt: 0,
        },
      ],
      reputation: 5,
      genreReputations: {},
      repHits: [],
      platformFamiliarity: {},
      completedTechIds: [...preset.preUnlockedTechIds],
      activeEngineLicenseIds: [],
      ownedEngineIds: [],
      // No prior project yet — the new-project form will fall back to
      // hand-coded (or to the only available engine if there is one).
      lastUsedEngineId: null,
      ownedIpIds: [],
      ownedPublisherIds: [],
      isPublicCompany: false,
      marketCap: 0,
      gamesReleased: 0,
      gamesCancelled: 0,
      awardsWon: 0,
      timesAtNumberOne: 0,
    },

    staff: {
      [founder.id]: founder,
      ...candidateStaff,
    },
    projects: {},
    ips: {},
    activeSales: {},
    patchSprints: {},
    engines,
    engineProjects: {},
    engineLicenses: {},
    researchProjects: {},

    competitors,
    competitorGames: {},

    reviews: {},
    receptions: {},

    office,

    market: {
      economicCycle: 0,
      genreTrends: {},
      themeTrends: {},
      platformInstallBase,
      activeShifts: [],
      playedOutShifts: [],
    },

    hiringPool: {
      lastRefreshDate: startIso,
      candidateIds,
    },

    pendingEvents: [],
    firedScheduledEventIds: [],
    firedOneShotEventIds: [],
    activeChains: {},
    completedChainIds: [],

    awards: [],
    contracts: {},
    publishingDeals: {},
    // Player-imprint deals signing competitor studios for distribution. Created
    // via signCompetitorToImprint(); fulfilled at competitor release time.
    competitorPublishingDeals: {},
    // Hydrated above from PUBLISHER_SEEDS (filtered by foundedYear <= startYear).
    // Remaining seeds come online on Jan 1 of their foundedYear via maybeFoundNewPublisher.
    publishers,
    // DLC is created post-release via systems/dlc.ts; start empty.
    dlcs: {},
    // Live-service state is created on demand via enableLiveService().
    liveServices: {},

    log: [],
    maxLogEntries: 500,

    flags: {},
    metadata: {},
  };

  return state;
}
