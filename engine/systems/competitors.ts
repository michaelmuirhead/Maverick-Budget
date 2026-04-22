// Competitor AI system.
//
// Each competitor AI studio runs at a coarser simulation tier than the player —
// we don't track individual staff or phase sliders. Instead, every competitor
// makes monthly strategic decisions: start a game, sign an engine license,
// release a game, or grow the studio. This keeps the sim lightweight while
// producing a living world.
//
// Competitor game quality is computed directly from studio reputation, strategy,
// and engine tier rather than simulated day-by-day. The fidelity is "good enough
// to feel real" while keeping thousands of competitor-games cheap to run.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { Competitor, CompetitorGame, CompetitorStrategy } from "../types/competitor";
import type { GenreId } from "../types/genre";
import type { GameEngine } from "../types/engine";

import { GENRE_BY_ID } from "../data/genres";
import { PLATFORMS } from "../data/platforms";
import { outletsActiveInYear } from "../data/reviewOutlets";
import { COMPETITOR_SEEDS } from "../data/competitorSeeds";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate, addDays, dateToIso, daysBetween } from "../core/time";
import { rngInt, rngFloat, rngPick, rngChance, rngGaussian, rngWeighted } from "../core/rng";
import { signEngineLicenseIfNew, recordLicenseeRelease } from "./engineLicensing";
import { applyCompetitorPublisherCutOnRelease } from "./playerImprint";

// ============ INTERNAL STATE TRACKING ============
// We use the state's `flags` for booleans and `metadata` for non-boolean values.
// This keeps strict typing while avoiding extending the Competitor type further.

function competitorActiveTitleFlag(compId: ID): string {
  return `comp_${compId}_inprog`;
}
function competitorReleaseDateKey(compId: ID): string {
  return `comp_${compId}_releaseOn`;
}
function competitorProjectTitleKey(compId: ID): string {
  return `comp_${compId}_title`;
}
function competitorProjectGenreKey(compId: ID): string {
  return `comp_${compId}_genre`;
}
function competitorProjectEngineKey(compId: ID): string {
  return `comp_${compId}_engine`;
}
function competitorProjectBudgetKey(compId: ID): string {
  return `comp_${compId}_budget`;
}
function competitorProjectIsSequelFlag(compId: ID): string {
  return `comp_${compId}_sequel`;
}

// ============ MAIN TICK ============
// Release checks run daily (release date may land on any day).
// Strategic decisions (starting new games) only run at month start.
export function tickCompetitors(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  const isMonthStart = today.day === 1;

  let next = state;
  for (const compId of Object.keys(state.competitors)) {
    next = tickOneCompetitor(next, compId, isMonthStart);
  }
  return next;
}

function tickOneCompetitor(state: GameState, compId: ID, isMonthStart: boolean): GameState {
  const comp = state.competitors[compId];
  if (!comp || comp.status !== "active") return state;

  let next = state;

  // 1. If they have a release date, check if today is release day (daily check)
  const releaseDateIso = state.metadata[competitorReleaseDateKey(compId)];
  if (typeof releaseDateIso === "string" && releaseDateIso && releaseDateIso <= state.currentDate) {
    next = releaseCompetitorGame(next, compId);
    // Continue so they can start another project immediately if scheduled
  }

  // 2. Monthly: if no active title, consider starting one
  if (isMonthStart && !next.flags[competitorActiveTitleFlag(compId)]) {
    next = maybeStartCompetitorGame(next, compId);
  }

  return next;
}

