import { useState } from "react";
import { db, auth, signOut, doc, setDoc, getDoc } from "./firebase";

// Generate a 6-char uppercase code
function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function HouseholdSetup({ user, onReady }) {
  const [mode, setMode] = useState(null); // null | create | join
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true); setError("");
    try {
      // Generate unique code, check it doesn't already exist
      let hCode = makeCode();
      let attempts = 0;
      while (attempts < 5) {
        const snap = await getDoc(doc(db, "households", hCode));
        if (!snap.exists()) break;
        hCode = makeCode();
        attempts++;
      }

      // Create household doc
      await setDoc(doc(db, "households", hCode), {
        ownerUid: user.uid,
        ownerEmail: user.email,
        members: [user.uid],
        memberEmails: [user.email],
        createdAt: new Date().toISOString(),
      });

      // Set user profile
      await setDoc(doc(db, "users", user.uid, "profile", "main"), {
        householdId: hCode,
        email: user.email,
        joinedAt: new Date().toISOString(),
      });

      onReady(hCode);
    } catch (e) {
      console.error(e);
      setError("Failed to create household. Check Firestore rules.");
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    const c = code.trim().toUpperCase();
    if (c.length !== 6) { setError("Enter a 6-character code"); return; }
    setLoading(true); setError("");
    try {
      const hRef = doc(db, "households", c);
      const snap = await getDoc(hRef);
      if (!snap.exists()) { setError("Household not found. Check the code."); setLoading(false); return; }

      const data = snap.data();
      if (data.members?.includes(user.uid)) {
        // Already a member, just proceed
        await setDoc(doc(db, "users", user.uid, "profile", "main"), {
          householdId: c, email: user.email, joinedAt: new Date().toISOString(),
        });
        onReady(c);
        setLoading(false);
        return;
      }

      // Add user to household
      await setDoc(hRef, {
        ...data,
        members: [...(data.members || []), user.uid],
        memberEmails: [...(data.memberEmails || []), user.email],
      });

      // Set user profile
      await setDoc(doc(db, "users", user.uid, "profile", "main"), {
        householdId: c, email: user.email, joinedAt: new Date().toISOString(),
      });

      onReady(c);
    } catch (e) {
      console.error(e);
      setError("Failed to join. Check your connection and Firestore rules.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "12px 16px", color: "#e2e8f0", fontSize: 16, outline: "none",
  };

  const btnPrimary = {
    padding: "13px 0", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
    fontSize: 15, fontWeight: 600, width: "100%",
    background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff",
    opacity: loading ? 0.6 : 1,
  };

  const btnSecondary = {
    padding: "13px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer", fontSize: 15, fontWeight: 600, width: "100%",
    background: "rgba(255,255,255,0.03)", color: "#e2e8f0",
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",
      color: "#e2e8f0", minHeight: "100vh", maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      overflowY: "auto", WebkitOverflowScrolling: "touch",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
        <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 }}>Budget</span>
      </div>

      <div style={{
        width: "100%", background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 24px",
      }}>
        {mode === null && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Set up your household</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px", lineHeight: 1.5 }}>
              Create a household to start budgeting, or join an existing one with an invite code from your partner.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setMode("create")} style={btnPrimary}>Create New Household</button>
              <button onClick={() => setMode("join")} style={btnSecondary}>Join with Invite Code</button>
            </div>
          </>
        )}

        {mode === "create" && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Create household</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>
              This will create a new shared budget space. You'll get an invite code to share with your partner.
            </p>
            {error && <div style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>{error}</div>}
            <button onClick={handleCreate} disabled={loading} style={btnPrimary}>
              {loading ? "Creating..." : "Create Household"}
            </button>
            <button onClick={() => { setMode(null); setError(""); }} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 16, display: "block", width: "100%", textAlign: "center" }}>← Back</button>
          </>
        )}

        {mode === "join" && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Join household</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>
              Enter the 6-character invite code from your partner.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                value={code} onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="INVITE CODE" maxLength={6}
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.3em", fontSize: 20, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              />
              {error && <div style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8 }}>{error}</div>}
              <button onClick={handleJoin} disabled={loading || code.length !== 6} style={{ ...btnPrimary, opacity: loading || code.length !== 6 ? 0.4 : 1 }}>
                {loading ? "Joining..." : "Join Household"}
              </button>
            </div>
            <button onClick={() => { setMode(null); setError(""); setCode(""); }} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 16, display: "block", width: "100%", textAlign: "center" }}>← Back</button>
          </>
        )}
      </div>

      <button onClick={() => { if (confirm("Sign out?")) signOut(auth); }}
        style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, marginTop: 20 }}>
        Signed in as {user.email} · Sign out
      </button>
    </div>
  );
}
