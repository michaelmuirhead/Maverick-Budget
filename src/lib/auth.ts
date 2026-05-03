import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import type { UserDoc } from "@/types/schema";

/** Ensure a users/{uid} doc exists for the current Firebase Auth user. */
export async function ensureUserDoc(user: User): Promise<UserDoc> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserDoc;

  const fresh: Omit<UserDoc, "createdAt" | "updatedAt"> = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    activeHouseholdId: null,
  };
  await setDoc(ref, {
    ...fresh,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Re-read with the timestamps populated.
  const after = await getDoc(ref);
  return after.data() as UserDoc;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(auth);
}
