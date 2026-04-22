"use client";

// Revenue-by-source donut.
//
// Derives category totals from existing state aggregates (project
// lifetimeRevenue, DLC lifetimeRevenue, engine license lifetime royalties,
// contract payouts), then folds the remainder into an "Other" bucket so the
// sum always matches studio.lifetimeRevenue. v1 doesn't instrument every
// revenue call site — the per-category fidelity will improve when we add a
// dedicated revenueBySource aggregate on Studio.

import { useMemo } from "react";
import type { GameState } from "@/engine";
import { formatMoney } from "@/lib/format";

interface Props {
  state: GameState;
}

// Cartoon palette slice colors — must stay in same order as CATEGORIES below.
const INK = "#1f1d3a";
const CREAM = "#fdf3d8";
const DIM = "#7d7a99";

const SLICE_COLORS = {
  gameSales: "#ff5fa2",     // PINK
  dlcLive: "#9c6bff",       // PURPLE
  engineRoyalties: "#2dc7b8", // TEAL
  contracts: "#ffc233",     // MUSTARD
  other: "#86d3ff",         // SKY — reserved for the residual bucket
} as const;

type CategoryId = keyof typeof SLICE_COLORS;

interface Category {
  id: CategoryId;
  label: string;
  hint: string;
  amount: number;
}

