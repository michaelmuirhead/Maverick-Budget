import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type FieldValue,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateId, generateJoinCode } from "./ids";
import type {
  CurrencyPlacement,
  DateFormat,
  HouseholdDoc,
  HouseholdMemberDoc,
  NumberFormat,
} from "@/types/schema";

interface CreateHouseholdInput {
  name: string;
  ownerUid: string;
  ownerDisplayName: string | null;
  ownerEmail: string | null;
  ownerPhotoURL: string | null;
  /** Defaults to USD. */
  currency?: string;
  /** Defaults to "before". */
  currencyPlacement?: CurrencyPlacement;
  /** Defaults to "1,234.56". */
  numberFormat?: NumberFormat;
  /** Defaults to "MM/DD/YYYY". */
  dateFormat?: DateFormat;
  /** Defaults to detected browser timezone, or America/Chicago as fallback. */
  timezone?: string;
}

/**
 * Two-phase create. We can't put all four writes in one batch because rules
 * for `members/{uid}`, `joinCodes/{code}`, and `users/{uid}.activeHouseholdId`
 * would each `get()` the household — and Firestore evaluates rules against the
 * database state *before* the batch runs, so the household wouldn't exist yet.
 *
 *   Phase 1 (single write): create households/{id}
 *   Phase 2 (batched):      create members/{ownerUid}
 *                           create joinCodes/{code}
 *                           update users/{ownerUid}.activeHouseholdId
 *
 * If phase 2 fails partway, the household is orphaned but harmless — the
 * user can retry and we'll clean up via a Cloud Function later.
 */
export async function createHousehold(input: CreateHouseholdInput): Promise<HouseholdDoc> {
  const id = generateId();
  const code = generateJoinCode();
  const tz = input.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "America/Chicago";
  const currency = input.currency ?? "USD";

  const householdRef = doc(db, "households", id);
  const memberRef = doc(db, "households", id, "members", input.ownerUid);
  const joinRef = doc(db, "joinCodes", code);
  const userRef = doc(db, "users", input.ownerUid);

  const ts: FieldValue = serverTimestamp();

  const householdData: Omit<HouseholdDoc, "createdAt" | "updatedAt"> = {
    id,
    name: input.name.trim(),
    joinCode: code,
    ownerUid: input.ownerUid,
    memberUids: [input.ownerUid],
    currency,
    currencyPlacement: input.currencyPlacement ?? "before",
    numberFormat: input.numberFormat ?? "1,234.56",
    dateFormat: input.dateFormat ?? "MM/DD/YYYY",
    timezone: tz,
    weekStartsOn: 1, // Monday — YNAB default.
  };

  const memberData: Omit<HouseholdMemberDoc, "joinedAt"> = {
    uid: input.ownerUid,
    role: "owner",
    displayName: input.ownerDisplayName,
    email: input.ownerEmail,
    photoURL: input.ownerPhotoURL,
  };

  // Phase 1 — household exists after this awaits.
  await setDoc(householdRef, { ...householdData, createdAt: ts, updatedAt: ts });

  // Phase 2 — dependent writes that need the household to exist for rule eval.
  const batch = writeBatch(db);
  batch.set(memberRef, { ...memberData, joinedAt: ts });
  batch.set(joinRef, { householdId: id });
  batch.set(userRef, { activeHouseholdId: id, updatedAt: ts }, { merge: true });
  await batch.commit();

  const snap = await getDoc(householdRef);
  return snap.data() as HouseholdDoc;
}

/**
 * Switch which household this user is actively viewing. The auth + household
 * state machine in useAppState picks up the change via the users/{uid}
 * snapshot listener and re-routes.
 */
export async function setActiveHousehold(
  uid: string,
  householdId: string,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    activeHouseholdId: householdId,
    updatedAt: serverTimestamp(),
  });
}

export class JoinCodeNotFoundError extends Error {
  constructor() {
    super("Join code not found. Double-check the code and try again.");
    this.name = "JoinCodeNotFoundError";
  }
}

export class AlreadyMemberError extends Error {
  constructor() {
    super("You're already a member of this household.");
    this.name = "AlreadyMemberError";
  }
}

interface JoinHouseholdInput {
  code: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

/**
 * Resolve the join code, then:
 *   1. Add uid to households/{id}.memberUids (rule allows isJoiningSelf())
 *   2. Create households/{id}/members/{uid}
 *   3. Set users/{uid}.activeHouseholdId
 */
export async function joinHouseholdByCode(input: JoinHouseholdInput): Promise<HouseholdDoc> {
  const cleanCode = input.code.trim().toUpperCase();
  const joinSnap = await getDoc(doc(db, "joinCodes", cleanCode));
  if (!joinSnap.exists()) throw new JoinCodeNotFoundError();
  const householdId = (joinSnap.data() as { householdId: string }).householdId;

  const householdRef = doc(db, "households", householdId);
  const householdSnap = await getDoc(householdRef);
  if (!householdSnap.exists()) throw new JoinCodeNotFoundError();
  const household = householdSnap.data() as HouseholdDoc;

  if (household.memberUids.includes(input.uid)) {
    throw new AlreadyMemberError();
  }

  const memberRef = doc(db, "households", householdId, "members", input.uid);
  const userRef = doc(db, "users", input.uid);
  const ts = serverTimestamp();

  // Two writes — can't batch because the household update has a special rule
  // (isJoiningSelf) that requires it to be a single-doc update.
  await updateDoc(householdRef, {
    memberUids: arrayUnion(input.uid),
    updatedAt: ts,
  });

  const memberData: Omit<HouseholdMemberDoc, "joinedAt"> = {
    uid: input.uid,
    role: "member",
    displayName: input.displayName,
    email: input.email,
    photoURL: input.photoURL,
  };

  // Now that we're a member, we can write under the household's sub-collections.
  const batch = writeBatch(db);
  batch.set(memberRef, { ...memberData, joinedAt: ts });
  batch.set(userRef, { activeHouseholdId: householdId, updatedAt: ts }, { merge: true });
  await batch.commit();

  const after = await getDoc(householdRef);
  return after.data() as HouseholdDoc;
}
