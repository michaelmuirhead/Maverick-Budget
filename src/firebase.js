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
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    // Get FCM token — uses the service worker for push
    const token = await getToken(messaging, {
      vapidKey: "BAl2XBpMegRmgKa-2pTLnydrY7bozRL8geULzkp8IL7RbAHrWuTo7HJ7ukgEBsch7TC5gg7pHkK-nqT0A2oQPtg",
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
    });

    if (token) {
      // Store token in Firestore so Cloud Functions can send to this device
      await setDoc(doc(db, "users", userId, "tokens", "fcm"), {
        token,
        householdId,
        updatedAt: new Date().toISOString(),
      });
    }

    return token;
  } catch (e) {
    console.error("FCM token error:", e);
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
