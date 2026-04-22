import type { ID, Money } from "./core";

// DLC (Downloadable Content) — extends the revenue tail of released games.
//
// Per MGT DLC rules (memory, 2026-04-20):
//  - DLC is declared on the game concept, not bolted on. `DLCPlan` records
//    live on the Project; they convert into real `DLC` records when the
//    player decides to actually build one.
//  - Plans declared at concept unlock the season-pass option. Post-launch
//    declaration is allowed but loses the season-pass slot.
//  - Hard ceiling: DLC unit sales ≤ base-game lifetime unit sales (enforced
//    in the sales tick — not here).
//  - Five declarable kinds: Cosmetic, Content pack, Expansion, Season pass,
//    MMO live-content. `patch_free` is legacy — free goodwill patches are
//    still allowed but not one of the five plan kinds.

export type DLCKind =
  | "cosmetic"          // skins / tracks / small ornamental content (2003+)
  | "content_pack"      // small DLC — new levels, side missions, costumes (always)
  | "expansion"         // substantial — new areas, campaign-sized (always)
  | "season_pass"       // bundle of planned seasonal content (2011+, concept-only)
  | "mmo_live_content"  // live-service patches/seasons/expansions (MMO tech required)
  | "patch_free";       // free goodwill patch — builds rep, no revenue

export type DLCStatus =
  | "in_development"
  | "released"
  | "cancelled";

// ============ DLC PLAN (declared at concept) ============
// A DLCPlan is a non-binding intent recorded on the parent Project. Players
// can edit/cancel plans up until the project enters in_development. Plans do
// NOT reserve budget or staff — they just shape the road-map and gate the
// season-pass slot.
export type DLCPlanStatus =
  | "planned"          // declared on the concept; no dev yet
  | "in_development"   // materialized into a real DLC record
  | "released"         // linked DLC is live
  | "cancelled";

export interface DLCPlan {
  id: ID;
  kind: DLCKind;
  name?: string;                 // optional — player can name it at concept or later
  plannedAtConcept: boolean;     // true iff declared before project went in_development
  status: DLCPlanStatus;
  linkedDlcId?: ID;              // set when the plan converts into an actual DLC record
}

// ============ DLC PLAN ERA GATING ============
// Returns true if a player can *declare a plan* of this kind in the given year.
// Year gates remain the hard floor — a type can't appear before its emergedYear
// even if the player somehow completed the gating tech early. The R&D gate is
// the softer, studio-specific check on top (see `dlcKindRequiredTechId`).
export function dlcKindAvailableInYear(kind: DLCKind, year: number): boolean {
  switch (kind) {
    case "cosmetic":          return year >= 2003;
    case "content_pack":      return year >= 1988;
    case "expansion":         return year >= 1994;
    case "season_pass":       return year >= 2011;
    case "mmo_live_content":  return year >= 2000;          // MMO live-service era
    case "patch_free":        return true;
  }
}

// ============ DLC PLAN R&D GATING ============
// Each priced DLC kind requires a completed tech node before the studio can
// declare or ship it. Returns the node ID, or null if the kind has no R&D gate
// (free patches; MMO live-content gated separately on MMO tech tier).
export function dlcKindRequiredTechId(kind: DLCKind): string | null {
  switch (kind) {
    case "content_pack":      return "mon_content_pack";
    case "expansion":         return "mon_expansion_pipe";
    case "cosmetic":          return "mon_cosmetic_dlc";
    case "season_pass":       return "mon_season_pass";
    case "mmo_live_content":  return "mon_mmo_live_service";
    case "patch_free":        return null; // always available
  }
}

// Human-readable label used in UI + logs.
export function dlcKindLabel(kind: DLCKind): string {
  switch (kind) {
    case "cosmetic":          return "Cosmetic";
    case "content_pack":      return "Content Pack";
    case "expansion":         return "Expansion";
    case "season_pass":       return "Season Pass";
    case "mmo_live_content":  return "MMO Live Content";
    case "patch_free":        return "Free Patch";
  }
}

// One-line pitch copy for the concept-screen UI.
export function dlcKindDescription(kind: DLCKind): string {
  switch (kind) {
    case "cosmetic":         return "Skins, tracks, small ornamental content. Low-cost, low-risk.";
    case "content_pack":     return "Small-scope add-on — new levels, side missions, maps.";
    case "expansion":        return "Campaign-sized add-on. Big budget, big return. Can trigger a market-mover.";
    case "season_pass":      return "Pre-sold bundle of future seasonal content. Only available if declared at concept.";
    case "mmo_live_content": return "Live-service patches, seasons, expansions. Requires MMO-capable engine.";
    case "patch_free":       return "Free patch. No revenue; builds goodwill.";
  }
}

// Kinds the player can declare at concept time, in display order.
export const DLC_PLAN_KINDS: DLCKind[] = [
  "expansion",
  "content_pack",
  "cosmetic",
  "season_pass",
  "mmo_live_content",
];

// ============ DLC (the actual buildable unit) ============
export interface DLC {
  id: ID;
  name: string;
  parentProjectId: ID;       // the game this extends
  parentIpId?: ID;           // franchise

  kind: DLCKind;
  status: DLCStatus;
  fromPlanId?: ID;           // links back to the declaring DLCPlan, if any

  // Development
  startDate: string;          // ISO
  estimatedReleaseDate: string;
  actualReleaseDate?: string;
  assignedStaffIds: ID[];
  totalWorkDays: number;      // scales with kind
  workDaysCompleted: number;

  // Economics
  budget: Money;
  spent: Money;
  priceTag: Money;             // per-unit price (0 for free)

  // Outcome — measured after release
  qualityScore: number;        // 0-100, blends parent project quality + effort
  adoptionRate?: number;       // 0-1, fraction of parent game's owners who buy
  lifetimeSales?: number;      // units
  lifetimeRevenue?: Money;
}

// ============ LIVE SERVICE ============
// A live-service flag on a project enables continuous content packs and a
// monthly subscription revenue stream until the service is sunset.
export interface LiveServiceState {
  projectId: ID;
  enabled: boolean;
  startDate: string;
  activePlayers: number;        // declining over time without fresh content
  monthlySubscriptionRevenue: Money;
  // Count of successful DLC cycles — boosts retention
  contentCycleCount: number;
  lastContentDate: string;
  // Sunset date when the service winds down
  sunsetDate?: string;
}
