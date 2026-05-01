import { useState } from "react";

const THEMES = {
  midnight: {
    id: "midnight", name: "Midnight Indigo",
    bg: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",
    text: "#e2e8f0", textSub: "#94a3b8", textMuted: "#64748b", textDim: "#475569", textDark: "#334155",
    accent: "#6366f1", accentLight: "#818cf8",
    inc: "#22c55e", exp: "#ef4444",
    card: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    cardBorder: "rgba(255,255,255,0.06)", surface: "rgba(255,255,255,0.02)", surfaceHover: "rgba(255,255,255,0.05)",
    row: "#0d1025", inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.08)",
    glow: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    titleGrad: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
    font: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
};

const t = THEMES.midnight;
const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function getBarColor(pct) {
  if (pct < 60) return t.inc;
  if (pct < 85) return "#f59e0b";
  return t.exp;
}

const catMeta = {
  food: { icon: "🍕", label: "Food", color: "#ef4444" },
  transport: { icon: "🚗", label: "Transport", color: "#3b82f6" },
  utilities: { icon: "⚡", label: "Utilities", color: "#8b5cf6" },
  entertainment: { icon: "🎮", label: "Fun", color: "#ec4899" },
  savings: { icon: "🏦", label: "Savings", color: "#06b6d4" },
  housing: { icon: "🏠", label: "Housing", color: "#f59e0b" },
  income: { icon: "💰", label: "Income", color: "#22c55e" },
  other: { icon: "📋", label: "Other", color: "#f97316" },
};

// ── Mock data: April 2026 budget ──
const INITIAL_ENVELOPES = [
  { name: "Groceries", category: "food", color: "#ef4444", cap: 600, rollover: 47.23, spent: 385.36, rolledTo: null, rolledAmount: 0 },
  { name: "Gas & Transport", category: "transport", color: "#3b82f6", cap: 250, rollover: 0, spent: 132.80, rolledTo: null, rolledAmount: 0 },
  { name: "Subscriptions", category: "entertainment", color: "#ec4899", cap: 85, rollover: 0, spent: 79.97, rolledTo: null, rolledAmount: 0 },
  { name: "Fun Money", category: "entertainment", color: "#8b5cf6", cap: 200, rollover: 22.50, spent: 210.00, rolledTo: null, rolledAmount: 0 },
];

const MOCK_TRANSACTIONS = [
  { id: "1", label: "Costco run", amount: 187.43, type: "expense", category: "food", date: "Apr 14", sub: "Groceries" },
  { id: "2", label: "Paycheck", amount: 3200.00, type: "income", category: "income", date: "Apr 14", sub: null },
  { id: "3", label: "Shell gas", amount: 48.20, type: "expense", category: "transport", date: "Apr 13", sub: "Gas & Transport" },
  { id: "4", label: "Trader Joe's", amount: 62.18, type: "expense", category: "food", date: "Apr 11", sub: "Groceries" },
  { id: "5", label: "Netflix + Spotify", amount: 28.97, type: "expense", category: "entertainment", date: "Apr 10", sub: "Subscriptions" },
  { id: "6", label: "Date night dinner", amount: 78.50, type: "expense", category: "entertainment", date: "Apr 9", sub: "Fun Money" },
  { id: "7", label: "Walmart groceries", amount: 94.55, type: "expense", category: "food", date: "Apr 8", sub: "Groceries" },
  { id: "8", label: "Uber to airport", amount: 34.60, type: "expense", category: "transport", date: "Apr 7", sub: "Gas & Transport" },
  { id: "9", label: "Concert tickets", amount: 131.50, type: "expense", category: "entertainment", date: "Apr 5", sub: "Fun Money" },
  { id: "10", label: "Kroger", amount: 41.20, type: "expense", category: "food", date: "Apr 3", sub: "Groceries" },
  { id: "11", label: "Hulu", amount: 17.99, type: "expense", category: "entertainment", date: "Apr 1", sub: "Subscriptions" },
  { id: "12", label: "BP gas", amount: 50.00, type: "expense", category: "transport", date: "Apr 1", sub: "Gas & Transport" },
];

