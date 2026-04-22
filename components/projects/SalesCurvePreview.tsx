"use client";

// Sales Curve Preview — rendered inside the READY TO SHIP panel so the
// player can see, before approving the release, the shape of the sales
// curve their game will follow. The curve depends on Metacritic, which
// hasn't been rolled yet — so this previews "if your reviews land near
// the production-quality estimate, here's what to expect" plus three
// reference scenarios (flop / mid / hit) so the player can read the
// mechanic, not just the number.
//
// Math source of truth lives in engine/systems/release.ts —
// computeProjectBaseQuality + salesCurveParamsForScore + salesCurveDailyShare.

import { useMemo } from "react";
import {
  computeProjectBaseQuality,
  salesCurveParamsForScore,
  salesCurveDailyShare,
  type Project,
} from "@/engine";

interface Props {
  project: Project;
}

// Visual constants (cartoon palette — match chart-examples.html)
const INK = "#1f1d3a";
const CREAM = "#fdf3d8";
const PINK = "#ff5fa2";
const MUSTARD = "#ffc233";
const TEAL = "#2dc7b8";
const PURPLE = "#9c6bff";
const DIM = "#7d7a99";

const VIEW_W = 720;
const VIEW_H = 240;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;
const SAMPLE_COUNT = 180;

export function SalesCurvePreview({ project }: Props) {
  const data = useMemo(() => buildPreviewData(project), [project]);

  return (
    <div className="border border-[color:var(--bg-2)] rounded-[12px] p-3 mt-4">
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)]">
          Projected sales curve
        </div>
        <div className="text-[10px] text-[color:var(--amber-dim)]">
          Production quality ≈ MC {data.estimatedScore} · reviews not yet rolled
        </div>
      </div>

      {/* Main curve at the estimated score */}
      <CurveSvg
        params={data.estimated.params}
        scoreLabel={`MC ${data.estimatedScore}`}
        strokeColor={PINK}
        fillColor={`${PINK}22`}
      />

      {/* Stat row — same numbers the engine will use the moment you ship */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        <PreviewStat
          label="Days on sale"
          value={`${data.estimated.params.lifetimeDays}d`}
          sub={lifetimeLabel(data.estimated.params.lifetimeDays)}
        />
        <PreviewStat
          label="Launch week share"
          value={`${(data.estimated.launchWeekShare * 100).toFixed(0)}%`}
          sub="of lifetime revenue"
          accent
        />
        <PreviewStat
          label="Peak day"
          value={`${(data.estimated.dayOneShare * 100).toFixed(1)}%`}
          sub="of total earned on day 1"
        />
        <PreviewStat
          label="Half-life"
          value={`${data.estimated.params.decayHalfLife}d`}
          sub="daily sales halve"
        />
      </div>

      {/* Three reference scenarios so the player can read the mechanic */}
      <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mt-4 mb-2">
        Reference scenarios
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {data.scenarios.map((s) => (
          <ScenarioRow key={s.label} scenario={s} />
        ))}
      </div>

      <div className="text-[10px] text-[color:var(--amber-dim)] mt-3 leading-snug">
        Reviews aren&apos;t rolled until you approve the release. This is the curve shape
        for your <em>production quality</em> — visible bugs, marketing, hype, franchise
        affinity, and market shifts all push the actual revenue up or down. Flops
        front-load harder than hits and die in 2 months; a 90+ runs for 2 years.
      </div>
    </div>
  );
}

// ---------- subcomponents ----------

