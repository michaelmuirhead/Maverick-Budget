// Core shared types used across the engine

export type ID = string;

export type EraId =
  | "era_8bit"
  | "era_16bit"
  | "era_3d_revolution"
  | "era_online"
  | "era_hd"
  | "era_mobile_indie"
  | "era_streaming_vr"
  | "era_ai_neural";

export interface GameDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-28/29/30/31
}

export type TargetAudience = "kids" | "teens" | "young_adults" | "mature" | "everyone";

export type StaffRole =
  | "designer"
  | "programmer"
  | "artist"
  | "composer"
  | "writer"
  | "qa"
  | "producer"
  | "marketer"
  | "exec";

export type DevPhaseId =
  | "pre_production"
  | "production"
  | "alpha"
  | "beta"
  | "polish"
  | "launch";

export type QualityAxis =
  | "gameplay"
  | "graphics"
  | "sound"
  | "story"
  | "world"
  | "ai"
  | "polish";

// Money values stored as integer cents to avoid float drift
export type Money = number;

// A seeded RNG state — kept tiny and serializable
export interface RngState {
  seed: number;
}
