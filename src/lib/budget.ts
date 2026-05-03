import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type {
  AccountDoc,
  Cents,
  CategoryMonthDoc,
  MonthString,
  TransactionDoc,
} from "@/types/schema";
import { monthOf } from "./dates";

/**
 * Composite ID for a categoryMonth doc. Underscore separator works because
 * MonthString is YYYY-MM (no underscores) and category IDs are UUIDs (no
 * underscores either).
 */
export function categoryMonthDocId(month: MonthString, categoryId: string): string {
  return `${month}_${categoryId}`;
}

/**
 * Write a per-category, per-month assignment to the flat
 * households/{hh}/categoryMonths/{month_categoryId} collection. Overwrites the
 * existing doc if any. The Available column is derived on read, not stored
 * here — so no need to keep activity/available in sync at write time.
 */
export async function setAssignment(args: {
  householdId: string;
  month: MonthString;
  categoryId: string;
  assignedCents: Cents;
}) {
  const ref = doc(
    db,
    "households",
    args.householdId,
    "categoryMonths",
    categoryMonthDocId(args.month, args.categoryId),
  );
  const data: Pick<CategoryMonthDoc, "categoryId" | "month" | "assignedCents"> = {
    categoryId: args.categoryId,
    month: args.month,
    assignedCents: args.assignedCents,
  };
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Derived computations (client-side) ──────────────────────────────────────
//
// For a personal app at this scale (< ~50K transactions, single household),
// computing on the client is fine. We can move to Cloud Function-cached
// values in budgetMonths/{m} later if performance demands it.

/**
 * Compute the running balance for an account as the sum of all of its
 * transactions' amounts. Returns total + cleared totals.
 */
export function computeAccountBalance(
  accountId: string,
  transactions: TransactionDoc[],
): { totalCents: Cents; clearedCents: Cents } {
  let total = 0;
  let cleared = 0;
  for (const t of transactions) {
    if (t.accountId !== accountId) continue;
    total += t.amountCents;
    if (t.status === "cleared" || t.status === "reconciled") {
      cleared += t.amountCents;
    }
  }
  return { totalCents: total, clearedCents: cleared };
}

/**
 * Sum of activity (signed) for a category in a given month, drawn from
 * on-budget transactions. Includes both positive (refunds) and negative
 * (spending) amounts so the math reads "available = assigned + activity".
 */
export function computeCategoryActivity(
  categoryId: string,
  month: MonthString,
  transactions: TransactionDoc[],
  onBudgetAccountIds: Set<string>,
): Cents {
  let activity = 0;
  for (const t of transactions) {
    if (t.categoryId !== categoryId) continue;
    if (!onBudgetAccountIds.has(t.accountId)) continue;
    if (monthOf(t.date) !== month) continue;
    activity += t.amountCents;
  }
  return activity;
}

/**
 * Ready to Assign = (lifetime on-budget inflows to RTA) − (lifetime assignments).
 *
 * "RTA inflows" = transactions with amount > 0 on on-budget accounts AND
 * no category set. Negative uncategorized transactions also reduce RTA
 * (so the user can model a startup loss or a manual RTA correction).
 * Transfers are excluded.
 *
 * Pass ALL assignments across ALL months — RTA is a lifetime figure.
 */
export function computeReadyToAssign(
  accounts: AccountDoc[],
  transactions: TransactionDoc[],
  allAssignments: CategoryMonthDoc[],
): Cents {
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  let inflow = 0;
  for (const t of transactions) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.categoryId !== null) continue;
    if (t.transferTransactionId) continue;
    inflow += t.amountCents; // signed — negative uncategorized reduces RTA
  }
  let assigned = 0;
  for (const a of allAssignments) {
    assigned += a.assignedCents;
  }
  return inflow - assigned;
}

/**
 * For one category, compute the running Available balance as of the END of
 * the given month. Available = Σ (assigned + activity) across all months
 * ≤ `month`. Negative balances carry forward (i.e. overspending shows red
 * the next month until you assign more to fix it).
 *
 * This is the "rollover" that makes envelopes feel real.
 */
export function computeCategoryAvailable(
  categoryId: string,
  month: MonthString,
  allAssignments: CategoryMonthDoc[],
  transactions: TransactionDoc[],
  onBudgetAccountIds: Set<string>,
): Cents {
  // Collect every month that has either an assignment or activity for this
  // category up to and including `month`. We then sum in chronological order.
  const months = new Set<MonthString>();
  for (const a of allAssignments) {
    if (a.categoryId === categoryId && a.month <= month) months.add(a.month);
  }
  for (const t of transactions) {
    if (t.categoryId !== categoryId) continue;
    if (!onBudgetAccountIds.has(t.accountId)) continue;
    const m = monthOf(t.date);
    if (m <= month) months.add(m);
  }

  let available = 0;
  for (const m of Array.from(months).sort()) {
    const a = allAssignments.find((x) => x.categoryId === categoryId && x.month === m);
    if (a) available += a.assignedCents;
    available += computeCategoryActivity(categoryId, m, transactions, onBudgetAccountIds);
  }
  return available;
}
