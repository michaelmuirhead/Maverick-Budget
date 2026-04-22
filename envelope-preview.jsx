import { useState } from "react";

// ── Theme ──
const T = {
  bg: "#0a0a1a", card: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)",
  text: "#e2e8f0", textSub: "#94a3b8", textMuted: "#64748b", textDim: "#475569",
  inc: "#22c55e", exp: "#ef4444", accent: "#6366f1", accentLight: "#818cf8",
  inputBg: "rgba(255,255,255,0.04)", inputBorder: "rgba(255,255,255,0.08)",
  mono: "'SF Mono', 'Fira Code', monospace", row: "rgba(255,255,255,0.02)",
};

const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function getBarColor(pct) { if (pct < 60) return T.inc; if (pct < 85) return "#f59e0b"; return T.exp; }

// ── Mock Data ──
const mockEnvelopes = [
  { name: "Groceries", color: "#22c55e", cap: 800, rollover: 45, spent: 523.47, rolledTo: null },
  { name: "Gas", color: "#3b82f6", cap: 250, rollover: 0, spent: 187.30, rolledTo: null },
  { name: "Entertainment", color: "#f59e0b", cap: 200, rollover: 0, spent: 178.50, rolledTo: null },
  { name: "Dining Out", color: "#ef4444", cap: 300, rollover: 0, spent: 312.75, rolledTo: null },
  { name: "Subscriptions", color: "#8b5cf6", cap: 120, rollover: 0, spent: 89.97, rolledTo: null },
];

const mockTransactions = [
  { id: 1, label: "Costco run", amount: 187.43, type: "expense", category: "Groceries", icon: "🛒", date: "Apr 14", sub: "Groceries" },
  { id: 2, label: "Shell gas station", amount: 62.50, type: "expense", category: "Gas", icon: "⛽", date: "Apr 13", sub: "Gas" },
  { id: 3, label: "Netflix + Spotify", amount: 29.97, type: "expense", category: "Subscriptions", icon: "📺", date: "Apr 12", sub: "Subscriptions" },
  { id: 4, label: "Olive Garden", amount: 78.50, type: "expense", category: "Dining", icon: "🍽️", date: "Apr 11", sub: "Dining Out" },
  { id: 5, label: "Paycheck", amount: 3250.00, type: "income", category: "Income", icon: "💰", date: "Apr 10", sub: null },
  { id: 6, label: "Walmart groceries", amount: 134.22, type: "expense", category: "Groceries", icon: "🛒", date: "Apr 9", sub: "Groceries" },
  { id: 7, label: "Movie tickets", amount: 42.00, type: "expense", category: "Entertainment", icon: "🎬", date: "Apr 8", sub: "Entertainment" },
  { id: 8, label: "Chevron", amount: 55.80, type: "expense", category: "Gas", icon: "⛽", date: "Apr 7", sub: "Gas" },
];

const mockSubBudgets = [
  { name: "Groceries", color: "#22c55e", balance: 276.53 },
  { name: "Gas", color: "#3b82f6", balance: 62.70 },
  { name: "Entertainment", color: "#f59e0b", balance: 21.50 },
  { name: "Dining Out", color: "#ef4444", balance: -12.75 },
  { name: "Subscriptions", color: "#8b5cf6", balance: 30.03 },
];

const mockMonthlyBudgets = [
  { name: "April 2026", color: "#6366f1", balance: 847.29, childCount: 5 },
  { name: "May 2026", color: "#6366f1", balance: 0, childCount: 5 },
  { name: "June 2026", color: "#6366f1", balance: 0, childCount: 0 },
];

