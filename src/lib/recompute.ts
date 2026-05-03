import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

/**
 * Trigger a server-side recompute of every cached value (account balances,
 * budget month summaries) for the household. Use after a CSV import, after a
 * manual Firestore edit, or any time the cache feels suspect.
 */
export async function recomputeHousehold(householdId: string): Promise<{
  accounts: number;
  transactions: number;
  months: number;
}> {
  const fn = httpsCallable<
    { householdId: string },
    { accounts: number; transactions: number; months: number }
  >(functions, "recomputeHousehold");
  const res = await fn({ householdId });
  return res.data;
}