// ============ DECIDE & START A NEW GAME ============
function maybeStartCompetitorGame(state: GameState, compId: ID): GameState {
  const comp = state.competitors[compId];
  if (!comp) return state;

  // Base monthly chance to start a game, scaled by strategy
  const baseChance: Record<CompetitorStrategy, number> = {
    prestige: 0.15,      // low volume, high craft
    volume: 0.7,         // ship constantly
    innovator: 0.25,     // selective risk-taking
    copycat: 0.5,        // trend follower
    casual: 0.55,        // steady mobile/casual output
    hardcore: 0.25,      // niche but ambitious
    blockbuster: 0.2,    // huge projects, less often
    indie: 0.3,          // small team, small scope
  };

  let rng = state.rng;
  const [roll, r1] = rngChance(rng, baseChance[comp.strategy]);
  rng = r1;
  if (!roll) return { ...state, rng };

  // They need enough cash to start
  const budget = estimateProjectBudget(comp, state);
  if (comp.cash < budget) {
    return { ...state, rng };
  }

  // Pick a genre — weighted toward their preferences
  const [genre, r2] = pickCompetitorGenre(rng, comp);
  rng = r2;

  // Decide if sequel (only if they have recent hits to sequel)
  const [sequelRoll, r3] = rngChance(rng, comp.strategy === "copycat" || comp.strategy === "blockbuster" ? 0.3 : 0.15);
  rng = r3;
  const shouldSequel = sequelRoll && comp.releasedProjectIds.length > 0;

  // Pick an engine — prefer owned, else license
  const [engineId, r4] = pickCompetitorEngine(rng, state, comp, genre);
  rng = r4;
  if (!engineId) return { ...state, rng }; // no valid engine; skip this month

  // Build a title name
  const [title, r5] = generateCompetitorTitle(rng, comp, genre, shouldSequel);
  rng = r5;

  // Schedule release date — 6 to 24 months from now, tuned by strategy
  const [devMonths, r6] = rngInt(
    rng,
    comp.strategy === "blockbuster" || comp.strategy === "prestige" ? 15 : 6,
    comp.strategy === "blockbuster" || comp.strategy === "prestige" ? 30 : 18
  );
  rng = r6;
  const releaseDate = addDays(isoToDate(state.currentDate), devMonths * 30);
  const releaseDateIso = dateToIso(releaseDate);

  // Deduct budget up front (the AI's "investment")
  const updatedComp: Competitor = {
    ...comp,
    cash: comp.cash - budget,
    lastDecisionDate: state.currentDate,
  };

  let next: GameState = {
    ...state,
    rng,
    competitors: { ...state.competitors, [compId]: updatedComp },
    flags: {
      ...state.flags,
      [competitorActiveTitleFlag(compId)]: true,
      [competitorProjectIsSequelFlag(compId)]: shouldSequel,
    },
    metadata: {
      ...state.metadata,
      [competitorReleaseDateKey(compId)]: releaseDateIso,
      [competitorProjectTitleKey(compId)]: title,
      [competitorProjectGenreKey(compId)]: genre,
      [competitorProjectEngineKey(compId)]: engineId,
      [competitorProjectBudgetKey(compId)]: budget,
    },
  };

  // If they licensed from the player, stamp an EngineLicense (if new to
  // this licensee) and collect the upfront license fee. A licensee who
  // signs on for multiple games pays the fee each time (per-project
  // licensing) but only bumps totalLicensees on the first project.
  const engine = state.engines[engineId];
  if (engine && engine.ownerStudioId === state.studio.id) {
    const existedBefore = Object.values(next.engineLicenses).some(
      (l) => l.engineId === engineId && l.licenseeStudioId === compId && l.active
    );
    next = signEngineLicenseIfNew(next, engineId, compId);

    if (!engine.licenseTerms.openSource) {
      const fee = engine.licenseTerms.licenseFee;
      if (fee > 0) {
        next = {
          ...next,
          studio: {
            ...next.studio,
            cash: next.studio.cash + fee,
            lifetimeRevenue: next.studio.lifetimeRevenue + fee,
          },
        };
        next = appendLog(next, {
          category: "engine",
          headline: existedBefore
            ? `${comp.name} signed another deal for ${engine.name}`
            : `${comp.name} licensed ${engine.name}`,
          body: `License fee collected: $${Math.round(fee / 100).toLocaleString()}.`,
          severity: "success",
          relatedIds: { competitorId: compId, engineId },
        });
      }
    }
  }

  return next;
}

