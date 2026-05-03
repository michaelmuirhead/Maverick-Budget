import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import type { AccountDoc, CategoryMonthDoc, TransactionDoc } from "./types";

/**
 * Admin-callable: recompute every cached value for a household. Use after a
 * data import, or to fix drift if a trigger ever misses an event. Caller must
 * be a member of the household.
 *
 * Invoked from the client like:
 *   const fn = httpsCallable(getFunctions(), 'recomputeHousehold');
 *   await fn({ householdId: 'xyz' });
 */
export const recomputeHousehold = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in first.");

  const householdId = (req.data?.householdId ?? "") as string;
  if (!householdId) throw new HttpsError("invalid-argument", "householdId required.");

  const db = getFirestore();
  const householdRef = db.collection("households").doc(householdId);
  const hh = await householdRef.get();
  if (!hh.exists) throw new HttpsError("not-found", "Household not found.");
  const memberUids = (hh.data()?.memberUids ?? []) as string[];
  if (!memberUids.includes(uid)) {
    throw new HttpsError("permission-denied", "Not a member of this household.");
  }

  // Pull all data once, recompute everything in memory, write back in batches.
  const [accountsSnap, txnsSnap, cmSnap] = await Promise.all([
    householdRef.collection("accounts").get(),
    householdRef.collection("transactions").get(),
    householdRef.collection("categoryMonths").get(),
  ]);

  const accounts = accountsSnap.docs.map((d) => d.data() as AccountDoc);
  const txns = txnsSnap.docs.map((d) => d.data() as TransactionDoc);
  const cms = cmSnap.docs.map((d) => d.data() as CategoryMonthDoc);

  // 1) Account balances.
  const balanceByAccount = new Map<string, { total: number; cleared: number }>();
  for (const a of accounts) balanceByAccount.set(a.id, { total: 0, cleared: 0 });
  for (const t of txns) {
    const cur = balanceByAccount.get(t.accountId);
    if (!cur) continue;
    cur.total += t.amountCents;
    if (t.status === "cleared" || t.status === "reconciled") cur.cleared += t.amountCents;
  }

  // 2) Per-month summaries.
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  const monthsTouched = new Set<string>();
  for (const t of txns) monthsTouched.add(t.date.slice(0, 7));
  for (const a of cms) monthsTouched.add(a.month);

  const monthSummaries = new Map<
    string,
    { income: number; activity: number; assigned: number }
  >();
  for (const m of monthsTouched) {
    monthSummaries.set(m, { income: 0, activity: 0, assigned: 0 });
  }
  for (const t of txns) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;
    const m = t.date.slice(0, 7);
    const s = monthSummaries.get(m);
    if (!s) continue;
    if (t.splits && t.splits.length > 0) {
      for (const sp of t.splits) s.activity += sp.amountCents;
    } else if (t.categoryId === null) {
      s.income += t.amountCents;
    } else {
      s.activity += t.amountCents;
    }
  }
  for (const a of cms) {
    const s = monthSummaries.get(a.month);
    if (s) s.assigned += a.assignedCents;
  }

  // Cumulative for ToBeBudgeted at each month.
  const sortedMonths = Array.from(monthsTouched).sort();
  let cumIncome = 0;
  let cumAssigned = 0;
  const tbbByMonth = new Map<string, number>();
  for (const m of sortedMonths) {
    const s = monthSummaries.get(m)!;
    cumIncome += s.income;
    cumAssigned += s.assigned;
    tbbByMonth.set(m, cumIncome - cumAssigned);
  }

  // Write back in batches (max 500 ops per batch).
  let writes = 0;
  let batch = db.batch();
  function flush() {
    return batch.commit().then(() => {
      writes = 0;
      batch = db.batch();
    });
  }
  async function add(op: () => void) {
    op();
    writes += 1;
    if (writes >= 400) await flush();
  }

  for (const a of accounts) {
    const b = balanceByAccount.get(a.id);
    if (!b) continue;
    if (b.total === a.balanceCents && b.cleared === a.clearedBalanceCents) continue;
    const ref = householdRef.collection("accounts").doc(a.id);
    await add(() =>
      batch.update(ref, {
        balanceCents: b.total,
        clearedBalanceCents: b.cleared,
      }),
    );
  }
  for (const m of sortedMonths) {
    const s = monthSummaries.get(m)!;
    const ref = householdRef.collection("budgetMonths").doc(m);
    await add(() =>
      batch.set(
        ref,
        {
          month: m,
          toBeBudgetedCents: tbbByMonth.get(m) ?? 0,
          totalAssignedCents: s.assigned,
          totalActivityCents: s.activity,
          incomeCents: s.income,
        },
        { merge: true },
      ),
    );
  }
  if (writes > 0) await flush();

  logger.info("[recompute] done", {
    householdId,
    accounts: accounts.length,
    txns: txns.length,
    months: sortedMonths.length,
  });
  return {
    accounts: accounts.length,
    transactions: txns.length,
    months: sortedMonths.length,
  };
});
