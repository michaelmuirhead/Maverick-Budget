import { useState, useEffect, useRef, useCallback } from "react";

const CATEGORIES = [
  { id: "income", label: "Income", icon: "↑", color: "#22c55e" },
  { id: "housing", label: "Housing", icon: "⌂", color: "#f59e0b" },
  { id: "food", label: "Food", icon: "◉", color: "#ef4444" },
  { id: "transport", label: "Transport", icon: "⟐", color: "#3b82f6" },
  { id: "utilities", label: "Utilities", icon: "⚡", color: "#8b5cf6" },
  { id: "entertainment", label: "Fun", icon: "♦", color: "#ec4899" },
  { id: "savings", label: "Savings", icon: "◈", color: "#06b6d4" },
  { id: "other", label: "Other", icon: "•", color: "#6b7280" },
];
const COLORS = ["#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4"];
const FREQ = [{ id: "weekly", label: "Weekly", days: 7 }, { id: "biweekly", label: "Bi-weekly", days: 14 }, { id: "monthly", label: "Monthly", days: 30 }, { id: "yearly", label: "Yearly", days: 365 }];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmt(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n); }
function today() { return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function daysBetween(a, b) { return Math.floor((b - a) / (1000 * 60 * 60 * 24)); }

// ── Process recurring transactions on load ──
function processRecurrings(data) {
  const now = new Date();
  let { nodes, entries, recurrings = [], limits = {} } = data;
  let changed = false;
  const newEntries = [];

  recurrings = recurrings.map(r => {
    const freq = FREQ.find(f => f.id === r.frequency);
    if (!freq) return r;
    const last = r.lastRun ? new Date(r.lastRun) : new Date(0);
    const gap = daysBetween(last, now);
    if (gap >= freq.days) {
      // How many periods have passed
      const periods = Math.floor(gap / freq.days);
      for (let i = 0; i < periods; i++) {
        newEntries.push({
          id: uid(), nodeId: r.nodeId, label: r.label + " (auto)", amount: r.amount,
          category: r.category, type: r.type, date: today(), recurring: true,
        });
      }
      changed = true;
      return { ...r, lastRun: now.toISOString() };
    }
    return r;
  });

  if (changed) {
    return { nodes, entries: [...entries, ...newEntries], recurrings, limits };
  }
  return { ...data, recurrings: data.recurrings || [], limits: data.limits || {} };
}

// ── State ──
function useApp() {
  const [d, setD] = useState(() => {
    try { const r = localStorage.getItem("maverick-budget-data"); if (r) return processRecurrings(JSON.parse(r)); } catch {}
    return { nodes: [], entries: [], recurrings: [], limits: {} };
  });
  useEffect(() => { try { localStorage.setItem("maverick-budget-data", JSON.stringify(d)); } catch {} }, [d]);
  const up = (fn) => setD((p) => fn(p));
  const getDesc = useCallback((nodes, nid) => {
    const kids = nodes.filter(n => n.parentId === nid);
    let all = kids.map(k => k.id);
    kids.forEach(k => { all = all.concat(getDesc(nodes, k.id)); });
    return all;
  }, []);
  return {
    d,
    addNode: useCallback((n) => up(p => ({ ...p, nodes: [...p.nodes, n] })), []),
    updateNode: useCallback((id, u) => up(p => ({ ...p, nodes: p.nodes.map(n => n.id === id ? { ...n, ...u } : n) })), []),
    removeNode: useCallback((id) => up(p => {
      const all = [id, ...getDesc(p.nodes, id)];
      return { ...p, nodes: p.nodes.filter(n => !all.includes(n.id)), entries: p.entries.filter(e => !all.includes(e.nodeId)), recurrings: p.recurrings.filter(r => !all.includes(r.nodeId)) };
    }), [getDesc]),
    addEntry: useCallback((e) => up(p => ({ ...p, entries: [...p.entries, e] })), []),
    updateEntry: useCallback((id, u) => up(p => ({ ...p, entries: p.entries.map(e => e.id === id ? { ...e, ...u } : e) })), []),
    removeEntry: useCallback((id) => up(p => ({ ...p, entries: p.entries.filter(e => e.id !== id) })), []),
    addRecurring: useCallback((r) => up(p => ({ ...p, recurrings: [...(p.recurrings || []), r] })), []),
    removeRecurring: useCallback((id) => up(p => ({ ...p, recurrings: (p.recurrings || []).filter(r => r.id !== id) })), []),
    setLimit: useCallback((key, val) => up(p => ({ ...p, limits: { ...(p.limits || {}), [key]: val } })), []),
    removeLimit: useCallback((key) => up(p => { const l = { ...(p.limits || {}) }; delete l[key]; return { ...p, limits: l }; }), []),
  };
}

function getNodeBalance(nodes, entries, nid) {
  const direct = entries.filter(e => e.nodeId === nid);
  let inc = direct.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  let exp = direct.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  nodes.filter(n => n.parentId === nid).forEach(c => { const cb = getNodeBalance(nodes, entries, c.id); inc += cb.inc; exp += cb.exp; });
  return { inc, exp, balance: inc - exp };
}

// ── Shared UI ──
function FolderSvg({ color = "#f59e0b", size = 20 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>);
}
function FolderPlusSvg({ color = "#94a3b8", size = 20 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></svg>);
}
function BottomBar({ children }) {
  return (<div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "12px 20px 20px", background: "linear-gradient(to top, #0a0a1a 60%, transparent)", display: "flex", gap: 10, zIndex: 10 }}>{children}</div>);
}
function Btn({ onClick, bg, color, children, style: extra }) {
  return (<button onClick={onClick} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em", background: bg, color, transition: "all 0.2s", ...extra }}>{children}</button>);
}
function EmptyState({ text, sub }) {
  return (<div style={{ textAlign: "center", padding: "40px 0", color: "#334155" }}><div style={{ fontSize: 32, marginBottom: 8 }}>◇</div><div style={{ fontSize: 13 }}>{text}</div>{sub && <div style={{ fontSize: 11, marginTop: 4, color: "#1e293b" }}>{sub}</div>}</div>);
}
function AnimNum({ value }) {
  const [display, setDisplay] = useState(value);
  const raf = useRef(null);
  useEffect(() => {
    const s = display, e = value; if (s === e) return;
    const t0 = performance.now();
    function tick(now) { const t = Math.min((now - t0) / 400, 1); setDisplay(s + (e - s) * (1 - Math.pow(1 - t, 3))); if (t < 1) raf.current = requestAnimationFrame(tick); }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return (<span>{fmt(display)}</span>);
}
function InlineNew({ placeholder, onCommit, onCancel, accentColor, icon }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const commit = () => { const v = ref.current?.value?.trim(); if (v) onCommit(v); else onCancel(); };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, borderLeft: `4px solid ${accentColor}`, animation: "slideIn 0.2s ease" }}>
      {icon}
      <input ref={ref} placeholder={placeholder} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }}
        style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 2px", color: "#e2e8f0", fontSize: 15, outline: "none" }} />
      <button onClick={commit} style={{ background: accentColor, border: "none", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✓</button>
    </div>
  );
}
function EditableTitle({ value, onSave, style: s }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  const commit = () => { const v = ref.current?.value?.trim(); if (v && v !== value) onSave(v); setEditing(false); };
  if (editing) return (<input ref={ref} defaultValue={value} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
    style={{ ...s, background: "rgba(255,255,255,0.06)", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", borderRadius: 0, padding: "2px 4px", outline: "none", minWidth: 0, width: "100%" }} />);
  return (<h2 onClick={() => setEditing(true)} title="Tap to rename" style={{ ...s, cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>{value}</h2>);
}
function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>⌕</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Search transactions..."
        style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px 8px 30px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
      {value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, padding: 2 }}>×</button>}
    </div>
  );
}

// ── Budget Limits Bar ──
function LimitBar({ category, spent, limit, color }) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isWarning = pct >= 80 && pct < 100;
  const isOver = pct >= 100;
  const barColor = isOver ? "#ef4444" : isWarning ? "#f59e0b" : color;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13, width: 22, textAlign: "center", color }}>{category.icon}</span>
      <span style={{ fontSize: 11, color: "#94a3b8", width: 55 }}>{category.label}</span>
      <div style={{ flex: 1, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: isOver ? "#ef4444" : isWarning ? "#f59e0b" : "#64748b", width: 80, textAlign: "right" }}>
        {fmt(spent)} / {fmt(limit)}
      </span>
    </div>
  );
}

