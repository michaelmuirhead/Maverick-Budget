import type { ID, Money, DevPhaseId, QualityAxis, TargetAudience } from "./core";
import type { GenreId, SubGenreId } from "./genre";
import type { ThemeId } from "./market";
import type { DLCPlan } from "./dlc";

export type ProjectStatus =
  | "concept"         // being designed
  | "in_development"  // active
  | "ready_to_release" // launch phase complete; awaiting player approval
  | "released"
  | "cancelled";

export interface PhaseFocusSliders {
  // Sum should equal 100
  gameplay: number;
  graphics: number;
  sound: number;
  story: number;
  world: number;
  ai: number;
  polish: number;
}

export interface PhaseProgress {
  id: DevPhaseId;
  name: string;
  completion: number;     // 0-100
  daysAllocated: number;
  daysSpent: number;
  sliders: PhaseFocusSliders;
  crunching: boolean;
  // Output accumulated during this phase
  designPoints: number;
  techPoints: number;
  bugsGenerated: number;
  bugsFixed: number;
}

export interface ProjectBudget {
  total: Money;
  spent: Money;
  marketing: Money;
  devKitCosts: Money;
}

export interface Project {
  id: ID;
  name: string;
  status: ProjectStatus;
  // GDD
  genre: GenreId;
  subGenre?: SubGenreId;
  theme: ThemeId;
  audience: TargetAudience;
  platformIds: string[];      // can be multi-platform
  // null = hand-coded from scratch (no third-party or in-house engine).
  // Common in pre-1993 era when no third-party engines existed; remains a
  // valid throwback/indie choice in any era. Hand-coded projects get no
  // engine axis boosts and pay no engine royalties.
  engineId: ID | null;
  budget: ProjectBudget;
  // Franchise link
  ipId?: ID;
  isSequel: boolean;
  sequelNumber?: number;      // 2, 3, 4, ...
  // Publishing — set when player accepts a publishing deal on this project
  publishingDealId?: ID;
  // Development
  phases: PhaseProgress[];
  currentPhaseIndex: number;
  assignedStaffIds: ID[];
  startDate: string;          // ISO
  targetReleaseDate: string;  // ISO
  actualReleaseDate?: string;
  // Accumulated quality
  qualityAxes: Record<QualityAxis, number>; // 0-100 per axis
  // ---- Bug accounting ----
  // During development: totalBugs is the running net (generated - fixed); visibleBugs/hiddenBugs are 0.
  // At release: totalBugs is split into visibleBugs + hiddenBugs and stays equal to (visible + hidden).
  // Post-launch: visibleBugs decreases via patches, hiddenBugs decreases as it surfaces into visibleBugs.
  totalBugs: number;
  visibleBugs: number;            // bugs the public knows about; drives userScore. 0 until release.
  hiddenBugs: number;             // unsurfaced; bleed into visibleBugs over time after launch. 0 until release.
  surfacedBugsToDate: number;     // running tally of post-launch hidden→visible flow
  bugsFixedPostLaunch: number;    // running tally of fixes applied after launch
  techDebt: number;               // accumulates from crunch; raises hidden ratio at launch & surface rate post-launch
  hypeLevel: number;          // 0-100, driven by marketing & buzz
  // Post-release
  metacriticScore?: number;
  reviewIds?: ID[];
  userScore: number | null;       // 0-100, recomputes daily from visibleBugs after release. null pre-release.
  launchedInBadState: boolean;    // set at release if visibleBugs at launch exceeded the bad-state threshold
  lifetimeSales?: number;     // units
  lifetimeRevenue?: Money;
  // Flags
  cancelled: boolean;
  crunchDaysTotal: number;

  // ---- Quality Control Push (in-development bug hunt) ----
  // When active, all assigned staff pivot from feature work to bug hunting:
  // phase progress slows drastically, new-bug generation is suppressed, and
  // fix rate climbs to patch-sprint levels across every phase (not just QA
  // phases). Accrues qcDaysTotal for stat tracking and a small morale tax.
  qualityControlActive: boolean;
  qcDaysTotal: number;

  // ---- DLC plans (declared at concept) ----
  // Optional for backwards-compat with saves predating the DLC plan system.
  // Plans declared here unlock the season-pass slot; plans added post-launch
  // are still allowed but lose that slot. Materializing a plan into a real
  // DLC is handled by engine/systems/dlc.ts.
  dlcPlans?: DLCPlan[];

