const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Trigger when any household's budget data changes
exports.onBudgetUpdate = onDocumentWritten(
  "households/{householdId}/data/budget",
  async (event) => {
    const householdId = event.params.householdId;
    const afterData = event.data?.after?.data();
    if (!afterData) return;

    const updatedBy = afterData.updatedBy || "someone";

    // Figure out what changed by comparing before/after entry counts
    const beforeData = event.data?.before?.data();
    const beforeEntries = beforeData?.entries || [];
    const afterEntries = afterData.entries || [];

    let message = "Budget updated";

    if (afterEntries.length > beforeEntries.length) {
      // New entry added — find it
      const beforeIds = new Set(beforeEntries.map((e) => e.id));
      const newEntry = afterEntries.find((e) => !beforeIds.has(e.id));
      if (newEntry) {
        const amount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(newEntry.amount);
        const verb = newEntry.type === "income" ? "added income" : "added expense";
        message = `${verb}: ${newEntry.label || "Entry"} ${amount}`;
      }
    } else if (afterEntries.length < beforeEntries.length) {
      message = "Removed a transaction";
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
    // Track {token, uid} pairs so we can clean up the right user's token on failure
    const tokenEntries = [];
    for (const uid of members) {
      const tokenSnap = await db
        .collection("users")
        .doc(uid)
        .collection("tokens")
        .doc("fcm")
        .get();
      if (tokenSnap.exists) {
        const tokenData = tokenSnap.data();
        // Don't notify the person who made the change
        // We match by email since that's what updatedBy stores
        const profileSnap = await db
          .collection("users")
          .doc(uid)
          .collection("profile")
          .doc("main")
          .get();
        const email = profileSnap.exists ? profileSnap.data().email : null;
        if (email !== updatedBy && tokenData.token) {
          tokenEntries.push({ token: tokenData.token, uid });
        }
      }
    }

    if (tokenEntries.length === 0) return;

    // Send push to each device
    const shortEmail = updatedBy.split("@")[0];
    const results = await Promise.allSettled(
      tokenEntries.map(({ token }) =>
        messaging.send({
          token,
          notification: {
            title: `Maverick Budget`,
            body: `${shortEmail} ${message}`,
          },
          webpush: {
            fcmOptions: {
              link: "/",
            },
            notification: {
              icon: "/icon-192.png",
              badge: "/icon-192.png",
              tag: "maverick-update",
              renotify: true,
            },
          },
        })
      )
    );

    // Clean up any invalid tokens — use the correct UID for each result
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "rejected") {
        const err = results[i].reason;
        if (
          err?.code === "messaging/registration-token-not-registered" ||
          err?.code === "messaging/invalid-registration-token"
        ) {
          const staleUid = tokenEntries[i].uid;
          console.log("Removing invalid token for member:", staleUid);
          await db
            .collection("users")
            .doc(staleUid)
            .collection("tokens")
            .doc("fcm")
            .delete()
            .catch((e) => console.error("Token cleanup failed:", e));
        }
      }
    }

    console.log(
      `Sent ${results.filter((r) => r.status === "fulfilled").length} notifications for household ${householdId}`
    );
  }
);
