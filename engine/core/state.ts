// The single source of truth for the entire simulation.
// This is what gets serialized to localStorage, passed through reducers,
// and subscribed to by the UI via Zustand.
//
// Design rules:
// - Everything in GameState is JSON-serializable (no Dates, Maps, Sets, functions)
// - Collections keyed by ID use Record<ID, T>; iteration order doesn't matter
// - Lists that need order (log entries, active projects) use arrays
// - Derived state (e.g., "is current project late?") is NOT stored — compute in selectors

import type { ID, RngState, Money, TargetAudience } from "../types/core";
import type { Staff } from "../types/staff";
import type { Project, IP, ActiveSale, PatchSprint } from "../types/project";
import type { Contract } from "../types/contract";
import type { PublishingDeal } from "../types/publishingDeal";
import type { CompetitorPublishingDeal } from "../types/competitorPublishingDeal";
import type { GameEngine, EngineProject, EngineLicense, ResearchProject } from "../types/engine";
import type { Competitor, CompetitorGame } from "../types/competitor";
import type { Review, ReleaseReception } from "../types/review";
import type { Office } from "../types/office";
import type { Award } from "../types/awards";
import type { Publisher } from "../types/publisher";
import type { DLC, LiveServiceState } from "../types/dlc";
import type { MarketShift } from "../types/marketShift";

// ============ CASH HISTORY SAMPLE ============
// Monthly snapshot of the studio's balance sheet, taken at the start of each
// month in the tick dispatcher. Gives the financials line chart a time series
// without needing a daily ring buffer.
//
// `cash` is the exact cash balance on the sample day; `lifetimeRevenue` is the
// running total at that point — subtracting successive samples yields the
// revenue earned in that month for the revenue-flow chart.
export interface CashHistorySample {
  date: string;                      // ISO, always first of month after game start
  cash: number;
  lifetimeRevenue: number;
  debt: number;
}

// ============ REPUTATION HIT (decaying penalty) ============
// Records a one-shot reputation penalty that gets restored linearly over time.
// Per MGT MMO rules: a botched live-service sunset costs reputation but the
// scar fades over ~10 in-game years. We track each hit individually so the UI
// can show what's still weighing on the studio's name.
export interface RepHit {
  id: ID;
  source: string;                    // short label e.g. "Sunset failure: Skyforge Online"
  incurredDate: string;              // ISO
  totalPenalty: number;              // amount initially deducted (positive)
  restoredAmount: number;            // how much has been restored back
  decayDurationDays: number;         // total days over which penalty fully decays
  relatedProjectId?: ID;
}

// ============ STUDIO (player) ============
export interface Studio {
  id: ID;
  name: string;
  founderName: string;
  founderArchetype: "programmer" | "designer" | "artist";
  foundedDate: string;

  cash: Money;
  debt: Money;                       // optional loans taken
  lifetimeRevenue: Money;
  // Monthly cash samples. Appended in onMonthStart; oldest-first; no cap
  // (a 30-year game at 12/yr = 360 entries, negligible). Seeded with a single
  // sample at the start of a new game so the chart has an anchor point.
  cashHistory: CashHistorySample[];

  // Reputation overall + per-genre
  reputation: number;                // 0-100
  genreReputations: Record<string, number>;
  // Active decaying reputation hits (e.g., failed sunsets). Restored linearly.
  repHits: RepHit[];
  // Platform familiarity — count of games shipped per platform.
  // Drives the "unfamiliar platform" bug-rate bump in development.
  platformFamiliarity: Record<string, number>;

  // Completed research (tech node IDs)
  completedTechIds: string[];
  // Engine licenses the studio has taken FROM others
  activeEngineLicenseIds: ID[];
  // Engines owned (built) by the studio
  ownedEngineIds: ID[];
  // Sticky default: the engine used on the most recently created project
  // (or null when the last project was hand-coded). The new-project form
  // pre-selects this so consecutive games default to the same engine
  // unless the player explicitly picks a different one.
  lastUsedEngineId: ID | null;
  // IPs owned
  ownedIpIds: ID[];
  // Publishers acquired by the studio
  ownedPublisherIds: ID[];

  // Public status
  isPublicCompany: boolean;          // IPO'd
  marketCap: Money;

  // Aggregate counters for HoF and history
  gamesReleased: number;
  gamesCancelled: number;
  awardsWon: number;
  timesAtNumberOne: number;          // weeks at top of charts
}

// ============ MARKET STATE (global) ============
export interface MarketState {
  // Economic cycle: -1 (deep recession) ... +1 (boom)
  economicCycle: number;
  // How much each genre is trending this quarter — multipliers
  genreTrends: Record<string, number>;   // genreId -> 0.5 to 1.5
  // Trending themes
  themeTrends: Record<string, number>;
  // Per-platform current install base (millions). Evolves tick by tick.
  platformInstallBase: Record<string, number>;

  // Active industry shifts triggered by recent market-mover releases.
  // Each entry boosts demand for its (genre × theme) combo until endDate.
  activeShifts: MarketShift[];
  // Recently-expired shifts that are now in their "played out" undershoot
  // window. Removed once their played-out window also expires.
  playedOutShifts: MarketShift[];
}

// ============ LOG ENTRY (news feed) ============
export type LogCategory =
  | "studio" | "staff" | "project" | "release" | "market"
  | "competitor" | "finance" | "event" | "award" | "engine";

