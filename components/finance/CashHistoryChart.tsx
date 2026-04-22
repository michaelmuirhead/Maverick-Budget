"use client";

// Cash history line chart.
//
// Draws the studio's cash balance over time from the monthly samples captured
// by the tick dispatcher. One SVG, no external dep. Uses the same cartoon
// palette as the rest of the financials page (ink outlines, pink fill area,
// mustard launch dot). Shows the running lifetime revenue as a dashed line
// behind the cash line so players can see how much has flowed through vs how
// much they kept.

import { useMemo } from "react";
import type { CashHistorySample } from "@/engine";
import { formatMoney, formatDate } from "@/lib/format";

interface Props {
  history: CashHistorySample[];
  currentDate: string;
  currentCash: number;
  currentLifetimeRevenue: number;
}

// Cartoon palette (aligned with FranchiseLineage + SalesCurvePreview)
const INK = "#1f1d3a";
const CREAM = "#fdf3d8";
const PINK = "#ff5fa2";
const TEAL = "#2dc7b8";
const MUSTARD = "#ffc233";
const DIM = "#7d7a99";

const VIEWBOX_W = 720;
const VIEWBOX_H = 260;
const PADDING = { top: 18, right: 20, bottom: 32, left: 68 };

export function CashHistoryChart({
  history,
  currentDate,
  currentCash,
  currentLifetimeRevenue,
}: Props) {
  const data = useMemo(() => {
    // Always include the current live point so the chart terminates at today
    // rather than the last month boundary.
    const withLive: CashHistorySample[] = [
      ...history,
      {
        date: currentDate,
        cash: currentCash,
        lifetimeRevenue: currentLifetimeRevenue,
        debt: 0,
      },
    ];

    // Deduplicate on date — the seed-at-new-game entry + first monthly tick
    // can share a date during the game's first day.
    const byDate = new Map<string, CashHistorySample>();
    for (const s of withLive) byDate.set(s.date, s);
    return Array.from(byDate.values()).sort((a, b) =>
      a.date < b.date ? -1 : 1
    );
  }, [history, currentDate, currentCash, currentLifetimeRevenue]);

  if (data.length < 2) {
    return (
      <div
        className="py-10 px-4 text-center"
        style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
      >
        Financial history starts populating on the first of next month.
      </div>
    );
  }

  // Time → x
  const firstT = new Date(data[0]!.date + "T00:00:00Z").getTime();
  const lastT = new Date(data[data.length - 1]!.date + "T00:00:00Z").getTime();
  const tSpan = Math.max(1, lastT - firstT);
  const xOf = (iso: string) => {
    const t = new Date(iso + "T00:00:00Z").getTime();
    const pct = (t - firstT) / tSpan;
    return PADDING.left + pct * (VIEWBOX_W - PADDING.left - PADDING.right);
  };

  // Money → y (shared scale across both series so the lifetime-rev ghost line
  // stays comparable)
  const maxY = Math.max(
    1,
    ...data.map((s) => Math.max(s.cash, s.lifetimeRevenue))
  );
  const minY = Math.min(0, ...data.map((s) => s.cash));
  const ySpan = Math.max(1, maxY - minY);
  const yOf = (v: number) => {
    const pct = (v - minY) / ySpan;
    return (
      VIEWBOX_H -
      PADDING.bottom -
      pct * (VIEWBOX_H - PADDING.top - PADDING.bottom)
    );
  };

  // Build path strings
  const cashPoints = data.map((s) => `${xOf(s.date)},${yOf(s.cash)}`);
  const lifetimePoints = data.map(
    (s) => `${xOf(s.date)},${yOf(s.lifetimeRevenue)}`
  );
  const cashPath = `M ${cashPoints.join(" L ")}`;
  const lifetimePath = `M ${lifetimePoints.join(" L ")}`;
  const zeroY = yOf(0);
  const areaPath = `${cashPath} L ${xOf(data[data.length - 1]!.date)},${zeroY} L ${xOf(data[0]!.date)},${zeroY} Z`;

  // Y gridlines — 4 ticks based on rounded max
  const yTicks: number[] = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    yTicks.push(minY + (ySpan * i) / steps);
  }

  // X ticks — pick year boundaries; cap at 6 labels
  const xTicks = chooseYearTicks(data[0]!.date, data[data.length - 1]!.date, 6);

  // Peak + trough markers
  const peak = data.reduce((a, b) => (b.cash > a.cash ? b : a));
  const trough = data.reduce((a, b) => (b.cash < a.cash ? b : a));

  // Delta over full window for the header
  const netChange = data[data.length - 1]!.cash - data[0]!.cash;
  const netPositive = netChange >= 0;

  return (
    <div className="w-full">
      {/* Header stats */}
      <div className="flex items-baseline gap-4 mb-2 text-xs" style={{ fontFamily: "Fredoka, sans-serif" }}>
        <span style={{ color: DIM }}>
          {formatDate(data[0]!.date)} → {formatDate(data[data.length - 1]!.date)}
        </span>
        <span
          className="font-bold"
          style={{ color: netPositive ? TEAL : PINK }}
        >
          {netPositive ? "▲" : "▼"} {formatMoney(Math.abs(netChange))}{" "}
          <span style={{ color: DIM, fontWeight: 400 }}>
            over window
          </span>
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="w-full"
        style={{ maxHeight: 280 }}
      >
        {/* Y gridlines */}
        {yTicks.map((v, i) => (
          <g key={`yg-${i}`}>
            <line
              x1={PADDING.left}
              x2={VIEWBOX_W - PADDING.right}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke={INK}
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.25}
            />
            <text
              x={PADDING.left - 8}
              y={yOf(v) + 4}
              textAnchor="end"
              fontSize={11}
              fill={DIM}
              fontFamily="Fredoka, sans-serif"
            >
              {formatMoney(v)}
            </text>
          </g>
        ))}

        {/* Zero baseline if cash has gone negative somewhere */}
        {minY < 0 && (
          <line
            x1={PADDING.left}
            x2={VIEWBOX_W - PADDING.right}
            y1={zeroY}
            y2={zeroY}
            stroke={INK}
            strokeWidth={1.5}
          />
        )}

        {/* Cash area fill */}
        <path d={areaPath} fill={PINK} opacity={0.22} />

        {/* Lifetime revenue ghost line (dashed, teal) */}
        <path
          d={lifetimePath}
          stroke={TEAL}
          strokeWidth={2.5}
          strokeDasharray="5 4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cash line */}
        <path
          d={cashPath}
          stroke={PINK}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Peak + trough markers (only if we have > 3 data points) */}
        {data.length > 3 && peak !== trough && (
          <>
            <circle
              cx={xOf(peak.date)}
              cy={yOf(peak.cash)}
              r={5}
              fill={MUSTARD}
              stroke={INK}
              strokeWidth={2}
            />
            <circle
              cx={xOf(trough.date)}
              cy={yOf(trough.cash)}
              r={5}
              fill={CREAM}
              stroke={INK}
              strokeWidth={2}
            />
          </>
        )}

        {/* Current dot — the live cash value */}
        <circle
          cx={xOf(data[data.length - 1]!.date)}
          cy={yOf(data[data.length - 1]!.cash)}
          r={6}
          fill={PINK}
          stroke={INK}
          strokeWidth={2.5}
        />

        {/* X-axis ticks */}
        {xTicks.map((iso) => (
          <g key={`xt-${iso}`}>
            <line
              x1={xOf(iso)}
              x2={xOf(iso)}
              y1={VIEWBOX_H - PADDING.bottom}
              y2={VIEWBOX_H - PADDING.bottom + 5}
              stroke={INK}
              strokeWidth={1.5}
            />
            <text
              x={xOf(iso)}
              y={VIEWBOX_H - PADDING.bottom + 18}
              textAnchor="middle"
              fontSize={11}
              fill={DIM}
              fontFamily="Fredoka, sans-serif"
            >
              {iso.slice(0, 4)}
            </text>
          </g>
        ))}

        {/* Bottom axis line */}
        <line
          x1={PADDING.left}
          x2={VIEWBOX_W - PADDING.right}
          y1={VIEWBOX_H - PADDING.bottom}
          y2={VIEWBOX_H - PADDING.bottom}
          stroke={INK}
          strokeWidth={2}
        />
      </svg>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center gap-4 mt-2 text-xs"
        style={{ fontFamily: "Fredoka, sans-serif", color: DIM }}
      >
        <LegendDot color={PINK} label="Cash on hand" />
        <LegendDot color={TEAL} label="Lifetime revenue" dashed />
        {data.length > 3 && peak !== trough && (
          <>
            <LegendDot color={MUSTARD} label={`Peak ${formatMoney(peak.cash)}`} />
            <LegendDot color={CREAM} label={`Trough ${formatMoney(trough.cash)}`} outlined />
          </>
        )}
      </div>
    </div>
  );
}

function LegendDot({
  color,
  label,
  dashed,
  outlined,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  outlined?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {dashed ? (
        <svg width={22} height={8}>
          <line
            x1={1}
            y1={4}
            x2={21}
            y2={4}
            stroke={color}
            strokeWidth={2.5}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: color,
            border: `1.5px solid ${outlined ? INK : color}`,
            display: "inline-block",
          }}
        />
      )}
      <span>{label}</span>
    </span>
  );
}

// Pick year-boundary ticks between two ISO dates, capped to ~maxLabels.
// Falls back to endpoints if the window is narrower than one year.
function chooseYearTicks(startIso: string, endIso: string, maxLabels: number): string[] {
  const startYear = parseInt(startIso.slice(0, 4), 10);
  const endYear = parseInt(endIso.slice(0, 4), 10);
  if (endYear <= startYear) return [startIso, endIso];
  const span = endYear - startYear;
  const step = Math.max(1, Math.ceil(span / (maxLabels - 1)));
  const out: string[] = [];
  for (let y = startYear; y <= endYear; y += step) {
    out.push(`${y}-01-01`);
  }
  if (out[out.length - 1]!.slice(0, 4) !== String(endYear)) {
    out.push(`${endYear}-01-01`);
  }
  return out;
}