// ── Collapsible Section ──
function Collapsible({ title, count, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        background: "none", border: "none", cursor: "pointer", padding: "8px 0", marginBottom: open ? 8 : 0,
      }}>
        <span style={{ fontSize: 12, color: T.textMuted, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</span>
        <span style={{ fontSize: 10, color: T.textDim, background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{count}</span>
      </button>
      {open && <div style={{ animation: "slideIn 0.2s ease" }}>{children}</div>}
    </div>
  );
}

// ── Envelope Summary ──
function EnvelopeSummary({ envelopes, parentName }) {
  const totalBudget = envelopes.reduce((s, e) => s + e.cap + (e.rollover || 0), 0);
  const totalSpent = envelopes.reduce((s, e) => s + e.spent, 0);
  const totalLeft = totalBudget - totalSpent;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Envelopes · {parentName}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.mono, color: totalLeft >= 0 ? T.inc : T.exp }}>
          {fmt(Math.abs(totalLeft))} <span style={{ fontSize: 10, fontWeight: 500, color: T.textMuted }}>{totalLeft >= 0 ? "left" : "over"}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {envelopes.map((env, i) => {
          const total = env.cap + (env.rollover || 0);
          const pct = Math.min((env.spent / total) * 100, 100);
          const left = total - env.spent;
          const isOver = env.spent > total;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: env.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{env.name}</span>
                  <span style={{ fontSize: 9, color: T.textDim, fontFamily: T.mono }}>{fmt(env.spent)} / {fmt(total)}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: T.mono, fontWeight: 600, color: isOver ? T.exp : T.textSub }}>
                  {isOver ? "−" : ""}{fmt(Math.abs(left))}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: getBarColor(pct),
                  borderRadius: 3, transition: "width 0.8s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Envelope Card (sub-budget drill-in) ──
function EnvelopeCard({ env }) {
  const total = env.cap + (env.rollover || 0);
  const left = total - env.spent;
  const pctUsed = total > 0 ? Math.min((env.spent / total) * 100, 100) : 0;
  const barColor = getBarColor(pctUsed);
  const isOver = env.spent > total;
  const daysLeft = 30 - new Date().getDate() + 1;
  const dailyBudget = left > 0 && daysLeft > 0 ? (left / daysLeft).toFixed(2) : "0.00";

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${T.cardBorder}`, borderRadius: 16,
      padding: "16px 18px", marginBottom: 12,
      borderTop: `3px solid ${env.color}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 2 }}>
            Envelope · April 2026
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: T.mono, color: isOver ? T.exp : T.inc, letterSpacing: "-0.02em" }}>
            {isOver ? "−" : ""}${fmt(Math.abs(left))}
            <span style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, marginLeft: 6 }}>
              {isOver ? "over budget" : "remaining"}
            </span>
          </div>
        </div>
        <button style={{
          background: "rgba(255,255,255,0.05)", border: `1px solid ${T.cardBorder}`,
          borderRadius: 8, padding: "6px 10px", color: T.textMuted, fontSize: 11, cursor: "pointer",
        }}>⚙</button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textMuted, marginBottom: 4 }}>
          <span>{fmt(env.spent)} spent</span>
          <span>{fmt(total)} budget</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pctUsed}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            borderRadius: 4, transition: "width 0.8s ease",
          }} />
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, textAlign: "right" }}>
          {Math.round(pctUsed)}% used
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Per day</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.mono, color: T.text }}>${dailyBudget}</div>
          <div style={{ fontSize: 9, color: T.textDim }}>{daysLeft} days left</div>
        </div>
        {env.rollover > 0 && (
          <div style={{ flex: 1, background: "rgba(34,197,94,0.06)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Rollover</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.mono, color: T.inc }}>+${fmt(env.rollover)}</div>
            <div style={{ fontSize: 9, color: T.textDim }}>from last month</div>
          </div>
        )}
        {!isOver && left > 0 && (
          <div style={{ flex: 1, background: "rgba(99,102,241,0.06)", borderRadius: 10, padding: "10px 12px", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Roll forward</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.mono, color: T.accentLight }}>${fmt(left)}</div>
            <div style={{ fontSize: 9, color: T.textDim }}>→ May 2026</div>
          </div>
        )}
      </div>

      {isOver && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
          fontSize: 11, color: T.exp, fontWeight: 500, textAlign: "center",
        }}>
          ⚠ Over budget by ${fmt(Math.abs(left))}
        </div>
      )}
    </div>
  );
}

