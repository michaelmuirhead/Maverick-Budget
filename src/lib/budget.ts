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
 * Write a per-category, per-month assignment. Overwrites the existing
 * assignment if any. The Available column is derived on read, not stored
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
    "budgetMonths",
    args.month,
    "assignments",
    args.categoryId,
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
 * Ready to Assign = (lifetime on-budget income) − (lifetime assignments).
 *
 * "On-budget income" = inflow transactions (amount > 0) on accounts where
 * `onBudget === true` AND the transaction has no category set (uncategorized
 * inflows feed RTA, the same way YNAB treats "Inflow: Ready to Assign").
 *
 * For now categorized inflows (e.g., refunds back to a category) reduce the
 * category activity rather than feeding RTA.
 */
export function computeReadyToAssign(
  accounts: AccountDoc[],
  transactions: TransactionDoc[],
  assignments: CategoryMonthDoc[],
): Cents {
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  let income = 0;
  for (const t of transactions) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.categoryId !== null) continue;
    // Transfers shouldn't count; we don't have transfers yet, but guard anyway.
    if (t.transferTransactionId) continue;
    if (t.amountCents > 0) income += t.amountCents;
  }
  let assigned = 0;
  for (const a of assignments) {
    assigned += a.assignedCents;
  }
  return income - assigned;
}

/**
 * For one category, compute the running Available balance as of the given
 * month. Available = Σ (assigned + activity) across all months ≤ `month`,
 * clamped at 0 only for credit categories (we keep that behavior simple for
 * now and let Available go negative for any category — YNAB's "overspending"
 * pulls from RTA the next month, which we'll implement later).
 */
export function computeCategoryAvailable(
  categoryId: string,
  month: MonthString,
  allAssignments: Map<MonthString, CategoryMonthDoc[]>,
  transactions: TransactionDoc[],
  onBudgetAccountIds: Set<string>,
): Cents {
  let available = 0;
  // Iterate every month up to and including `month` and accumulate.
  const months = Array.from(allAssignments.keys()).sort();
  for (const m of months) {
    if (m > month) break;
    const a = allAssignments.get(m)?.find((x) => x.categoryId === categoryId);
    if (a) available += a.assignedCents;
    available += computeCategoryActivity(categoryId, m, transactions, onBudgetAccountIds);
  }
  return available;
}