const MOCK_SUB_BUDGETS = [
  { name: "Groceries", color: "#ef4444", balance: -385.36, count: 4 },
  { name: "Gas & Transport", color: "#3b82f6", balance: -132.80, count: 3 },
  { name: "Subscriptions", color: "#ec4899", balance: -79.97, count: 2 },
  { name: "Fun Money", color: "#8b5cf6", balance: -210.00, count: 2 },
  { name: "Savings", color: "#06b6d4", balance: 0, count: 0 },
];

// ── Entry Row ──
function EntryRow({ entry }) {
  const isInc = entry.type === "income";
  const cat = catMeta[entry.category] || catMeta.other;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 10px 10px 6px",
      background: t.row, borderRadius: 10,
    }}>
      <div style={{ color: t.textDark, fontSize: 14, padding: "12px 10px", margin: "-10px -4px -10px -6px", flexShrink: 0 }}>⠿</div>
      <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: 0.7, flexShrink: 0 }}>{cat.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.label}</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>
          {cat.label} · {entry.date}
          {entry.sub && <span style={{ marginLeft: 4, color: t.accentLight, fontSize: 10 }}>→ {entry.sub}</span>}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 14, color: isInc ? t.inc : t.exp }}>
          {isInc ? "+" : "−"}${fmt(Math.abs(entry.amount))}
        </div>
      </div>
    </div>
  );
}

// ── Rolled Badge ──
function RolledBadge({ amount, target }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 10px",
      background: "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.15)",
      borderRadius: 8,
      marginTop: 10,
    }}>
      <span style={{ fontSize: 12 }}>✓</span>
      <span style={{ fontSize: 11, color: t.inc, fontWeight: 600 }}>
        ${fmt(amount)} → {target}
      </span>
      <span style={{ fontSize: 10, color: t.textMuted, marginLeft: "auto" }}>Rolled forward</span>
    </div>
  );
}

