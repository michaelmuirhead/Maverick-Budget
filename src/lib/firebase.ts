import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_VgKQLA6tLLYDd4wRU5PR4c9DxEdQdUk",
  authDomain: "maverick-budget.firebaseapp.com",
  projectId: "maverick-budget",
  storageBucket: "maverick-budget.firebasestorage.app",
  messagingSenderId: "891091568658",
  appId: "1:891091568658:web:5eac14e5ea7945316cb0cb",
} as const;

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// IndexedDB-backed Firestore cache. Writes queue while offline and replay on
// reconnect; multi-tab manager keeps the cache coherent across browser tabs
// (relevant for desktop, harmless on iOS).
export const db: Firestore = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (e) {
    console.warn(
      "[firestore] persistent cache unavailable, falling back to memory:",
      e instanceof Error ? e.message : e,
    );
    return initializeFirestore(app, {});
  }
})();