function estimateProjectBudget(comp: Competitor, state: GameState): number {
  // Budget should be affordable relative to their cash — we cap at 40% of cash.
  // Base tier determined by strategy.
  const base =
    comp.strategy === "blockbuster" ? 30000000 :       // $300K
    comp.strategy === "prestige" ? 15000000 :          // $150K
    comp.strategy === "innovator" ? 12000000 :         // $120K
    comp.strategy === "hardcore" ? 10000000 :          // $100K
    comp.strategy === "copycat" ? 8000000 :
    comp.strategy === "volume" ? 5000000 :
    comp.strategy === "casual" ? 5000000 :
    comp.strategy === "indie" ? 3000000 : 10000000;

  // Reputation scales budgets up
  const repMult = 1 + comp.reputation / 100;
  // Era scaling — games cost more in later years
  const year = isoToDate(state.currentDate).year;
  const eraMult =
    year < 1990 ? 0.5 :
    year < 1995 ? 0.8 :
    year < 2005 ? 1.0 :
    year < 2015 ? 1.5 :
    year < 2025 ? 2.2 : 3.0;

  const computed = Math.round(base * repMult * eraMult);
  // Clamp to ≤40% of current cash so they don't bankrupt themselves on one project
  return Math.min(computed, Math.floor(comp.cash * 0.4));
}

function pickCompetitorGenre(rng: GameState["rng"], comp: Competitor): [GenreId, GameState["rng"]] {
  // 70% chance to pick from preferred genres, 30% wild card
  const [roll, r1] = rngFloat(rng, 0, 1);
  if (roll < 0.7 && comp.preferredGenres.length > 0) {
    return rngPick(r1, comp.preferredGenres);
  }
  // Wild card — any genre
  const allGenres = Object.keys(GENRE_BY_ID) as GenreId[];
  return rngPick(r1, allGenres);
}

function pickCompetitorEngine(
  rng: GameState["rng"],
  state: GameState,
  comp: Competitor,
  genre: GenreId
): [ID | null, GameState["rng"]] {
  const year = isoToDate(state.currentDate).year;
  let r = rng;

  // Score available engines: available in current year, acceptable quality, fits budget
  const candidates: { engine: GameEngine; score: number }[] = [];
  for (const engine of Object.values(state.engines)) {
    // Engine must be publicly usable
    if (engine.status !== "public_release" && engine.ownerStudioId !== comp.id) continue;
    // Check reputation gate
    if (engine.licenseTerms.requiredReputation && comp.reputation < engine.licenseTerms.requiredReputation) continue;
    // Can they afford the license fee? (Filter, not score)
    const budget = estimateProjectBudget(comp, state);
    if (engine.licenseTerms.licenseFee > comp.cash - budget) continue;

    // Base technical score (tier is king)
    let score = engine.overallTier * 15 + engine.engineReputation / 4 + engine.currentness / 10;

    // Heavy penalty for expensive fees relative to their project budget
    const feeRatio = engine.licenseTerms.licenseFee / Math.max(1, budget);
    score -= feeRatio * 100;

    // Open-source is huge — attractive for everyone, bonus for small studios
    if (engine.licenseTerms.openSource) {
      score += 20;
      if (comp.strategy === "indie" || comp.strategy === "volume" || comp.strategy === "casual") {
        score += 15;
      }
    }

    // Royalty aversion — prestige/blockbuster prefer low-royalty engines
    if (comp.strategy === "prestige" || comp.strategy === "blockbuster") {
      score -= engine.licenseTerms.royaltyRate * 60;
    }
    // Indie studios actually prefer royalties over fees — less upfront risk
    if (comp.strategy === "indie" || comp.strategy === "volume") {
      if (engine.licenseTerms.licenseFee === 0 && engine.licenseTerms.royaltyRate > 0) {
        score += 10;
      }
    }

    // Player engines get an exploration bonus — studios are willing to try new tech
    // from a reputable player studio
    if (engine.ownerStudioId === state.studio.id && engine.status === "public_release") {
      score += 10 + state.studio.reputation / 5;
    }

    candidates.push({ engine, score });
  }

  if (candidates.length === 0) return [null, r];

  // Take top candidates to avoid weirdly random picks — best 5 by score,
  // then weight by that score
  const sorted = candidates.sort((a, b) => b.score - a.score).slice(0, 5);
  const weighted = sorted
    .filter((c) => c.score > 0)
    .map((c) => ({ item: c.engine.id, weight: c.score }));
  if (weighted.length === 0) return [sorted[0]!.engine.id, r];

  return rngWeighted(r, weighted);
}

