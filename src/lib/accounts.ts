import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateId } from "./ids";
import { todayISO } from "./dates";
import type {
  AccountDoc,
  AccountType,
  Cents,
  TransactionDoc,
} from "@/types/schema";

interface CreateAccountInput {
  householdId: string;
  createdByUid: string;
  name: string;
  type: AccountType;
  /** Whether this account participates in the budget. Tracking accounts = false. */
  onBudget?: boolean;
  /** Starting balance in cents. Creates an initial "Starting Balance" txn. */
  startingBalanceCents?: Cents;
  sortOrder?: number;
}

/**
 * Create an account, optionally with an opening "Starting Balance" transaction
 * so the running balance is correct from day one. The starting-balance txn is
 * categorized to null (income/inflow); when on-budget, this means it counts
 * toward Ready to Assign exactly the same way as future income — which matches
 * YNAB's behavior.
 */
export async function createAccount(input: CreateAccountInput): Promise<AccountDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const onBudget = input.onBudget ?? !["tracking", "investment"].includes(input.type);
  const balanceCents = input.startingBalanceCents ?? 0;

  const accountRef = doc(db, "households", input.householdId, "accounts", id);
  const accountData: Omit<AccountDoc, "createdAt" | "updatedAt"> = {
    id,
    name: input.name.trim(),
    type: input.type,
    onBudget,
    closed: false,
    balanceCents,
    clearedBalanceCents: balanceCents,
    plaidItemId: null,
    bankSyncEnabled: false,
    sortOrder: input.sortOrder ?? Date.now(),
  };

  if (balanceCents !== 0) {
    const txnId = generateId();
    const txnRef = doc(db, "households", input.householdId, "transactions", txnId);
    const txnData: Omit<TransactionDoc, "createdAt" | "updatedAt"> = {
      id: txnId,
      accountId: id,
      date: todayISO(),
      amountCents: balanceCents,
      categoryId: null,
      payeeId: null,
      payeeName: "Starting Balance",
      memo: null,
      status: "cleared",
      transferTransactionId: null,
      transferAccountId: null,
      splits: null,
      source: "manual",
      plaidTransactionId: null,
      createdByUid: input.createdByUid,
    };
    const batch = writeBatch(db);
    batch.set(accountRef, { ...accountData, createdAt: ts, updatedAt: ts });
    batch.set(txnRef, { ...txnData, createdAt: ts, updatedAt: ts });
    await batch.commit();
  } else {
    await setDoc(accountRef, { ...accountData, createdAt: ts, updatedAt: ts });
  }

  return { ...accountData, createdAt: ts as any, updatedAt: ts as any };
}

/** Available account types in the order shown in the picker. */
export const ACCOUNT_TYPES: { value: AccountType; label: string; onBudget: boolean }[] = [
  { value: "checking", label: "Checking", onBudget: true },
  { value: "savings", label: "Savings", onBudget: true },
  { value: "cash", label: "Cash", onBudget: true },
  { value: "creditCard", label: "Credit Card", onBudget: true },
  { value: "lineOfCredit", label: "Line of Credit", onBudget: true },
  { value: "loan", label: "Loan", onBudget: false },
  { value: "mortgage", label: "Mortgage", onBudget: false },
  { value: "investment", label: "Investment", onBudget: false },
  { value: "tracking", label: "Other (tracking)", onBudget: false },
];

/** Use a fresh collection ref to discover sub-collection paths if needed. */
export function accountsCollection(householdId: string) {
  return collection(db, "households", householdId, "accounts");
}
