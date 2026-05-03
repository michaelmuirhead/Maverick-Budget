import { useEffect, useState } from "react";
import {
  onSnapshot,
  type Query,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";

export type CollectionState<T> =
  | { status: "loading"; data: T[] }
  | { status: "ready"; data: T[] }
  | { status: "error"; error: Error; data: T[] };

/**
 * Subscribe to a Firestore query and re-render with the typed result set.
 * Pass `null` as the query to skip subscribing (e.g., before household loads).
 */
export function useCollection<T>(
  query: Query<DocumentData> | null,
  mapDoc: (id: string, data: DocumentData) => T,
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    status: "loading",
    data: [],
  });

  useEffect(() => {
    if (!query) {
      setState({ status: "loading", data: [] });
      return;
    }
    setState((prev) => ({ ...prev, status: "loading" }));
    const unsub = onSnapshot(
      query,
      (snap: QuerySnapshot) => {
        const data = snap.docs.map((d) => mapDoc(d.id, d.data()));
        setState({ status: "ready", data });
      },
      (err) => {
        console.error("[useCollection] error:", err);
        setState((prev) => ({ status: "error", error: err, data: prev.data }));
      },
    );
    return unsub;
    // We deliberately omit `mapDoc` from deps — callers should keep it stable
    // (defined module-level or via useCallback). Including it would re-subscribe
    // every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return state;
}
