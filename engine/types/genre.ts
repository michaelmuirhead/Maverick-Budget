import type { QualityAxis, TargetAudience } from "./core";

export type GenreId =
  | "action"
  | "adventure"
  | "rpg"
  | "strategy"
  | "simulation"
  | "sports"
  | "racing"
  | "fighting"
  | "shooter"
  | "platformer"
  | "puzzle"
  | "horror"
  | "survival"
  | "stealth"
  | "mmo"
  | "moba"
  | "battle_royale"
  | "visual_novel"
  | "rhythm"
  | "sandbox"
  | "tycoon"
  | "roguelike"
  | "metroidvania"
  | "card"
  | "educational";

export type SubGenreId = string;

export interface Genre {
  id: GenreId;
  name: string;
  description: string;
  // Relative weighting of quality axes for review scoring
  axisWeights: Record<QualityAxis, number>;
  // Audience affinity — 0 to 1
  audienceAffinity: Record<TargetAudience, number>;
  // Year this genre becomes viable to make (earlier = pioneer bonus)
  emergedYear: number;
  // Peak popularity year (for trend waves)
  peakYear: number;
  // Typical dev cost multiplier (1.0 = baseline)
  costMultiplier: number;
  // Typical dev time multiplier
  timeMultiplier: number;
  // Sub-genres that unlock later
  subGenres: { id: SubGenreId; name: string; emergedYear: number }[];
}
