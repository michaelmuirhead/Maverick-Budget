import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import type {
  AccountDoc,
  BudgetMonthDoc,
  CategoryMonthDoc,
  Cents,
  MonthString,
  TransactionDoc,
} from "./types";

/**
 * On any transaction write, recompute the budget-month summary for every
 * month that the transaction touches (a single txn affects one month, but a
 * dated edit can move between months → recompute both old and new).
 */
export const onTransactionWriteUpdateBudgetMonth = onDocumentWritten(
  "households/{householdId}/transactions/{txnId}",
  async (event) => {
    const householdId = event.params.householdId;
    const before = event.data?.before.data() as TransactionDoc | undefined;
    const after = event.data?.after.data() as TransactionDoc | undefined;

    const months = new Set<MonthString>();
    if (before?.date) months.add(before.date.slice(0, 7) as MonthString);
    if (after?.date) months.add(after.date.slice(0, 7) as MonthString);

    if (months.size === 0) return;

    await Promise.all(
      Array.from(months).map((m) => recomputeBudgetMonth(householdId, m)),
    );
  },
);

/**
 * On any categoryMonth write (the assignment), recompute that month's summary.
 * Doc IDs are `${month}_${categoryId}` — pull month from the body, not the ID,
 * so renames or reshapes don't trip us up.
 */
export const onCategoryMonthWriteUpdateBudgetMonth = onDocumentWritten(
  "households/{householdId}/categoryMonths/{cmId}",
  async (event) => {
    const householdId = event.params.householdId;
    const before = event.data?.before.data() as CategoryMonthDoc | undefined;
    const after = event.data?.after.data() as CategoryMonthDoc | undefined;

    const months = new Set<MonthString>();
    if (before?.month) months.add(before.month);
    if (after?.month) months.add(after.month);

    if (months.size === 0) return;

    await Promise.all(
      Array.from(months).map((m) => recomputeBudgetMonth(householdId, m)),
    );
  },
);

async function recomputeBudgetMonth(
  householdId: string,
  month: MonthString,
): Promise<void> {
  const db = getFirestore();
  const householdRef = db.collection("households").doc(householdId);

  // Pull every account once so we know which are on-budget.
  const accountsSnap = await householdRef.collection("accounts").get();
  const onBudgetIds = new Set(
    accountsSnap.docs
      .map((d) => d.data() as AccountDoc)
      .filter((a) => a.onBudget)
      .map((a) => a.id),
  );

  // Transactions in this month, on on-budget accounts, excluding transfers.
  // Firestore doesn't support range-OR queries cheaply; pull all txns and
  // filter in memory. Personal-scale Firestore reads are dirt cheap.
  const start = `${month}-01`;
  const end = `${month}-31`; // inclusive upper bound; '31' covers all months
  const txnsSnap = await householdRef
    .collection("transactions")
    .where("date", ">=", start)
    .where("date", "<=", end)
    .get();

  let income: Cents = 0;
  let activity: Cents = 0;
  for (const d of txnsSnap.docs) {
    const t = d.data() as TransactionDoc;
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;

    if (t.splits && t.splits.length > 0) {
      for (const s of t.splits) {
        // Splits attribute to categories; their net is part of activity.
        activity += s.amountCents;
      }
      continue;
    }
    if (t.categoryId === null) {
      income += t.amountCents;
    } else {
      activity += t.amountCents;
    }
  }

  // Total assigned this month + total assigned EVER (for ToBeBudgeted).
  const thisMonthAssignSnap = await householdRef
    .collection("categoryMonths")
    .where("month", "==", month)
    .get();
  let totalAssignedThisMonth: Cents = 0;
  for (const d of thisMonthAssignSnap.docs) {
    const a = d.data() as CategoryMonthDoc;
    totalAssignedThisMonth += a.assignedCents;
  }

  // Cumulative income and assignments give us "Ready to Assign" as of end-of-month.
  const allAssignSnap = await householdRef.collection("categoryMonths").get();
  let cumulativeAssigned: Cents = 0;
  for (const d of allAssignSnap.docs) {
    const a = d.data() as CategoryMonthDoc;
    if (a.month <= month) cumulativeAssigned += a.assignedCents;
  }

  const allTxnsSnap = await householdRef.collection("transactions").get();
  let cumulativeIncome: Cents = 0;
  for (const d of allTxnsSnap.docs) {
    const t = d.data() as TransactionDoc;
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;
    if (t.splits && t.splits.length > 0) continue;
    if (t.categoryId !== null) continue;
    if (t.date.slice(0, 7) > month) continue;
    cumulativeIncome += t.amountCents;
  }

  const data: BudgetMonthDoc = {
    month,
    toBeBudgetedCents: cumulativeIncome - cumulativeAssigned,
    totalAssignedCents: totalAssignedThisMonth,
    totalActivityCents: activity,
    incomeCents: income,
    updatedAt: FieldValue.serverTimestamp() as unknown as BudgetMonthDoc["updatedAt"],
  };

  await householdRef.collection("budgetMonths").doc(month).set(data, { merge: true });

  logger.info("[budgetMonth] updated", { householdId, ...data });
}
