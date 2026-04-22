import type { ID, Money } from "./core";
import type { GenreId } from "./genre";

// A publisher is an external company that funds and distributes games in exchange
// for a revenue share. Publishers exist throughout the sim timeline (1980-2045),
// with some founded early, some in later eras.
//
// Key mechanics:
//  - Publishers send "deal offers" on in-development games (concept or pre-launch)
//  - Accepting trades a % of revenue for upfront cash + marketing budget
//  - Publishers also fund competitor studios — they're a real industry tier
//  - The player can acquire publishers for money; ownership flips the cut back to the player

// Publisher tier roughly mirrors competitor strategy but for their distribution clout.
//  - indie_label:  Small, cheap to acquire, modest marketing budgets, mostly tier-1 deals
//  - mid_major:    Solid regional presence, reasonable advances, specific genre focus
//  - major:        Global reach, large advances, pickier about what they fund
//  - mega:         Industry-dominating — hard to get signed, but huge payouts
export type PublisherTier = "indie_label" | "mid_major" | "major" | "mega";

export type PublisherStatus =
  | "active"         // operating normally
  | "acquired"       // owned by the player (or another studio, future-proofing)
  | "defunct";       // shut down, bankruptcy, or wound down

export interface Publisher {
  id: ID;
  name: string;
  hqCity: string;
  foundedYear: number;
  tier: PublisherTier;

  // Market-facing stats
  reputation: number;           // 0-100, affects deal quality and acquisition price
  cash: Money;                  // operating cash
  marketCap: Money;             // what they'd cost to acquire (recomputed periodically)

  // Strategy
  preferredGenres: GenreId[];   // will offer better terms for games in these genres
  minReputationToSign: number;  // gate on studio reputation before they consider you

  // Base deal parameters — varied per-offer with noise
  baseRevenueShare: number;     // 0-1 — fraction of revenue they take
  baseAdvanceMultiplier: number; // multiplier on project budget for advance offered
  baseMarketingBudgetMultiplier: number; // multiplier on project budget for marketing

  // Status + ownership
  status: PublisherStatus;
  ownerStudioId?: ID;           // set when acquired by a studio

  // Track record — games they've published, revenue collected
  publishedGameIds: ID[];       // includes both player and competitor games
  lifetimeRevenue: Money;

  // Studios this publisher owns (populated from CompetitorSeed.parentPublisherId
  // at new-game time, and kept in sync when publishers acquire studios later).
  ownedStudioIds: ID[];

  // Metadata
  acquiredOn?: string;          // ISO — when acquired
  defunctOn?: string;           // ISO — when wound down
}

// Seed data for publishers — used by newGame.ts to populate the world.
// These are flavorful fictional names with clear historical-style references,
// but none are real companies, to keep the game in fictional territory.
export interface PublisherSeed {
  id: string;
  name: string;
  hqCity: string;
  foundedYear: number;
  tier: PublisherTier;
  startingCash: Money;
  startingReputation: number;
  preferredGenres: GenreId[];
  minReputationToSign: number;
  baseRevenueShare: number;
  baseAdvanceMultiplier: number;
  baseMarketingBudgetMultiplier: number;
}

// ============ PUBLISHING DEAL OFFERS ============
// PublishingDeal lives in `./publishingDeal`. Re-export here so the systems
// file can keep importing `PublishingDeal` from `../types/publisher` (which
// is the path the engine/systems/publishers.ts already uses).
export type { PublishingDeal, PublishingDealStatus } from "./publishingDeal";
