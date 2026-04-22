import type { ID, Money, StaffRole } from "./core";
import type { GenreId } from "./genre";

export interface StaffStats {
  design: number;    // 0-100
  tech: number;
  art: number;
  sound: number;
  writing: number;
  speed: number;     // how fast they work
}

export type TraitId =
  | "perfectionist" | "burnout_prone" | "genre_savant" | "mentor"
  | "prima_donna" | "rising_star" | "workhorse" | "creative"
  | "methodical" | "innovator" | "team_player" | "lone_wolf"
  | "night_owl" | "diplomat" | "code_wizard" | "art_prodigy"
  | "sound_virtuoso" | "narrative_mind" | "bug_hunter" | "speed_demon"
  | "visionary" | "moneyhound" | "loyal" | "mercenary" | "charismatic";

export type TraitEffect =
  | { type: "stat_mod"; stat: keyof StaffStats; value: number }
  | { type: "genre_affinity"; genre: GenreId; value: number }
  | { type: "morale_mod"; value: number }
  | { type: "bug_rate"; value: number }
  | { type: "salary_demand"; value: number } // multiplier
  | { type: "mentorship_bonus"; value: number }
  | { type: "crunch_tolerance"; value: number }
  | { type: "loyalty_mod"; value: number }
  | { type: "quit_risk"; value: number };

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  // Which effects this trait produces
  effects: TraitEffect[];
  // Traits that conflict (won't appear together on same person)
  conflicts?: TraitId[];
  // Traits this one plays well with (chemistry)
  synergies?: TraitId[];
}

export type StaffLifecycleStatus =
  | "candidate"    // in hiring pool
  | "employed"
  | "resigned"
  | "retired"
  | "poached";     // left to competitor

export interface Staff {
  id: ID;
  name: string;
  age: number;
  role: StaffRole;
  stats: StaffStats;
  // Genre specializations (affinity score 0-0.3 added to projects in that genre)
  specializations: Partial<Record<GenreId, number>>;
  traits: TraitId[];
  // Personal metrics
  salary: Money;        // annual, stored as cents
  morale: number;       // 0-100
  energy: number;       // 0-100, depletes with crunch
  loyalty: number;      // 0-100
  reputation: number;   // 0-100, for HoF
  health: number;       // 0-100, burnout tracker
  // Assignment
  currentProjectId: ID | null;
  // Lifecycle
  status: StaffLifecycleStatus;
  hiredOn: string | null; // ISO date
  // History
  gamesWorkedOn: ID[];
  awardsWon: number;
}