  // ---- Subscription buyout offer ----
  // Generated at the ready_to_release transition for era-appropriate years
  // (2005+). The service offers a guaranteed flat payment in exchange for
  // including the game in their catalog — at the cost of a chunk of lifetime
  // unit sales. Pending until accepted, declined, or expired (date passes).
  // Once accepted (subscriptionDealAccepted), the active sale projection
  // applied at releaseProject time is multiplied by (1 - salesReductionPct).
  subscriptionOffer?: SubscriptionOffer | null;
  subscriptionDealAccepted?: boolean;
  subscriptionServiceName?: string;
  subscriptionPayment?: Money;
  subscriptionSalesReductionPct?: number;
}

// ---- Subscription buyout offer (Game Pass / Apple Arcade / etc.) ----
// Era-gated: a streaming or subscription service offers a flat payment to
// pull the game into their catalog at launch. Player trades upside for
// certainty: accept = guaranteed cash now, but lifetime unit sales drop
// by salesReductionPct. Decline = nothing happens, normal sales curve.
// Expires after a fixed window if neither button is pressed.
export interface SubscriptionOffer {
  serviceId: string;             // e.g. "gamepass", "apple_arcade"
  serviceName: string;           // display, e.g. "Maverick Game Pass"
  flatPayment: Money;            // paid to studio.cash on accept
  salesReductionPct: number;     // 0..1, applied to projected lifetime units/revenue at release
  reputationBonus: number;       // 0-3, added to studio reputation on accept (catalog prestige)
  generatedDate: string;         // ISO
  expiresDate: string;           // ISO — offer auto-expires if neither resolved
}

// ---- Patch sprint — player-triggered post-launch dev burst ----
// Pulls staff onto a released project for a fixed window; applies a meaningful
// bug-fix burst at completion and emits a `patch_released` event. Mirrors a
// real-world named patch like "1.1" or "Definitive Update".
export type PatchSprintStatus = "active" | "completed" | "cancelled";

export interface PatchSprint {
  id: ID;
  projectId: ID;
  name: string;                   // e.g. "1.1 Patch", "Definitive Update"
  status: PatchSprintStatus;
  startDate: string;              // ISO
  plannedDays: number;
  daysSpent: number;
  endDate?: string;               // ISO when completed or cancelled
  assignedStaffIds: ID[];         // staff temporarily attached to this sprint
  marketingSpend: Money;          // optional comms — boosts userScore recovery on release
  // Outputs
  bugsFixedSoFar: number;
  finalBurstApplied: boolean;
}

// ---- Active sale record — a released project's ongoing revenue ----
// Created at release, ticked daily, finishes when lifecycle ends.
export interface ActiveSale {
  id: ID;
  projectId: ID;
  releaseDate: string;         // ISO
  lifetimeDays: number;        // total duration the game will continue selling
  daysOnSale: number;          // elapsed since release
  // Projected totals (computed at release)
  projectedLifetimeUnits: number;
  projectedLifetimeRevenue: Money;
  // Accumulated as of now
  unitsSoldToDate: number;
  revenueToDate: Money;
  // Per-day decay curve parameters
  launchWeekBoost: number;     // multiplier in first 7 days
  decayHalfLife: number;       // days until sales halve
  curveTotalWeight: number;    // precomputed integral of the weight curve (for O(1) lookup)
  // Royalty tracking (per sale to compute daily payouts)
  engineRoyaltyRate: number;
  platformRoyaltyRate: number;
  engineId: ID | null;
  // Lifecycle status
  active: boolean;
}

export interface IP {
  id: ID;
  name: string;
  originalProjectId: ID;
  genreId: GenreId;
  themeId: ThemeId;
  // Fan affinity — builds with successful releases
  fanAffinity: number;        // 0-100
  // Fatigue — rises with too-frequent sequels, decays with time
  fatigue: number;            // 0-100
  // Release history
  projectIds: ID[];
  // Last release date
  lastReleaseDate: string;
  // Peak metacritic in franchise
  peakScore: number;
  // Total lifetime franchise revenue
  lifetimeRevenue: Money;

  // ---- Licensing (out to third-party studios) ----
  licensedOut?: boolean;
  licenseStartDate?: string;     // ISO
  licenseEndDate?: string;       // ISO — null/undefined means perpetual
  licenseFeePerYear?: Money;     // recurring royalty paid to player
  licenseeId?: ID;               // competitor ID currently holding the license
  // Newer-style licensing fields (used by engine/systems/ip.ts).
  licenseeName?: string;
  licenseExpiresDate?: string;
  licenseRoyaltyRate?: number;

  // ---- Reboots ----
  rebootCount?: number;          // how many times the player has rebooted this IP
  lastRebootDate?: string;       // ISO of most recent reboot
  // Tracks how many games have released under the current generation (reset on reboot).
  currentGeneration?: number;
}
