import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Auth from './Auth';
import HouseholdSetup from './HouseholdSetup';
import { auth, db, onAuthStateChanged, doc, getDoc } from './firebase';
import './index.css';

function Root() {
  const [user, setUser] = useState(undefined); // undefined=loading, null=not logged in
  const [householdId, setHouseholdId] = useState(undefined); // undefined=loading, null=needs setup

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (!u) setHouseholdId(undefined);
    });
    return unsub;
  }, []);

  // Once we have a user, check if they have a household
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const profSnap = await getDoc(doc(db, "users", user.uid, "profile", "main"));
        if (cancelled) return;
        if (profSnap.exists() && profSnap.data().householdId) {
          setHouseholdId(profSnap.data().householdId);
        } else {
          setHouseholdId(null);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (!cancelled) setHouseholdId(null);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const loadingScreen = (msg) => (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",
      color: "#e2e8f0", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{msg}</div>
      </div>
    </div>
  );

  // Loading auth
  if (user === undefined) return loadingScreen("Loading...");

  // Not logged in
  if (user === null) return <Auth />;

  // Checking household
  if (householdId === undefined) return loadingScreen("Setting up...");

  // No household yet — show setup
  if (householdId === null) return <HouseholdSetup user={user} onReady={(id) => setHouseholdId(id)} />;

  // All good — show app
  return <App user={user} householdId={householdId} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
