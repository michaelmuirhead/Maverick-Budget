// Publisher seed data — real-world publishers spanning the 1980-2045 timeline.
// Founding years are historically accurate. Starting cash is scaled to the
// early-era economics of the sim (cents units), not real-world revenue.
//
// IMPORTANT (fan project disclaimer): This sim uses the names of real video
// game publishers for flavor. Maverick Game Tycoon is an unofficial fan
// project with no affiliation, endorsement, or sponsorship by any of the
// companies referenced below. All trademarks are property of their
// respective owners.

import type { PublisherSeed } from "../types/publisher";

export const PUBLISHER_SEEDS: PublisherSeed[] = [
  // ==== TIER 1: Indie labels — small, approachable, risk-tolerant ====
  {
    id: "pub_sierra",
    name: "Sierra On-Line",
    hqCity: "Oakhurst, CA",
    foundedYear: 1979,
    tier: "indie_label",
    startingCash: 15000000,             // $150K
    startingReputation: 30,
    preferredGenres: ["adventure", "rpg", "puzzle"],
    minReputationToSign: 0,
    baseRevenueShare: 0.30,
    baseAdvanceMultiplier: 0.55,
    baseMarketingBudgetMultiplier: 0.35,
  },
  {
    id: "pub_team17",
    name: "Team17",
    hqCity: "Wakefield, UK",
    foundedYear: 1990,
    tier: "indie_label",
    startingCash: 20000000,             // $200K
    startingReputation: 32,
    preferredGenres: ["platformer", "puzzle", "strategy"],
    minReputationToSign: 0,
    baseRevenueShare: 0.30,
    baseAdvanceMultiplier: 0.60,
    baseMarketingBudgetMultiplier: 0.40,
  },
  {
    id: "pub_devolver",
    name: "Devolver Digital",
    hqCity: "Austin, TX",
    foundedYear: 2009,
    tier: "indie_label",
    startingCash: 50000000,             // $500K
    startingReputation: 45,
    preferredGenres: ["action", "roguelike", "metroidvania", "shooter"],
    minReputationToSign: 0,
    baseRevenueShare: 0.28,
    baseAdvanceMultiplier: 0.70,
    baseMarketingBudgetMultiplier: 0.50,
  },

  // ==== TIER 2: Mid-majors — regional powers, focused catalogs ====
  {
    id: "pub_interplay",
    name: "Interplay Entertainment",
    hqCity: "Irvine, CA",
    foundedYear: 1983,
    tier: "mid_major",
    startingCash: 80000000,             // $800K
    startingReputation: 45,
    preferredGenres: ["rpg", "strategy", "adventure"],
    minReputationToSign: 10,
    baseRevenueShare: 0.38,
    baseAdvanceMultiplier: 0.90,
    baseMarketingBudgetMultiplier: 0.80,
  },
  {
    id: "pub_capcom",
    name: "Capcom",
    hqCity: "Osaka, JP",
    foundedYear: 1979,
    tier: "mid_major",
    startingCash: 200000000,            // $2M
    startingReputation: 55,
    preferredGenres: ["fighting", "action", "horror", "shooter"],
    minReputationToSign: 20,
    baseRevenueShare: 0.42,
    baseAdvanceMultiplier: 1.0,
    baseMarketingBudgetMultiplier: 0.90,
  },
  {
    id: "pub_konami",
    name: "Konami",
    hqCity: "Tokyo, JP",
    foundedYear: 1969,
    tier: "mid_major",
    startingCash: 300000000,            // $3M — massive arcade legacy
    startingReputation: 60,
    preferredGenres: ["stealth", "sports", "rhythm", "fighting"],
    minReputationToSign: 20,
    baseRevenueShare: 0.44,
    baseAdvanceMultiplier: 1.1,
    baseMarketingBudgetMultiplier: 0.95,
  },
  {
    id: "pub_bethesda",
    name: "Bethesda Softworks",
    hqCity: "Rockville, MD",
    foundedYear: 1986,
    tier: "mid_major",
    startingCash: 100000000,            // $1M
    startingReputation: 50,
    preferredGenres: ["rpg", "shooter", "adventure"],
    minReputationToSign: 20,
    baseRevenueShare: 0.40,
    baseAdvanceMultiplier: 0.95,
    baseMarketingBudgetMultiplier: 0.85,
  },
  {
    id: "pub_paradox",
    name: "Paradox Interactive",
    hqCity: "Stockholm, SE",
    foundedYear: 1999,
    tier: "mid_major",
    startingCash: 50000000,             // $500K — started lean
    startingReputation: 40,
    preferredGenres: ["strategy", "simulation"],
    minReputationToSign: 15,
    baseRevenueShare: 0.36,
    baseAdvanceMultiplier: 0.85,
    baseMarketingBudgetMultiplier: 0.70,
  },
  {
    id: "pub_square_enix",
    name: "Square Enix",
    hqCity: "Tokyo, JP",
    foundedYear: 2003,
    tier: "mid_major",
    startingCash: 500000000,            // $5M — post-merger scale
    startingReputation: 70,
    preferredGenres: ["rpg", "strategy", "adventure"],
    minReputationToSign: 30,
    baseRevenueShare: 0.45,
    baseAdvanceMultiplier: 1.2,
    baseMarketingBudgetMultiplier: 1.1,
  },

  // ==== TIER 3: Majors — global reach, large advances ====
  {
    id: "pub_activision",
    name: "Activision",
    hqCity: "Santa Monica, CA",
    foundedYear: 1979,
    tier: "major",
    startingCash: 200000000,            // $2M
    startingReputation: 60,
    preferredGenres: ["shooter", "action", "sports"],
    minReputationToSign: 35,
    baseRevenueShare: 0.50,
    baseAdvanceMultiplier: 1.7,
    baseMarketingBudgetMultiplier: 1.7,
  },
  {
    id: "pub_ea",
    name: "Electronic Arts",
    hqCity: "Redwood City, CA",
    foundedYear: 1982,
    tier: "major",
    startingCash: 300000000,            // $3M — well-funded from inception
    startingReputation: 68,
    preferredGenres: ["sports", "shooter", "rpg", "racing"],
    minReputationToSign: 40,
    baseRevenueShare: 0.52,
    baseAdvanceMultiplier: 1.8,
    baseMarketingBudgetMultiplier: 1.9,
  },
  {
    id: "pub_sega",
    name: "Sega",
    hqCity: "Tokyo, JP",
    foundedYear: 1983,
    tier: "major",
    startingCash: 800000000,            // $8M — arcade empire
    startingReputation: 72,
    preferredGenres: ["action", "racing", "platformer", "fighting"],
    minReputationToSign: 40,
    baseRevenueShare: 0.50,
    baseAdvanceMultiplier: 1.8,
    baseMarketingBudgetMultiplier: 1.8,
  },
  {
    id: "pub_ubisoft",
    name: "Ubisoft",
    hqCity: "Montreuil, FR",
    foundedYear: 1986,
    tier: "major",
    startingCash: 100000000,            // $1M — started as a local distributor
    startingReputation: 50,
    preferredGenres: ["action", "adventure", "shooter", "stealth"],
    minReputationToSign: 35,
    baseRevenueShare: 0.48,
    baseAdvanceMultiplier: 1.6,
    baseMarketingBudgetMultiplier: 1.7,
  },
  {
    id: "pub_take_two",
    name: "Take-Two Interactive",
    hqCity: "New York, NY",
    foundedYear: 1993,
    tier: "major",
    startingCash: 200000000,            // $2M
    startingReputation: 55,
    preferredGenres: ["action", "shooter", "sports"],
    minReputationToSign: 40,
    baseRevenueShare: 0.50,
    baseAdvanceMultiplier: 1.7,
    baseMarketingBudgetMultiplier: 1.7,
  },

  // ==== TIER 4: Megas — industry-dominating, hardest to sign with ====
  {
    id: "pub_nintendo",
    name: "Nintendo",
    hqCity: "Kyoto, JP",
    foundedYear: 1977,                   // video-game pivot era (Color TV-Game)
    tier: "mega",
    startingCash: 3000000000,           // $30M — Donkey Kong / NES ascendancy
    startingReputation: 90,
    preferredGenres: ["platformer", "adventure", "rpg", "racing"],
    minReputationToSign: 65,
    baseRevenueShare: 0.58,
    baseAdvanceMultiplier: 3.0,
    baseMarketingBudgetMultiplier: 3.5,
  },
  {
    id: "pub_sony",
    name: "Sony Interactive Entertainment",
    hqCity: "Tokyo, JP",
    foundedYear: 1993,
    tier: "mega",
    startingCash: 2000000000,           // $20M — backed by Sony Corp
    startingReputation: 85,
    preferredGenres: ["action", "rpg", "adventure", "platformer"],
    minReputationToSign: 60,
    baseRevenueShare: 0.60,
    baseAdvanceMultiplier: 3.0,
    baseMarketingBudgetMultiplier: 3.4,
  },
  {
    id: "pub_microsoft",
    name: "Microsoft (Xbox Game Studios)",
    hqCity: "Redmond, WA",
    foundedYear: 2000,
    tier: "mega",
    startingCash: 5000000000,           // $50M — deep pockets from MS
    startingReputation: 80,
    preferredGenres: ["shooter", "rpg", "simulation", "strategy"],
    minReputationToSign: 60,
    baseRevenueShare: 0.58,
    baseAdvanceMultiplier: 3.2,
    baseMarketingBudgetMultiplier: 3.8,
  },
  {
    id: "pub_tencent",
    name: "Tencent Games",
    hqCity: "Shenzhen, CN",
    foundedYear: 2004,
    tier: "mega",
    startingCash: 2500000000,           // $25M at founding, grows aggressively
    startingReputation: 78,
    preferredGenres: ["mmo", "moba", "battle_royale", "rpg"],
    minReputationToSign: 55,
    baseRevenueShare: 0.56,
    baseAdvanceMultiplier: 2.8,
    baseMarketingBudgetMultiplier: 3.2,
  },
];

export const PUBLISHER_SEED_BY_ID: Record<string, PublisherSeed> = Object.fromEntries(
  PUBLISHER_SEEDS.map((s) => [s.id, s])
);
