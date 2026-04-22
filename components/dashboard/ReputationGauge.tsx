"use client";

// Studio reputation gauge.
//
// Half-dial gauge mapping studio.reputation (0–100) onto a sweep from left
// (0) to right (100). Design goals:
//
//   - Big legible value + tier label in the center sticker.
//   - Tier ticks and labels around the rim so the player can see at a glance
//     where they sit on the four-tier scale (INDIE / ESTABLISHED / MAJOR /
//     LEGENDARY) and what the next milestone is.
//   - Pre-penalty "could recover to" arc rendered as a dashed extension when
//     there are outstanding reputation hits — shows how much rep is sitting
//     in the penalty pool waiting to heal.
//   - Pure inline SVG, cartoon palette, hover-only motion (consistent with
//     the other new charts).

import { useMemo } from "react";

// Cartoon palette — aligned with the sales/cash/Gantt/radar charts.
const INK = "#1a1a22";
const INK_SOFT = "#3b3646";
const CREAM = "#fff8e1";
const CREAM_2 = "#fff0c2";
const PINK = "#ff6fa1";
const PINK_DEEP = "#ff4d6d";
const TEAL = "#2ec4a6";
const TEAL_DEEP = "#1fa289";
const MUSTARD = "#ffd93e";
const PURPLE = "#a274e8";

interface Tier {
  id: "indie" | "established" | "major" | "legendary";
  label: string;
  min: number;       // inclusive lower bound
  max: number;       // exclusive upper bound (100 for legendary acts as inclusive)
  color: string;
  blurb: string;
}

const TIERS: Tier[] = [
  { id: "indie",       label: "INDIE",       min: 0,  max: 25,  color: PINK,    blurb: "scrappy beginnings" },
  { id: "established", label: "ESTABLISHED", min: 25, max: 50,  color: MUSTARD, blurb: "on the radar"        },
  { id: "major",       label: "MAJOR",       min: 50, max: 75,  color: TEAL,    blurb: "industry player"     },
  { id: "legendary",   label: "LEGENDARY",   min: 75, max: 101, color: PURPLE,  blurb: "icon status"         },
];

function tierFor(rep: number): Tier {
  return TIERS.find((t) => rep >= t.min && rep < t.max) ?? TIERS[TIERS.length - 1]!;
}

interface Props {
  reputation: number;       // 0-100
  outstandingPenalty?: number; // 0-100, how much rep is sitting in unhealed hits
}

// Geometry — half-dial that sits across the top half of the SVG, value-arc
// thickness picked to read clearly at this size without overpowering the
// center sticker.
const W = 320;
const H = 200;
const CX = W / 2;
const CY = 168;          // center of the dial sits low so the arc fills above
const R_OUTER = 130;
const R_INNER = 102;
const R_VALUE_MID = (R_OUTER + R_INNER) / 2; // center-line of arc thickness

// Helpers — angle math runs across the top of the dial.
//   value 0   → 180° (pointing left)
//   value 100 → 0°   (pointing right)
// We work in radians.
const angleFor = (value: number) => Math.PI * (1 - value / 100);
const polar = (r: number, a: number): [number, number] => [
  CX + r * Math.cos(a),
  CY - r * Math.sin(a), // SVG y flipped
];

