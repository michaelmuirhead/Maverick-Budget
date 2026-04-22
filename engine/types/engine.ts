import type { ID, Money } from "./core";
import type { GenreId } from "./genre";

export type TechBranch =
  | "graphics"
  | "audio"
  | "networking"
  | "simulation"
  | "platform"
  | "ai_tools"      // dev tools, editors, pipelines, ML-assisted content creation
  | "monetization"  // commerce, live-ops, telemetry, storefronts, subscription infra
  | "input_ux";     // input devices, UI toolkits, accessibility, haptics

export interface TechNode {
  id: string;
  branch: TechBranch;
  tier: number;           // 1-7, gates unlocks
  name: string;
  description: string;
  emergedYear: number;    // earliest year it can be researched
  techPointsRequired: number;
  prerequisites: string[]; // other TechNode ids
  // Effects when unlocked
  grantsFeatures: string[]; // feature ids for engines
  unlocksPlatformIds?: string[]; // platforms this enables
  unlocksGenreIds?: string[];    // some genres need tech (e.g. MMO needs networking)
}

export interface EngineFeature {
  id: string;
  name: string;
  description: string;
  branch: TechBranch;
  tier: number;
  // Quality boost per axis (0-1)
  axisBoost: Partial<Record<string, number>>;
}

// ============ ENGINE OWNERSHIP & LIFECYCLE ============

// Who owns/made the engine
export type EngineOrigin =
  | "third_party"   // real-world analog — id Tech, Unreal, Unity, Source, etc.
  | "player"        // built by the player
  | "competitor";   // built by a rival studio

// Lifecycle status — engines move through these states
export type EngineStatus =
  | "in_development"  // being built (active engine-build project)
  | "internal_only"   // completed but not publicly released; only owner can use
  | "public_release"  // released on the engine market; others can license
  | "deprecated"      // superseded, still usable but losing currentness fast
  | "discontinued";   // no longer available for new licenses

// Licensing terms — flexible so player (or comp/3P) can set one-time, royalty, or both
export interface LicenseTerms {
  licenseFee: Money;           // upfront one-time fee, cents (0 = free)
  royaltyRate: number;         // 0-1, cut of licensee's game revenue
  minCommitmentMonths: number; // minimum license duration (0 = none)
  // Additional gates
  requiredReputation?: number; // some premium engines only offered to respected studios
  exclusiveToGenres?: GenreId[]; // optional constraint
  openSource: boolean;         // if true: fee=0, royalty=0, anyone can use
}

// A specific engine version. Major versions are separate engines with their own identity.
// Unreal 3, Unreal 4, Unreal 5 = three distinct GameEngine records sharing a `lineageId`.
export interface GameEngine {
  id: ID;
  name: string;              // "Unreal Engine 4", "Source 2", "MavForge 2"
  shortName?: string;        // "UE4"
  lineageId: string;         // shared across versions: "unreal_engine"
  versionNumber: number;     // 1, 2, 3, 4, 5
  origin: EngineOrigin;
  ownerStudioId: ID | null;  // null for third_party engines (no owning studio in-game)

  status: EngineStatus;

  // Feature composition
  featureIds: string[];       // engine features from tech tree
  // Per-branch tier (weakest branch gates what genres the engine can support)
  branchTiers: Record<TechBranch, number>;
  // Overall tier — derived, min across branches (or avg — chosen at build time)
  overallTier: number;

  // Economics
  buildCost: Money;           // one-time cost to build this version
  monthlyMaintenanceCost: Money; // ongoing upkeep; if unpaid, currentness decays faster
  publicReleaseCost?: Money;  // cost to convert from internal_only to public_release

  // Licensing (only meaningful when status = public_release)
  licenseTerms: LicenseTerms;

  // Timing
  startedYear: number;
  releasedYear?: number;      // year status first became internal_only or public_release
  deprecatedYear?: number;
  successorEngineId?: ID;     // the next major version, when built

  // Currentness — decays over time, boosted by active maintenance + successor not yet released
  currentness: number;        // 0-100

  // Reputation that the engine itself has accrued (separate from studio reputation)
  engineReputation: number;   // 0-100
  // Total lifetime projects built on this engine
  projectsBuilt: number;
  // Total lifetime licensees (other studios)
  totalLicensees: number;
}

// An active engine-build project — constructs a new GameEngine over time
export interface EngineProject {
  id: ID;
  plannedName: string;
  plannedLineageId: string;
  plannedVersionNumber: number;
  // Which features the player selected (from unlocked tech)
  plannedFeatureIds: string[];
  // Phases (similar shape to game dev phases but simpler)
  phases: {
    name: "architecture" | "implementation" | "integration" | "optimization";
    completion: number;
    daysAllocated: number;
    daysSpent: number;
  }[];
  currentPhaseIndex: number;
  assignedStaffIds: ID[];
  budget: { total: Money; spent: Money };
  startDate: string;
  targetCompletionDate: string;
  cancelled: boolean;
}

// A license deal — when a studio (player or competitor) licenses an engine from another
export interface EngineLicense {
  id: ID;
  engineId: ID;
  licenseeStudioId: ID;       // who's using the engine
  licensorStudioId: ID | null; // who owns it (null for third-party)
  termsSnapshot: LicenseTerms; // terms at the time of signing (in case they change later)
  signedDate: string;
  // For royalty tracking
  lifetimeRoyaltiesPaid: Money;
  // Projects built under this license
  projectIds: ID[];
  active: boolean;
}

// R&D project — active research unlocking tech nodes
export interface ResearchProject {
  id: ID;
  nodeId: string;
  assignedStaffIds: ID[];
  pointsAccumulated: number;
  pointsRequired: number;
  startDate: string;
  completed: boolean;
}
