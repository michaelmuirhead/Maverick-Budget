// One-off Firestore wipe for the maverick-budget Firebase project.
// Deletes every document under every top-level collection so the new
// schema starts clean. Does NOT touch Auth, Functions, Hosting, or Storage.
//
// Run from the project root:
//   node scripts/wipe-firestore.mjs --confirm
//
// Without --confirm it does a dry run and reports what *would* be deleted.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = resolve(__dirname, "..", ".firebase-admin-key.json");
const CONFIRM = process.argv.includes("--confirm");

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

console.log(`[wipe] project: ${serviceAccount.project_id}`);
console.log(`[wipe] mode:    ${CONFIRM ? "DELETE (irreversible)" : "DRY RUN"}`);
console.log("");

async function deleteCollectionRecursive(colRef, depth = 0) {
  const indent = "  ".repeat(depth);
  let totalDocs = 0;
  let totalSubcolDocs = 0;

  // Stream in batches to avoid memory blow-ups on large collections.
  const BATCH = 200;
  let lastDoc = null;
  while (true) {
    let q = colRef.orderBy("__name__").limit(BATCH);
    if (lastDoc) q = q.startAfter(lastDoc);
    const snap = await q.get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      // Recurse into subcollections first.
      const subcols = await doc.ref.listCollections();
      for (const sub of subcols) {
        const subCount = await deleteCollectionRecursive(sub, depth + 1);
        totalSubcolDocs += subCount;
      }
      if (CONFIRM) {
        await doc.ref.delete();
      }
      totalDocs += 1;
    }
    console.log(`${indent}[${colRef.path}] processed ${totalDocs} docs so far...`);
    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < BATCH) break;
  }

  console.log(`${indent}[${colRef.path}] ${CONFIRM ? "deleted" : "would delete"} ${totalDocs} docs (+${totalSubcolDocs} in subcollections)`);
  return totalDocs + totalSubcolDocs;
}

const topCollections = await db.listCollections();
if (topCollections.length === 0) {
  console.log("[wipe] no top-level collections found — Firestore is already empty.");
  process.exit(0);
}

console.log(`[wipe] top-level collections found: ${topCollections.map(c => c.id).join(", ")}`);
console.log("");

let grandTotal = 0;
for (const col of topCollections) {
  const count = await deleteCollectionRecursive(col);
  grandTotal += count;
}

console.log("");
console.log(`[wipe] ${CONFIRM ? "DELETED" : "WOULD DELETE"} ${grandTotal} documents total.`);
if (!CONFIRM) {
  console.log("[wipe] re-run with --confirm to actually delete.");
}
process.exit(0);