export function RevenueDonut({ state }: Props) {
  const { categories, totalTracked, residual, total } = useMemo(
    () => buildCategories(state),
    [state]
  );

  const hasAnyRevenue = total > 0;

  if (!hasAnyRevenue) {
    return (
      <div
        className="py-10 px-4 text-center"
        style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
      >
        Ship a game to start counting revenue.
      </div>
    );
  }

  // Build slice arc paths in donut-chart order (largest first)
  const sorted = [...categories].sort((a, b) => b.amount - a.amount);
  const SIZE = 200;
  const CENTER = SIZE / 2;
  const R_OUTER = 86;
  const R_INNER = 50;
  let cursor = -Math.PI / 2; // start at 12 o'clock
  const slices = sorted
    .filter((c) => c.amount > 0)
    .map((cat) => {
      const pct = cat.amount / total;
      const startAngle = cursor;
      const endAngle = cursor + pct * Math.PI * 2;
      cursor = endAngle;
      return { cat, pct, startAngle, endAngle };
    });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut */}
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          {slices.map(({ cat, pct, startAngle, endAngle }) => (
            <path
              key={cat.id}
              d={donutSlicePath(CENTER, CENTER, R_INNER, R_OUTER, startAngle, endAngle)}
              fill={SLICE_COLORS[cat.id]}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinejoin="round"
            >
              <title>
                {cat.label}: {formatMoney(cat.amount)} ({(pct * 100).toFixed(0)}%)
              </title>
            </path>
          ))}
          {/* Inner label — total lifetime revenue */}
          <text
            x={CENTER}
            y={CENTER - 6}
            textAnchor="middle"
            fontSize={11}
            fill={DIM}
            fontFamily="Fredoka, sans-serif"
          >
            LIFETIME
          </text>
          <text
            x={CENTER}
            y={CENTER + 14}
            textAnchor="middle"
            fontSize={18}
            fill={INK}
            fontFamily="Paytone One, sans-serif"
            fontWeight={700}
          >
            {formatMoney(total)}
          </text>
        </svg>
      </div>

      {/* Legend / breakdown list */}
      <div className="flex-1 w-full">
        <ul
          className="space-y-1.5"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          {sorted.map((cat) => {
            const pct = total > 0 ? (cat.amount / total) * 100 : 0;
            return (
              <li
                key={cat.id}
                className="flex items-center gap-2 text-sm"
                style={{ color: INK }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: SLICE_COLORS[cat.id],
                    border: `2px solid ${INK}`,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span className="flex-1 truncate" title={cat.hint}>
                  {cat.label}
                </span>
                <span
                  className="tabular text-xs"
                  style={{ color: DIM, minWidth: 42, textAlign: "right" }}
                >
                  {pct.toFixed(0)}%
                </span>
                <span
                  className="tabular font-semibold"
                  style={{ minWidth: 68, textAlign: "right" }}
                >
                  {formatMoney(cat.amount)}
                </span>
              </li>
            );
          })}
        </ul>

        {residual > 0 && (
          <div
            className="mt-3 text-[11px]"
            style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
          >
            "Other" covers live-service subs, publisher deals, IP licensing
            fees, events, and awards. We'll split these out in a future
            update once per-source tracking lands.
          </div>
        )}
        {totalTracked > total && (
          <div
            className="mt-2 text-[11px]"
            style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
          >
            Tracked categories sum higher than recorded lifetime revenue —
            this can happen when DLC + IP totals double-count IP-level rollups
            from pre-migration saves.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- data ----------

function buildCategories(state: GameState): {
  categories: Category[];
  totalTracked: number;
  residual: number;
  total: number;
} {
  // Game sales — sum of project lifetime revenue for anything released
  const gameSales = Object.values(state.projects).reduce((sum, p) => {
    if (p.status !== "released") return sum;
    return sum + (p.lifetimeRevenue ?? 0);
  }, 0);

  // DLC & Live Service combined (live-service subs route through DLC's
  // monthly tick, which writes into studio.lifetimeRevenue but not into
  // dlc.lifetimeRevenue). For the breakdown we use the DLC-sales total as
  // the visible portion; the sub stream lives in "Other".
  const dlcSales = Object.values(state.dlcs).reduce(
    (sum, d) => sum + (d.lifetimeRevenue ?? 0),
    0
  );

  // Engine royalties — the studio's owned engines, summed across all active
  // + inactive licenses on them
  const ownedEngineIds = new Set(state.studio.ownedEngineIds);
  const engineRoyalties = Object.values(state.engineLicenses).reduce(
    (sum, lic) => {
      if (!ownedEngineIds.has(lic.engineId)) return sum;
      return sum + (lic.lifetimeRoyaltiesPaid ?? 0);
    },
    0
  );

  // Contracts — sum of paidOut for completed work-for-hire
  const contracts = Object.values(state.contracts).reduce((sum, c) => {
    return sum + (c.paidOut ?? 0);
  }, 0);

  const totalLifetime = state.studio.lifetimeRevenue;
  const totalTracked = gameSales + dlcSales + engineRoyalties + contracts;
  const residual = Math.max(0, totalLifetime - totalTracked);

  const categories: Category[] = [
    {
      id: "gameSales",
      label: "Game Sales",
      hint: "Lifetime revenue from released base games",
      amount: gameSales,
    },
    {
      id: "dlcLive",
      label: "DLC & Expansions",
      hint: "Sales of DLC packs, expansions, and season passes",
      amount: dlcSales,
    },
    {
      id: "engineRoyalties",
      label: "Engine Royalties",
      hint: "Royalties earned from licensing your engines out",
      amount: engineRoyalties,
    },
    {
      id: "contracts",
      label: "Work-for-Hire",
      hint: "Publisher contracts the studio took on",
      amount: contracts,
    },
    {
      id: "other",
      label: "Licensing, Live Service & Other",
      hint: "IP licensing, live-service subs, publishing deals, events, awards",
      amount: residual,
    },
  ];

  return { categories, totalTracked, residual, total: totalLifetime };
}

// ---------- geometry ----------

// Returns an SVG path for a donut arc slice between two angles (radians).
function donutSlicePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
): string {
  const fullCircle = Math.abs(endAngle - startAngle) >= Math.PI * 2 - 0.001;
  // Degenerate full-circle case — render as an outer + inner circle subtraction.
  if (fullCircle) {
    return [
      `M ${cx + rOuter} ${cy}`,
      `A ${rOuter} ${rOuter} 0 1 1 ${cx - rOuter} ${cy}`,
      `A ${rOuter} ${rOuter} 0 1 1 ${cx + rOuter} ${cy}`,
      `M ${cx + rInner} ${cy}`,
      `A ${rInner} ${rInner} 0 1 0 ${cx - rInner} ${cy}`,
      `A ${rInner} ${rInner} 0 1 0 ${cx + rInner} ${cy}`,
      "Z",
    ].join(" ");
  }
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const x0 = cx + rOuter * Math.cos(startAngle);
  const y0 = cy + rOuter * Math.sin(startAngle);
  const x1 = cx + rOuter * Math.cos(endAngle);
  const y1 = cy + rOuter * Math.sin(endAngle);
  const x2 = cx + rInner * Math.cos(endAngle);
  const y2 = cy + rInner * Math.sin(endAngle);
  const x3 = cx + rInner * Math.cos(startAngle);
  const y3 = cy + rInner * Math.sin(startAngle);

  return [
    `M ${x0} ${y0}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x3} ${y3}`,
    "Z",
  ].join(" ");
}
