// Mirror of the relevant subset of src/types/schema.ts (frontend) for the
// functions runtime. Kept minimal — only what the triggers read/write.

import type { Timestamp } from "firebase-admin/firestore";

export type Cents = number;
export type DateString = string; // YYYY-MM-DD
export type MonthString = string; // YYYY-MM

export type TransactionStatus = "pending" | "uncleared" | "cleared" | "reconciled";

export interface TransactionSplit {
  amountCents: Cents;
  categoryId: string | null;
  memo: string | null;
}

export interface TransactionDoc {
  id: string;
  accountId: string;
  date: DateString;
  amountCents: Cents;
  categoryId: string | null;
  payeeId: string | null;
  payeeName: string | null;
  memo: string | null;
  status: TransactionStatus;
  transferTransactionId: string | null;
  transferAccountId: string | null;
  splits: TransactionSplit[] | null;
  source: "manual" | "plaid" | "import";
  plaidTransactionId: string | null;
  createdByUid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AccountDoc {
  id: string;
  name: string;
  type: string;
  onBudget: boolean;
  closed: boolean;
  balanceCents: Cents;
  clearedBalanceCents: Cents;
  plaidItemId: string | null;
  bankSyncEnabled: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CategoryMonthDoc {
  categoryId: string;
  month: MonthString;
  assignedCents: Cents;
  activityCents?: Cents;
  availableCents?: Cents;
}

export interface BudgetMonthDoc {
  month: MonthString;
  toBeBudgetedCents: Cents;
  totalAssignedCents: Cents;
  totalActivityCents: Cents;
  incomeCents: Cents;
  updatedAt: Timestamp;
}
