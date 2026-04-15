import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_CATEGORIES = [
  { id: "income", label: "Income", icon: "💰", color: "#22c55e" },
  { id: "housing", label: "Housing", icon: "🏠", color: "#f59e0b" },
  { id: "food", label: "Food", icon: "🍕", color: "#ef4444" },
  { id: "transport", label: "Transport", icon: "🚗", color: "#3b82f6" },
  { id: "utilities", label: "Utilities", icon: "⚡", color: "#8b5cf6" },
  { id: "entertainment", label: "Fun", icon: "🎮", color: "#ec4899" },
  { id: "giving", label: "Giving", icon: "🎁", color: "#f472b6" },
  { id: "savings", label: "Savings", icon: "🏦", color: "#06b6d4" },
  { id: "other", label: "Other", icon: "📋", color: "#f97316" },
];
function getCats(custom = []) { return [...DEFAULT_CATEGORIES, ...custom.filter(c => c.id && !DEFAULT_CATEGORIES.find(d => d.id === c.id))]; }
// Keep a global ref so getCats can always access custom categories
window.__CUSTOM_CATS__ = [];
function allCats() { return getCats(window.__CUSTOM_CATS__ || []); }
const ICONS = ["🛒","🏥","👶","🐾","🎓","💪","✈️","🎁","☕","📱","💇","🔧","🏋️","🎵","📚","👗","🧹","💊","🚌","🍔","🎬","💡","🏖️","🛍️"];

// ── Smart Categorization ──
const KEYWORD_MAP = {
  housing: ["rent", "mortgage", "hoa", "property", "lease", "apartment", "housing", "landlord", "realtor"],
  food: ["grocery", "groceries", "walmart", "costco", "kroger", "aldi", "trader joe", "whole foods", "safeway", "publix", "heb", "food", "restaurant", "dining", "doordash", "uber eats", "grubhub", "chipotle", "mcdonald", "starbucks", "coffee", "pizza", "chick-fil-a", "wendy", "taco bell", "panera", "subway", "lunch", "dinner", "breakfast"],
  transport: ["gas", "shell", "exxon", "chevron", "bp", "fuel", "uber", "lyft", "parking", "toll", "car wash", "auto", "mechanic", "oil change", "tire", "car payment", "car insurance", "vehicle", "transit", "metro", "bus pass"],
  utilities: ["electric", "electricity", "power", "water", "gas bill", "internet", "wifi", "phone bill", "cell phone", "verizon", "att", "t-mobile", "sprint", "comcast", "xfinity", "duke energy", "utility", "sewer", "trash", "waste"],
  entertainment: ["netflix", "hulu", "disney", "spotify", "apple music", "youtube", "hbo", "amazon prime", "movie", "theater", "concert", "game", "steam", "playstation", "xbox", "nintendo", "subscription", "fun", "entertainment", "bowling", "arcade", "bar", "drinks"],
  giving: ["tithe", "tithes", "tithe", "offering", "donation", "donate", "charity", "church", "giving", "gift", "missionary", "missions"],
  savings: ["savings", "invest", "investment", "401k", "ira", "roth", "stock", "crypto", "emergency fund", "transfer to savings", "deposit"],
  income: ["paycheck", "salary", "direct deposit", "wage", "bonus", "freelance", "commission", "refund", "reimbursement", "dividend", "interest", "income", "side hustle", "payment received"],
};

function guessCategory(label, entries = []) {
  if (!label) return null;
  const lower = label.toLowerCase().trim();

  // First check user's past categorizations for this exact label
  const pastMatch = entries.find(e => e.label && e.label.toLowerCase().trim() === lower && e.category && e.category !== "other");
  if (pastMatch) return pastMatch.category;

  // Then check keyword partial matches from history (e.g. user always puts "Target" as food)
  const pastPartial = entries.find(e => e.label && e.category && e.category !== "other" && (
    lower.includes(e.label.toLowerCase().trim()) || e.label.toLowerCase().trim().includes(lower)
  ) && lower.length > 2);
  if (pastPartial) return pastPartial.category;

  // Finally check the built-in keyword map
  for (const [catId, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw) || kw.includes(lower)) return catId;
    }
  }

  return null;
}
const PALETTE = ["#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#14b8a6","#f97316","#a855f7","#64748b"];
const FREQ = [{ id: "weekly", label: "Weekly", days: 7 },{ id: "biweekly", label: "Bi-weekly", days: 14 },{ id: "semimonthly", label: "Semi-monthly", days: 15 },{ id: "monthly", label: "Monthly", days: 30 },{ id: "yearly", label: "Yearly", days: 365 }];

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
    selectBg: "#1a1a2e",
    font: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    fontImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
  },
  ocean: {
    id: "ocean", name: "Ocean Depth",
    bg: "linear-gradient(170deg, #021a1a 0%, #042f2e 40%, #021a1a 100%)",
    text: "#e0f2f1", textSub: "#80cbc4", textMuted: "#4d7c7a", textDim: "#3d6361", textDark: "#2d4a49",
    accent: "#0d9488", accentLight: "#14b8a6",
    inc: "#2dd4bf", exp: "#fb923c",
    card: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(20,184,166,0.01))",
    cardBorder: "rgba(20,184,166,0.12)", surface: "rgba(20,184,166,0.04)", surfaceHover: "rgba(20,184,166,0.08)",
    row: "#0a2524", inputBg: "rgba(20,184,166,0.06)", inputBorder: "rgba(20,184,166,0.12)",
    glow: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
    titleGrad: "linear-gradient(135deg, #5eead4, #14b8a6)",
    selectBg: "#0a2524",
    font: "'Sora', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
    fontImport: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap",
  },
};
function T() { return THEMES[window.__THEME__ || "midnight"] || THEMES.midnight; }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmt(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n); }
function todayStr() { return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) { if (!iso) return todayStr(); const d = new Date(iso + "T12:00:00"); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function daysBetween(a, b) { return Math.floor((b - a) / 864e5); }
function haptic(ms = 10) { try { navigator.vibrate?.(ms); } catch {} }

// ── Recurrings on load ──
function processRecurrings(data) {
  const now = new Date();
  let { nodes, entries, recurrings = [], limits = {} } = data;
  let changed = false; const ne = [];
  recurrings = recurrings.map(r => {
    const f = FREQ.find(x => x.id === r.frequency); if (!f) return r;
    const last = r.lastRun ? new Date(r.lastRun) : new Date(0);
    const gap = daysBetween(last, now);
    if (gap >= f.days) {
      for (let i = 0; i < Math.floor(gap / f.days); i++) ne.push({ id: uid(), nodeId: r.nodeId, label: r.label + " (auto)", amount: r.amount, category: r.category, type: r.type, date: todayStr(), dateISO: todayISO(), recurring: true, tags: [] });
      changed = true; return { ...r, lastRun: now.toISOString() };
    }
    return r;
  });
  return changed ? { nodes, entries: [...entries, ...ne], recurrings, limits } : { ...data, recurrings: data.recurrings || [], limits: data.limits || {} };
}

// ── CSV ──
function exportCSV(entries, name) {
  const rows = [["Date","Label","Category","Type","Amount","Tags"]];
  entries.forEach(e => { const c = allCats().find(x => x.id === e.category); rows.push([e.date, e.label, c?.label || e.category, e.type, e.type === "income" ? e.amount : -e.amount, (e.tags || []).join(";")]); });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const b = new Blob([csv], { type: "text/csv" }); const u = URL.createObjectURL(b);
  const a = document.createElement("a"); a.href = u; a.download = `${name || "maverick"}-export.csv`; a.click(); URL.revokeObjectURL(u);
}
function parseCSV(text) {
  const lines = text.trim().split("\n").map(l => { const r = []; let cur = "", inQ = false; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '"') inQ = !inQ; else if (ch === "," && !inQ) { r.push(cur.trim()); cur = ""; } else cur += ch; } r.push(cur.trim()); return r; });
  if (lines.length < 2) return [];
  return lines.slice(1).map(r => { const amt = Math.abs(parseFloat(r[4]) || 0); const type = parseFloat(r[4]) >= 0 ? "income" : "expense"; const cl = (r[2]||"").toLowerCase(); const cat = allCats().find(c => c.label.toLowerCase() === cl) ||{id:"other",label:"Other",icon:"📋",color:"#f97316"}; const tags = r[5] ? r[5].split(";").filter(Boolean) : []; return { label: r[1] || "(imported)", category: type === "income" ? "income" : cat.id, type, amount: amt, date: r[0] || todayStr(), tags }; }).filter(e => e.amount > 0);
}

// ── State with Firebase Sync ──
import { db, auth, signOut, doc, setDoc, onSnapshot, requestNotificationPermission, getNotificationPrefs, setNotificationPrefs, DEFAULT_NOTIFICATION_PREFS } from "./firebase";
import NotificationManager from "./NotificationManager";
import { deleteDoc } from "firebase/firestore";

const EMPTY_DATA = { nodes: [], entries: [], recurrings: [], limits: {}, customCategories: [], envelopes: {} };

