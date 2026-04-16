const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Default notification preferences — only new transactions ON by default
const DEFAULT_PREFS = {
  newTransaction: true,
  editTransaction: false,
  deleteTransaction: false,
  budgetUpdate: false,
  envelopeAlert: true,
};

// Check envelope thresholds and return alerts
// New model: envelopes[nodeId][categoryId] = { cap }
function checkEnvelopeAlerts(beforeData, afterData) {
  const envelopes = afterData?.envelopes || {};
  const entries = afterData?.entries || [];
  const beforeEntries = beforeData?.entries || [];
  const nodes = afterData?.nodes || [];
  const alerts = [];

  for (const [nodeId, catEnvs] of Object.entries(envelopes)) {
    if (!catEnvs || typeof catEnvs !== "object") continue;
    const node = nodes.find(n => n.id === nodeId);
    const nodeName = node ? node.name : "Budget";

    for (const [catId, env] of Object.entries(catEnvs)) {
      if (!env || !env.cap || env.cap <= 0) continue;
      const cap = env.cap;
      const spent = entries.filter(e => e.nodeId === nodeId && e.category === catId && e.type === "expense" && e.paid !== false)
        .reduce((s, e) => s + e.amount, 0);
      const pct = (spent / cap) * 100;

      const beforeSpent = beforeEntries.filter(e => e.nodeId === nodeId && e.category === catId && e.type === "expense" && e.paid !== false)
        .reduce((s, e) => s + e.amount, 0);
      const beforePct = cap > 0 ? (beforeSpent / cap) * 100 : 0;

      const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(spent);
      const capFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cap);
      const catLabel = catId.charAt(0).toUpperCase() + catId.slice(1);

      if (pct >= 100 && beforePct < 100) {
        alerts.push({ type: "envelopeAlert", message: `${catLabel} envelope in ${nodeName} exceeded: ${amount} of ${capFmt} (${Math.round(pct)}%)` });
      } else if (pct >= 80 && beforePct < 80) {
        alerts.push({ type: "envelopeAlert", message: `${catLabel} envelope in ${nodeName} at ${Math.round(pct)}%: ${amount} of ${capFmt}` });
      }
    }
  }
  return alerts;
}

// Determine what actually changed and whether it's notification-worthy
function classifyChange(beforeData, afterData) {
  const beforeEntries = beforeData?.entries || [];
  const afterEntries = afterData?.entries || [];

  // --- New entry added ---
  if (afterEntries.length > beforeEntries.length) {
    const beforeIds = new Set(beforeEntries.map((e) => e.id));
    const newEntry = afterEntries.find((e) => !beforeIds.has(e.id));
    // Filter out placeholder/intermediate writes: must have amount > 0 and a label
    if (!newEntry || !newEntry.amount || newEntry.amount <= 0) {
      return null; // Not a real entry yet — skip
    }
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(newEntry.amount);
    const verb = newEntry.type === "income" ? "added income" : "added expense";
    return {
      type: "newTransaction",
      message: `${verb}: ${newEntry.label || "Entry"} ${amount}`,
    };
  }

  // --- Entry deleted ---
  if (afterEntries.length < beforeEntries.length) {
    const afterIds = new Set(afterEntries.map((e) => e.id));
    const removed = beforeEntries.find((e) => !afterIds.has(e.id));
    // Only notify if the removed entry had a real amount
    if (!removed || !removed.amount || removed.amount <= 0) {
      return null;
    }
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(removed.amount);
    return {
      type: "deleteTransaction",
      message: `removed ${removed.label || "entry"} (${amount})`,
    };
  }

  // --- Entry edited (same count, but content changed) ---
  if (afterEntries.length === beforeEntries.length && afterEntries.length > 0) {
    const beforeMap = new Map(beforeEntries.map((e) => [e.id, e]));
    for (const after of afterEntries) {
      const before = beforeMap.get(after.id);
      if (!before) continue;
      // Check if amount or label changed on a real entry
      if (
        (before.amount !== after.amount || before.label !== after.label) &&
        after.amount > 0
      ) {
        const amount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(after.amount);
        return {
          type: "editTransaction",
          message: `edited ${after.label || "entry"} → ${amount}`,
        };
      }
    }
    // Nothing meaningful changed in entries — check if it's a structural/budget update
    const beforeNodes = beforeData?.nodes || [];
    const afterNodes = afterData?.nodes || [];
    if (JSON.stringify(beforeNodes) !== JSON.stringify(afterNodes)) {
      return { type: "budgetUpdate", message: "updated budget folders" };
    }
    // Limits changed
    if (JSON.stringify(beforeData?.limits) !== JSON.stringify(afterData?.limits)) {
      return { type: "budgetUpdate", message: "updated budget limits" };
    }
    return null; // No meaningful change
  }

  // Fallback — structural changes (nodes, limits, categories)
  const beforeNodes = beforeData?.nodes || [];
  const afterNodes = afterData?.nodes || [];
  if (
    JSON.stringify(beforeNodes) !== JSON.stringify(afterNodes) ||
    JSON.stringify(beforeData?.limits) !== JSON.stringify(afterData?.limits) ||
    JSON.stringify(beforeData?.customCategories) !==
      JSON.stringify(afterData?.customCategories)
  ) {
    return { type: "budgetUpdate", message: "updated the budget" };
  }

  return null; // Nothing worth notifying about
}

