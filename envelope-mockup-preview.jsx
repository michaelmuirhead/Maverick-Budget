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

// Mock data for the sub-budget "Groceries"
const MOCK_ENVELOPE = { cap: 600, rollover: 47.23 };
const MOCK_ENTRIES = [
  { id: "1", label: "Costco run", amount: 187.43, type: "expense", category: "food", date: "Apr 14", dateISO: "2026-04-14", tags: ["bulk"] },
  { id: "2", label: "Trader Joe's", amount: 62.18, type: "expense", category: "food", date: "Apr 11", dateISO: "2026-04-11", tags: [] },
  { id: "3", label: "Walmart groceries", amount: 94.55, type: "expense", category: "food", date: "Apr 8", dateISO: "2026-04-08", tags: ["weekly"] },
  { id: "4", label: "Kroger", amount: 41.20, type: "expense", category: "food", date: "Apr 3", dateISO: "2026-04-03", tags: [] },
];

const totalSpent = MOCK_ENTRIES.reduce((s, e) => s + e.amount, 0);
const totalBudget = MOCK_ENVELOPE.cap + MOCK_ENVELOPE.rollover;
const remaining = totalBudget - totalSpent;
const pct = Math.min((totalSpent / totalBudget) * 100, 100);

function getBarColor(pct) {
  if (pct < 60) return t.inc;
  if (pct < 85) return "#f59e0b";
  return t.exp;
}

// ── Envelope Card ──
function EnvelopeCard({ cap, rollover, spent, color }) {
  const total = cap + rollover;
  const left = total - spent;
  const pctUsed = Math.min((spent / total) * 100, 100);
  const barColor = getBarColor(pctUsed);
  const isOver = spent > total;
  const daysInMonth = 30;
  const today = 15;
  const dailyBudget = left > 0 ? (left / (daysInMonth - today)).toFixed(2) : 0;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: "16px 18px",
      marginBottom: 12,
      borderTop: `3px solid ${color}`,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 2 }}>
            Envelope · April 2026
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: t.mono, color: isOver ? t.exp : t.inc, letterSpacing: "-0.02em" }}>
            ${fmt(Math.abs(left))}
            <span style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, marginLeft: 6 }}>
              {isOver ? "over budget" : "remaining"}
            </span>
          </div>
        </div>
        <button style={{
          background: `${t.accent}15`,
          border: `1px solid ${t.accent}30`,
          borderRadius: 8,
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 600,
          color: t.accentLight,
          whiteSpace: "nowrap",
        }}>
          ✎ Edit
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 10,
        position: "relative",
      }}>
        <div style={{
          height: "100%",
          width: `${pctUsed}%`,
          background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          borderRadius: 4,
          transition: "width 0.6s ease, background 0.4s ease",
        }} />
        {/* Day marker */}
        <div style={{
          position: "absolute",
          left: `${(today / daysInMonth) * 100}%`,
          top: -2,
          bottom: -2,
          width: 2,
          background: "rgba(255,255,255,0.3)",
          borderRadius: 1,
        }} />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 0, justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Budget</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: t.mono, marginTop: 1 }}>${fmt(cap)}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Rollover</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.accentLight, fontFamily: t.mono, marginTop: 1 }}>+${fmt(rollover)}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Spent</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.exp, fontFamily: t.mono, marginTop: 1 }}>${fmt(spent)}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Per Day</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textSub, fontFamily: t.mono, marginTop: 1 }}>${dailyBudget}</div>
        </div>
      </div>
    </div>
  );
}

// ── Entry Row ──
function EntryRow({ entry }) {
  const isInc = entry.type === "income";
  const catIcons = { food: "🍕", transport: "🚗", housing: "🏠", utilities: "⚡", entertainment: "🎮", savings: "🏦", income: "💰", other: "📋" };
  const catLabels = { food: "Food", transport: "Transport", housing: "Housing", utilities: "Utilities", entertainment: "Fun", savings: "Savings", income: "Income", other: "Other" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 10px 10px 6px",
      background: t.row,
      borderRadius: 10,
    }}>
      <div style={{ color: t.textDark, fontSize: 14, padding: "12px 10px", margin: "-10px -4px -10px -6px", flexShrink: 0 }}>⠿</div>
      <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: 0.7, flexShrink: 0 }}>{catIcons[entry.category] || "📋"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.label}</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>
          {catLabels[entry.category] || "Other"} · {entry.date}
          {entry.tags?.length > 0 && <span style={{ marginLeft: 4, color: t.accentLight }}>{entry.tags.map(tg => `#${tg}`).join(" ")}</span>}
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