function generateCompetitorTitle(
  rng: GameState["rng"],
  comp: Competitor,
  genre: GenreId,
  isSequel: boolean
): [string, GameState["rng"]] {
  const wordBanks: Record<string, string[]> = {
    action: ["Strike", "Fury", "Rampage", "Onslaught", "Raider", "Warpath", "Havoc"],
    adventure: ["Chronicles", "Legacy", "Voyage", "Odyssey", "Horizons", "Expedition"],
    rpg: ["Realm", "Saga", "Kingdoms", "Tales", "Ascendant", "Eternity", "Dominion"],
    strategy: ["Empire", "Conquest", "Dominion", "Legions", "Civilization", "Command"],
    simulation: ["World", "Tycoon", "Life", "Builder", "Pioneer", "Farm", "City"],
    sports: ["League", "Champions", "Pro", "Glory", "Victory", "All-Star"],
    racing: ["Speed", "Velocity", "Circuit", "Turbo", "Grand Prix", "Rush"],
    fighting: ["Combat", "Tekken", "Brawler", "Fists", "Arena", "Championship"],
    shooter: ["Strike", "Warfare", "Zero", "Omega", "Vanguard", "Recoil", "Siege"],
    platformer: ["Bounce", "Jump", "Odyssey", "Quest", "Kingdom", "Land"],
    puzzle: ["Mind", "Cipher", "Pieces", "Rotate", "Logic", "Shift"],
    horror: ["Nightmare", "Shadows", "Dread", "Scream", "Cursed", "Silent"],
    survival: ["Endless", "Wilds", "Hunger", "Starved", "Outbreak", "Wasteland"],
    stealth: ["Shadow", "Silent", "Veil", "Cipher", "Phantom", "Intrusion"],
    mmo: ["World", "Realm", "Online", "Universe", "Continent", "Exile"],
    moba: ["Legends", "Arena", "Rival", "Showdown", "Fury", "Titans"],
    battle_royale: ["Endgame", "Zero", "Arena", "Survivors", "Last Stand"],
    visual_novel: ["Days", "Echoes", "Memoir", "Letters", "Diary", "Promise"],
    rhythm: ["Beat", "Pulse", "Echo", "Rhythm", "Sync", "Cadence"],
    sandbox: ["World", "Infinite", "Realm", "Genesis", "Forge"],
    tycoon: ["Empire", "Tycoon", "Magnate", "Mogul", "Dynasty"],
    roguelike: ["Depths", "Descent", "Vault", "Ruin", "Labyrinth", "Trial"],
    metroidvania: ["Shattered", "Below", "Hollow", "Ascent", "Castle"],
    card: ["Deck", "Gambit", "Hand", "Arcana", "Tactics"],
    educational: ["Learn", "Discover", "Quest", "School", "Kid"],
  };

  const bank = wordBanks[genre] ?? ["Game"];
  const [word, r1] = rngPick(rng, bank);

  if (isSequel) {
    const [n, r2] = rngInt(r1, 2, 5);
    return [`${word} ${n}`, r2];
  }

  const prefixes = ["", "The ", ""];
  const [prefix, r2] = rngPick(r1, prefixes);

  // Occasionally add a subtitle
  const [hasSub, r3] = rngChance(r2, 0.3);
  if (hasSub) {
    const suffixes = ["of Legends", "Uprising", "Reborn", "Reckoning", "Awakening", "Revelations"];
    const [suffix, r4] = rngPick(r3, suffixes);
    return [`${prefix}${word}: ${suffix}`, r4];
  }

  return [`${prefix}${word}`, r3];
}