// Build an SVG arc path along the dial center-line, from value v0 → v1.
// Used for both the gradient backdrop track and the colored value arc.
function arcPath(v0: number, v1: number, r: number): string {
  const a0 = angleFor(v0);
  const a1 = angleFor(v1);
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  // Always sweep left-to-right (value increasing → angle decreasing).
  const largeArc = Math.abs(a0 - a1) > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`;
}

export function ReputationGauge({ reputation, outstandingPenalty = 0 }: Props) {
  const clamped = Math.max(0, Math.min(100, reputation));
  const tier = useMemo(() => tierFor(clamped), [clamped]);
  const nextTier = TIERS.find((t) => t.min > clamped);
  const pointsToNext = nextTier ? Math.max(0, nextTier.min - clamped) : 0;

  // Pre-penalty rep — what reputation would be if all currently-unhealed
  // hits had decayed to zero. Used to draw the dashed "ghost" extension.
  const ghostEnd = Math.min(100, clamped + Math.max(0, outstandingPenalty));
  const hasGhost = ghostEnd - clamped > 0.5;

  // Pointer geometry.
  const pointerAngle = angleFor(clamped);
  const [pX, pY] = polar(R_OUTER + 4, pointerAngle); // tip just past the rim
  const [bX, bY] = polar(R_INNER - 6, pointerAngle); // base just inside the dial

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="shrink-0">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Studio reputation">
          {/* Track — cream-2 thick band along the dial */}
          <path
            d={arcPath(0, 100, R_VALUE_MID)}
            stroke={CREAM_2}
            strokeWidth={R_OUTER - R_INNER}
            fill="none"
            strokeLinecap="butt"
          />

          {/* Tier color bands — subtle backdrop showing where each tier sits */}
          {TIERS.map((t) => {
            const v0 = Math.max(0, t.min);
            const v1 = Math.min(100, t.max - 1); // pull back so bands don't visually overlap
            return (
              <path
                key={`band-${t.id}`}
                d={arcPath(v0, v1, R_VALUE_MID)}
                stroke={t.color}
                strokeWidth={R_OUTER - R_INNER}
                fill="none"
                opacity={0.18}
                strokeLinecap="butt"
              />
            );
          })}

          {/* Value arc — solid colored using the current tier's color */}
          <path
            d={arcPath(0, clamped, R_VALUE_MID)}
            stroke={tier.color}
            strokeWidth={R_OUTER - R_INNER - 4}
            fill="none"
            strokeLinecap="round"
          />

          {/* Ghost arc — dashed extension showing rep waiting to heal */}
          {hasGhost && (
            <path
              d={arcPath(clamped, ghostEnd, R_VALUE_MID)}
              stroke={MUSTARD}
              strokeWidth={R_OUTER - R_INNER - 8}
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            >
              <title>
                +{Math.round(ghostEnd - clamped)} rep waiting to heal from active hits
              </title>
            </path>
          )}

          {/* Outer dial border — thick ink ring, sticker style */}
          <path
            d={arcPath(0, 100, R_OUTER)}
            stroke={INK}
            strokeWidth={2.5}
            fill="none"
          />
          <path
            d={arcPath(0, 100, R_INNER)}
            stroke={INK}
            strokeWidth={2.5}
            fill="none"
          />
          {/* Cap the ends so the dial reads as a sealed ring */}
          {[0, 100].map((v) => {
            const a = angleFor(v);
            const [xO, yO] = polar(R_OUTER, a);
            const [xI, yI] = polar(R_INNER, a);
            return (
              <line
                key={`cap-${v}`}
                x1={xO}
                y1={yO}
                x2={xI}
                y2={yI}
                stroke={INK}
                strokeWidth={2.5}
              />
            );
          })}

          {/* Tier dividers + labels at 25/50/75 */}
          {[25, 50, 75].map((v) => {
            const a = angleFor(v);
            const [xO, yO] = polar(R_OUTER + 2, a);
            const [xI, yI] = polar(R_INNER - 2, a);
            const [lx, ly] = polar(R_OUTER + 16, a);
            const t = TIERS.find((tt) => tt.min === v)!;
            return (
              <g key={`tick-${v}`}>
                <line x1={xI} y1={yI} x2={xO} y2={yO} stroke={INK} strokeWidth={1.8} />
                <text
                  x={lx}
                  y={ly + 3}
                  textAnchor="middle"
                  fontSize={9}
                  fill={INK_SOFT}
                  fontFamily="Paytone One, sans-serif"
                  fontWeight={700}
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* Endpoint labels — 0 and 100 */}
          {[
            { v: 0,   anchor: "start" as const,  dx:  4 },
            { v: 100, anchor: "end"   as const,  dx: -4 },
          ].map(({ v, anchor, dx }) => {
            const a = angleFor(v);
            const [x, y] = polar(R_INNER - 14, a);
            return (
              <text
                key={`end-${v}`}
                x={x + dx}
                y={y + 3}
                textAnchor={anchor}
                fontSize={9}
                fill={INK_SOFT}
                fontFamily="Fredoka, sans-serif"
                fontWeight={700}
                className="tabular"
              >
                {v}
              </text>
            );
          })}

          {/* Pointer needle — ink shaft + tier-colored circle at tip */}
          <line
            x1={bX}
            y1={bY}
            x2={pX}
            y2={pY}
            stroke={INK}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <circle cx={pX} cy={pY} r={6} fill={tier.color} stroke={INK} strokeWidth={2} />
          {/* Center hub */}
          <circle cx={CX} cy={CY} r={9} fill={CREAM} stroke={INK} strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={3.5} fill={INK} />

          {/* Center sticker — value + tier label, sits above the hub */}
          <g transform={`translate(${CX}, ${CY - 70})`}>
            {/* Sticker rect */}
            <rect
              x={-58}
              y={-26}
              width={116}
              height={50}
              rx={12}
              ry={12}
              fill={CREAM}
              stroke={INK}
              strokeWidth={2.5}
            />
            {/* Sticker shadow — drawn behind by translating */}
            <rect
              x={-58 + 3}
              y={-26 + 3}
              width={116}
              height={50}
              rx={12}
              ry={12}
              fill={INK}
              opacity={0}
            />
            <text
              x={0}
              y={-2}
              textAnchor="middle"
              fontSize={28}
              fill={INK}
              fontFamily="Paytone One, sans-serif"
              className="tabular"
            >
              {Math.round(clamped)}
            </text>
            <text
              x={0}
              y={16}
              textAnchor="middle"
              fontSize={10}
              fill={tier.color === MUSTARD ? INK : tier.color}
              fontFamily="Paytone One, sans-serif"
              fontWeight={700}
              letterSpacing={1}
            >
              {tier.label}
            </text>
          </g>
        </svg>
      </div>

      {/* Side panel — tier description + next-milestone progress */}
      <div className="flex-1 w-full" style={{ fontFamily: "Fredoka, sans-serif", color: INK }}>
        {/* Current tier card */}
        <div
          style={{
            background: CREAM_2,
            border: `2.5px solid ${INK}`,
            borderRadius: 14,
            boxShadow: `3px 3px 0 ${INK}`,
            padding: "0.55rem 0.75rem",
          }}
        >
          <div
            style={{
              fontFamily: "Paytone One, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: INK_SOFT,
            }}
          >
            CURRENT TIER
          </div>
          <div
            style={{
              fontFamily: "Paytone One, sans-serif",
              fontSize: "1.1rem",
              color: tier.color === MUSTARD ? INK : tier.color,
              marginTop: 1,
            }}
          >
            {tier.label}
            <span style={{ color: INK_SOFT, fontFamily: "Fredoka, sans-serif", fontSize: "0.78rem", fontWeight: 600, marginLeft: 8 }}>
              · {tier.blurb}
            </span>
          </div>
        </div>

        {/* Next milestone */}
        {nextTier ? (
          <div
            style={{
              marginTop: 10,
              padding: "0.45rem 0.75rem",
              background: CREAM,
              border: `2px dashed ${INK}`,
              borderRadius: 12,
              fontSize: "0.78rem",
              fontWeight: 600,
              color: INK_SOFT,
            }}
          >
            <span style={{ color: INK, fontFamily: "Paytone One, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", marginRight: 6 }}>
              NEXT
            </span>
            <span className="tabular" style={{ color: nextTier.color === MUSTARD ? INK : nextTier.color, fontWeight: 700 }}>
              {pointsToNext} pt{pointsToNext === 1 ? "" : "s"}
            </span>{" "}
            to{" "}
            <span style={{ color: nextTier.color === MUSTARD ? INK : nextTier.color, fontWeight: 700, fontFamily: "Paytone One, sans-serif" }}>
              {nextTier.label}
            </span>
          </div>
        ) : (
          <div
            style={{
              marginTop: 10,
              padding: "0.45rem 0.75rem",
              background: PURPLE,
              color: "#fff",
              border: `2px solid ${INK}`,
              borderRadius: 12,
              fontSize: "0.78rem",
              fontWeight: 700,
              boxShadow: `3px 3px 0 ${INK}`,
              textShadow: `1px 1px 0 ${INK}`,
              fontFamily: "Paytone One, sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            MAX TIER REACHED — KEEP THE STREAK ALIVE
          </div>
        )}

        {/* Outstanding penalty callout */}
        {outstandingPenalty > 0 && (
          <div
            style={{
              marginTop: 10,
              padding: "0.45rem 0.75rem",
              background: CREAM,
              border: `2px solid ${INK}`,
              borderLeft: `6px solid ${PINK_DEEP}`,
              borderRadius: 12,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: INK,
              boxShadow: `3px 3px 0 ${INK}`,
            }}
          >
            <span style={{ color: PINK_DEEP, fontFamily: "Paytone One, sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", marginRight: 6 }}>
              −{Math.round(outstandingPenalty)} HELD
            </span>
            <span style={{ color: INK_SOFT }}>
              from active hits — heals back as the dashed arc.
            </span>
          </div>
        )}

        {/* Legend */}
        <div
          className="mt-2.5 flex flex-wrap gap-3 text-xs"
          style={{ color: INK_SOFT }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              style={{
                width: 14,
                height: 8,
                background: tier.color,
                borderRadius: 4,
                border: `1.5px solid ${INK}`,
                display: "inline-block",
              }}
            />
            Current rep
          </span>
          {hasGhost && (
            <span className="inline-flex items-center gap-1.5">
              <svg width={22} height={8}>
                <line
                  x1={1}
                  y1={4}
                  x2={21}
                  y2={4}
                  stroke={MUSTARD}
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
              Healing back
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper for callers (e.g. dashboard) that want to label the tier elsewhere
// without re-creating the constants.
export const REPUTATION_TIERS = TIERS.map((t) => ({
  id: t.id,
  label: t.label,
  min: t.min,
}));

export function reputationTierLabel(rep: number): string {
  return tierFor(rep).label;
}
