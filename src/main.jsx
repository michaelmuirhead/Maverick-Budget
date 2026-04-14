import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Auth from './Auth';
import { auth, onAuthStateChanged } from './firebase';
import './index.css';

function Root() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return unsub;
  }, []);

  // Loading state
  if (user === undefined) {
    return (
      <div style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",
        color: "#e2e8f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Loading...</div>
        </div>
      </div>
    );
  }

  return user ? <App user={user} /> : <Auth />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