// ============ RELEASE A COMPETITOR GAME ============
function releaseCompetitorGame(state: GameState, compId: ID): GameState {
  const comp = state.competitors[compId];
  if (!comp) return state;

  const title = state.metadata[competitorProjectTitleKey(compId)] as string | undefined;
  const genre = state.metadata[competitorProjectGenreKey(compId)] as GenreId | undefined;
  const engineId = state.metadata[competitorProjectEngineKey(compId)] as string | undefined;
  const budget = state.metadata[competitorProjectBudgetKey(compId)] as number | undefined;
  const isSequel = state.flags[competitorProjectIsSequelFlag(compId)] ?? false;

  if (!title || !genre || budget === undefined) return state;

  let rng = state.rng;

  // Compute quality from: strategy, reputation, engine tier, budget scale
  const engine = engineId ? state.engines[engineId] : undefined;
  const engineTier = engine?.overallTier ?? 2;
  const engineBoost = engineTier * 4;

  let baseQuality =
    25 + comp.reputation * 0.35 + engineBoost +
    (comp.genreReputations[genre] ?? 0) * 0.15;

  // Strategy adjusts variance and mean
  switch (comp.strategy) {
    case "prestige":    baseQuality += 10; break;
    case "innovator":   baseQuality += 5; break;
    case "blockbuster": baseQuality += 8; break;
    case "hardcore":    baseQuality += 6; break;
    case "indie":       baseQuality += 4; break;
    case "volume":      baseQuality -= 6; break;
    case "copycat":     baseQuality -= 4; break;
    case "casual":      baseQuality -= 2; break;
  }

  // Noise — variance depends on strategy (innovator has high swings, volume low)
  const stdDev = comp.strategy === "innovator" ? 18 : comp.strategy === "volume" ? 8 : 12;
  const [noise, r1] = rngGaussian(rng, 0, stdDev);
  rng = r1;
  const metacritic = Math.max(15, Math.min(99, Math.round(baseQuality + noise)));

  // Project sales — scale with score + budget + reputation.
  // Score curve mirrors release.ts projectSales (cubic + MC<50 flop cliff)
  // so competitor titles face the same demand realities the player does.
  let scoreMult = Math.pow(metacritic / 60, 3.0);
  if (metacritic < 50) {
    scoreMult *= Math.pow(metacritic / 50, 2.0);
  }
  const budgetMult = 1 + Math.log10(budget / 1000000 + 1) * 0.2;
  const repMult = 0.5 + comp.reputation / 100;
  const [variance, r2] = rngFloat(rng, 0.85, 1.2);
  rng = r2;
  // Baseline dropped 100K → 70K to align with the 0.015→0.010 conversion
  // cut on the player side; at MC 60 the player and a similarly-budgeted
  // competitor land in the same ballpark.
  const baseUnits = 70000;
  const lifetimeSales = Math.round(baseUnits * scoreMult * budgetMult * repMult * variance);

  // Rough revenue at avg $30 unit
  const lifetimeRevenue = lifetimeSales * 3000;

  // Pay engine royalty if licensed from player (or another AI down the road)
  let playerRoyaltyIncome = 0;
  if (engine && engine.ownerStudioId === state.studio.id && engine.licenseTerms.royaltyRate > 0) {
    playerRoyaltyIncome = Math.round(lifetimeRevenue * engine.licenseTerms.royaltyRate);
  }

  // Create competitor game record
  const [gameId, r3] = generateId("cg", rng);
  rng = r3;

  const compGame: CompetitorGame = {
    id: gameId,
    competitorId: compId,
    name: title,
    genreId: genre,
    releaseDate: state.currentDate,
    metacriticScore: metacritic,
    lifetimeSales,
    isSequel,
    // (competitor titles don't carry IP records — sequels are tracked via
    //  `isSequel` + the competitor's own history; full IP modeling for rivals
    //  would double the sim complexity for minimal player-facing value.)
  };

  // Update competitor: add cash, bump reputation based on score
  const repDelta =
    metacritic >= 90 ? 5 :
    metacritic >= 80 ? 3 :
    metacritic >= 70 ? 1 :
    metacritic >= 50 ? 0 :
    metacritic >= 35 ? -2 : -4;

  // Clear the in-progress flags + metadata
  const newFlags = { ...state.flags };
  delete newFlags[competitorActiveTitleFlag(compId)];
  delete newFlags[competitorProjectIsSequelFlag(compId)];

  const newMetadata = { ...state.metadata };
  delete newMetadata[competitorReleaseDateKey(compId)];
  delete newMetadata[competitorProjectTitleKey(compId)];
  delete newMetadata[competitorProjectGenreKey(compId)];
  delete newMetadata[competitorProjectEngineKey(compId)];
  delete newMetadata[competitorProjectBudgetKey(compId)];

  // Apply player publishing-imprint cut FIRST (so the competitor sees a
  // smaller netRevenue). The helper records the deal as fulfilled and
  // routes the cut to the imprint + studio cash.
  let intermediate: GameState = {
    ...state,
    rng,
    competitorGames: { ...state.competitorGames, [gameId]: compGame },
    flags: newFlags,
    metadata: newMetadata,
  };
  const { state: afterImprint, cutTaken: publisherCut } =
    applyCompetitorPublisherCutOnRelease(intermediate, compId, gameId, lifetimeRevenue);
  intermediate = afterImprint;

  const netRevenue = lifetimeRevenue - playerRoyaltyIncome - publisherCut;

  const updatedComp: Competitor = {
    ...comp,
    cash: comp.cash + netRevenue,
    reputation: Math.max(0, Math.min(100, comp.reputation + repDelta)),
    genreReputations: {
      ...comp.genreReputations,
      [genre]: Math.max(0, Math.min(100, (comp.genreReputations[genre] ?? 0) + repDelta * 1.5)),
    },
    releasedProjectIds: [...comp.releasedProjectIds, gameId],
    annualRevenue: updateAnnualRevenue(comp.annualRevenue, isoToDate(state.currentDate).year, netRevenue),
  };

  let next: GameState = {
    ...intermediate,
    competitors: { ...intermediate.competitors, [compId]: updatedComp },
  };

  // Pay player if they owned the engine, and record the release against
  // the EngineLicense (if one exists). The helper handles the
  // projectsBuilt counter and per-license lifetimeRoyaltiesPaid.
  if (engine && engine.ownerStudioId === state.studio.id) {
    if (playerRoyaltyIncome > 0) {
      next = {
        ...next,
        studio: {
          ...next.studio,
          cash: next.studio.cash + playerRoyaltyIncome,
          lifetimeRevenue: next.studio.lifetimeRevenue + playerRoyaltyIncome,
        },
      };
    }
    next = recordLicenseeRelease(next, engine.id, compId, gameId, playerRoyaltyIncome);
  }

  // Log the release
  const scoreEmoji = metacritic >= 90 ? "🏆" : metacritic >= 80 ? "⭐" : metacritic >= 70 ? "👍" : "";
  next = appendLog(next, {
    category: "competitor",
    headline: `${comp.name} released ${title} — Metacritic ${metacritic}${scoreEmoji ? " " + scoreEmoji : ""}`,
    body: `${lifetimeSales.toLocaleString()} units projected. ${genre.toUpperCase()} genre.`,
    severity: "info",
    relatedIds: { competitorId: compId },
  });

  if (playerRoyaltyIncome > 0) {
    next = appendLog(next, {
      category: "finance",
      headline: `Royalty income: $${Math.round(playerRoyaltyIncome / 100).toLocaleString()}`,
      body: `${engine?.name} royalties from ${comp.name}'s ${title}.`,
      severity: "success",
      relatedIds: { competitorId: compId, engineId: engine?.id },
    });
  }

  return next;
}

