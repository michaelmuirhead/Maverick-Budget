import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateId } from "./ids";
import { addMonths, formatDate } from "./dates";
import type {
  Cents,
  DateString,
  ScheduledTransactionDoc,
  ScheduleFrequency,
  TransactionDoc,
} from "@/types/schema";

interface CreateScheduledInput {
  householdId: string;
  createdByUid: string;
  accountId: string;
  amountCents: Cents;
  categoryId: string | null;
  payeeName: string | null;
  memo: string | null;
  nextDate: DateString;
  frequency: ScheduleFrequency;
}

export async function createScheduledTransaction(
  input: CreateScheduledInput,
): Promise<ScheduledTransactionDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const data: Omit<ScheduledTransactionDoc, "createdAt" | "updatedAt"> = {
    id,
    accountId: input.accountId,
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    payeeId: null,
    payeeName: input.payeeName?.trim() || null,
    memo: input.memo?.trim() || null,
    nextDate: input.nextDate,
    frequency: input.frequency,
    splits: null,
    transferAccountId: null,
    createdByUid: input.createdByUid,
  };
  await setDoc(
    doc(db, "households", input.householdId, "scheduledTransactions", id),
    { ...data, createdAt: ts, updatedAt: ts },
  );
  return { ...data, createdAt: ts as any, updatedAt: ts as any };
}

export async function updateScheduledTransaction(
  householdId: string,
  scheduledId: string,
  patch: Partial<
    Pick<
      ScheduledTransactionDoc,
      | "accountId"
      | "amountCents"
      | "categoryId"
      | "payeeName"
      | "memo"
      | "nextDate"
      | "frequency"
    >
  >,
): Promise<void> {
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) data[k] = v;
  }
  await updateDoc(
    doc(db, "households", householdId, "scheduledTransactions", scheduledId),
    data,
  );
}

export async function deleteScheduledTransaction(
  householdId: string,
  scheduledId: string,
): Promise<void> {
  await deleteDoc(
    doc(db, "households", householdId, "scheduledTransactions", scheduledId),
  );
}

/** Compute the next nextDate after a successful post. */
export function advanceScheduledDate(
  date: DateString,
  freq: ScheduleFrequency,
): DateString {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  switch (freq) {
    case "never":
      return date; // caller should delete the schedule instead
    case "daily":
      dt.setDate(dt.getDate() + 1);
      break;
    case "weekly":
      dt.setDate(dt.getDate() + 7);
      break;
    case "everyOtherWeek":
      dt.setDate(dt.getDate() + 14);
      break;
    case "twiceAMonth":
      // Approximate: hop +14 days. YNAB's actual semantics are 1st/15th-anchored
      // which we'll refine in 2.6 if needed.
      dt.setDate(dt.getDate() + 14);
      break;
    case "every4Weeks":
      dt.setDate(dt.getDate() + 28);
      break;
    case "monthly":
      return addMonthDate(date, 1);
    case "everyOtherMonth":
      return addMonthDate(date, 2);
    case "every3Months":
      return addMonthDate(date, 3);
    case "every4Months":
      return addMonthDate(date, 4);
    case "twiceAYear":
      return addMonthDate(date, 6);
    case "yearly":
      return addMonthDate(date, 12);
    case "everyOtherYear":
      return addMonthDate(date, 24);
  }
  return formatDate(dt);
}

/** Add N calendar months, clamping the day to the last day of the new month. */
function addMonthDate(date: DateString, n: number): DateString {
  const [y, m, d] = date.split("-").map(Number);
  // Normalize via addMonths on the YYYY-MM portion to avoid year/month math drift.
  const newMonth = addMonths(`${y}-${String(m).padStart(2, "0")}`, n);
  const [ny, nm] = newMonth.split("-").map(Number);
  const lastDayOfNewMonth = new Date(ny, nm, 0).getDate();
  const day = Math.min(d, lastDayOfNewMonth);
  return `${ny}-${String(nm).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Post a scheduled transaction once: write a real transaction with the same
 * shape, then advance (or delete, for one-time) the schedule. Atomic batch.
 */
export async function postScheduledTransaction(
  householdId: string,
  scheduled: ScheduledTransactionDoc,
): Promise<void> {
  const txnId = generateId();
  const ts = serverTimestamp();
  const txnData: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
    id: txnId,
    accountId: scheduled.accountId,
    date: scheduled.nextDate,
    amountCents: scheduled.amountCents,
    categoryId: scheduled.categoryId,
    payeeId: null,
    payeeName: scheduled.payeeName,
    memo: scheduled.memo,
    status: "uncleared",
    transferTransactionId: null,
    transferAccountId: null,
    splits: scheduled.splits,
    source: "manual",
    plaidTransactionId: null,
    createdByUid: scheduled.createdByUid,
  };

  const batch = writeBatch(db);
  batch.set(doc(db, "households", householdId, "transactions", txnId), {
    ...txnData,
    createdAt: ts,
    updatedAt: ts,
  });

  if (scheduled.frequency === "never") {
    batch.delete(
      doc(db, "households", householdId, "scheduledTransactions", scheduled.id),
    );
  } else {
    batch.update(
      doc(db, "households", householdId, "scheduledTransactions", scheduled.id),
      {
        nextDate: advanceScheduledDate(scheduled.nextDate, scheduled.frequency),
        updatedAt: ts,
      },
    );
  }
  await batch.commit();
}

/** Subcollection ref for hooks. */
export function scheduledCollection(householdId: string) {
  return collection(db, "households", householdId, "scheduledTransactions");
}
