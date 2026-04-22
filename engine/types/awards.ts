import type { ID, Money } from "./core";
import type { GenreId } from "./genre";

// Awards are handed out annually at the Game of the Year Awards scheduled event.
// Each category evaluates all games released that year and picks a winner.

export type AwardCategory =
  | "goty"            // overall Game of the Year
  | "best_rpg"
  | "best_action"
  | "best_shooter"
  | "best_strategy"
  | "best_simulation"
  | "best_sports"
  | "best_racing"
  | "best_fighting"
  | "best_platformer"
  | "best_puzzle"
  | "best_horror"
  | "best_adventure"
  | "best_mobile"     // game released primarily on mobile
  | "best_indie"      // small-budget breakout
  | "best_art"
  | "best_narrative"
  | "best_innovation" // new IP, new genre combo
  | "studio_of_year"; // whole-studio award

export interface Award {
  id: ID;
  category: AwardCategory;
  year: number;           // calendar year awarded
  // For game awards
  projectId?: ID;
  projectName?: string;
  metacriticScore?: number;
  // For studio award
  studioName?: string;    // player or competitor
  studioId?: ID;
  isPlayerStudio?: boolean;
  awardedDate: string;    // ISO
}

// Category → genre mapping for evaluating games
export const CATEGORY_GENRE_MAP: Partial<Record<AwardCategory, GenreId>> = {
  best_rpg: "rpg",
  best_action: "action",
  best_shooter: "shooter",
  best_strategy: "strategy",
  best_simulation: "simulation",
  best_sports: "sports",
  best_racing: "racing",
  best_fighting: "fighting",
  best_platformer: "platformer",
  best_puzzle: "puzzle",
  best_horror: "horror",
  best_adventure: "adventure",
};

// Display names
export const AWARD_DISPLAY_NAMES: Record<AwardCategory, string> = {
  goty: "Game of the Year",
  best_rpg: "Best RPG",
  best_action: "Best Action",
  best_shooter: "Best Shooter",
  best_strategy: "Best Strategy",
  best_simulation: "Best Simulation",
  best_sports: "Best Sports",
  best_racing: "Best Racing",
  best_fighting: "Best Fighting",
  best_platformer: "Best Platformer",
  best_puzzle: "Best Puzzle",
  best_horror: "Best Horror",
  best_adventure: "Best Adventure",
  best_mobile: "Best Mobile Game",
  best_indie: "Best Indie",
  best_art: "Best Art Direction",
  best_narrative: "Best Narrative",
  best_innovation: "Most Innovative",
  studio_of_year: "Studio of the Year",
};
