import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import type { AccountDoc, Cents, TransactionDoc } from "./types";

/**
 * Trigger: a transaction was created, updated, or deleted.
 * Action:  recompute the affected account's balance + clearedBalance and write
 *          back to AccountDoc. If the transaction moved between accounts (only
 *          possible via direct admin edit; the UI doesn't allow it), we
 *          recompute BOTH the before- and after-account.
 *
 * Triggers are idempotent: each runs against the current Firestore state, so
 * retries don't double-count. The function's own writes update only the
 * account doc, which doesn't re-trigger this function.
 */
export const onTransactionWriteUpdateAccount = onDocumentWritten(
  "households/{householdId}/transactions/{txnId}",
  async (event) => {
    const householdId = event.params.householdId;
    const before = event.data?.before.data() as TransactionDoc | undefined;
    const after = event.data?.after.data() as TransactionDoc | undefined;

    const affected = new Set<string>();
    if (before?.accountId) affected.add(before.accountId);
    if (after?.accountId) affected.add(after.accountId);

    if (affected.size === 0) {
      logger.warn("[balance] no accountId on either side", { householdId });
      return;
    }

    await Promise.all(
      Array.from(affected).map((accountId) =>
        recomputeAccountBalance(householdId, accountId),
      ),
    );
  },
);

async function recomputeAccountBalance(
  householdId: string,
  accountId: string,
): Promise<void> {
  const db = getFirestore();
  const txnsSnap = await db
    .collection("households")
    .doc(householdId)
    .collection("transactions")
    .where("accountId", "==", accountId)
    .get();

  let total: Cents = 0;
  let cleared: Cents = 0;
  for (const d of txnsSnap.docs) {
    const t = d.data() as TransactionDoc;
    total += t.amountCents;
    if (t.status === "cleared" || t.status === "reconciled") {
      cleared += t.amountCents;
    }
  }

  const accountRef = db
    .collection("households")
    .doc(householdId)
    .collection("accounts")
    .doc(accountId);

  // Only write if the values actually changed — avoids spurious updatedAt churn
  // and makes the function safer to retry.
  const accSnap = await accountRef.get();
  if (!accSnap.exists) {
    logger.warn("[balance] account vanished", { householdId, accountId });
    return;
  }
  const current = accSnap.data() as AccountDoc;
  if (current.balanceCents === total && current.clearedBalanceCents === cleared) {
    return;
  }

  await accountRef.update({
    balanceCents: total,
    clearedBalanceCents: cleared,
    updatedAt: FieldValue.serverTimestamp(),
  });
  logger.info("[balance] updated", {
    householdId,
    accountId,
    txnCount: txnsSnap.size,
    balanceCents: total,
    clearedBalanceCents: cleared,
  });
}
