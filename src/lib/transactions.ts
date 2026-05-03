import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateId } from "./ids";
import type {
  Cents,
  DateString,
  TransactionDoc,
  TransactionSplit,
  TransactionStatus,
} from "@/types/schema";

interface CreateTransactionInput {
  householdId: string;
  createdByUid: string;
  accountId: string;
  date: DateString;
  /** Negative = outflow, positive = inflow. For split txns, must equal sum of splits. */
  amountCents: Cents;
  /** Set to null when splits is provided. */
  categoryId: string | null;
  payeeName: string | null;
  memo: string | null;
  status?: TransactionStatus;
  /** When provided, parent categoryId must be null and splits must sum to amountCents. */
  splits?: TransactionSplit[] | null;
}

export class SplitsMismatchError extends Error {
  constructor(public sumCents: Cents, public expectedCents: Cents) {
    super(
      `Splits add up to ${(sumCents / 100).toFixed(2)} but the transaction is ${(expectedCents / 100).toFixed(2)}.`,
    );
    this.name = "SplitsMismatchError";
  }
}

function normalizeSplits(
  splits: TransactionSplit[] | null | undefined,
  expectedTotalCents: Cents,
): TransactionSplit[] | null {
  if (!splits || splits.length === 0) return null;
  const sum = splits.reduce((s, x) => s + x.amountCents, 0);
  if (sum !== expectedTotalCents) {
    throw new SplitsMismatchError(sum, expectedTotalCents);
  }
  // Trim memos.
  return splits.map((s) => ({
    amountCents: s.amountCents,
    categoryId: s.categoryId,
    memo: s.memo?.trim() || null,
  }));
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const splits = normalizeSplits(input.splits, input.amountCents);
  const data: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
    id,
    accountId: input.accountId,
    date: input.date,
    amountCents: input.amountCents,
    // Parent has no own category when splits are present.
    categoryId: splits ? null : input.categoryId,
    payeeId: null,
    payeeName: input.payeeName?.trim() || null,
    memo: input.memo?.trim() || null,
    status: input.status ?? "uncleared",
    transferTransactionId: null,
    transferAccountId: null,
    splits,
    source: "manual",
    plaidTransactionId: null,
    createdByUid: input.createdByUid,
  };
  await setDoc(doc(db, "households", input.householdId, "transactions", id), {
    ...data,
    createdAt: ts,
    updatedAt: ts,
  });
  return { ...data, createdAt: ts as any, updatedAt: ts as any };
}

interface UpdateTransactionInput {
  householdId: string;
  transactionId: string;
  date: DateString;
  amountCents: Cents;
  categoryId: string | null;
  payeeName: string | null;
  memo: string | null;
  status: TransactionStatus;
  /** Pass an array to make this a split; pass null to clear splits and use categoryId instead. */
  splits?: TransactionSplit[] | null;
}

