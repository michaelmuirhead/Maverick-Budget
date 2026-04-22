"use client";

// Team skills radar.
//
// Six-axis polar chart over the canonical StaffStats fields. Two layers:
//   - filled pink polygon: roster mean per axis
//   - dashed teal outline: per-axis peak (best individual on staff)
//
// The two layers together let the player see balance ("are we lopsided?")
// and depth ("do we have a star to lean on?") at a glance. Each axis label
// includes the mean and peak value as text so the chart stays useful at
// small sizes where the polygon shape alone is hard to read.

import { useMemo } from "react";
import type { Staff, StaffStats } from "@/engine";

interface Props {
  staff: Staff[];
}

// Cartoon palette — aligned with the other new charts.
const INK = "#1f1d3a";
const CREAM_2 = "#fae9bf";
const PINK = "#ff5fa2";
const TEAL = "#2dc7b8";
const MUSTARD = "#ffc233";
const DIM = "#7d7a99";

const AXES: Array<{ key: keyof StaffStats; label: string; short: string }> = [
  { key: "design",  label: "Design",  short: "DES"  },
  { key: "tech",    label: "Tech",    short: "TECH" },
  { key: "art",     label: "Art",     short: "ART"  },
  { key: "sound",   label: "Sound",   short: "SND"  },
  { key: "writing", label: "Writing", short: "WRT"  },
  { key: "speed",   label: "Speed",   short: "SPD"  },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
const RING_STEPS = 4; // 25, 50, 75, 100

export function TeamSkillsRadar({ staff }: Props) {
  const employed = useMemo(
    () => staff.filter((s) => s.status === "employed"),
    [staff]
  );

  if (employed.length === 0) {
    return (
      <div
        className="py-10 px-4 text-center text-sm"
        style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
      >
        Hire your first staff member to see your team's strengths.
      </div>
    );
  }

  // Compute mean + peak (with the peak person's name) per axis.
  const stats = AXES.map((axis) => {
    let sum = 0;
    let peak = 0;
    let peakName = "";
    for (const s of employed) {
      const v = s.stats[axis.key];
      sum += v;
      if (v > peak) {
        peak = v;
        peakName = s.name;
      }
    }
    const mean = sum / employed.length;
    return { ...axis, mean, peak, peakName };
  });

  // Polar geometry — start at top (12 o'clock) and proceed clockwise.
  // 6 axes → 60° between each.
  const angleOf = (i: number) => -Math.PI / 2 + (i / AXES.length) * Math.PI * 2;
  const pointFor = (i: number, value: number) => {
    const r = (value / 100) * RADIUS;
    const a = angleOf(i);
    return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)] as const;
  };

  const meanPath = stats
    .map((s, i) => pointFor(i, s.mean))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ") + " Z";

  const peakPath = stats
    .map((s, i) => pointFor(i, s.peak))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ") + " Z";

  // Concentric reference rings (25/50/75/100).
  const rings = Array.from({ length: RING_STEPS }, (_, k) => ((k + 1) / RING_STEPS) * RADIUS);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Radar */}
      <div className="shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          {/* Reference rings */}
          {rings.map((r, k) => (
            <polygon
              key={`ring-${k}`}
              points={AXES.map((_, i) => {
                const a = angleOf(i);
                return `${CENTER + r * Math.cos(a)},${CENTER + r * Math.sin(a)}`;
              }).join(" ")}
              fill="none"
              stroke={INK}
              strokeWidth={1}
              strokeDasharray={k === RING_STEPS - 1 ? undefined : "2 4"}
              opacity={k === RING_STEPS - 1 ? 0.5 : 0.18}
            />
          ))}

          {/* Axis spokes */}
          {AXES.map((_, i) => {
            const a = angleOf(i);
            return (
              <line
                key={`spoke-${i}`}
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + RADIUS * Math.cos(a)}
                y2={CENTER + RADIUS * Math.sin(a)}
                stroke={INK}
                strokeWidth={1}
                opacity={0.25}
              />
            );
          })}

          {/* Mean polygon (filled pink) */}
          <path
            d={meanPath}
            fill={PINK}
            fillOpacity={0.35}
            stroke={PINK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Peak polygon (dashed teal outline) */}
          <path
            d={peakPath}
            fill="none"
            stroke={TEAL}
            strokeWidth={2.5}
            strokeDasharray="5 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Mean vertex dots */}
          {stats.map((s, i) => {
            const [x, y] = pointFor(i, s.mean);
            return (
              <circle
                key={`mdot-${s.key}`}
                cx={x}
                cy={y}
                r={3.5}
                fill={PINK}
                stroke={INK}
                strokeWidth={1.5}
              >
                <title>
                  {s.label} — average {s.mean.toFixed(0)} across {employed.length} staff
                </title>
              </circle>
            );
          })}

          {/* Peak vertex dots — mustard */}
          {stats.map((s, i) => {
            const [x, y] = pointFor(i, s.peak);
            return (
              <circle
                key={`pdot-${s.key}`}
                cx={x}
                cy={y}
                r={3.5}
                fill={MUSTARD}
                stroke={INK}
                strokeWidth={1.5}
              >
                <title>
                  {s.label} peak — {s.peak} ({s.peakName})
                </title>
              </circle>
            );
          })}

          {/* Axis labels (offset outward from each vertex) */}
          {AXES.map((axis, i) => {
            const a = angleOf(i);
            const labelR = RADIUS + 18;
            const x = CENTER + labelR * Math.cos(a);
            const y = CENTER + labelR * Math.sin(a);
            // Anchor based on which side of the circle we're on so labels
            // don't overlap the rings.
            const anchor =
              Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
            return (
              <text
                key={`label-${axis.key}`}
                x={x}
                y={y + 4}
                textAnchor={anchor}
                fontSize={11}
                fill={INK}
                fontFamily="Paytone One, sans-serif"
                fontWeight={700}
              >
                {axis.short}
              </text>
            );
          })}

          {/* Center label */}
          <text
            x={CENTER}
            y={CENTER + 4}
            textAnchor="middle"
            fontSize={9}
            fill={DIM}
            fontFamily="Fredoka, sans-serif"
          >
            {employed.length} on staff
          </text>
        </svg>
      </div>

      {/* Per-axis breakdown table */}
      <div className="flex-1 w-full">
        <table className="w-full text-sm" style={{ fontFamily: "Fredoka, sans-serif", color: INK }}>
          <thead>
            <tr style={{ color: DIM, fontSize: "0.7rem", letterSpacing: "0.06em" }}>
              <th className="text-left pb-1.5 font-semibold">SKILL</th>
              <th className="text-right pb-1.5 font-semibold">AVG</th>
              <th className="text-right pb-1.5 font-semibold">PEAK</th>
              <th className="text-left pb-1.5 pl-3 font-semibold">STAR</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr
                key={s.key}
                style={{ borderTop: `1px solid ${CREAM_2}` }}
              >
                <td className="py-1.5">{s.label}</td>
                <td className="py-1.5 text-right tabular">
                  <span style={{ color: PINK, fontWeight: 600 }}>
                    {s.mean.toFixed(0)}
                  </span>
                </td>
                <td className="py-1.5 text-right tabular">
                  <span style={{ color: MUSTARD, fontWeight: 700 }}>
                    {s.peak}
                  </span>
                </td>
                <td
                  className="py-1.5 pl-3 truncate"
                  style={{ color: DIM, maxWidth: 140 }}
                  title={s.peakName}
                >
                  {s.peakName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div
          className="flex flex-wrap items-center gap-3 mt-3 text-xs"
          style={{ fontFamily: "Fredoka, sans-serif", color: DIM }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              style={{
                width: 12,
                height: 12,
                background: PINK,
                opacity: 0.55,
                border: `1.5px solid ${PINK}`,
                borderRadius: 3,
                display: "inline-block",
              }}
            />
            Team average
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width={22} height={8}>
              <line
                x1={1}
                y1={4}
                x2={21}
                y2={4}
                stroke={TEAL}
                strokeWidth={2.5}
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            </svg>
            Peak (best individual)
          </span>
        </div>
      </div>
    </div>
  );
}