function useApp(user, householdId) {
  const [d, setD] = useState(EMPTY_DATA);
  const [synced, setSynced] = useState(false);
  const saveTimer = useRef(null);
  const skipNextRemote = useRef(false);
  const docRef = householdId ? doc(db, "households", householdId, "data", "budget") : null;

  useEffect(() => { window.__CUSTOM_CATS__ = d.customCategories || []; }, [d]);

  useEffect(() => {
    if (!docRef) return;
    const unsub = onSnapshot(docRef, (snap) => {
      if (skipNextRemote.current) { skipNextRemote.current = false; return; }
      if (snap.exists()) {
        const r = snap.data();
        setD(processRecurrings({ nodes: r.nodes||[], entries: r.entries||[], recurrings: r.recurrings||[], limits: r.limits||{}, customCategories: r.customCategories||[], envelopes: r.envelopes||{} }));
      }
      setSynced(true);
    }, () => { try { const r = localStorage.getItem("maverick-budget-data"); if (r) setD(processRecurrings(JSON.parse(r))); } catch {} setSynced(true); });
    return unsub;
  }, [householdId]);

  const saveToCloud = useCallback((data) => {
    try { localStorage.setItem("maverick-budget-data", JSON.stringify(data)); } catch {}
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { if (docRef) { skipNextRemote.current = true; setDoc(docRef, { ...data, updatedAt: new Date().toISOString(), updatedBy: user?.email||"unknown" }).catch(e => console.error("Save:",e)); } }, 500);
  }, [docRef, user]);

  const up = fn => setD(p => { const next = fn(p); saveToCloud(next); return next; });
  const getDesc = useCallback((nodes, nid) => { const kids = nodes.filter(n => n.parentId === nid); let all = kids.map(k => k.id); kids.forEach(k => { all = all.concat(getDesc(nodes, k.id)); }); return all; }, []);
  return {
    d, synced,
    cats: getCats(d.customCategories),
    addNode: useCallback(n => up(p => ({ ...p, nodes: [...p.nodes, n] })), []),
    updateNode: useCallback((id, u) => up(p => ({ ...p, nodes: p.nodes.map(n => n.id === id ? { ...n, ...u } : n) })), []),
    removeNode: useCallback(id => up(p => { const all = [id, ...getDesc(p.nodes, id)]; return { ...p, nodes: p.nodes.filter(n => !all.includes(n.id)), entries: p.entries.filter(e => !all.includes(e.nodeId)), recurrings: (p.recurrings||[]).filter(r => !all.includes(r.nodeId)) }; }), [getDesc]),
    reorderNodes: useCallback((pid, ids) => up(p => { const others = p.nodes.filter(n => n.parentId !== pid); const reordered = ids.map(id => p.nodes.find(n => n.id === id)).filter(Boolean); return { ...p, nodes: [...others, ...reordered] }; }), []),
    addEntry: useCallback(e => up(p => ({ ...p, entries: [...p.entries, e] })), []),
    updateEntry: useCallback((id, u) => up(p => ({ ...p, entries: p.entries.map(e => e.id === id ? { ...e, ...u } : e) })), []),
    removeEntry: useCallback(id => up(p => ({ ...p, entries: p.entries.filter(e => e.id !== id) })), []),
    reorderEntries: useCallback((nodeId, orderedIds) => up(p => {
      const others = p.entries.filter(e => e.nodeId !== nodeId);
      const reordered = orderedIds.map(id => p.entries.find(e => e.id === id)).filter(Boolean);
      return { ...p, entries: [...others, ...reordered] };
    }), []),
    addRecurring: useCallback(r => up(p => ({ ...p, recurrings: [...(p.recurrings||[]), r] })), []),
    updateRecurring: useCallback((id, u) => up(p => ({ ...p, recurrings: (p.recurrings||[]).map(r => r.id === id ? { ...r, ...u } : r) })), []),
    removeRecurring: useCallback(id => up(p => ({ ...p, recurrings: (p.recurrings||[]).filter(r => r.id !== id) })), []),
    setLimit: useCallback((k, v) => up(p => ({ ...p, limits: { ...(p.limits||{}), [k]: v } })), []),
    removeLimit: useCallback(k => up(p => { const l = { ...(p.limits||{}) }; delete l[k]; return { ...p, limits: l }; }), []),
    addCategory: useCallback(c => up(p => ({ ...p, customCategories: [...(p.customCategories||[]), c] })), []),
    removeCategory: useCallback(id => up(p => ({ ...p, customCategories: (p.customCategories||[]).filter(c => c.id !== id) })), []),
    setEnvelope: useCallback((nodeId, categoryId, envData) => up(p => ({
      ...p, envelopes: { ...(p.envelopes||{}), [nodeId]: { ...((p.envelopes||{})[nodeId]||{}), [categoryId]: typeof envData === "number" ? { cap: envData } : envData } }
    })), []),
    removeEnvelope: useCallback((nodeId, categoryId) => up(p => {
      const nodeEnvs = { ...((p.envelopes||{})[nodeId]||{}) }; delete nodeEnvs[categoryId];
      const envs = { ...(p.envelopes||{}) };
      if (Object.keys(nodeEnvs).length === 0) delete envs[nodeId]; else envs[nodeId] = nodeEnvs;
      return { ...p, envelopes: envs };
    }), []),
    getDesc,
  };
}

function getNodeBalance(nodes, entries, nid) {
  const d = entries.filter(e => e.nodeId === nid);
  let inc = d.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  let exp = d.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  nodes.filter(n => n.parentId === nid).forEach(c => { const cb = getNodeBalance(nodes, entries, c.id); inc += cb.inc; exp += cb.exp; });
  return { inc, exp, balance: inc - exp };
}

// Get all entries under a node recursively
function getAllDescendantEntries(nodes, entries, nid) {
  let result = entries.filter(e => e.nodeId === nid);
  nodes.filter(n => n.parentId === nid).forEach(c => { result = result.concat(getAllDescendantEntries(nodes, entries, c.id)); });
  return result;
}

// ── Shared UI ──
function FolderSvg({ color = "#f59e0b", size = 20 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>); }
function FolderPlusSvg({ color = "#94a3b8", size = 20 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></svg>); }
function BottomBar({ children }) { return (<div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "12px 20px 20px", background: `linear-gradient(to top, ${T().bg.includes("#0a0a1a") ? "#0a0a1a" : "#021a1a"} 60%, transparent)`, display: "flex", gap: 10, zIndex: 10 }}>{children}</div>); }
function Btn({ onClick, bg, color, children }) { return (<button onClick={onClick} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em", background: bg, color, transition: "all 0.2s" }}>{children}</button>); }
function EmptyState({ text, sub }) { return (<div style={{ textAlign: "center", padding: "40px 0", color: "#334155" }}><div style={{ fontSize: 32, marginBottom: 8 }}>◇</div><div style={{ fontSize: 13 }}>{text}</div>{sub && <div style={{ fontSize: 11, marginTop: 4, color: "#1e293b" }}>{sub}</div>}</div>); }
function AnimNum({ value }) { const [d, sD] = useState(value); const r = useRef(); useEffect(() => { const s = d, e = value; if (s === e) return; const t0 = performance.now(); function tk(n) { const t = Math.min((n - t0) / 400, 1); sD(s + (e - s) * (1 - Math.pow(1 - t, 3))); if (t < 1) r.current = requestAnimationFrame(tk); } r.current = requestAnimationFrame(tk); return () => cancelAnimationFrame(r.current); }, [value]); return (<span>{fmt(d)}</span>); }
function InlineNew({ placeholder, onCommit, onCancel, accentColor, icon }) { const ref = useRef(null); useEffect(() => { ref.current?.focus(); }, []); const commit = () => { const v = ref.current?.value?.trim(); if (v) onCommit(v); else onCancel(); }; return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, borderLeft: `4px solid ${accentColor}`, animation: "slideIn 0.2s ease" }}>{icon}<input ref={ref} placeholder={placeholder} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }} style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 2px", color: T().text, fontSize: 15, outline: "none" }} /><button onClick={commit} style={{ background: accentColor, border: "none", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✓</button></div>); }
function EditableTitle({ value, onSave, style: s }) { const [editing, setEditing] = useState(false); const ref = useRef(null); useEffect(() => { if (editing) ref.current?.focus(); }, [editing]); const commit = () => { const v = ref.current?.value?.trim(); if (v && v !== value) onSave(v); setEditing(false); }; if (editing) return (<input ref={ref} defaultValue={value} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} style={{ ...s, background: "rgba(255,255,255,0.06)", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", borderRadius: 0, padding: "2px 4px", outline: "none", minWidth: 0, width: "100%" }} />); return (<h2 onClick={() => setEditing(true)} title="Tap to rename" style={{ ...s, cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>{value}</h2>); }
function SearchBar({ value, onChange }) { return (<div style={{ position: "relative", marginBottom: 12 }}><span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>⌕</span><input value={value} onChange={e => onChange(e.target.value)} placeholder="Search transactions..." style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px 8px 30px", color: T().text, fontSize: 13, outline: "none" }} />{value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}>×</button>}</div>); }
function ColorPicker({ value, onChange }) { const [open, setOpen] = useState(false); return (<div style={{ position: "relative" }}><button onClick={() => setOpen(!open)} style={{ width: 26, height: 26, borderRadius: 6, background: value, border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", flexShrink: 0 }} />{open && <div style={{ position: "absolute", top: 32, right: 0, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 8, display: "flex", flexWrap: "wrap", gap: 6, width: 140, zIndex: 20, animation: "slideIn 0.15s ease" }}>{PALETTE.map(c => (<button key={c} onClick={() => { onChange(c); setOpen(false); }} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: c === value ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", padding: 0 }} />))}</div>}</div>); }
function DraggableList({ items, renderItem, onReorder }) {
  const [order, setOrder] = useState(null); // reordered indices during drag
  const [dragIdx, setDragIdx] = useState(null);
  const [dragY, setDragY] = useState(0);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const heights = useRef([]);
  const startY = useRef(0);
  const startIdx = useRef(0);
  const currentOver = useRef(0);
  const active = useRef(false);

  const captureHeights = () => {
    heights.current = rowRefs.current.map(el => el?.getBoundingClientRect()?.height || 56);
  };

  const handleTouchStart = (e, i) => {
    captureHeights();
    startY.current = e.touches[0].clientY;
    startIdx.current = i;
    currentOver.current = i;
    active.current = true;
    setDragIdx(i);
    setDragY(0);
    setOrder(items.map((_, idx) => idx));
    haptic(10);
  };

  const handleTouchMove = (e) => {
    if (!active.current || dragIdx === null) return;
    e.preventDefault();
    const y = e.touches[0].clientY;
    const dy = y - startY.current;
    setDragY(dy);

    // Figure out which index the dragged item should be at
    let cumulative = 0;
    let newIdx = startIdx.current;
    if (dy > 0) {
      // Moving down
      for (let i = startIdx.current + 1; i < items.length; i++) {
        cumulative += heights.current[i];
        if (dy > cumulative - heights.current[i] / 2) newIdx = i;
        else break;
      }
    } else {
      // Moving up
      for (let i = startIdx.current - 1; i >= 0; i--) {
        cumulative -= heights.current[i];
        if (dy < cumulative + heights.current[i] / 2) newIdx = i;
        else break;
      }
    }

    if (newIdx !== currentOver.current) {
      currentOver.current = newIdx;
      haptic(3);
      // Build new order
      const newOrder = items.map((_, idx) => idx);
      const [moved] = newOrder.splice(startIdx.current, 1);
      newOrder.splice(newIdx, 0, moved);
      setOrder(newOrder);
    }
  };

  const handleTouchEnd = () => {
    if (!active.current) return;
    active.current = false;
    if (order && currentOver.current !== startIdx.current) {
      const finalOrder = order.map(i => items[i].id);
      onReorder(finalOrder);
      haptic(12);
    }
    // Set global flag to suppress clicks right after drag
    window.__DRAG_ENDED__ = Date.now();
    setDragIdx(null);
    setDragY(0);
    setOrder(null);
  };

  // Calculate Y offset for each item based on current drag reorder
  const getTranslateY = (i) => {
    if (dragIdx === null || !order) return 0;
    if (i === startIdx.current) return 0; // dragged item uses dragY
    const currentPos = order.indexOf(i);
    const originalPos = i;
    const diff = currentPos - originalPos;
    if (diff === 0) return 0;
    // Shift by the height of the dragged item
    return diff * (heights.current[startIdx.current] || 56);
  };

  return (
    <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}
      onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      {items.map((item, i) => {
        const isDragged = dragIdx === i;
        const ty = isDragged ? dragY : getTranslateY(i);
        return (
          <div key={item.id} ref={el => rowRefs.current[i] = el}
            style={{
              transform: `translateY(${ty}px)${isDragged ? " scale(1.02)" : ""}`,
              transition: isDragged ? "none" : "transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
              zIndex: isDragged ? 50 : 1,
              opacity: isDragged ? 0.9 : 1,
              boxShadow: isDragged ? "0 8px 30px rgba(0,0,0,0.4)" : "none",
              borderRadius: 12,
              position: "relative",
            }}>
            {renderItem(item, i, (e) => handleTouchStart(e, i))}
          </div>
        );
      })}
    </div>
  );
}

