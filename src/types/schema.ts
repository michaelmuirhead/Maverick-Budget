import type { Timestamp } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// Maverick Budget — Firestore schema
//
// Layout:
//   users/{uid}                                 → UserDoc (per-auth-user profile)
//     settings/{notifications|display}          → preference docs
//     tokens/fcm                                → FcmTokenDoc
//
//   households/{householdId}                    → HouseholdDoc (root of shared budget)
//     members/{uid}                             → HouseholdMemberDoc
//     accounts/{accountId}                      → AccountDoc
//     categoryGroups/{groupId}                  → CategoryGroupDoc
//     categories/{categoryId}                   → CategoryDoc
//     transactions/{transactionId}              → TransactionDoc
//     scheduledTransactions/{scheduledId}       → ScheduledTransactionDoc
//     budgetMonths/{YYYY-MM}                    → BudgetMonthDoc
//       assignments/{categoryId}                → CategoryMonthDoc (per-cat per-month $)
//     payees/{payeeId}                          → PayeeDoc
//     plaidItems/{itemId}                       → PlaidItemDoc (when bank sync ON)
//
// MONEY: stored as integer cents (number) to avoid float drift. UI converts
// to/from display strings. Negative = outflow, positive = inflow.
//
// All monetary fields use the suffix `Cents` so we can grep for them.
// ─────────────────────────────────────────────────────────────────────────────

/** Money is always whole cents. 12.34 USD === 1234. */
export type Cents = number;

/** Firestore Timestamp on read; serverTimestamp() FieldValue on write. Allow either at the type layer. */
export type FsTime = Timestamp;

/** ISO date string `YYYY-MM-DD` in the household's local timezone (no time component). */
export type DateString = string;

/** ISO month string `YYYY-MM` — used as the document ID under budgetMonths/. */
export type MonthString = string;

// ── Users ───────────────────────────────────────────────────────────────────

export interface UserDoc {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  /** The household this user is currently active in. Null until onboarding finishes. */
  activeHouseholdId: string | null;
  createdAt: FsTime;
  updatedAt: FsTime;
}

export interface NotificationPrefsDoc {
  newTransaction: boolean;
  editTransaction: boolean;
  deleteTransaction: boolean;
  budgetUpdate: boolean;
  categoryAlert: boolean;
}

export interface DisplayPrefsDoc {
  monthlyTrends: boolean;
  yearInReview: boolean;
  categoryBreakdown: boolean;
  budgetVsActual: boolean;
}

export interface FcmTokenDoc {
  token: string;
  householdId: string;
  updatedAt: FsTime;
}

// ── Households ──────────────────────────────────────────────────────────────

export interface HouseholdDoc {
  id: string;
  name: string;
  /** A short shareable code (e.g. 6 chars) the spouse enters during onboarding to join. */
  joinCode: string;
  /** Owner uid — the user who created the household. Has elevated rights (delete household, rotate join code). */
  ownerUid: string;
  /** Denormalized list of member uids for fast security-rule checks (`request.auth.uid in resource.data.memberUids`). */
  memberUids: string[];
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** IANA timezone, e.g. "America/Chicago". Used to compute month boundaries. */
  timezone: string;
  /** First day of the budget week (0 = Sunday … 6 = Saturday). YNAB defaults to Monday. */
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  createdAt: FsTime;
  updatedAt: FsTime;
}

export type HouseholdRole = "owner" | "member";

export interface HouseholdMemberDoc {
  uid: string;
  role: HouseholdRole;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  joinedAt: FsTime;
}

// ── Accounts ────────────────────────────────────────────────────────────────

export type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "creditCard"
  | "lineOfCredit"
  | "loan"
  | "mortgage"
  | "investment"
  | "tracking"; // off-budget, balance-only (e.g., 401k)

export interface AccountDoc {
  id: string;
  name: string;
  type: AccountType;
  /** On-budget = balances feed Ready to Assign. Tracking accounts are off-budget. */
  onBudget: boolean;
  /** Hidden accounts disappear from the main UI but are kept for history. */
  closed: boolean;
  /** Cached running balance in cents. Recomputed by a Cloud Function on transaction writes. */
  balanceCents: Cents;
  /** Cached cleared balance in cents. */
  clearedBalanceCents: Cents;
  /** If sourced via Plaid. Null = pure manual account. */
  plaidItemId: string | null;
  /** Per-account toggle for bank sync. Defaults to false even on Plaid-linked accounts so the user opts in. */
  bankSyncEnabled: boolean;
  /** Sort order in the sidebar. Lower = higher up. */
  sortOrder: number;
  createdAt: FsTime;
  updatedAt: FsTime;
}

// ── Categories ──────────────────────────────────────────────────────────────

export interface CategoryGroupDoc {
  id: string;
  name: string;
  sortOrder: number;
  /** Hidden groups are folded out of the main budget view. */
  hidden: boolean;
  createdAt: FsTime;
  updatedAt: FsTime;
}

export type GoalType =
  | "weekly"
  | "monthlyContribution" // "Monthly Savings Builder"
  | "byDate"              // "Plan Your Spending"
  | "refillUpTo"          // refill to a target each month
  | "spendingTarget";     // soft cap per month

