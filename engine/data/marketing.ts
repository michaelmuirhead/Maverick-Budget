import type { Money } from "../types/core";

// Marketing campaigns — spend money to generate hype on a project.
// Hype affects the launch week boost and review variance (more hype = more eyeballs,
// less review randomness). Hype decays over time without fresh campaigns.
//
// Campaigns are gated by era — print ads in 1980, streamers in 2012+, neural feeds in 2035+.

export type CampaignCategory =
  | "print"       // magazine ads, posters
  | "trade_show"  // E3 booths, convention presence
  | "broadcast"   // TV, radio
  | "outdoor"     // billboards
  | "digital"     // banner ads, sponsorships
  | "influencer"  // YouTube/Twitter/etc.
  | "streamer"    // Twitch/YouTube gaming content
  | "demo"        // demo discs, playable demos
  | "neural";     // speculative future tier

export type CampaignTiming = "pre_launch" | "launch_week" | "post_launch";

export interface MarketingCampaignDef {
  id: string;
  name: string;
  description: string;
  category: CampaignCategory;

  // Era gating
  firstYear: number;
  lastYear?: number;       // drops off after a year (e.g. demo discs become obsolete)

  // Cost scales by era but base is in cents at 2000 economics
  baseCost: Money;

  // Hype generation — fixed points on launch, plus sustained "reach" daily bleed
  hypeBoost: number;       // immediate hype points (project.hypeLevel is 0-100)
  // Reputation prerequisite — prestige campaigns need a reputation floor
  minReputation: number;

  // When during the project lifecycle can this be used?
  timings: CampaignTiming[];

  // Reputation-scaled — campaigns that return more hype for more reputable studios
  // (a well-known studio gets more mileage out of an influencer deal)
  reputationScaling?: boolean;
}

// Era-based cost scaling — games get more expensive to market over time
export function eraMarketingCostMultiplier(year: number): number {
  if (year < 1990) return 0.4;
  if (year < 1995) return 0.6;
  if (year < 2005) return 1.0;
  if (year < 2015) return 1.6;
  if (year < 2025) return 2.3;
  return 3.0;
}

