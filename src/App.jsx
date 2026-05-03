import { useState, useEffect, useRef, useCallback, Component } from "react";

// React error boundary — catches render errors from any descendant and shows a readable message
// (instead of going blank). Without this, a thrown exception during render renders nothing.
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] render error:", error, info);
    this.setState({ info });
  }
  reset = () => this.setState({ error: null, info: null });
  render() {
    if (this.state.error) {
      const e = this.state.error;
      const info = this.state.info;
      return (
        <div style={{ padding: 20, fontFamily: "system-ui, -apple-system, sans-serif", color: "#1c1917", background: "#fafaf9", minHeight: "100vh", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 540, margin: "32px auto" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#dc2626", marginBottom: 4 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: "#44403c", marginBottom: 14 }}>The page hit an error and couldn't render. Share the message below if asking for a fix.</div>
            <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>Error</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", marginBottom: 6 }}>{e.message || String(e)}</div>
              {e.stack && <pre style={{ margin: 0, fontSize: 11, fontFamily: "ui-monospace, SF Mono, monospace", color: "#57534e", whiteSpace: "pre-wrap", overflow: "auto", maxHeight: 200 }}>{e.stack}</pre>}
            </div>
            {info?.componentStack && (
              <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>Component stack</div>
                <pre style={{ margin: 0, fontSize: 11, fontFamily: "ui-monospace, SF Mono, monospace", color: "#57534e", whiteSpace: "pre-wrap", overflow: "auto", maxHeight: 160 }}>{info.componentStack}</pre>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={this.reset} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Try again</button>
              <button onClick={() => window.location.reload()} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #d6d3d1", background: "#fff", color: "#44403c", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reload</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  // YNAB-inspired light theme — soft off-white background, deep navy text, lime/red accent pops.
  linen: {
    id: "linen", name: "Linen Light",
    bg: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)",
    text: "#1c1917", textSub: "#44403c", textMuted: "#78716c", textDim: "#a8a29e", textDark: "#d6d3d1",
    accent: "#4f46e5", accentLight: "#6366f1",
    inc: "#16a34a", exp: "#dc2626",
    card: "#ffffff",
    cardBorder: "#e7e5e4", surface: "#f5f5f4", surfaceHover: "#e7e5e4",
    row: "#ffffff", inputBg: "#ffffff", inputBorder: "#d6d3d1",
    glow: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
    titleGrad: "linear-gradient(135deg, #1c1917, #44403c)",
    selectBg: "#ffffff",
    font: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    fontImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
  },
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
function T() { return THEMES[window.__THEME__ || "linen"] || THEMES.linen; }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmt(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n); }

// ── Animated Number Hook ──
function useAnimatedNumber(target, duration = 650) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);
  const toRef = useRef(target);
  const currentRef = useRef(target);

  useEffect(() => {
    if (toRef.current === target) return;
    fromRef.current = currentRef.current;
    toRef.current = target;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const value = fromRef.current + (toRef.current - fromRef.current) * eased;
      currentRef.current = value;
      setDisplay(value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        currentRef.current = toRef.current;
        setDisplay(toRef.current);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

// ── Animated Currency Display ──
function AnimatedCurrency({ value, dollarStyle, centsStyle, prefix = "" }) {
  const animated = useAnimatedNumber(value);
  const absVal = Math.abs(animated);
  const str = fmt(absVal);
  const dotIdx = str.indexOf(".");
  const dollarPart = (animated < 0 ? "-" : "") + prefix + str.slice(0, dotIdx);
  const centsPart = str.slice(dotIdx);
  return (
    <>
      <span style={dollarStyle}>{dollarPart}</span>
      <span style={centsStyle}>{centsPart}</span>
    </>
  );
}
function todayStr() { return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) { if (!iso) return todayStr(); const d = new Date(iso + "T12:00:00"); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function daysBetween(a, b) { return Math.floor((b - a) / 864e5); }
function haptic(ms = 10) { try { navigator.vibrate?.(ms); } catch {} }

// ── Recurrings on load ──
function processRecurrings(data) {
  return data;
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
import { db, auth, signOut, doc, setDoc, onSnapshot, collection, requestNotificationPermission, getNotificationPrefs, setNotificationPrefs, DEFAULT_NOTIFICATION_PREFS, waitForPendingWrites } from "./firebase";
import NotificationManager from "./NotificationManager";
import { deleteDoc } from "firebase/firestore";

// Tracks online/offline status and whether there are pending Firestore writes
function useConnectionStatus() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const onUp = () => setOnline(true);
    const onDown = () => setOnline(false);
    window.addEventListener("online", onUp);
    window.addEventListener("offline", onDown);
    return () => { window.removeEventListener("online", onUp); window.removeEventListener("offline", onDown); };
  }, []);
  return online;
}

const EMPTY_DATA = { nodes: [], entries: [], recurrings: [], customCategories: [], savingsGoals: [], bankAccount: {}, bankAccounts: {}, nwItems: [], budgetMonths: {}, goals: {}, accounts: [] };

// ── Accounts (top-level, YNAB-style) ─────────────────────────────────────
// accounts shape: { id, name, type: "checking"|"savings"|"credit"|"cash", color, archived, startingBalance, createdAt }
// Each entry can carry `accountId` (which account did this transaction hit) and `cleared` (default true).
// Account current balance = startingBalance + Σ(income on this acct) − Σ(paid expenses on this acct)
// Credit cards naturally go negative when there's an outstanding balance owed (charges > payments).
function getAccountBalance(account, entries) {
  if (!account) return 0;
  let sum = account.startingBalance || 0;
  for (const e of entries) {
    if (e.accountId !== account.id) continue;
    if (e.type === "expense" && e.paid !== false) sum -= (e.amount || 0);
    else if (e.type === "income") sum += (e.amount || 0);
  }
  return sum;
}

// ── Category goals ──────────────────────────────────────────────────────
// goals shape: { [categoryNodeId]: { type: "monthly" | "target", amount: number, by?: "YYYY-MM-DD", createdAt } }
//   "monthly": assign `amount` every month (e.g. "$500/mo for groceries")
//   "target":  reach `amount` available by date `by` (e.g. "$5,000 emergency fund by Dec 2026")

// How much more to assign THIS MONTH to stay on track for the goal.
function getGoalNeeded(goal, assignedThisMonth, availableThroughLastMonth, monthKey) {
  if (!goal) return 0;
  if (goal.type === "monthly") {
    return Math.max(0, (goal.amount || 0) - (assignedThisMonth || 0));
  }
  if (goal.type === "target") {
    // Months remaining (inclusive of current) until target month
    const tgtMonth = (goal.by || "").slice(0, 7); // "YYYY-MM"
    if (!tgtMonth) return 0;
    const [cy, cm] = monthKey.split("-").map(Number);
    const [ty, tm] = tgtMonth.split("-").map(Number);
    const monthsRemaining = (ty - cy) * 12 + (tm - cm) + 1;
    if (monthsRemaining <= 0) {
      // Past due — need everything not yet covered, this month
      return Math.max(0, (goal.amount || 0) - (availableThroughLastMonth || 0));
    }
    const remaining = (goal.amount || 0) - (availableThroughLastMonth || 0);
    if (remaining <= 0) return 0;
    const monthlyContribution = remaining / monthsRemaining;
    return Math.max(0, monthlyContribution - (assignedThisMonth || 0));
  }
  return 0;
}

// Short human-readable goal summary for a category row badge
function describeGoal(goal) {
  if (!goal) return null;
  const amt = goal.amount || 0;
  const fmtCompact = n => n >= 1000 ? `$${(n/1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : `$${Math.round(n)}`;
  if (goal.type === "monthly") return `${fmtCompact(amt)}/mo`;
  if (goal.type === "target") {
    const by = goal.by || "";
    if (!by) return `${fmtCompact(amt)} target`;
    const dt = new Date(by + "T00:00:00");
    if (isNaN(dt)) return `${fmtCompact(amt)} target`;
    const monthYr = dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    return `${fmtCompact(amt)} by ${monthYr}`;
  }
  return null;
}

// ── YNAB-style budget math ───────────────────────────────────────────────
// budgetMonths shape: { "YYYY-MM": { [categoryNodeId]: { assigned: number } } }
// Available is derived (rolling carryover from earliest activity through the displayed month).
// Ready to Assign is derived (all-time income − all-time assignments).

function getCategoryDescendantIds(nodes, nodeId) {
  // visited-set guard against circular parentId references in legacy data —
  // an infinite loop here would freeze (and visually blank) the page.
  const out = [nodeId];
  const seen = new Set([nodeId]);
  const stack = [nodeId];
  while (stack.length) {
    const cur = stack.pop();
    for (const n of nodes) if (n.parentId === cur && !seen.has(n.id)) { seen.add(n.id); out.push(n.id); stack.push(n.id); }
  }
  return out;
}

// Sum of paid expenses on a category (and all descendants) in a single YYYY-MM window
function getCategoryActivity(nodes, entries, nodeId, monthKey) {
  const ids = new Set(getCategoryDescendantIds(nodes, nodeId));
  let sum = 0;
  for (const e of entries) {
    if (e.type !== "expense") continue;
    if (e.paid === false) continue;
    if (!ids.has(e.nodeId)) continue;
    if (!(e.dateISO || "").startsWith(monthKey)) continue;
    sum += (e.amount || 0);
  }
  return sum;
}

// Rolling Available: Σ over months ≤ monthKey of (assigned − activity)
function getCategoryAvailable(nodes, entries, budgetMonths, nodeId, monthKey) {
  const ids = new Set(getCategoryDescendantIds(nodes, nodeId));
  // Collect every month with either an assignment or paid-expense activity for this category up to monthKey
  const months = new Set();
  for (const m of Object.keys(budgetMonths || {})) {
    if (m <= monthKey && (budgetMonths[m]?.[nodeId]?.assigned)) months.add(m);
  }
  for (const e of entries) {
    if (e.type !== "expense") continue;
    if (e.paid === false) continue;
    if (!ids.has(e.nodeId)) continue;
    const m = (e.dateISO || "").slice(0, 7);
    if (!m || m > monthKey) continue;
    months.add(m);
  }
  let total = 0;
  for (const m of months) {
    const assigned = budgetMonths?.[m]?.[nodeId]?.assigned || 0;
    total += assigned - getCategoryActivity(nodes, entries, nodeId, m);
  }
  return total;
}

// All-time income − all-time assignments across every category, every month.
// Income entries always feed Ready to Assign regardless of which folder they're filed under.
function getReadyToAssign(entries, budgetMonths) {
  let income = 0;
  for (const e of entries) if (e.type === "income") income += (e.amount || 0);
  let assigned = 0;
  for (const monthMap of Object.values(budgetMonths || {})) {
    for (const c of Object.values(monthMap || {})) assigned += (c?.assigned || 0);
  }
  return income - assigned;
}

function useApp(user, householdId) {
  const [d, setD] = useState(EMPTY_DATA);
  const [synced, setSynced] = useState(false);
  const [pendingWrites, setPendingWrites] = useState(false);
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
        setD(processRecurrings({ nodes: r.nodes||[], entries: r.entries||[], recurrings: r.recurrings||[], customCategories: r.customCategories||[], savingsGoals: r.savingsGoals||[], bankAccount: r.bankAccount||{}, bankAccounts: r.bankAccounts||{}, nwItems: r.nwItems||[], budgetMonths: r.budgetMonths||{}, goals: r.goals||{}, accounts: r.accounts||[] }));
      }
      setSynced(true);
    }, () => { try { const r = localStorage.getItem("maverick-budget-data"); if (r) setD(processRecurrings(JSON.parse(r))); } catch {} setSynced(true); });
    return unsub;
  }, [householdId]);

  const saveToCloud = useCallback((data) => {
    try { localStorage.setItem("maverick-budget-data", JSON.stringify(data)); } catch {}
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setPendingWrites(true);
    saveTimer.current = setTimeout(() => {
      if (docRef) {
        skipNextRemote.current = true;
        // setDoc resolves once the write reaches the server (or is queued in the local cache while offline).
        // waitForPendingWrites then resolves only after all queued writes have actually been acknowledged by the server.
        setDoc(docRef, { ...data, updatedAt: new Date().toISOString(), updatedBy: user?.email||"unknown" }).catch(e => console.error("Save:",e));
        waitForPendingWrites(db).then(() => setPendingWrites(false)).catch(() => {});
      } else {
        setPendingWrites(false);
      }
    }, 500);
  }, [docRef, user]);

  const up = fn => setD(p => { const next = fn(p); saveToCloud(next); return next; });
  // Recursive descendant walk — guarded against circular parentId references in legacy data
  // (a stack overflow here causes the rendered page to blank).
  const getDesc = useCallback((nodes, nid, visited) => {
    const seen = visited || new Set();
    if (seen.has(nid)) return [];
    seen.add(nid);
    const kids = nodes.filter(n => n.parentId === nid);
    let all = kids.map(k => k.id);
    kids.forEach(k => { all = all.concat(getDesc(nodes, k.id, seen)); });
    return all;
  }, []);
  return {
    d, synced, pendingWrites,
    cats: getCats(d.customCategories),
    addNode: useCallback(n => up(p => ({ ...p, nodes: [...p.nodes, n] })), []),
    updateNode: useCallback((id, u) => up(p => ({ ...p, nodes: p.nodes.map(n => n.id === id ? { ...n, ...u } : n) })), []),
    removeNode: useCallback(id => up(p => { const all = [id, ...getDesc(p.nodes, id)]; return { ...p, nodes: p.nodes.filter(n => !all.includes(n.id)), entries: p.entries.filter(e => !all.includes(e.nodeId)) }; }), [getDesc]),
    reorderNodes: useCallback((pid, ids) => up(p => { const others = p.nodes.filter(n => n.parentId !== pid); const reordered = ids.map(id => p.nodes.find(n => n.id === id)).filter(Boolean); return { ...p, nodes: [...others, ...reordered] }; }), []),
    addEntry: useCallback(e => up(p => ({ ...p, entries: [...p.entries, e] })), []),
    updateEntry: useCallback((id, u) => up(p => {
      const updated = p.entries.map(e => e.id === id ? { ...e, ...u } : e);
      if (u.dateISO !== undefined) {
        const target = updated.find(e => e.id === id);
        if (target && target.nodeId) {
          const nodeId = target.nodeId;
          const others = updated.filter(e => e.nodeId !== nodeId);
          const nodeEntries = updated.filter(e => e.nodeId === nodeId);
          nodeEntries.sort((a, b) => {
            const da = a.dateISO || ""; const db = b.dateISO || "";
            if (da && db) return da.localeCompare(db);
            if (da) return -1; if (db) return 1; return 0;
          });
          return { ...p, entries: [...others, ...nodeEntries] };
        }
      }
      return { ...p, entries: updated };
    }), []),
    removeEntry: useCallback(id => up(p => ({ ...p, entries: p.entries.filter(e => e.id !== id) })), []),
    addEntries: useCallback(arr => up(p => ({ ...p, entries: [...p.entries, ...arr] })), []),
    markAllPaid: useCallback(nodeId => up(p => ({ ...p, entries: p.entries.map(e => e.nodeId === nodeId ? { ...e, paid: true } : e) })), []),
    markAllUnpaid: useCallback(nodeId => up(p => ({ ...p, entries: p.entries.map(e => e.nodeId === nodeId ? { ...e, paid: false } : e) })), []),
    reorderEntries: useCallback((nodeId, orderedIds) => up(p => {
      const others = p.entries.filter(e => e.nodeId !== nodeId);
      const reordered = orderedIds.map(id => p.entries.find(e => e.id === id)).filter(Boolean);
      return { ...p, entries: [...others, ...reordered] };
    }), []),
    addCategory: useCallback(c => up(p => ({ ...p, customCategories: [...(p.customCategories||[]), c] })), []),
    removeCategory: useCallback(id => up(p => ({ ...p, customCategories: (p.customCategories||[]).filter(c => c.id !== id) })), []),
    addSavingsGoal: useCallback(g => up(p => ({ ...p, savingsGoals: [...(p.savingsGoals||[]), g] })), []),
    updateSavingsGoal: useCallback((id, u) => up(p => ({ ...p, savingsGoals: (p.savingsGoals||[]).map(g => g.id === id ? { ...g, ...u } : g) })), []),
    removeSavingsGoal: useCallback(id => up(p => ({ ...p, savingsGoals: (p.savingsGoals||[]).filter(g => g.id !== id) })), []),
    addNwItem: useCallback(item => up(p => ({ ...p, nwItems: [...(p.nwItems||[]), item] })), []),
    updateNwItem: useCallback((id, u) => up(p => ({ ...p, nwItems: (p.nwItems||[]).map(i => i.id === id ? { ...i, ...u } : i) })), []),
    removeNwItem: useCallback(id => up(p => ({ ...p, nwItems: (p.nwItems||[]).filter(i => i.id !== id) })), []),
    importNwItems: useCallback(items => up(p => {
      const existingIds = new Set((p.nwItems||[]).map(i => i.id));
      const fresh = items.filter(i => !existingIds.has(i.id));
      if (fresh.length === 0) return p;
      return { ...p, nwItems: [...(p.nwItems||[]), ...fresh] };
    }), []),
    // Budget assignment for a given month + category. Pass amount=0 (or null) to clear.
    setAssigned: useCallback((month, nodeId, amount) => up(p => {
      const months = { ...(p.budgetMonths || {}) };
      const monthMap = { ...(months[month] || {}) };
      const num = Number(amount) || 0;
      if (num === 0) delete monthMap[nodeId];
      else monthMap[nodeId] = { assigned: num };
      if (Object.keys(monthMap).length === 0) delete months[month];
      else months[month] = monthMap;
      return { ...p, budgetMonths: months };
    }), []),
    // Top-level Accounts (Checking / Savings / Credit / Cash)
    addAccount: useCallback(acct => up(p => ({ ...p, accounts: [...(p.accounts || []), { id: uid(), createdAt: new Date().toISOString(), startingBalance: 0, archived: false, ...acct }] })), []),
    updateAccount: useCallback((id, u) => up(p => ({ ...p, accounts: (p.accounts || []).map(a => a.id === id ? { ...a, ...u } : a) })), []),
    removeAccount: useCallback(id => up(p => ({
      ...p,
      accounts: (p.accounts || []).filter(a => a.id !== id),
      // Detach entries from the deleted account so they aren't orphaned
      entries: (p.entries || []).map(e => e.accountId === id ? { ...e, accountId: null } : e),
    })), []),
    // Bulk-attach entries to an account (used by the one-time migration to assign legacy entries to a default Cash account)
    setEntryAccounts: useCallback((entryIds, accountId) => up(p => ({
      ...p,
      entries: (p.entries || []).map(e => entryIds.includes(e.id) ? { ...e, accountId } : e),
    })), []),
    // Per-category goal CRUD. Pass goal=null to remove.
    setGoal: useCallback((nodeId, goal) => up(p => {
      const goals = { ...(p.goals || {}) };
      if (!goal) delete goals[nodeId];
      else goals[nodeId] = { ...goal, createdAt: goals[nodeId]?.createdAt || new Date().toISOString() };
      return { ...p, goals };
    }), []),
    // Quality-of-life: copy each category's assigned amount from one month to another.
    // Doesn't overwrite existing assignments in the destination month.
    copyAssignmentsFromMonth: useCallback((srcMonth, dstMonth) => up(p => {
      const src = (p.budgetMonths || {})[srcMonth];
      if (!src) return p;
      const months = { ...(p.budgetMonths || {}) };
      const dst = { ...(months[dstMonth] || {}) };
      let changed = false;
      for (const nid of Object.keys(src)) {
        if (dst[nid] == null && src[nid]?.assigned) {
          dst[nid] = { assigned: src[nid].assigned };
          changed = true;
        }
      }
      if (!changed) return p;
      months[dstMonth] = dst;
      return { ...p, budgetMonths: months };
    }), []),
    getDesc,
  };
}

// ── Bank Account Types ──
const ACCOUNT_TYPES = [
  { id: "checking", label: "Checking", icon: "🏦", color: "#6366f1", group: "asset" },
  { id: "savings", label: "Savings", icon: "🐖", color: "#22c55e", group: "asset" },
  { id: "investment", label: "Investment", icon: "📈", color: "#8b5cf6", group: "asset" },
  { id: "property", label: "Property", icon: "🏠", color: "#f59e0b", group: "asset" },
  { id: "credit", label: "Credit Card", icon: "💳", color: "#ef4444", group: "liability" },
  { id: "loan", label: "Loan", icon: "📋", color: "#b91c1c", group: "liability" },
];
const LIABILITY_TYPES = new Set(ACCOUNT_TYPES.filter(t => t.group === "liability").map(t => t.id));

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
function BottomBar({ children }) {
  // Solid backdrop scrim that adapts to whichever theme is active (light vs the two dark themes)
  const tt = T();
  const fade = tt.id === "linen" ? "#fafaf9" : tt.id === "midnight" ? "#0a0a1a" : "#021a1a";
  return (<div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 500, padding: "12px 20px calc(20px + env(safe-area-inset-bottom, 0px))", background: `linear-gradient(to top, ${fade} 60%, transparent)`, display: "flex", gap: 10, zIndex: 10 }}>{children}</div>);
}
function Btn({ onClick, bg, color, children }) { return (<button onClick={onClick} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em", background: bg, color, transition: "all 0.2s" }}>{children}</button>); }
function EmptyState({ text, sub }) { return (<div style={{ textAlign: "center", padding: "40px 0", color: "#334155" }}><div style={{ fontSize: 32, marginBottom: 8 }}>◇</div><div style={{ fontSize: 13 }}>{text}</div>{sub && <div style={{ fontSize: 11, marginTop: 4, color: "#1e293b" }}>{sub}</div>}</div>); }
function AnimNum({ value }) { const [d, sD] = useState(value); const r = useRef(); useEffect(() => { const s = d, e = value; if (s === e) return; const t0 = performance.now(); function tk(n) { const t = Math.min((n - t0) / 400, 1); sD(s + (e - s) * (1 - Math.pow(1 - t, 3))); if (t < 1) r.current = requestAnimationFrame(tk); } r.current = requestAnimationFrame(tk); return () => cancelAnimationFrame(r.current); }, [value]); return (<span>{fmt(d)}</span>); }
function InlineNew({ placeholder, onCommit, onCancel, accentColor, icon }) { const ref = useRef(null); useEffect(() => { ref.current?.focus(); }, []); const commit = () => { const v = ref.current?.value?.trim(); if (v) onCommit(v); else onCancel(); }; return (<div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: t.surfaceHover, borderRadius: 12, borderLeft: `4px solid ${accentColor}`, animation: "slideIn 0.2s ease" }}>{icon}<input ref={ref} placeholder={placeholder} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }} style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 2px", color: T().text, fontSize: 15, outline: "none" }} /><button onClick={commit} style={{ background: accentColor, border: "none", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✓</button></div>); }
function EditableTitle({ value, onSave, style: s }) { const [editing, setEditing] = useState(false); const ref = useRef(null); useEffect(() => { if (editing) ref.current?.focus(); }, [editing]); const commit = () => { const v = ref.current?.value?.trim(); if (v && v !== value) onSave(v); setEditing(false); }; if (editing) return (<input ref={ref} defaultValue={value} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} style={{ ...s, background: "rgba(255,255,255,0.06)", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", borderRadius: 0, padding: "2px 4px", outline: "none", minWidth: 0, width: "100%" }} />); return (<h2 onClick={() => setEditing(true)} title="Tap to rename" style={{ ...s, cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>{value}</h2>); }
function SearchBar({ value, onChange }) { return (<div style={{ position: "relative", marginBottom: 12 }}><span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>⌕</span><input value={value} onChange={e => onChange(e.target.value)} placeholder="Search transactions..." style={{ width: "100%", boxSizing: "border-box", background: t.surfaceHover, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px 8px 30px", color: T().text, fontSize: 13, outline: "none" }} />{value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}>×</button>}</div>); }
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

// ── Scroll Container ──
function ScrollContainer({ children }) {
  return (
    <div className="scroll-container" style={{
      height: "100vh", height: "-webkit-fill-available", overflowY: "auto", overflowX: "hidden",
      WebkitOverflowScrolling: "touch", overscrollBehavior: "none",
    }}>
      {children}
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






// ══════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════
export default function App({ user, householdId }) {
  const app = useApp(user, householdId);
  const { d, synced, pendingWrites } = app;
  const online = useConnectionStatus();
  const [navStack, setNavStack] = useState([]);
  const [addingRoot, setAddingRoot] = useState(false);
  const [showArchivedRoot, setShowArchivedRoot] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showNetWorth, setShowNetWorth] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [showBillCalendar, setShowBillCalendar] = useState(false);
  const [billCalMonth, setBillCalMonth] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; });
  const [billCalSelectedDay, setBillCalSelectedDay] = useState(null); // ISO date string
  const [globalSearch, setGlobalSearch] = useState("");
  // YNAB-style budget dashboard
  const [budgetMonth, setBudgetMonth] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; });
  // Category filter chip — "all" | "overspent" | "underfunded" | "funded"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    try { const s = localStorage.getItem("maverick-collapsed-groups"); return s ? new Set(JSON.parse(s)) : new Set(); }
    catch { return new Set(); }
  });
  useEffect(() => { try { localStorage.setItem("maverick-collapsed-groups", JSON.stringify([...collapsedGroups])); } catch {} }, [collapsedGroups]);
  const [editingAssigned, setEditingAssigned] = useState(null); // categoryNodeId currently being edited
  const [assignedDraft, setAssignedDraft] = useState("");
  const [renamingNode, setRenamingNode] = useState(null); // nodeId being renamed inline
  const [renameDraft, setRenameDraft] = useState("");
  const [addingCategoryToGroup, setAddingCategoryToGroup] = useState(null); // groupId when inline-adding a child category
  const [nodePageMonthFilter, setNodePageMonthFilter] = useState(null); // "YYYY-MM" when drilling from dashboard, null when navigating from Categories tab
  // "Move money between categories" sheet — null when closed, { dstId } when open
  const [moveMoney, setMoveMoney] = useState(null);
  const [moveAmount, setMoveAmount] = useState("");
  const [moveSourceId, setMoveSourceId] = useState("");
  // Goal editor sheet — null when closed, { categoryId } when open
  const [goalEditor, setGoalEditor] = useState(null);
  const [goalDraft, setGoalDraft] = useState({ type: "monthly", amount: "", by: "" });
  // Quick-add transaction sheet — null when closed
  const [quickAdd, setQuickAdd] = useState(null);
  const [qaDraft, setQaDraft] = useState({ type: "expense", categoryId: "", accountId: "", amount: "", label: "", dateISO: "" });
  // Accounts tab — selected account ID for the detail view; null when on the list view
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  // Account editor sheet — null when closed, "new" or accountId
  const [accountEditor, setAccountEditor] = useState(null);
  const [acctDraft, setAcctDraft] = useState({ name: "", type: "checking", startingBalance: "", color: "" });
  // Transaction editor sheet — null when closed, entryId when editing
  const [editingEntry, setEditingEntry] = useState(null);
  const [entryDraft, setEntryDraft] = useState({ type: "expense", categoryId: "", accountId: "", amount: "", label: "", dateISO: "", paid: true });
  const [advisorMessages, setAdvisorMessages] = useState(() => { try { const s = localStorage.getItem("maverick-advisor-msgs"); return s ? JSON.parse(s) : []; } catch { return []; } });
  const [advisorInput, setAdvisorInput] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const nwItems = d.nwItems || [];
  const [addingNwItem, setAddingNwItem] = useState(null); // "asset" | "liability" | null
  const [editingNwItem, setEditingNwItem] = useState(null);
  const [advisorTab, setAdvisorTab] = useState("chat"); // "chat" | "debt" | "whatif" | "bills"
  const [debtExtra, setDebtExtra] = useState("100"); // extra monthly payment for debt payoff
  const [debtStrategy, setDebtStrategy] = useState("avalanche"); // "avalanche" | "snowball"
  const [whatIfCuts, setWhatIfCuts] = useState({}); // { categoryId: percentReduction }
  const [whatIfMonths, setWhatIfMonths] = useState("12");
  const [themeId, setThemeId] = useState(() => { try { return localStorage.getItem("maverick-theme") || "linen"; } catch { return "linen"; } });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => typeof Notification !== "undefined" && Notification.permission === "granted");
  const [notifPrefs, setNotifPrefs] = useState({ ...DEFAULT_NOTIFICATION_PREFS });
  const [notifPrefsLoaded, setNotifPrefsLoaded] = useState(false);
  useEffect(() => { if (user?.uid) { getNotificationPrefs(user.uid).then(p => { setNotifPrefs(p); setNotifPrefsLoaded(true); }); } }, [user?.uid]);
  const toggleNotifPref = async (key) => { const next = { ...notifPrefs, [key]: !notifPrefs[key] }; setNotifPrefs(next); if (user?.uid) await setNotificationPrefs(user.uid, next); };
  const t = THEMES[themeId] || THEMES.midnight;
  window.__THEME__ = themeId;
  const toggleTheme = () => {
    // Rotate Linen → Midnight → Ocean → Linen
    const order = ["linen", "midnight", "ocean"];
    const next = order[(order.indexOf(themeId) + 1) % order.length];
    setThemeId(next);
    try { localStorage.setItem("maverick-theme", next); } catch {}
    window.__THEME__ = next;
  };
  const cur = navStack.length > 0 ? d.nodes.find(n => n.id === navStack[navStack.length - 1]) : null;
  const par = navStack.length >= 2 ? d.nodes.find(n => n.id === navStack[navStack.length - 2]) : null;
  const goTo = nid => setNavStack([...navStack, nid]);
  const goBack = () => setNavStack(navStack.slice(0, -1));
  const goHome = () => { setNavStack([]); setActiveTab("home"); setShowNetWorth(false); setShowAdvisor(false); setShowBillCalendar(false); setGlobalSearch(""); setNodePageMonthFilter(null); setSelectedAccountId(null); };

  // Persist advisor messages
  useEffect(() => { try { localStorage.setItem("maverick-advisor-msgs", JSON.stringify(advisorMessages.slice(-50))); } catch {} }, [advisorMessages]);
  const addNwItem = (item) => app.addNwItem({ id: uid(), createdAt: new Date().toISOString(), ...item });
  const updateNwItem = (id, updates) => app.updateNwItem(id, updates);
  const removeNwItem = (id) => app.removeNwItem(id);

  // One-time migration: move any pre-existing local-only nw items into the synced doc, then clear localStorage.
  // Wait until the first Firestore snapshot has loaded so we don't overwrite a remote that already has them.
  const nwMigrated = useRef(false);
  useEffect(() => {
    if (!synced || nwMigrated.current) return;
    nwMigrated.current = true;
    try {
      const raw = localStorage.getItem("maverick-nw-items");
      if (!raw) return;
      const legacy = JSON.parse(raw);
      if (Array.isArray(legacy) && legacy.length > 0) {
        app.importNwItems(legacy); // de-dupes by id
      }
      localStorage.removeItem("maverick-nw-items");
    } catch {}
  }, [synced]);

  // One-time migration: when the user has entries but no accounts, create a default "Cash" account
  // and assign every existing entry to it. Establishes the new model without losing transaction history.
  const acctMigrated = useRef(false);
  useEffect(() => {
    if (!synced || acctMigrated.current) return;
    const accounts = d.accounts || [];
    const entries = d.entries || [];
    if (accounts.length > 0) { acctMigrated.current = true; return; }
    if (entries.length === 0) { acctMigrated.current = true; return; }
    acctMigrated.current = true;
    const cashId = uid();
    // Use addAccount + setEntryAccounts in sequence; both go through the same debounced save
    app.addAccount({ id: cashId, name: "Cash", type: "cash", color: "#22c55e", startingBalance: 0 });
    const entryIds = entries.map(e => e.id);
    app.setEntryAccounts(entryIds, cashId);
  }, [synced, d.accounts, d.entries]);

  // ── Net Worth helpers ──
  const getAllBankAccounts = () => {
    const all = [];
    const ba = d.bankAccounts || {};
    for (const nodeId of Object.keys(ba)) {
      for (const acct of (ba[nodeId] || [])) {
        const node = d.nodes.find(n => n.id === nodeId);
        all.push({ ...acct, _nodeId: nodeId, _nodeName: node?.name || "Unknown" });
      }
    }
    return all;
  };
  const calcNetWorth = (accounts) => {
    let assets = 0, liabilities = 0;
    for (const a of accounts) {
      const bal = Math.abs(a.balance || 0);
      if (LIABILITY_TYPES.has(a.type)) liabilities += bal;
      else assets += bal;
    }
    return { assets, liabilities, netWorth: assets - liabilities };
  };

  const shell = ch => (
    <div className="app-shell" style={{ fontFamily: t.font, background: t.bg, color: t.text, minHeight: "100vh", minHeight: "-webkit-fill-available", maxWidth: 500, margin: "0 auto", position: "relative", overflowX: "hidden", overflowY: "auto" }}>
      <style>{`
        @import url('${t.fontImport}');
        html{height:-webkit-fill-available}
        body{min-height:100vh;min-height:-webkit-fill-available;margin:0;padding:0;overflow-x:hidden;width:100%;max-width:100vw}
        *,*::before,*::after{box-sizing:border-box}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
        input::placeholder,select{color:${t.textDim}} select option{background:${t.selectBg};color:${t.text}}
        input,select,textarea{font-size:16px !important;-webkit-text-size-adjust:100%}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
        .app-shell{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px);-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-overflow-scrolling:touch}
        .app-shell input,.app-shell textarea,.app-shell select{-webkit-user-select:text;user-select:text}
        @media(max-width:380px){.app-shell{font-size:14px}}
      `}</style>
      <div style={{ position: "absolute", top: -120, right: -80, width: 300, height: 300, background: t.glow, animation: "pulse 6s ease-in-out infinite", pointerEvents: "none" }} />
      <NotificationManager userId={user.uid} householdId={householdId} />
      <ScrollContainer>{ch}</ScrollContainer>
    </div>
  );

  // ── Proactive Insights Engine ──
  const generateInsights = () => {
    const insights = [];
    const now = new Date();
    const curMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const allEntries = d.entries || [];
    const cats = allCats();

    const curExpenses = allEntries.filter(e => e.type === "expense" && (e.dateISO || "").startsWith(curMonth));
    const lastExpenses = allEntries.filter(e => e.type === "expense" && (e.dateISO || "").startsWith(lastMonth));
    const curTotal = curExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const lastTotal = lastExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const curIncome = allEntries.filter(e => e.type === "income" && (e.dateISO || "").startsWith(curMonth)).reduce((s, e) => s + (e.amount || 0), 0);

    // 1. Category spending spikes
    const curCatTotals = {};
    const lastCatTotals = {};
    curExpenses.forEach(e => { const c = cats.find(ct => ct.id === (e.category || "other")); const l = c ? c.label : "Other"; curCatTotals[l] = (curCatTotals[l] || 0) + (e.amount || 0); });
    lastExpenses.forEach(e => { const c = cats.find(ct => ct.id === (e.category || "other")); const l = c ? c.label : "Other"; lastCatTotals[l] = (lastCatTotals[l] || 0) + (e.amount || 0); });
    Object.entries(curCatTotals).forEach(([cat, amt]) => {
      const prev = lastCatTotals[cat] || 0;
      if (prev > 0 && amt > prev * 1.3 && amt - prev > 20) {
        const pct = Math.round((amt - prev) / prev * 100);
        insights.push({ type: "warning", icon: "📈", title: `${cat} spending up ${pct}%`, sub: `${fmt(amt)} vs ${fmt(prev)} last month`, action: `Why is my ${cat.toLowerCase()} spending up this month?` });
      }
    });

    // 2. Savings rate
    if (curIncome > 0) {
      const rate = Math.round((curIncome - curTotal) / curIncome * 100);
      if (rate < 10) insights.push({ type: "alert", icon: "⚠️", title: `Savings rate: ${rate}%`, sub: "Below the 20% recommended target", action: "How can I improve my savings rate?" });
      else if (rate >= 30) insights.push({ type: "positive", icon: "🎉", title: `Saving ${rate}% of income`, sub: "Great job — above the 20% target!", action: "What should I do with my extra savings?" });
    }

    // 3. Unallocated cash
    const insightRoots = d.nodes.filter(n => n.parentId === null && !n.archived);
    const totalBal = insightRoots.reduce((s, f) => s + getNodeBalance(d.nodes, allEntries, f.id).balance, 0);
    if (totalBal > 500) insights.push({ type: "suggestion", icon: "💡", title: `${fmt(totalBal)} unallocated`, sub: "Consider moving some to savings or investments", action: `I have ${fmt(totalBal)} in my budget balance. Where should I put it?` });

    // 4. Savings goals
    (d.savingsGoals || []).forEach(g => {
      if (g.target && g.current !== undefined) {
        const pct = Math.round((g.current || 0) / g.target * 100);
        if (pct >= 90 && pct < 100) insights.push({ type: "positive", icon: "🏁", title: `Almost there: ${g.name}`, sub: `${pct}% complete — ${fmt(g.target - (g.current || 0))} to go!`, action: `How can I close the gap on my ${g.name} goal?` });
        else if (pct < 25 && g.target > 100) insights.push({ type: "warning", icon: "🎯", title: `${g.name}: ${pct}% funded`, sub: `${fmt(g.current || 0)} of ${fmt(g.target)} target`, action: `Help me create a plan to reach my ${g.name} goal` });
      }
    });

    // 5. Debt-to-asset ratio
    const manualAssets = nwItems.filter(i => i.group === "asset").reduce((s, i) => s + (i.value || 0), 0);
    const manualLiab = nwItems.filter(i => i.group === "liability").reduce((s, i) => s + (i.value || 0), 0);
    const bankAccts = getAllBankAccounts();
    const totalAssets = manualAssets + bankAccts.filter(a => !LIABILITY_TYPES.has(a.type)).reduce((s, a) => s + (a.balance || 0), 0);
    const totalLiab = manualLiab + bankAccts.filter(a => LIABILITY_TYPES.has(a.type)).reduce((s, a) => s + Math.abs(a.balance || 0), 0);
    if (totalLiab > 0 && totalAssets > 0 && totalLiab / totalAssets > 0.5) {
      insights.push({ type: "alert", icon: "🏦", title: `Debt-to-asset: ${Math.round(totalLiab / totalAssets * 100)}%`, sub: "Above 50% — debt reduction should be a priority", action: "Help me make a debt payoff plan" });
    }

    // 6. Monthly trend
    if (lastTotal > 0 && curTotal > lastTotal * 1.15) {
      insights.push({ type: "warning", icon: "📊", title: `Overall spending up ${Math.round((curTotal - lastTotal) / lastTotal * 100)}%`, sub: `${fmt(curTotal)} this month vs ${fmt(lastTotal)} last month`, action: "Where am I overspending compared to last month?" });
    } else if (lastTotal > 0 && curTotal < lastTotal * 0.85) {
      insights.push({ type: "positive", icon: "📉", title: `Spending down ${Math.round((lastTotal - curTotal) / lastTotal * 100)}%`, sub: `${fmt(curTotal)} this month vs ${fmt(lastTotal)} last month`, action: "I've cut spending — where should I put the savings?" });
    }

    // 7. Recurring expenses
    const entryLabels = {};
    allEntries.filter(e => e.type === "expense").forEach(e => {
      const key = (e.label || "").toLowerCase().trim();
      if (!key) return;
      if (!entryLabels[key]) entryLabels[key] = { label: e.label, months: new Set(), total: 0, count: 0 };
      if (e.dateISO) entryLabels[key].months.add(e.dateISO.slice(0, 7));
      entryLabels[key].total += e.amount || 0;
      entryLabels[key].count++;
    });
    const subscriptions = Object.values(entryLabels).filter(r => r.months.size >= 3);
    const subTotal = subscriptions.reduce((s, r) => s + r.total / r.count, 0);
    if (subscriptions.length >= 3) {
      insights.push({ type: "suggestion", icon: "🔄", title: `${subscriptions.length} recurring expenses`, sub: `~${fmt(subTotal)}/month in subscriptions`, action: "Review my recurring expenses and suggest what to cut" });
    }

    return insights.slice(0, 4);
  };

  // ── Net Worth Item Form ──
  const NwItemForm = ({ group, item, onSave, onCancel }) => {
    const [name, setName] = useState(item?.name || "");
    const [value, setValue] = useState(item?.value?.toString() || "");
    const [category, setCategory] = useState(item?.category || (group === "asset" ? "checking" : "credit"));
    const [rate, setRate] = useState(item?.rate?.toString() || "");
    const [minPayment, setMinPayment] = useState(item?.minPayment?.toString() || "");
    const types = ACCOUNT_TYPES.filter(at => at.group === group);
    const isLiab = group === "liability";
    return (
      <div style={{ padding: "12px 14px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, marginBottom: 8, animation: "slideIn 0.2s ease" }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder={isLiab ? "e.g. Student Loan" : "e.g. Savings Account"} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 14, marginBottom: 8, outline: "none" }} autoFocus />
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 13 }}>
            {types.map(at => <option key={at.id} value={at.id}>{at.icon} {at.label}</option>)}
          </select>
          <input value={value} onChange={e => setValue(e.target.value)} placeholder="Balance" type="number" step="0.01" inputMode="decimal" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 14, textAlign: "right" }} />
        </div>
        {isLiab && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={rate} onChange={e => setRate(e.target.value)} placeholder="APR %" type="number" step="0.1" inputMode="decimal" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 13, textAlign: "center" }} />
            <input value={minPayment} onChange={e => setMinPayment(e.target.value)} placeholder="Min payment" type="number" step="1" inputMode="decimal" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 13, textAlign: "center" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { if (!name.trim() && !parseFloat(value)) return; const item = { name: name.trim() || "Untitled", value: parseFloat(value) || 0, category, group }; if (isLiab) { item.rate = parseFloat(rate) || 0; item.minPayment = parseFloat(minPayment) || 0; } onSave(item); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
        </div>
      </div>
    );
  };

  // ── Bill Calendar Page ──
  if (showBillCalendar && !cur) {
    const [yStr, mStr] = billCalMonth.split("-");
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10) - 1; // 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0 = Sun

    // All expense entries falling in this month, grouped by day
    const monthPrefix = billCalMonth + "-";
    const monthExpenses = (d.entries || []).filter(e =>
      e.type === "expense" && (e.dateISO || "").startsWith(monthPrefix)
    );
    const cats = allCats();
    const nodeById = id => d.nodes.find(n => n.id === id);
    const folderOf = nid => { let n = nodeById(nid); while (n?.parentId) n = nodeById(n.parentId); return n; };
    const byDay = {};
    monthExpenses.forEach(e => {
      const day = parseInt((e.dateISO || "").slice(8, 10), 10);
      if (!day) return;
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(e);
    });

    // Month-level totals
    const monthPaid = monthExpenses.filter(e => e.paid !== false).reduce((s, e) => s + (e.amount || 0), 0);
    const monthUnpaid = monthExpenses.filter(e => e.paid === false).reduce((s, e) => s + (e.amount || 0), 0);

    // Today + this-week unpaid count for the header strip
    const today = new Date();
    const todayISO = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    const weekFromNow = new Date(today.getTime() + 7 * 86400000);
    const weekFromNowISO = `${weekFromNow.getFullYear()}-${String(weekFromNow.getMonth()+1).padStart(2,"0")}-${String(weekFromNow.getDate()).padStart(2,"0")}`;
    const dueThisWeek = (d.entries || []).filter(e =>
      e.type === "expense" && e.paid === false && e.dateISO && e.dateISO >= todayISO && e.dateISO <= weekFromNowISO
    );

    const monthLabel = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const shiftMonth = (delta) => {
      const dt = new Date(year, month + delta, 1);
      setBillCalMonth(`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`);
      setBillCalSelectedDay(null);
      haptic();
    };

    // Build the 6×7 grid (always 42 cells so layout doesn't jump)
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let dn = 1; dn <= daysInMonth; dn++) cells.push(dn);
    while (cells.length < 42) cells.push(null);

    const selectedISO = billCalSelectedDay;
    const selectedEntries = selectedISO ? (byDay[parseInt(selectedISO.slice(8, 10), 10)] || []) : [];

    return shell(
      <div style={{ padding: "24px 20px 100px", animation: "fadeIn 0.4s ease" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => { goHome(); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text, flex: 1 }}>Bills</h1>
        </div>

        {/* This-week unpaid summary */}
        {dueThisWeek.length > 0 && (
          <div style={{ background: `${t.exp}10`, border: `1px solid ${t.exp}30`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>⏰</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{dueThisWeek.length} bill{dueThisWeek.length === 1 ? "" : "s"} due this week</div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>Total: {fmt(dueThisWeek.reduce((s, e) => s + (e.amount || 0), 0))}</div>
            </div>
          </div>
        )}

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
          <button onClick={() => shiftMonth(-1)} style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>‹</button>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{monthLabel}</div>
          <button onClick={() => shiftMonth(1)} style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>›</button>
        </div>

        {/* Month totals */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, background: `${t.inc}10`, border: `1px solid ${t.inc}25`, borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Paid</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.inc, fontFamily: t.mono, marginTop: 2 }}>{fmt(monthPaid)}</div>
          </div>
          <div style={{ flex: 1, background: `${t.exp}10`, border: `1px solid ${t.exp}25`, borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Unpaid</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.exp, fontFamily: t.mono, marginTop: 2 }}>{fmt(monthUnpaid)}</div>
          </div>
        </div>

        {/* Weekday header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 9, color: t.textMuted, fontWeight: 600, letterSpacing: "0.08em" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 16 }}>
          {cells.map((dn, idx) => {
            if (dn === null) return <div key={idx} style={{ aspectRatio: "1 / 1" }} />;
            const dayISO = `${billCalMonth}-${String(dn).padStart(2, "0")}`;
            const entries = byDay[dn] || [];
            const hasUnpaid = entries.some(e => e.paid === false);
            const hasPaid = entries.some(e => e.paid !== false);
            const isToday = dayISO === todayISO;
            const isSelected = dayISO === selectedISO;
            const dayTotal = entries.reduce((s, e) => s + (e.amount || 0), 0);

            // Color logic: red = any unpaid, green = all paid, neutral = no bills
            const accentColor = hasUnpaid ? t.exp : hasPaid ? t.inc : null;

            return (
              <button
                key={idx}
                onClick={() => { setBillCalSelectedDay(isSelected ? null : dayISO); haptic(); }}
                style={{
                  aspectRatio: "1 / 1",
                  background: isSelected ? `${t.accent}25` : entries.length > 0 ? `${accentColor}12` : "rgba(255,255,255,0.02)",
                  border: isSelected ? `2px solid ${t.accent}` : isToday ? `1px solid ${t.accent}60` : `1px solid ${entries.length > 0 ? accentColor + "30" : t.cardBorder}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? t.accent : t.text, alignSelf: "flex-start" }}>{dn}</div>
                {entries.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: "100%" }}>
                    <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                      {hasUnpaid && <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.exp }} />}
                      {hasPaid && <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.inc }} />}
                    </div>
                    <div style={{ fontSize: 8, color: t.textMuted, fontFamily: t.mono, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                      {dayTotal >= 1000 ? `$${(dayTotal/1000).toFixed(1)}k` : `$${Math.round(dayTotal)}`}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 16, fontSize: 10, color: t.textMuted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: t.exp }} /> Unpaid</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: t.inc }} /> Paid</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 2, background: "transparent", border: `1px solid ${t.accent}` }} /> Today</span>
        </div>

        {/* Selected day — bottom-sheet overlay matching dashboard sheet pattern */}
        {selectedISO && (() => {
          const dayLabel = new Date(selectedISO + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
          const dayTotal = selectedEntries.reduce((s, e) => s + (e.amount || 0), 0);
          const close = () => { setBillCalSelectedDay(null); haptic(); };
          return (
            <>
              <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
              <div style={{
                position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
                width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto",
                background: t.bg, borderTop: `1px solid ${t.cardBorder}`,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
                zIndex: 201, animation: "slideIn 0.2s ease",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              }}>
                <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Bills due</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginTop: 2 }}>{dayLabel}</div>
                    {selectedEntries.length > 0 && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{selectedEntries.length} bill{selectedEntries.length === 1 ? "" : "s"} · <span style={{ fontFamily: t.mono, fontWeight: 600 }}>{fmt(dayTotal)}</span> total</div>}
                  </div>
                  <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                </div>

                {selectedEntries.length === 0 ? (
                  <div style={{ fontSize: 12, color: t.textMuted, padding: "32px 0", textAlign: "center" }}>No bills on this day.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedEntries.map(entry => {
                      const cat = cats.find(c => c.id === entry.category);
                      const folder = folderOf(entry.nodeId);
                      const node = nodeById(entry.nodeId);
                      const unpaid = entry.paid === false;
                      return (
                        <div key={entry.id} onClick={() => {
                          if (entry.nodeId) {
                            const owner = nodeById(entry.nodeId);
                            if (owner) {
                              const stack = [];
                              let cur = owner;
                              while (cur) { stack.unshift(cur.id); cur = cur.parentId ? nodeById(cur.parentId) : null; }
                              setNavStack(stack);
                              setShowBillCalendar(false);
                              setBillCalSelectedDay(null);
                              haptic();
                            }
                          }
                        }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, cursor: "pointer", borderLeft: `3px solid ${unpaid ? t.exp : t.inc}` }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: cat ? `${cat.color}20` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                            {cat ? cat.icon : "📋"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label || "Untitled"}</div>
                            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {folder?.name || "—"}
                              {node && node.id !== folder?.id ? ` › ${node.name}` : ""}
                              {unpaid ? " · UNPAID" : " · paid"}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <button onClick={(ev) => { ev.stopPropagation(); app.updateEntry(entry.id, { paid: !unpaid ? false : true }); haptic(); }} title={unpaid ? "Mark paid" : "Mark unpaid"} style={{ background: unpaid ? `${t.inc}20` : `${t.exp}15`, border: `1px solid ${unpaid ? t.inc + "40" : t.exp + "30"}`, color: unpaid ? t.inc : t.exp, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 600 }}>{unpaid ? "Pay" : "Unpay"}</button>
                            <div style={{ fontSize: 14, fontWeight: 600, color: t.exp, fontFamily: t.mono }}>-{fmt(Math.abs(entry.amount || 0))}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </div>
    );
  }

  // ── Net Worth Detail Page ──
  if (showNetWorth && !cur) {
    const manualAssets = nwItems.filter(i => i.group === "asset");
    const manualLiabilities = nwItems.filter(i => i.group === "liability");
    const totalAssets = manualAssets.reduce((s, i) => s + (i.value || 0), 0);
    const totalLiabilities = manualLiabilities.reduce((s, i) => s + (i.value || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    const renderNwItem = (item) => {
      const ti = ACCOUNT_TYPES.find(at => at.id === item.category) || {};
      const isLiab = item.group === "liability";
      return (
        <div key={item.id} onClick={() => setEditingNwItem(item.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderTop: `1px solid ${t.cardBorder}`, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 16 }}>{ti.icon || "📋"}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>{ti.label || "Other"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: isLiab ? t.exp : t.inc, fontFamily: t.mono }}>{isLiab ? "-" : ""}{fmt(Math.abs(item.value || 0))}</span>
            <button onClick={e => { e.stopPropagation(); if (confirm(`Remove "${item.name}"?`)) { removeNwItem(item.id); haptic(15); } }} style={{ background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: 14, padding: "2px 4px" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = t.textDim}>×</button>
          </div>
        </div>
      );
    };

    return shell(
      <div style={{ padding: "24px 20px 100px", animation: "fadeIn 0.4s ease" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => { goHome(); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text }}>Net Worth</h1>
        </div>

        {/* Big net worth number */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Net Worth</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: netWorth >= 0 ? t.inc : t.exp }}><AnimatedCurrency value={netWorth} /></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Assets</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.inc }}>{fmt(totalAssets)}</div>
            </div>
            <div style={{ width: 1, background: t.cardBorder }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Liabilities</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.exp }}>{fmt(totalLiabilities)}</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {(totalAssets > 0 || totalLiabilities > 0) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10 }}>
              <div style={{ width: `${totalAssets / (totalAssets + totalLiabilities) * 100}%`, background: t.inc, transition: "width 0.5s" }} />
              <div style={{ flex: 1, background: t.exp, transition: "width 0.5s" }} />
            </div>
          </div>
        )}

        {/* Assets card */}
        <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: "hidden", borderLeft: `3px solid ${t.inc}`, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: t.surface }}>
            <div style={{ fontSize: 12, color: t.inc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Assets · {fmt(totalAssets)}</div>
            <button onClick={() => { setAddingNwItem("asset"); haptic(); }} style={{ background: `${t.inc}18`, border: "none", color: t.inc, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Add</button>
          </div>
          {manualAssets.map(renderNwItem)}
          {manualAssets.length === 0 && <div style={{ fontSize: 12, color: t.textMuted, padding: "16px 14px", textAlign: "center" }}>Tap + Add to add your first asset</div>}
        </div>

        {/* Liabilities card */}
        <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: "hidden", borderLeft: `3px solid ${t.exp}`, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: t.surface }}>
            <div style={{ fontSize: 12, color: t.exp, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Liabilities · {fmt(totalLiabilities)}</div>
            <button onClick={() => { setAddingNwItem("liability"); haptic(); }} style={{ background: `${t.exp}18`, border: "none", color: t.exp, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Add</button>
          </div>
          {manualLiabilities.map(renderNwItem)}
          {manualLiabilities.length === 0 && <div style={{ fontSize: 12, color: t.textMuted, padding: "16px 14px", textAlign: "center" }}>Tap + Add to add your first liability</div>}
        </div>

        {/* Net Worth item editor — bottom sheet wrapper around NwItemForm */}
        {(addingNwItem || editingNwItem) && (() => {
          const close = () => { setAddingNwItem(null); setEditingNwItem(null); };
          let body = null;
          let titleSub = "";
          if (addingNwItem) {
            titleSub = addingNwItem === "asset" ? "New asset" : "New liability";
            body = <NwItemForm group={addingNwItem} onSave={(item) => { addNwItem(item); close(); haptic(); }} onCancel={close} />;
          } else if (editingNwItem) {
            const item = nwItems.find(i => i.id === editingNwItem);
            if (!item) { close(); return null; }
            titleSub = item.group === "asset" ? "Edit asset" : "Edit liability";
            body = <NwItemForm group={item.group} item={item} onSave={(updates) => { updateNwItem(item.id, updates); close(); haptic(); }} onCancel={close} />;
          }
          return (
            <>
              <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
              <div style={{
                position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
                width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto",
                background: t.bg, borderTop: `1px solid ${t.cardBorder}`,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "16px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
                zIndex: 201, animation: "slideIn 0.2s ease",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              }}>
                <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{titleSub}</div>
                  <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                </div>
                {body}
              </div>
            </>
          );
        })()}
      </div>
    );
  }

  // ── AI Advisor Page ──
  if (showAdvisor && !cur) {
    // ── Build rich financial context for AI ──
    const buildFinancialContext = () => {
      const now = new Date();
      const curMonth = now.toISOString().slice(0, 7); // "2026-05"
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
      const allRoots = d.nodes.filter(n => n.parentId === null && !n.archived);
      const allEntries = d.entries || [];
      const cats = allCats();

      // 1. Budget folder summaries
      const folderSummaries = allRoots.map(f => {
        const b = getNodeBalance(d.nodes, allEntries, f.id);
        const childBudgets = d.nodes.filter(n => n.parentId === f.id).map(c => c.name);
        return `• ${f.name}: income ${fmt(b.inc)}, expenses ${fmt(b.exp)}, balance ${fmt(b.balance)}${childBudgets.length ? ` (budgets: ${childBudgets.join(", ")})` : ""}`;
      }).join("\n");
      const totalBal = allRoots.reduce((s, f) => s + getNodeBalance(d.nodes, allEntries, f.id).balance, 0);

      // 2. Category spending breakdown (current month)
      const curMonthEntries = allEntries.filter(e => e.type === "expense" && (e.dateISO || "").startsWith(curMonth));
      const catSpending = {};
      curMonthEntries.forEach(e => {
        const catId = e.category || "other";
        const cat = cats.find(c => c.id === catId);
        const label = cat ? cat.label : "Other";
        catSpending[label] = (catSpending[label] || 0) + (e.amount || 0);
      });
      const sortedCats = Object.entries(catSpending).sort((a, b) => b[1] - a[1]);
      const totalThisMonth = sortedCats.reduce((s, [, v]) => s + v, 0);
      const catBreakdown = sortedCats.length > 0
        ? sortedCats.map(([label, amt]) => `• ${label}: ${fmt(amt)} (${Math.round(amt / totalThisMonth * 100)}%)`).join("\n")
        : "No expenses recorded this month yet.";

      // 3. Month-over-month comparison
      const lastMonthEntries = allEntries.filter(e => e.type === "expense" && (e.dateISO || "").startsWith(lastMonth));
      const lastMonthTotal = lastMonthEntries.reduce((s, e) => s + (e.amount || 0), 0);
      const lastMonthIncome = allEntries.filter(e => e.type === "income" && (e.dateISO || "").startsWith(lastMonth)).reduce((s, e) => s + (e.amount || 0), 0);
      const curMonthIncome = allEntries.filter(e => e.type === "income" && (e.dateISO || "").startsWith(curMonth)).reduce((s, e) => s + (e.amount || 0), 0);
      // Per-category MoM
      const lastCatSpending = {};
      lastMonthEntries.forEach(e => {
        const cat = cats.find(c => c.id === (e.category || "other"));
        const label = cat ? cat.label : "Other";
        lastCatSpending[label] = (lastCatSpending[label] || 0) + (e.amount || 0);
      });
      const momChanges = sortedCats.map(([label, amt]) => {
        const prev = lastCatSpending[label] || 0;
        if (prev === 0) return `• ${label}: ${fmt(amt)} (new this month)`;
        const pctChange = Math.round((amt - prev) / prev * 100);
        return `• ${label}: ${fmt(amt)} (${pctChange >= 0 ? "+" : ""}${pctChange}% vs last month)`;
      }).join("\n");

      // 4. Recurring expense detection
      const entryLabels = {};
      allEntries.filter(e => e.type === "expense").forEach(e => {
        const key = (e.label || "").toLowerCase().trim();
        if (!key) return;
        if (!entryLabels[key]) entryLabels[key] = { label: e.label, months: new Set(), total: 0, count: 0 };
        if (e.dateISO) entryLabels[key].months.add(e.dateISO.slice(0, 7));
        entryLabels[key].total += e.amount || 0;
        entryLabels[key].count++;
      });
      const recurrings = Object.values(entryLabels)
        .filter(r => r.months.size >= 2)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
        .map(r => `• ${r.label}: ~${fmt(r.total / r.count)}/occurrence, ${r.months.size} months`);
      const recurringText = recurrings.length > 0 ? recurrings.join("\n") : "No recurring expenses detected yet.";

      // 5. Savings goals
      const goals = d.savingsGoals || [];
      const goalsText = goals.length > 0
        ? goals.map(g => {
          const pct = g.target ? Math.round((g.current || 0) / g.target * 100) : 0;
          return `• ${g.name}: ${fmt(g.current || 0)} / ${fmt(g.target || 0)} (${pct}%)`;
        }).join("\n")
        : "No savings goals set.";

      // 6. Net worth detail
      const manualAssets = nwItems.filter(i => i.group === "asset");
      const manualLiabilities = nwItems.filter(i => i.group === "liability");
      const bankAccts = getAllBankAccounts();
      const bankAssetTotal = bankAccts.filter(a => !LIABILITY_TYPES.has(a.type)).reduce((s, a) => s + (a.balance || 0), 0);
      const bankLiabTotal = bankAccts.filter(a => LIABILITY_TYPES.has(a.type)).reduce((s, a) => s + Math.abs(a.balance || 0), 0);
      const manualAssetTotal = manualAssets.reduce((s, i) => s + (i.value || 0), 0);
      const manualLiabTotal = manualLiabilities.reduce((s, i) => s + (i.value || 0), 0);
      const totalAssets = bankAssetTotal + manualAssetTotal;
      const totalLiab = bankLiabTotal + manualLiabTotal;
      const assetDetails = [
        ...manualAssets.map(a => `• ${a.name}: ${fmt(a.value || 0)}`),
        ...bankAccts.filter(a => !LIABILITY_TYPES.has(a.type)).map(a => `• ${a.name} (bank): ${fmt(a.balance || 0)}`),
      ].join("\n") || "No assets tracked.";
      const liabDetails = [
        ...manualLiabilities.map(a => `• ${a.name}: ${fmt(a.value || 0)}`),
        ...bankAccts.filter(a => LIABILITY_TYPES.has(a.type)).map(a => `• ${a.name} (bank): ${fmt(Math.abs(a.balance || 0))}`),
      ].join("\n") || "No liabilities tracked.";

      // 7. Key ratios and insights
      const savingsRate = curMonthIncome > 0 ? Math.round((curMonthIncome - totalThisMonth) / curMonthIncome * 100) : null;
      const debtToAssetRatio = totalAssets > 0 ? Math.round(totalLiab / totalAssets * 100) : null;

      return `=== MAVERICK FINANCIAL SNAPSHOT ===
Date: ${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

── BUDGET OVERVIEW ──
${folderSummaries || "No budget folders yet."}
Total balance across all budgets: ${fmt(totalBal)}

── THIS MONTH'S SPENDING BY CATEGORY ──
Total expenses this month: ${fmt(totalThisMonth)}
Total income this month: ${fmt(curMonthIncome)}
${catBreakdown}

── MONTH-OVER-MONTH TRENDS ──
Last month expenses: ${fmt(lastMonthTotal)} → This month: ${fmt(totalThisMonth)} (${lastMonthTotal > 0 ? (totalThisMonth > lastMonthTotal ? "+" : "") + Math.round((totalThisMonth - lastMonthTotal) / lastMonthTotal * 100) + "%" : "N/A"})
Last month income: ${fmt(lastMonthIncome)} → This month: ${fmt(curMonthIncome)}
${momChanges || "Not enough data for comparison."}

── RECURRING EXPENSES (auto-detected) ──
${recurringText}

── SAVINGS GOALS ──
${goalsText}

── NET WORTH ──
Total Assets: ${fmt(totalAssets)}
${assetDetails}
Total Liabilities: ${fmt(totalLiab)}
${liabDetails}
Net Worth: ${fmt(totalAssets - totalLiab)}

── KEY METRICS ──
${savingsRate !== null ? `Savings Rate: ${savingsRate}% of income${savingsRate < 20 ? " (below 20% target)" : " (healthy)"}` : "Savings rate: not enough income data"}
${debtToAssetRatio !== null ? `Debt-to-Asset Ratio: ${debtToAssetRatio}%${debtToAssetRatio > 50 ? " (high — focus on debt reduction)" : " (manageable)"}` : "Debt-to-asset ratio: no asset/liability data"}
=== END SNAPSHOT ===`;
    };

    // ── Debt Payoff Calculator ──
    const calcDebtPayoff = () => {
      const debts = [
        ...nwItems.filter(i => i.group === "liability").map(i => ({ name: i.name, balance: i.value || 0, rate: i.rate || 0, minPayment: i.minPayment || 0 })),
        ...getAllBankAccounts().filter(a => LIABILITY_TYPES.has(a.type)).map(a => ({ name: a.name, balance: Math.abs(a.balance || 0), rate: a.rate || 0, minPayment: a.minPayment || 0 })),
      ].filter(d => d.balance > 0);
      if (debts.length === 0) return null;

      const extra = parseFloat(debtExtra) || 0;
      const sorted = debtStrategy === "avalanche"
        ? [...debts].sort((a, b) => b.rate - a.rate)
        : [...debts].sort((a, b) => a.balance - b.balance);

      // Simulate payoff
      let remaining = sorted.map(d => ({ ...d, bal: d.balance }));
      let month = 0;
      let totalInterest = 0;
      const timeline = [];
      const maxMonths = 360; // 30 year cap

      while (remaining.some(d => d.bal > 0) && month < maxMonths) {
        month++;
        let extraLeft = extra;
        // Apply interest
        remaining.forEach(d => {
          if (d.bal > 0) {
            const interest = d.bal * (d.rate / 100 / 12);
            d.bal += interest;
            totalInterest += interest;
          }
        });
        // Pay minimums
        remaining.forEach(d => {
          if (d.bal > 0) {
            const payment = Math.min(d.minPayment || 25, d.bal);
            d.bal -= payment;
          }
        });
        // Apply extra to highest priority
        for (const d of remaining) {
          if (d.bal > 0 && extraLeft > 0) {
            const payment = Math.min(extraLeft, d.bal);
            d.bal -= payment;
            extraLeft -= payment;
          }
        }
        const totalBal = remaining.reduce((s, d) => s + Math.max(0, d.bal), 0);
        if (month % 3 === 0 || totalBal === 0) timeline.push({ month, balance: totalBal });
        remaining = remaining.map(d => ({ ...d, bal: Math.max(0, d.bal) }));
      }

      const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
      const payoffDate = new Date();
      payoffDate.setMonth(payoffDate.getMonth() + month);
      return { debts: sorted, totalDebt, totalInterest, months: month, payoffDate, timeline, strategy: debtStrategy };
    };

    // ── What-If Scenario Engine ──
    const calcWhatIf = () => {
      const allEntries = d.entries || [];
      const cats = allCats();
      const now = new Date();
      const curMonth = now.toISOString().slice(0, 7);
      const curExpenses = allEntries.filter(e => e.type === "expense" && (e.dateISO || "").startsWith(curMonth));
      const curIncome = allEntries.filter(e => e.type === "income" && (e.dateISO || "").startsWith(curMonth)).reduce((s, e) => s + (e.amount || 0), 0);

      const catTotals = {};
      curExpenses.forEach(e => {
        const catId = e.category || "other";
        const cat = cats.find(c => c.id === catId);
        catTotals[catId] = { label: cat?.label || "Other", icon: cat?.icon || "📋", amount: (catTotals[catId]?.amount || 0) + (e.amount || 0) };
      });

      const months = parseInt(whatIfMonths) || 12;
      let currentMonthly = Object.values(catTotals).reduce((s, c) => s + c.amount, 0);
      let projectedMonthly = 0;
      const catDetails = Object.entries(catTotals).map(([id, c]) => {
        const cut = whatIfCuts[id] || 0;
        const projected = c.amount * (1 - cut / 100);
        projectedMonthly += projected;
        return { id, ...c, cut, projected, saved: c.amount - projected };
      }).sort((a, b) => b.amount - a.amount);

      const monthlySaved = currentMonthly - projectedMonthly;
      const totalSaved = monthlySaved * months;
      const currentSavings = curIncome - currentMonthly;
      const projectedSavings = curIncome - projectedMonthly;

      return { catDetails, currentMonthly, projectedMonthly, monthlySaved, totalSaved, months, currentSavings, projectedSavings, income: curIncome };
    };

    const sendToAdvisor = async () => {
      const msg = advisorInput.trim();
      if (!msg || advisorLoading) return;
      setAdvisorInput("");
      setAdvisorMessages(prev => [...prev, { role: "user", content: msg }]);
      setAdvisorLoading(true);
      try {
        const context = buildFinancialContext();
        const systemPrompt = `You are Maverick AI, a sharp and friendly personal finance advisor built into the Maverick Budget app. You have real-time access to the user's complete financial data below.

GUIDELINES:
- Give specific, actionable advice referencing their actual numbers
- When discussing spending, cite the exact categories and amounts
- Compare to common benchmarks (50/30/20 rule, 3-6 month emergency fund, etc.)
- If they ask about debt, reference their actual liabilities and suggest strategies
- Be warm and encouraging but honest about areas for improvement
- Use their savings goals to personalize recommendations
- When you spot concerning trends (rising spending, low savings rate), flag them proactively
- Keep responses concise (under 200 words) but data-rich
- Use dollar amounts from their data, not generic advice
- If asked about something not in the data, say so honestly

${context}`;
        const history = [...advisorMessages.slice(-10), { role: "user", content: msg }];

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": localStorage.getItem("maverick-ai-key") || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: systemPrompt, messages: history.map(m => ({ role: m.role, content: m.content })) }),
        });
        if (!resp.ok) throw new Error("API error");
        const data = await resp.json();
        const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
        setAdvisorMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        setAdvisorMessages(prev => [...prev, { role: "assistant", content: "To use AI Advisor, add your Anthropic API key in settings below.\n\nTap the 🔑 icon to set it up." }]);
      }
      setAdvisorLoading(false);
    };

    const debtPayoff = calcDebtPayoff();
    const whatIf = calcWhatIf();
    const advisorTabs = [
      { id: "chat", icon: "💬", label: "Chat" },
      { id: "debt", icon: "📋", label: "Debt Plan" },
      { id: "whatif", icon: "🔮", label: "What-If" },
      { id: "bills", icon: "📞", label: "Bill Tips" },
    ];

    // Bill negotiation scripts
    const billScripts = [
      { category: "Internet/Cable", icon: "📡", tips: [
        "Call retention department — say 'I'd like to cancel' to get routed there",
        "Reference competitor pricing: 'I see [competitor] offers similar speed for $X/mo'",
        "Ask about unadvertised loyalty discounts or promotional rates",
        "Request a 'rate review' — many reps can apply 10-20% discounts instantly",
      ]},
      { category: "Insurance", icon: "🛡️", tips: [
        "Bundle home + auto for 10-25% discount",
        "Ask about increasing deductibles to lower premiums",
        "Request a policy review — life changes often unlock new discounts",
        "Get 3 competing quotes and present the lowest to your current provider",
      ]},
      { category: "Phone Plan", icon: "📱", tips: [
        "Check if you're using all your data — downgrade if not",
        "Ask about autopay and paperless billing discounts ($5-10/mo each)",
        "Consider MVNOs (Mint, Visible, Cricket) — same networks, 50-70% cheaper",
        "Negotiate as a family: multi-line plans often have per-line discounts",
      ]},
      { category: "Subscriptions", icon: "🔄", tips: [
        "Audit all subscriptions — cancel anything unused for 30+ days",
        "Use annual billing to save 15-30% vs monthly",
        "Try canceling — many services offer 50% off to retain you",
        "Share family plans with household members to split costs",
      ]},
      { category: "Medical Bills", icon: "🏥", tips: [
        "Always request an itemized bill — errors are common (up to 80%)",
        "Ask about cash pay discount (often 20-50% off)",
        "Negotiate a payment plan with 0% interest before it goes to collections",
        "Check if you qualify for financial assistance or charity care programs",
      ]},
      { category: "Rent", icon: "🏠", tips: [
        "Sign a longer lease (18-24 months) for a lower monthly rate",
        "Offer to pay several months upfront for a discount",
        "Point out comparable units in the area at lower prices",
        "Offer to handle minor maintenance yourself in exchange for reduced rent",
      ]},
    ];

    return shell(
      <div style={{ padding: "24px 20px 0", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", height: "100vh", height: "-webkit-fill-available" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexShrink: 0 }}>
          <button onClick={() => { goHome(); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: t.text }}>AI Advisor</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {advisorMessages.length > 0 && <button onClick={() => { if (confirm("Clear conversation history?")) { setAdvisorMessages([]); haptic(); } }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 12 }} title="Clear history">🗑️</button>}
            <button onClick={() => { const key = prompt("Enter your Anthropic API key:", localStorage.getItem("maverick-ai-key") || ""); if (key !== null) { localStorage.setItem("maverick-ai-key", key); haptic(); } }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 14 }} title="Set API key">🔑</button>
          </div>
        </div>

        {/* Tool tabs — pill style matching dashboard category pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexShrink: 0, overflowX: "auto", padding: "2px" }}>
          {advisorTabs.map(tab => {
            const sel = advisorTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setAdvisorTab(tab.id); haptic(); }} style={{
                padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                background: sel ? `${t.accent}18` : "rgba(255,255,255,0.02)",
                border: sel ? `1px solid ${t.accent}50` : `1px solid ${t.cardBorder}`,
                color: sel ? t.accentLight : t.textSub,
              }}><span style={{ fontSize: 13 }}>{tab.icon}</span>{tab.label}</button>
            );
          })}
        </div>

        {/* Tab: Chat */}
        {advisorTab === "chat" && (<>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12, paddingBottom: 8 }}>
            {advisorMessages.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 16px", color: t.textMuted }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🤖</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 6 }}>Maverick AI</div>
                <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 14 }}>Your financial strategist with full access to your spending, trends, goals, and net worth.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Where am I overspending this month?", "Give me a full financial health check", "What recurring expenses could I cut?", "Help me make a debt payoff plan", "Am I on track with my savings goals?"].map(q => (
                    <button key={q} onClick={() => { setAdvisorInput(q); }} style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: t.surface, color: t.textSub, fontSize: 11, cursor: "pointer", textAlign: "left" }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {advisorMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                  background: msg.role === "user" ? t.accent : t.card,
                  color: msg.role === "user" ? "#fff" : t.text,
                  border: msg.role === "user" ? "none" : `1px solid ${t.cardBorder}`,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: msg.role === "user" ? 14 : 4,
                  whiteSpace: "pre-wrap",
                }}>{msg.content}</div>
              </div>
            ))}
            {advisorLoading && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: t.textMuted, animation: `pulse 1.2s ease infinite ${i * 0.2}s` }} />)}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "12px 0 calc(12px + env(safe-area-inset-bottom, 0px))", borderTop: `1px solid ${t.cardBorder}`, flexShrink: 0 }}>
            <input value={advisorInput} onChange={e => setAdvisorInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendToAdvisor(); } }}
              placeholder="Ask about your finances..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 14, outline: "none" }} />
            <button onClick={sendToAdvisor} disabled={advisorLoading || !advisorInput.trim()} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: advisorInput.trim() ? t.accent : t.surface, color: advisorInput.trim() ? "#fff" : t.textDim, fontSize: 14, fontWeight: 600, cursor: advisorInput.trim() ? "pointer" : "default", transition: "all 0.2s" }}>↑</button>
          </div>
        </>)}

        {/* Tab: Debt Payoff Planner */}
        {advisorTab === "debt" && (
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Debt Payoff Planner</div>

            {/* Strategy toggle */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[{ id: "avalanche", label: "Avalanche", sub: "Highest rate first" }, { id: "snowball", label: "Snowball", sub: "Smallest balance first" }].map(s => (
                <button key={s.id} onClick={() => { setDebtStrategy(s.id); haptic(); }} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, border: `1px solid ${debtStrategy === s.id ? t.accent + "50" : t.cardBorder}`, cursor: "pointer", textAlign: "center",
                  background: debtStrategy === s.id ? `${t.accent}15` : t.surface, transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: debtStrategy === s.id ? t.accentLight : t.text }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2 }}>{s.sub}</div>
                </button>
              ))}
            </div>

            {/* Extra payment input */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>Extra/month:</div>
              <input value={debtExtra} onChange={e => setDebtExtra(e.target.value)} type="number" inputMode="decimal" style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: t.inputBg, color: t.text, fontSize: 16, fontWeight: 600, textAlign: "right" }} />
            </div>

            {debtPayoff ? (<>
              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div style={{ padding: "12px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Debt</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: t.exp }}>{fmt(debtPayoff.totalDebt)}</div>
                </div>
                <div style={{ padding: "12px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Payoff Date</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{debtPayoff.payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{debtPayoff.months} months</div>
                </div>
                <div style={{ padding: "12px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Interest</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{fmt(debtPayoff.totalInterest)}</div>
                </div>
                <div style={{ padding: "12px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Strategy</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.accentLight }}>{debtStrategy === "avalanche" ? "⚡ Avalanche" : "☃️ Snowball"}</div>
                </div>
              </div>

              {/* Payoff order */}
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Payoff Order</div>
              {debtPayoff.debts.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: i === 0 ? `${t.accent}08` : "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 4, borderLeft: i === 0 ? `3px solid ${t.accent}` : "3px solid transparent" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: i === 0 ? t.accent : t.surface, color: i === 0 ? "#fff" : t.textSub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{d.rate > 0 ? `${d.rate}% APR` : "No rate set"}{d.minPayment > 0 ? ` · ${fmt(d.minPayment)} min` : ""}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.exp, fontFamily: t.mono }}>{fmt(d.balance)}</div>
                </div>
              ))}

              {/* Progress chart */}
              {debtPayoff.timeline.length > 1 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Projected Balance</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 80, padding: "0 4px" }}>
                    {debtPayoff.timeline.map((p, i) => {
                      const maxBal = debtPayoff.timeline[0]?.balance || 1;
                      const h = Math.max(2, (p.balance / maxBal) * 70);
                      return (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: "100%", height: h, background: `linear-gradient(to top, ${t.exp}60, ${t.exp}20)`, borderRadius: 3, minWidth: 4, transition: "height 0.3s" }} />
                        {i % 4 === 0 && <div style={{ fontSize: 7, color: t.textDim }}>{p.month}mo</div>}
                      </div>);
                    })}
                  </div>
                </div>
              )}

              {/* Tip */}
              <div style={{ marginTop: 16, padding: "10px 14px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: t.accentLight, fontWeight: 600, marginBottom: 4 }}>💡 Tip</div>
                <div style={{ fontSize: 11, color: t.textSub, lineHeight: 1.5 }}>
                  {debtStrategy === "avalanche" ? "Avalanche saves the most in interest. Focus extra payments on your highest-rate debt first." : "Snowball builds momentum. Paying off small debts first creates quick wins that keep you motivated."}
                  {" "}To set interest rates and minimum payments, edit your liabilities on the Net Worth page.
                </div>
              </div>

              {/* Ask AI button */}
              <button onClick={() => { setAdvisorTab("chat"); setAdvisorInput(`Analyze my debt situation: I have ${fmt(debtPayoff.totalDebt)} in total debt. Using the ${debtStrategy} method with $${debtExtra}/mo extra, it'll take ${debtPayoff.months} months. Is this plan good? Any suggestions?`); haptic(); }}
                style={{ marginTop: 12, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: t.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ask AI About My Debt Plan</button>
            </>) : (
              <div style={{ textAlign: "center", padding: "40px 16px", color: t.textMuted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 6 }}>No debts to pay off</div>
                <div style={{ fontSize: 12 }}>Add liabilities on the Net Worth page to use the debt planner.</div>
                <button onClick={() => { setShowNetWorth(true); setShowAdvisor(false); haptic(); }} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Go to Net Worth</button>
              </div>
            )}
          </div>
        )}

        {/* Tab: What-If Simulator */}
        {advisorTab === "whatif" && (
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>What-If Simulator</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>Drag sliders to model spending cuts and see projected savings.</div>

            {/* Time horizon */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>Projection:</div>
              {["3", "6", "12", "24"].map(m => (
                <button key={m} onClick={() => { setWhatIfMonths(m); haptic(); }} style={{
                  padding: "5px 10px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  background: whatIfMonths === m ? t.accent : "transparent", color: whatIfMonths === m ? "#fff" : t.textSub,
                }}>{m}mo</button>
              ))}
            </div>

            {/* Category sliders */}
            {whatIf.catDetails.length > 0 ? (<>
              {whatIf.catDetails.map(cat => (
                <div key={cat.id} style={{ marginBottom: 10, padding: "10px 12px", background: t.surface, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{cat.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{cat.label}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: cat.cut > 0 ? t.inc : t.text, fontFamily: t.mono }}>{fmt(cat.projected)}</span>
                      {cat.cut > 0 && <span style={{ fontSize: 10, color: t.textMuted, marginLeft: 4, textDecoration: "line-through" }}>{fmt(cat.amount)}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="range" min="0" max="100" step="5" value={whatIfCuts[cat.id] || 0}
                      onChange={e => setWhatIfCuts({ ...whatIfCuts, [cat.id]: parseInt(e.target.value) })}
                      style={{ flex: 1, accentColor: t.accent, height: 4 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: (whatIfCuts[cat.id] || 0) > 0 ? t.inc : t.textDim, minWidth: 36, textAlign: "right" }}>
                      {(whatIfCuts[cat.id] || 0) > 0 ? `-${whatIfCuts[cat.id]}%` : "0%"}
                    </span>
                  </div>
                </div>
              ))}

              {/* Projection results */}
              <div style={{ marginTop: 12, padding: "14px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{whatIf.months}-Month Projection</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase" }}>Monthly Saved</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: whatIf.monthlySaved > 0 ? t.inc : t.textDim }}>{whatIf.monthlySaved > 0 ? "+" : ""}{fmt(whatIf.monthlySaved)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase" }}>Total Saved</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: whatIf.totalSaved > 0 ? t.inc : t.textDim }}>{whatIf.totalSaved > 0 ? "+" : ""}{fmt(whatIf.totalSaved)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase" }}>Current Savings</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: whatIf.currentSavings >= 0 ? t.text : t.exp }}>{fmt(whatIf.currentSavings)}/mo</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase" }}>Projected Savings</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: whatIf.projectedSavings >= 0 ? t.inc : t.exp }}>{fmt(whatIf.projectedSavings)}/mo</div>
                  </div>
                </div>
              </div>

              {/* Ask AI */}
              {whatIf.monthlySaved > 0 && (
                <button onClick={() => {
                  const cuts = whatIf.catDetails.filter(c => c.cut > 0).map(c => `${c.label} by ${c.cut}%`).join(", ");
                  setAdvisorTab("chat");
                  setAdvisorInput(`I'm considering cutting: ${cuts}. That would save me ${fmt(whatIf.monthlySaved)}/month (${fmt(whatIf.totalSaved)} over ${whatIf.months} months). Is this realistic? What's the best way to implement these cuts?`);
                  haptic();
                }} style={{ marginTop: 12, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: t.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ask AI to Evaluate This Plan</button>
              )}
            </>) : (
              <div style={{ textAlign: "center", padding: "40px 16px", color: t.textMuted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔮</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 6 }}>No spending data yet</div>
                <div style={{ fontSize: 12 }}>Add transactions with categories to model what-if scenarios.</div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Bill Negotiation */}
        {advisorTab === "bills" && (
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>Bill Negotiation Scripts</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 14 }}>Proven strategies to lower your monthly bills. Tap any category for scripts you can use on your next call.</div>

            {billScripts.map(bill => (
              <details key={bill.category} style={{ marginBottom: 8 }}>
                <summary style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, cursor: "pointer", listStyle: "none", WebkitAppearance: "none" }}>
                  <span style={{ fontSize: 20 }}>{bill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{bill.category}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{bill.tips.length} negotiation tips</div>
                  </div>
                  <span style={{ fontSize: 14, color: t.textSub, transition: "transform 0.2s" }}>▸</span>
                </summary>
                <div style={{ padding: "8px 14px 12px", marginTop: -2, background: `${t.card}80`, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, border: `1px solid ${t.cardBorder}`, borderTop: "none" }}>
                  {bill.tips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: i < bill.tips.length - 1 ? `1px solid ${t.cardBorder}` : "none" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, background: `${t.accent}15`, color: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div style={{ fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>{tip}</div>
                    </div>
                  ))}
                  <button onClick={() => { setAdvisorTab("chat"); setAdvisorInput(`I want to negotiate my ${bill.category.toLowerCase()} bill. Give me a step-by-step script I can use on the phone, including what to say when they push back.`); haptic(); }}
                    style={{ marginTop: 8, width: "100%", padding: "10px 0", borderRadius: 8, border: "none", background: `${t.accent}15`, color: t.accentLight, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Get Personalized Script from AI</button>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!cur) {
    const allRoots = d.nodes.filter(n => n.parentId === null);
    const roots = showArchivedRoot ? allRoots : allRoots.filter(n => !n.archived);
    const archivedRootCount = allRoots.filter(n => n.archived).length;
    const stats = roots.map(f => ({ ...f, ...getNodeBalance(d.nodes, d.entries, f.id), childCount: d.nodes.filter(n => n.parentId === f.id).length }));

    // Dashboard helpers
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const displayName = (() => {
      if (user.displayName) return user.displayName.split(" ")[0];
      const tag = user.email?.split("@")[0] || "there";
      // Extract first name from email: "michaelmuirhead21" → "Michael", "john.doe" → "John"
      const raw = tag.replace(/[._-]/g, " ").replace(/\d+/g, "").trim().split(" ")[0];
      return raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : "there";
    })();
    const totalBalance = allRoots.filter(n => !n.archived).reduce((sum, f) => sum + getNodeBalance(d.nodes, d.entries, f.id).balance, 0);

    // Around This Time — transactions within ±7 days of today, sorted by proximity to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const windowDays = 7;
    const windowMs = windowDays * 86400000;
    const recentEntries = (d.entries || [])
      .map(entry => {
        if (!entry.dateISO) return null;
        const dt = new Date(entry.dateISO + "T00:00:00");
        if (isNaN(dt)) return null;
        const diff = dt.getTime() - todayMs;
        if (Math.abs(diff) > windowMs) return null;
        return { entry, diff };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || b.diff - a.diff)
      .slice(0, 8)
      .map(({ entry }) => {
        const node = d.nodes.find(n => n.id === entry.nodeId);
        const folder = node?.parentId ? d.nodes.find(n => n.id === node.parentId) : node;
        const cat = allCats().find(c => c.id === entry.category);
        return { ...entry, folder, cat };
      });

    // Settings panel (shared across tabs)
    const settingsPanel = showSettings && (
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
        {/* Notification preferences */}
        {notificationsEnabled && notifPrefsLoaded && (
          <div style={{ marginLeft: 32, marginBottom: 12 }}>
            {[
              { key: "newTransaction", label: "New transactions", sub: "When someone posts a new entry" },
              { key: "editTransaction", label: "Edited transactions", sub: "When someone edits an entry" },
              { key: "deleteTransaction", label: "Deleted transactions", sub: "When someone removes an entry" },
              { key: "budgetUpdate", label: "Budget changes", sub: "Folders or categories" },
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
    );

    // Folder list (shared between home and budgets tab)
    // Categories tab — dashboard-style group + nested category list. Each group is a card
    // showing its categories underneath; tap a category to drill into its transactions.
    const folderList = (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: T().textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Category Groups ({roots.length})</div>
          <div style={{ fontSize: 10, color: T().textMuted }}>Tap a category to view transactions</div>
        </div>
        <div style={{ paddingBottom: 100, display: "flex", flexDirection: "column", gap: 10 }}>
          <DraggableList items={stats} onReorder={ids => app.reorderNodes(null, ids)} renderItem={(group, _i, onDragHandle) => {
            const groupCats = d.nodes.filter(n => n.parentId === group.id && (showArchivedRoot || !n.archived));
            return (
              <div key={group.id} style={{ background: T().card, border: `1px solid ${T().cardBorder}`, borderRadius: 12, overflow: "hidden", borderLeft: `3px solid ${group.color || T().accent}`, opacity: group.archived ? 0.55 : 1 }}>
                {/* Group header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: t.surface }}>
                  <div onTouchStart={onDragHandle} style={{ cursor: "grab", color: T().textDim, fontSize: 14, padding: "2px 6px", touchAction: "none", userSelect: "none" }}>⠿</div>
                  <ColorPicker value={group.color || T().accent} onChange={c => app.updateNode(group.id, { color: c })} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    {renamingNode === group.id ? (
                      <input
                        autoFocus
                        value={renameDraft}
                        onChange={e => setRenameDraft(e.target.value)}
                        onBlur={() => { const v = renameDraft.trim(); if (v && v !== group.name) app.updateNode(group.id, { name: v }); setRenamingNode(null); setRenameDraft(""); }}
                        onKeyDown={e => { if (e.key === "Enter") e.target.blur(); else if (e.key === "Escape") { setRenamingNode(null); setRenameDraft(""); } }}
                        style={{ flex: 1, minWidth: 0, background: T().inputBg, border: `1px solid ${T().accent}60`, borderRadius: 4, padding: "4px 8px", color: T().text, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", outline: "none" }}
                      />
                    ) : (
                      <>
                        <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: T().text, textTransform: "uppercase", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.name}</div>
                        {group.archived && <span style={{ fontSize: 9, color: T().textMuted }}>archived</span>}
                        <span style={{ fontSize: 10, color: T().textMuted }}>{groupCats.length}</span>
                        <button onClick={() => { setRenamingNode(group.id); setRenameDraft(group.name); haptic(); }} title="Rename" style={{ background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 11, padding: "0 4px", opacity: 0.5 }}>✎</button>
                      </>
                    )}
                  </div>
                  <button onClick={() => { app.updateNode(group.id, { archived: !group.archived }); haptic(); }} title={group.archived ? "Unarchive" : "Archive"} style={{ background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 12, padding: "2px 4px" }}>{group.archived ? "↩" : "📦"}</button>
                  <button onClick={() => { if (confirm(`Delete "${group.name}" and all its categories?`)) { app.removeNode(group.id); haptic(15); } }} style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 16, padding: "2px 4px" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = T().textDim)}>×</button>
                </div>

                {/* Categories under this group */}
                {groupCats.length > 0 && groupCats.map(cat => (
                  <div key={cat.id} onClick={() => { goTo(cat.id); haptic(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 10px 30px", borderTop: `1px solid ${T().cardBorder}`, cursor: "pointer", transition: "background 0.15s", opacity: cat.archived ? 0.5 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color || group.color || T().accent, flexShrink: 0 }} />
                    {renamingNode === cat.id ? (
                      <input
                        autoFocus
                        value={renameDraft}
                        onChange={e => setRenameDraft(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onBlur={() => { const v = renameDraft.trim(); if (v && v !== cat.name) app.updateNode(cat.id, { name: v }); setRenamingNode(null); setRenameDraft(""); }}
                        onKeyDown={e => { if (e.key === "Enter") e.target.blur(); else if (e.key === "Escape") { setRenamingNode(null); setRenameDraft(""); } }}
                        style={{ flex: 1, minWidth: 0, background: T().inputBg, border: `1px solid ${T().accent}60`, borderRadius: 4, padding: "2px 6px", color: T().text, fontSize: 13, outline: "none" }}
                      />
                    ) : (
                      <>
                        <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: T().text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}{cat.archived && <span style={{ fontSize: 9, color: T().textMuted, marginLeft: 6 }}>archived</span>}</div>
                        <button onClick={e => { e.stopPropagation(); setRenamingNode(cat.id); setRenameDraft(cat.name); haptic(); }} title="Rename" style={{ background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 11, padding: "0 2px", opacity: 0.4 }}>✎</button>
                        <button onClick={e => { e.stopPropagation(); app.updateNode(cat.id, { archived: !cat.archived }); haptic(); }} title={cat.archived ? "Unarchive" : "Archive"} style={{ background: "none", border: "none", color: T().textMuted, cursor: "pointer", fontSize: 11, padding: "0 4px" }}>{cat.archived ? "↩" : "📦"}</button>
                        <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${cat.name}"?`)) { app.removeNode(cat.id); haptic(15); } }} style={{ background: "none", border: "none", color: T().textDim, cursor: "pointer", fontSize: 14, padding: "0 4px" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = T().textDim)}>×</button>
                      </>
                    )}
                  </div>
                ))}

                {/* Inline add-category */}
                {addingCategoryToGroup === group.id ? (
                  <div onClick={e => e.stopPropagation()} style={{ borderTop: `1px solid ${T().cardBorder}`, padding: "8px 14px 8px 30px" }}>
                    <InlineNew placeholder="Category name"
                      accentColor={group.color || T().accent}
                      icon={<div style={{ width: 8, height: 8, borderRadius: "50%", background: group.color || T().accent, flexShrink: 0 }} />}
                      onCommit={name => { app.addNode({ id: uid(), parentId: group.id, name, color: group.color || PALETTE[(groupCats.length) % PALETTE.length] }); setAddingCategoryToGroup(null); haptic(); }}
                      onCancel={() => setAddingCategoryToGroup(null)} />
                  </div>
                ) : (
                  <button onClick={() => { setAddingCategoryToGroup(group.id); haptic(); }} style={{ width: "100%", padding: "8px 0", borderTop: `1px solid ${T().cardBorder}`, background: "transparent", border: "none", color: T().textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>+ Add category</button>
                )}
              </div>
            );
          }} />

          {archivedRootCount > 0 && !showArchivedRoot && <button onClick={() => setShowArchivedRoot(true)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: T().textDim, fontSize: 11, cursor: "pointer" }}>Show {archivedRootCount} archived</button>}
          {showArchivedRoot && archivedRootCount > 0 && <button onClick={() => setShowArchivedRoot(false)} style={{ marginTop: 8, padding: "8px 0", width: "100%", borderRadius: 8, border: "none", background: T().surface, color: T().textDim, fontSize: 11, cursor: "pointer" }}>Hide archived</button>}
          {addingRoot && <div style={{ marginTop: 8 }}><InlineNew placeholder="Group name (e.g. Immediate Obligations)" accentColor={PALETTE[roots.length % PALETTE.length]}
            icon={<div style={{ width: 12, height: 12, borderRadius: 3, background: PALETTE[roots.length % PALETTE.length] }} />}
            onCommit={name => { app.addNode({ id: uid(), parentId: null, name, color: PALETTE[roots.length % PALETTE.length] }); setAddingRoot(false); haptic(); }} onCancel={() => setAddingRoot(false)} /></div>}
          {!addingRoot && roots.length === 0 && <EmptyState text="No category groups yet" sub="Tap below to create your first group (e.g. Immediate Obligations)" />}
        </div>
        <BottomBar><Btn onClick={() => setAddingRoot(true)} bg={`${T().accent}25`} color={T().accentLight}>+ New Group</Btn></BottomBar>
      </>
    );

    // Financial Overview charts (used on the Charts tab) — anchored at the dashboard's budgetMonth so users see the same period everywhere
    const chartsHero = (() => {
      const [chYStr, chMStr] = budgetMonth.split("-");
      const anchorYear = parseInt(chYStr, 10);
      const anchorMonth = parseInt(chMStr, 10) - 1; // 0-indexed
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const dt = new Date(anchorYear, anchorMonth - i, 1);
        months.push({ key: `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`, label: dt.toLocaleDateString("en-US",{month:"short"}) });
      }
      const allE = d.entries || [];
      const monthData = months.map(m => {
        const me = allE.filter(e => (e.dateISO||"").startsWith(m.key));
        const inc = me.filter(e => e.type==="income").reduce((s,e)=>s+(e.amount||0),0);
        const exp = me.filter(e => e.type==="expense" && e.paid!==false).reduce((s,e)=>s+(e.amount||0),0);
        return { ...m, inc, exp, net: inc - exp };
      });
      const hasData = monthData.some(m => m.inc > 0 || m.exp > 0);

      const curKey = months[months.length-1].key;
      const curExp = allE.filter(e => e.type==="expense" && e.paid!==false && (e.dateISO||"").startsWith(curKey));
      const cats = allCats();
      const catMap = {};
      curExp.forEach(e => { const cid = e.category||"other"; catMap[cid] = (catMap[cid]||0) + (e.amount||0); });
      const catData = Object.entries(catMap).map(([id,total]) => {
        const c = cats.find(x=>x.id===id) || {label:"Other",color:"#94a3b8"};
        return { id, label: c.label, color: c.color, total };
      }).sort((a,b)=>b.total-a.total).slice(0,6);
      const catTotal = catData.reduce((s,c)=>s+c.total,0);

      const maxBar = Math.max(...monthData.map(m => Math.max(m.inc, m.exp)), 1);

      const nets = monthData.map(m => m.net);
      const minNet = Math.min(...nets, 0);
      const maxNet = Math.max(...nets, 1);
      const netRange = (maxNet - minNet) || 1;
      const lineH = 50;
      const linePoints = monthData.map((m,i) => {
        const x = 8 + (i / Math.max(monthData.length-1,1)) * 164;
        const y = lineH - 4 - ((m.net - minNet) / netRange) * (lineH - 8);
        return `${x},${y}`;
      }).join(" ");

      if (!hasData) {
        return (
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "20px 18px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Financial Overview</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Add transactions with dates to see your charts here</div>
          </div>
        );
      }

      return (
        <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: "16px 16px 12px", marginBottom: 20, animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12, paddingLeft: 2 }}>Financial Overview</div>

          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                {(() => {
                  if (catData.length === 0) return <circle cx="45" cy="45" r="32" fill="none" stroke={t.cardBorder} strokeWidth="8" />;
                  const slices = [];
                  let cumAngle = -90;
                  catData.forEach((c, i) => {
                    const pct = c.total / catTotal;
                    const angle = pct * 360;
                    const gap = catData.length > 1 ? 3 : 0;
                    const startA = cumAngle + gap/2;
                    const endA = cumAngle + angle - gap/2;
                    const largeArc = (endA - startA) > 180 ? 1 : 0;
                    const r = 32;
                    const sx = 45 + r * Math.cos(startA * Math.PI/180);
                    const sy = 45 + r * Math.sin(startA * Math.PI/180);
                    const ex = 45 + r * Math.cos(endA * Math.PI/180);
                    const ey = 45 + r * Math.sin(endA * Math.PI/180);
                    if (angle > 1) {
                      slices.push(<path key={i} d={`M${sx},${sy} A${r},${r} 0 ${largeArc} 1 ${ex},${ey}`} fill="none" stroke={c.color} strokeWidth="8" strokeLinecap="round" opacity="0.85" />);
                    }
                    cumAngle += angle;
                  });
                  return slices;
                })()}
                <text x="45" y="42" textAnchor="middle" fill={t.text} fontSize="11" fontWeight="700" fontFamily={t.font}>{catTotal >= 1000 ? `$${(catTotal/1000).toFixed(1)}k` : `$${catTotal.toFixed(0)}`}</text>
                <text x="45" y="54" textAnchor="middle" fill={t.textMuted} fontSize="7" fontWeight="500" fontFamily={t.font}>spent</text>
              </svg>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, minWidth: 0 }}>
              {catData.slice(0,5).map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0, opacity: 0.85 }} />
                  <div style={{ fontSize: 10, color: t.textSub, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: t.text, fontWeight: 600, fontFamily: t.mono, flexShrink: 0 }}>{c.total >= 1000 ? `$${(c.total/1000).toFixed(1)}k` : `$${c.total.toFixed(0)}`}</div>
                </div>
              ))}
              {catData.length > 5 && <div style={{ fontSize: 9, color: t.textMuted }}>+{catData.length-5} more</div>}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
              <span>Income vs Expenses</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}><span style={{ width: 6, height: 6, borderRadius: 2, background: t.inc, opacity: 0.7 }} /> Inc</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}><span style={{ width: 6, height: 6, borderRadius: 2, background: t.exp, opacity: 0.7 }} /> Exp</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
              {monthData.map((m,i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 36, width: "100%" }}>
                    <div style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${t.inc}90`, height: Math.max(2, (m.inc/maxBar)*36), transition: "height 0.4s ease", minHeight: m.inc > 0 ? 3 : 0 }} />
                    <div style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${t.exp}90`, height: Math.max(2, (m.exp/maxBar)*36), transition: "height 0.4s ease", minHeight: m.exp > 0 ? 3 : 0 }} />
                  </div>
                  <div style={{ fontSize: 8, color: t.textDim, fontWeight: 500, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Cash Flow Trend</div>
            <svg width="100%" height={lineH} viewBox={`0 0 180 ${lineH}`} preserveAspectRatio="none">
              {minNet < 0 && <line x1="8" y1={lineH - 4 - ((0 - minNet)/netRange)*(lineH-8)} x2="172" y2={lineH - 4 - ((0 - minNet)/netRange)*(lineH-8)} stroke={t.textDim} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />}
              <defs>
                <linearGradient id="cashFlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.inc} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={t.inc} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`8,${lineH-4} ${linePoints} 172,${lineH-4}`} fill="url(#cashFlowGrad)" />
              <polyline points={linePoints} fill="none" stroke={t.inc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              {monthData.map((m,i) => {
                const x = 8 + (i / Math.max(monthData.length-1,1)) * 164;
                const y = lineH - 4 - ((m.net - minNet) / netRange) * (lineH - 8);
                return <circle key={i} cx={x} cy={y} r="2.5" fill={m.net >= 0 ? t.inc : t.exp} stroke={t.id==="midnight"?"#0a0a1a":"#021a1a"} strokeWidth="1" />;
              })}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ fontSize: 8, color: t.textDim }}>{months[0].label}</span>
              <span style={{ fontSize: 9, color: nets[nets.length-1] >= 0 ? t.inc : t.exp, fontWeight: 600, fontFamily: t.mono }}>
                {nets[nets.length-1] >= 0 ? "+" : ""}{nets[nets.length-1] >= 1000 || nets[nets.length-1] <= -1000 ? `$${(nets[nets.length-1]/1000).toFixed(1)}k` : `$${nets[nets.length-1].toFixed(0)}`}
              </span>
              <span style={{ fontSize: 8, color: t.textDim }}>{months[months.length-1].label}</span>
            </div>
          </div>
        </div>
      );
    })();

    // Bottom navigation bar
    const bottomNav = (
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0,
        background: t.id === "linen" ? "rgba(255, 255, 255, 0.92)" : t.id === "midnight" ? "rgba(8, 8, 22, 0.95)" : "rgba(2, 22, 22, 0.95)",
        borderTop: `1px solid ${t.cardBorder}`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
        zIndex: 100,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "budgets", icon: "📂", label: "Categories" },
          { id: "charts", icon: "📈", label: "Charts" },
          { id: "accounts", icon: "🏦", label: "Accounts" },
          { id: "settings", icon: "⚙️", label: "Settings" },
        ].map(tab => (
          <button key={tab.id} onClick={() => {
            haptic();
            if (tab.id === "settings") { setShowSettings(!showSettings); setActiveTab("home"); }
            else { setShowSettings(false); setActiveTab(tab.id); }
          }} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: activeTab === tab.id || (tab.id === "settings" && showSettings) ? t.accent : t.textMuted,
            fontSize: 20, padding: "4px 12px", transition: "color 0.2s",
          }}>
            <span>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.04em" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    );

    // Reusable transaction editor sheet — rendered from anywhere that exposes tap-to-edit (Account detail, Category detail).
    // Driven by the `editingEntry` state set when a row is tapped.
    const txEditSheet = editingEntry && (() => {
      const entry = (d.entries || []).find(e => e.id === editingEntry);
      if (!entry) { setEditingEntry(null); return null; }
      const close = () => { setEditingEntry(null); };
      const amtNum = parseFloat(entryDraft.amount) || 0;
      const accts = (d.accounts || []).filter(a => !a.archived);
      const valid = amtNum > 0 && entryDraft.categoryId && entryDraft.dateISO && (accts.length === 0 || entryDraft.accountId);
      const catList = (() => {
        const out = [];
        d.nodes.filter(n => n.parentId === null && !n.archived).forEach(g => {
          d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => out.push({ id: c.id, label: c.name, group: g.name }));
        });
        return out;
      })();
      const save = () => {
        if (!valid) return;
        const dateStr = (() => { const dt = new Date(entryDraft.dateISO + "T00:00:00"); return isNaN(dt) ? entryDraft.dateISO : fmtDate(entryDraft.dateISO); })();
        app.updateEntry(entry.id, {
          type: entryDraft.type,
          nodeId: entryDraft.categoryId,
          accountId: entryDraft.accountId || null,
          amount: amtNum,
          label: entryDraft.label.trim(),
          dateISO: entryDraft.dateISO,
          date: dateStr,
          paid: entryDraft.paid,
        });
        haptic(15);
        close();
      };
      const remove = () => { if (confirm("Delete this transaction?")) { app.removeEntry(entry.id); haptic(15); close(); } };
      return (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
          <div style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", background: t.bg, borderTop: `1px solid ${t.cardBorder}`, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: "16px 20px calc(20px + env(safe-area-inset-bottom, 0px))", zIndex: 201, animation: "slideIn 0.2s ease", boxShadow: "0 -10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Edit transaction</div>
              <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, background: t.surface, padding: 4, borderRadius: 10, border: `1px solid ${t.cardBorder}` }}>
              {[ { id: "expense", label: "Expense", color: t.exp }, { id: "income", label: "Income", color: t.inc } ].map(opt => {
                const sel = entryDraft.type === opt.id;
                return <button key={opt.id} onClick={() => { setEntryDraft({ ...entryDraft, type: opt.id }); haptic(); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: sel ? `${opt.color}25` : "transparent", color: sel ? opt.color : t.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{opt.label}</button>;
              })}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 18, fontWeight: 600 }}>$</span>
                <input autoFocus type="number" inputMode="decimal" step="0.01" min="0" value={entryDraft.amount} onChange={e => setEntryDraft({ ...entryDraft, amount: e.target.value })} placeholder="0.00"
                  style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "14px 14px 14px 30px", color: t.text, fontSize: 22, fontWeight: 700, fontFamily: t.mono, outline: "none", textAlign: "right" }} />
              </div>
            </div>
            <input value={entryDraft.label} onChange={e => setEntryDraft({ ...entryDraft, label: e.target.value })} placeholder="What for? (optional)"
              style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none", marginBottom: 12 }} />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Category</div>
              <select value={entryDraft.categoryId} onChange={e => setEntryDraft({ ...entryDraft, categoryId: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}>
                {catList.map(c => <option key={c.id} value={c.id}>{c.group} › {c.label}</option>)}
              </select>
            </div>
            {accts.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Account</div>
                <select value={entryDraft.accountId} onChange={e => setEntryDraft({ ...entryDraft, accountId: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}>
                  <option value="">None</option>
                  {accts.map(a => { const ti = ACCOUNT_TYPES.find(at => at.id === a.type) || ACCOUNT_TYPES[0]; return <option key={a.id} value={a.id}>{ti.icon} {a.name}</option>; })}
                </select>
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Date</div>
              <input type="date" value={entryDraft.dateISO} onChange={e => setEntryDraft({ ...entryDraft, dateISO: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }} />
            </div>
            {entryDraft.type === "expense" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: t.surface, borderRadius: 10, marginBottom: 16, border: `1px solid ${t.cardBorder}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>Paid</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{entryDraft.paid ? "Counted in this month's spending" : "Treated as an upcoming bill"}</div>
                </div>
                <button onClick={() => { setEntryDraft({ ...entryDraft, paid: !entryDraft.paid }); haptic(); }}
                  style={{ width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", background: entryDraft.paid ? t.inc : "rgba(255,255,255,0.1)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, transition: "left 0.2s", left: entryDraft.paid ? 21 : 3 }} />
                </button>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={remove} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${t.exp}30`, background: `${t.exp}10`, color: t.exp, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
              <button onClick={close} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} disabled={!valid} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: valid ? t.accent : t.cardBorder, color: "#fff", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.5 }}>Save</button>
            </div>
          </div>
        </>
      );
    })();

    // Tab content: Budgets — defer to Category Detail when something is on the navStack
    if (activeTab === "budgets" && !cur) {
      return shell(
        <div style={{ padding: "24px 20px 0px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => { setActiveTab("home"); setShowSettings(false); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text, flex: 1 }}>Categories</h1>
            <button onClick={() => setShowSettings(!showSettings)} style={{ background: showSettings ? `${t.accent}20` : t.surface, border: `1px solid ${showSettings ? t.accent + "40" : t.cardBorder}`, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: showSettings ? t.accentLight : t.textSub, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>⚙</button>
          </div>
          {settingsPanel}
          {folderList}
          <div style={{ height: 24 }} />
        </div>
      );
    }

    // Tab content: Charts (Financial Overview) — anchored at the dashboard's budgetMonth so the user sees consistent periods across tabs
    if (activeTab === "charts" && !cur) {
      const [chY, chM] = budgetMonth.split("-");
      const chDate = new Date(parseInt(chY, 10), parseInt(chM, 10) - 1, 1);
      const chLabel = chDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const chPrev = new Date(parseInt(chY, 10), parseInt(chM, 10) - 2, 1);
      const chNext = new Date(parseInt(chY, 10), parseInt(chM, 10), 1);
      const chPrevKey = `${chPrev.getFullYear()}-${String(chPrev.getMonth()+1).padStart(2,"0")}`;
      const chNextKey = `${chNext.getFullYear()}-${String(chNext.getMonth()+1).padStart(2,"0")}`;
      const chPrevLabel = chPrev.toLocaleDateString("en-US", { month: "short" });
      const chNextLabel = chNext.toLocaleDateString("en-US", { month: "short" });
      return shell(
        <div style={{ padding: "24px 20px 0px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={() => { setActiveTab("home"); setShowSettings(false); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text, flex: 1 }}>Charts</h1>
            <button onClick={() => setShowSettings(!showSettings)} style={{ background: showSettings ? `${t.accent}20` : t.surface, border: `1px solid ${showSettings ? t.accent + "40" : t.cardBorder}`, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: showSettings ? t.accentLight : t.textSub, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>⚙</button>
          </div>
          {settingsPanel}
          {/* Month picker — same shape as the dashboard's, scrolls 6-month windows backward/forward */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => { setBudgetMonth(chPrevKey); haptic(); }} style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>‹ {chPrevLabel}</button>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>6 months ending {chLabel}</div>
            <button onClick={() => { setBudgetMonth(chNextKey); haptic(); }} style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{chNextLabel} ›</button>
          </div>
          <div style={{ fontSize: 10, color: t.textMuted, textAlign: "center", marginBottom: 14 }}>Linked to dashboard month</div>
          {chartsHero}
          <div style={{ flex: 1 }} />
          {bottomNav}
        </div>
      );
    }

    // Tab content: Accounts (top-level, YNAB-style account tracking) — defer to Category Detail when navigated into a node
    if (activeTab === "accounts" && !cur) {
      const accounts = (d.accounts || []).filter(a => !a.archived);
      const selected = selectedAccountId ? accounts.find(a => a.id === selectedAccountId) : null;

      // ─── Account detail view ───
      if (selected) {
        const acctEntries = (d.entries || [])
          .filter(e => e.accountId === selected.id)
          .sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
        const balance = getAccountBalance(selected, d.entries || []);
        const cleared = acctEntries.filter(e => e.cleared !== false);
        const uncleared = acctEntries.filter(e => e.cleared === false);
        const typeInfo = ACCOUNT_TYPES.find(at => at.id === selected.type) || ACCOUNT_TYPES[0];
        const isLiab = selected.type === "credit";

        return shell(
          <div style={{ padding: "24px 20px 0px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button onClick={() => { setSelectedAccountId(null); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Accounts</button>
              <span style={{ fontSize: 18 }}>{typeInfo.icon}</span>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.name}</h1>
              <button onClick={() => { setAccountEditor(selected.id); setAcctDraft({ name: selected.name, type: selected.type, startingBalance: String(selected.startingBalance || 0), color: selected.color || typeInfo.color }); haptic(); }} title="Edit" style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11 }}>Edit</button>
            </div>

            {/* Balance card */}
            <div style={{ background: `linear-gradient(135deg, ${selected.color || typeInfo.color}25, ${selected.color || typeInfo.color}08)`, border: `1px solid ${selected.color || typeInfo.color}40`, borderRadius: 14, padding: "18px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{typeInfo.label}{isLiab ? " · owed" : ""}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: balance < 0 ? t.exp : t.text, fontFamily: t.mono, marginTop: 4 }}>
                {balance < 0 ? "-" : ""}{fmt(Math.abs(balance))}
              </div>
              {selected.startingBalance ? <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>Started at {fmt(selected.startingBalance)}</div> : null}
              {uncleared.length > 0 && <div style={{ fontSize: 10, color: t.textSub, marginTop: 4 }}>{uncleared.length} uncleared transaction{uncleared.length === 1 ? "" : "s"}</div>}
            </div>

            {/* Transactions list */}
            <div style={{ paddingBottom: 100 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8, paddingLeft: 2 }}>
                Transactions ({acctEntries.length})
              </div>
              {acctEntries.length === 0 ? (
                <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "32px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>No transactions yet</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Add one with the + button on the dashboard.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {acctEntries.slice(0, 100).map(entry => {
                    const cat = allCats().find(c => c.id === entry.category);
                    const node = d.nodes.find(n => n.id === entry.nodeId);
                    const folder = node?.parentId ? d.nodes.find(n => n.id === node.parentId) : node;
                    const unpaid = entry.paid === false;
                    return (
                      <div key={entry.id} onClick={() => {
                        // Tap → open the unified transaction editor sheet
                        setEntryDraft({
                          type: entry.type || "expense",
                          categoryId: entry.nodeId || "",
                          accountId: entry.accountId || "",
                          amount: String(Math.abs(entry.amount || 0)),
                          label: entry.label || "",
                          dateISO: entry.dateISO || "",
                          paid: entry.paid !== false,
                        });
                        setEditingEntry(entry.id);
                        haptic();
                      }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: t.surface, borderRadius: 10, cursor: "pointer", borderLeft: unpaid ? `2px solid ${t.exp}80` : "2px solid transparent" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: cat ? `${cat.color}20` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{cat ? cat.icon : "📋"}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label || (cat?.label || "Untitled")}</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {folder?.name || "—"}{entry.dateISO ? ` · ${fmtDate(entry.dateISO)}` : ""}{unpaid ? " · unpaid" : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, flexShrink: 0, color: entry.type === "income" ? t.inc : t.exp, fontFamily: t.mono }}>
                          {entry.type === "income" ? "+" : "-"}{fmt(Math.abs(entry.amount || 0))}
                        </div>
                      </div>
                    );
                  })}
                  {acctEntries.length > 100 && <div style={{ textAlign: "center", fontSize: 10, color: t.textMuted, padding: "8px 0" }}>+{acctEntries.length - 100} older transactions</div>}
                </div>
              )}
            </div>

            {txEditSheet}

            <div style={{ flex: 1 }} />
            {bottomNav}
          </div>
        );
      }

      // ─── Accounts list view ───
      const grouped = ACCOUNT_TYPES.reduce((acc, type) => {
        const inType = accounts.filter(a => a.type === type.id);
        if (inType.length > 0) acc.push({ type, items: inType });
        return acc;
      }, []);
      const totalCash = accounts.reduce((sum, a) => sum + getAccountBalance(a, d.entries || []), 0);

      return shell(
        <div style={{ padding: "24px 20px 0px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => { setActiveTab("home"); setShowSettings(false); haptic(); }} style={{ background: t.inputBg, border: "none", color: t.textSub, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>‹ Home</button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text, flex: 1 }}>Accounts</h1>
            <button onClick={() => { setAccountEditor("new"); setAcctDraft({ name: "", type: "checking", startingBalance: "", color: "" }); haptic(); }} style={{ background: t.accent, border: "none", color: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>+ Add</button>
          </div>
          {settingsPanel}

          {/* Total cash position */}
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Net Cash</div>
              <div style={{ fontSize: 11, color: t.textSub, marginTop: 2 }}>{accounts.length} account{accounts.length === 1 ? "" : "s"}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: totalCash < 0 ? t.exp : t.inc, fontFamily: t.mono }}>
              {totalCash < 0 ? "-" : ""}{fmt(Math.abs(totalCash))}
            </div>
          </div>

          {accounts.length === 0 ? (
            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>No accounts yet</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>Add one for each place your money lives — Checking, Savings, Credit Card, Cash.</div>
              <button onClick={() => { setAccountEditor("new"); setAcctDraft({ name: "", type: "checking", startingBalance: "", color: "" }); haptic(); }} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add your first account</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 100 }}>
              {grouped.map(group => {
                const groupTotal = group.items.reduce((s, a) => s + getAccountBalance(a, d.entries || []), 0);
                return (
                  <div key={group.type.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, paddingLeft: 4 }}>
                      <div style={{ fontSize: 10, color: group.type.color, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 12 }}>{group.type.icon}</span>
                        {group.type.label}{group.items.length > 1 ? ` (${group.items.length})` : ""}
                      </div>
                      <div style={{ fontSize: 11, color: t.textSub, fontFamily: t.mono, fontWeight: 600 }}>{groupTotal < 0 ? "-" : ""}{fmt(Math.abs(groupTotal))}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {group.items.map(acct => {
                        const bal = getAccountBalance(acct, d.entries || []);
                        const txCount = (d.entries || []).filter(e => e.accountId === acct.id).length;
                        return (
                          <div key={acct.id} onClick={() => { setSelectedAccountId(acct.id); haptic(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, cursor: "pointer", borderLeft: `3px solid ${acct.color || group.type.color}`, transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background = t.card}>
                            <span style={{ fontSize: 18 }}>{group.type.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acct.name}</div>
                              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>{txCount} transaction{txCount === 1 ? "" : "s"}</div>
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: bal < 0 ? t.exp : t.text, fontFamily: t.mono, flexShrink: 0 }}>
                              {bal < 0 ? "-" : ""}{fmt(Math.abs(bal))}
                            </div>
                            <span style={{ fontSize: 14, color: t.textDim }}>›</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Account editor sheet (new + edit) */}
          {accountEditor && (() => {
            const isNew = accountEditor === "new";
            const editing = !isNew ? (d.accounts || []).find(a => a.id === accountEditor) : null;
            const close = () => { setAccountEditor(null); setAcctDraft({ name: "", type: "checking", startingBalance: "", color: "" }); };
            const typeInfo = ACCOUNT_TYPES.find(at => at.id === acctDraft.type) || ACCOUNT_TYPES[0];
            const valid = acctDraft.name.trim().length > 0;
            const save = () => {
              if (!valid) return;
              const payload = {
                name: acctDraft.name.trim(),
                type: acctDraft.type,
                startingBalance: parseFloat(acctDraft.startingBalance) || 0,
                color: acctDraft.color || typeInfo.color,
              };
              if (isNew) app.addAccount(payload);
              else app.updateAccount(editing.id, payload);
              haptic();
              close();
            };
            const remove = () => {
              if (!editing) return;
              const txCount = (d.entries || []).filter(e => e.accountId === editing.id).length;
              const msg = txCount > 0
                ? `Remove "${editing.name}"? ${txCount} transaction${txCount === 1 ? "" : "s"} will be detached from any account (you can re-assign later).`
                : `Remove "${editing.name}"?`;
              if (confirm(msg)) {
                app.removeAccount(editing.id);
                haptic(15);
                setSelectedAccountId(null);
                close();
              }
            };
            return (
              <>
                <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
                <div style={{ position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", background: t.bg, borderTop: `1px solid ${t.cardBorder}`, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: "16px 20px calc(20px + env(safe-area-inset-bottom, 0px))", zIndex: 201, animation: "slideIn 0.2s ease", boxShadow: "0 -10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{isNew ? "New account" : "Edit account"}</div>
                    <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                  </div>

                  <input value={acctDraft.name} onChange={e => setAcctDraft({ ...acctDraft, name: e.target.value })} placeholder="Account name (e.g. Chase Checking)" autoFocus
                    style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none", marginBottom: 12 }} />

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Type</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {ACCOUNT_TYPES.filter(at => ["checking", "savings", "credit", "cash"].includes(at.id)).map(at => {
                        const sel = acctDraft.type === at.id;
                        return (
                          <button key={at.id} onClick={() => { setAcctDraft({ ...acctDraft, type: at.id, color: acctDraft.color || at.color }); haptic(); }} style={{ padding: "10px 8px", borderRadius: 10, background: sel ? `${at.color}20` : "rgba(255,255,255,0.02)", border: sel ? `1px solid ${at.color}60` : `1px solid ${t.cardBorder}`, color: sel ? at.color : t.textSub, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{at.icon}</span>{at.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Starting balance</div>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 16, fontWeight: 600 }}>$</span>
                      <input value={acctDraft.startingBalance} onChange={e => setAcctDraft({ ...acctDraft, startingBalance: e.target.value })} type="number" step="0.01" inputMode="decimal" placeholder="0.00"
                        style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px 12px 30px", color: t.text, fontSize: 16, fontFamily: t.mono, outline: "none", textAlign: "right" }} />
                    </div>
                    {acctDraft.type === "credit" && <div style={{ fontSize: 10, color: t.textMuted, marginTop: 6 }}>Enter what you currently owe as a positive number — credit balances display as negative.</div>}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {!isNew && <button onClick={remove} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${t.exp}30`, background: `${t.exp}10`, color: t.exp, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Remove</button>}
                    <button onClick={close} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                    <button onClick={save} disabled={!valid} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: valid ? t.accent : t.cardBorder, color: "#fff", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.5 }}>{isNew ? "Add account" : "Save"}</button>
                  </div>
                </div>
              </>
            );
          })()}

          <div style={{ flex: 1 }} />
          {bottomNav}
        </div>
      );
    }

    // ── Category Detail (rebuilt fresh) ──
    // Renders when a node is on the navStack. Defensively handles missing/malformed data —
    // every lookup uses optional chaining, every math call is wrapped in try/catch so a
    // bad data path produces a graceful fallback instead of blanking the page.
    if (cur) {
      const node = cur || {};
      const nodeId = node.id;
      const nodeName = (node.name || "Untitled").toString();
      const nodeColor = node.color || t.accent;
      const isGroup = node.parentId == null; // null OR undefined → treat as group/root
      const parentNode = node.parentId ? d.nodes.find(n => n.id === node.parentId) : null;
      const parentName = parentNode?.name || "Categories";

      // Direct entries on this node only — categories are leaves in the new model,
      // and walking descendants is what hit the legacy bug.
      const directEntries = (d.entries || []).filter(e => e && e.nodeId === nodeId);
      const monthFilter = nodePageMonthFilter;
      const filteredEntries = monthFilter
        ? directEntries.filter(e => (e.dateISO || "").startsWith(monthFilter))
        : directEntries;
      const sortedEntries = [...filteredEntries].sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

      const monthMapForCat = (d.budgetMonths || {})[budgetMonth] || {};
      const assignedThisMonth = monthMapForCat[nodeId]?.assigned || 0;
      let activityThisMonth = 0;
      let availableNow = 0;
      try { activityThisMonth = getCategoryActivity(d.nodes, d.entries, nodeId, budgetMonth); } catch (err) { console.error("[CategoryDetail] activity math:", err); }
      try { availableNow = getCategoryAvailable(d.nodes, d.entries, d.budgetMonths || {}, nodeId, budgetMonth); } catch (err) { console.error("[CategoryDetail] available math:", err); }
      const overspent = availableNow < 0;

      const goal = !isGroup ? (d.goals || {})[nodeId] : null;
      const goalDesc = describeGoal(goal);
      const availableThroughLastMonth = availableNow - (assignedThisMonth - activityThisMonth);
      let goalNeeded = 0;
      try { goalNeeded = goal ? getGoalNeeded(goal, assignedThisMonth, availableThroughLastMonth, budgetMonth) : 0; } catch {}
      const goalUnderfunded = goal && goalNeeded > 0;

      const cats = allCats();
      const monthLabel = (() => {
        const [y, m] = budgetMonth.split("-");
        return new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      })();
      const filterMonthLabel = monthFilter ? (() => {
        const [y, m] = monthFilter.split("-");
        return new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      })() : null;

      const openEdit = entry => {
        if (!entry || !entry.id) return;
        setEntryDraft({
          type: entry.type || "expense",
          categoryId: entry.nodeId || "",
          accountId: entry.accountId || "",
          amount: String(Math.abs(entry.amount || 0)),
          label: entry.label || "",
          dateISO: entry.dateISO || "",
          paid: entry.paid !== false,
        });
        setEditingEntry(entry.id);
        haptic();
      };

      return shell(
        <div style={{ padding: "20px 20px 0", animation: "fadeIn 0.3s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <button onClick={navStack.length === 1 ? goHome : goBack} style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 8, padding: "7px 11px", cursor: "pointer", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              ‹ {navStack.length === 1 ? "Budget" : parentName}
            </button>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: nodeColor, flexShrink: 0 }} />
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nodeName}</h1>
            <button
              onClick={() => {
                const v = prompt("Rename category", nodeName);
                if (v && v.trim() && v.trim() !== nodeName) app.updateNode(nodeId, { name: v.trim() });
              }}
              title="Rename"
              style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, color: t.textSub, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
            >Rename</button>
          </div>

          {monthFilter && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: `${t.accent}10`, border: `1px solid ${t.accent}30`, borderRadius: 10, marginBottom: 12, fontSize: 11 }}>
              <span style={{ fontSize: 13 }}>📅</span>
              <span style={{ flex: 1, color: t.text, fontWeight: 600 }}>{filterMonthLabel}</span>
              <span style={{ color: t.textMuted, fontFamily: t.mono }}>{sortedEntries.length} txn{sortedEntries.length === 1 ? "" : "s"}</span>
              <button onClick={() => { setNodePageMonthFilter(null); haptic(); }} title="View all-time" style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 16, padding: "0 4px", lineHeight: 1 }}>×</button>
            </div>
          )}

          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderLeft: `3px solid ${nodeColor}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>{monthLabel}</div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Assigned</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, fontFamily: t.mono, marginTop: 2 }}>{fmt(assignedThisMonth)}</div>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${t.cardBorder}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Activity</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: activityThisMonth > 0 ? t.exp : t.textSub, fontFamily: t.mono, marginTop: 2 }}>{activityThisMonth > 0 ? "-" : ""}{fmt(activityThisMonth)}</div>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${t.cardBorder}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Available</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: overspent ? t.exp : t.inc, fontFamily: t.mono, marginTop: 2 }}>{overspent ? "-" : ""}{fmt(Math.abs(availableNow))}</div>
              </div>
            </div>
          </div>

          {!isGroup && (
            <div style={{ marginBottom: 12 }}>
              {goal ? (
                <button
                  onClick={() => { setGoalEditor({ categoryId: nodeId }); setGoalDraft({ type: goal.type, amount: String(goal.amount || ""), by: goal.by || "" }); haptic(); }}
                  style={{ width: "100%", background: goalUnderfunded ? `${t.exp}10` : `${t.inc}10`, border: `1px solid ${goalUnderfunded ? t.exp : t.inc}30`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: goalUnderfunded ? t.exp : t.inc, fontFamily: t.mono, fontSize: 12, fontWeight: 700 }}
                >
                  <span>🎯 {goalDesc || "Goal"}</span>
                  {goalUnderfunded ? <span>+{fmt(goalNeeded)} needed</span> : <span style={{ opacity: 0.7 }}>on track</span>}
                </button>
              ) : (
                <button
                  onClick={() => { setGoalEditor({ categoryId: nodeId }); setGoalDraft({ type: "monthly", amount: "", by: "" }); haptic(); }}
                  style={{ width: "100%", background: "transparent", border: `1px dashed ${t.cardBorder}`, borderRadius: 10, padding: "10px 14px", color: t.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                >+ Set a goal</button>
              )}
            </div>
          )}

          <div style={{ paddingBottom: 100 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8, paddingLeft: 2 }}>
              Transactions ({sortedEntries.length}{monthFilter ? " · this month" : ""})
            </div>
            {sortedEntries.length === 0 ? (
              <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>No transactions {monthFilter ? "this month" : "yet"}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Use the + button to add one.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {sortedEntries.slice(0, 100).map(entry => {
                  const cat = cats.find(c => c.id === entry.category);
                  const acct = (d.accounts || []).find(a => a.id === entry.accountId);
                  const unpaid = entry.paid === false;
                  return (
                    <div
                      key={entry.id}
                      onClick={() => openEdit(entry)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: t.surface, borderRadius: 10, cursor: "pointer", borderLeft: unpaid ? `2px solid ${t.exp}80` : "2px solid transparent" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: cat ? `${cat.color}20` : t.surfaceHover, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                        {cat ? cat.icon : "📋"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label || cat?.label || "Untitled"}</div>
                        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {acct ? acct.name : "—"}{entry.dateISO ? ` · ${fmtDate(entry.dateISO)}` : ""}{unpaid ? " · unpaid" : ""}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, flexShrink: 0, color: entry.type === "income" ? t.inc : t.exp, fontFamily: t.mono }}>
                        {entry.type === "income" ? "+" : "-"}{fmt(Math.abs(entry.amount || 0))}
                      </div>
                    </div>
                  );
                })}
                {sortedEntries.length > 100 && (
                  <div style={{ textAlign: "center", fontSize: 10, color: t.textMuted, padding: "8px 0" }}>+{sortedEntries.length - 100} older transactions</div>
                )}
              </div>
            )}
          </div>

          {txEditSheet}
          <div style={{ flex: 1 }} />
          {bottomNav}
        </div>
      );
    }

    // Tab content: Home (default dashboard)
    return shell(
      <div style={{ padding: "24px 20px 0px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", minHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))", minHeight: "-webkit-fill-available" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative" }}>
          {/* Connection / sync indicator */}
          {(() => {
            const status = !online ? { color: "#f59e0b", label: "Offline", title: "You're offline. Changes are saved locally and will sync when you reconnect." }
              : pendingWrites ? { color: t.accent, label: "Syncing", title: "Saving changes to the cloud…" }
              : { color: t.inc, label: "Synced", title: "All changes saved." };
            return (
              <div title={status.title} style={{ position: "absolute", left: 0, display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 10, background: `${status.color}10`, border: `1px solid ${status.color}30`, fontSize: 10, color: status.color, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color, boxShadow: pendingWrites ? `0 0 0 0 ${status.color}` : "none", animation: pendingWrites ? "pulse 1.5s ease infinite" : "none" }} />
                {status.label}
              </div>
            );
          })()}
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: "0.18em", textTransform: "uppercase", color: t.accent }}>MAVERICK</h1>
          <button onClick={() => { setShowSettings(!showSettings); haptic(); }} style={{
            position: "absolute", right: 0, background: showSettings ? `${t.accent}20` : t.surface,
            border: `1px solid ${showSettings ? t.accent + "40" : t.cardBorder}`, borderRadius: 10,
            width: 36, height: 36, cursor: "pointer", fontSize: 18,
            color: showSettings ? t.accentLight : t.textSub,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}>⚙</button>
        </div>

        {/* Settings panel */}
        {settingsPanel}

        {/* Greeting section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: t.textMuted, fontWeight: 400, marginBottom: 2 }}>{greeting},</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 12 }}>{displayName}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Total Balance</div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: t.text, marginTop: 4 }}><AnimatedCurrency value={totalBalance} /></div>
        </div>

        {/* Global search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 14 }}>⌕</span>
          <input
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder="Search all transactions, folders, tags…"
            style={{ width: "100%", boxSizing: "border-box", background: t.surface, border: `1px solid ${globalSearch ? t.accent + "40" : t.cardBorder}`, borderRadius: 12, padding: "12px 36px 12px 36px", color: t.text, fontSize: 14, outline: "none", transition: "border-color 0.15s" }}
          />
          {globalSearch && (
            <button onClick={() => setGlobalSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 18, padding: 4, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Search results — replaces dashboard sections when active */}
        {globalSearch.trim() && (() => {
          const q = globalSearch.trim().toLowerCase();
          const cats = allCats();
          const nodeById = id => d.nodes.find(n => n.id === id);
          const folderOf = nid => {
            let n = nodeById(nid);
            while (n?.parentId) n = nodeById(n.parentId);
            return n;
          };
          const matches = (d.entries || []).map(e => {
            const cat = cats.find(c => c.id === e.category);
            const node = nodeById(e.nodeId);
            const folder = folderOf(e.nodeId);
            const tagStr = Array.isArray(e.tags) ? e.tags.join(" ") : (e.tags || "");
            const amountStr = String(e.amount || "");
            const haystack = [e.label, cat?.label, node?.name, folder?.name, tagStr, amountStr, e.dateISO]
              .filter(Boolean).join(" ").toLowerCase();
            return haystack.includes(q) ? { entry: e, cat, node, folder } : null;
          }).filter(Boolean);

          // Sort newest first, cap at 50 to keep DOM light
          matches.sort((a, b) => (b.entry.dateISO || "").localeCompare(a.entry.dateISO || ""));
          const shown = matches.slice(0, 50);
          const totalMatched = matches.length;
          const incTotal = matches.filter(m => m.entry.type === "income").reduce((s, m) => s + (m.entry.amount || 0), 0);
          const expTotal = matches.filter(m => m.entry.type === "expense").reduce((s, m) => s + (m.entry.amount || 0), 0);

          if (totalMatched === 0) {
            return (
              <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>No matches</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Try a different label, category, folder, tag, or amount.</div>
              </div>
            );
          }

          return (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8, paddingLeft: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{totalMatched} match{totalMatched === 1 ? "" : "es"}{shown.length < totalMatched ? ` (showing ${shown.length})` : ""}</span>
                <span style={{ fontWeight: 400, letterSpacing: "0.04em", textTransform: "none", fontFamily: t.mono }}>
                  {incTotal > 0 && <span style={{ color: t.inc, marginRight: 8 }}>+{fmt(incTotal)}</span>}
                  {expTotal > 0 && <span style={{ color: t.exp }}>-{fmt(expTotal)}</span>}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {shown.map(({ entry, cat, node, folder }) => (
                  <div key={entry.id} onClick={() => {
                    // Navigate into the folder (or sub-budget) that owns this entry
                    if (entry.nodeId) {
                      const owner = nodeById(entry.nodeId);
                      if (owner) {
                        // Build nav stack from root to owner
                        const stack = [];
                        let cur = owner;
                        while (cur) { stack.unshift(cur.id); cur = cur.parentId ? nodeById(cur.parentId) : null; }
                        setNavStack(stack);
                        setGlobalSearch("");
                        haptic();
                      }
                    }
                  }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: t.surface, borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: cat ? `${cat.color}20` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                      {cat ? cat.icon : "📋"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label || "Untitled"}</div>
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {folder ? folder.name : "—"}
                        {node && node.id !== folder?.id ? ` › ${node.name}` : ""}
                        {entry.dateISO ? ` · ${fmtDate(entry.dateISO)}` : ""}
                        {entry.paid === false && entry.type === "expense" ? " · unpaid" : ""}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, flexShrink: 0, color: entry.type === "income" ? t.inc : t.exp }}>
                      {entry.type === "income" ? "+" : "-"}{fmt(Math.abs(entry.amount || 0))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Dashboard sections — hidden while search is active */}
        {globalSearch.trim() ? null : (
        <>
        {/* ── YNAB-style Budget Dashboard ───────────────────────── */}
        {(() => {
          // Parse current budget month (YYYY-MM) into nav handles
          const [yStr, mStr] = budgetMonth.split("-");
          const yearN = parseInt(yStr, 10);
          const monthN = parseInt(mStr, 10) - 1;
          const monthDate = new Date(yearN, monthN, 1);
          const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          const prev = new Date(yearN, monthN - 1, 1);
          const next = new Date(yearN, monthN + 1, 1);
          const prevKey = `${prev.getFullYear()}-${String(prev.getMonth()+1).padStart(2,"0")}`;
          const nextKey = `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`;
          const prevLabel = prev.toLocaleDateString("en-US", { month: "short" });
          const nextLabel = next.toLocaleDateString("en-US", { month: "short" });

          const groups = allRoots.filter(n => !n.archived);
          const budgetMonthsObj = d.budgetMonths || {};
          const monthMap = budgetMonthsObj[budgetMonth] || {};
          const readyToAssign = getReadyToAssign(d.entries || [], budgetMonthsObj);
          const rtaPositive = readyToAssign >= 0;

          const hasAnyAssignmentInThisMonth = Object.keys(monthMap).length > 0;
          const hasAnyAssignmentInPrevMonth = Object.keys(budgetMonthsObj[prevKey] || {}).length > 0;

          const commitAssigned = (categoryId) => {
            const num = parseFloat(assignedDraft);
            const cleanNum = isNaN(num) ? 0 : Math.max(0, num);
            app.setAssigned(budgetMonth, categoryId, cleanNum);
            setEditingAssigned(null);
            setAssignedDraft("");
            haptic();
          };

          if (groups.length === 0) {
            return (
              <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>No category groups yet</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>Create your first group (e.g. "Immediate Obligations") in Budgets.</div>
                <button onClick={() => { setActiveTab("budgets"); setTimeout(() => setAddingRoot(true), 200); haptic(); }} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Set up budget</button>
              </div>
            );
          }

          return (
            <>
              {/* YNAB-style top header — Month picker on left, Ready-to-Assign pill on right (matching the iPad reference layout). */}
              {(() => {
                const monthIncome = (d.entries || []).filter(e => e.type === "income" && (e.dateISO || "").startsWith(budgetMonth)).reduce((s, e) => s + (e.amount || 0), 0);
                const monthAssigned = Object.values(monthMap).reduce((s, c) => s + (c?.assigned || 0), 0);
                const monthSpent = groups.reduce((sum, group) => {
                  const cats = d.nodes.filter(n => n.parentId === group.id && !n.archived);
                  return sum + cats.reduce((s, c) => s + getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth), 0);
                }, 0);
                // Lime/green pill when there's money to assign; coral red when over-assigned (YNAB signature).
                const pillBg = rtaPositive ? "linear-gradient(135deg, #84cc16, #65a30d)" : "linear-gradient(135deg, #fca5a5, #ef4444)";
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                    {/* Month picker — chevron + label, tap month label to jump to today */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => { setBudgetMonth(prevKey); haptic(); }} title={`← ${prevLabel}`} style={{ background: "transparent", border: "none", color: t.textSub, borderRadius: 999, width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                      <button onClick={() => { const n = new Date(); setBudgetMonth(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`); haptic(); }} title="Jump to current month" style={{ background: "transparent", border: "none", color: t.text, fontSize: 17, fontWeight: 700, cursor: "pointer", padding: "4px 6px" }}>{monthLabel}</button>
                      <button onClick={() => { setBudgetMonth(nextKey); haptic(); }} title={`${nextLabel} →`} style={{ background: "transparent", border: "none", color: t.textSub, borderRadius: 999, width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                    </div>

                    {/* RTA pill — single touch target, colored by sign */}
                    <div style={{
                      background: pillBg, color: rtaPositive ? "#1a2e05" : "#fff",
                      borderRadius: 999, padding: "8px 14px",
                      display: "flex", flexDirection: "column", alignItems: "flex-end",
                      boxShadow: rtaPositive ? "0 4px 14px rgba(132,204,22,0.35)" : "0 4px 14px rgba(239,68,68,0.35)",
                      minWidth: 120,
                    }}>
                      <div style={{ fontSize: 8, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Ready to Assign</div>
                      <div style={{ fontSize: 16, fontWeight: 800, fontFamily: t.mono, lineHeight: 1.15 }}>{rtaPositive ? "" : "-"}{fmt(Math.abs(readyToAssign))}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Copy from previous month — only if this month is empty and previous month has assignments */}
              {!hasAnyAssignmentInThisMonth && hasAnyAssignmentInPrevMonth && (
                <button onClick={() => { app.copyAssignmentsFromMonth(prevKey, budgetMonth); haptic(); }} style={{ width: "100%", padding: "8px 0", borderRadius: 10, border: `1px dashed ${t.accent}40`, background: `${t.accent}08`, color: t.accentLight, fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
                  ↻ Copy assignments from {prevLabel}
                </button>
              )}

              {/* Compact this-month context strip (kept for visibility under the header) */}
              {(() => {
                const monthIncome = (d.entries || []).filter(e => e.type === "income" && (e.dateISO || "").startsWith(budgetMonth)).reduce((s, e) => s + (e.amount || 0), 0);
                const monthAssigned = Object.values(monthMap).reduce((s, c) => s + (c?.assigned || 0), 0);
                const monthSpent = groups.reduce((sum, group) => {
                  const cats = d.nodes.filter(n => n.parentId === group.id && !n.archived);
                  return sum + cats.reduce((s, c) => s + getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth), 0);
                }, 0);
                if (monthIncome === 0 && monthAssigned === 0 && monthSpent === 0) return null;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", marginBottom: 12, background: t.surface, borderRadius: 10, fontSize: 10, color: t.textSub, fontFamily: t.mono }}>
                    <span><span style={{ color: t.inc, fontWeight: 700 }}>↑ {fmt(monthIncome)}</span> income</span>
                    <span style={{ color: t.textDim }}>·</span>
                    <span>{fmt(monthAssigned)} assigned</span>
                    <span style={{ color: t.textDim }}>·</span>
                    <span><span style={{ color: t.exp, fontWeight: 700 }}>↓ {fmt(monthSpent)}</span> spent</span>
                  </div>
                );
              })()}

              {/* Filter chips — All / Overspent / Underfunded / Funded.
                  Lets the user narrow the category list to what needs attention. */}
              {(() => {
                const goalsObj = d.goals || {};
                let overspentCount = 0, underfundedCount = 0, fundedCount = 0;
                groups.forEach(g => {
                  d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => {
                    const av = getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, c.id, budgetMonth);
                    const a = monthMap[c.id]?.assigned || 0;
                    const act = getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth);
                    const goal = goalsObj[c.id];
                    if (av < 0) overspentCount++;
                    else if (goal && getGoalNeeded(goal, a, av - (a - act), budgetMonth) > 0) underfundedCount++;
                    else if (a > 0) fundedCount++;
                  });
                });
                const chips = [
                  { id: "all", label: "All" },
                  overspentCount > 0 && { id: "overspent", label: `${overspentCount} Overspent`, color: "#eab308" },
                  underfundedCount > 0 && { id: "underfunded", label: `${underfundedCount} Underfunded`, color: t.exp },
                  fundedCount > 0 && { id: "funded", label: "Funded", color: t.inc },
                ].filter(Boolean);
                if (chips.length <= 1) return null;
                return (
                  <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", padding: "2px 2px 4px", margin: "0 -2px 14px" }}>
                    {chips.map(chip => {
                      const sel = categoryFilter === chip.id;
                      const tint = chip.color || t.accent;
                      return (
                        <button key={chip.id} onClick={() => { setCategoryFilter(chip.id); haptic(); }} style={{
                          padding: "6px 12px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
                          background: sel ? `${tint}25` : t.surface,
                          border: sel ? `1px solid ${tint}60` : `1px solid ${t.cardBorder}`,
                          color: sel ? tint : t.textSub,
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>{chip.label}</button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Auto-fund summary — only shown when there are underfunded goals */}
              {(() => {
                const goalsObj = d.goals || {};
                // Walk groups in display order so we fund in the same order the user sees
                const orderedCats = [];
                groups.forEach(g => { d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => orderedCats.push(c)); });
                const underfundedRows = orderedCats.map(c => {
                  const goal = goalsObj[c.id];
                  if (!goal) return null;
                  const a = monthMap[c.id]?.assigned || 0;
                  const av = getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, c.id, budgetMonth);
                  const act = getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth);
                  const priorBal = av - (a - act);
                  const need = getGoalNeeded(goal, a, priorBal, budgetMonth);
                  if (need <= 0) return null;
                  return { cat: c, goal, currentAssigned: a, need };
                }).filter(Boolean);
                if (underfundedRows.length === 0) return null;
                const totalNeeded = underfundedRows.reduce((s, r) => s + r.need, 0);
                const canFundAll = readyToAssign >= totalNeeded;
                const willFund = Math.min(readyToAssign, totalNeeded);

                const autoFund = () => {
                  if (readyToAssign <= 0) return;
                  let remaining = readyToAssign;
                  for (const r of underfundedRows) {
                    if (remaining <= 0) break;
                    const give = Math.min(r.need, remaining);
                    if (give > 0) {
                      app.setAssigned(budgetMonth, r.cat.id, r.currentAssigned + give);
                      remaining -= give;
                    }
                  }
                  haptic(15);
                };

                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 14, background: canFundAll ? `${t.accent}10` : `${t.exp}10`, border: `1px solid ${canFundAll ? t.accent + "30" : t.exp + "30"}`, borderRadius: 12 }}>
                    <span style={{ fontSize: 16 }}>🎯</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{underfundedRows.length} goal{underfundedRows.length === 1 ? "" : "s"} underfunded</div>
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>{fmt(totalNeeded)} needed{!canFundAll && readyToAssign > 0 ? ` · ${fmt(willFund)} available to fund` : ""}{readyToAssign <= 0 ? " · no money to assign" : ""}</div>
                    </div>
                    <button onClick={autoFund} disabled={readyToAssign <= 0} style={{ background: readyToAssign <= 0 ? t.cardBorder : t.accent, border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: readyToAssign <= 0 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, opacity: readyToAssign <= 0 ? 0.5 : 1, flexShrink: 0 }}>
                      Auto-fund
                    </button>
                  </div>
                );
              })()}

              {/* YNAB-style toolbar above the category list */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", marginBottom: 8, borderBottom: `1px solid ${t.cardBorder}` }}>
                <button onClick={() => { setActiveTab("budgets"); setTimeout(() => setAddingRoot(true), 200); haptic(); }} title="Add a category group" style={{ background: "transparent", border: "none", color: t.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 6px" }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>＋</span> Category Group
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, paddingRight: 4 }}>
                  <span style={{ width: 60, textAlign: "right" }}>Assigned</span>
                  <span style={{ width: 80, textAlign: "right" }}>Available</span>
                </div>
              </div>

              {/* Category groups */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {groups.map(group => {
                  const categories = d.nodes.filter(n => n.parentId === group.id && !n.archived);
                  const groupAssigned = categories.reduce((s, c) => s + (monthMap[c.id]?.assigned || 0), 0);
                  const groupActivity = categories.reduce((s, c) => s + getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth), 0);
                  const groupAvailable = categories.reduce((s, c) => s + getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, c.id, budgetMonth), 0);
                  const collapsed = collapsedGroups.has(group.id);
                  const toggle = () => { const next = new Set(collapsedGroups); collapsed ? next.delete(group.id) : next.add(group.id); setCollapsedGroups(next); haptic(); };

                  return (
                    <div key={group.id} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
                      {/* Group header — YNAB-style: just chevron + uppercase name, no inline numbers */}
                      <div onClick={renamingNode === group.id ? undefined : toggle} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: renamingNode === group.id ? "default" : "pointer", background: t.surface }}>
                        <span style={{ fontSize: 11, color: t.textMuted, transition: "transform 0.15s", display: "inline-block", transform: collapsed ? "rotate(-90deg)" : "rotate(0)" }}>▾</span>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: group.color || t.accent, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                          {renamingNode === group.id ? (
                            <input
                              autoFocus
                              value={renameDraft}
                              onChange={e => setRenameDraft(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              onBlur={() => { const v = renameDraft.trim(); if (v && v !== group.name) app.updateNode(group.id, { name: v }); setRenamingNode(null); setRenameDraft(""); }}
                              onKeyDown={e => {
                                if (e.key === "Enter") e.target.blur();
                                else if (e.key === "Escape") { setRenamingNode(null); setRenameDraft(""); }
                              }}
                              style={{ flex: 1, minWidth: 0, background: t.inputBg, border: `1px solid ${t.accent}60`, borderRadius: 4, padding: "2px 6px", color: t.text, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", outline: "none" }}
                            />
                          ) : (
                            <>
                              <div style={{ fontSize: 12, fontWeight: 700, color: t.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>{group.name}</div>
                              <span style={{ fontSize: 10, color: t.textMuted }}>{categories.length}</span>
                              <button onClick={e => { e.stopPropagation(); setRenamingNode(group.id); setRenameDraft(group.name); haptic(); }} title="Rename" style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 11, padding: "0 4px", opacity: 0.5 }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}>✎</button>
                            </>
                          )}
                        </div>
                        {/* Subtle group totals — small mono, only when meaningful */}
                        {(groupAssigned > 0 || groupAvailable !== 0) && (
                          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: t.mono, display: "flex", gap: 10 }}>
                            <span style={{ width: 60, textAlign: "right" }}>{fmt(groupAssigned)}</span>
                            <span style={{ width: 80, textAlign: "right", color: groupAvailable < 0 ? t.exp : t.inc, fontWeight: 700 }}>{fmt(groupAvailable)}</span>
                          </div>
                        )}
                      </div>

                      {/* Categories — apply the YNAB-style filter chip if active */}
                      {!collapsed && (() => {
                        const filtered = categories.filter(cat => {
                          if (categoryFilter === "all") return true;
                          const a = monthMap[cat.id]?.assigned || 0;
                          const act = getCategoryActivity(d.nodes, d.entries, cat.id, budgetMonth);
                          const av = getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, cat.id, budgetMonth);
                          const goal = (d.goals || {})[cat.id];
                          if (categoryFilter === "overspent") return av < 0;
                          if (categoryFilter === "underfunded") return av >= 0 && goal && getGoalNeeded(goal, a, av - (a - act), budgetMonth) > 0;
                          if (categoryFilter === "funded") return av >= 0 && a > 0 && (!goal || getGoalNeeded(goal, a, av - (a - act), budgetMonth) <= 0);
                          return true;
                        });
                        return (
                        <div>
                          {filtered.length === 0 && categories.length > 0 ? (
                            <div style={{ padding: "12px 14px", fontSize: 11, color: t.textMuted, textAlign: "center" }}>No categories match the selected filter.</div>
                          ) : filtered.length === 0 ? (
                            <div style={{ padding: "12px 14px", fontSize: 11, color: t.textMuted, textAlign: "center" }}>No categories yet — add one in Categories.</div>
                          ) : filtered.map(cat => {
                            const assigned = monthMap[cat.id]?.assigned || 0;
                            const activity = getCategoryActivity(d.nodes, d.entries, cat.id, budgetMonth);
                            const available = getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, cat.id, budgetMonth);
                            const overspent = available < 0;
                            const fullyFunded = assigned > 0 && activity >= assigned && !overspent;
                            const editing = editingAssigned === cat.id;
                            const pct = assigned > 0 ? Math.min(100, (activity / assigned) * 100) : 0;
                            const goal = (d.goals || {})[cat.id];
                            const goalDesc = describeGoal(goal);
                            // For target-type goals, the rolling balance from PRIOR months counts toward the goal.
                            const availableThroughLastMonth = available - (assigned - activity);
                            const goalNeeded = goal ? getGoalNeeded(goal, assigned, availableThroughLastMonth, budgetMonth) : 0;
                            const goalUnderfunded = goal && goalNeeded > 0;
                            // Pretty "by Xth" suffix for target goals; null for monthly or no goal
                            const goalByDay = (goal && goal.type === "target" && goal.by) ? new Date(goal.by + "T00:00:00").getDate() : null;
                            const goalBySuffix = goalByDay ? ` by the ${goalByDay}${["st","nd","rd"][((goalByDay+90)%100-10)%10-1] || "th"}` : "";

                            // YNAB-style underline: amber for overspent, pinkish-red for underfunded (matches the iPad reference)
                            return (
                              <div key={cat.id} style={{ borderTop: `1px solid ${t.cardBorder}`, borderBottom: overspent ? `2px solid #fbbf24` : (goalUnderfunded ? `2px solid ${t.exp}40` : "none") }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10 }}>
                                  {/* Name + tap-to-drill (rename when in rename mode). Drilling from dashboard pre-applies the displayed month as a filter. */}
                                  <div onClick={renamingNode === cat.id ? undefined : () => { setNodePageMonthFilter(budgetMonth); goTo(cat.id); haptic(); }} style={{ flex: 1, minWidth: 0, cursor: renamingNode === cat.id ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color || t.accent, flexShrink: 0 }} />
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      {renamingNode === cat.id ? (
                                        <input
                                          autoFocus
                                          value={renameDraft}
                                          onChange={e => setRenameDraft(e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          onBlur={() => { const v = renameDraft.trim(); if (v && v !== cat.name) app.updateNode(cat.id, { name: v }); setRenamingNode(null); setRenameDraft(""); }}
                                          onKeyDown={e => {
                                            if (e.key === "Enter") e.target.blur();
                                            else if (e.key === "Escape") { setRenamingNode(null); setRenameDraft(""); }
                                          }}
                                          style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.accent}60`, borderRadius: 4, padding: "2px 6px", color: t.text, fontSize: 13, fontWeight: 500, outline: "none" }}
                                        />
                                      ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                          <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{cat.name}</div>
                                          <button onClick={e => { e.stopPropagation(); setRenamingNode(cat.id); setRenameDraft(cat.name); haptic(); }} title="Rename" style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 11, padding: "0 2px", opacity: 0.4, flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}>✎</button>
                                        </div>
                                      )}
                                      {/* YNAB-style sub-info: overspent warning OR goal-needed text OR activity/assigned context */}
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                                        {overspent && (
                                          <span style={{ fontSize: 10, color: t.exp, fontWeight: 600 }}>Overspent: {fmt(Math.abs(available))}</span>
                                        )}
                                        {!overspent && goalUnderfunded && (
                                          <span style={{ fontSize: 10, color: t.exp, fontWeight: 600 }}>{fmt(goalNeeded)} more needed{goalBySuffix}</span>
                                        )}
                                        {!overspent && !goalUnderfunded && (activity > 0 || assigned > 0) && (
                                          <span style={{ fontSize: 9, color: t.textMuted, fontFamily: t.mono }}>{fmt(activity)} of {fmt(assigned)}</span>
                                        )}
                                        {goal && (
                                          <button onClick={(ev) => { ev.stopPropagation(); setGoalEditor({ categoryId: cat.id }); setGoalDraft({ type: goal.type, amount: String(goal.amount || ""), by: goal.by || "" }); haptic(); }} style={{ background: t.surfaceHover, border: `1px solid ${t.cardBorder}`, borderRadius: 4, padding: "1px 5px", fontSize: 9, color: t.textSub, cursor: "pointer", fontFamily: t.mono, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
                                            🎯 {goalDesc}
                                          </button>
                                        )}
                                        {!goal && (
                                          <button onClick={(ev) => { ev.stopPropagation(); setGoalEditor({ categoryId: cat.id }); setGoalDraft({ type: "monthly", amount: "", by: "" }); haptic(); }} style={{ background: "transparent", border: `1px dashed ${t.cardBorder}`, borderRadius: 4, padding: "1px 5px", fontSize: 9, color: t.textMuted, cursor: "pointer", fontWeight: 500 }}>
                                            + Goal
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Assigned (editable) */}
                                  <div style={{ width: 70, textAlign: "right" }}>
                                    {editing ? (
                                      <input
                                        autoFocus
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        value={assignedDraft}
                                        onChange={e => setAssignedDraft(e.target.value)}
                                        onBlur={() => commitAssigned(cat.id)}
                                        onKeyDown={e => {
                                          if (e.key === "Enter") { e.target.blur(); }
                                          else if (e.key === "Escape") { setEditingAssigned(null); setAssignedDraft(""); }
                                        }}
                                        style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.accent}60`, borderRadius: 6, padding: "4px 6px", color: t.text, fontSize: 13, fontFamily: t.mono, textAlign: "right", outline: "none" }}
                                      />
                                    ) : (
                                      <button onClick={() => { setEditingAssigned(cat.id); setAssignedDraft(assigned ? String(assigned) : ""); haptic(); }} style={{ background: assigned > 0 ? "rgba(255,255,255,0.04)" : "transparent", border: `1px dashed ${assigned > 0 ? "transparent" : t.cardBorder}`, borderRadius: 6, padding: "4px 6px", color: assigned > 0 ? t.text : t.textMuted, fontSize: 13, fontFamily: t.mono, cursor: "pointer", width: "100%", textAlign: "right" }}>
                                        {assigned > 0 ? fmt(assigned) : "—"}
                                      </button>
                                    )}
                                  </div>

                                  {/* Available — YNAB-style colored pill. Yellow = overspent, green = positive, neutral = zero. Tap to move money (auto-suggests source when overspent). */}
                                  {(() => {
                                    // YNAB color rules: overspent → yellow pill (with red text), funded > $0 → green pill, $0 → neutral
                                    const isZero = Math.abs(available) < 0.005;
                                    const pillBg = overspent ? "#fef3c7" : (isZero ? "rgba(255,255,255,0.04)" : "#dcfce7");
                                    const pillBorder = overspent ? "#fbbf24" : (isZero ? t.cardBorder : "#86efac");
                                    const pillText = overspent ? "#b45309" : (isZero ? t.textSub : "#15803d");
                                    return (
                                      <button onClick={() => {
                                        setMoveMoney({ dstId: cat.id });
                                        setMoveAmount(overspent ? String(Math.abs(available).toFixed(2)) : "");
                                        if (overspent) {
                                          const allCats = [];
                                          groups.forEach(g => { d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => allCats.push(c)); });
                                          const candidates = allCats
                                            .filter(c => c.id !== cat.id)
                                            .map(c => ({ id: c.id, av: getCategoryAvailable(d.nodes, d.entries, budgetMonthsObj, c.id, budgetMonth) }))
                                            .filter(s => s.av > 0)
                                            .sort((a, b) => b.av - a.av);
                                          setMoveSourceId(candidates.length > 0 ? candidates[0].id : "");
                                        } else {
                                          setMoveSourceId("");
                                        }
                                        haptic();
                                      }} style={{ width: 88, background: pillBg, border: `1px solid ${pillBorder}`, borderRadius: 999, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                                        {overspent && <span style={{ fontSize: 10, lineHeight: 1, color: pillText }}>⚠</span>}
                                        <div style={{ fontSize: 12, fontWeight: 700, color: pillText, fontFamily: t.mono, lineHeight: 1.2 }}>
                                          {overspent ? "" : isZero ? "" : ""}{fmt(Math.abs(available))}
                                        </div>
                                      </button>
                                    );
                                  })()}
                                </div>

                                {/* Quick-assign presets — only while editing this row's assigned input */}
                                {editing && (() => {
                                  const lastMo = (budgetMonthsObj[prevKey] || {})[cat.id]?.assigned;
                                  // Average of last 3 calendar months' activity (excluding current)
                                  let avg3Total = 0;
                                  for (let i = 1; i <= 3; i++) {
                                    const dt = new Date(yearN, monthN - i, 1);
                                    const k = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
                                    avg3Total += getCategoryActivity(d.nodes, d.entries, cat.id, k);
                                  }
                                  const avg3 = avg3Total / 3;
                                  const presets = [
                                    goal && goalNeeded > 0 && { label: "Apply goal", value: assigned + goalNeeded },
                                    lastMo != null && lastMo > 0 && { label: "Last month", value: lastMo },
                                    activity > 0 && { label: "Spent so far", value: activity },
                                    avg3 > 0 && { label: "Avg 3mo", value: Math.round(avg3 * 100) / 100 },
                                  ].filter(Boolean);
                                  if (presets.length === 0) return null;
                                  return (
                                    // onMouseDown intercept so blur doesn't fire on the input before the chip click registers
                                    <div onMouseDown={ev => ev.preventDefault()} style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 14px 10px 30px", animation: "fadeIn 0.15s ease" }}>
                                      {presets.map(p => (
                                        <button key={p.label} onClick={() => { setAssignedDraft(String(p.value)); haptic(); }} style={{ background: `${t.accent}15`, border: `1px solid ${t.accent}30`, color: t.accentLight, borderRadius: 12, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                                          {p.label}
                                          <span style={{ fontFamily: t.mono, opacity: 0.85 }}>{fmt(p.value)}</span>
                                        </button>
                                      ))}
                                    </div>
                                  );
                                })()}

                                {/* Progress bar (when assigned > 0) */}
                                {assigned > 0 && (
                                  <div style={{ height: 2, background: t.surfaceHover, marginLeft: 30, marginRight: 14, marginBottom: 8 }}>
                                    <div style={{ height: "100%", width: `${pct}%`, background: overspent ? t.exp : pct >= 100 ? t.textMuted : cat.color || t.accent, transition: "width 0.4s ease" }} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* (Column legend lives at the top toolbar now) */}

              {/* Spending by Category — top categories for the displayed month, sorted descending */}
              {(() => {
                const allCats = [];
                groups.forEach(g => { d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => allCats.push(c)); });
                const rows = allCats
                  .map(c => ({ cat: c, spent: getCategoryActivity(d.nodes, d.entries, c.id, budgetMonth) }))
                  .filter(r => r.spent > 0)
                  .sort((a, b) => b.spent - a.spent);
                if (rows.length === 0) return null;
                const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
                const top = rows.slice(0, 6);
                const max = top[0].spent || 1;
                const monthShort = monthDate.toLocaleDateString("en-US", { month: "short" });

                return (
                  <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Spending — {monthShort}</div>
                      <div style={{ fontSize: 10, color: t.textMuted, fontFamily: t.mono }}>Total {fmt(totalSpent)}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {top.map(r => {
                        const pct = (r.spent / max) * 100;
                        const sharePct = totalSpent > 0 ? Math.round((r.spent / totalSpent) * 100) : 0;
                        return (
                          <div key={r.cat.id} onClick={() => { setNodePageMonthFilter(budgetMonth); goTo(r.cat.id); haptic(); }} style={{ cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.cat.color || t.accent, flexShrink: 0 }} />
                                <div style={{ fontSize: 11, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.cat.name}</div>
                                <span style={{ fontSize: 9, color: t.textMuted, flexShrink: 0 }}>{sharePct}%</span>
                              </div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: t.mono, flexShrink: 0 }}>{fmt(r.spent)}</div>
                            </div>
                            <div style={{ height: 4, background: t.surfaceHover, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: r.cat.color || t.accent, opacity: 0.8, transition: "width 0.4s ease" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {rows.length > 6 && (
                      <div style={{ marginTop: 8, fontSize: 10, color: t.textMuted, textAlign: "center" }}>
                        + {rows.length - 6} more · {fmt(rows.slice(6).reduce((s, r) => s + r.spent, 0))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          );
        })()}

        {/* Insights — kept (pairs well with budget view) */}
        {(() => {
          const insights = generateInsights();
          if (insights.length === 0) return null;
          const colors = { warning: "#f59e0b", alert: "#ef4444", positive: "#22c55e", suggestion: t.accent };
          return (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8, paddingLeft: 2 }}>Insights</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {insights.map((ins, i) => (
                  <div key={i} onClick={() => { if (ins.action) { setShowAdvisor(true); setAdvisorTab("chat"); setAdvisorInput(ins.action); haptic(); } }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: `${colors[ins.type]}08`, border: `1px solid ${colors[ins.type]}20`, borderRadius: 10, cursor: ins.action ? "pointer" : "default", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = `${colors[ins.type]}15`}
                    onMouseLeave={e => e.currentTarget.style.background = `${colors[ins.type]}08`}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{ins.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{ins.title}</div>
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>{ins.sub}</div>
                    </div>
                    {ins.action && <span style={{ fontSize: 12, color: colors[ins.type], opacity: 0.6, flexShrink: 0 }}>Ask AI ›</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Compact tile strip — Bills, Net Worth, AI Advisor, Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "📅", label: "Bills", color: "#a5b4fc", bg: "linear-gradient(135deg, #1e1b4b, #312e81)", action: () => setShowBillCalendar(true) },
            { icon: "💎", label: "Net Worth", color: "#d6d3d1", bg: "linear-gradient(135deg, #1c1917, #44403c)", action: () => setShowNetWorth(true) },
            { icon: "🤖", label: "AI Advisor", color: "#a7f3d0", bg: "linear-gradient(135deg, #042f2e, #065f46)", action: () => setShowAdvisor(true) },
            { icon: "📈", label: "Charts", color: "#f0abfc", bg: "linear-gradient(135deg, #3b0764, #581c87)", action: () => setActiveTab("charts") },
          ].map(tile => (
            <button key={tile.label} onClick={() => { tile.action(); haptic(); }} style={{ background: tile.bg, border: "none", borderRadius: 12, padding: "12px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tile.color, transition: "transform 0.15s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <span style={{ fontSize: 20 }}>{tile.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{tile.label}</span>
            </button>
          ))}
        </div>
        </>
        )}

        {/* Spacer for bottom nav */}
        <div style={{ flex: 1 }} />

        {/* Floating + button — quick-add a transaction without drilling into a category */}
        {!quickAdd && !goalEditor && !moveMoney && allRoots.filter(n => !n.archived).length > 0 && (
          <button
            onClick={() => {
              const today = new Date();
              const iso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
              // Default to first category and first account if they exist
              const firstGroup = allRoots.find(n => !n.archived);
              const firstCat = firstGroup ? d.nodes.find(n => n.parentId === firstGroup.id && !n.archived) : null;
              const firstAcct = (d.accounts || []).find(a => !a.archived);
              setQaDraft({ type: "expense", categoryId: firstCat?.id || "", accountId: firstAcct?.id || "", amount: "", label: "", dateISO: iso });
              setQuickAdd(true);
              haptic();
            }}
            style={{
              position: "fixed", right: 20, bottom: "calc(78px + env(safe-area-inset-bottom, 0px))",
              width: 56, height: 56, borderRadius: 28,
              background: t.accent, color: "#fff", border: "none",
              fontSize: 28, fontWeight: 300, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 6px 16px ${t.accent}50, 0 2px 4px rgba(0,0,0,0.3)`,
              zIndex: 99,
              transition: "transform 0.15s",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            title="Add a transaction"
          >＋</button>
        )}

        {/* Quick-add transaction sheet */}
        {quickAdd && (() => {
          const close = () => { setQuickAdd(null); };
          const amtNum = parseFloat(qaDraft.amount) || 0;
          const accts = (d.accounts || []).filter(a => !a.archived);
          const valid = amtNum > 0 && qaDraft.categoryId && qaDraft.dateISO && (accts.length === 0 || qaDraft.accountId);
          // Build flat category list (group › category) for the picker
          const cats = (() => {
            const out = [];
            allRoots.filter(n => !n.archived).forEach(g => {
              d.nodes.filter(n => n.parentId === g.id && !n.archived).forEach(c => out.push({ id: c.id, label: c.name, group: g.name, color: c.color }));
            });
            return out;
          })();
          const submit = () => {
            if (!valid) return;
            const dateStr = (() => {
              const dt = new Date(qaDraft.dateISO + "T00:00:00");
              return isNaN(dt) ? qaDraft.dateISO : fmtDate(qaDraft.dateISO);
            })();
            const category = qaDraft.type === "income" ? "income" : "other";
            app.addEntry({
              id: uid(),
              nodeId: qaDraft.categoryId,
              accountId: qaDraft.accountId || null,
              label: qaDraft.label.trim(),
              amount: amtNum,
              category,
              type: qaDraft.type,
              date: dateStr,
              dateISO: qaDraft.dateISO,
              paid: true,
              cleared: true,
            });
            haptic(15);
            close();
          };
          return (
            <>
              <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
              <div style={{
                position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
                width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto",
                background: t.bg, borderTop: `1px solid ${t.cardBorder}`,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
                zIndex: 201, animation: "slideIn 0.2s ease",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              }}>
                <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Quick add</div>
                  <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                </div>

                {/* Type toggle */}
                <div style={{ display: "flex", gap: 6, marginBottom: 14, background: t.surface, padding: 4, borderRadius: 10, border: `1px solid ${t.cardBorder}` }}>
                  {[
                    { id: "expense", label: "Expense", color: t.exp },
                    { id: "income", label: "Income", color: t.inc },
                  ].map(opt => {
                    const sel = qaDraft.type === opt.id;
                    return (
                      <button key={opt.id} onClick={() => { setQaDraft({ ...qaDraft, type: opt.id }); haptic(); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: sel ? `${opt.color}25` : "transparent", color: sel ? opt.color : t.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Amount */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 18, fontWeight: 600 }}>$</span>
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={qaDraft.amount}
                      onChange={e => setQaDraft({ ...qaDraft, amount: e.target.value })}
                      placeholder="0.00"
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "14px 14px 14px 30px", color: t.text, fontSize: 22, fontWeight: 700, fontFamily: t.mono, outline: "none", textAlign: "right" }}
                    />
                  </div>
                </div>

                {/* Label */}
                <input
                  value={qaDraft.label}
                  onChange={e => setQaDraft({ ...qaDraft, label: e.target.value })}
                  placeholder="What for? (optional)"
                  style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none", marginBottom: 12 }}
                />

                {/* Category picker */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Category</div>
                  {cats.length === 0 ? (
                    <div style={{ background: `${t.exp}10`, border: `1px solid ${t.exp}30`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: t.textSub }}>
                      No categories yet. Create one in the Categories tab first.
                    </div>
                  ) : (
                    <select
                      value={qaDraft.categoryId}
                      onChange={e => setQaDraft({ ...qaDraft, categoryId: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}
                    >
                      {cats.map(c => <option key={c.id} value={c.id}>{c.group} › {c.label}</option>)}
                    </select>
                  )}
                </div>

                {/* Account picker */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Account</div>
                  {accts.length === 0 ? (
                    <div style={{ background: `${t.accent}08`, border: `1px dashed ${t.accent}30`, borderRadius: 10, padding: "12px 14px", fontSize: 11, color: t.textSub }}>
                      No accounts yet — add one in the Accounts tab to track where your money lives. (You can still log this transaction; it'll be unassigned.)
                    </div>
                  ) : (
                    <select
                      value={qaDraft.accountId}
                      onChange={e => setQaDraft({ ...qaDraft, accountId: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}
                    >
                      {accts.map(a => { const ti = ACCOUNT_TYPES.find(at => at.id === a.type) || ACCOUNT_TYPES[0]; return <option key={a.id} value={a.id}>{ti.icon} {a.name}</option>; })}
                    </select>
                  )}
                </div>

                {/* Date */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Date</div>
                  <input
                    type="date"
                    value={qaDraft.dateISO}
                    onChange={e => setQaDraft({ ...qaDraft, dateISO: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={close} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={submit} disabled={!valid} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: valid ? t.accent : t.cardBorder, color: "#fff", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.5 }}>
                    Add {qaDraft.type === "income" ? "income" : "expense"}{amtNum > 0 ? ` · ${fmt(amtNum)}` : ""}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* Goal editor sheet — set/edit/remove a per-category goal */}
        {goalEditor && (() => {
          const cat = d.nodes.find(n => n.id === goalEditor.categoryId);
          if (!cat) return null;
          const existingGoal = (d.goals || {})[cat.id];
          const close = () => { setGoalEditor(null); setGoalDraft({ type: "monthly", amount: "", by: "" }); };
          const amtNum = parseFloat(goalDraft.amount) || 0;
          const valid = amtNum > 0 && (goalDraft.type === "monthly" || (goalDraft.type === "target" && goalDraft.by));
          const save = () => {
            if (!valid) return;
            const goal = { type: goalDraft.type, amount: amtNum };
            if (goalDraft.type === "target") goal.by = goalDraft.by;
            app.setGoal(cat.id, goal);
            haptic();
            close();
          };
          const remove = () => { app.setGoal(cat.id, null); haptic(15); close(); };

          return (
            <>
              <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
              <div style={{
                position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
                width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto",
                background: t.bg, borderTop: `1px solid ${t.cardBorder}`,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
                zIndex: 201, animation: "slideIn 0.2s ease",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              }}>
                <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{existingGoal ? "Edit goal" : "Set a goal for"}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginTop: 2 }}>🎯 {cat.name}</div>
                  </div>
                  <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                </div>

                {/* Goal type picker */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Goal type</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { id: "monthly", label: "Monthly", sub: "Assign every month" },
                      { id: "target", label: "Target", sub: "Reach by date" },
                    ].map(opt => {
                      const selected = goalDraft.type === opt.id;
                      return (
                        <button key={opt.id} onClick={() => { setGoalDraft({ ...goalDraft, type: opt.id }); haptic(); }} style={{
                          flex: 1, padding: "10px 8px", borderRadius: 10,
                          background: selected ? `${t.accent}18` : "rgba(255,255,255,0.02)",
                          border: selected ? `1px solid ${t.accent}50` : `1px solid ${t.cardBorder}`,
                          cursor: "pointer", textAlign: "center",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: selected ? t.accentLight : t.text }}>{opt.label}</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>
                    {goalDraft.type === "monthly" ? "Assign every month" : "Target balance"}
                  </div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 18, fontWeight: 600 }}>$</span>
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={goalDraft.amount}
                      onChange={e => setGoalDraft({ ...goalDraft, amount: e.target.value })}
                      placeholder="0.00"
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "14px 14px 14px 30px", color: t.text, fontSize: 22, fontWeight: 700, fontFamily: t.mono, outline: "none", textAlign: "right" }}
                    />
                  </div>
                </div>

                {/* Date (only for target type) */}
                {goalDraft.type === "target" && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>By date</div>
                    <input
                      type="date"
                      value={goalDraft.by}
                      onChange={e => setGoalDraft({ ...goalDraft, by: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none" }}
                    />
                    {goalDraft.by && amtNum > 0 && (() => {
                      const [cy, cm] = budgetMonth.split("-").map(Number);
                      const tgtMonth = goalDraft.by.slice(0, 7);
                      const [ty, tm] = tgtMonth.split("-").map(Number);
                      const monthsRem = (ty - cy) * 12 + (tm - cm) + 1;
                      if (monthsRem <= 0) return <div style={{ fontSize: 10, color: t.exp, marginTop: 6 }}>⚠ Date is in the past — full amount needed this month</div>;
                      const perMonth = amtNum / monthsRem;
                      return <div style={{ fontSize: 10, color: t.textMuted, marginTop: 6 }}>≈ {fmt(perMonth)}/month for {monthsRem} month{monthsRem === 1 ? "" : "s"}</div>;
                    })()}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {existingGoal && <button onClick={remove} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${t.exp}30`, background: `${t.exp}10`, color: t.exp, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Remove</button>}
                  <button onClick={close} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={save} disabled={!valid} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: valid ? t.accent : t.cardBorder, color: "#fff", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.5 }}>
                    {existingGoal ? "Update goal" : "Save goal"}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* Move Money sheet — modal overlay. Lets user reallocate assigned $ between categories in the current month. */}
        {moveMoney && (() => {
          const dst = d.nodes.find(n => n.id === moveMoney.dstId);
          if (!dst) return null;
          const dstParent = d.nodes.find(n => n.id === dst.parentId);
          const dstAvailable = getCategoryAvailable(d.nodes, d.entries, d.budgetMonths || {}, dst.id, budgetMonth);
          const monthMap = (d.budgetMonths || {})[budgetMonth] || {};

          // Eligible sources: every other non-archived category (child of a root) with available > 0
          const allCategories = d.nodes.filter(n => n.parentId && !n.archived && d.nodes.find(p => p.id === n.parentId && p.parentId === null));
          const sources = allCategories
            .filter(c => c.id !== dst.id)
            .map(c => ({ cat: c, available: getCategoryAvailable(d.nodes, d.entries, d.budgetMonths || {}, c.id, budgetMonth), parent: d.nodes.find(p => p.id === c.parentId) }))
            .filter(s => s.available > 0)
            .sort((a, b) => b.available - a.available);

          const close = () => { setMoveMoney(null); setMoveAmount(""); setMoveSourceId(""); };
          const amountNum = parseFloat(moveAmount) || 0;
          const selectedSrc = sources.find(s => s.cat.id === moveSourceId);
          const canSubmit = selectedSrc && amountNum > 0;

          const submit = () => {
            if (!canSubmit) return;
            const srcCurrentAssigned = monthMap[selectedSrc.cat.id]?.assigned || 0;
            const dstCurrentAssigned = monthMap[dst.id]?.assigned || 0;
            // Move = subtract from src.assigned, add to dst.assigned, in this month only.
            // Negative resulting assignments are allowed (YNAB's behavior — represents pulling from prior-month surplus).
            app.setAssigned(budgetMonth, selectedSrc.cat.id, srcCurrentAssigned - amountNum);
            app.setAssigned(budgetMonth, dst.id, dstCurrentAssigned + amountNum);
            haptic(15);
            close();
          };

          return (
            <>
              {/* Backdrop */}
              <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, animation: "fadeIn 0.15s ease" }} />
              {/* Sheet */}
              <div style={{
                position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
                width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto",
                background: t.bg, borderTop: `1px solid ${t.cardBorder}`,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px))",
                zIndex: 201, animation: "slideIn 0.2s ease",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              }}>
                {/* Drag handle */}
                <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 2, margin: "0 auto 12px" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Move money to</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginTop: 2 }}>{dst.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>
                      {dstParent ? `${dstParent.name} · ` : ""}Available: <span style={{ color: dstAvailable < 0 ? t.exp : t.inc, fontFamily: t.mono, fontWeight: 600 }}>{dstAvailable < 0 ? "-" : ""}{fmt(Math.abs(dstAvailable))}</span>
                    </div>
                  </div>
                  <button onClick={close} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
                </div>

                {/* Amount input */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>Amount</div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 18, fontWeight: 600 }}>$</span>
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={moveAmount}
                      onChange={e => setMoveAmount(e.target.value)}
                      placeholder="0.00"
                      style={{ width: "100%", boxSizing: "border-box", background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "14px 14px 14px 30px", color: t.text, fontSize: 22, fontWeight: 700, fontFamily: t.mono, outline: "none", textAlign: "right" }}
                    />
                  </div>
                </div>

                {/* Source picker */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>From</div>
                  {sources.length === 0 ? (
                    <div style={{ background: `${t.exp}10`, border: `1px solid ${t.exp}30`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: t.textSub }}>
                      No category has any available money to move. Increase Ready-to-Assign by adding income, or reduce another category's assignment first.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto" }}>
                      {sources.map((s, i) => {
                        const selected = moveSourceId === s.cat.id;
                        // First source (i === 0) is the auto-suggested one (sources are pre-sorted by available desc)
                        const suggested = i === 0 && sources.length > 1;
                        return (
                          <button key={s.cat.id} onClick={() => { setMoveSourceId(s.cat.id); if (!moveAmount) setMoveAmount(String(Math.min(s.available, amountNum > 0 ? amountNum : s.available).toFixed(2))); haptic(); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                              background: selected ? `${t.accent}18` : "rgba(255,255,255,0.02)",
                              border: selected ? `1px solid ${t.accent}50` : `1px solid ${t.cardBorder}`,
                              borderRadius: 10, cursor: "pointer", textAlign: "left",
                            }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.cat.color || t.accent, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.cat.name}</div>
                                {suggested && <span style={{ fontSize: 8, color: t.accent, background: `${t.accent}20`, border: `1px solid ${t.accent}40`, borderRadius: 3, padding: "1px 5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>Suggested</span>}
                              </div>
                              <div style={{ fontSize: 10, color: t.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.parent?.name || ""}</div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.inc, fontFamily: t.mono, flexShrink: 0 }}>{fmt(s.available)}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Warning if amount > source available */}
                {selectedSrc && amountNum > selectedSrc.available && (
                  <div style={{ background: `${t.exp}10`, border: `1px solid ${t.exp}30`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: t.exp, marginBottom: 12 }}>
                    ⚠ Pulling more than {selectedSrc.cat.name} has — it will go to {fmt(selectedSrc.available - amountNum)}.
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={close} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={submit} disabled={!canSubmit} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: canSubmit ? t.accent : t.cardBorder, color: "#fff", fontSize: 13, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.5 }}>
                    Move {amountNum > 0 ? fmt(amountNum) : ""}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* Bottom navigation */}
        {bottomNav}
      </div>
    );
  }

}