export interface CategoryGoal {
  type: GoalType;
  targetCents: Cents;
  /** For byDate goals — when the target should be hit. */
  targetDate?: DateString;
  /** For weekly goals — day of week the target resets (0–6, Sunday-based). */
  weekday?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** For monthlyContribution / refillUpTo — how often to repeat (default: every month). */
  cadenceMonths?: number;
}

export interface CategoryDoc {
  id: string;
  groupId: string;
  name: string;
  sortOrder: number;
  hidden: boolean;
  goal: CategoryGoal | null;
  /** Optional note shown on the category row. */
  note: string | null;
  createdAt: FsTime;
  updatedAt: FsTime;
}

/** Per-category, per-month assignment + computed activity/available. */
export interface CategoryMonthDoc {
  categoryId: string;
  month: MonthString;
  /** Money assigned to this category in this month. */
  assignedCents: Cents;
  /** Sum of transactions categorized to this category in this month. */
  activityCents: Cents;
  /** Available = previous available (rollover) + assigned + activity. Cached by Cloud Function. */
  availableCents: Cents;
}

// ── Budget Months ───────────────────────────────────────────────────────────

export interface BudgetMonthDoc {
  month: MonthString; // also the doc ID
  /** Sum of inflows to "Ready to Assign" this month. Cached. */
  toBeBudgetedCents: Cents;
  /** Sum of all assignments this month. Cached. */
  totalAssignedCents: Cents;
  /** Sum of all category activity this month. Cached. */
  totalActivityCents: Cents;
  /** Income for the month (sum of inflows on-budget). Cached. */
  incomeCents: Cents;
  updatedAt: FsTime;
}

// ── Transactions ────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "uncleared" | "cleared" | "reconciled";

/** A single line in a split transaction; sums must equal the parent's amountCents. */
export interface TransactionSplit {
  amountCents: Cents;
  categoryId: string | null;
  memo: string | null;
}

export interface TransactionDoc {
  id: string;
  accountId: string;
  /** YYYY-MM-DD in household timezone. Drives which month the txn lands in. */
  date: DateString;
  /** Negative = outflow, positive = inflow. Sum of splits if `splits` is set. */
  amountCents: Cents;
  /** Null for income / split-only transactions. Use `splits` for multi-category txns. */
  categoryId: string | null;
  payeeId: string | null;
  /** Free-text payee (denormalized) so we can render before payee creation completes. */
  payeeName: string | null;
  memo: string | null;
  status: TransactionStatus;
  /** If this is one half of a transfer between two accounts, the ID of the other side. */
  transferTransactionId: string | null;
  /** If transferring to/from a different account, that account's ID (denormalized for queries). */
  transferAccountId: string | null;
  splits: TransactionSplit[] | null;
  /** Source — manual entry vs imported from bank sync. */
  source: "manual" | "plaid" | "import";
  /** Plaid transaction ID, when source === "plaid". For dedup. */
  plaidTransactionId: string | null;
  /** Audit fields. */
  createdByUid: string;
  createdAt: FsTime;
  updatedAt: FsTime;
}

// ── Scheduled Transactions ──────────────────────────────────────────────────

export type ScheduleFrequency =
  | "never"
  | "daily"
  | "weekly"
  | "everyOtherWeek"
  | "twiceAMonth"
  | "every4Weeks"
  | "monthly"
  | "everyOtherMonth"
  | "every3Months"
  | "every4Months"
  | "twiceAYear"
  | "yearly"
  | "everyOtherYear";

export interface ScheduledTransactionDoc {
  id: string;
  accountId: string;
  amountCents: Cents;
  categoryId: string | null;
  payeeId: string | null;
  payeeName: string | null;
  memo: string | null;
  /** Next date the schedule will fire. */
  nextDate: DateString;
  frequency: ScheduleFrequency;
  splits: TransactionSplit[] | null;
  /** If this schedule is also a transfer, the other-side account ID. */
  transferAccountId: string | null;
  createdByUid: string;
  createdAt: FsTime;
  updatedAt: FsTime;
}

// ── Payees ──────────────────────────────────────────────────────────────────

export interface PayeeDoc {
  id: string;
  name: string;
  /** If set, transactions for this payee auto-fill this category. */
  defaultCategoryId: string | null;
  /** Hidden payees are kept for history but don't appear in autocomplete. */
  hidden: boolean;
  /** Internal payee names used for transfers ("Transfer : Checking"). */
  isTransfer: boolean;
  /** When isTransfer is true, the account this payee represents. */
  transferAccountId: string | null;
  createdAt: FsTime;
  updatedAt: FsTime;
}

// ── Plaid (off by default) ──────────────────────────────────────────────────

export interface PlaidItemDoc {
  id: string;
  institutionId: string;
  institutionName: string;
  /** Encrypted access token reference — actual token lives in Cloud Function secrets, not Firestore. */
  accessTokenRef: string;
  /** Whether sync is currently enabled for this institution. Per-account toggles live on AccountDoc. */
  enabled: boolean;
  lastSyncAt: FsTime | null;
  status: "ok" | "needsReauth" | "error";
  createdAt: FsTime;
  updatedAt: FsTime;
}
