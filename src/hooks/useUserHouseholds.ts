import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { HouseholdDoc } from "@/types/schema";

/**
 * Subscribe to every household where this user appears in `memberUids`.
 * Used by the household switcher and the "create another plan" flow.
 *
 * Note: this is a different query than `useAppState`'s single-household
 * subscription — that one watches the active household; this one watches
 * the full membership set.
 */
export function useUserHouseholds(uid: string): {
  loading: boolean;
  households: HouseholdDoc[];
  error: Error | null;
} {
  const [households, setHouseholds] = useState<HouseholdDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "households"),
      where("memberUids", "array-contains", uid),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => d.data() as HouseholdDoc);
        // Deterministic order: most recent first by createdAt.
        rows.sort((a, b) => {
          const aTime = (a.createdAt as any)?.toMillis?.() ?? 0;
          const bTime = (b.createdAt as any)?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        setHouseholds(rows);
        setLoading(false);
      },
      (err) => {
        console.error("[useUserHouseholds] error:", err);
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [uid]);

  return { loading, households, error };
}
