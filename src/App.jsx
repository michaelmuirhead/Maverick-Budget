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
const ICONS = [
  // Food & Drink
  "🛒","🍔","🍕","🍣","🍰","☕","🍺","🥤","🧁","🥑","🍜","🥩",
  // Home & Living
  "🏠","🛋️","🧹","🔧","🪴","🏡","🛏️","🚿","💡","🧺",
  // Transport
  "🚗","⛽","🚌","🚲","✈️","🚕","🛵","🅿️",
  // Shopping & Fashion
  "🛍️","👗","👟","💄","👜","🕶️","💎","🧢",
  // Health & Fitness
  "🏥","💊","🏋️","🧘","🦷","👁️","💪","🩺",
  // Education & Work
  "🎓","📚","💻","📱","🖥️","📝","💼","🧑‍💻",
  // Entertainment
  "🎮","🎬","🎵","🎭","🎪","🎯","🎲","🎸",
  // Kids & Pets
  "👶","🐾","🐕","🐈","🧸","🍼","🎒","🧩",
  // Travel & Outdoors
  "🏖️","⛷️","🏕️","🗺️","🧳","🏔️","⛵","🎣",
  // Finance & Giving
  "💰","🎁","💳","🏦","📦","🎗️","⛪","💝",
  // Misc
  "📋","🔑","📸","🎂","💐","🧴","🪥","●",
];

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
  return { ...data, limits: data.limits || {} };
}

// ── CSV ──
function exportCSV(entries, name) {
  const rows = [["Date","Label","Category","Type","Amount"]];
  entries.forEach(e => { const c = allCats().find(x => x.id === e.category); rows.push([e.date, e.label, c?.label || e.category, e.type, e.type === "income" ? e.amount : -e.amount]); });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const b = new Blob([csv], { type: "text/csv" }); const u = URL.createObjectURL(b);
  const a = document.createElement("a"); a.href = u; a.download = `${name || "maverick"}-export.csv`; a.click(); URL.revokeObjectURL(u);
}
function parseCSV(text) {
  const lines = text.trim().split("\n").map(l => { const r = []; let cur = "", inQ = false; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '"') inQ = !inQ; else if (ch === "," && !inQ) { r.push(cur.trim()); cur = ""; } else cur += ch; } r.push(cur.trim()); return r; });
  if (lines.length < 2) return [];
  return lines.slice(1).map(r => { const amt = Math.abs(parseFloat(r[4]) || 0); const type = parseFloat(r[4]) >= 0 ? "income" : "expense"; const cl = (r[2]||"").toLowerCase(); const cat = allCats().find(c => c.label.toLowerCase() === cl) ||{id:"other",label:"Other",icon:"📋",color:"#f97316"}; return { label: r[1] || "(imported)", category: type === "income" ? "income" : cat.id, type, amount: amt, date: r[0] || todayStr() }; }).filter(e => e.amount > 0);
}

// ── State with Firebase Sync ──
import { db, auth, signOut, doc, setDoc, onSnapshot, requestNotificationPermission, getNotificationPrefs, setNotificationPrefs, DEFAULT_NOTIFICATION_PREFS, getDisplayPrefs, setDisplayPrefs, DEFAULT_DISPLAY_PREFS } from "./firebase";
import NotificationManager from "./NotificationManager";
import { deleteDoc } from "firebase/firestore";

const EMPTY_DATA = { nodes: [], entries: [], recurrings: [], limits: {}, customCategories: [], envelopes: {}, savingsGoals: [] };

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
        setD(processRecurrings({ nodes: r.nodes||[], entries: r.entries||[], recurrings: r.recurrings||[], limits: r.limits||{}, customCategories: r.customCategories||[], envelopes: r.envelopes||{}, savingsGoals: r.savingsGoals||[] }));
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
    removeNode: useCallback(id => up(p => { const all = [id, ...getDesc(p.nodes, id)]; return { ...p, nodes: p.nodes.filter(n => !all.includes(n.id)), entries: p.entries.filter(e => !all.includes(e.nodeId)) }; }), [getDesc]),
    reorderNodes: useCallback((pid, ids) => up(p => { const others = p.nodes.filter(n => n.parentId !== pid); const reordered = ids.map(id => p.nodes.find(n => n.id === id)).filter(Boolean); return { ...p, nodes: [...others, ...reordered] }; }), []),
    addEntry: useCallback(e => up(p => ({ ...p, entries: [...p.entries, e] })), []),
    updateEntry: useCallback((id, u) => up(p => ({ ...p, entries: p.entries.map(e => e.id === id ? { ...e, ...u } : e) })), []),
    removeEntry: useCallback(id => up(p => ({ ...p, entries: p.entries.filter(e => e.id !== id) })), []),
    reorderEntries: useCallback((nodeId, orderedIds) => up(p => {
      const others = p.entries.filter(e => e.nodeId !== nodeId);
      const reordered = orderedIds.map(id => p.entries.find(e => e.id === id)).filter(Boolean);
      return { ...p, entries: [...others, ...reordered] };
    }), []),
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
    addSavingsGoal: useCallback(g => up(p => ({ ...p, savingsGoals: [...(p.savingsGoals||[]), g] })), []),
    updateSavingsGoal: useCallback((id, u) => up(p => ({ ...p, savingsGoals: (p.savingsGoals||[]).map(g => g.id === id ? { ...g, ...u } : g) })), []),
    removeSavingsGoal: useCallback(id => up(p => ({ ...p, savingsGoals: (p.savingsGoals||[]).filter(g => g.id !== id) })), []),
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

