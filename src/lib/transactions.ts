import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
