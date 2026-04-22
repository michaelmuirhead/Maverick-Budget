"use client";

// Stacked-area chart — releases shipped per year by studio.
//
// Aggregates:
//   - Player studio's released projects (grouped by the year in
//     project.actualReleaseDate).
//   - Every competitor's CompetitorGame records (grouped by the year in
//     game.releaseDate).
//
// Strategy: we pick the top N competitors by total shipped count, bucket
// everyone else into "Others", and always render the Player band on top
// (pink) so the player can see their catalog relative to the industry at
// a glance.
//
// We render absolute counts rather than %-share. Share % would be
// misleading across a 30-year span while the industry is growing ten-fold;
// counts tell the real "who's busy shipping" story.
//
// Pure inline SVG, cartoon palette, no chart library.

import { useMemo } from "react";
import type { Competitor, CompetitorGame, Project } from "@/engine";

// Palette — player pink stays unique. Others rotate through the cartoon
// accents plus a handful of supporting shades picked to be distinguishable
// when stacked. Colors are ordered so the most-shipping competitors get the
// strongest/brightest fills.
const INK = "#1a1a22";
const INK_SOFT = "#3b3646";
const CREAM = "#fff8e1";
const CREAM_2 = "#fff0c2";
const PINK = "#ff6fa1";
const TEAL = "#2ec4a6";
const MUSTARD = "#ffd93e";
const PURPLE = "#a274e8";
const DIM = "#7d7a99";

// Band colors for competitors — 8 hues that stack readably. Skip pink
// (reserved for the player). Start brightest for the biggest studios.
const BAND_COLORS = [
  TEAL,
  MUSTARD,
  PURPLE,
  "#ff9030",   // warn / orange
  "#6bc9ff",   // sky blue
  "#b5e05c",   // lime
  "#ff8fb8",   // soft pink (distinct from player pink)
  "#c9a374",   // tan
];
const OTHERS_COLOR = "#d0c7a8"; // muted cream-tan for the Others catch-all
const PLAYER_COLOR = PINK;

interface Props {
  competitors: Record<string, Competitor>;
  competitorGames: Record<string, CompetitorGame>;
  playerProjects: Record<string, Project>;
  playerStudioName: string;
  currentYear: number;
  topN?: number; // default 6 competitors shown individually, rest go to Others
}

// SVG geometry.
const W = 760;
const H = 280;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 32;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

interface StudioRow {
  id: string;
  name: string;
  color: string;
  isPlayer: boolean;
  total: number;
  perYear: Record<number, number>;
}

