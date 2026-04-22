import type { ID, Money } from "./core";
import type { GenreId } from "./genre";

export type CompetitorStrategy =
  | "prestige"       // chases critical acclaim, fewer releases
  | "volume"         // ships many mid-tier games
  | "innovator"      // takes risks, new genres/tech
  | "copycat"        // follows trends aggressively
  | "casual"         // mobile/casual-focused
  | "hardcore"       // niche depth-first
  | "blockbuster"    // big-budget mainstream
  | "indie";         // small teams, unique voices

export interface CompetitorRelationship {
  competitorId: ID;
  // -100 to +100 — negative = rival, positive = ally/partner
  standing: number;
  // Significant history
  events: { date: string; description: string; impact: number }[];
}

export interface Competitor {
  id: ID;
  name: string;
  founderName: string;
  hqCity: string;
  foundedYear: number;
  strategy: CompetitorStrategy;
  // Resources
  cash: Money;
  staffCount: number;
  reputation: number;       // 0-100, overall
  marketCap: Money;         // drives acquisition cost
  // Portfolio
  releasedProjectIds: ID[]; // games shipped (stored as lightweight records)
  activeProjectIds: ID[];
  ownedIpIds: ID[];
  ownedEngineIds: ID[];
  // Genre specialties
  preferredGenres: GenreId[];
  genreReputations: Partial<Record<GenreId, number>>;
  // Lifecycle
  status: "active" | "bankrupt" | "acquired" | "went_public";
  acquiredBy?: ID;
  // Per-year performance — for competitor dashboard
  annualRevenue: { year: number; revenue: Money }[];
  // AI decision cadence — last time this studio made a strategic move
  lastDecisionDate: string;
  // Corporate parent — when set, this studio is owned by a publisher
  // (e.g. Rockstar North under Take-Two, Bethesda Game Studios under
  // Bethesda Softworks/Microsoft). Drives UI labeling and future
  // publisher-acquires-studio flows.
  parentPublisherId?: ID;
}

// Seed-side extension — optional parentPublisherId on the SEED rather than
// just the hydrated Competitor, so the data file can express real-world
// publisher ownership (e.g. Rockstar North ← Take-Two). Consumed by
// newGame.ts to wire Competitor.parentPublisherId + Publisher.ownedStudioIds.

// A lightweight record of a competitor-developed game
export interface CompetitorGame {
  id: ID;
  competitorId: ID;
  name: string;
  genreId: GenreId;
  releaseDate: string;
  metacriticScore: number;
  lifetimeSales: number;
  isSequel: boolean;
  ipId?: ID;
}
