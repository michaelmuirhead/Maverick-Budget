import { useMemo } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "@/lib/session";
import { useCollection } from "./useCollection";
import type {
  AccountDoc,
  CategoryDoc,
  CategoryGroupDoc,
  CategoryMonthDoc,
  TransactionDoc,
} from "@/types/schema";

// ── Mappers (module-level so identity is stable across renders) ─────────────

function mapAccount(id: string, data: any): AccountDoc {
  return { ...(data as AccountDoc), id };
}
function mapCategoryGroup(id: string, data: any): CategoryGroupDoc {
  return { ...(data as CategoryGroupDoc), id };
}
function mapCategory(id: string, data: any): CategoryDoc {
  return { ...(data as CategoryDoc), id };
}
function mapTransaction(id: string, data: any): TransactionDoc {
  return { ...(data as TransactionDoc), id };
}
function mapAssignment(_id: string, data: any): CategoryMonthDoc {
  // The doc ID is `${month}_${categoryId}` but both fields live in the doc body
  // already, so we ignore the ID here.
  return data as CategoryMonthDoc;
}

// ── Hooks ───────────────────────────────────────────────────────────────────

export function useAccounts() {
  const { household } = useSession();
  const q = useMemo(
    () =>
      query(
        collection(db, "households", household.id, "accounts"),
        orderBy("sortOrder", "asc"),
      ),
    [household.id],
  );
  return useCollection<AccountDoc>(q, mapAccount);
}

export function useCategoryGroups() {
  const { household } = useSession();
  const q = useMemo(
    () =>
      query(
        collection(db, "households", household.id, "categoryGroups"),
        orderBy("sortOrder", "asc"),
      ),
    [household.id],
  );
  return useCollection<CategoryGroupDoc>(q, mapCategoryGroup);
}

export function useCategories() {
  const { household } = useSession();
  const q = useMemo(
    () =>
      query(
        collection(db, "households", household.id, "categories"),
        orderBy("sortOrder", "asc"),
      ),
    [household.id],
  );
  return useCollection<CategoryDoc>(q, mapCategory);
}

/** All transactions ever, ordered by date desc. Fine for personal scale. */
export function useAllTransactions() {
  const { household } = useSession();
  const q = useMemo(
    () =>
      query(
        collection(db, "households", household.id, "transactions"),
        orderBy("date", "desc"),
      ),
    [household.id],
  );
  return useCollection<TransactionDoc>(q, mapTransaction);
}

/** Transactions for a single account, ordered by date desc. */
export function useAccountTransactions(accountId: string | null) {
  const { household } = useSession();
  const q = useMemo(() => {
    if (!accountId) return null;
    return query(
      collection(db, "households", household.id, "transactions"),
      where("accountId", "==", accountId),
      orderBy("date", "desc"),
    );
  }, [household.id, accountId]);
  return useCollection<TransactionDoc>(q, mapTransaction);
}

/**
 * All per-category, per-month assignments across the entire household, ever.
 * One subscription powers RTA + per-category rollover. For a personal budget
 * this stays small (≤ a few thousand docs after years of use).
 */
export function useAllCategoryMonths() {
  const { household } = useSession();
  const q = useMemo(
    () => collection(db, "households", household.id, "categoryMonths"),
    [household.id],
  );
  return useCollection<CategoryMonthDoc>(q, mapAssignment);
}
