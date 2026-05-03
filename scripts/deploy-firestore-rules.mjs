// Deploy firestore.rules to the live Firebase project using the Security
// Rules REST API + service-account auth. Avoids the firebase-tools CLI
// (which requires serviceusage.services.get on the service account).
//
//   node scripts/deploy-firestore-rules.mjs
//
// Reads .firebase-admin-key.json for credentials and firestore.rules for the
// ruleset source. Creates a new Ruleset, then points the cloud.firestore
// Release at it. Old rulesets remain in the project history.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { GoogleAuth } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const KEY_PATH = resolve(ROOT, ".firebase-admin-key.json");
const RULES_PATH = resolve(ROOT, "firestore.rules");

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const projectId = serviceAccount.project_id;
const rulesSource = readFileSync(RULES_PATH, "utf8");

console.log(`[rules] project: ${projectId}`);
console.log(`[rules] source:  ${RULES_PATH} (${rulesSource.length} bytes)`);

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/firebase"],
});
const client = await auth.getClient();
const { token } = await client.getAccessToken();
if (!token) throw new Error("Failed to acquire access token");

// 1. Create a new ruleset.
const createUrl = `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`;
const createRes = await fetch(createUrl, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    source: {
      files: [{ name: "firestore.rules", content: rulesSource }],
    },
  }),
});
if (!createRes.ok) {
  const txt = await createRes.text();
  throw new Error(`Ruleset create failed (${createRes.status}): ${txt}`);
}
const ruleset = await createRes.json();
console.log(`[rules] created ruleset: ${ruleset.name}`);

// 2. Point the cloud.firestore release at the new ruleset.
const releaseName = `projects/${projectId}/releases/cloud.firestore`;
const updateUrl = `https://firebaserules.googleapis.com/v1/${releaseName}`;
const updateRes = await fetch(updateUrl, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    release: { name: releaseName, rulesetName: ruleset.name },
  }),
});
if (!updateRes.ok) {
  const txt = await updateRes.text();
  throw new Error(`Release update failed (${updateRes.status}): ${txt}`);
}
const release = await updateRes.json();
console.log(`[rules] release updated: ${release.name}`);
console.log(`[rules] DONE — rules live in production.`);