function updateAnnualRevenue(
  existing: { year: number; revenue: number }[],
  year: number,
  delta: number
): { year: number; revenue: number }[] {
  const idx = existing.findIndex((e) => e.year === year);
  if (idx < 0) return [...existing, { year, revenue: delta }];
  const updated = [...existing];
  updated[idx] = { year, revenue: updated[idx]!.revenue + delta };
  return updated;
}

// ============ SPAWN NEW COMPETITORS OVER TIME ============
// The industry grows. Every few years a new studio appears.
export function maybeSpawnNewCompetitor(state: GameState): GameState {
  const year = isoToDate(state.currentDate).year;
  // Check once per year in January
  const today = isoToDate(state.currentDate);
  if (today.month !== 1 || today.day !== 1) return state;

  let rng = state.rng;

  // Chance scales with era — more studios found in later eras
  const chance =
    year < 1990 ? 0.3 :
    year < 2000 ? 0.4 :
    year < 2010 ? 0.5 :
    year < 2020 ? 0.6 : 0.5;

  const [shouldSpawn, r1] = rngChance(rng, chance);
  rng = r1;
  if (!shouldSpawn) return { ...state, rng };

  // Draw from unused seeds whose foundedYear <= current year
  const activeSeedIds = new Set(
    Object.values(state.competitors).map((c) => {
      // Find the seed whose name matches
      const seed = COMPETITOR_SEEDS.find((s) => s.name === c.name);
      return seed?.id;
    }).filter(Boolean) as string[]
  );
  const available = COMPETITOR_SEEDS.filter(
    (s) => !activeSeedIds.has(s.id) && s.foundedYear <= year
  );
  if (available.length === 0) return { ...state, rng };

  const [seed, r2] = rngPick(rng, available);
  rng = r2;

  const [id, r3] = generateId("comp", rng);
  rng = r3;

  const [cashVar, r4] = rngFloat(rng, 0.8, 1.3);
  rng = r4;

  const comp: Competitor = {
    id,
    name: seed.name,
    founderName: seed.founderName,
    hqCity: seed.hqCity,
    foundedYear: year, // spawn as if just founded
    strategy: seed.strategy,
    cash: Math.round(seed.startingCash * cashVar),
    staffCount: seed.startingStaffCount,
    reputation: seed.startingReputation,
    marketCap: Math.round(seed.startingCash * 3 * cashVar),
    releasedProjectIds: [],
    activeProjectIds: [],
    ownedIpIds: [],
    ownedEngineIds: [],
    preferredGenres: seed.preferredGenres,
    genreReputations: {},
    status: "active",
    annualRevenue: [],
    lastDecisionDate: state.currentDate,
  };

  return appendLog({
    ...state,
    rng,
    competitors: { ...state.competitors, [id]: comp },
  }, {
    category: "competitor",
    headline: `New studio: ${seed.name}`,
    body: `Founded by ${seed.founderName} in ${seed.hqCity}. Strategy: ${seed.strategy}.`,
    severity: "info",
    relatedIds: { competitorId: id },
  });
}

// ============ BANKRUPTCY CHECK ============
export function checkCompetitorBankruptcies(state: GameState): GameState {
  let next = state;
  const today = isoToDate(state.currentDate);
  // Check once a year
  if (today.month !== 12 || today.day !== 1) return state;

  for (const [id, comp] of Object.entries(state.competitors)) {
    if (comp.status !== "active") continue;
    // If they've been cash-negative for a while (no releases, empty pipeline), bankrupt them
    if (comp.cash < -50000000 && comp.releasedProjectIds.length === 0) {
      next = {
        ...next,
        competitors: { ...next.competitors, [id]: { ...comp, status: "bankrupt" } },
      };
      next = appendLog(next, {
        category: "competitor",
        headline: `${comp.name} filed for bankruptcy`,
        body: `Shut down after running out of cash.`,
        severity: "warning",
        relatedIds: { competitorId: id },
      });
    }
  }
  return next;
}