// ── Scroll Container — only scrolls when content overflows ──
function ScrollContainer({ children }) {
  const ref = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const check = () => {
      if (ref.current) {
        setNeedsScroll(ref.current.scrollHeight > ref.current.clientHeight);
      }
    };
    check();
    const obs = new ResizeObserver(check);
    if (ref.current) obs.observe(ref.current);
    // Also recheck on any DOM changes
    const mut = new MutationObserver(check);
    if (ref.current) mut.observe(ref.current, { childList: true, subtree: true });
    return () => { obs.disconnect(); mut.disconnect(); };
  }, []);

  return (
    <div ref={ref} style={{
      height: "100vh", overflowY: needsScroll ? "auto" : "hidden",
      WebkitOverflowScrolling: "touch", overscrollBehavior: "none",
    }}>
      {children}
    </div>
  );
}

// ── Tags Input ──
function TagsInput({ tags = [], onChange }) {
  const [input, setInput] = useState("");
  const addTag = (t) => { const v = t.trim().toLowerCase(); if (v && !tags.includes(v)) { onChange([...tags, v]); haptic(5); } setInput(""); };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", paddingLeft: 34 }}>
      <span style={{ fontSize: 11, color: T().textMuted }}>Tags:</span>
      {tags.map(t => (
        <span key={t} onClick={() => onChange(tags.filter(x => x !== t))} style={{ fontSize: 10, background: "rgba(99,102,241,0.2)", color: T().accentLight, borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>{t} ×</span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); } }}
        placeholder="add tag" style={{ background: "transparent", border: "none", color: T().text, fontSize: 11, outline: "none", width: 60, padding: "2px 0" }} />
    </div>
  );
}