export const MARKETING_CAMPAIGNS: MarketingCampaignDef[] = [
  // ==== Print — 1980 to ~2015 decline ====
  {
    id: "mkt_print_small",
    name: "Small Magazine Ad",
    description: "Quarter-page ad in a gaming magazine. Modest but reliable.",
    category: "print",
    firstYear: 1980,
    lastYear: 2015,
    baseCost: 1500000,         // $15K
    hypeBoost: 5,
    minReputation: 0,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_print_full",
    name: "Full-Page Magazine Feature",
    description: "Full-page spread in a major gaming magazine.",
    category: "print",
    firstYear: 1982,
    lastYear: 2015,
    baseCost: 6000000,         // $60K
    hypeBoost: 12,
    minReputation: 10,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_print_cover",
    name: "Magazine Cover Story",
    description: "Cover feature — massive exposure if they pick you.",
    category: "print",
    firstYear: 1985,
    lastYear: 2015,
    baseCost: 20000000,        // $200K
    hypeBoost: 28,
    minReputation: 30,
    timings: ["pre_launch"],
    reputationScaling: true,
  },

  // ==== Outdoor ====
  {
    id: "mkt_billboard_local",
    name: "Local Billboards",
    description: "Billboards in a handful of major metros.",
    category: "outdoor",
    firstYear: 1985,
    baseCost: 8000000,
    hypeBoost: 10,
    minReputation: 5,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_billboard_national",
    name: "National Billboard Campaign",
    description: "Billboards coast-to-coast. You've arrived.",
    category: "outdoor",
    firstYear: 1990,
    baseCost: 40000000,
    hypeBoost: 25,
    minReputation: 25,
    timings: ["pre_launch", "launch_week"],
  },

  // ==== Broadcast ====
  {
    id: "mkt_radio",
    name: "Radio Spots",
    description: "Drive-time radio spots on sports and alt-rock stations.",
    category: "broadcast",
    firstYear: 1988,
    lastYear: 2020,
    baseCost: 12000000,
    hypeBoost: 14,
    minReputation: 10,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_tv_cable",
    name: "Cable TV Ad Run",
    description: "30-second spots on MTV, Comedy Central, and cable sports.",
    category: "broadcast",
    firstYear: 1988,
    lastYear: 2025,
    baseCost: 50000000,        // $500K base, era-scaled
    hypeBoost: 30,
    minReputation: 20,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_tv_primetime",
    name: "Primetime TV Blitz",
    description: "Spots during NFL, late-night, and premium cable.",
    category: "broadcast",
    firstYear: 1995,
    lastYear: 2025,
    baseCost: 200000000,       // $2M
    hypeBoost: 55,
    minReputation: 45,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_superbowl",
    name: "Super Bowl Commercial",
    description: "The big stage. Reputation-scaled impact.",
    category: "broadcast",
    firstYear: 2000,
    lastYear: 2030,
    baseCost: 600000000,       // $6M
    hypeBoost: 75,
    minReputation: 65,
    timings: ["pre_launch"],
    reputationScaling: true,
  },

  // ==== Trade Show ====
  {
    id: "mkt_trade_booth",
    name: "Trade Show Booth",
    description: "Presence at E3/GDC/Gamescom. Show the game off.",
    category: "trade_show",
    firstYear: 1995,
    baseCost: 15000000,
    hypeBoost: 18,
    minReputation: 5,
    timings: ["pre_launch"],
  },
  {
    id: "mkt_trade_showcase",
    name: "Trade Show Showcase",
    description: "Headline slot with playable demo. Industry press coverage.",
    category: "trade_show",
    firstYear: 1995,
    baseCost: 80000000,
    hypeBoost: 40,
    minReputation: 30,
    timings: ["pre_launch"],
    reputationScaling: true,
  },

  // ==== Demo disc era ====
  {
    id: "mkt_demo_disc",
    name: "Demo Disc Distribution",
    description: "Playable demo bundled with magazines and other games.",
    category: "demo",
    firstYear: 1994,
    lastYear: 2012,
    baseCost: 10000000,
    hypeBoost: 16,
    minReputation: 0,
    timings: ["pre_launch"],
  },
  {
    id: "mkt_free_demo",
    name: "Free Downloadable Demo",
    description: "Let players try before they buy. Word of mouth builds.",
    category: "demo",
    firstYear: 2003,
    baseCost: 5000000,
    hypeBoost: 12,
    minReputation: 0,
    timings: ["pre_launch", "launch_week"],
  },

  // ==== Digital ads — web banners through social ====
  {
    id: "mkt_banner_ads",
    name: "Web Banner Campaign",
    description: "Banner ads on gaming sites and portals.",
    category: "digital",
    firstYear: 1998,
    baseCost: 4000000,
    hypeBoost: 8,
    minReputation: 0,
    timings: ["pre_launch", "launch_week", "post_launch"],
  },
  {
    id: "mkt_social_media",
    name: "Social Media Push",
    description: "Coordinated Twitter/Facebook/Reddit campaign.",
    category: "digital",
    firstYear: 2010,
    baseCost: 8000000,
    hypeBoost: 14,
    minReputation: 0,
    timings: ["pre_launch", "launch_week", "post_launch"],
    reputationScaling: true,
  },
  {
    id: "mkt_targeted_ads",
    name: "Programmatic Ad Targeting",
    description: "Algorithmic targeting across every digital surface.",
    category: "digital",
    firstYear: 2015,
    baseCost: 25000000,
    hypeBoost: 22,
    minReputation: 10,
    timings: ["pre_launch", "launch_week", "post_launch"],
  },

  // ==== Influencer era ====
  {
    id: "mkt_influencer_small",
    name: "Indie Influencer Deals",
    description: "Sponsor smaller YouTubers and creators for authentic coverage.",
    category: "influencer",
    firstYear: 2010,
    baseCost: 6000000,
    hypeBoost: 12,
    minReputation: 0,
    timings: ["pre_launch", "launch_week"],
  },
  {
    id: "mkt_influencer_major",
    name: "Major Influencer Campaign",
    description: "Sponsored content from top-tier gaming creators.",
    category: "influencer",
    firstYear: 2013,
    baseCost: 35000000,
    hypeBoost: 30,
    minReputation: 20,
    timings: ["pre_launch", "launch_week", "post_launch"],
    reputationScaling: true,
  },

  // ==== Streamer era ====
  {
    id: "mkt_streamer_push",
    name: "Twitch Streamer Push",
    description: "Big streamers play your game in marathon streams.",
    category: "streamer",
    firstYear: 2014,
    baseCost: 30000000,
    hypeBoost: 28,
    minReputation: 10,
    timings: ["pre_launch", "launch_week", "post_launch"],
    reputationScaling: true,
  },
  {
    id: "mkt_viral_challenge",
    name: "Viral Challenge Campaign",
    description: "Orchestrate a social challenge tied to the game's hook.",
    category: "streamer",
    firstYear: 2018,
    baseCost: 15000000,
    hypeBoost: 22,
    minReputation: 15,
    timings: ["launch_week", "post_launch"],
  },

  // ==== Neural / future ====
  {
    id: "mkt_neural_feed",
    name: "Neural Feed Sponsorship",
    description: "Direct-to-cortex promotional integration.",
    category: "neural",
    firstYear: 2035,
    baseCost: 80000000,
    hypeBoost: 45,
    minReputation: 30,
    timings: ["pre_launch", "launch_week"],
  },
];

export const CAMPAIGN_BY_ID: Record<string, MarketingCampaignDef> = Object.fromEntries(
  MARKETING_CAMPAIGNS.map((c) => [c.id, c])
);

// Get campaigns available to run in a given year at a given reputation
export function availableCampaigns(year: number, reputation: number): MarketingCampaignDef[] {
  return MARKETING_CAMPAIGNS.filter((c) => {
    if (year < c.firstYear) return false;
    if (c.lastYear !== undefined && year > c.lastYear) return false;
    if (reputation < c.minReputation) return false;
    return true;
  });
}
