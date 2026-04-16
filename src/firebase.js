import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD_VgKQLA6tLLYDd4wRU5PR4c9DxEdQdUk",
  authDomain: "maverick-budget.firebaseapp.com",
  projectId: "maverick-budget",
  storageBucket: "maverick-budget.firebasestorage.app",
  messagingSenderId: "891091568658",
  appId: "1:891091568658:web:5eac14e5ea7945316cb0cb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// FCM — may fail on iOS Safari or if permission denied
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.log("FCM not supported in this browser");
}
export { messaging };

// Request notification permission and get FCM token
export async function requestNotificationPermission(userId, householdId) {
  console.log("[FCM] requestNotificationPermission called", { userId, householdId, messagingAvailable: !!messaging });
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    console.log("[FCM] Permission result:", permission);
    if (permission !== "granted") return null;

    // Get FCM token — uses the service worker for push
    // Wait for the service worker to be ready (not just registered) to avoid race condition
    const swRegistration = await navigator.serviceWorker.ready;
    console.log("[FCM] Service worker ready:", swRegistration.active?.scriptURL);
    const token = await getToken(messaging, {
      vapidKey: "BAl2XBpMegRmgKa-2pTLnydrY7bozRL8geULzkp8IL7RbAHrWuTo7HJ7ukgEBsch7TC5gg7pHkK-nqT0A2oQPtg",
      serviceWorkerRegistration: swRegistration,
    });
    console.log("[FCM] Token received:", token ? token.slice(0, 20) + "..." : "null");

    if (token) {
      // Store token in Firestore so Cloud Functions can send to this device
      const tokenDocPath = `users/${userId}/tokens/fcm`;
      console.log("[FCM] Saving token to Firestore at:", tokenDocPath);
      await setDoc(doc(db, "users", userId, "tokens", "fcm"), {
        token,
        householdId,
        updatedAt: new Date().toISOString(),
      });
      console.log("[FCM] Token saved successfully");
    }

    return token;
  } catch (e) {
    console.error("[FCM] Token error:", e);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}

// ── Notification Preferences ──
const DEFAULT_NOTIFICATION_PREFS = {
  newTransaction: true,
  editTransaction: false,
  deleteTransaction: false,
  budgetUpdate: false,
  envelopeAlert: true,
};

export async function getNotificationPrefs(userId) {
  try {
    const snap = await getDoc(doc(db, "users", userId, "settings", "notifications"));
    return snap.exists() ? { ...DEFAULT_NOTIFICATION_PREFS, ...snap.data() } : { ...DEFAULT_NOTIFICATION_PREFS };
  } catch (e) {
    console.error("Error loading notification prefs:", e);
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export async function setNotificationPrefs(userId, prefs) {
  try {
    await setDoc(doc(db, "users", userId, "settings", "notifications"), prefs);
  } catch (e) {
    console.error("Error saving notification prefs:", e);
  }
}

export { DEFAULT_NOTIFICATION_PREFS };

// ── Display Preferences (per-user chart toggles) ──
const DEFAULT_DISPLAY_PREFS = {
  monthlyTrends: true,
  yearInReview: true,
  categoryBreakdown: true,
  budgetVsActual: true,
};

export async function getDisplayPrefs(userId) {
  try {
    const snap = await getDoc(doc(db, "users", userId, "settings", "display"));
    return snap.exists() ? { ...DEFAULT_DISPLAY_PREFS, ...snap.data() } : { ...DEFAULT_DISPLAY_PREFS };
  } catch (e) {
    console.error("Error loading display prefs:", e);
    return { ...DEFAULT_DISPLAY_PREFS };
  }
}

export async function setDisplayPrefs(userId, prefs) {
  try {
    await setDoc(doc(db, "users", userId, "settings", "display"), prefs);
  } catch (e) {
    console.error("Error saving display prefs:", e);
  }
}

export { DEFAULT_DISPLAY_PREFS };

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  getToken,
};
