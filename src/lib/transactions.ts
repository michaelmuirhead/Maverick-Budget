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
  TransactionStatus,
} from "@/types/schema";

interface CreateTransactionInput {
  householdId: string;
  createdByUid: string;
  accountId: string;
  date: DateString;
  /** Negative = outflow, positive = inflow. */
  amountCents: Cents;
  categoryId: string | null;
  payeeName: string | null;
  memo: string | null;
  status?: TransactionStatus;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const data: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
    id,
    accountId: input.accountId,
    date: input.date,
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    payeeId: null,
    payeeName: input.payeeName?.trim() || null,
    memo: input.memo?.trim() || null,
    status: input.status ?? "uncleared",
    transferTransactionId: null,
    transferAccountId: null,
    splits: null,
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
}

export async function updateTransaction(input: UpdateTransactionInput): Promise<void> {
  const ref = doc(
    db,
    "households",
    input.householdId,
    "transactions",
    input.transactionId,
  );
  await updateDoc(ref, {
    date: input.date,
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    payeeName: input.payeeName?.trim() || null,
    memo: input.memo?.trim() || null,
    status: input.status,
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
