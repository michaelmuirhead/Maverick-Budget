import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateId } from "./ids";
import type { CategoryDoc, CategoryGroupDoc } from "@/types/schema";

interface CreateGroupInput {
  householdId: string;
  name: string;
  sortOrder?: number;
}

export async function createCategoryGroup(
  input: CreateGroupInput,
): Promise<CategoryGroupDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const data: Omit<CategoryGroupDoc, "createdAt" | "updatedAt"> = {
    id,
    name: input.name.trim(),
    sortOrder: input.sortOrder ?? Date.now(),
    hidden: false,
  };
  await setDoc(doc(db, "households", input.householdId, "categoryGroups", id), {
    ...data,
    createdAt: ts,
    updatedAt: ts,
  });
  return { ...data, createdAt: ts as any, updatedAt: ts as any };
}

interface CreateCategoryInput {
  householdId: string;
  groupId: string;
  name: string;
  sortOrder?: number;
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryDoc> {
  const id = generateId();
  const ts = serverTimestamp();
  const data: Omit<CategoryDoc, "createdAt" | "updatedAt"> = {
    id,
    groupId: input.groupId,
    name: input.name.trim(),
    sortOrder: input.sortOrder ?? Date.now(),
    hidden: false,
    goal: null,
    note: null,
  };
  await setDoc(doc(db, "households", input.householdId, "categories", id), {
    ...data,
    createdAt: ts,
    updatedAt: ts,
  });
  return { ...data, createdAt: ts as any, updatedAt: ts as any };
}

// ── Edits ───────────────────────────────────────────────────────────────────

export async function updateCategoryGroup(
  householdId: string,
  groupId: string,
  patch: { name?: string; hidden?: boolean },
): Promise<void> {
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.name !== undefined) data.name = patch.name.trim();
  if (patch.hidden !== undefined) data.hidden = patch.hidden;
  await updateDoc(doc(db, "households", householdId, "categoryGroups", groupId), data);
}

export class GroupNotEmptyError extends Error {
  constructor(public categoryCount: number) {
    super(
      `This group has ${categoryCount} categor${categoryCount === 1 ? "y" : "ies"}. Move or delete them first.`,
    );
    this.name = "GroupNotEmptyError";
  }
}

/** Hard-delete the group. Refuses if any categories still belong to it. */
export async function deleteCategoryGroup(
  householdId: string,
  groupId: string,
): Promise<void> {
  const catSnap = await getDocs(
    query(
      collection(db, "households", householdId, "categories"),
      where("groupId", "==", groupId),
    ),
  );
  if (!catSnap.empty) {
    throw new GroupNotEmptyError(catSnap.size);
  }
  await deleteDoc(doc(db, "households", householdId, "categoryGroups", groupId));
}

export async function updateCategory(
  householdId: string,
  categoryId: string,
  patch: {
    name?: string;
    hidden?: boolean;
    note?: string | null;
    goal?: import("@/types/schema").CategoryGoal | null;
  },
): Promise<void> {
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.name !== undefined) data.name = patch.name.trim();
  if (patch.hidden !== undefined) data.hidden = patch.hidden;
  if (patch.note !== undefined) data.note = patch.note;
  if (patch.goal !== undefined) data.goal = patch.goal;
  await updateDoc(doc(db, "households", householdId, "categories", categoryId), data);
}

export class CategoryInUseError extends Error {
  constructor(public transactionCount: number) {
    super(
      `${transactionCount} transaction${transactionCount === 1 ? "" : "s"} use this category. Hide it instead, or recategorize them first.`,
    );
    this.name = "CategoryInUseError";
  }
}

/**
 * Hard-delete a category. Refuses if any transactions reference it. The
 * preferred soft action is `updateCategory(... { hidden: true })`.
 */
export async function deleteCategory(
  householdId: string,
  categoryId: string,
): Promise<void> {
  const txnSnap = await getDocs(
    query(
      collection(db, "households", householdId, "transactions"),
      where("categoryId", "==", categoryId),
    ),
  );
  if (!txnSnap.empty) {
    throw new CategoryInUseError(txnSnap.size);
  }
  await deleteDoc(doc(db, "households", householdId, "categories", categoryId));
  // Note: any categoryMonths/{m_categoryId} docs become orphaned. They're
  // ignored by the budget UI (no matching category) and harmless. We can
  // sweep them in a Cloud Function later.
}

// ── Reorder ─────────────────────────────────────────────────────────────────

/**
 * Rewrite sortOrder for an ordered list of category IDs. Sets
 * sortOrder = (index + 1) × 1000 so re-orders only need full passes when the
 * user actually drags. Uses a single batched write.
 */
export async function reorderCategories(
  householdId: string,
  orderedIds: string[],
): Promise<void> {
  const { writeBatch } = await import("firebase/firestore");
  const batch = writeBatch(db);
  const ts = serverTimestamp();
  orderedIds.forEach((id, i) => {
    batch.update(doc(db, "households", householdId, "categories", id), {
      sortOrder: (i + 1) * 1000,
      updatedAt: ts,
    });
  });
  await batch.commit();
}

export async function reorderCategoryGroups(
  householdId: string,
  orderedIds: string[],
): Promise<void> {
  const { writeBatch } = await import("firebase/firestore");
  const batch = writeBatch(db);
  const ts = serverTimestamp();
  orderedIds.forEach((id, i) => {
    batch.update(doc(db, "households", householdId, "categoryGroups", id), {
      sortOrder: (i + 1) * 1000,
      updatedAt: ts,
    });
  });
  await batch.commit();
}