function CurveSvg({
  params,
  scoreLabel,
  strokeColor,
  fillColor,
}: {
  params: ReturnType<typeof salesCurveParamsForScore>;
  scoreLabel: string;
  strokeColor: string;
  fillColor: string;
}) {
  const points = useMemo(() => sampleCurve(params, SAMPLE_COUNT), [params]);
  // y-axis max — use the day-0 (peak) sample so the launch spike fills the chart.
  const peakShare = points[0]?.share ?? 0;
  const yMax = peakShare > 0 ? peakShare : 1;

  // Coordinates
  const toX = (dayFrac: number) => PAD_L + dayFrac * PLOT_W;
  const toY = (share: number) => PAD_T + (1 - share / yMax) * PLOT_H;

  // Build path strings
  const linePath =
    "M " +
    points
      .map((p) => `${toX(p.dayFrac).toFixed(1)} ${toY(p.share).toFixed(1)}`)
      .join(" L ");
  const areaPath =
    linePath +
    ` L ${toX(1).toFixed(1)} ${(PAD_T + PLOT_H).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PAD_T + PLOT_H).toFixed(1)} Z`;

  // Launch-week shaded zone. width in plot-fraction = 7 / lifetimeDays.
  const launchWidthFrac = Math.min(1, 7 / params.lifetimeDays);
  const launchZoneX = toX(0);
  const launchZoneW = toX(launchWidthFrac) - toX(0);

  // Y-axis ticks (just 0 and peak labels, no clutter)
  const yTickShares = [0, yMax * 0.5, yMax];

  // X-axis ticks: choose 3-4 nice day markers based on lifetime
  const xTicks = chooseDayTicks(params.lifetimeDays);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-auto"
      style={{ background: CREAM, borderRadius: 8 }}
      aria-label={`Projected sales decay curve at ${scoreLabel}`}
    >
      {/* Plot frame */}
      <rect
        x={PAD_L}
        y={PAD_T}
        width={PLOT_W}
        height={PLOT_H}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        rx={6}
      />

      {/* Launch-week mustard zone */}
      <rect
        x={launchZoneX}
        y={PAD_T}
        width={launchZoneW}
        height={PLOT_H}
        fill={MUSTARD}
        opacity={0.35}
      />
      <text
        x={launchZoneX + launchZoneW / 2}
        y={PAD_T + 14}
        textAnchor="middle"
        fontFamily="Fredoka, sans-serif"
        fontSize={10}
        fontWeight={600}
        fill={INK}
      >
        LAUNCH WEEK
      </text>

      {/* Y gridlines */}
      {yTickShares.map((s, i) => (
        <line
          key={`y-${i}`}
          x1={PAD_L}
          y1={toY(s)}
          x2={PAD_L + PLOT_W}
          y2={toY(s)}
          stroke={DIM}
          strokeWidth={1}
          strokeDasharray="2 4"
          opacity={0.4}
        />
      ))}

      {/* Area fill under curve */}
      <path d={areaPath} fill={fillColor} />

      {/* Curve line */}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Day-1 dot marker */}
      <circle
        cx={toX(0)}
        cy={toY(peakShare)}
        r={5}
        fill={MUSTARD}
        stroke={INK}
        strokeWidth={2}
      />

      {/* X-axis tick labels */}
      {xTicks.map((t, i) => {
        const frac = t / params.lifetimeDays;
        return (
          <g key={`x-${i}`}>
            <line
              x1={toX(frac)}
              y1={PAD_T + PLOT_H}
              x2={toX(frac)}
              y2={PAD_T + PLOT_H + 4}
              stroke={INK}
              strokeWidth={2}
            />
            <text
              x={toX(frac)}
              y={PAD_T + PLOT_H + 16}
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif"
              fontSize={10}
              fill={INK}
            >
              {dayLabel(t)}
            </text>
          </g>
        );
      })}

      {/* Y-axis label */}
      <text
        x={6}
        y={PAD_T + PLOT_H / 2}
        transform={`rotate(-90 6 ${PAD_T + PLOT_H / 2})`}
        textAnchor="middle"
        fontFamily="Fredoka, sans-serif"
        fontSize={9}
        fontWeight={600}
        fill={INK}
        opacity={0.7}
      >
        DAILY REVENUE SHARE
      </text>

      {/* Score label badge in the top-right of the plot area */}
      <g transform={`translate(${PAD_L + PLOT_W - 8}, ${PAD_T + 8})`}>
        <rect
          x={-66}
          y={0}
          width={66}
          height={20}
          fill={PURPLE}
          stroke={INK}
          strokeWidth={2}
          rx={4}
        />
        <text
          x={-33}
          y={14}
          textAnchor="middle"
          fontFamily="Paytone One, sans-serif"
          fontSize={11}
          fill={CREAM}
        >
          {scoreLabel}
        </text>
      </g>
    </svg>
  );
}

