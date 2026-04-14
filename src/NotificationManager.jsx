import { useState, useEffect } from "react";
import { requestNotificationPermission, onForegroundMessage } from "./firebase";

export default function NotificationManager({ userId, householdId }) {
  const [toast, setToast] = useState(null);
  const [permissionState, setPermissionState] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  // Request permission on mount if not yet decided
  useEffect(() => {
    if (permissionState === "granted" && userId && householdId) {
      requestNotificationPermission(userId, householdId);
    }
  }, [userId, householdId, permissionState]);

  // Listen for foreground messages
  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      const title = payload.notification?.title || "Maverick Budget";
      const body = payload.notification?.body || "Budget updated";
      setToast({ title, body });
      setTimeout(() => setToast(null), 4000);
    });
    return unsub;
  }, []);

  const handleEnable = async () => {
    const token = await requestNotificationPermission(userId, householdId);
    if (token) {
      setPermissionState("granted");
    } else {
      setPermissionState(Notification.permission);
    }
  };

  return (
    <>
      {/* Permission prompt */}
      {permissionState === "default" && (
        <button
          onClick={handleEnable}
          style={{
            width: "100%",
            padding: "10px 16px",
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(99,102,241,0.08)",
            color: "#818cf8",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🔔</span>
          Enable notifications to see when your partner updates the budget
        </button>
      )}

      {/* Foreground toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 50,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 380,
            width: "90%",
            padding: "12px 16px",
            borderRadius: 14,
            background: "rgba(15, 22, 41, 0.95)",
            border: "1px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(20px)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
            {toast.title}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {toast.body}
          </div>
        </div>
      )}
    </>
  );
}
