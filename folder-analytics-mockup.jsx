import { useState } from "react";

const T = {
  bg: "#0a0a1a", card: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)",
  text: "#e2e8f0", textSub: "#94a3b8", textMuted: "#64748b", textDim: "#475569",
  inc: "#22c55e", exp: "#ef4444", accent: "#6366f1", accentLight: "#818cf8",
  warn: "#f59e0b", info: "#06b6d4",
  inputBg: "rgba(255,255,255,0.04)", inputBorder: "rgba(255,255,255,0.08)",
  mono: "'SF Mono', 'Fira Code', monospace", row: "rgba(255,255,255,0.02)",
  surface: "rgba(255,255,255,0.03)",
};

const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`;

// ── Mock Data ──
const months = [
  { name: "Jan", inc: 3800, exp: 3200 },
  { name: "Feb", inc: 3800, exp: 2900 },
  { name: "Mar", inc: 4100, exp: 3600 },
  { name: "Apr", inc: 3800, exp: 2400 },
];

const categoryData = [
  { id: "housing", label: "Housing", icon: "\u{1F3E0}", color: "#f59e0b", amount: 4800 },
  { id: "food", label: "Food", icon: "\u{1F355}", color: "#ef4444", amount: 3200 },
  { id: "transport", label: "Transport", icon: "\u{1F697}", color: "#3b82f6", amount: 1800 },
  { id: "giving", label: "Giving", icon: "\u{1F381}", color: "#f472b6", amount: 1125 },
  { id: "utilities", label: "Utilities", icon: "\u26A1", color: "#8b5cf6", amount: 960 },
  { id: "entertainment", label: "Fun", icon: "\u{1F3AE}", color: "#ec4899", amount: 680 },
  { id: "other", label: "Other", icon: "\u{1F4CB}", color: "#f97316", amount: 435 },
];

const incomeSourceData = [
  { id: "salary", label: "Salary", icon: "\u{1F4BC}", color: "#22c55e", amount: 12800 },
  { id: "freelance", label: "Freelance", icon: "\u{1F4BB}", color: "#06b6d4", amount: 1900 },
  { id: "gifts", label: "Gifts", icon: "\u{1F381}", color: "#f472b6", amount: 600 },
  { id: "other", label: "Other", icon: "\u{1F4CB}", color: "#f97316", amount: 200 },
];

// Budget vs Actual mock (envelope caps vs real spending)
const budgetVsActualData = [
  { cat: "Housing", icon: "\u{1F3E0}", cap: 1400, actual: 1200, color: "#f59e0b" },
  { cat: "Food", icon: "\u{1F355}", cap: 900, actual: 960, color: "#ef4444" },
  { cat: "Transport", icon: "\u{1F697}", cap: 500, actual: 450, color: "#3b82f6" },
  { cat: "Giving", icon: "\u{1F381}", cap: 400, actual: 375, color: "#f472b6" },
  { cat: "Utilities", icon: "\u26A1", cap: 300, actual: 240, color: "#8b5cf6" },
  { cat: "Fun", icon: "\u{1F3AE}", cap: 200, actual: 280, color: "#ec4899" },
];

// Cumulative spend per day-of-month for 3 months
const cumulativeSpendData = {
  months: ["Feb", "Mar", "Apr"],
  colors: ["#64748b", "#8b5cf6", "#6366f1"],
  series: [
    [400, 900, 1100, 1500, 1700, 1900, 2050, 2200, 2400, 2550, 2700, 2900],
    [350, 800, 1200, 1550, 1700, 2000, 2250, 2500, 2800, 3000, 3300, 3600],
    [200, 500, 700, 900, 1100, 1300, 1500, 1700, 1900, 2050, 2200, 2400],
  ],
};

// Top expenses
const topExpenses = [
  { label: "Rent", amount: 1200, cat: "Housing", icon: "\u{1F3E0}", color: "#f59e0b" },
  { label: "Groceries (Costco)", amount: 340, cat: "Food", icon: "\u{1F355}", color: "#ef4444" },
  { label: "Car Payment", amount: 320, cat: "Transport", icon: "\u{1F697}", color: "#3b82f6" },
  { label: "Church Tithe", amount: 300, cat: "Giving", icon: "\u{1F381}", color: "#f472b6" },
  { label: "Electric Bill", amount: 185, cat: "Utilities", icon: "\u26A1", color: "#8b5cf6" },
  { label: "Date Night", amount: 125, cat: "Fun", icon: "\u{1F3AE}", color: "#ec4899" },
  { label: "Gas", amount: 110, cat: "Transport", icon: "\u{1F697}", color: "#3b82f6" },
];

// Savings waterfall
const waterfallData = [
  { label: "Income", amount: 3800, type: "income" },
  { label: "Housing", amount: -1200, type: "expense" },
  { label: "Food", amount: -800, type: "expense" },
  { label: "Transport", amount: -450, type: "expense" },
  { label: "Giving", amount: -375, type: "expense" },
  { label: "Utilities", amount: -240, type: "expense" },
  { label: "Fun", amount: -280, type: "expense" },
  { label: "Other", amount: -55, type: "expense" },
];

// Envelope health across months
const envelopeHealthData = [
  { cat: "Housing", months: [85, 92, 78, 86] },
  { cat: "Food", months: [95, 88, 107, 72] },
  { cat: "Transport", months: [70, 90, 88, 65] },
  { cat: "Giving", months: [100, 94, 98, 80] },
  { cat: "Utilities", months: [65, 80, 72, 55] },
  { cat: "Fun", months: [110, 130, 140, 95] },
];

// Recurring vs one-time
const recurringData = { recurring: 2445, oneTime: 1155 };

// Spending by member
const memberData = [
  { name: "Michael", amount: 2100, color: "#6366f1" },
  { name: "Wife", amount: 1500, color: "#ec4899" },
];

const childBudgets = [
  { name: "January 2026", color: "#6366f1", balance: 600 },
  { name: "February 2026", color: "#6366f1", balance: 900 },
  { name: "March 2026", color: "#6366f1", balance: 500 },
  { name: "April 2026", color: "#6366f1", balance: 1400 },
];


// ============================================================
// CHART COMPONENTS
// ============================================================

// 1. Monthly Trends (bar chart)
function MonthlyTrends({ data }) {
  const maxVal = Math.max(...data.flatMap(m => [m.inc, m.exp]));
  return (
    <div style={chartCard}>
      <ChartTitle>Monthly Trends</ChartTitle>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <LegendDot color={T.inc} label="Income" />
        <LegendDot color={T.exp} label="Expenses" />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
        {data.map((m, i) => {
          const incH = (m.inc / maxVal) * 100;
          const expH = (m.exp / maxVal) * 100;
          const net = m.inc - m.exp;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 90, width: "100%" }}>
                <div style={{ flex: 1, height: `${incH}%`, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${T.inc}cc, ${T.inc}40)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: -16, width: "100%", textAlign: "center", fontSize: 8, color: T.textDim, fontFamily: T.mono }}>{fmtK(m.inc)}</div>
                </div>
                <div style={{ flex: 1, height: `${expH}%`, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${T.exp}cc, ${T.exp}40)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: -16, width: "100%", textAlign: "center", fontSize: 8, color: T.textDim, fontFamily: T.mono }}>{fmtK(m.exp)}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 9, fontFamily: T.mono, color: net >= 0 ? T.inc : T.exp, fontWeight: 600 }}>
                {net >= 0 ? "+" : ""}{fmtK(net)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Year in Review (sparkline)
function YearInReview({ data }) {
  let cumulative = 0;
  const points = data.map(m => { cumulative += (m.inc - m.exp); return cumulative; });
  const maxP = Math.max(...points, 0);
  const minP = Math.min(...points, 0);
  const range = maxP - minP || 1;
  const totalInc = data.reduce((s, m) => s + m.inc, 0);
  const totalExp = data.reduce((s, m) => s + m.exp, 0);
  const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100).toFixed(1) : "0.0";
  const w = 280, h = 60, pad = 4;
  const step = (w - pad * 2) / (points.length - 1 || 1);
  const pathPoints = points.map((p, i) => `${pad + i * step},${h - pad - ((p - minP) / range) * (h - pad * 2)}`);
  const linePath = `M ${pathPoints.join(" L ")}`;
  const areaPath = `${linePath} L ${pad + (points.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <div style={chartCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <ChartTitle style={{ marginBottom: 0 }}>Year in Review</ChartTitle>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase" }}>Net</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.mono, color: cumulative >= 0 ? T.inc : T.exp }}>
              {cumulative >= 0 ? "+" : ""}{fmt(cumulative)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase" }}>Savings</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.mono, color: T.accentLight }}>{savingsRate}%</div>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.inc} stopOpacity="0.3" />
            <stop offset="100%" stopColor={T.inc} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {minP < 0 && <line x1={pad} y1={h - pad - ((0 - minP) / range) * (h - pad * 2)} x2={w - pad} y2={h - pad - ((0 - minP) / range) * (h - pad * 2)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke={T.inc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={i} cx={pad + i * step} cy={h - pad - ((p - minP) / range) * (h - pad * 2)} r="3.5" fill={T.inc} stroke="#0a0a1a" strokeWidth="1.5" />)}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 4px 0" }}>
        {data.map((m, i) => <span key={i} style={{ fontSize: 9, color: T.textDim, fontFamily: T.mono }}>{m.name}</span>)}
      </div>
    </div>
  );
}

// 3. Category Breakdown (donut)
function CategoryBreakdown({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const cx = 60, cy = 60, r = 46, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let cumulativeOffset = 0;

  return (
    <div style={chartCard}>
      <ChartTitle>Category Breakdown</ChartTitle>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
            {data.map((d, i) => {
              const pct = d.amount / total;
              const dashLen = pct * circumference;
              const gap = circumference - dashLen;
              const offset = cumulativeOffset;
              cumulativeOffset += dashLen;
              return (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color}
                  strokeWidth={hoveredIdx === i ? strokeW + 4 : strokeW}
                  strokeDasharray={`${dashLen} ${gap}`} strokeDashoffset={-offset}
                  style={{ transition: "stroke-width 0.2s ease", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
              );
            })}
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.mono, color: T.text }}>${(total / 1000).toFixed(1)}k</div>
            <div style={{ fontSize: 8, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>total</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
          {data.map((d, i) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 6px", borderRadius: 6, background: hoveredIdx === i ? "rgba(255,255,255,0.04)" : "transparent", cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{d.icon}</span>
              <span style={{ fontSize: 11, color: T.text, fontWeight: 500, flex: 1 }}>{d.label}</span>
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.textSub, fontWeight: 600 }}>${fmt(d.amount)}</span>
              <span style={{ fontSize: 9, fontFamily: T.mono, color: T.textDim, width: 28, textAlign: "right" }}>{((d.amount / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Budget vs Actual (horizontal bullet chart)
function BudgetVsActual({ data }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.cap, d.actual)));
  return (
    <div style={chartCard}>
      <ChartTitle>Budget vs. Actual</ChartTitle>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <LegendDot color="rgba(255,255,255,0.12)" label="Budget Cap" />
        <LegendDot color={T.accent} label="Actual Spent" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => {
          const capPct = (d.cap / maxVal) * 100;
          const actPct = (d.actual / maxVal) * 100;
          const over = d.actual > d.cap;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: T.text }}>{d.icon} {d.cat}</span>
                <span style={{ fontSize: 10, fontFamily: T.mono, color: over ? T.exp : T.inc, fontWeight: 600 }}>
                  ${fmt(d.actual)} / ${fmt(d.cap)}
                  {over && <span style={{ marginLeft: 4, fontSize: 9, color: T.exp }}>OVER</span>}
                </span>
              </div>
              <div style={{ position: "relative", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                {/* Cap marker */}
                <div style={{ position: "absolute", left: `${capPct}%`, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.25)", zIndex: 2 }} />
                {/* Actual bar */}
                <div style={{
                  height: "100%", borderRadius: 6, width: `${Math.min(actPct, 100)}%`,
                  background: over ? `linear-gradient(90deg, ${T.exp}aa, ${T.exp}66)` : `linear-gradient(90deg, ${T.accent}cc, ${T.accent}55)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. Cumulative Spend Curve (multi-line)
function CumulativeSpend({ data }) {
  const allVals = data.series.flat();
  const maxVal = Math.max(...allVals);
  const w = 280, h = 80, pad = 6;

  return (
    <div style={chartCard}>
      <ChartTitle>Spending Pace</ChartTitle>
      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        {data.months.map((m, i) => <LegendDot key={i} color={data.colors[i]} label={m} />)}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 80 }}>
        {data.series.map((series, si) => {
          const step = (w - pad * 2) / (series.length - 1);
          const pts = series.map((v, i) => `${pad + i * step},${h - pad - (v / maxVal) * (h - pad * 2)}`);
          return <path key={si} d={`M ${pts.join(" L ")}`} fill="none" stroke={data.colors[si]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={si === data.series.length - 1 ? 1 : 0.4} />;
        })}
        {/* Current month dots */}
        {(() => {
          const lastSeries = data.series[data.series.length - 1];
          const step = (w - pad * 2) / (lastSeries.length - 1);
          const lastIdx = lastSeries.length - 1;
          const x = pad + lastIdx * step;
          const y = h - pad - (lastSeries[lastIdx] / maxVal) * (h - pad * 2);
          return <circle cx={x} cy={y} r="3.5" fill={data.colors[data.colors.length - 1]} stroke="#0a0a1a" strokeWidth="1.5" />;
        })()}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 6px 0" }}>
        <span style={{ fontSize: 8, color: T.textDim, fontFamily: T.mono }}>1st</span>
        <span style={{ fontSize: 8, color: T.textDim, fontFamily: T.mono }}>Mid</span>
        <span style={{ fontSize: 8, color: T.textDim, fontFamily: T.mono }}>30th</span>
      </div>
      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(99,102,241,0.08)", fontSize: 10, color: T.accentLight, textAlign: "center" }}>
        April is pacing 33% below March at this point in the month
      </div>
    </div>
  );
}

// 6. Top Expenses (horizontal bar ranking)
function TopExpenses({ data }) {
  const maxAmt = data[0]?.amount || 1;
  return (
    <div style={chartCard}>
      <ChartTitle>Top Expenses</ChartTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono, width: 16, textAlign: "right" }}>#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>{d.icon} {d.label}</span>
                <span style={{ fontSize: 11, fontFamily: T.mono, color: T.exp, fontWeight: 600 }}>${fmt(d.amount)}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${(d.amount / maxAmt) * 100}%`, background: `linear-gradient(90deg, ${d.color}aa, ${d.color}44)` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Income Sources Breakdown (horizontal stacked bar + list)
function IncomeSources({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <div style={chartCard}>
      <ChartTitle>Income Sources</ChartTitle>
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
        {data.map((d, i) => (
          <div key={i} style={{ width: `${(d.amount / total) * 100}%`, background: d.color, opacity: 0.8, transition: "opacity 0.2s" }} />
        ))}
      </div>
      {/* Legend list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map(d => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>{d.icon}</span>
            <span style={{ flex: 1, fontSize: 11, color: T.text }}>{d.label}</span>
            <span style={{ fontSize: 10, fontFamily: T.mono, color: T.inc, fontWeight: 600 }}>${fmt(d.amount)}</span>
            <span style={{ fontSize: 9, fontFamily: T.mono, color: T.textDim, width: 28, textAlign: "right" }}>{((d.amount / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, borderTop: `1px solid ${T.cardBorder}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>Total Income</span>
        <span style={{ fontSize: 12, fontFamily: T.mono, color: T.inc, fontWeight: 700 }}>${fmt(total)}</span>
      </div>
    </div>
  );
}

// 8. Savings Waterfall
function SavingsWaterfall({ data }) {
  const income = data.find(d => d.type === "income")?.amount || 0;
  let running = income;
  const bars = data.map(d => {
    if (d.type === "income") return { ...d, start: 0, end: income, height: income };
    const start = running;
    running += d.amount; // amount is negative for expenses
    return { ...d, start: running, end: start, height: Math.abs(d.amount) };
  });
  const netSavings = running;
  bars.push({ label: "Savings", amount: netSavings, type: "savings", start: 0, end: netSavings, height: netSavings });

  const maxBar = income;
  const barH = 110;

  return (
    <div style={chartCard}>
      <ChartTitle>Savings Waterfall</ChartTitle>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: barH + 30, padding: "0 2px", overflow: "hidden" }}>
        {bars.map((b, i) => {
          const topPct = (b.start / maxBar) * 100;
          const hPct = (b.height / maxBar) * 100;
          const bottomPct = Math.min(topPct, ((b.end < b.start ? b.end : b.start) / maxBar) * 100);
          const barColor = b.type === "income" ? T.inc : b.type === "savings" ? T.accent : T.exp;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
              <div style={{ flex: 1, width: "100%", position: "relative" }}>
                <div style={{
                  position: "absolute", bottom: `${(Math.min(b.start, b.end) / maxBar) * 100}%`,
                  left: "15%", right: "15%", height: `${hPct}%`,
                  borderRadius: 3,
                  background: `linear-gradient(180deg, ${barColor}cc, ${barColor}44)`,
                }} />
              </div>
              <div style={{ fontSize: 7, color: T.textDim, fontFamily: T.mono, marginTop: 2, whiteSpace: "nowrap" }}>
                {b.type === "income" ? "+" : b.type === "savings" ? "=" : ""}{fmtK(Math.abs(b.amount))}
              </div>
              <div style={{ fontSize: 7, color: T.textMuted, fontWeight: 600, marginTop: 1, textAlign: "center", maxWidth: 40, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(34,197,94,0.08)", fontSize: 11, color: T.inc, textAlign: "center", fontWeight: 600 }}>
        Net Savings: ${fmt(netSavings)} ({((netSavings / income) * 100).toFixed(1)}% of income)
      </div>
    </div>
  );
}

// 9. Envelope Health Grid (heatmap)
function EnvelopeHealth({ data, monthLabels }) {
  const getColor = (pct) => {
    if (pct <= 70) return "rgba(34,197,94,0.5)";
    if (pct <= 90) return "rgba(34,197,94,0.3)";
    if (pct <= 100) return "rgba(245,158,11,0.4)";
    return "rgba(239,68,68,0.5)";
  };
  const getTextColor = (pct) => {
    if (pct <= 90) return T.inc;
    if (pct <= 100) return T.warn;
    return T.exp;
  };

  return (
    <div style={chartCard}>
      <ChartTitle>Envelope Health</ChartTitle>
      <div style={{ display: "flex", gap: 16, marginBottom: 10, justifyContent: "flex-end" }}>
        <LegendDot color="rgba(34,197,94,0.4)" label="Under 90%" />
        <LegendDot color="rgba(245,158,11,0.4)" label="90-100%" />
        <LegendDot color="rgba(239,68,68,0.5)" label="Over" />
      </div>
      {/* Header row */}
      <div style={{ display: "flex", gap: 4, marginBottom: 4, paddingLeft: 70 }}>
        {monthLabels.map((m, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: T.textDim, fontFamily: T.mono }}>{m}</div>
        ))}
      </div>
      {/* Grid rows */}
      {data.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
          <div style={{ width: 66, fontSize: 10, color: T.textSub, fontWeight: 500, textAlign: "right", paddingRight: 4 }}>{row.cat}</div>
          {row.months.map((pct, ci) => (
            <div key={ci} style={{
              flex: 1, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              background: getColor(pct), fontSize: 10, fontWeight: 600, fontFamily: T.mono, color: getTextColor(pct),
            }}>
              {pct}%
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// 10. Recurring vs One-Time (split ring)
function RecurringVsOneTime({ data }) {
  const total = data.recurring + data.oneTime;
  const recPct = (data.recurring / total) * 100;
  const cx = 50, cy = 50, r = 38, sw = 14;
  const circ = 2 * Math.PI * r;
  const recDash = (recPct / 100) * circ;

  return (
    <div style={chartCard}>
      <ChartTitle>Recurring vs. One-Time</ChartTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, transform: "rotate(-90deg)" }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.accent} strokeWidth={sw}
              strokeDasharray={`${recDash} ${circ - recDash}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.mono, color: T.text }}>{recPct.toFixed(0)}%</div>
            <div style={{ fontSize: 7, color: T.textDim, textTransform: "uppercase" }}>fixed</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: T.accent }} />
              <span style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>Recurring</span>
            </div>
            <div style={{ fontSize: 13, fontFamily: T.mono, color: T.accentLight, fontWeight: 700, paddingLeft: 14 }}>${fmt(data.recurring)}</div>
            <div style={{ fontSize: 9, color: T.textDim, paddingLeft: 14 }}>Rent, car, subscriptions, tithe</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>One-Time</span>
            </div>
            <div style={{ fontSize: 13, fontFamily: T.mono, color: T.textSub, fontWeight: 700, paddingLeft: 14 }}>${fmt(data.oneTime)}</div>
            <div style={{ fontSize: 9, color: T.textDim, paddingLeft: 14 }}>Groceries, gas, dining, misc</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. Spending by Household Member (stacked bar)
function MemberBreakdown({ data }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <div style={chartCard}>
      <ChartTitle>Spending by Member</ChartTitle>
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        {data.map((d, i) => (
          <div key={i} style={{ width: `${(d.amount / total) * 100}%`, background: d.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: T.mono }}>{((d.amount / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      {/* Member rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: `${d.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: d.color }}>
              {d.name[0]}
            </div>
            <span style={{ flex: 1, fontSize: 12, color: T.text, fontWeight: 500 }}>{d.name}</span>
            <span style={{ fontSize: 12, fontFamily: T.mono, color: T.textSub, fontWeight: 600 }}>${fmt(d.amount)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, borderTop: `1px solid ${T.cardBorder}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>Total Spending</span>
        <span style={{ fontSize: 12, fontFamily: T.mono, color: T.exp, fontWeight: 700 }}>${fmt(total)}</span>
      </div>
    </div>
  );
}


// ============================================================
// SHARED COMPONENTS
// ============================================================

const chartCard = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
  border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 16, padding: "14px 16px", marginBottom: 14,
};

function ChartTitle({ children, style }) {
  return (
    <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 10, color: T.textMuted }}>{label}</span>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
      <span style={{ fontSize: 13, color: T.text }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
        background: value ? T.accent : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s",
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 8, background: "#fff", position: "absolute", top: 3,
          left: value ? 21 : 3, transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

const DIVIDER = <div style={{ borderTop: `1px solid ${T.cardBorder}` }} />;


// ============================================================
// MAIN MOCKUP
// ============================================================

export default function FolderAnalyticsMockup() {
  const [view, setView] = useState("folder");
  const [showTrends, setShowTrends] = useState(true);
  const [showYIR, setShowYIR] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showBvA, setShowBvA] = useState(true);
  const [showPace, setShowPace] = useState(true);
  const [showTop, setShowTop] = useState(true);
  const [showIncome, setShowIncome] = useState(true);
  const [showWaterfall, setShowWaterfall] = useState(true);
  const [showEnvHealth, setShowEnvHealth] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showMember, setShowMember] = useState(false);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* View Switcher */}
      <div style={{ padding: "16px 20px 8px", display: "flex", gap: 6 }}>
        {[
          { id: "folder", label: "Folder View" },
          { id: "settings", label: "Display Settings" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700,
            background: view === v.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            color: view === v.id ? "#818cf8" : "#64748b",
          }}>{v.label}</button>
        ))}
      </div>

      {view === "folder" && (
        <div style={{ padding: "12px 20px 120px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <button style={{ background: T.inputBg, border: "none", color: T.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>&#8249; Folders</button>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#6366f1" }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>Muirhead Budget</h2>
          </div>

          {/* All analytics — toggled by user prefs */}
          {showTrends && <MonthlyTrends data={months} />}
          {showYIR && <YearInReview data={months} />}
          {showCategory && <CategoryBreakdown data={categoryData} />}
          {showBvA && <BudgetVsActual data={budgetVsActualData} />}
          {showPace && <CumulativeSpend data={cumulativeSpendData} />}
          {showTop && <TopExpenses data={topExpenses} />}
          {showIncome && <IncomeSources data={incomeSourceData} />}
          {showWaterfall && <SavingsWaterfall data={waterfallData} />}
          {showEnvHealth && <EnvelopeHealth data={envelopeHealthData} monthLabels={months.map(m => m.name)} />}
          {showRecurring && <RecurringVsOneTime data={recurringData} />}
          {showMember && <MemberBreakdown data={memberData} />}

          {/* Sub-budgets list */}
          <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 6 }}>
            Budgets ({childBudgets.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {childBudgets.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                background: "rgba(255,255,255,0.02)", borderRadius: 12,
                borderLeft: `4px solid ${c.color}`, cursor: "pointer",
              }}>
                <div style={{ cursor: "grab", color: "#475569", fontSize: 16, padding: "4px 6px" }}>{"\u2800\u2800"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{c.name}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: T.mono, color: c.balance >= 0 ? "#22c55e" : "#ef4444" }}>
                  +{fmt(c.balance)}
                </span>
                <span style={{ fontSize: 18, color: "#475569" }}>&#8250;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "settings" && (
        <div style={{ padding: "12px 20px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <button onClick={() => setView("folder")} style={{ background: T.inputBg, border: "none", color: T.textSub, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#8249; Back</button>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>Display Settings</h2>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "14px 18px", marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
              Overview Charts
            </div>
            <div style={{ fontSize: 11, color: T.textDim, marginBottom: 12, lineHeight: 1.5 }}>
              These settings are per-user. Your partner's view won't be affected.
            </div>
            <Toggle label="Monthly Trends" value={showTrends} onChange={setShowTrends} />
            {DIVIDER}
            <Toggle label="Year in Review" value={showYIR} onChange={setShowYIR} />
            {DIVIDER}
            <Toggle label="Category Breakdown" value={showCategory} onChange={setShowCategory} />
            {DIVIDER}
            <Toggle label="Budget vs. Actual" value={showBvA} onChange={setShowBvA} />
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "14px 18px", marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
              Spending Insights
            </div>
            <Toggle label="Spending Pace" value={showPace} onChange={setShowPace} />
            {DIVIDER}
            <Toggle label="Top Expenses" value={showTop} onChange={setShowTop} />
            {DIVIDER}
            <Toggle label="Income Sources" value={showIncome} onChange={setShowIncome} />
            {DIVIDER}
            <Toggle label="Savings Waterfall" value={showWaterfall} onChange={setShowWaterfall} />
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "14px 18px", marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
              Advanced
            </div>
            <Toggle label="Envelope Health Grid" value={showEnvHealth} onChange={setShowEnvHealth} />
            {DIVIDER}
            <Toggle label="Recurring vs. One-Time" value={showRecurring} onChange={setShowRecurring} />
            {DIVIDER}
            <Toggle label="Spending by Member" value={showMember} onChange={setShowMember} />
          </div>

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.textDim, background: "rgba(255,255,255,0.03)", display: "inline-block", padding: "8px 16px", borderRadius: 8, lineHeight: 1.5 }}>
              Saved per user in Firestore. Each household member controls their own view.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
