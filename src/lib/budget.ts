import {
  doc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  AccountDoc,
  Cents,
  CategoryDoc,
  CategoryMonthDoc,
  MonthString,
  TransactionDoc,
} from "@/types/schema";
import { addMonths, monthOf } from "./dates";

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

// ── Goal status ─────────────────────────────────────────────────────────────

export type GoalStatus =
  | { kind: "none" }
  | { kind: "underfunded"; neededCents: Cents; targetCents: Cents }
  | { kind: "funded"; targetCents: Cents }
  | { kind: "overSpent"; overByCents: Cents; targetCents: Cents };

/**
 * Compute "is this category meeting its goal for `month`?" using the goal type
 * declared on the category. Returns { kind: 'none' } if no goal is set.
 */
export function computeGoalStatus(
  category: CategoryDoc,
  month: MonthString,
  thisMonthAssigned: Cents,
  allAssignments: CategoryMonthDoc[],
  transactions: TransactionDoc[],
  onBudgetAccountIds: Set<string>,
): GoalStatus {
  const goal = category.goal;
  if (!goal) return { kind: "none" };

  switch (goal.type) {
    case "monthlyContribution": {
      if (thisMonthAssigned >= goal.targetCents) {
        return { kind: "funded", targetCents: goal.targetCents };
      }
      return {
        kind: "underfunded",
        neededCents: goal.targetCents - thisMonthAssigned,
        targetCents: goal.targetCents,
      };
    }
    case "refillUpTo": {
      // Need: prevAvailable + thisMonthAssigned + thisMonthActivity ≥ target.
      // Since the user is funding NOW, treat as: target − (prevAvailable + activity).
      const prevAvailable = computeCategoryAvailable(
        category.id,
        addMonths(month, -1),
        allAssignments,
        transactions,
        onBudgetAccountIds,
      );
      const thisMonthActivity = computeCategoryActivity(
        category.id,
        month,
        transactions,
        onBudgetAccountIds,
      );
      const needToFund = Math.max(
        0,
        goal.targetCents - (prevAvailable + thisMonthActivity),
      );
      if (thisMonthAssigned >= needToFund) {
        return { kind: "funded", targetCents: goal.targetCents };
      }
      return {
        kind: "underfunded",
        neededCents: needToFund - thisMonthAssigned,
        targetCents: goal.targetCents,
      };
    }
    case "byDate": {
      if (!goal.targetDate) {
        return { kind: "underfunded", neededCents: goal.targetCents, targetCents: goal.targetCents };
      }
      const targetMonth = goal.targetDate.slice(0, 7);
      // Total assigned across all months up to and including `month`.
      const totalAssignedThrough = allAssignments
        .filter((a) => a.categoryId === category.id && a.month <= month)
        .reduce((s, a) => s + a.assignedCents, 0);
      if (totalAssignedThrough >= goal.targetCents) {
        return { kind: "funded", targetCents: goal.targetCents };
      }
      // Months remaining INCLUDING this month, minimum 1.
      const monthsRemaining = Math.max(
        1,
        diffMonths(month, targetMonth) + 1,
      );
      const remaining = goal.targetCents - (totalAssignedThrough - thisMonthAssigned);
      const needThisMonth = Math.max(0, Math.ceil(remaining / monthsRemaining));
      if (thisMonthAssigned >= needThisMonth) {
        return { kind: "funded", targetCents: goal.targetCents };
      }
      return {
        kind: "underfunded",
        neededCents: needThisMonth - thisMonthAssigned,
        targetCents: goal.targetCents,
      };
    }
    case "spendingTarget": {
      const activity = computeCategoryActivity(
        category.id,
        month,
        transactions,
        onBudgetAccountIds,
      );
      const spentCents = -activity; // positive when overspent (outflows)
      if (spentCents <= goal.targetCents) {
        return { kind: "funded", targetCents: goal.targetCents };
      }
      return {
        kind: "overSpent",
        overByCents: spentCents - goal.targetCents,
        targetCents: goal.targetCents,
      };
    }
    case "weekly": {
      // Weekly is an alias of monthlyContribution × ~4.33 in our simplified
      // model. Treat as monthlyContribution(target × 4.33) to keep the row
      // honest. We'll add proper weekly support in 2.6 if needed.
      const monthlyEquivalent = Math.round(goal.targetCents * 4.345);
      if (thisMonthAssigned >= monthlyEquivalent) {
        return { kind: "funded", targetCents: monthlyEquivalent };
      }
      return {
        kind: "underfunded",
        neededCents: monthlyEquivalent - thisMonthAssigned,
        targetCents: monthlyEquivalent,
      };
    }
  }
}

/** Inclusive month delta: diffMonths('2026-05', '2026-08') === 3. */
function diffMonths(a: MonthString, b: MonthString): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

/**
 * Move money between two categories within the same month, atomically.
 * Decreases the source's assignment by `cents` and increases the destination's
 * by the same. Both must be on-budget categories. Pass current values so we
 * can write absolute new totals (Firestore batch.update doesn't compose).
 */
export async function moveBetweenCategories(args: {
  householdId: string;
  month: MonthString;
  fromCategoryId: string;
  fromCurrentCents: Cents;
  toCategoryId: string;
  toCurrentCents: Cents;
  cents: Cents;
}) {
  if (args.cents <= 0) throw new Error("Move amount must be positive.");
  if (args.fromCategoryId === args.toCategoryId) {
    throw new Error("Pick two different categories.");
  }
  const fromRef = doc(
    db,
    "households",
    args.householdId,
    "categoryMonths",
    categoryMonthDocId(args.month, args.fromCategoryId),
  );
  const toRef = doc(
    db,
    "households",
    args.householdId,
    "categoryMonths",
    categoryMonthDocId(args.month, args.toCategoryId),
  );
  const ts = serverTimestamp();
  const batch = writeBatch(db);
  batch.set(
    fromRef,
    {
      categoryId: args.fromCategoryId,
      month: args.month,
      assignedCents: args.fromCurrentCents - args.cents,
      updatedAt: ts,
    },
    { merge: true },
  );
  batch.set(
    toRef,
    {
      categoryId: args.toCategoryId,
      month: args.month,
      assignedCents: args.toCurrentCents + args.cents,
      updatedAt: ts,
    },
    { merge: true },
  );
  await batch.commit();
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
 * on-budget transactions. Walks split transactions: each split contributes
 * its amount to its own category. Includes both positive (refunds) and
 * negative (spending) amounts so the math reads "available = assigned + activity".
 */
export function computeCategoryActivity(
  categoryId: string,
  month: MonthString,
  transactions: TransactionDoc[],
  onBudgetAccountIds: Set<string>,
): Cents {
  let activity = 0;
  for (const t of transactions) {
    if (!onBudgetAccountIds.has(t.accountId)) continue;
    if (monthOf(t.date) !== month) continue;
    if (t.splits && t.splits.length > 0) {
      for (const s of t.splits) {
        if (s.categoryId === categoryId) activity += s.amountCents;
      }
    } else if (t.categoryId === categoryId) {
      activity += t.amountCents;
    }
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
    if (t.transferTransactionId) continue;
    // Splits attribute their amounts to specific categories — never RTA.
    if (t.splits && t.splits.length > 0) continue;
    if (t.categoryId !== null) continue;
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
