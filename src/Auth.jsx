import { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "./firebase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Email and password required"); return; }
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      const msg = e.code?.replace("auth/", "").replace(/-/g, " ") || "Something went wrong";
      setError(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed");
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "12px 16px", color: "#e2e8f0", fontSize: 16, outline: "none",
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",
      color: "#e2e8f0", minHeight: "100vh", maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{
          fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Maverick</h1>
        <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 }}>Budget</span>
      </div>

      {/* Form card */}
      <div style={{
        width: "100%",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 24px",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "#e2e8f0" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" autoComplete="email"
            style={inputStyle}
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" autoComplete={mode === "signup" ? "new-password" : "current-password"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />

          {error && (
            <div style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{
              padding: "13px 0", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
              fontSize: 15, fontWeight: 600, letterSpacing: "0.02em",
              background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff",
              opacity: loading ? 0.6 : 1, transition: "opacity 0.2s",
            }}>
            {loading ? "..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "#475569" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <button onClick={handleGoogle} disabled={loading}
            style={{
              padding: "12px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
              cursor: loading ? "wait" : "pointer", fontSize: 14, fontWeight: 600,
              background: "rgba(255,255,255,0.03)", color: "#e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
