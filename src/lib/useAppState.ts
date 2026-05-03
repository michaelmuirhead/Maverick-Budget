import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { ensureUserDoc } from "./auth";
import type { HouseholdDoc, UserDoc } from "@/types/schema";

export type AppState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "needsHousehold"; user: User; userDoc: UserDoc }
  | {
      status: "ready";
      user: User;
      userDoc: UserDoc;
      household: HouseholdDoc;
    };

/**
 * Top-level state machine driven by:
 *   1. onAuthStateChanged → User | null
 *   2. users/{uid} snapshot → UserDoc (gives activeHouseholdId)
 *   3. households/{activeHouseholdId} snapshot → HouseholdDoc
 *
 * Each layer subscribes only when the previous one resolves; switching users
 * or households tears down and re-creates the inner subscriptions.
 */
export function useAppState(): AppState {
  const [state, setState] = useState<AppState>({ status: "loading" });

  useEffect(() => {
    let userDocUnsub: (() => void) | null = null;
    let householdUnsub: (() => void) | null = null;

    const teardownInner = () => {
      if (userDocUnsub) {
        userDocUnsub();
        userDocUnsub = null;
      }
      if (householdUnsub) {
        householdUnsub();
        householdUnsub = null;
      }
    };

    const authUnsub = onAuthStateChanged(auth, async (user) => {
      teardownInner();

      if (!user) {
        setState({ status: "signedOut" });
        return;
      }

      // Make sure the users/{uid} doc exists. Safe on every sign-in.
      try {
        await ensureUserDoc(user);
      } catch (e) {
        console.error("[useAppState] ensureUserDoc failed:", e);
      }

      userDocUnsub = onSnapshot(
        doc(db, "users", user.uid),
        (userSnap) => {
          if (!userSnap.exists()) {
            // Race: doc still being created. Stay loading; the snapshot will fire again.
            return;
          }
          const userDoc = userSnap.data() as UserDoc;

          if (!userDoc.activeHouseholdId) {
            if (householdUnsub) {
              householdUnsub();
              householdUnsub = null;
            }
            setState({ status: "needsHousehold", user, userDoc });
            return;
          }

          // Subscribe to the household doc.
          if (householdUnsub) householdUnsub();
          householdUnsub = onSnapshot(
            doc(db, "households", userDoc.activeHouseholdId),
            (hhSnap) => {
              if (!hhSnap.exists()) {
                // Household was deleted out from under us. Drop back to onboarding.
                setState({ status: "needsHousehold", user, userDoc });
                return;
              }
              setState({
                status: "ready",
                user,
                userDoc,
                household: hhSnap.data() as HouseholdDoc,
              });
            },
            (err) => {
              console.error("[useAppState] household snapshot error:", err);
            },
          );
        },
        (err) => {
          console.error("[useAppState] user snapshot error:", err);
        },
      );
    });

    return () => {
      authUnsub();
      teardownInner();
    };
  }, []);

  return state;
}