function PreviewStat({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-[color:var(--bg-2)] rounded-[8px] px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-widest text-[color:var(--amber-dim)]">
        {label}
      </div>
      <div
        className={`tabular text-base ${
          accent ? "text-[color:var(--amber-bright)]" : "text-[color:var(--amber)]"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-[color:var(--amber-dim)] leading-tight">
          {sub}
        </div>
      )}
    </div>
  );
}

function ScenarioRow({ scenario }: { scenario: Scenario }) {
  const tone =
    scenario.label === "Flop"
      ? PINK
      : scenario.label === "Hit"
      ? TEAL
      : MUSTARD;
  return (
    <div className="border border-[color:var(--bg-2)] rounded-[8px] p-2 flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ background: tone, border: `2px solid ${INK}` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[color:var(--amber-bright)]">
          {scenario.label} · MC {scenario.mc}
        </div>
        <div className="text-[10px] text-[color:var(--amber-dim)] tabular leading-tight">
          {scenario.params.lifetimeDays}d on sale ·{" "}
          {(scenario.launchWeekShare * 100).toFixed(0)}% launch ·{" "}
          {scenario.params.launchWeekBoost.toFixed(1)}× boost
        </div>
      </div>
    </div>
  );
}

// ---------- pure data ----------

interface ScenarioMetrics {
  params: ReturnType<typeof salesCurveParamsForScore>;
  launchWeekShare: number; // sum of days 0..6
  dayOneShare: number;     // day 0
}

interface Scenario extends ScenarioMetrics {
  label: "Flop" | "Mid" | "Hit";
  mc: number;
}

interface PreviewData {
  estimatedScore: number;
  estimated: ScenarioMetrics;
  scenarios: Scenario[];
}

function buildPreviewData(project: Project): PreviewData {
  const baseQ = computeProjectBaseQuality(project);
  // baseQuality is already a 0-100 number. We don't apply a bug penalty here
  // because visible bugs at launch aren't known until reviews roll, but we
  // do show the player they can move the curve up by polishing more.
  const estimatedScore = Math.max(5, Math.min(100, Math.round(baseQ)));

  const estimated = computeScenarioMetrics(estimatedScore);

  const scenarios: Scenario[] = [
    { label: "Flop", mc: 35, ...computeScenarioMetrics(35) },
    { label: "Mid", mc: 65, ...computeScenarioMetrics(65) },
    { label: "Hit", mc: 88, ...computeScenarioMetrics(88) },
  ];

  return { estimatedScore, estimated, scenarios };
}

function computeScenarioMetrics(mc: number): ScenarioMetrics {
  const params = salesCurveParamsForScore(mc);
  let launchWeekShare = 0;
  for (let d = 0; d < 7 && d < params.lifetimeDays; d++) {
    launchWeekShare += salesCurveDailyShare(d, params);
  }
  const dayOneShare = salesCurveDailyShare(0, params);
  return { params, launchWeekShare, dayOneShare };
}

function sampleCurve(
  params: ReturnType<typeof salesCurveParamsForScore>,
  sampleCount: number
): { dayFrac: number; share: number }[] {
  const out: { dayFrac: number; share: number }[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const dayFrac = i / (sampleCount - 1);
    const day = Math.min(params.lifetimeDays - 1, Math.round(dayFrac * (params.lifetimeDays - 1)));
    out.push({ dayFrac, share: salesCurveDailyShare(day, params) });
  }
  return out;
}

function chooseDayTicks(lifetimeDays: number): number[] {
  if (lifetimeDays >= 540) return [0, 90, 180, 365, 540, lifetimeDays].filter((d) => d <= lifetimeDays);
  if (lifetimeDays >= 365) return [0, 30, 90, 180, 365];
  if (lifetimeDays >= 240) return [0, 14, 60, 120, 240];
  if (lifetimeDays >= 120) return [0, 7, 30, 60, 120];
  return [0, 7, 30, lifetimeDays];
}

function dayLabel(d: number): string {
  if (d === 0) return "0";
  if (d % 365 === 0) return `${d / 365}y`;
  if (d % 30 === 0) return `${d / 30}mo`;
  if (d % 7 === 0 && d <= 28) return `${d / 7}w`;
  return `${d}d`;
}

function lifetimeLabel(days: number): string {
  if (days >= 365) {
    const yrs = days / 365;
    return `~${yrs >= 2 ? yrs.toFixed(0) : yrs.toFixed(1)}y`;
  }
  return `~${Math.round(days / 30)}mo`;
}