// ── Main Preview ──
export default function EnvelopePreview() {
  const [view, setView] = useState("parent"); // parent | budget-home | sub-budget

  const inc = 3250;
  const exp = 2402.71;
  const balance = inc - exp;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* View Switcher */}
      <div style={{ padding: "16px 20px 8px", display: "flex", gap: 6 }}>
        {[
          { id: "parent", label: "Parent Folder" },
          { id: "budget-home", label: "Monthly Budget" },
          { id: "sub-budget", label: "Sub-Budget" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700,
            background: view === v.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            color: view === v.id ? "#818cf8" : "#64748b",
            transition: "all 0.2s",
          }}>{v.label}</button>
        ))}
      </div>

      <div style={{ padding: "8px 20px 4px" }}>
        <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
          {view === "parent" ? "Traditional folder view (unchanged)" : view === "budget-home" ? "New budget home view with envelopes" : "Sub-budget drill-in with envelope card"}
        </div>
      </div>

      {/* ═══ PARENT FOLDER VIEW (Muirhead Family) ═══ */}
      {view === "parent" && (
        <div style={{ padding: "12px 20px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button style={{ background: T.inputBg, border: "none", color: T.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>‹ Home</button>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#6366f1" }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>Muirhead Family</h2>
          </div>

          {/* Monthly budgets as simple list — no envelope summary here */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mockMonthlyBudgets.map((m, i) => (
              <div key={i} onClick={() => setView("budget-home")} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                background: "rgba(255,255,255,0.02)", borderRadius: 12,
                borderLeft: `4px solid ${m.color}`, cursor: "pointer",
                transition: "background 0.15s",
              }}>
                <div style={{ cursor: "grab", color: "#475569", fontSize: 16, padding: "4px 6px" }}>⠿</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{m.childCount} sub-budgets</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: T.mono, color: m.balance >= 0 ? "#22c55e" : "#ef4444" }}>
                  {m.balance > 0 ? `+${fmt(m.balance)}` : fmt(m.balance)}
                </span>
                <span style={{ fontSize: 18, color: "#475569" }}>›</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <div style={{ fontSize: 11, color: T.textDim, background: "rgba(255,255,255,0.03)", display: "inline-block", padding: "6px 14px", borderRadius: 8 }}>
              This is the parent folder — traditional view, no envelope data
            </div>
          </div>
        </div>
      )}

      {/* ═══ BUDGET HOME VIEW (April 2026) ═══ */}
      {view === "budget-home" && (
        <div style={{ padding: "12px 20px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setView("parent")} style={{ background: T.inputBg, border: "none", color: T.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>‹ Muirhead Family</button>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#6366f1" }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>April 2026</h2>
          </div>

          {/* Balance Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12,
            borderTop: "3px solid #6366f1",
          }}>
            <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 4 }}>Balance</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: T.mono, color: T.inc, letterSpacing: "-0.02em" }}>${fmt(balance)}</div>
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Income</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.inc, fontFamily: T.mono, marginTop: 2 }}>+{fmt(inc)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Expenses</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.exp, fontFamily: T.mono, marginTop: 2 }}>−{fmt(exp)}</div>
              </div>
            </div>
          </div>

          {/* Envelope Summary */}
          <EnvelopeSummary envelopes={mockEnvelopes} parentName="April 2026" />

          {/* Transactions — default open */}
          <Collapsible title="Transactions" count={mockTransactions.length} defaultOpen={true}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {mockTransactions.map(tx => {
                const isInc = tx.type === "income";
                return (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", background: T.row, borderRadius: 10 }}>
                    <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: 0.7 }}>{tx.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.label}</div>
                      <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>
                        {tx.category} · {tx.date}
                        {tx.sub && <span style={{ marginLeft: 4, color: T.accentLight, fontSize: 10 }}>→ {tx.sub}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 14, color: isInc ? T.inc : T.exp }}>
                        {isInc ? "+" : "−"}{fmt(tx.amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Collapsible>

          <div style={{ marginBottom: 16 }} />

          {/* Sub-budgets — default closed */}
          <Collapsible title="Sub-budgets" count={mockSubBudgets.length} defaultOpen={false}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mockSubBudgets.map((c, i) => (
                <div key={i} onClick={() => setView("sub-budget")} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)", borderRadius: 12,
                  borderLeft: `4px solid ${c.color}`, cursor: "pointer",
                }}>
                  <div style={{ cursor: "grab", color: "#475569", fontSize: 16, padding: "4px 6px" }}>⠿</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{c.name}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: T.mono, color: c.balance >= 0 ? "#22c55e" : "#ef4444" }}>
                    {c.balance >= 0 ? "+" : "−"} {fmt(Math.abs(c.balance))}
                  </span>
                  <span style={{ fontSize: 18, color: "#475569" }}>›</span>
                </div>
              ))}
            </div>
          </Collapsible>
        </div>
      )}

      {/* ═══ SUB-BUDGET VIEW (Groceries) ═══ */}
      {view === "sub-budget" && (
        <div style={{ padding: "12px 20px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setView("budget-home")} style={{ background: T.inputBg, border: "none", color: T.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>‹ April 2026</button>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#22c55e" }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>Groceries</h2>
          </div>

          {/* Envelope Card */}
          <EnvelopeCard env={mockEnvelopes[0]} />

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

          {/* Transactions in this sub-budget */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {mockTransactions.filter(tx => tx.sub === "Groceries").map(tx => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", background: T.row, borderRadius: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: 0.7 }}>{tx.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{tx.label}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{tx.category} · {tx.date}</div>
                </div>
                <div style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 14, color: T.exp }}>−{fmt(tx.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}