// ── Budget Alerts ──
function BudgetAlerts({ nodeId, entries, limits }) {
  const alerts = [];
  CATEGORIES.filter(c => c.id !== "income").forEach(cat => {
    const key = `${nodeId}-${cat.id}`;
    const limit = limits[key];
    if (!limit || limit <= 0) return;
    const spent = entries.filter(e => e.nodeId === nodeId && e.category === cat.id && e.type === "expense").reduce((s, e) => s + e.amount, 0);
    const pct = (spent / limit) * 100;
    if (pct >= 100) alerts.push({ cat, pct, spent, limit, type: "over" });
    else if (pct >= 80) alerts.push({ cat, pct, spent, limit, type: "warning" });
  });
  if (alerts.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
      {alerts.map(a => (
        <div key={a.cat.id} style={{
          padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
          background: a.type === "over" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
          color: a.type === "over" ? "#ef4444" : "#f59e0b",
          border: `1px solid ${a.type === "over" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`,
        }}>
          {a.type === "over" ? "⚠ " : "⚡ "}
          <strong>{a.cat.label}</strong>: {fmt(a.spent)} of {fmt(a.limit)} ({Math.round(a.pct)}%)
          {a.type === "over" ? " — over budget!" : " — approaching limit"}
        </div>
      ))}
    </div>
  );
}