// ── Monthly Trends (enhanced bar chart for folder view) ──
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
  const fmtK = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: `1px solid ${T().cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Monthly Trends</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T().inc }} /><span style={{ fontSize: 10, color: T().textMuted }}>Income</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T().exp }} /><span style={{ fontSize: 10, color: T().textMuted }}>Expenses</span></div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
        {sorted.map(([key, v]) => {
          const label = new Date(key + "-15").toLocaleDateString("en-US", { month: "short" });
          const incH = (v.inc / maxVal) * 100;
          const expH = (v.exp / maxVal) * 100;
          const net = v.inc - v.exp;
          return (
            <div key={key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 90, width: "100%" }}>
                <div style={{ flex: 1, height: `${incH}%`, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${T().inc}cc, ${T().inc}40)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: -16, width: "100%", textAlign: "center", fontSize: 8, color: T().textDim, fontFamily: T().mono }}>{fmtK(v.inc)}</div>
                </div>
                <div style={{ flex: 1, height: `${expH}%`, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${T().exp}cc, ${T().exp}40)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: -16, width: "100%", textAlign: "center", fontSize: 8, color: T().textDim, fontFamily: T().mono }}>{fmtK(v.exp)}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 9, fontFamily: T().mono, color: net >= 0 ? T().inc : T().exp, fontWeight: 600 }}>
                {net >= 0 ? "+" : ""}{fmtK(net)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Year in Review (sparkline + summary) ──
function YearInReview({ entries }) {
  const year = new Date().getFullYear();
  const yearEntries = entries.filter(e => e.dateISO && e.dateISO.startsWith(String(year)));
  if (yearEntries.length < 3) return null;

  // Build monthly data for sparkline
  const monthMap = {};
  yearEntries.forEach(e => {
    const key = e.dateISO.slice(0, 7);
    if (!monthMap[key]) monthMap[key] = { inc: 0, exp: 0 };
    if (e.type === "income") monthMap[key].inc += e.amount; else monthMap[key].exp += e.amount;
  });
  const sortedMonths = Object.entries(monthMap).sort((a, b) => a[0].localeCompare(b[0]));
  if (sortedMonths.length < 2) return null;

  let cumulative = 0;
  const points = sortedMonths.map(([, v]) => { cumulative += (v.inc - v.exp); return cumulative; });
  const maxP = Math.max(...points, 0);
  const minP = Math.min(...points, 0);
  const range = maxP - minP || 1;

  const totalInc = yearEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExp = yearEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100).toFixed(1) : "0.0";
  const fmtS = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const w = 280, h = 60, pad = 4;
  const step = (w - pad * 2) / (points.length - 1 || 1);
  const pathPoints = points.map((p, i) => `${pad + i * step},${h - pad - ((p - minP) / range) * (h - pad * 2)}`);
  const linePath = `M ${pathPoints.join(" L ")}`;
  const areaPath = `${linePath} L ${pad + (points.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: `1px solid ${T().cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>{year} in Review</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase" }}>Net</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T().mono, color: cumulative >= 0 ? T().inc : T().exp }}>
              {cumulative >= 0 ? "+" : ""}{fmtS(cumulative)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase" }}>Savings</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T().mono, color: T().accentLight }}>{savingsRate}%</div>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60 }}>
        <defs>
          <linearGradient id="yirAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T().inc} stopOpacity="0.3" />
            <stop offset="100%" stopColor={T().inc} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {minP < 0 && <line x1={pad} y1={h - pad - ((0 - minP) / range) * (h - pad * 2)} x2={w - pad} y2={h - pad - ((0 - minP) / range) * (h - pad * 2)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />}
        <path d={areaPath} fill="url(#yirAreaGrad)" />
        <path d={linePath} fill="none" stroke={T().inc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={i} cx={pad + i * step} cy={h - pad - ((p - minP) / range) * (h - pad * 2)} r="3.5" fill={T().inc} stroke="#0a0a1a" strokeWidth="1.5" />)}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 4px 0" }}>
        {sortedMonths.map(([key], i) => <span key={i} style={{ fontSize: 9, color: T().textDim, fontFamily: T().mono }}>{new Date(key + "-15").toLocaleDateString("en-US", { month: "short" })}</span>)}
      </div>
    </div>
  );
}

// ── Category Breakdown (donut chart) ──
function CategoryBreakdown({ entries }) {
  const expEntries = entries.filter(e => e.type === "expense" && e.amount > 0 && e.paid !== false);
  if (expEntries.length < 2) return null;
  const catTotals = {};
  expEntries.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const cats = allCats();
  const data = Object.entries(catTotals).map(([id, amount]) => {
    const cat = cats.find(c => c.id === id) || { id, label: id, icon: "\u{1F4CB}", color: "#f97316" };
    return { ...cat, amount };
  }).sort((a, b) => b.amount - a.amount);
  if (data.length < 2) return null;

  const total = data.reduce((s, d) => s + d.amount, 0);
  const cx = 60, cy = 60, r = 46, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let cumulativeOffset = 0;

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: `1px solid ${T().cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Category Breakdown</div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
            {data.map((d, i) => {
              const pct = d.amount / total;
              const dashLen = pct * circumference;
              const gap = circumference - dashLen;
              const offset = cumulativeOffset;
              cumulativeOffset += dashLen;
              return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={strokeW} strokeDasharray={`${dashLen} ${gap}`} strokeDashoffset={-offset} />;
            })}
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T().mono, color: T().text }}>${total >= 1000 ? (total / 1000).toFixed(1) + "k" : total.toFixed(0)}</div>
            <div style={{ fontSize: 8, color: T().textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>total</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
          {data.slice(0, 7).map(d => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 6px", borderRadius: 6 }}>
              <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{d.icon}</span>
              <span style={{ fontSize: 11, color: T().text, fontWeight: 500, flex: 1 }}>{d.label}</span>
              <span style={{ fontSize: 10, fontFamily: T().mono, color: T().textSub, fontWeight: 600 }}>{fmt(d.amount)}</span>
              <span style={{ fontSize: 9, fontFamily: T().mono, color: T().textDim, width: 28, textAlign: "right" }}>{((d.amount / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Budget vs Actual (envelope caps vs real spending) ──
function BudgetVsActual({ entries, envelopes, nodes, nodeId }) {
  // Gather envelope caps from all child nodes (or this node)
  const childIds = nodes.filter(n => n.parentId === nodeId).map(n => n.id);
  const targetIds = childIds.length > 0 ? childIds : [nodeId];
  const catTotals = {}; // { catId: { cap, actual } }

  targetIds.forEach(nid => {
    const nodeEnvs = (envelopes || {})[nid] || {};
    for (const [catId, env] of Object.entries(nodeEnvs)) {
      if (!env || !env.cap || env.cap <= 0) continue;
      if (!catTotals[catId]) catTotals[catId] = { cap: 0, actual: 0 };
      catTotals[catId].cap += env.cap;
      const spent = entries.filter(e => e.nodeId === nid && e.category === catId && e.type === "expense" && e.paid !== false).reduce((s, e) => s + e.amount, 0);
      catTotals[catId].actual += spent;
    }
  });

  const cats = allCats();
  const data = Object.entries(catTotals).map(([catId, v]) => {
    const cat = cats.find(c => c.id === catId) || { id: catId, label: catId, icon: "\u{1F4CB}", color: "#f97316" };
    return { cat: cat.label, icon: cat.icon, color: cat.color, cap: v.cap, actual: v.actual };
  }).sort((a, b) => b.cap - a.cap);

  if (data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => Math.max(d.cap, d.actual)));
  const fmtB = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: `1px solid ${T().cardBorder}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Budget vs. Actual</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} /><span style={{ fontSize: 10, color: T().textMuted }}>Budget Cap</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T().accent }} /><span style={{ fontSize: 10, color: T().textMuted }}>Actual Spent</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => {
          const capPct = (d.cap / maxVal) * 100;
          const actPct = (d.actual / maxVal) * 100;
          const over = d.actual > d.cap;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: T().text }}>{d.icon} {d.cat}</span>
                <span style={{ fontSize: 10, fontFamily: T().mono, color: over ? T().exp : T().inc, fontWeight: 600 }}>
                  ${fmtB(d.actual)} / ${fmtB(d.cap)}
                  {over && <span style={{ marginLeft: 4, fontSize: 9, color: T().exp }}>OVER</span>}
                </span>
              </div>
              <div style={{ position: "relative", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: `${capPct}%`, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.25)", zIndex: 2 }} />
                <div style={{
                  height: "100%", borderRadius: 6, width: `${Math.min(actPct, 100)}%`,
                  background: over ? `linear-gradient(90deg, ${T().exp}aa, ${T().exp}66)` : `linear-gradient(90deg, ${T().accent}cc, ${T().accent}55)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




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
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flex: 1, maxHeight: 120, overflowY: "auto", padding: "2px 0" }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  style={{ width: 30, height: 30, borderRadius: 6, border: form.icon === ic ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.08)", background: form.icon === ic ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)", color: T().text, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>{ic}</button>
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
  const cat = allCats().find(c => c.id === entry.category)||{id:"other",label:"Other",icon:"📋",color:"#f97316"}; const isInc = entry.type === "income"; const isPaid = entry.paid !== false;
  const lRef = useRef(null), aRef = useRef(null), rRef = useRef(null), dRef = useRef(null);
  const [swipeX, setSwipeX] = useState(0); const [swiping, setSwiping] = useState(false); const ts = useRef({ x: 0, y: 0 });
  const onTS = e => { ts.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; setSwiping(false); };
  const onTM = e => { const dx = e.touches[0].clientX - ts.current.x; const dy = e.touches[0].clientY - ts.current.y; if (Math.abs(dx) > Math.abs(dy) && dx < 0) { setSwiping(true); setSwipeX(Math.max(dx, -210)); e.preventDefault(); } else if (Math.abs(dx) > Math.abs(dy) && dx > 0 && swipeX < 0) { setSwiping(true); setSwipeX(Math.min(swipeX + dx, 0)); e.preventDefault(); } };
  const onTE = () => { if (swipeX < -80) { setSwipeX(-210); } else { setSwipeX(0); } setSwiping(false); };
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
    </div>
  );

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 10 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 210, display: "flex", borderRadius: "0 10px 10px 0" }}>
        <button onClick={() => { onUpdate(entry.id, { paid: isPaid ? false : true }); haptic(); setSwipeX(0); }}
          style={{ flex: 1, background: isPaid ? "#475569" : "#22c55e", border: "none", color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          {isPaid ? "↩" : "✓"}<span style={{ fontSize: 9 }}>{isPaid ? "Unpay" : "Pay"}</span>
        </button>
        <button onClick={() => { onDuplicate(entry); haptic(); setSwipeX(0); }}
          style={{ flex: 1, background: T().accent, border: "none", color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          ❐<span style={{ fontSize: 9 }}>Copy</span>
        </button>
        <button onClick={() => { onRemove(entry.id); haptic(15); }}
          style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: "0 10px 10px 0", color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          ✕<span style={{ fontSize: 9 }}>Delete</span>
        </button>
      </div>
      <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE} onClick={() => { if (window.__DRAG_ENDED__ && Date.now() - window.__DRAG_ENDED__ < 300) return; if (swipeX < 0) { setSwipeX(0); return; } if (!swiping && swipeX === 0) onStartEdit(entry.id); }}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 10px 6px", background: T().row, borderRadius: 10, transition: swiping ? "none" : "transform 0.2s ease", transform: `translateX(${swipeX}px)`, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <div onTouchStart={onDragHandle} style={{ cursor: "grab", color: T().textDark, fontSize: 14, padding: "12px 10px", margin: "-10px -4px -10px -6px", touchAction: "none", userSelect: "none", flexShrink: 0 }}>⠿</div>
        <span style={{ fontSize: 16, width: 24, textAlign: "center", opacity: isPaid ? 0.5 : 0.85, flexShrink: 0 }}>{cat.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isInc ? 15 : 14, fontWeight: 500, color: isPaid ? T().textMuted : "#f1f5f9", textDecoration: isPaid ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.label || "(untitled)"}</div>
          <div style={{ fontSize: 11, color: isPaid ? T().textDim : "#94a3b8", marginTop: 1 }}>{cat.label} · {entry.date}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: T().mono, fontWeight: 600, fontSize: isInc ? 15 : 14, color: isInc ? T().inc : T().exp, opacity: isPaid ? 0.5 : 1, textDecoration: isPaid ? "line-through" : "none" }}>{isInc ? "+" : "−"}{fmt(Math.abs(entry.amount))}</div>
          {runningBalance !== undefined && <div style={{ fontFamily: T().mono, fontSize: 10, color: runningBalance >= 0 ? `${T().inc}80` : `${T().exp}80`, marginTop: 1 }}>{fmt(runningBalance)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Donut ──
function DonutChart({ entries }) {
  const expenses = entries.filter(e => e.type === "expense" && e.paid !== false);
  const byC = allCats().filter(c => c.id !== "income").map(c => ({...c, total: expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)})).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const tot = byC.reduce((s, c) => s + c.total, 0);
  if (tot === 0) return (<div style={{ textAlign: "center", padding: 20, color: "#475569", fontSize: 13 }}>No expenses yet</div>);
  const R = 38, CI = 2 * Math.PI * R; let off = 0;
  const segs = byC.map(c => { const fr = c.total / tot; const sg = {...c, da: `${fr * CI} ${CI}`, doff: -off}; off += fr * CI; return sg; });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        {segs.map((s, i) => (<circle key={i} cx={50} cy={50} r={R} fill="none" stroke={s.color} strokeWidth={14} strokeDasharray={s.da} strokeDashoffset={s.doff} transform="rotate(-90 50 50)" />))}
        <text x="50" y="48" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{fmt(tot).replace(".00", "")}</text>
        <text x="50" y="60" textAnchor="middle" fill="#94a3b8" fontSize="7">spent</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {byC.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#cbd5e1" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
            <span>{a.label}</span>
            <span style={{ color: "#94a3b8", fontFamily: T().mono }}>{fmt(a.total)}</span>
            <span style={{ color: "#64748b", fontFamily: T().mono, fontSize: 10 }}>{Math.round((a.total / tot) * 100)}%</span>
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
  const [rollTargetId, setRollTargetId] = useState("");

  // Categories that already have an envelope (include rollover in total)
  const envRows = catIds.map(catId => {
    const cat = cats.find(c => c.id === catId) || { id: catId, label: catId, icon: "📋", color: "#f97316" };
    const envData = nodeEnvs[catId] || {};
    const cap = envData.cap || 0;
    const rollover = envData.rollover || 0;
    const total = cap + rollover;
    const rolled = !!envData.rolledTo;
    const spent = entries.filter(e => e.nodeId === nodeId && e.category === catId && e.type === "expense" && e.paid !== false).reduce((s, e) => s + e.amount, 0);
    const left = total - spent;
    const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
    return { catId, cat, cap, rollover, total, spent, left, pct, isOver: spent > total, rolled };
  });

  // Categories available to add (not already enveloped, skip income)
  const availableCats = cats.filter(c => c.id !== "income" && !catIds.includes(c.id));

  const totalBudget = envRows.reduce((s, r) => s + r.total, 0);
  const totalSpent = envRows.reduce((s, r) => s + r.spent, 0);
  const totalLeft = totalBudget - totalSpent;

  // Find sibling budgets in the same parent folder for roll-forward target picker
  const getSiblingBudgets = () => {
    if (!nodes || nodes.length === 0) return [];
    const thisNode = nodes.find(n => n.id === nodeId);
    if (!thisNode || !thisNode.parentId) return [];
    return nodes.filter(n => n.parentId === thisNode.parentId && n.id !== nodeId && !n.archived);
  };

  const siblingBudgets = getSiblingBudgets();
  // Default to next sibling if no target selected yet
  const defaultTarget = (() => {
    const thisNode = nodes.find(n => n.id === nodeId);
    if (!thisNode || !thisNode.parentId) return null;
    const siblings = nodes.filter(n => n.parentId === thisNode.parentId);
    const myIdx = siblings.findIndex(s => s.id === nodeId);
    return myIdx >= 0 && myIdx < siblings.length - 1 ? siblings[myIdx + 1] : null;
  })();
  const selectedTargetId = rollTargetId || (defaultTarget ? defaultTarget.id : "");
  const rollTarget = siblingBudgets.find(s => s.id === selectedTargetId) || null;

  // Also resolve the rolled-to target for display (may differ from picker if already rolled)
  const rolledToNode = (() => {
    const rolledRow = envRows.find(r => r.rolled);
    if (!rolledRow) return null;
    const destId = (nodeEnvs[rolledRow.catId] || {}).rolledTo;
    return destId ? nodes.find(n => n.id === destId) : null;
  })();

  const rollableRows = envRows.filter(r => r.left > 0 && !r.rolled);
  const totalRollable = rollableRows.reduce((s, r) => s + r.left, 0);
  const anyRolled = envRows.some(r => r.rolled);
  const canRoll = siblingBudgets.length > 0 && rollableRows.length > 0 && !anyRolled;

  const handleRollForward = () => {
    if (!rollTarget) return;
    for (const row of rollableRows) {
      // Mark source as rolled
      const srcEnv = nodeEnvs[row.catId] || {};
      setEnvelope(nodeId, row.catId, { ...srcEnv, rolledTo: rollTarget.id, rolledAmount: row.left });
      // Add rollover to destination — inherit cap if destination doesn't have this category
      const destNodeEnvs = (envelopes || {})[rollTarget.id] || {};
      const destEnv = destNodeEnvs[row.catId] || {};
      setEnvelope(rollTarget.id, row.catId, {
        cap: destEnv.cap || row.cap,
        rollover: (destEnv.rollover || 0) + row.left,
        rolloverFrom: nodeId,
      });
    }
    setShowRollConfirm(false);
  };

  const handleUnroll = () => {
    for (const row of envRows.filter(r => r.rolled)) {
      const srcEnv = nodeEnvs[row.catId] || {};
      const rolledAmount = srcEnv.rolledAmount || 0;
      const destId = srcEnv.rolledTo;
      // Remove rolled markers from source
      const { rolledTo, rolledAmount: _ra, ...cleanSrc } = srcEnv;
      setEnvelope(nodeId, row.catId, cleanSrc);
      // Remove rollover from destination
      if (destId) {
        const destNodeEnvs = (envelopes || {})[destId] || {};
        const destEnv = destNodeEnvs[row.catId] || {};
        const newRollover = Math.max(0, (destEnv.rollover || 0) - rolledAmount);
        const { rolloverFrom, ...cleanDest } = destEnv;
        if (destEnv.cap > 0 || newRollover > 0) {
          setEnvelope(destId, row.catId, { ...cleanDest, rollover: newRollover });
        } else {
          removeEnvelope(destId, row.catId);
        }
      }
    }
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
          Roll forward {fmt(totalRollable)} →
        </button>
      )}

      {/* Roll confirm with target picker */}
      {showRollConfirm && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: `1px solid ${T().cardBorder}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8,
          animation: "slideIn 0.2s ease",
        }}>
          <div style={{ fontSize: 12, color: T().text, fontWeight: 600, marginBottom: 8 }}>Roll forward to:</div>

          {/* Target picker dropdown */}
          <select value={selectedTargetId} onChange={e => setRollTargetId(e.target.value)} style={{
            width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`,
            borderRadius: 8, padding: "8px 10px", color: T().text, fontSize: 12, outline: "none", marginBottom: 10,
            appearance: "auto",
          }}>
            <option value="">Select target budget...</option>
            {siblingBudgets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

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
            <button onClick={handleRollForward} disabled={!rollTarget} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
              background: rollTarget ? T().inc : "rgba(255,255,255,0.08)", color: rollTarget ? "#0a0a1a" : T().textDim,
              fontSize: 12, fontWeight: 700, cursor: rollTarget ? "pointer" : "default", opacity: rollTarget ? 1 : 0.5,
            }}>Roll → {rollTarget ? rollTarget.name : "..."}</button>
            <button onClick={() => setShowRollConfirm(false)} style={{
              padding: "9px 14px", borderRadius: 8, border: `1px solid ${T().cardBorder}`,
              background: "transparent", color: T().textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Rolled badge with undo */}
      {anyRolled && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", marginBottom: 8,
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>✓</span>
            <span style={{ fontSize: 11, color: T().inc, fontWeight: 600 }}>Rolled forward to {rolledToNode ? rolledToNode.name : "another budget"}</span>
          </div>
          <button onClick={handleUnroll} style={{
            background: "none", border: `1px solid rgba(34,197,94,0.3)`, borderRadius: 6,
            padding: "3px 8px", color: T().inc, fontSize: 10, fontWeight: 600, cursor: "pointer",
          }}>Undo</button>
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


// ── Savings Goals ──
function SavingsGoals({ goals = [], addGoal, updateGoal, removeGoal }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "\u{1F3AF}", target: "" });
  const [contributingId, setContributingId] = useState(null);
  const [contributeAmt, setContributeAmt] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTarget, setEditTarget] = useState("");

  const handleAdd = () => {
    const name = form.name.trim();
    const target = parseFloat(form.target);
    if (!name || !target || target <= 0) return;
    addGoal({ id: uid(), name, icon: form.icon, target, balance: 0, createdAt: todayISO() });
    setForm({ name: "", icon: "\u{1F3AF}", target: "" }); setAdding(false); haptic();
  };

  const handleContribute = (goalId) => {
    const amt = parseFloat(contributeAmt);
    if (!amt || amt <= 0) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { balance: (goal.balance || 0) + amt });
    setContributingId(null); setContributeAmt(""); haptic();
  };

  const handleEditTarget = (goalId) => {
    const v = parseFloat(editTarget);
    if (v > 0) updateGoal(goalId, { target: v });
    setEditingId(null); setEditTarget("");
  };

  const totalSaved = goals.reduce((s, g) => s + (g.balance || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.target || 0), 0);

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(6,182,212,0.06), rgba(6,182,212,0.01))",
      border: "1px solid rgba(6,182,212,0.15)", borderRadius: 16, padding: "14px 16px", marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: goals.length > 0 ? 10 : 0 }}>
        <div style={{ fontSize: 10, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {"🏦"} Savings Goals
        </div>
        {goals.length > 0 && (
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: T().mono, color: "#06b6d4" }}>
            {fmt(totalSaved)} <span style={{ fontSize: 9, fontWeight: 500, color: T().textMuted }}>/ {fmt(totalTarget)}</span>
          </div>
        )}
      </div>

      {/* Goal rows */}
      {goals.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
          {goals.map(g => {
            const pct = g.target > 0 ? Math.min((g.balance / g.target) * 100, 100) : 0;
            const reached = g.balance >= g.target && g.target > 0;
            return (
              <div key={g.id}>
                {editingId === g.id ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", animation: "slideIn 0.15s ease" }}>
                    <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{g.icon}</span>
                    <span style={{ fontSize: 12, color: T().text, fontWeight: 500, minWidth: 50 }}>{g.name}</span>
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 12, fontFamily: T().mono }}>$</span>
                      <input value={editTarget} onChange={e => setEditTarget(e.target.value.replace(/[^0-9.]/g, ""))} autoFocus inputMode="decimal"
                        onKeyDown={e => { if (e.key === "Enter") handleEditTarget(g.id); if (e.key === "Escape") setEditingId(null); }}
                        style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 6, padding: "6px 6px 6px 22px", color: T().text, fontSize: 12, fontFamily: T().mono, outline: "none" }} />
                    </div>
                    <button onClick={() => handleEditTarget(g.id)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#06b6d4", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: "6px 8px", borderRadius: 6, border: `1px solid ${T().cardBorder}`, background: "transparent", color: T().textMuted, fontSize: 11, cursor: "pointer" }}>{"\u2715"}</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{g.icon}</span>
                        <span style={{ fontSize: 12, color: T().text, fontWeight: 500 }}>{g.name}</span>
                        <span style={{ fontSize: 9, color: T().textDim, fontFamily: T().mono }}>{fmt(g.balance || 0)} / {fmt(g.target)}</span>
                        {reached && <span style={{ fontSize: 8, color: "#fbbf24", fontWeight: 700, background: "rgba(251,191,36,0.12)", padding: "1px 5px", borderRadius: 3 }}>{"\u{1F389}"} Goal reached!</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontFamily: T().mono, fontWeight: 600, color: "#06b6d4" }}>{Math.round(pct)}%</span>
                        <button onClick={() => { setContributingId(contributingId === g.id ? null : g.id); setContributeAmt(""); }} title="Contribute" style={{ background: "none", border: "none", color: contributingId === g.id ? "#06b6d4" : T().textDim, cursor: "pointer", fontSize: 12, padding: "2px 4px", fontWeight: 700 }}>+</button>
                        <button onClick={() => { setEditingId(g.id); setEditTarget(String(g.target)); }} title="Edit target" style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>{"\u270E"}</button>
                        <button onClick={() => { if (confirm(`Delete "${g.name}"?`)) { removeGoal(g.id); haptic(); } }} title="Delete" style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 12, padding: "2px 4px" }}
                          onMouseEnter={e => (e.currentTarget.style.color = T().exp)} onMouseLeave={e => (e.currentTarget.style.color = T().textDim)}>{"\u00D7"}</button>
                      </div>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: reached ? "#fbbf24" : "#06b6d4", borderRadius: 3, transition: "width 0.4s ease" }} />
                    </div>
                    {/* Contribute inline */}
                    {contributingId === g.id && (
                      <div style={{ display: "flex", gap: 6, marginTop: 6, animation: "slideIn 0.15s ease" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 12, fontFamily: T().mono }}>$</span>
                          <input value={contributeAmt} onChange={e => setContributeAmt(e.target.value.replace(/[^0-9.]/g, ""))} autoFocus inputMode="decimal" placeholder="Amount"
                            onKeyDown={e => { if (e.key === "Enter") handleContribute(g.id); if (e.key === "Escape") setContributingId(null); }}
                            style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 6, padding: "6px 6px 6px 22px", color: T().text, fontSize: 12, fontFamily: T().mono, outline: "none" }} />
                        </div>
                        <button onClick={() => handleContribute(g.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#06b6d4", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Add</button>
                        <button onClick={() => setContributingId(null)} style={{ padding: "6px 8px", borderRadius: 6, border: `1px solid ${T().cardBorder}`, background: "transparent", color: T().textMuted, fontSize: 11, cursor: "pointer" }}>{"\u2715"}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add goal form */}
      {adding ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "slideIn 0.15s ease", marginTop: goals.length > 0 ? 4 : 10 }}>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Goal name (e.g. Emergency Fund)"
            style={{ background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 8, padding: "8px 10px", color: T().text, fontSize: 13, outline: "none" }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T().textMuted }}>Icon:</span>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flex: 1, maxHeight: 80, overflowY: "auto", padding: "2px 0" }}>
              {["\u{1F3AF}","\u{1F3E6}","\u{1F4B0}","\u{1F3E0}","\u2708\uFE0F","\u{1F697}","\u{1F393}","\u{1F4BB}","\u{1F3E5}","\u{1F476}","\u{1F43E}","\u{1F48D}","\u{1F3D6}\uFE0F","\u{1F6E1}\uFE0F","\u{1F4C8}","\u{1F381}"].map(ic => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  style={{ width: 28, height: 28, borderRadius: 6, border: form.icon === ic ? "2px solid #06b6d4" : "1px solid rgba(255,255,255,0.08)", background: form.icon === ic ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>{ic}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T().textMuted, fontSize: 13, fontFamily: T().mono }}>$</span>
              <input value={form.target} onChange={e => setForm({ ...form, target: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="Target amount" inputMode="decimal"
                onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                style={{ width: "100%", boxSizing: "border-box", background: T().inputBg, border: `1px solid ${T().inputBorder}`, borderRadius: 8, padding: "8px 8px 8px 24px", color: T().text, fontSize: 13, fontFamily: T().mono, outline: "none" }} />
            </div>
            <button onClick={handleAdd} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#06b6d4", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Create</button>
            <button onClick={() => { setAdding(false); setForm({ name: "", icon: "\u{1F3AF}", target: "" }); }} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${T().cardBorder}`, background: "transparent", color: T().textMuted, fontSize: 12, cursor: "pointer" }}>{"\u2715"}</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          display: "block", width: "100%", padding: "8px 0", borderRadius: 8,
          border: "1px dashed rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.04)",
          color: "#06b6d4", fontSize: 11, fontWeight: 600, cursor: "pointer",
          marginTop: goals.length > 0 ? 0 : 10,
        }}>+ Add Savings Goal</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// NODE PAGE
// ══════════════════════════════════════════════════
function NodePage({ node, parentName, nodes, entries, customCategories, envelopes, displayPrefs, onBack, onNavigate, addNode, updateNode, removeNode, reorderNodes, addEntry, updateEntry, removeEntry, reorderEntries, addCategory, removeCategory, setEnvelope, removeEnvelope, getDesc, savingsGoals, addSavingsGoal, updateSavingsGoal, removeSavingsGoal }) {
  const [addingChild, setAddingChild] = useState(false);
  const [copyingFrom, setCopyingFrom] = useState(null); // source node id for copy
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showTxn, setShowTxn] = useState(true);
  const fileRef = useRef(null);

  const allChildren = nodes.filter(n => n.parentId === node.id);
  const children = showArchived ? allChildren : allChildren.filter(c => !c.archived);
  const archivedCount = allChildren.filter(c => c.archived).length;
  const directEntries = entries.filter(e => e.nodeId === node.id);
  const isFolderMode = children.length > 0 || addingChild || allChildren.length > 0;
  const { inc, exp, balance } = getNodeBalance(nodes, entries, node.id);
  const color = node.color || "#6366f1";
  const childStats = children.map(c => ({ ...c, ...getNodeBalance(nodes, entries, c.id), childCount: nodes.filter(n => n.parentId === c.id).length }));

  // Copy budget: duplicate envelope structure (caps only, no entries/rollover state)
  const handleCopyBudget = (name) => {
    if (!copyingFrom || !name.trim()) { setCopyingFrom(null); return; }
    const newId = uid();
    const srcNode = nodes.find(n => n.id === copyingFrom);
    addNode({ id: newId, parentId: node.id, name: name.trim(), color: srcNode?.color || PALETTE[children.length % PALETTE.length] });
    // Copy envelopes — caps only, strip rollover/rolled state
    const srcEnvs = (envelopes || {})[copyingFrom] || {};
    for (const [catId, env] of Object.entries(srcEnvs)) {
      if (env && env.cap > 0) {
        setEnvelope(newId, catId, { cap: env.cap });
      }
    }
    setCopyingFrom(null);
    haptic();
  };

  // All folders use the traditional folder view — envelopes live on leaf nodes (the monthly budgets)

  // All descendant entries for folder-level analytics
  const allDescEntries = getAllDescendantEntries(nodes, entries, node.id);

  let cumulative = 0; const rb = {};
  directEntries.forEach(e => { cumulative += e.type === "income" ? e.amount : -e.amount; rb[e.id] = cumulative; });
  const filtered = search ? directEntries.filter(e => e.label.toLowerCase().includes(search.toLowerCase()) || (allCats().find(c => c.id === e.category)?.label||"").toLowerCase().includes(search.toLowerCase())) : directEntries;

  const handleAddEntry = (type) => { const eid = uid(); addEntry({ id: eid, nodeId: node.id, label: "", amount: 0, category: type === "income" ? "income" : "other", type, date: todayStr(), dateISO: todayISO(), paid: false }); setEditingId(eid); setSearch(""); setTab("overview"); haptic(); };
  const handleImport = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { parseCSV(ev.target.result).forEach(p => addEntry({ id: uid(), nodeId: node.id, ...p, dateISO: todayISO(), paid: false })); }; reader.readAsText(file); e.target.value = ""; };

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
          </>
        )}
      </div>

      <div style={{ padding: "0 20px 120px" }}>
        {isFolderMode ? (
          /* ═══ FOLDER VIEW — lists child budgets to open ═══ */
          <>
            {displayPrefs.monthlyTrends && <MonthlyTrends entries={allDescEntries} />}
            {displayPrefs.yearInReview && <YearInReview entries={allDescEntries} />}
            {displayPrefs.categoryBreakdown && <CategoryBreakdown entries={allDescEntries} />}
            {displayPrefs.budgetVsActual && <BudgetVsActual entries={entries} envelopes={envelopes} nodes={nodes} nodeId={node.id} />}

            <SavingsGoals goals={savingsGoals} addGoal={addSavingsGoal} updateGoal={updateSavingsGoal} removeGoal={removeSavingsGoal} />

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
                <button onClick={e => { e.stopPropagation(); setCopyingFrom(c.id); haptic(); }} title="Copy budget" style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "2px 4px" }} onMouseEnter={e => (e.currentTarget.style.color = T().accentLight)} onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>⧉</button>
                <button onClick={e => { e.stopPropagation(); updateNode(c.id, { archived: !c.archived }); haptic(); }} title={c.archived ? "Unarchive" : "Archive"} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "2px 4px" }}>{c.archived ? "↩" : "📦"}</button>
                <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${c.name}"?`)) { removeNode(c.id); haptic(15); }}} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>×</button>
              </div>
            )} />

            {/* Copy budget inline form */}
            {copyingFrom && (
              <div style={{ marginTop: 8, animation: "slideIn 0.2s ease" }}>
                <div style={{ fontSize: 11, color: T().textMuted, marginBottom: 6 }}>
                  Copying from: <strong style={{ color: T().text }}>{nodes.find(n => n.id === copyingFrom)?.name || "Budget"}</strong>
                  <span style={{ fontSize: 9, color: T().textDim, marginLeft: 6 }}>(envelopes, recurring — no transactions)</span>
                </div>
                <InlineNew placeholder="New budget name (e.g. May 2026)" accentColor={color} icon={<div style={{ width: 8 }} />}
                  onCommit={name => handleCopyBudget(name)} onCancel={() => setCopyingFrom(null)} />
              </div>
            )}

            {archivedCount > 0 && !showArchived && (
              <button onClick={() => setShowArchived(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Show {archivedCount} archived budget{archivedCount !== 1 ? "s" : ""}</button>
            )}
            {showArchived && archivedCount > 0 && (
              <button onClick={() => setShowArchived(false)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: "#475569", fontSize: 11, cursor: "pointer" }}>Hide archived</button>
            )}
            {addingChild && <div style={{ marginTop: 8 }}><InlineNew placeholder="Sub-budget name" accentColor={color} icon={<div style={{ width: 8 }} />}
              onCommit={name => { addNode({ id: uid(), parentId: node.id, name, color: PALETTE[children.length % PALETTE.length] }); setAddingChild(false); haptic(); }} onCancel={() => setAddingChild(false)} /></div>}
            <BottomBar><Btn onClick={() => setAddingChild(true)} bg={`${color}25`} color={color}>+ New Sub-budget</Btn></BottomBar>
          </>
        ) : (
          <>
            {/* Budget Summary Card */}
            {(() => { const tInc = directEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0); const tExp = directEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0); const bal = tInc - tExp; return (
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03))", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Income</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T().mono, color: T().inc }}>{fmt(tInc)}</div>
                </div>
                <div style={{ flex: 1, background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Expenses</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T().mono, color: T().exp }}>{fmt(tExp)}</div>
                </div>
                <div style={{ flex: 1, background: `linear-gradient(135deg, ${bal >= 0 ? "rgba(34,197,94,0.08), rgba(34,197,94,0.02)" : "rgba(239,68,68,0.08), rgba(239,68,68,0.02)"})`, border: `1px solid ${bal >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}`, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: T().textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Balance</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T().mono, color: bal >= 0 ? T().inc : T().exp }}>{bal >= 0 ? "+" : "−"}{fmt(Math.abs(bal))}</div>
                </div>
              </div>
            ); })()}
            <div style={{ background: T().surface, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 12 }}><DonutChart entries={directEntries} /></div>
            {directEntries.length > 3 && <SearchBar value={search} onChange={setSearch} />}

            {/* Collapsible Transactions header */}
            <button onClick={() => { setShowTxn(!showTxn); haptic(5); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", marginBottom: 0 }}>
              <span style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Transactions ({filtered.length}{search ? ` of ${directEntries.length}` : ""})</span>
              <span style={{ fontSize: 14, color: T().textMuted, transition: "transform 0.2s", transform: showTxn ? "rotate(0deg)" : "rotate(-90deg)" }}>▾</span>
            </button>

            {showTxn && (
              <>
                {filtered.length === 0 ? <EmptyState text={search ? "No matches" : "No entries yet"} sub={search ? "Try a different search or tag" : "Add income or expenses below"} /> : (
                  <DraggableList items={filtered} onReorder={ids => reorderEntries(node.id, ids)} renderItem={(e, _i, onDragHandle) => (
                    <EntryRow key={e.id} entry={e} runningBalance={rb[e.id]} onUpdate={updateEntry} onRemove={removeEntry} onDuplicate={src => { const eid = uid(); addEntry({ ...src, id: eid, date: todayStr(), dateISO: todayISO(), recurring: false, paid: false }); setEditingId(eid); haptic(); }} isEditing={editingId === e.id} onStartEdit={setEditingId} onStopEdit={() => setEditingId(null)} onDragHandle={onDragHandle} allEntries={entries} />
                  )} />
                )}
              </>
            )}
            <div style={{ display: "flex", gap: 10, padding: "16px 0 24px" }}>
              <Btn onClick={() => handleAddEntry("income")} bg={`${T().inc}25`} color={T().inc}>+ Income</Btn>
              <Btn onClick={() => handleAddEntry("expense")} bg={`${T().exp}25`} color={T().exp}>+ Expense</Btn>
            </div>
            <div><div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Import / Export</div><div style={{ display: "flex", gap: 8 }}><button onClick={() => exportCSV(directEntries, node.name)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: T().surface, color: T().textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↓ Export CSV</button><button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: T().surface, color: T().textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↑ Import CSV</button><input ref={fileRef} type="file" accept=".csv" onChange={handleImport} style={{ display: "none" }} /></div></div>
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
  const [displayPrefs, setDisplayPrefsState] = useState({ ...DEFAULT_DISPLAY_PREFS });
  const [displayPrefsLoaded, setDisplayPrefsLoaded] = useState(false);
  useEffect(() => { if (user?.uid) { getDisplayPrefs(user.uid).then(p => { setDisplayPrefsState(p); setDisplayPrefsLoaded(true); }); } }, [user?.uid]);
  const toggleDisplayPref = async (key) => { const next = { ...displayPrefs, [key]: !displayPrefs[key] }; setDisplayPrefsState(next); if (user?.uid) await setDisplayPrefs(user.uid, next); };
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

            {/* Display Preferences */}
            <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: 12, marginTop: 4, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <div><div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Folder Charts</div><div style={{ fontSize: 10, color: t.textMuted }}>Per-user — won't affect your partner</div></div>
              </div>
              {displayPrefsLoaded && [
                { key: "monthlyTrends", label: "Monthly Trends", sub: "Income vs expenses bar chart" },
                { key: "yearInReview", label: "Year in Review", sub: "Cumulative savings sparkline" },
                { key: "categoryBreakdown", label: "Category Breakdown", sub: "Expense donut chart" },
                { key: "budgetVsActual", label: "Budget vs. Actual", sub: "Envelope caps vs real spending" },
              ].map(({ key, label, sub }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", marginLeft: 32 }}>
                  <div><div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 9, color: t.textMuted }}>{sub}</div></div>
                  <button onClick={() => toggleDisplayPref(key)} style={{
                    width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                    background: displayPrefs[key] ? t.accent : "rgba(255,255,255,0.1)",
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 8, background: "#fff", position: "absolute", top: 2, transition: "left 0.2s",
                      left: displayPrefs[key] ? 18 : 2,
                    }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Categories */}
            <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: 12, marginTop: 4 }}>
              <CategoryManager customCategories={d.customCategories || []} onAdd={app.addCategory} onRemove={app.removeCategory} />
            </div>

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
    <NodePage node={cur} parentName={par ? par.name : "Folders"} nodes={d.nodes} entries={d.entries} customCategories={d.customCategories} envelopes={d.envelopes} displayPrefs={displayPrefs}
      onBack={goBack} onNavigate={goTo} addNode={app.addNode} updateNode={app.updateNode} removeNode={app.removeNode} reorderNodes={app.reorderNodes}
      addEntry={app.addEntry} updateEntry={app.updateEntry} removeEntry={app.removeEntry} reorderEntries={app.reorderEntries}
      addCategory={app.addCategory} removeCategory={app.removeCategory} setEnvelope={app.setEnvelope} removeEnvelope={app.removeEnvelope} getDesc={app.getDesc}
      savingsGoals={d.savingsGoals} addSavingsGoal={app.addSavingsGoal} updateSavingsGoal={app.updateSavingsGoal} removeSavingsGoal={app.removeSavingsGoal} />
  );
}
