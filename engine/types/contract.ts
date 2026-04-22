// Work-for-hire contracts. The contract type supports both the (older) UI
// page schema and the (newer) richer system schema. New-schema fields are
// required (the systems file rely on them), legacy-schema fields are optional
// and get sensible fallbacks at the call site.
//
// Lifecycle: offered → accepted (active/in_progress) → completed | failed |
// expired | declined.

import type { ID, Money, StaffRole } from "./core";
import type { GenreId } from "./genre";

export type ContractStatus =
  | "offered"        // pitched to player, awaiting accept/decline
  | "active"         // accepted, work in progress (legacy name)
  | "in_progress"    // accepted, work in progress (new-schema name)
  | "completed"      // delivered & paid
  | "failed"         // missed deadline / under-spec, partial or no payment
  | "expired"        // offer ran past expiresDate without action
  | "declined";      // player turned it down

// Contract "kind" — the new-schema classification of what is being asked for.
export type ContractKind =
  | "port_job"        // port an existing title to another platform
  | "work_for_hire"   // build a complete game to spec
  | "custom_license"  // license + integrate the studio's engine for a client
  | "asset_work";     // one-off art/sound/writing deliverables

export interface Contract {
  id: ID;
  status: ContractStatus;

  // ---- New-schema identity (required — populated by engine/systems/contracts.ts) ----
  kind: ContractKind;
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  clientName: string;
  clientReputation: number;
  requiredStaffCount: number;
  preferredRoles: StaffRole[];
  minStudioReputation: number;
  requiresEngineId?: ID;
  genre?: GenreId;

  // ---- Lifecycle dates (ISO) — new-schema names are required ----
  offeredOn: string;
  expiresOn: string;
  deadline: string;
  acceptedOn?: string;
  completedOn?: string;

  // Legacy date aliases — populated alongside the new-schema dates so the
  // UI page (which still reads the legacy names) keeps working.
  offeredDate: string;
  expiresDate: string;
  dueDate: string;
  acceptedDate?: string;
  completedDate?: string;

  // ---- Payment terms (new-schema, required) ----
  payoutAmount: Money;
  advancePct: number;
  qualityFloor: number;
  qualityBonusThreshold: number;
  qualityBonusAmount: Money;

  // ---- Legacy payment fields — populated alongside new-schema values
  // so the UI can render totals without repeated `?? 0` fallbacks.
  upfrontPayment: Money;
  completionPayment: Money;
  bonusPayment?: Money;
  penaltyPerDayLate?: Money;

  // ---- Work tracking (new-schema, required) ----
  workDaysRequired: number;
  workCompleted: number;
  qualityAccumulated: number;
  reputationReward: number;
  reputationPenalty: number;
  assignedStaffIds?: ID[];

  // ---- Legacy display fields — populated so the UI can render headings.
  name: string;
  publisherName: string;
  publisherId?: ID;
  requiredGenreId?: string;
  requiredThemeId?: string;
  requiredPlatformIds?: string[];
  targetMetacriticScore?: number;
  targetUnitsSold?: number;
  scopeBudgetMonths?: number;
  reputationOnCompletion?: number;
  reputationOnFailure?: number;

  // ---- Linked project ----
  projectId?: ID;

  // ---- Resolution outputs (new-schema) ----
  finalQuality?: number;
  paidOut?: Money;

  // Free-text flavor (printed under title)
  flavor?: string;
}