// ── Confirm Roll Dialog ──
function RollConfirm({ name, amount, target, onConfirm, onCancel }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: "16px 18px",
      marginTop: 10,
      animation: "slideIn 0.2s ease",
    }}>
      <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 8 }}>Roll forward to {target}?</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12, lineHeight: 1.5 }}>
        This will add <span style={{ color: t.inc, fontWeight: 600, fontFamily: t.mono }}>${fmt(amount)}</span> from
        {" "}<span style={{ color: t.text, fontWeight: 500 }}>{name}</span> to {target}'s envelope as rollover.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
          background: t.inc, color: "#0a0a1a", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>Roll ${fmt(amount)} → {target}</button>
        <button onClick={onCancel} style={{
          padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.cardBorder}`,
          background: "transparent", color: t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Envelope Summary Card (budget home) ──
function EnvelopeSummary({ envelopes }) {
  const totalBudget = envelopes.reduce((s, e) => s + e.cap + e.rollover, 0);
  const totalSpent = envelopes.reduce((s, e) => s + e.spent, 0);
  const totalLeft = totalBudget - totalSpent;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Envelopes · April 2026
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: t.mono, color: totalLeft >= 0 ? t.inc : t.exp }}>
          ${fmt(Math.abs(totalLeft))} <span style={{ fontSize: 10, fontWeight: 500, color: t.textMuted }}>{totalLeft >= 0 ? "left" : "over"}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {envelopes.map((env, i) => {
          const total = env.cap + env.rollover;
          const pct = Math.min((env.spent / total) * 100, 100);
          const left = total - env.spent;
          const isOver = env.spent > total;
          const isRolled = !!env.rolledTo;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: env.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{env.name}</span>
                  {isRolled && (
                    <span style={{ fontSize: 9, color: t.inc, fontWeight: 600, background: "rgba(34,197,94,0.1)", padding: "1px 5px", borderRadius: 4 }}>
                      ✓ ${fmt(env.rolledAmount)} → May
                    </span>
                  )}
                  {!isRolled && <span style={{ fontSize: 9, color: t.textDim, fontFamily: t.mono }}>${fmt(env.spent)} / ${fmt(total)}</span>}
                </div>
                <span style={{ fontSize: 11, fontFamily: t.mono, fontWeight: 600, color: isOver ? t.exp : t.textSub }}>
                  {isOver ? "−" : ""}${fmt(Math.abs(left))}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: isRolled ? t.textDim : getBarColor(pct),
                  borderRadius: 3, transition: "width 0.4s ease", opacity: isRolled ? 0.5 : 1,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Full Envelope Card (sub-budget drill-in) ──
function EnvelopeCard({ name, cap, rollover, spent, color, rolledTo, rolledAmount, onRoll }) {
  const total = cap + rollover;
  const left = total - spent;
  const pctUsed = Math.min((spent / total) * 100, 100);
  const barColor = getBarColor(pctUsed);
  const isOver = spent > total;
  const isRolled = !!rolledTo;
  const daysInMonth = 30;
  const today = 15;
  const dailyBudget = left > 0 ? (left / (daysInMonth - today)).toFixed(2) : 0;
  const canRoll = left > 0 && !isRolled;

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${t.cardBorder}`, borderRadius: 16,
      padding: "16px 18px", marginBottom: 12,
      borderTop: `3px solid ${color}`,
      opacity: isRolled ? 0.75 : 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 2 }}>
            Envelope · April 2026
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: t.mono, color: isOver ? t.exp : t.inc, letterSpacing: "-0.02em" }}>
            {isOver ? "−" : ""}${fmt(Math.abs(left))}
            <span style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, marginLeft: 6 }}>
              {isOver ? "over budget" : "remaining"}
            </span>
          </div>
        </div>
        <button style={{
          background: `${t.accent}15`, border: `1px solid ${t.accent}30`, borderRadius: 8,
          padding: "5px 10px", cursor: "pointer", fontSize: 10, fontWeight: 600, color: t.accentLight,
        }}>✎ Edit</button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 10, position: "relative" }}>
        <div style={{
          height: "100%", width: `${pctUsed}%`,
          background: isRolled ? t.textDim : `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          borderRadius: 4, opacity: isRolled ? 0.5 : 1,
        }} />
        <div style={{ position: "absolute", left: `${(today / daysInMonth) * 100}%`, top: -2, bottom: -2, width: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div><div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Budget</div><div style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: t.mono, marginTop: 1 }}>${fmt(cap)}</div></div>
        {rollover > 0 && <div><div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Rollover</div><div style={{ fontSize: 13, fontWeight: 600, color: t.accentLight, fontFamily: t.mono, marginTop: 1 }}>+${fmt(rollover)}</div></div>}
        <div><div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Spent</div><div style={{ fontSize: 13, fontWeight: 600, color: t.exp, fontFamily: t.mono, marginTop: 1 }}>${fmt(spent)}</div></div>
        {!isRolled && !isOver && <div><div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Per Day</div><div style={{ fontSize: 13, fontWeight: 600, color: t.textSub, fontFamily: t.mono, marginTop: 1 }}>${dailyBudget}</div></div>}
      </div>

      {/* Rolled badge */}
      {isRolled && <RolledBadge amount={rolledAmount} target="May 2026" />}

      {/* Roll forward button */}
      {canRoll && !showConfirm && (
        <button onClick={() => setShowConfirm(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 8,
          border: `1px dashed rgba(34,197,94,0.3)`,
          background: "rgba(34,197,94,0.04)",
          color: t.inc, fontSize: 12, fontWeight: 600, cursor: "pointer",
          transition: "all 0.2s",
        }}>
          <span>Roll forward ${fmt(left)} → May 2026</span>
          <span style={{ fontSize: 14 }}>→</span>
        </button>
      )}

      {/* Overspent — nothing to roll */}
      {isOver && !isRolled && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 10px", marginTop: 10,
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.12)",
          borderRadius: 8,
        }}>
          <span style={{ fontSize: 12 }}>⚠</span>
          <span style={{ fontSize: 11, color: t.exp, fontWeight: 500 }}>Overspent — May starts fresh at ${fmt(cap)}</span>
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirm && (
        <RollConfirm
          name={name}
          amount={left}
          target="May 2026"
          onConfirm={() => { setShowConfirm(false); onRoll && onRoll(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// ── Collapsible Section ──
function Collapsible({ title, count, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
        background: "none", border: "none", cursor: "pointer", padding: "8px 0", marginBottom: open ? 8 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: t.textDim, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▶</span>
          <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</span>
          {count !== undefined && <span style={{ fontSize: 10, color: t.textDim, fontFamily: t.mono }}>({count})</span>}
        </div>
        <span style={{ fontSize: 10, color: t.textDim }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div style={{ animation: "slideIn 0.2s ease" }}>{children}</div>}
    </div>
  );
}

// ── Folder Row ──
function FolderRow({ name, color, balance, count, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px", marginBottom: 6,
      background: "rgba(255,255,255,0.02)", borderRadius: 12,
      borderLeft: `4px solid ${color}`, cursor: "pointer",
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" fill={color} opacity={0.7}/></svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{name}</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>{count} transaction{count !== 1 ? "s" : ""}</div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: t.mono, color: balance <= 0 ? t.exp : t.inc }}>
        {balance <= 0 ? "−" : "+"}${fmt(Math.abs(balance))}
      </span>
      <span style={{ fontSize: 18, color: t.textDim }}>›</span>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN MOCKUP
// ══════════════════════════════════════════════════
export default function EnvelopeMockup() {
  const [view, setView] = useState("home");
  const [envelopes, setEnvelopes] = useState(INITIAL_ENVELOPES);
  const [subView, setSubView] = useState("groceries"); // which sub-budget we're viewing

  const handleRoll = (envIndex) => {
    setEnvelopes(prev => prev.map((env, i) => {
      if (i !== envIndex) return env;
      const total = env.cap + env.rollover;
      const left = total - env.spent;
      if (left <= 0) return env;
      return { ...env, rolledTo: "may-2026", rolledAmount: left };
    }));
  };

  const totalIncome = MOCK_TRANSACTIONS.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpenses = MOCK_TRANSACTIONS.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Get envelope by sub-budget name
  const getEnv = (name) => envelopes.find(e => e.name === name);
  const getEnvIndex = (name) => envelopes.findIndex(e => e.name === name);

  const subBudgetNames = ["Groceries", "Gas & Transport", "Subscriptions", "Fun Money"];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: t.bg, minHeight: "100vh", color: t.text,
      position: "relative", overflow: "hidden", maxWidth: 430, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
      <div style={{ position: "absolute", top: -120, right: -80, width: 300, height: 300, background: t.glow, pointerEvents: "none" }} />

      {/* View toggle */}
      <div style={{ display: "flex", gap: 4, padding: "16px 20px 0", position: "relative", zIndex: 1 }}>
        <button onClick={() => setView("home")} style={{
          flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 600,
          background: view === "home" ? `${t.accent}25` : "rgba(255,255,255,0.03)",
          color: view === "home" ? t.accentLight : t.textDim,
        }}>📅 April 2026</button>
        <button onClick={() => setView("sub")} style={{
          flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 600,
          background: view === "sub" ? `${t.accent}25` : "rgba(255,255,255,0.03)",
          color: view === "sub" ? t.accentLight : t.textDim,
        }}>🍕 Sub-budget</button>
      </div>

      <div style={{ padding: "16px 20px 40px", position: "relative", zIndex: 1 }}>

        {/* ═══ MONTHLY BUDGET HOME ═══ */}
        {view === "home" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <button style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, flexShrink: 0, cursor: "pointer" }}>‹ 2026</button>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#6366f1", flexShrink: 0 }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: t.text, flex: 1 }}>April 2026</h2>
              <div style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: t.textSub, cursor: "pointer" }}>⚙</div>
            </div>

            {/* Balance */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              border: `1px solid ${t.cardBorder}`, borderRadius: 16,
              padding: "16px 18px", marginBottom: 12, borderTop: "3px solid #6366f1",
            }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 4 }}>Balance</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: t.mono, color: balance >= 0 ? t.inc : t.exp, letterSpacing: "-0.02em" }}>${fmt(Math.abs(balance))}</div>
              <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                <div><div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Income</div><div style={{ fontSize: 14, fontWeight: 600, color: t.inc, fontFamily: t.mono, marginTop: 2 }}>+${fmt(totalIncome)}</div></div>
                <div><div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Expenses</div><div style={{ fontSize: 14, fontWeight: 600, color: t.exp, fontFamily: t.mono, marginTop: 2 }}>−${fmt(totalExpenses)}</div></div>
              </div>
            </div>

            {/* Envelopes */}
            <EnvelopeSummary envelopes={envelopes} />

            {/* Transactions — collapsible, default open */}
            <Collapsible title="Transactions" count={MOCK_TRANSACTIONS.length} defaultOpen={true}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {MOCK_TRANSACTIONS.map(entry => <EntryRow key={entry.id} entry={entry} />)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Expense</button>
                <button style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "rgba(34,197,94,0.12)", color: "#22c55e", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Income</button>
              </div>
            </Collapsible>
            <div style={{ marginBottom: 16 }} />

            {/* Collapsible folders */}
            <Collapsible title="Sub-budgets" count={MOCK_SUB_BUDGETS.length} defaultOpen={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {MOCK_SUB_BUDGETS.map((sb, i) => (
                  <FolderRow key={i} name={sb.name} color={sb.color} balance={sb.balance} count={sb.count} onClick={() => { setSubView(sb.name.toLowerCase()); setView("sub"); }} />
                ))}
              </div>
            </Collapsible>
          </div>
        )}

        {/* ═══ SUB-BUDGET DRILL-IN ═══ */}
        {view === "sub" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Sub-budget picker */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
              {subBudgetNames.map(name => {
                const env = getEnv(name);
                const isActive = subView === name.toLowerCase() || subView === name;
                return (
                  <button key={name} onClick={() => setSubView(name)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
                    background: isActive ? `${env?.color || t.accent}20` : "rgba(255,255,255,0.03)",
                    color: isActive ? (env?.color || t.accentLight) : t.textDim,
                  }}>{name}</button>
                );
              })}
            </div>

            {subBudgetNames.map(name => {
              const env = getEnv(name);
              const isActive = subView === name.toLowerCase() || subView === name;
              if (!isActive || !env) return null;
              const envIndex = getEnvIndex(name);
              const transactions = MOCK_TRANSACTIONS.filter(e => e.sub === name);

              return (
                <div key={name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <button onClick={() => setView("home")} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, flexShrink: 0, cursor: "pointer" }}>‹ April 2026</button>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: env.color, flexShrink: 0 }} />
                    <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: t.text }}>{name}</h2>
                  </div>

                  <EnvelopeCard
                    name={name}
                    cap={env.cap}
                    rollover={env.rollover}
                    spent={env.spent}
                    color={env.color}
                    rolledTo={env.rolledTo}
                    rolledAmount={env.rolledAmount}
                    onRoll={() => handleRoll(envIndex)}
                  />

                  <Collapsible title="Transactions" count={transactions.length} defaultOpen={true}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                      {transactions.map(entry => <EntryRow key={entry.id} entry={entry} />)}
                      {transactions.length === 0 && (
                        <div style={{ textAlign: "center", padding: 20, color: t.textDim, fontSize: 13 }}>No transactions yet</div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Expense</button>
                      <button style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "rgba(34,197,94,0.12)", color: "#22c55e", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Income</button>
                    </div>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
