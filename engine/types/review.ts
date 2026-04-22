import type { ID } from "./core";

export type OutletPersonality =
  | "mainstream"       // safe middle-of-the-road
  | "hardcore"         // rewards depth, punishes casual
  | "casual"           // rewards accessibility
  | "indie"            // rewards innovation, cool on big-budget
  | "tech_focused"     // weights graphics/engine heavily
  | "cynical"          // skews low, picky
  | "hype_chaser"      // rewards marketing/buzz
  | "genre_specialist" // heavy affinity for specific genres
  | "streamer"         // only 2010+, weights fun/streamability
  | "speedrunner"      // 2005+, weights mechanics depth
  | "narrative_focused" // weights story heavily
  | "audio_focused";   // weights sound axis heavily — soundtracks, voice, mix

export type OutletMedium = "print" | "website" | "blog" | "youtube" | "streamer" | "neural_feed";

export interface ReviewOutlet {
  id: ID;
  name: string;
  personality: OutletPersonality;
  medium: OutletMedium;
  // When this outlet exists
  activeFromYear: number;
  activeToYear?: number;
  // Influence — higher = matters more to aggregator & sales
  influence: number;        // 0-100
  // Bias tendencies
  scoreBias: number;        // -1 to +1, added to base before clamping
  biasStdDev: number;       // randomness in scoring
  // Specialist focus (optional)
  genreSpecialty?: string;
  // Iconic blurb style
  blurbStyle: "snarky" | "earnest" | "technical" | "breathless" | "detached" | "meme";
}

export interface Review {
  id: ID;
  projectId: ID;
  outletId: ID;
  score: number;            // 0-100 (displayed as /10 or /100 based on era)
  blurb: string;
  publishedDate: string;
  // Breakdown per quality axis
  axisScores: Record<string, number>;
}

export interface ReleaseReception {
  projectId: ID;
  metacriticScore: number;   // aggregated 0-100
  reviewIds: ID[];
  // Fan reception — can diverge from critics
  userScore: number;
  // Award nominations earned this cycle
  awardsWon: string[];
}