export function ReleaseShareArea({
  competitors,
  competitorGames,
  playerProjects,
  playerStudioName,
  currentYear,
  topN = 6,
}: Props) {
  const { rows, years, yMax } = useMemo(() => {
    // Build per-studio year buckets.

    // Player
    const playerByYear: Record<number, number> = {};
    let playerTotal = 0;
    for (const p of Object.values(playerProjects)) {
      if (p.status !== "released" || !p.actualReleaseDate) continue;
      const y = parseInt(p.actualReleaseDate.slice(0, 4), 10);
      if (!Number.isFinite(y)) continue;
      playerByYear[y] = (playerByYear[y] ?? 0) + 1;
      playerTotal++;
    }

    // Competitors
    const byCompetitor = new Map<string, Record<number, number>>();
    const competitorTotals = new Map<string, number>();
    for (const g of Object.values(competitorGames)) {
      const y = parseInt(g.releaseDate.slice(0, 4), 10);
      if (!Number.isFinite(y)) continue;
      let b = byCompetitor.get(g.competitorId);
      if (!b) {
        b = {};
        byCompetitor.set(g.competitorId, b);
      }
      b[y] = (b[y] ?? 0) + 1;
      competitorTotals.set(
        g.competitorId,
        (competitorTotals.get(g.competitorId) ?? 0) + 1
      );
    }

    // Determine min/max years across everything actually plotted.
    let minYear = Number.POSITIVE_INFINITY;
    let maxYear = Number.NEGATIVE_INFINITY;
    for (const y of Object.keys(playerByYear)) {
      const yn = parseInt(y, 10);
      if (yn < minYear) minYear = yn;
      if (yn > maxYear) maxYear = yn;
    }
    for (const b of byCompetitor.values()) {
      for (const y of Object.keys(b)) {
        const yn = parseInt(y, 10);
        if (yn < minYear) minYear = yn;
        if (yn > maxYear) maxYear = yn;
      }
    }
    // Fallbacks if there are no releases at all.
    if (!Number.isFinite(minYear)) {
      minYear = currentYear - 1;
      maxYear = currentYear;
    }
    // Always extend to currentYear on the right edge.
    if (currentYear > maxYear) maxYear = currentYear;

    const yrs: number[] = [];
    for (let y = minYear; y <= maxYear; y++) yrs.push(y);

    // Rank competitors by total shipped and take topN; rest → Others.
    const rankedIds = Array.from(competitorTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
    const topIds = rankedIds.slice(0, topN);
    const otherIds = rankedIds.slice(topN);

    const rowList: StudioRow[] = [];

    // Others goes on the BOTTOM of the stack — largest audience, least
    // important visually so their band sits at the base.
    if (otherIds.length > 0) {
      const otherByYear: Record<number, number> = {};
      let otherTotal = 0;
      for (const id of otherIds) {
        const b = byCompetitor.get(id);
        if (!b) continue;
        for (const [y, n] of Object.entries(b)) {
          const yn = parseInt(y, 10);
          otherByYear[yn] = (otherByYear[yn] ?? 0) + n;
          otherTotal += n;
        }
      }
      rowList.push({
        id: "__others__",
        name: `Others (${otherIds.length})`,
        color: OTHERS_COLOR,
        isPlayer: false,
        total: otherTotal,
        perYear: otherByYear,
      });
    }

    // Top competitors stacked above Others, weakest-first.
    topIds
      .slice()
      .reverse()
      .forEach((id, i) => {
        const c = competitors[id];
        const perYear = byCompetitor.get(id) ?? {};
        const colorIdx = topIds.length - 1 - i; // strongest = BAND_COLORS[0]
        rowList.push({
          id,
          name: c?.name ?? "Unknown",
          color: BAND_COLORS[colorIdx % BAND_COLORS.length]!,
          isPlayer: false,
          total: competitorTotals.get(id) ?? 0,
          perYear,
        });
      });

    // Player on TOP — visually prominent pink band the player can always find.
    rowList.push({
      id: "__player__",
      name: playerStudioName,
      color: PLAYER_COLOR,
      isPlayer: true,
      total: playerTotal,
      perYear: playerByYear,
    });

    // yMax across years
    let peak = 1;
    for (const yr of yrs) {
      let col = 0;
      for (const r of rowList) col += r.perYear[yr] ?? 0;
      if (col > peak) peak = col;
    }
    // Give some headroom
    const yMax = Math.ceil(peak * 1.08);

    return { rows: rowList, years: yrs, yMax };
  }, [competitors, competitorGames, playerProjects, playerStudioName, currentYear, topN]);

  // Empty state — nothing shipped yet.
  const totalAcrossAll = rows.reduce((sum, r) => sum + r.total, 0);
  if (totalAcrossAll === 0) {
    return (
      <div
        className="py-10 px-4 text-center text-sm"
        style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
      >
        No releases yet, yours or theirs. Ship your first game to start the chart.
      </div>
    );
  }

  // Geometry helpers.
  const yearSpan = years.length > 1 ? years.length - 1 : 1;
  const xFor = (yearIndex: number) => PAD_L + (yearIndex / yearSpan) * PLOT_W;
  const yFor = (count: number) => PAD_T + PLOT_H - (count / yMax) * PLOT_H;

  // Build stacked band paths. Iterate rows in render order (Others bottom →
  // Player top), tracking a cumulative bottom baseline per-year.
  const baselines = years.map(() => 0);
  const bands = rows.map((row) => {
    const topsThisRow: number[] = [];
    years.forEach((yr, i) => {
      const n = row.perYear[yr] ?? 0;
      baselines[i]! += n;
      topsThisRow.push(baselines[i]!);
    });
    // Path: go along the top curve left→right, then back along the baseline.
    const topPts = topsThisRow.map((t, i) => [xFor(i), yFor(t)] as const);
    const basePts = topsThisRow.map((t, i) => {
      const bottom = t - (row.perYear[years[i]!] ?? 0);
      return [xFor(i), yFor(bottom)] as const;
    });
    const forward = topPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const back = basePts
      .slice()
      .reverse()
      .map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
      .join(" ");
    return {
      row,
      path: `${forward} ${back} Z`,
      topPts, // for optional outline
    };
  });

  // X-axis tick cadence.
  const span = years.length;
  const step = span > 28 ? 5 : span > 14 ? 2 : 1;
  const tickYears = years.filter((y, i) => i === 0 || i === years.length - 1 || (y - years[0]!) % step === 0);

  // Y-axis ticks — 4 bands
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f));

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="shrink-0 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Release share over time">
          {/* Plot background */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={PLOT_W}
            height={PLOT_H}
            fill={CREAM}
            stroke={INK}
            strokeWidth={2.5}
            rx={10}
          />

          {/* Horizontal gridlines + y labels */}
          {yTicks.map((tv, i) => {
            if (tv === 0) return null;
            const y = yFor(tv);
            return (
              <g key={`ytick-${i}`}>
                <line
                  x1={PAD_L}
                  x2={PAD_L + PLOT_W}
                  y1={y}
                  y2={y}
                  stroke={INK}
                  strokeDasharray="2 4"
                  strokeWidth={1}
                  opacity={0.25}
                />
                <text
                  x={PAD_L - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={10}
                  fill={INK_SOFT}
                  fontFamily="Fredoka, sans-serif"
                  fontWeight={600}
                  className="tabular"
                >
                  {tv}
                </text>
              </g>
            );
          })}

          {/* Stacked bands — rendered bottom to top (data order).
              Each band gets a soft ink outline along its top edge so adjacent
              bands stay distinguishable even at small sizes. */}
          {bands.map((b) => (
            <g key={`band-${b.row.id}`}>
              <path
                d={b.path}
                fill={b.row.color}
                fillOpacity={b.row.isPlayer ? 0.95 : 0.88}
                stroke="none"
              />
              {/* Top edge outline — faint ink so color boundaries read cleanly */}
              <path
                d={b.topPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")}
                fill="none"
                stroke={INK}
                strokeWidth={b.row.isPlayer ? 2.5 : 1}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={b.row.isPlayer ? 1 : 0.55}
              />
            </g>
          ))}

          {/* X-axis ticks + year labels */}
          {tickYears.map((yr) => {
            const i = yr - years[0]!;
            const x = xFor(i);
            return (
              <g key={`xtick-${yr}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={PAD_T + PLOT_H}
                  y2={PAD_T + PLOT_H + 4}
                  stroke={INK}
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={PAD_T + PLOT_H + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill={INK_SOFT}
                  fontFamily="Fredoka, sans-serif"
                  fontWeight={600}
                  className="tabular"
                >
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Current-year marker */}
          {currentYear >= years[0]! && currentYear <= years[years.length - 1]! && (
            <g>
              <line
                x1={xFor(currentYear - years[0]!)}
                x2={xFor(currentYear - years[0]!)}
                y1={PAD_T}
                y2={PAD_T + PLOT_H}
                stroke={INK}
                strokeWidth={2}
                strokeDasharray="3 3"
                opacity={0.65}
              />
              <g transform={`translate(${xFor(currentYear - years[0]!)}, ${PAD_T - 4})`}>
                <rect
                  x={-20}
                  y={-12}
                  width={40}
                  height={14}
                  rx={7}
                  ry={7}
                  fill={PINK}
                  stroke={INK}
                  strokeWidth={2}
                />
                <text
                  x={0}
                  y={-1}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#fff"
                  fontFamily="Paytone One, sans-serif"
                  className="tabular"
                >
                  {currentYear}
                </text>
              </g>
            </g>
          )}

          {/* Y-axis label */}
          <text
            x={PAD_L}
            y={PAD_T - 6}
            fontSize={9}
            fill={INK_SOFT}
            fontFamily="Paytone One, sans-serif"
            fontWeight={700}
            letterSpacing={1}
          >
            RELEASES / YEAR
          </text>
        </svg>
      </div>

      {/* Legend — ordered top (player) to bottom so it mirrors the visual
          stack. Each row shows color swatch + studio name + total shipped. */}
      <div className="flex-1 w-full min-w-0" style={{ fontFamily: "Fredoka, sans-serif", color: INK }}>
        <div
          style={{
            fontFamily: "Paytone One, sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            color: INK_SOFT,
            marginBottom: 4,
          }}
        >
          RANKED BY LIFETIME RELEASES
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {rows
            .slice()
            .reverse()
            .map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  background: r.isPlayer ? CREAM_2 : "transparent",
                  border: r.isPlayer ? `2.5px solid ${INK}` : "2.5px solid transparent",
                  borderRadius: 10,
                  boxShadow: r.isPlayer ? `2px 2px 0 ${INK}` : "none",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 16,
                    height: 12,
                    background: r.color,
                    border: `1.5px solid ${INK}`,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontWeight: r.isPlayer ? 700 : 600,
                    color: INK,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.85rem",
                  }}
                  title={r.name}
                >
                  {r.isPlayer && (
                    <span
                      style={{
                        fontFamily: "Paytone One, sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        background: PINK,
                        color: "#fff",
                        border: `1.5px solid ${INK}`,
                        borderRadius: 6,
                        padding: "0 6px",
                        marginRight: 6,
                        textShadow: `1px 1px 0 ${INK}`,
                      }}
                    >
                      YOU
                    </span>
                  )}
                  {r.name}
                </span>
                <span
                  className="tabular"
                  style={{
                    fontFamily: "Paytone One, sans-serif",
                    fontSize: "0.9rem",
                    color: INK,
                  }}
                >
                  {r.total}
                </span>
              </div>
            ))}
        </div>
        <div
          className="mt-2 text-xs"
          style={{ color: DIM, fontWeight: 600 }}
        >
          Stacked absolute counts, not share %. Thicker ink outline = your band.
        </div>
      </div>
    </div>
  );
}
