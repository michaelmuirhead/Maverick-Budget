// Publishing deals — a publisher takes on YOUR finished game for distribution
// in exchange for a revenue share. Distinct from `Contract` (work-for-hire).
//
// The new-schema fields (used by engine/systems/publishers.ts) are required;
// legacy field names from the older UI are kept as optional for compatibility.

import type { ID, Money } from "./core";

export type PublishingDealStatus =
  | "offered"        // pitched, awaiting player decision
  | "active"         // accepted, collecting revenue share
  | "completed"      // term ended naturally
  | "rejected"       // player declined
  | "declined"       // player declined (alt name used by new system)
  | "expired"        // offer ran past expiresDate without action
  | "terminated";    // ended early (by either party)

export interface PublishingDeal {
  id: ID;
  status: PublishingDealStatus;

  // Required identity
  publisherId: ID;
  projectId: ID;

  // New-schema lifecycle dates (required)
  offeredOn: string;
  expiresOn: string;
  acceptedOn?: string;

  // Legacy date aliases (optional)
  offeredDate?: string;
  expiresDate?: string;
  acceptedDate?: string;
  startDate?: string;
  endDate?: string;

  // New-schema economic terms (required)
  revenueShare: number;
  advanceAmount: Money;
  marketingBudget: Money;
  revenueCollected: Money;

  // Legacy economic terms (optional)
  publisherName?: string;
  publisherRevenueShare?: number;
  upfrontAdvance?: Money;
  marketingBudgetCommitted?: Money;
  termYears?: number;

  // Quality gates / bonus
  metacriticBonusThreshold?: number;
  metacriticBonusAmount?: Money;
  minMetacriticScore?: number;
  minimumGuarantee?: Money;

  // Tracking
  bonusPaid?: boolean;
  revenueCollectedToDate?: Money;

  // Free-text flavor
  flavor?: string;
}