// Trigger when any household's budget data changes
exports.onBudgetUpdate = onDocumentWritten(
  "households/{householdId}/data/budget",
  async (event) => {
    const householdId = event.params.householdId;
    const afterData = event.data?.after?.data();
    if (!afterData) return;

    const beforeData = event.data?.before?.data();
    const updatedBy = afterData.updatedBy || "someone";

    // Classify the change — returns null if not notification-worthy
    const change = classifyChange(beforeData, afterData);
    const envelopeAlerts = checkEnvelopeAlerts(beforeData, afterData);

    if (!change && envelopeAlerts.length === 0) {
      console.log(`Skipping notification — no meaningful change for household ${householdId}`);
      return;
    }

    // Get the household doc to find all members
    const householdSnap = await db
      .collection("households")
      .doc(householdId)
      .get();
    if (!householdSnap.exists) return;

    const household = householdSnap.data();
    const members = household.members || [];

    // Get FCM tokens for all members EXCEPT the one who made the change
    // Also check each recipient's notification preferences
    const tokenEntries = [];
    for (const uid of members) {
      const tokenSnap = await db
        .collection("users")
        .doc(uid)
        .collection("tokens")
        .doc("fcm")
        .get();
      if (!tokenSnap.exists) continue;

      const tokenData = tokenSnap.data();
      if (!tokenData.token) continue;

      // Don't notify the person who made the change
      const profileSnap = await db
        .collection("users")
        .doc(uid)
        .collection("profile")
        .doc("main")
        .get();
      const email = profileSnap.exists ? profileSnap.data().email : null;
      if (email === updatedBy) continue;

      // Check notification preferences
      const prefsSnap = await db
        .collection("users")
        .doc(uid)
        .collection("settings")
        .doc("notifications")
        .get();
      const prefs = prefsSnap.exists
        ? { ...DEFAULT_PREFS, ...prefsSnap.data() }
        : DEFAULT_PREFS;

      // Only send if this change type is enabled for this recipient
      // For envelope alerts, always send (they're important threshold warnings)
      const hasChange = change && prefs[change.type];
      const hasEnvelopeAlert = envelopeAlerts.length > 0;
      if (!hasChange && !hasEnvelopeAlert) {
        console.log(`Skipping notification for ${uid} — disabled in preferences`);
        continue;
      }

      tokenEntries.push({ token: tokenData.token, uid, sendChange: hasChange, sendEnvelope: hasEnvelopeAlert });
    }

    if (tokenEntries.length === 0) {
      console.log(`No eligible recipients for household ${householdId}`);
      return;
    }

    // Send push to each device — may send multiple messages (change + envelope alert)
    const shortEmail = updatedBy.split("@")[0];
    const sendPromises = [];
    for (const entry of tokenEntries) {
      if (entry.sendChange && change) {
        sendPromises.push(
          messaging.send({
            token: entry.token,
            notification: {
              title: "Maverick Budget",
              body: `${shortEmail} ${change.message}`,
            },
            webpush: {
              fcmOptions: { link: "/" },
              notification: {
                icon: "/icon-192.png",
                badge: "/icon-192.png",
                tag: `maverick-${change.type}`,
                renotify: true,
              },
            },
          }).then(() => ({ uid: entry.uid, type: change.type }))
        );
      }
      if (entry.sendEnvelope) {
        for (const alert of envelopeAlerts) {
          sendPromises.push(
            messaging.send({
              token: entry.token,
              notification: {
                title: "Maverick Budget — Envelope Alert",
                body: alert.message,
              },
              webpush: {
                fcmOptions: { link: "/" },
                notification: {
                  icon: "/icon-192.png",
                  badge: "/icon-192.png",
                  tag: "maverick-envelopeAlert",
                  renotify: true,
                },
              },
            }).then(() => ({ uid: entry.uid, type: "envelopeAlert" }))
          );
        }
      }
    }
    const results = await Promise.allSettled(sendPromises);

    // Clean up any invalid tokens
    const staleUids = new Set();
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "rejected") {
        const err = results[i].reason;
        if (
          err?.code === "messaging/registration-token-not-registered" ||
          err?.code === "messaging/invalid-registration-token"
        ) {
          // Find which tokenEntry this corresponds to
          const entry = tokenEntries.find(te => !staleUids.has(te.uid));
          if (entry) {
            staleUids.add(entry.uid);
            console.log("Removing invalid token for member:", entry.uid);
            await db
              .collection("users")
              .doc(entry.uid)
              .collection("tokens")
              .doc("fcm")
              .delete()
              .catch((e) => console.error("Token cleanup failed:", e));
          }
        }
      }
    }

    console.log(
      `Sent ${results.filter((r) => r.status === "fulfilled").length} notifications for household ${householdId}`
    );
  }
);