// ── Envelope Setup Modal (for the ✎ Edit button) ──
function EnvelopeSetup({ cap, rollover, onClose }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: "16px 18px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>Envelope Settings</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 16 }}>×</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Monthly Budget</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: t.textMuted, fontSize: 14, fontFamily: t.mono }}>$</span>
            <input defaultValue={cap} style={{
              flex: 1, background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 8,
              padding: "8px 10px", color: t.text, fontSize: 14, fontFamily: t.mono, outline: "none",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
          <div>
            <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Rollover unspent</div>
            <div style={{ fontSize: 9, color: t.textMuted }}>Carry leftover into next month</div>
          </div>
          <div style={{
            width: 44, height: 26, borderRadius: 13, position: "relative",
            background: t.inc, cursor: "pointer",
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, left: 21 }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
          <div>
            <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>Alert at 80%</div>
            <div style={{ fontSize: 9, color: t.textMuted }}>Push notification when near limit</div>
          </div>
          <div style={{
            width: 44, height: 26, borderRadius: 13, position: "relative",
            background: t.inc, cursor: "pointer",
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, left: 21 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
            background: t.accent, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Save</button>
          <button style={{
            padding: "10px 16px", borderRadius: 8, border: `1px solid rgba(239,68,68,0.2)`,
            background: "rgba(239,68,68,0.06)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Remove Envelope</button>
        </div>
      </div>
    </div>
  );
}

// ── All Envelopes Overview (shown on the main folders page) ──
function EnvelopesOverview() {
  const envelopes = [
    { name: "Groceries", color: "#ef4444", cap: 600, rollover: 47.23, spent: 385.36 },
    { name: "Gas & Transport", color: "#3b82f6", cap: 250, rollover: 0, spent: 132.80 },
    { name: "Subscriptions", color: "#8b5cf6", cap: 85, rollover: 0, spent: 79.97 },
    { name: "Fun Money", color: "#ec4899", cap: 200, rollover: 22.50, spent: 210.00 },
  ];
  const totalBudget = envelopes.reduce((s, e) => s + e.cap + e.rollover, 0);
  const totalSpent = envelopes.reduce((s, e) => s + e.spent, 0);
  const totalLeft = totalBudget - totalSpent;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: "14px 16px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Envelopes · April
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: t.mono, color: totalLeft >= 0 ? t.inc : t.exp }}>
          ${fmt(Math.abs(totalLeft))} left
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {envelopes.map((env, i) => {
          const total = env.cap + env.rollover;
          const pct = Math.min((env.spent / total) * 100, 100);
          const left = total - env.spent;
          const isOver = env.spent > total;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: env.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{env.name}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: t.mono, fontWeight: 600, color: isOver ? t.exp : t.textSub }}>
                  {isOver ? "−" : ""}${fmt(Math.abs(left))}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: getBarColor(pct),
                  borderRadius: 3,
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Mockup App ──
export default function EnvelopeMockup() {
  const [view, setView] = useState("budget"); // "home" | "budget" | "setup"

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: t.bg,
      minHeight: "100vh",
      color: t.text,
      position: "relative",
      overflow: "hidden",
      maxWidth: 430,
      margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ position: "absolute", top: -120, right: -80, width: 300, height: 300, background: t.glow, pointerEvents: "none" }} />

      {/* View selector tabs */}
      <div style={{ display: "flex", gap: 4, padding: "16px 20px 0", position: "relative", zIndex: 1 }}>
        {[
          { id: "home", label: "Home View" },
          { id: "budget", label: "Sub-budget View" },
          { id: "setup", label: "Envelope Setup" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600,
            background: view === v.id ? `${t.accent}25` : "rgba(255,255,255,0.03)",
            color: view === v.id ? t.accentLight : t.textDim,
            transition: "all 0.2s",
          }}>{v.label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 40px", position: "relative", zIndex: 1 }}>

        {/* ═══ HOME VIEW ═══ */}
        {view === "home" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", background: t.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
                <span style={{ fontSize: 10, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>Budget</span>
              </div>
              <div style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: t.textSub }}>⚙</div>
            </div>

            {/* Envelopes summary card on home page */}
            <EnvelopesOverview />

            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Folders (3)</div>
            {["Bills & Utilities", "Groceries & Food", "Savings"].map((name, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", marginBottom: 8,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 12,
                borderLeft: `4px solid ${["#f59e0b", "#ef4444", "#06b6d4"][i]}`,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${["#f59e0b", "#ef4444", "#06b6d4"][i]}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" fill={["#f59e0b", "#ef4444", "#06b6d4"][i]} opacity={0.7}/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{[3, 2, 1][i]} budget{[3, 2, 1][i] !== 1 ? "s" : ""}</div>
                </div>
                <span style={{ fontSize: 18, color: t.textDim }}>›</span>
              </div>
            ))}
          </>
        )}

        {/* ═══ SUB-BUDGET VIEW ═══ */}
        {view === "budget" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <button style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, flexShrink: 0, cursor: "pointer" }}>‹ Food</button>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#ef4444", flexShrink: 0 }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: t.text }}>Groceries</h2>
            </div>

            {/* ★ ENVELOPE CARD — the main feature ★ */}
            <EnvelopeCard
              cap={MOCK_ENVELOPE.cap}
              rollover={MOCK_ENVELOPE.rollover}
              spent={totalSpent}
              color="#ef4444"
            />

            {/* Balance card (existing) */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 16,
              padding: "12px 18px",
              marginBottom: 12,
              borderTop: "3px solid #ef4444",
            }}>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Income</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.inc, fontFamily: t.mono, marginTop: 2 }}>+$0.00</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Expenses</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.exp, fontFamily: t.mono, marginTop: 2 }}>−${fmt(totalSpent)}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {["Overview", "⚙ Limits & Recurring"].map((label, i) => (
                <button key={i} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 600,
                  background: i === 0 ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                  color: i === 0 ? "#818cf8" : "#64748b",
                }}>{label}</button>
              ))}
            </div>

            {/* Transaction list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {MOCK_ENTRIES.map(entry => (
                <EntryRow key={entry.id} entry={entry} />
              ))}
            </div>

            {/* Bottom bar */}
            <div style={{
              display: "flex", gap: 8, marginTop: 16, padding: "12px 0",
              borderTop: `1px solid ${t.cardBorder}`,
            }}>
              <button style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                background: "rgba(239,68,68,0.12)", color: "#ef4444",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>+ Expense</button>
              <button style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                background: "rgba(34,197,94,0.12)", color: "#22c55e",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>+ Income</button>
            </div>
          </>
        )}

        {/* ═══ ENVELOPE SETUP VIEW ═══ */}
        {view === "setup" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <button style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, flexShrink: 0, cursor: "pointer" }}>‹ Food</button>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#ef4444", flexShrink: 0 }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: t.text }}>Groceries</h2>
            </div>

            <EnvelopeSetup cap={600} rollover={47.23} onClose={() => setView("budget")} />

            <div style={{ marginTop: 16, padding: 16, background: t.surface, borderRadius: 14, border: `1px solid ${t.cardBorder}` }}>
              <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>How it works</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "📊", title: "Set a monthly cap", desc: "Choose how much to budget for this sub-budget each month" },
                  { icon: "🔄", title: "Rollover", desc: "Unspent money carries into next month automatically" },
                  { icon: "🔔", title: "Alerts", desc: "Get notified when you hit 80% or 100% of your envelope" },
                  { icon: "👥", title: "Shared", desc: "Both household members see the same envelope balance" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