// ── Monthly Trends (bar chart for folder view) ──
function MonthlyTrends({ entries }) {
  const months = {};
  entries.forEach(e => {
    const key = e.dateISO ? e.dateISO.slice(0, 7) : "unknown";
    if (key === "unknown") return;
    if (!months[key]) months[key] = { inc: 0, exp: 0 };
    if (e.type === "income") months[key].inc += e.amount; else months[key].exp += e.amount;
  });
  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  if (sorted.length < 2) return null;
  const maxVal = Math.max(...sorted.map(([, v]) => Math.max(v.inc, v.exp)), 1);

  return (
    <div style={{ background: T().surface, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Monthly Trends</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
        {sorted.map(([key, v]) => {
          const label = new Date(key + "-15").toLocaleDateString("en-US", { month: "short" });
          const incH = (v.inc / maxVal) * 70;
          const expH = (v.exp / maxVal) * 70;
          return (
            <div key={key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 70 }}>
                <div style={{ width: 8, height: Math.max(2, incH), background: "#22c55e", borderRadius: 2 }} />
                <div style={{ width: 8, height: Math.max(2, expH), background: "#ef4444", borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: T().textMuted }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
        <span style={{ fontSize: 9, color: T().textMuted }}><span style={{ display: "inline-block", width: 8, height: 8, background: "#22c55e", borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />Income</span>
        <span style={{ fontSize: 9, color: T().textMuted }}><span style={{ display: "inline-block", width: 8, height: 8, background: "#ef4444", borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />Expenses</span>
      </div>
    </div>
  );
}

// ── Year in Review ──
function YearInReview({ entries }) {
  const year = new Date().getFullYear();
  const yearEntries = entries.filter(e => e.dateISO && e.dateISO.startsWith(String(year)));
  if (yearEntries.length < 3) return null;
  const totalInc = yearEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExp = yearEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const topCats = allCats().filter(c => c.id !== "income").map(c => ({ ...c, total: yearEntries.filter(e => e.category === c.id && e.type === "expense").reduce((s, e) => s + e.amount, 0) })).filter(c => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 3);
  const months = new Set(yearEntries.map(e => e.dateISO.slice(0, 7)));
  const avgMonth = months.size > 0 ? totalExp / months.size : 0;

  return (
    <div style={{ background: T().surface, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{year} Summary</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        <div><div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase" }}>Income</div><div style={{ fontSize: 14, fontWeight: 600, color: T().inc, fontFamily: T().mono }}>+{fmt(totalInc)}</div></div>
        <div><div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase" }}>Spent</div><div style={{ fontSize: 14, fontWeight: 600, color: T().exp, fontFamily: T().mono }}>−{fmt(totalExp)}</div></div>
        <div><div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase" }}>Avg/mo</div><div style={{ fontSize: 14, fontWeight: 600, color: T().textSub, fontFamily: T().mono }}>{fmt(avgMonth)}</div></div>
      </div>
      {topCats.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>Top categories:</div>
          {topCats.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T().textSub, marginBottom: 2 }}>
              <span style={{ color: c.color }}>{c.icon}</span> <span>{c.label}</span>
              <span style={{ fontFamily: T().mono, color: T().textMuted, marginLeft: "auto" }}>{fmt(c.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Budget Alerts ──
function BudgetAlerts({ nodeId, entries, limits }) { const alerts = []; allCats().filter(c => c.id !== "income").forEach(cat => { const k = `${nodeId}-${cat.id}`; const lim = limits[k]; if (!lim || lim <= 0) return; const spent = entries.filter(e => e.nodeId === nodeId && e.category === cat.id && e.type === "expense").reduce((s, e) => s + e.amount, 0); const pct = (spent / lim) * 100; if (pct >= 100) alerts.push({ cat, pct, spent, lim, type: "over" }); else if (pct >= 80) alerts.push({ cat, pct, spent, lim, type: "warning" }); }); if (!alerts.length) return null; return (<div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>{alerts.map(a => (<div key={a.cat.id} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: a.type === "over" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: a.type === "over" ? "#ef4444" : "#f59e0b", border: `1px solid ${a.type === "over" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}` }}>{a.type === "over" ? "⚠ " : "⚡ "}<strong>{a.cat.label}</strong>: {fmt(a.spent)} of {fmt(a.lim)} ({Math.round(a.pct)}%){a.type === "over" ? " — over budget!" : " — nearing limit"}</div>))}</div>); }

// ── Recurring Panel ──
function RecurringPanel({ nodeId, recurrings, onAdd, onUpdate, onRemove, onAddEntry }) {
  const [adding, setAdding] = useState(false); const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: "", amount: "", category: "other", type: "expense", frequency: "monthly" });
  const nr = (recurrings||[]).filter(r => r.nodeId === nodeId);
  const handleAdd = () => { const amount = parseFloat(form.amount); if (!form.label.trim() || !amount || amount <= 0) return; const cat = form.type === "income" ? "income" : form.category; onAdd({ id: uid(), nodeId, label: form.label.trim(), amount, category: cat, type: form.type, frequency: form.frequency, lastRun: new Date().toISOString() }); onAddEntry({ id: uid(), nodeId, label: form.label.trim(), amount, category: cat, type: form.type, date: todayStr(), dateISO: todayISO(), recurring: true, tags: [] }); setForm({ label: "", amount: "", category: "other", type: "expense", frequency: "monthly" }); setAdding(false); haptic(); };
  const RR = ({ r }) => { const cat = allCats().find(c => c.id === r.category)||{id:"other",label:"Other",icon:"📋",color:"#f97316"}; const freq = FREQ.find(f => f.id === r.frequency); const isE = editingId === r.id; const [ef, setEf] = useState({ label: r.label, amount: String(r.amount), category: r.category, type: r.type, frequency: r.frequency });
    const commitEdit = () => { const amt = parseFloat(ef.amount); if (!ef.label.trim() || !amt) { setEditingId(null); return; } onUpdate(r.id, { label: ef.label.trim(), amount: amt, category: ef.type === "income" ? "income" : ef.category, type: ef.type, frequency: ef.frequency }); setEditingId(null); haptic(); };
    if (isE) return (<div style={{ padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8, borderLeft: `3px solid ${cat.color}`, display: "flex", flexDirection: "column", gap: 6, animation: "slideIn 0.15s ease" }}><div style={{ display: "flex", gap: 6 }}>{["expense","income"].map(t => (<button key={t} onClick={() => setEf({...ef,type:t})} style={{ flex: 1, padding: "5px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, textTransform: "uppercase", background: ef.type === t ? (t === "income" ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.05)", color: ef.type === t ? "#0a0a1a" : "#94a3b8" }}>{t}</button>))}</div><input value={ef.label} onChange={e => setEf({...ef,label:e.target.value})} placeholder="Label" style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", color: T().text, fontSize: 12, outline: "none" }} /><div style={{ display: "flex", gap: 6 }}><div style={{ position: "relative", flex: 1 }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 11, fontFamily: T().mono }}>$</span><input value={ef.amount} onChange={e => setEf({...ef,amount:e.target.value.replace(/[^0-9.]/g,"")})} placeholder="0.00" style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px 5px 20px", color: T().text, fontSize: 12, fontFamily: T().mono, outline: "none" }} /></div><select value={ef.frequency} onChange={e => setEf({...ef,frequency:e.target.value})} style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 6px", color: T().text, fontSize: 11, outline: "none" }}>{FREQ.map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</select></div>{ef.type === "expense" && <select value={ef.category} onChange={e => setEf({...ef,category:e.target.value})} style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 6px", color: T().text, fontSize: 11, outline: "none" }}>{allCats().filter(c => c.id !== "income").map(c => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}</select>}<div style={{ display: "flex", gap: 6 }}><button onClick={commitEdit} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: T().accent, color: "#fff" }}>Save</button><button onClick={() => setEditingId(null)} style={{ padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, color: T().textSub, background: T().inputBg }}>Cancel</button><button onClick={() => { onRemove(r.id); setEditingId(null); haptic(); }} style={{ padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>Delete</button></div></div>);
    return (<div onClick={() => setEditingId(r.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: T().surface, borderRadius: 8, borderLeft: `3px solid ${cat.color}`, cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}><span style={{ fontSize: 14 }}>{cat.icon}</span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, color: T().text, fontWeight: 500 }}>{r.label}</div><div style={{ fontSize: 10, color: T().textMuted }}>{freq?.label} · {r.type === "income" ? "Income" : cat.label}</div></div><span style={{ fontSize: 13, fontFamily: T().mono, fontWeight: 600, color: r.type === "income" ? "#22c55e" : "#f1f5f9" }}>{r.type === "income" ? "+" : "−"}{fmt(r.amount)}</span><span style={{ fontSize: 10, color: "#475569" }}>✎</span></div>);
  };
  return (<div><div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Recurring ({nr.length})</div>{nr.length === 0 && !adding && <div style={{ fontSize: 12, color: "#334155", marginBottom: 8 }}>No recurring transactions</div>}<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{nr.map(r => (<RR key={r.id} r={r} />))}</div>{adding ? (<div style={{ marginTop: 8, padding: 12, background: T().surface, borderRadius: 10, display: "flex", flexDirection: "column", gap: 8, animation: "slideIn 0.2s ease" }}><div style={{ display: "flex", gap: 6 }}>{["expense","income"].map(t => (<button key={t} onClick={() => setForm({...form,type:t})} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, textTransform: "uppercase", background: form.type === t ? (t === "income" ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.05)", color: form.type === t ? "#0a0a1a" : "#94a3b8" }}>{t}</button>))}</div><input value={form.label} onChange={e => setForm({...form,label:e.target.value})} placeholder="Label" style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", color: T().text, fontSize: 13, outline: "none" }} /><div style={{ display: "flex", gap: 6 }}><div style={{ position: "relative", flex: 1 }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 12, fontFamily: T().mono }}>$</span><input value={form.amount} onChange={e => setForm({...form,amount:e.target.value.replace(/[^0-9.]/g,"")})} placeholder="0.00" style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px 6px 22px", color: T().text, fontSize: 13, fontFamily: T().mono, outline: "none" }} /></div><select value={form.frequency} onChange={e => setForm({...form,frequency:e.target.value})} style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 8px", color: T().text, fontSize: 12, outline: "none" }}>{FREQ.map(f => (<option key={f.id} value={f.id}>{f.label}</option>))}</select></div>{form.type === "expense" && <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 8px", color: T().text, fontSize: 12, outline: "none" }}>{allCats().filter(c => c.id !== "income").map(c => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}</select>}<div style={{ display: "flex", gap: 6 }}><button onClick={handleAdd} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: T().accent, color: "#fff" }}>Add Recurring</button><button onClick={() => setAdding(false)} style={{ padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, color: T().textSub, background: T().inputBg }}>Cancel</button></div></div>) : <button onClick={() => setAdding(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)", background: "transparent", color: T().textMuted, fontSize: 12, cursor: "pointer" }}>+ Add recurring</button>}</div>);
}

// ── Limits Panel ──
function LimitsPanel({ nodeId, entries, limits, setLimit, removeLimit }) { const cats = allCats().filter(c => c.id !== "income"); const ne = entries.filter(e => e.nodeId === nodeId && e.type === "expense"); return (<div><div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Category Limits</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{cats.map(cat => { const key = `${nodeId}-${cat.id}`; const lim = limits[key]||0; const spent = ne.filter(e => e.category === cat.id).reduce((s,e) => s+e.amount, 0); const pct = lim > 0 ? Math.min((spent/lim)*100,100) : 0; const over = lim > 0 && spent > lim; const warn = pct >= 80 && !over; return (<div key={cat.id}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><span style={{ fontSize: 13, width: 22, textAlign: "center", color: cat.color }}>{cat.icon}</span><span style={{ fontSize: 11, color: T().textSub, flex: 1 }}>{cat.label}</span><span style={{ fontSize: 10, fontFamily: T().mono, color: T().textMuted }}>Spent: {fmt(spent)}</span><div style={{ position: "relative", width: 64 }}><span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 10, fontFamily: T().mono }}>$</span><input type="number" min="0" step="50" value={lim||""} onChange={e => { const v = parseFloat(e.target.value)||0; if (v > 0) setLimit(key,v); else removeLimit(key); }} placeholder="Limit" style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "4px 6px 4px 18px", color: T().text, fontSize: 11, fontFamily: T().mono, outline: "none", textAlign: "right" }} /></div></div>{lim > 0 && <div style={{ height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: over ? "#ef4444" : warn ? "#f59e0b" : cat.color, borderRadius: 3, transition: "width 0.5s ease" }} /></div>}</div>); })}</div></div>); }

// ── Category Manager ──
function CategoryManager({ customCategories = [], onAdd, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "", icon: "●", color: T().accent });
  const handleAdd = () => {
    const label = form.label.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now().toString(36).slice(-3);
    onAdd({ id, label, icon: form.icon, color: form.color });
    setForm({ label: "", icon: "●", color: T().accent }); setAdding(false); haptic();
  };
  return (
    <div>
      <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Custom Categories ({customCategories.length})</div>
      {customCategories.length === 0 && !adding && <div style={{ fontSize: 12, color: "#334155", marginBottom: 8 }}>Default categories only</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {customCategories.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: T().surface, borderRadius: 8, borderLeft: `3px solid ${c.color}` }}>
            <span style={{ fontSize: 14 }}>{c.icon}</span>
            <span style={{ fontSize: 12, color: T().text, flex: 1 }}>{c.label}</span>
            <button onClick={() => { onRemove(c.id); haptic(); }} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "2px 4px" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>×</button>
          </div>
        ))}
      </div>
      {adding ? (
        <div style={{ marginTop: 6, padding: 10, background: T().surface, borderRadius: 10, display: "flex", flexDirection: "column", gap: 8, animation: "slideIn 0.15s ease" }}>
          <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Category name"
            style={{ background: T().inputBg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", color: T().text, fontSize: 13, outline: "none" }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T().textMuted }}>Icon:</span>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flex: 1 }}>
              {ICONS.slice(0, 12).map(ic => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  style={{ width: 26, height: 26, borderRadius: 5, border: form.icon === ic ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.08)", background: form.icon === ic ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)", color: T().text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{ic}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T().textMuted }}>Color:</span>
            {PALETTE.map(c => (
              <button key={c} onClick={() => setForm({ ...form, color: c })}
                style={{ width: 20, height: 20, borderRadius: 4, background: c, border: form.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleAdd} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: T().accent, color: "#fff" }}>Add Category</button>
            <button onClick={() => setAdding(false)} style={{ padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, color: T().textSub, background: T().inputBg }}>Cancel</button>
          </div>
        </div>
      ) : <button onClick={() => setAdding(true)} style={{ marginTop: 6, padding: "7px 0", width: "100%", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)", background: "transparent", color: T().textMuted, fontSize: 11, cursor: "pointer" }}>+ Add custom category</button>}
    </div>
  );
}

// ── Entry Row ──
function EntryRow({ entry, runningBalance, onUpdate, onRemove, onDuplicate, isEditing, onStartEdit, onStopEdit, onDragHandle, allEntries }) {
  const cat = allCats().find(c => c.id === entry.category)||{id:"other",label:"Other",icon:"📋",color:"#f97316"}; const isInc = entry.type === "income";
  const lRef = useRef(null), aRef = useRef(null), rRef = useRef(null), dRef = useRef(null);
  const [swipeX, setSwipeX] = useState(0); const [swiping, setSwiping] = useState(false); const ts = useRef({ x: 0, y: 0 });
  const onTS = e => { ts.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; setSwiping(false); };
  const onTM = e => { const dx = e.touches[0].clientX - ts.current.x; const dy = e.touches[0].clientY - ts.current.y; if (Math.abs(dx) > Math.abs(dy) && dx < 0) { setSwiping(true); setSwipeX(Math.max(dx, -160)); e.preventDefault(); } else if (Math.abs(dx) > Math.abs(dy) && dx > 0 && swipeX < 0) { setSwiping(true); setSwipeX(Math.min(swipeX + dx, 0)); e.preventDefault(); } };
  const onTE = () => { if (swipeX < -60) { setSwipeX(-160); } else { setSwipeX(0); } setSwiping(false); };
  useEffect(() => { if (isEditing) setTimeout(() => { lRef.current?.focus(); rRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100); }, [isEditing]);

  const autoCategory = () => {
    if (isInc || (entry.category && entry.category !== "other")) return;
    const label = lRef.current?.value?.trim();
    if (!label) return;
    const guess = guessCategory(label, allEntries || []);
    if (guess && guess !== "income" && guess !== "other") {
      onUpdate(entry.id, { category: guess });
    }
  };

  const commit = () => { const label = lRef.current?.value?.trim(), amount = parseFloat(aRef.current?.value), dateISO = dRef.current?.value; if (!label && (!amount || amount === 0)) { onRemove(entry.id); } else { const u = { label: label || "(untitled)", amount: amount || 0 }; if (dateISO) { u.dateISO = dateISO; u.date = fmtDate(dateISO); } autoCategory(); onUpdate(entry.id, u); } haptic(); onStopEdit(); };
  const kd = e => { if (e.key === "Enter") { if (e.target === lRef.current && aRef.current) aRef.current.focus(); else commit(); } if (e.key === "Escape") { if (!entry.label && entry.amount === 0) onRemove(entry.id); else onStopEdit(); } };

  if (isEditing) return (
    <div ref={rRef} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 10px", background: T().inputBg, borderRadius: 10, animation: "slideIn 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 18, width: 28, textAlign: "center", color: isInc ? "#22c55e" : cat.color }}>{isInc ? "↑" : cat.icon}</span>
        <input ref={lRef} defaultValue={entry.label} placeholder={isInc ? "e.g. Salary" : "e.g. Groceries"} onKeyDown={kd} onBlur={autoCategory} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "4px 2px", color: T().text, fontSize: 14, outline: "none" }} />
        <div style={{ position: "relative", width: 90 }}><span style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 12, fontFamily: T().mono }}>$</span><input ref={aRef} defaultValue={entry.amount||""} placeholder="0.00" inputMode="decimal" onKeyDown={kd} style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "4px 2px 4px 16px", color: isInc ? T().inc : T().exp, fontSize: 14, fontFamily: T().mono, outline: "none", textAlign: "right" }} /></div>
        <button onClick={commit} style={{ background: isInc ? "#22c55e" : "#6366f1", border: "none", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: isInc ? "#0a0a1a" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✓</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 34, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: T().textMuted }}>Date:</span>
        <input ref={dRef} type="date" defaultValue={entry.dateISO||todayISO()} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", color: T().text, fontSize: 12, outline: "none", colorScheme: "dark" }} />
        {!isInc && (<><span style={{ fontSize: 11, color: T().textMuted, marginLeft: 4 }}>Category:</span><select defaultValue={entry.category} onChange={e => onUpdate(entry.id, { category: e.target.value })} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", color: T().text, fontSize: 12, outline: "none", cursor: "pointer", colorScheme: "dark" }}>{allCats().filter(c => c.id !== "income").map(c => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}</select></>)}
      </div>
      <TagsInput tags={entry.tags||[]} onChange={tags => onUpdate(entry.id, { tags })} />
    </div>
  );

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 10 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, display: "flex", borderRadius: "0 10px 10px 0" }}>
        <button onClick={() => { onDuplicate(entry); haptic(); setSwipeX(0); }}
          style={{ flex: 1, background: T().accent, border: "none", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          ❐ Copy
        </button>
        <button onClick={() => { onRemove(entry.id); haptic(15); }}
          style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: "0 10px 10px 0", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Delete
        </button>
      </div>
      <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE} onClick={() => { if (window.__DRAG_ENDED__ && Date.now() - window.__DRAG_ENDED__ < 300) return; if (swipeX < 0) { setSwipeX(0); return; } if (!swiping && swipeX === 0) onStartEdit(entry.id); }}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 10px 6px", background: T().row, borderRadius: 10, transition: swiping ? "none" : "transform 0.2s ease", transform: `translateX(${swipeX}px)`, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <div onTouchStart={onDragHandle} style={{ cursor: "grab", color: T().textDark, fontSize: 14, padding: "12px 10px", margin: "-10px -4px -10px -6px", touchAction: "none", userSelect: "none", flexShrink: 0 }}>⠿</div>
        <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: 0.7, flexShrink: 0 }}>{cat.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T().text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.label || "(untitled)"}{entry.recurring && <span style={{ fontSize: 9, color: T().accent, marginLeft: 6, fontWeight: 600 }}>↻</span>}</div>
          <div style={{ fontSize: 11, color: T().textMuted, marginTop: 1 }}>{cat.label} · {entry.date}{entry.tags?.length > 0 && <span style={{ marginLeft: 4, color: T().accentLight }}>{entry.tags.map(t => `#${t}`).join(" ")}</span>}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: T().mono, fontWeight: 600, fontSize: 14, color: isInc ? T().inc : T().exp }}>{isInc ? "+" : "−"}{fmt(Math.abs(entry.amount))}</div>
          {runningBalance !== undefined && <div style={{ fontFamily: T().mono, fontSize: 10, color: runningBalance >= 0 ? `${T().inc}80` : `${T().exp}80`, marginTop: 1 }}>{fmt(runningBalance)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Donut ──
function DonutChart({ entries }) {
  const expenses = entries.filter(e => e.type === "expense");
  const byC = allCats().filter(c => c.id !== "income").map(c => ({...c, total: expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)})).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const tot = byC.reduce((s, c) => s + c.total, 0);
  if (tot === 0) return (<div style={{ textAlign: "center", padding: 20, color: "#475569", fontSize: 13 }}>No expenses yet</div>);
  const R = 38, CI = 2 * Math.PI * R; let off = 0;
  const segs = byC.map(c => { const fr = c.total / tot; const sg = {...c, da: `${fr * CI} ${CI}`, doff: -off}; off += fr * CI; return sg; });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        {segs.map((s, i) => (<circle key={i} cx={50} cy={50} r={R} fill="none" stroke={s.color} strokeWidth={14} strokeDasharray={s.da} strokeDashoffset={s.doff} transform="rotate(-90 50 50)" />))}
        <text x="50" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{fmt(tot).replace(".00", "")}</text>
        <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="7">spent</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {byC.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T().textSub }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
            <span>{a.label}</span>
            <span style={{ color: T().textMuted, fontFamily: T().mono }}>{fmt(a.total)}</span>
            <span style={{ color: "#475569", fontFamily: T().mono, fontSize: 10 }}>{Math.round((a.total / tot) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Envelope Utilities ──
function getBarColor(pct) {
  if (pct < 60) return T().inc;
  if (pct < 85) return "#f59e0b";
  return T().exp;
}

function daysLeftInMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

function currentDayOfMonth() { return new Date().getDate(); }
function daysInCurrentMonth() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate(); }

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
          <span style={{ fontSize: 11, color: T().textDim, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▶</span>
          <span style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</span>
          {count !== undefined && <span style={{ fontSize: 10, color: T().textDim, fontFamily: T().mono }}>({count})</span>}
        </div>
        <span style={{ fontSize: 10, color: T().textDim }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div style={{ animation: "slideIn 0.2s ease" }}>{children}</div>}
    </div>
  );
}

// ── Envelope Section (category-based envelopes for a budget node) ──
function EnvelopeSection({ nodeId, envelopes, entries, nodes, setEnvelope, removeEnvelope }) {
  const nodeEnvs = (envelopes || {})[nodeId] || {};
  const catIds = Object.keys(nodeEnvs);
  const cats = allCats();
  const [adding, setAdding] = useState(false);
  const [addCat, setAddCat] = useState("");
  const [addCap, setAddCap] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  const [editCap, setEditCap] = useState("");
  const [showRollConfirm, setShowRollConfirm] = useState(false);

  // Categories that already have an envelope (include rollover in total)
  const envRows = catIds.map(catId => {
    const cat = cats.find(c => c.id === catId) || { id: catId, label: catId, icon: "📋", color: "#f97316" };
    const envData = nodeEnvs[catId] || {};
    const cap = envData.cap || 0;
    const rollover = envData.rollover || 0;
    const total = cap + rollover;
    const rolled = !!envData.rolledTo;
    const spent = entries.filter(e => e.nodeId === nodeId && e.category === catId && e.type === "expense").reduce((s, e) => s + e.amount, 0);
    const left = total - spent;
    const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
    return { catId, cat, cap, rollover, total, spent, left, pct, isOver: spent > total, rolled };
  });

  // Categories available to add (not already enveloped, skip income)
  const availableCats = cats.filter(c => c.id !== "income" && !catIds.includes(c.id));

  const totalBudget = envRows.reduce((s, r) => s + r.total, 0);
  const totalSpent = envRows.reduce((s, r) => s + r.spent, 0);
  const totalLeft = totalBudget - totalSpent;

  // Find next sibling budget in the same parent folder for roll-forward
  const findNextMonth = () => {
    if (!nodes || nodes.length === 0) return null;
    const thisNode = nodes.find(n => n.id === nodeId);
    if (!thisNode || !thisNode.parentId) return null;
    const siblings = nodes.filter(n => n.parentId === thisNode.parentId);
    const myIdx = siblings.findIndex(s => s.id === nodeId);
    if (myIdx < 0 || myIdx >= siblings.length - 1) return null;
    return siblings[myIdx + 1];
  };

  const nextMonth = findNextMonth();
  const rollableRows = envRows.filter(r => r.left > 0 && !r.rolled);
  const totalRollable = rollableRows.reduce((s, r) => s + r.left, 0);
  const anyRolled = envRows.some(r => r.rolled);
  const canRoll = nextMonth && rollableRows.length > 0 && !anyRolled;

  const handleRollForward = () => {
    for (const row of rollableRows) {
      // Mark source as rolled
      const srcEnv = nodeEnvs[row.catId] || {};
      setEnvelope(nodeId, row.catId, { ...srcEnv, rolledTo: nextMonth.id, rolledAmount: row.left });
      // Add rollover to destination — inherit cap if destination doesn't have this category
      const destNodeEnvs = (envelopes || {})[nextMonth.id] || {};
      const destEnv = destNodeEnvs[row.catId] || {};
      setEnvelope(nextMonth.id, row.catId, {
        cap: destEnv.cap || row.cap,
        rollover: (destEnv.rollover || 0) + row.left,
        rolloverFrom: nodeId,
      });
    }
    setShowRollConfirm(false);
  };

  const handleAdd = () => {
    const v = parseFloat(addCap);
    if (addCat && v > 0) {
      setEnvelope(nodeId, addCat, v);
      setAddCat(""); setAddCap(""); setAdding(false);
    }
  };

  const handleEdit = (catId) => {
    const v = parseFloat(editCap);
    if (v > 0) {
      const existing = nodeEnvs[catId] || {};
      setEnvelope(nodeId, catId, { ...existing, cap: v });
    }
    setEditingCat(null); setEditCap("");
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      border: `1px solid ${T().cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: envRows.length > 0 ? 10 : 0 }}>
        <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Envelopes
        </div>
        {envRows.length > 0 && (
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T().mono, color: totalLeft >= 0 ? T().inc : T().exp }}>
            {fmt(Math.abs(totalLeft))} <span style={{ fontSize: 10, fontWeight: 500, color: T().textMuted }}>{totalLeft >= 0 ? "left" : "over"}</span>
          </div>
        )}
      </div>

      {/* Envelope rows */}
      {envRows.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
          {envRows.map(({ catId, cat, cap, rollover, total, spent, left, pct, isOver, rolled }) => (
            <div key={catId} style={{ opacity: rolled ? 0.6 : 1 }}>
              {editingCat === catId ? (
                /* ── Inline edit mode ── */
                <div style={{ display: "flex", gap: 6, alignItems: "center", animation: "slideIn 0.15s ease" }}>
                  <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, color: T().text, fontWeight: 500, minWidth: 50 }}>{cat.label}</span>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 12, fontFamily: T().mono }}>$</span>
                    <input value={editCap} onChange={e => setEditCap(e.target.value.replace(/[^0-9.]/g, ""))} autoFocus inputMode="decimal"
                      onKeyDown={e => { if (e.key === "Enter") handleEdit(catId); if (e.key === "Escape") setEditingCat(null); }}
                      style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 6, padding: "6px 6px 6px 22px", color: T().text, fontSize: 12, fontFamily: T().mono, outline: "none" }} />
                  </div>
                  <button onClick={() => handleEdit(catId)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: T().accent, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save</button>
                  <button onClick={() => setEditingCat(null)} style={{ padding: "6px 8px", borderRadius: 6, border: `1px solid ${T().cardBorder}`, background: "transparent", color: T().textMuted, fontSize: 11, cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                /* ── Display mode ── */
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{cat.icon}</span>
                      <span style={{ fontSize: 12, color: T().text, fontWeight: 500 }}>{cat.label}</span>
                      <span style={{ fontSize: 9, color: T().textDim, fontFamily: T().mono }}>{fmt(spent)} / {fmt(total)}</span>
                      {rollover > 0 && <span style={{ fontSize: 8, color: T().accentLight, fontWeight: 600, background: "rgba(99,102,241,0.1)", padding: "1px 4px", borderRadius: 3 }}>+{fmt(rollover)}</span>}
                      {rolled && <span style={{ fontSize: 8, color: T().inc, fontWeight: 600, background: "rgba(34,197,94,0.1)", padding: "1px 4px", borderRadius: 3 }}>✓ rolled</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontFamily: T().mono, fontWeight: 600, color: isOver ? T().exp : T().textSub }}>
                        {isOver ? "−" : ""}{fmt(Math.abs(left))}
                      </span>
                      <button onClick={() => { setEditingCat(catId); setEditCap(String(cap)); }} title="Edit" style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>✎</button>
                      <button onClick={() => { removeEnvelope(nodeId, catId); }} title="Delete" style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 12, padding: "2px 4px" }}
                        onMouseEnter={e => (e.currentTarget.style.color = T().exp)} onMouseLeave={e => (e.currentTarget.style.color = T().textDim)}>×</button>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: rolled ? T().textDim : getBarColor(pct), borderRadius: 3, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Roll forward button */}
      {canRoll && !showRollConfirm && (
        <button onClick={() => setShowRollConfirm(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          width: "100%", padding: "9px 0", borderRadius: 8, marginBottom: 8,
          border: "1px dashed rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.04)",
          color: T().inc, fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>
          Roll forward {fmt(totalRollable)} → {nextMonth.name} →
        </button>
      )}

      {/* Roll confirm */}
      {showRollConfirm && nextMonth && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: `1px solid ${T().cardBorder}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8,
          animation: "slideIn 0.2s ease",
        }}>
          <div style={{ fontSize: 12, color: T().text, fontWeight: 600, marginBottom: 6 }}>Roll forward to {nextMonth.name}?</div>
          <div style={{ fontSize: 11, color: T().textMuted, marginBottom: 8, lineHeight: 1.5 }}>
            {rollableRows.map(r => (
              <div key={r.catId} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                <span>{r.cat.icon} {r.cat.label}</span>
                <span style={{ fontFamily: T().mono, color: T().inc, fontWeight: 600 }}>{fmt(r.left)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T().cardBorder}`, marginTop: 4, paddingTop: 4, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Total</span><span style={{ fontFamily: T().mono, color: T().inc }}>{fmt(totalRollable)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleRollForward} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
              background: T().inc, color: "#0a0a1a", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>Roll → {nextMonth.name}</button>
            <button onClick={() => setShowRollConfirm(false)} style={{
              padding: "9px 14px", borderRadius: 8, border: `1px solid ${T().cardBorder}`,
              background: "transparent", color: T().textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Rolled badge */}
      {anyRolled && nextMonth && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", marginBottom: 8,
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8,
        }}>
          <span style={{ fontSize: 11 }}>✓</span>
          <span style={{ fontSize: 11, color: T().inc, fontWeight: 600 }}>Rolled forward to {nextMonth.name}</span>
        </div>
      )}

      {/* Add envelope form */}
      {adding ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "slideIn 0.15s ease", marginTop: envRows.length > 0 ? 4 : 10 }}>
          <select value={addCat} onChange={e => setAddCat(e.target.value)} style={{
            background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 8, padding: "8px 10px",
            color: T().text, fontSize: 12, outline: "none", appearance: "auto",
          }}>
            <option value="">Select category...</option>
            {availableCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          {addCat && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 13, fontFamily: T().mono }}>$</span>
                <input value={addCap} onChange={e => setAddCap(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="Monthly cap" autoFocus inputMode="decimal"
                  onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                  style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 8, padding: "8px 8px 8px 24px", color: T().text, fontSize: 13, fontFamily: T().mono, outline: "none" }} />
              </div>
              <button onClick={handleAdd} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: T().accent, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
              <button onClick={() => { setAdding(false); setAddCat(""); setAddCap(""); }} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${T().cardBorder}`, background: "transparent", color: T().textMuted, fontSize: 12, cursor: "pointer" }}>✕</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          display: "block", width: "100%", padding: "8px 0", borderRadius: 8,
          border: `1px dashed ${T().accent}40`, background: `${T().accent}08`,
          color: T().accentLight, fontSize: 11, fontWeight: 600, cursor: "pointer",
          marginTop: envRows.length > 0 ? 0 : 10,
        }}>+ Add Envelope</button>
      )}
    </div>
  );
}

// ── Envelope Settings (in Limits & Recurring tab) — now just a pointer ──
function EnvelopeSettings({ nodeId, envelopes, nodes, entries, setEnvelope, removeEnvelope }) {
  return <EnvelopeSection nodeId={nodeId} envelopes={envelopes} entries={entries} nodes={nodes} setEnvelope={setEnvelope} removeEnvelope={removeEnvelope} />;
}

// ══════════════════════════════════════════════════
// NODE PAGE
// ══════════════════════════════════════════════════
function NodePage({ node, parentName, nodes, entries, recurrings, limits, customCategories, envelopes, onBack, onNavigate, addNode, updateNode, removeNode, reorderNodes, addEntry, updateEntry, removeEntry, reorderEntries, addRecurring, updateRecurring, removeRecurring, setLimit, removeLimit, addCategory, removeCategory, setEnvelope, removeEnvelope, getDesc }) {
  const [addingChild, setAddingChild] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("overview");
  const [showArchived, setShowArchived] = useState(false);
  const fileRef = useRef(null);

  const allChildren = nodes.filter(n => n.parentId === node.id);
  const children = showArchived ? allChildren : allChildren.filter(c => !c.archived);
  const archivedCount = allChildren.filter(c => c.archived).length;
  const directEntries = entries.filter(e => e.nodeId === node.id);
  const isFolderMode = children.length > 0 || addingChild || allChildren.length > 0;
  const { inc, exp, balance } = getNodeBalance(nodes, entries, node.id);
  const color = node.color || "#6366f1";
  const childStats = children.map(c => ({ ...c, ...getNodeBalance(nodes, entries, c.id), childCount: nodes.filter(n => n.parentId === c.id).length }));

  // All folders use the traditional folder view — envelopes live on leaf nodes (the monthly budgets)

  // All descendant entries for folder-level analytics
  const allDescEntries = getAllDescendantEntries(nodes, entries, node.id);

  let cumulative = 0; const rb = {};
  directEntries.forEach(e => { cumulative += e.type === "income" ? e.amount : -e.amount; rb[e.id] = cumulative; });
  const filtered = search ? directEntries.filter(e => e.label.toLowerCase().includes(search.toLowerCase()) || (allCats().find(c => c.id === e.category)?.label||"").toLowerCase().includes(search.toLowerCase()) || (e.tags||[]).some(t => t.includes(search.toLowerCase()))) : directEntries;

  const handleAddEntry = (type) => { const eid = uid(); addEntry({ id: eid, nodeId: node.id, label: "", amount: 0, category: type === "income" ? "income" : "other", type, date: todayStr(), dateISO: todayISO(), tags: [] }); setEditingId(eid); setSearch(""); setTab("overview"); haptic(); };
  const handleImport = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { parseCSV(ev.target.result).forEach(p => addEntry({ id: uid(), nodeId: node.id, ...p, dateISO: todayISO(), tags: p.tags || [] })); }; reader.readAsText(file); e.target.value = ""; };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: T().inputBg, border: "none", color: T().textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ {parentName}</button>
          <ColorPicker value={color} onChange={c => updateNode(node.id, { color: c })} />
          <EditableTitle value={node.name} onSave={v => updateNode(node.id, { name: v })} style={{ fontSize: 17, fontWeight: 700, margin: 0, color: T().text, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
          {(!isFolderMode || allChildren.length > 0) && (
            <button onClick={() => setAddingChild(true)} title="Add sub-budget" style={{ background: T().inputBg, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderPlusSvg color="#94a3b8" size={18} /></button>
          )}
        </div>

        {!isFolderMode && (
          <>
            {/* Envelope section — category-based envelopes with progress bars */}
            <EnvelopeSection
              nodeId={node.id}
              envelopes={envelopes}
              entries={entries}
              nodes={nodes}
              setEnvelope={setEnvelope}
              removeEnvelope={removeEnvelope}
            />
            <BudgetAlerts nodeId={node.id} entries={entries} limits={limits} />
          </>
        )}
      </div>

      {!isFolderMode && (
        <div style={{ display: "flex", gap: 4, padding: "0 20px", marginBottom: 12 }}>
          {[{ id: "overview", label: "Overview" }, { id: "settings", label: "⚙ Limits & Recurring" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: tab === t.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)", color: tab === t.id ? "#818cf8" : "#64748b", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "0 0 0", display: "flex", flexDirection: "column", height: "calc(100vh - env(safe-area-inset-top, 0px))", overflow: "hidden" }}>
        {isFolderMode ? (
          /* ═══ FOLDER VIEW — lists child budgets to open ═══ */
          <div style={{ padding: "0 20px 120px", flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}>
            <MonthlyTrends entries={allDescEntries} />
            <YearInReview entries={allDescEntries} />

            <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Sub-budgets ({children.length})</div>
            <DraggableList items={childStats} onReorder={ids => reorderNodes(node.id, ids)} renderItem={(c, _i, onDragHandle) => (
              <div onClick={() => { if (window.__DRAG_ENDED__ && Date.now() - window.__DRAG_ENDED__ < 300) return; onNavigate(c.id); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: c.archived ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)", borderRadius: 12, borderLeft: `4px solid ${c.color || color}`, cursor: "pointer", transition: "background 0.15s", opacity: c.archived ? 0.5 : 1 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = c.archived ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)")}>
                <div onTouchStart={onDragHandle} style={{ cursor: "grab", color: "#475569", fontSize: 16, padding: "4px 6px", touchAction: "none", userSelect: "none" }}>⠿</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T().text }}>{c.name}{c.archived && <span style={{ fontSize: 9, color: T().textMuted, marginLeft: 6 }}>archived</span>}</div>
                  {c.childCount > 0 && <div style={{ fontSize: 11, color: T().textMuted, marginTop: 2 }}>{c.childCount} sub-budget{c.childCount !== 1 ? "s" : ""}</div>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: T().mono, color: c.balance >= 0 ? "#22c55e" : "#ef4444" }}>{c.balance >= 0 ? "+" : "−"} {fmt(Math.abs(c.balance))}</span>
                <span style={{ fontSize: 18, color: "#475569" }}>›</span>
                <button onClick={e => { e.stopPropagation(); updateNode(c.id, { archived: !c.archived }); haptic(); }} title={c.archived ? "Unarchive" : "Archive"} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "2px 4px" }}>{c.archived ? "↩" : "📦"}</button>
                <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${c.name}"?`)) { removeNode(c.id); haptic(15); }}} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>×</button>
              </div>
            )} />
            {archivedCount > 0 && !showArchived && (
              <button onClick={() => setShowArchived(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Show {archivedCount} archived budget{archivedCount !== 1 ? "s" : ""}</button>
            )}
            {showArchived && archivedCount > 0 && (
              <button onClick={() => setShowArchived(false)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Hide archived</button>
            )}
            {addingChild && <div style={{ marginTop: 8 }}><InlineNew placeholder="Sub-budget name" accentColor={color} icon={<div style={{ width: 8 }} />}
              onCommit={name => { addNode({ id: uid(), parentId: node.id, name, color: PALETTE[children.length % PALETTE.length] }); setAddingChild(false); haptic(); }} onCancel={() => setAddingChild(false)} /></div>}
            <BottomBar><Btn onClick={() => setAddingChild(true)} bg={`${color}25`} color={color}>+ New Sub-budget</Btn></BottomBar>
          </div>
        ) : tab === "settings" ? (
          <div style={{ padding: "0 20px 40px", flex: 1, overflowY: "auto", overscrollBehavior: "contain", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Envelope config */}
            <EnvelopeSettings nodeId={node.id} envelopes={envelopes} nodes={nodes} entries={entries} setEnvelope={setEnvelope} removeEnvelope={removeEnvelope} />
            <LimitsPanel nodeId={node.id} entries={entries} limits={limits} setLimit={setLimit} removeLimit={removeLimit} />
            <RecurringPanel nodeId={node.id} recurrings={recurrings} onAdd={addRecurring} onUpdate={updateRecurring} onRemove={removeRecurring} onAddEntry={addEntry} />
            <CategoryManager customCategories={customCategories || []} onAdd={addCategory} onRemove={removeCategory} />
            <div><div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Import / Export</div><div style={{ display: "flex", gap: 8 }}><button onClick={() => exportCSV(directEntries, node.name)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: T().surface, color: T().textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↓ Export CSV</button><button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: T().surface, color: T().textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↑ Import CSV</button><input ref={fileRef} type="file" accept=".csv" onChange={handleImport} style={{ display: "none" }} /></div></div>
          </div>
        ) : (
          <>
            <div style={{ padding: "0 20px" }}>
              <div style={{ background: T().surface, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 12 }}><DonutChart entries={directEntries} /></div>
              {directEntries.length > 3 && <SearchBar value={search} onChange={setSearch} />}
              <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Transactions ({filtered.length}{search ? ` of ${directEntries.length}` : ""})</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "0 20px", WebkitOverflowScrolling: "touch" }}>
              {filtered.length === 0 ? <EmptyState text={search ? "No matches" : "No entries yet"} sub={search ? "Try a different search or tag" : "Add transactions or tap ⚙ for recurring & CSV import"} /> : (
                <DraggableList items={filtered} onReorder={ids => reorderEntries(node.id, ids)} renderItem={(e, _i, onDragHandle) => (
                  <EntryRow key={e.id} entry={e} runningBalance={rb[e.id]} onUpdate={updateEntry} onRemove={removeEntry} onDuplicate={src => { const eid = uid(); addEntry({ ...src, id: eid, date: todayStr(), dateISO: todayISO(), recurring: false }); setEditingId(eid); haptic(); }} isEditing={editingId === e.id} onStartEdit={setEditingId} onStopEdit={() => setEditingId(null)} onDragHandle={onDragHandle} allEntries={entries} />
                )} />
              )}
              <div style={{ display: "flex", gap: 10, padding: "16px 0 24px" }}>
                <Btn onClick={() => handleAddEntry("income")} bg={`${T().inc}25`} color={T().inc}>+ Income</Btn>
                <Btn onClick={() => handleAddEntry("expense")} bg={`${T().exp}25`} color={T().exp}>+ Expense</Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════
export default function App({ user, householdId }) {
  const app = useApp(user, householdId);
  const { d, synced } = app;
  const [navStack, setNavStack] = useState([]);
  const [addingRoot, setAddingRoot] = useState(false);
  const [showArchivedRoot, setShowArchivedRoot] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [themeId, setThemeId] = useState(() => { try { return localStorage.getItem("maverick-theme") || "midnight"; } catch { return "midnight"; } });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => typeof Notification !== "undefined" && Notification.permission === "granted");
  const [notifPrefs, setNotifPrefs] = useState({ ...DEFAULT_NOTIFICATION_PREFS });
  const [notifPrefsLoaded, setNotifPrefsLoaded] = useState(false);
  useEffect(() => { if (user?.uid) { getNotificationPrefs(user.uid).then(p => { setNotifPrefs(p); setNotifPrefsLoaded(true); }); } }, [user?.uid]);
  const toggleNotifPref = async (key) => { const next = { ...notifPrefs, [key]: !notifPrefs[key] }; setNotifPrefs(next); if (user?.uid) await setNotificationPrefs(user.uid, next); };
  const t = THEMES[themeId] || THEMES.midnight;
  window.__THEME__ = themeId;
  const toggleTheme = () => { const next = themeId === "midnight" ? "ocean" : "midnight"; setThemeId(next); try { localStorage.setItem("maverick-theme", next); } catch {} window.__THEME__ = next; };
  const cur = navStack.length > 0 ? d.nodes.find(n => n.id === navStack[navStack.length - 1]) : null;
  const par = navStack.length >= 2 ? d.nodes.find(n => n.id === navStack[navStack.length - 2]) : null;
  const goTo = nid => setNavStack([...navStack, nid]);
  const goBack = () => setNavStack(navStack.slice(0, -1));

  const shell = ch => (
    <div className="app-shell" style={{ fontFamily: t.font, background: t.bg, color: t.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('${t.fontImport}');
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
        input::placeholder,select{color:${t.textDim}} select option{background:${t.selectBg};color:${t.text}}
        input,select,textarea{font-size:16px !important;-webkit-text-size-adjust:100%}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
        .app-shell{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
      `}</style>
      <div style={{ position: "absolute", top: -120, right: -80, width: 300, height: 300, background: t.glow, animation: "pulse 6s ease-in-out infinite", pointerEvents: "none" }} />
      <NotificationManager userId={user.uid} householdId={householdId} />
      <ScrollContainer>{ch}</ScrollContainer>
    </div>
  );

  if (!cur) {
    const allRoots = d.nodes.filter(n => n.parentId === null);
    const roots = showArchivedRoot ? allRoots : allRoots.filter(n => !n.archived);
    const archivedRootCount = allRoots.filter(n => n.archived).length;
    const stats = roots.map(f => ({ ...f, ...getNodeBalance(d.nodes, d.entries, f.id), childCount: d.nodes.filter(n => n.parentId === f.id).length }));
    return shell(
      <div style={{ padding: "24px 20px 20px", animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", background: t.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Maverick</h1>
            <span style={{ fontSize: 10, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>Budget</span>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} style={{ background: showSettings ? `${t.accent}20` : t.surface, border: `1px solid ${showSettings ? t.accent + "40" : t.cardBorder}`, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: showSettings ? t.accentLight : t.textSub, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>⚙</button>
        </div>
        {showSettings && (
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "16px 18px", marginBottom: 16, animation: "slideIn 0.2s ease" }}>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Settings</div>
            
            {/* Theme */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{themeId === "midnight" ? "🌙" : "🌊"}</span>
                <div><div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Theme</div><div style={{ fontSize: 10, color: t.textMuted }}>{t.name}</div></div>
              </div>
              <button onClick={toggleTheme} style={{ background: `${t.accent}20`, border: `1px solid ${t.accent}30`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600, color: t.accentLight }}>
                Switch to {themeId === "midnight" ? "Ocean" : "Midnight"}
              </button>
            </div>

            {/* Notifications master toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🔔</span>
                <div><div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Notifications</div><div style={{ fontSize: 10, color: t.textMuted }}>{notificationsEnabled ? "Enabled" : "Disabled"}</div></div>
              </div>
              <button onClick={async () => {
                if (typeof Notification === "undefined") return;
                if (Notification.permission === "granted") {
                  if (notificationsEnabled) {
                    try { await deleteDoc(doc(db, "users", user.uid, "tokens", "fcm")); } catch (e) { console.error("Token remove error:", e); }
                    setNotificationsEnabled(false);
                  } else {
                    const token = await requestNotificationPermission(user.uid, householdId);
                    setNotificationsEnabled(!!token);
                  }
                } else {
                  const token = await requestNotificationPermission(user.uid, householdId);
                  setNotificationsEnabled(!!token);
                }
              }} style={{
                width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                background: notificationsEnabled ? t.inc : "rgba(255,255,255,0.1)",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, transition: "left 0.2s",
                  left: notificationsEnabled ? 21 : 3,
                }} />
              </button>
            </div>
            {/* Notification preferences — only show when notifications are enabled */}
            {notificationsEnabled && notifPrefsLoaded && (
              <div style={{ marginLeft: 32, marginBottom: 12 }}>
                {[
                  { key: "newTransaction", label: "New transactions", sub: "When someone posts a new entry" },
                  { key: "editTransaction", label: "Edited transactions", sub: "When someone edits an entry" },
                  { key: "deleteTransaction", label: "Deleted transactions", sub: "When someone removes an entry" },
                  { key: "budgetUpdate", label: "Budget changes", sub: "Folders, limits, or categories" },
                  { key: "envelopeAlert", label: "Envelope alerts", sub: "When an envelope hits 80% or 100%" },
                ].map(({ key, label, sub }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                    <div><div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 9, color: t.textMuted }}>{sub}</div></div>
                    <button onClick={() => toggleNotifPref(key)} style={{
                      width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                      background: notifPrefs[key] ? t.inc : "rgba(255,255,255,0.1)",
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 8, background: "#fff", position: "absolute", top: 2, transition: "left 0.2s",
                        left: notifPrefs[key] ? 18 : 2,
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Household code */}
            <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: 12, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>👥</span>
                <div><div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Household</div><div style={{ fontSize: 10, color: t.textMuted }}>Invite your partner</div></div>
              </div>
              <div style={{ background: `${t.accent}10`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: T().mono, color: t.text, letterSpacing: "0.12em" }}>{householdId}</span>
                <span style={{ fontSize: 10, color: t.textMuted }}>{user?.email}</span>
              </div>
            </div>

            {/* Sign out */}
            <button onClick={() => { if (confirm("Sign out?")) signOut(auth); }} style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 8, border: `1px solid rgba(239,68,68,0.2)`, background: "rgba(239,68,68,0.06)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
          </div>
        )}
        <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Folders ({roots.length})</div>
        <div style={{ paddingBottom: 100 }}>
          <DraggableList items={stats} onReorder={ids => app.reorderNodes(null, ids)} renderItem={(f, _i, onDragHandle) => (
            <div onClick={() => { if (window.__DRAG_ENDED__ && Date.now() - window.__DRAG_ENDED__ < 300) return; goTo(f.id); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: f.archived ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)", borderRadius: 12, borderLeft: `4px solid ${f.color}`, cursor: "pointer", transition: "background 0.15s", opacity: f.archived ? 0.5 : 1 }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = f.archived ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)")}>
              <div onTouchStart={onDragHandle} style={{ cursor: "grab", color: "#475569", fontSize: 16, padding: "4px 6px", touchAction: "none", userSelect: "none" }}>⠿</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderSvg color={f.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, color: T().text }}>{f.name}{f.archived && <span style={{ fontSize: 9, color: T().textMuted, marginLeft: 6 }}>archived</span>}</div><div style={{ fontSize: 11, color: T().textMuted, marginTop: 2 }}>{f.childCount} budget{f.childCount !== 1 ? "s" : ""}</div></div>
              <span style={{ fontSize: 18, color: "#475569" }}>›</span>
              <button onClick={e => { e.stopPropagation(); app.updateNode(f.id, { archived: !f.archived }); haptic(); }} title={f.archived ? "Unarchive" : "Archive"} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "2px 4px" }}>{f.archived ? "↩" : "📦"}</button>
              <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${f.name}"?`)) { app.removeNode(f.id); haptic(15); }}} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>×</button>
            </div>
          )} />
          {archivedRootCount > 0 && !showArchivedRoot && <button onClick={() => setShowArchivedRoot(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Show {archivedRootCount} archived</button>}
          {showArchivedRoot && archivedRootCount > 0 && <button onClick={() => setShowArchivedRoot(false)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Hide archived</button>}
          {addingRoot && <div style={{ marginTop: 8 }}><InlineNew placeholder="Folder name" accentColor={PALETTE[roots.length % PALETTE.length]}
            icon={<div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FolderSvg color="#6366f1" /></div>}
            onCommit={name => { app.addNode({ id: uid(), parentId: null, name, color: PALETTE[roots.length % PALETTE.length] }); setAddingRoot(false); haptic(); }} onCancel={() => setAddingRoot(false)} /></div>}
          {!addingRoot && roots.length === 0 && <EmptyState text="No folders yet" sub="Tap below to create one" />}
        </div>
        <BottomBar><Btn onClick={() => setAddingRoot(true)} bg={`${T().accent}25`} color={T().accentLight}>+ New Folder</Btn></BottomBar>
      </div>
    );
  }

  return shell(
    <NodePage node={cur} parentName={par ? par.name : "Folders"} nodes={d.nodes} entries={d.entries} recurrings={d.recurrings} limits={d.limits} customCategories={d.customCategories} envelopes={d.envelopes}
      onBack={goBack} onNavigate={goTo} addNode={app.addNode} updateNode={app.updateNode} removeNode={app.removeNode} reorderNodes={app.reorderNodes}
      addEntry={app.addEntry} updateEntry={app.updateEntry} removeEntry={app.removeEntry} reorderEntries={app.reorderEntries} addRecurring={app.addRecurring} updateRecurring={app.updateRecurring} removeRecurring={app.removeRecurring}
      setLimit={app.setLimit} removeLimit={app.removeLimit} addCategory={app.addCategory} removeCategory={app.removeCategory} setEnvelope={app.setEnvelope} removeEnvelope={app.removeEnvelope} getDesc={app.getDesc} />
  );
}