// ── Recurring Manager Panel ──
function RecurringPanel({ nodeId, recurrings, onAdd, onRemove, onAddEntry }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "", amount: "", category: "other", type: "expense", frequency: "monthly" });
  const nodeRecurrings = (recurrings || []).filter(r => r.nodeId === nodeId);

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!form.label.trim() || !amount || amount <= 0) return;
    const cat = form.type === "income" ? "income" : form.category;
    // Add the recurring rule
    onAdd({ id: uid(), nodeId, label: form.label.trim(), amount, category: cat, type: form.type, frequency: form.frequency, lastRun: new Date().toISOString() });
    // Immediately create the first transaction
    onAddEntry({ id: uid(), nodeId, label: form.label.trim(), amount, category: cat, type: form.type, date: today(), recurring: true });
    setForm({ label: "", amount: "", category: "other", type: "expense", frequency: "monthly" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Recurring ({nodeRecurrings.length})</div>
      {nodeRecurrings.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: "#334155", marginBottom: 8 }}>No recurring transactions set up</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {nodeRecurrings.map(r => {
          const cat = CATEGORIES.find(c => c.id === r.category) || CATEGORIES[7];
          const freq = FREQ.find(f => f.id === r.frequency);
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: `3px solid ${cat.color}` }}>
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{freq?.label} · {r.type === "income" ? "Income" : cat.label}</div>
              </div>
              <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: r.type === "income" ? "#22c55e" : "#f1f5f9" }}>
                {r.type === "income" ? "+" : "−"}{fmt(r.amount)}
              </span>
              <button onClick={() => onRemove(r.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>×</button>
            </div>
          );
        })}
      </div>
      {adding ? (
        <div style={{ marginTop: 8, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10, display: "flex", flexDirection: "column", gap: 8, animation: "slideIn 0.2s ease" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["expense", "income"].map(t => (
              <button key={t} onClick={() => setForm({ ...form, type: t })} style={{
                flex: 1, padding: "6px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                background: form.type === t ? (t === "income" ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.05)",
                color: form.type === t ? "#0a0a1a" : "#94a3b8",
              }}>{t}</button>
            ))}
          </div>
          <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Label (e.g. Rent)"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>$</span>
              <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="0.00"
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px 6px 22px", color: "#e2e8f0", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }} />
            </div>
            <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 8px", color: "#e2e8f0", fontSize: 12, outline: "none", cursor: "pointer" }}>
              {FREQ.map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}
            </select>
          </div>
          {form.type === "expense" && (
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 8px", color: "#e2e8f0", fontSize: 12, outline: "none", cursor: "pointer" }}>
              {CATEGORIES.filter(c => c.id !== "income").map(c => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}
            </select>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "#6366f1", color: "#fff" }}>Add Recurring</button>
            <button onClick={() => setAdding(false)} style={{ padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, color: "#94a3b8", background: "rgba(255,255,255,0.05)" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}>+ Add recurring transaction</button>
      )}
    </div>
  );
}

// ── Limits Manager Panel ──
function LimitsPanel({ nodeId, entries, limits, setLimit, removeLimit }) {
  const expenseCats = CATEGORIES.filter(c => c.id !== "income");
  const nodeExpenses = entries.filter(e => e.nodeId === nodeId && e.type === "expense");

  return (
    <div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Category Limits</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {expenseCats.map(cat => {
          const key = `${nodeId}-${cat.id}`;
          const limit = limits[key] || 0;
          const spent = nodeExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
          return (
            <div key={cat.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, width: 22, textAlign: "center", color: cat.color }}>{cat.icon}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#64748b" }}>Spent: {fmt(spent)}</span>
                <div style={{ position: "relative", width: 64 }}>
                  <span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>$</span>
                  <input type="number" min="0" step="50" value={limit || ""} onChange={e => { const v = parseFloat(e.target.value) || 0; if (v > 0) setLimit(key, v); else removeLimit(key); }} placeholder="Limit"
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "4px 6px 4px 18px", color: "#e2e8f0", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", outline: "none", textAlign: "right" }} />
                </div>
              </div>
              {limit > 0 && <LimitBar category={cat} spent={spent} limit={limit} color={cat.color} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Entry Row ──
function EntryRow({ entry, runningBalance, onUpdate, onRemove, isEditing, onStartEdit, onStopEdit }) {
  const cat = CATEGORIES.find(c => c.id === entry.category) || CATEGORIES[7];
  const isInc = entry.type === "income";
  const lRef = useRef(null), aRef = useRef(null), rRef = useRef(null);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const onTS = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; setSwiping(false); };
  const onTM = (e) => { const dx = e.touches[0].clientX - touchStart.current.x; const dy = e.touches[0].clientY - touchStart.current.y; if (Math.abs(dx) > Math.abs(dy) && dx < 0) { setSwiping(true); setSwipeX(Math.max(dx, -120)); e.preventDefault(); } };
  const onTE = () => { if (swipeX < -80) { setSwipeX(-120); setTimeout(() => onRemove(entry.id), 200); } else setSwipeX(0); setSwiping(false); };

  useEffect(() => { if (isEditing) setTimeout(() => { lRef.current?.focus(); rRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100); }, [isEditing]);

  const commit = () => { const label = lRef.current?.value?.trim(), amount = parseFloat(aRef.current?.value); if (!label && (!amount || amount === 0)) onRemove(entry.id); else onUpdate(entry.id, { label: label || "(untitled)", amount: amount || 0 }); onStopEdit(); };
  const kd = (e) => { if (e.key === "Enter") { if (e.target === lRef.current && aRef.current) aRef.current.focus(); else commit(); } if (e.key === "Escape") { if (!entry.label && entry.amount === 0) onRemove(entry.id); else onStopEdit(); } };

  if (isEditing) {
    return (
      <div ref={rRef} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 10, borderLeft: `3px solid ${cat.color}`, animation: "slideIn 0.2s ease" }}>
        {!isInc ? (<select defaultValue={entry.category} onChange={e => onUpdate(entry.id, { category: e.target.value })} style={{ background: "transparent", border: "none", color: cat.color, fontSize: 16, outline: "none", cursor: "pointer", width: 28, padding: 0, appearance: "none", WebkitAppearance: "none", textAlign: "center" }}>{CATEGORIES.filter(c => c.id !== "income").map(c => (<option key={c.id} value={c.id}>{c.icon}</option>))}</select>) : <span style={{ fontSize: 18, width: 28, textAlign: "center", color: "#22c55e" }}>↑</span>}
        <input ref={lRef} defaultValue={entry.label} placeholder={isInc ? "e.g. Salary" : "e.g. Groceries"} onKeyDown={kd} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "4px 2px", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
        <div style={{ position: "relative", width: 90 }}><span style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>$</span><input ref={aRef} defaultValue={entry.amount || ""} placeholder="0.00" inputMode="decimal" onKeyDown={kd} style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "4px 2px 4px 16px", color: isInc ? "#22c55e" : "#f1f5f9", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", outline: "none", textAlign: "right" }} /></div>
        <button onClick={commit} style={{ background: isInc ? "#22c55e" : "#6366f1", border: "none", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: isInc ? "#0a0a1a" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✓</button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 10 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 10px 10px 0", color: "#fff", fontSize: 13, fontWeight: 600 }}>Delete</div>
      <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE} onClick={() => { if (!swiping && swipeX === 0) onStartEdit(entry.id); }}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#0d1025", borderRadius: 10, borderLeft: `3px solid ${cat.color}`, transition: swiping ? "none" : "transform 0.2s ease", transform: `translateX(${swipeX}px)`, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 18, width: 28, textAlign: "center", opacity: 0.7 }}>{cat.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {entry.label || "(untitled)"}
            {entry.recurring && <span style={{ fontSize: 9, color: "#6366f1", marginLeft: 6, fontWeight: 600 }}>↻</span>}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{cat.label} · {entry.date}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14, color: isInc ? "#22c55e" : "#f1f5f9" }}>{isInc ? "+" : "−"}{fmt(Math.abs(entry.amount))}</div>
          {runningBalance !== undefined && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: runningBalance >= 0 ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)", marginTop: 1 }}>{fmt(runningBalance)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Donut ──
function DonutChart({ entries }) {
  const byC = CATEGORIES.map(c => ({ ...c, total: entries.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0) })).filter(c => c.total > 0);
  const tot = byC.reduce((s, c) => s + c.total, 0);
  if (tot === 0) return (<div style={{ textAlign: "center", padding: 20, color: "#475569", fontSize: 13 }}>No transactions yet</div>);
  const R = 38, CI = 2 * Math.PI * R; let off = 0;
  const segs = byC.map(c => { const fr = c.total / tot; const sg = { ...c, da: `${fr * CI} ${CI}`, doff: -off }; off += fr * CI; return sg; });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        {segs.map((s, i) => (<circle key={i} cx={50} cy={50} r={R} fill="none" stroke={s.color} strokeWidth={14} strokeDasharray={s.da} strokeDashoffset={s.doff} transform="rotate(-90 50 50)" />))}
        <text x="50" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{fmt(tot).replace(".00", "")}</text>
        <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="7">total</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {byC.map(a => (<div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} /><span>{a.label}</span><span style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{Math.round((a.total / tot) * 100)}%</span></div>))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// NODE PAGE
// ══════════════════════════════════════════════════
function NodePage({ node, parentName, nodes, entries, recurrings, limits, onBack, onNavigate, addNode, updateNode, removeNode, addEntry, updateEntry, removeEntry, addRecurring, removeRecurring, setLimit, removeLimit }) {
  const [addingChild, setAddingChild] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("overview"); // overview | settings

  const children = nodes.filter(n => n.parentId === node.id);
  const directEntries = entries.filter(e => e.nodeId === node.id);
  const isFolderMode = children.length > 0 || addingChild;
  const { inc, exp, balance } = getNodeBalance(nodes, entries, node.id);
  const color = node.color || "#6366f1";

  const childStats = children.map(c => ({ ...c, ...getNodeBalance(nodes, entries, c.id), childCount: nodes.filter(n => n.parentId === c.id).length }));

  let cumulative = 0;
  const runningBalances = {};
  directEntries.forEach(e => { cumulative += e.type === "income" ? e.amount : -e.amount; runningBalances[e.id] = cumulative; });

  const filteredEntries = search ? directEntries.filter(e => e.label.toLowerCase().includes(search.toLowerCase()) || (CATEGORIES.find(c => c.id === e.category)?.label || "").toLowerCase().includes(search.toLowerCase())) : directEntries;

  const handleAddEntry = (type) => { const eid = uid(); addEntry({ id: eid, nodeId: node.id, label: "", amount: 0, category: type === "income" ? "income" : "other", type, date: today() }); setEditingId(eid); setSearch(""); setTab("overview"); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#94a3b8", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ {parentName}</button>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderSvg color={color} size={15} /></div>
          <EditableTitle value={node.name} onSave={v => updateNode(node.id, { name: v })} style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#e2e8f0", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
          {(!isFolderMode || children.length > 0) && (
            <button onClick={() => setAddingChild(true)} title="Add sub-budget" style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderPlusSvg color="#94a3b8" size={18} /></button>
          )}
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 18px", marginBottom: 12, borderTop: `3px solid ${color}` }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 4 }}>Balance</div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: balance >= 0 ? "#22c55e" : "#ef4444", letterSpacing: "-0.02em" }}><AnimNum value={balance} /></div>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <div><div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Income</div><div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>+{fmt(inc)}</div></div>
            <div><div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Expenses</div><div style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>−{fmt(exp)}</div></div>
          </div>
        </div>

        {/* Budget alerts */}
        {!isFolderMode && <BudgetAlerts nodeId={node.id} entries={entries} limits={limits} />}
      </div>

      {/* Tabs for leaf nodes */}
      {!isFolderMode && (
        <div style={{ display: "flex", gap: 4, padding: "0 20px", marginBottom: 12 }}>
          {[{ id: "overview", label: "Overview" }, { id: "settings", label: "⚙ Limits & Recurring" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
              background: tab === t.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
              color: tab === t.id ? "#818cf8" : "#64748b", transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "0 20px 120px" }}>
        {isFolderMode ? (
          <>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Sub-budgets ({children.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {childStats.map(c => (
                <div key={c.id} onClick={() => onNavigate(c.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, borderLeft: `4px solid ${c.color || color}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>{c.childCount > 0 && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.childCount} sub-budget{c.childCount !== 1 ? "s" : ""}</div>}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: c.balance >= 0 ? "#22c55e" : "#ef4444" }}>{c.balance >= 0 ? "+" : "−"} {fmt(Math.abs(c.balance))}</span>
                  <span style={{ fontSize: 18, color: "#475569" }}>›</span>
                  <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${c.name}"?`)) removeNode(c.id); }} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>×</button>
                </div>
              ))}
              {addingChild && <InlineNew placeholder="Sub-budget name" accentColor={color} icon={<div style={{ width: 8 }} />}
                onCommit={name => { addNode({ id: uid(), parentId: node.id, name, color: COLORS[children.length % COLORS.length] }); setAddingChild(false); }} onCancel={() => setAddingChild(false)} />}
            </div>
            <BottomBar><Btn onClick={() => setAddingChild(true)} bg={`${color}25`} color={color}>+ New Sub-budget</Btn></BottomBar>
          </>
        ) : tab === "settings" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <LimitsPanel nodeId={node.id} entries={entries} limits={limits} setLimit={setLimit} removeLimit={removeLimit} />
            <RecurringPanel nodeId={node.id} recurrings={recurrings} onAdd={addRecurring} onRemove={removeRecurring} onAddEntry={addEntry} />
          </div>
        ) : (
          <>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 12 }}><DonutChart entries={directEntries} /></div>
            {directEntries.length > 3 && <SearchBar value={search} onChange={setSearch} />}
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Transactions ({filteredEntries.length}{search ? ` of ${directEntries.length}` : ""})</div>
            {filteredEntries.length === 0 ? <EmptyState text={search ? "No matches" : "No entries yet"} sub={search ? "Try a different search" : "Add transactions or tap ⚙ to set up recurring"} /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...filteredEntries].reverse().map(e => (<EntryRow key={e.id} entry={e} runningBalance={runningBalances[e.id]} onUpdate={updateEntry} onRemove={removeEntry} isEditing={editingId === e.id} onStartEdit={setEditingId} onStopEdit={() => setEditingId(null)} />))}
              </div>
            )}
            <BottomBar>
              <Btn onClick={() => handleAddEntry("income")} bg="rgba(34,197,94,0.15)" color="#22c55e">+ Income</Btn>
              <Btn onClick={() => handleAddEntry("expense")} bg="rgba(239,68,68,0.15)" color="#ef4444">+ Expense</Btn>
            </BottomBar>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════
export default function App() {
  const app = useApp();
  const { d } = app;
  const [navStack, setNavStack] = useState([]);
  const [addingRoot, setAddingRoot] = useState(false);

  const currentNodeId = navStack.length > 0 ? navStack[navStack.length - 1] : null;
  const currentNode = currentNodeId ? d.nodes.find(n => n.id === currentNodeId) : null;
  const parentNode = navStack.length >= 2 ? d.nodes.find(n => n.id === navStack[navStack.length - 2]) : null;

  const goTo = (nid) => setNavStack([...navStack, nid]);
  const goBack = () => setNavStack(navStack.slice(0, -1));

  const shell = (ch) => (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)", color: "#e2e8f0", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
        input::placeholder,select{color:#475569} select option{background:#1a1a2e;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
      `}</style>
      <div style={{ position: "absolute", top: -120, right: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", animation: "pulse 6s ease-in-out infinite", pointerEvents: "none" }} />
      {ch}
    </div>
  );

  if (!currentNode) {
    const rootNodes = d.nodes.filter(n => n.parentId === null);
    const stats = rootNodes.map(f => ({ ...f, ...getNodeBalance(d.nodes, d.entries, f.id), childCount: d.nodes.filter(n => n.parentId === f.id).length }));
    return shell(
      <div style={{ padding: 20, animation: "fadeIn 0.4s ease" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
          <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>Budget</span>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Folders ({rootNodes.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 100 }}>
          {stats.map(f => (
            <div key={f.id} onClick={() => goTo(f.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, borderLeft: `4px solid ${f.color}`, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderSvg color={f.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{f.name}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{f.childCount} budget{f.childCount !== 1 ? "s" : ""}</div></div>
              <span style={{ fontSize: 18, color: "#475569" }}>›</span>
              <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${f.name}"?`)) app.removeNode(f.id); }} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>×</button>
            </div>
          ))}
          {addingRoot && <InlineNew placeholder="Folder name" accentColor={COLORS[rootNodes.length % COLORS.length]}
            icon={<div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderSvg color="#6366f1" /></div>}
            onCommit={name => { app.addNode({ id: uid(), parentId: null, name, color: COLORS[rootNodes.length % COLORS.length] }); setAddingRoot(false); }} onCancel={() => setAddingRoot(false)} />}
          {!addingRoot && rootNodes.length === 0 && <EmptyState text="No folders yet" sub="Tap below to create one" />}
        </div>
        <BottomBar><Btn onClick={() => setAddingRoot(true)} bg="rgba(99,102,241,0.15)" color="#818cf8">+ New Folder</Btn></BottomBar>
      </div>
    );
  }

  return shell(
    <NodePage node={currentNode} parentName={parentNode ? parentNode.name : "Folders"}
      nodes={d.nodes} entries={d.entries} recurrings={d.recurrings} limits={d.limits}
      onBack={goBack} onNavigate={goTo}
      addNode={app.addNode} updateNode={app.updateNode} removeNode={app.removeNode}
      addEntry={app.addEntry} updateEntry={app.updateEntry} removeEntry={app.removeEntry}
      addRecurring={app.addRecurring} removeRecurring={app.removeRecurring}
      setLimit={app.setLimit} removeLimit={app.removeLimit} />
  );
}