export async function updateTransaction(input: UpdateTransactionInput): Promise<void> {
  const ref = doc(
    db,
    "households",
    input.householdId,
    "transactions",
    input.transactionId,
  );
  const splits = normalizeSplits(input.splits, input.amountCents);
  await updateDoc(ref, {
    date: input.date,
    amountCents: input.amountCents,
    categoryId: splits ? null : input.categoryId,
    payeeName: input.payeeName?.trim() || null,
    memo: input.memo?.trim() || null,
    status: input.status,
    splits,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTransaction(
  householdId: string,
  transactionId: string,
): Promise<void> {
  // If this is half of a transfer, delete the other half too so we never leave
  // an orphan inflow/outflow behind.
  const ref = doc(db, "households", householdId, "transactions", transactionId);
  const snap = await getDoc(ref);
  const data = snap.data() as TransactionDoc | undefined;
  const otherId = data?.transferTransactionId;
  if (otherId) {
    const batch = writeBatch(db);
    batch.delete(ref);
    batch.delete(doc(db, "households", householdId, "transactions", otherId));
    await batch.commit();
    return;
  }
  await deleteDoc(ref);
}

// ── Transfers ───────────────────────────────────────────────────────────────

interface CreateTransferInput {
  householdId: string;
  createdByUid: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  date: DateString;
  /** Magnitude of the transfer in cents. Always positive. */
  amountCents: Cents;
  memo: string | null;
  /** Status applied to BOTH sides. Independent edits later are allowed. */
  status?: TransactionStatus;
}

/**
 * Atomically create the two mirrored transactions that represent a transfer.
 * Both txns have categoryId=null (transfers don't touch the budget directly).
 */
export async function createTransfer(input: CreateTransferInput) {
  if (input.fromAccountId === input.toAccountId) {
    throw new Error("Pick two different accounts.");
  }
  if (input.amountCents <= 0) {
    throw new Error("Transfer amount must be positive.");
  }
  const ts = serverTimestamp();
  const status = input.status ?? "uncleared";
  const fromId = generateId();
  const toId = generateId();

  const fromData: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
    id: fromId,
    accountId: input.fromAccountId,
    date: input.date,
    amountCents: -input.amountCents,
    categoryId: null,
    payeeId: null,
    payeeName: `Transfer : ${input.toAccountName}`,
    memo: input.memo?.trim() || null,
    status,
    transferTransactionId: toId,
    transferAccountId: input.toAccountId,
    splits: null,
    source: "manual",
    plaidTransactionId: null,
    createdByUid: input.createdByUid,
  };

  const toData: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
    id: toId,
    accountId: input.toAccountId,
    date: input.date,
    amountCents: input.amountCents,
    categoryId: null,
    payeeId: null,
    payeeName: `Transfer : ${input.fromAccountName}`,
    memo: input.memo?.trim() || null,
    status,
    transferTransactionId: fromId,
    transferAccountId: input.fromAccountId,
    splits: null,
    source: "manual",
    plaidTransactionId: null,
    createdByUid: input.createdByUid,
  };

  const batch = writeBatch(db);
  batch.set(doc(db, "households", input.householdId, "transactions", fromId), {
    ...fromData,
    createdAt: ts,
    updatedAt: ts,
  });
  batch.set(doc(db, "households", input.householdId, "transactions", toId), {
    ...toData,
    createdAt: ts,
    updatedAt: ts,
  });
  await batch.commit();
}

interface UpdateTransferInput {
  householdId: string;
  /** Either side of the pair — we look up the partner from transferTransactionId. */
  transactionId: string;
  date: DateString;
  /** Magnitude in cents (positive). Sign is applied per side. */
  amountCents: Cents;
  memo: string | null;
}

/**
 * Update both sides of a transfer in lockstep (date, amount, memo). Status
 * is left alone — clearing one side independently is intentional.
 */
export async function updateTransfer(input: UpdateTransferInput): Promise<void> {
  if (input.amountCents <= 0) throw new Error("Transfer amount must be positive.");
  const ref = doc(db, "households", input.householdId, "transactions", input.transactionId);
  const snap = await getDoc(ref);
  const data = snap.data() as TransactionDoc | undefined;
  if (!data) throw new Error("Transaction not found.");
  const otherId = data.transferTransactionId;
  if (!otherId) throw new Error("This transaction isn't a transfer.");

  const otherRef = doc(db, "households", input.householdId, "transactions", otherId);
  // Determine which side is the outflow vs inflow from the existing data.
  const thisSign = data.amountCents < 0 ? -1 : 1;
  const ts = serverTimestamp();

  const batch = writeBatch(db);
  batch.update(ref, {
    date: input.date,
    amountCents: thisSign * input.amountCents,
    memo: input.memo?.trim() || null,
    updatedAt: ts,
  });
  batch.update(otherRef, {
    date: input.date,
    amountCents: -thisSign * input.amountCents,
    memo: input.memo?.trim() || null,
    updatedAt: ts,
  });
  await batch.commit();
}

/** Update only the status of one side of a transfer (or any txn). */
export async function setTransactionStatus(
  householdId: string,
  transactionId: string,
  status: TransactionStatus,
): Promise<void> {
  await updateDoc(
    doc(db, "households", householdId, "transactions", transactionId),
    { status, updatedAt: serverTimestamp() },
  );
}

// ── Reconciliation ──────────────────────────────────────────────────────────

interface ReconcilePlan {
  /** Difference between user-stated balance and the new cleared total. */
  adjustmentCents: Cents;
  /** Number of currently uncleared txns that will be marked cleared. */
  unclearedCount: number;
  /** Number of txns that will be marked reconciled. */
  reconciledCount: number;
}

/** Pure-function preview of what reconciling would do. UI uses this to confirm. */
export function planReconcile(
  accountTransactions: TransactionDoc[],
  statedBalanceCents: Cents,
): ReconcilePlan {
  const uncleared = accountTransactions.filter((t) => t.status === "uncleared");
  // After reconcile, cleared balance equals the total balance of every txn
  // not yet reconciled, plus already-reconciled txns. Simpler: cleared total
  // post-reconcile == sum of all txns on account.
  const currentTotal = accountTransactions.reduce((s, t) => s + t.amountCents, 0);
  const adjustmentCents = statedBalanceCents - currentTotal;
  const reconciledCount =
    accountTransactions.filter((t) => t.status !== "reconciled").length +
    (adjustmentCents !== 0 ? 1 : 0);
  return {
    adjustmentCents,
    unclearedCount: uncleared.length,
    reconciledCount,
  };
}

interface ReconcileInput {
  householdId: string;
  accountId: string;
  createdByUid: string;
  statedBalanceCents: Cents;
  /** Date to apply to the adjustment txn. Defaults to today. */
  date: DateString;
  /** All current transactions on the account (used to compute the diff). */
  accountTransactions: TransactionDoc[];
}

/**
 * Reconcile an account against the user's stated balance:
 *   1. If stated ≠ current total, create an "adjustment" transaction
 *      (uncategorized, status=reconciled) so the new total matches stated.
 *   2. Mark every previously cleared/uncleared txn on the account as reconciled.
 *
 * Run as a single batch so partial failures don't leave the account half-done.
 */
export async function reconcileAccount(input: ReconcileInput): Promise<ReconcilePlan> {
  const plan = planReconcile(input.accountTransactions, input.statedBalanceCents);
  const ts = serverTimestamp();
  const batch = writeBatch(db);

  // Mark every non-reconciled txn as reconciled.
  for (const t of input.accountTransactions) {
    if (t.status === "reconciled") continue;
    batch.update(
      doc(db, "households", input.householdId, "transactions", t.id),
      { status: "reconciled", updatedAt: ts },
    );
  }

  // Optional adjustment txn so the new balance matches the user's bank.
  if (plan.adjustmentCents !== 0) {
    const adjId = generateId();
    const adjData: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
      id: adjId,
      accountId: input.accountId,
      date: input.date,
      amountCents: plan.adjustmentCents,
      categoryId: null,
      payeeId: null,
      payeeName: "Reconciliation Adjustment",
      memo: null,
      status: "reconciled",
      transferTransactionId: null,
      transferAccountId: null,
      splits: null,
      source: "manual",
      plaidTransactionId: null,
      createdByUid: input.createdByUid,
    };
    batch.set(doc(db, "households", input.householdId, "transactions", adjId), {
      ...adjData,
      createdAt: ts,
      updatedAt: ts,
    });
  }

  await batch.commit();
  return plan;
}