export interface LogEntry {
  id: ID;
  date: string;                      // ISO
  category: LogCategory;
  headline: string;
  body?: string;
  severity: "info" | "success" | "warning" | "danger";
  relatedIds?: {
    projectId?: ID;
    staffId?: ID;
    competitorId?: ID;
    engineId?: ID;
    dlcId?: ID;
    ipId?: ID;
  };
}

// ============ HIRING POOL ============
export interface HiringPool {
  lastRefreshDate: string;
  candidateIds: ID[];               // staff records with status="candidate"
}

// ============ PENDING EVENTS (interactive) ============
export interface PendingEventChoice {
  id: ID;
  eventDefId: string;
  spawnedDate: string;
  expiresDate?: string;
  context?: Record<string, unknown>;
  // If this pending event came from a multi-beat narrative chain, the
  // resolution path needs to know which chain + beat to advance. This is
  // optional — pendingEvents from one-shot Random/Scheduled events leave it
  // undefined and use the legacy resolution flow.
  chain?: {
    chainId: string;
    beatId: string;
  };
}

// ============ NARRATIVE CHAIN (multi-beat news chain) ============
// Per-game state for an active chain: which chain is running, which beat it
// last fired, when the next non-interactive beat should auto-advance. Beats
// with player choices park here until the player resolves the corresponding
// pendingEvent — at which point the chain moves to the next beat.
export interface ActiveNarrativeChain {
  chainId: string;
  // The most-recently fired beat within the chain.
  currentBeatId: string;
  // ISO date when the next beat should fire. Set both for auto-advances
  // (from beat.autoAdvance) and choice-driven advances (from a player
  // selecting a choice with delayDays).
  nextBeatDate?: string;
  // The id of the beat to fire when nextBeatDate arrives. Unifies
  // autoAdvance scheduling and choice-driven scheduling — the tick loop
  // doesn't have to distinguish.
  pendingNextBeatId?: string;
  // The pendingEvent id (if the current beat is waiting on the player).
  pendingEventId?: ID;
  // ISO date this chain was first triggered, for sorting/UI.
  startedDate: string;
}

// Award lives in ../types/awards — re-exported here for convenience
export type { Award } from "../types/awards";

// ============ MASTER STATE ============
export interface GameState {
  // Meta
  version: number;                   // schema version for migrations
  rng: RngState;
  seed: number;                      // original seed, preserved across saves

  // Time
  currentDate: string;               // ISO
  startDate: string;
  gameSpeed: 0 | 1 | 2 | 4;          // 0=paused, 1x, 2x, 4x
  daysElapsed: number;

  // Selected difficulty / era preset at new game
  startingPresetId: string;

  // Entities (keyed by ID)
  studio: Studio;
  staff: Record<ID, Staff>;
  projects: Record<ID, Project>;
  ips: Record<ID, IP>;
  activeSales: Record<ID, ActiveSale>;
  patchSprints: Record<ID, PatchSprint>;
  engines: Record<ID, GameEngine>;
  engineProjects: Record<ID, EngineProject>;
  engineLicenses: Record<ID, EngineLicense>;
  researchProjects: Record<ID, ResearchProject>;

  competitors: Record<ID, Competitor>;
  competitorGames: Record<ID, CompetitorGame>;

  reviews: Record<ID, Review>;
  receptions: Record<ID, ReleaseReception>;  // keyed by projectId

  // Office
  office: Office;

  // Market/world
  market: MarketState;

  // Hiring
  hiringPool: HiringPool;

  // Pending interactive events
  pendingEvents: PendingEventChoice[];
  // Which scheduled events have fired this year (reset at year-end)
  firedScheduledEventIds: string[];
  // Which random events are one-shot and have fired (never repeat)
  firedOneShotEventIds: string[];

  // Multi-beat narrative chains in flight, keyed by chainId. Empty when no
  // chain is currently running.
  activeChains: Record<string, ActiveNarrativeChain>;
  // Chain ids that have completed (terminated or hit a dead-end). One-shot
  // chains check this list before re-triggering.
  completedChainIds: string[];

  // Awards won by player and competitors over time
  awards: Award[];

  // Publisher contracts (work-for-hire offers + active deals + history)
  contracts: Record<ID, Contract>;

  // Publishing deals (publisher takes the player's game for distribution + rev share)
  publishingDeals: Record<ID, PublishingDeal>;

  // Inverse of publishingDeals — the player's own publishing imprint signed
  // a competitor studio for their next release. Cuts route through
  // engine/systems/playerImprint.ts at competitor release time.
  competitorPublishingDeals: Record<ID, CompetitorPublishingDeal>;

  // Publishers — entities that fund + distribute games and can be acquired
  publishers: Record<ID, Publisher>;

  // DLC packs in development or released
  dlcs: Record<ID, DLC>;

  // Live-service projects keyed by parent project ID
  liveServices: Record<ID, LiveServiceState>;

  // News/log feed — ring buffer, newest last. UI shows reversed.
  log: LogEntry[];
  maxLogEntries: number;

  // Flags / unlocks — booleans only
  flags: Record<string, boolean>;
  // Generic metadata — strings/numbers keyed by arbitrary namespaced keys.
  // Used by competitor AI, event context, etc.
  metadata: Record<string, string | number>;
}
