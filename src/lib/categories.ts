import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
