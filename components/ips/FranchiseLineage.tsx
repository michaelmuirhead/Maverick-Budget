"use client";

// Franchise Lineage — horizontal chain of releases (and in-development
// sequels) under an IP. Lives inline on the IPs page so players can see
// the shape of each franchise without leaving the screen.
//
// Data model note: MGT's IP graph is currently linear (every project with
// the same ipId is a successor to the previous one — true spinoff/branch
// relationships aren't modeled yet). This component renders a linear
// timeline with a REBOOT marker at lastRebootDate if the IP has been
// rebooted. Leaving room for branching later without changing the props.

import { useMemo } from "react";
import Link from "next/link";
import type { GameState, IP, Project } from "@/engine";
import { formatDate } from "@/lib/format";

interface Props {
  ip: IP;
  state: GameState;
}

// Cartoon palette
const INK = "#1f1d3a";
const CREAM = "#fdf3d8";
const PINK = "#ff5fa2";
const TEAL = "#2dc7b8";
const MUSTARD = "#ffc233";
const PURPLE = "#9c6bff";
const DIM = "#7d7a99";

export function FranchiseLineage({ ip, state }: Props) {
  const nodes = useMemo(() => buildLineage(ip, state), [ip, state]);

  // Nothing to draw for a lone first release
  if (nodes.length < 2) return null;

  return (
    <div
      className="border rounded-[10px] p-3 mb-3 overflow-x-auto"
      style={{
        borderColor: "var(--bg-2)",
        background: "color-mix(in srgb, var(--bg-1) 50%, transparent)",
      }}
    >
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)]">
          Franchise lineage
        </div>
        <div className="text-[10px] text-[color:var(--amber-dim)]">
          {nodes.filter((n) => n.kind === "released").length} released
          {nodes.some((n) => n.kind === "in_dev") && (
            <> · {nodes.filter((n) => n.kind === "in_dev").length} in dev</>
          )}
          {ip.rebootCount ? <> · {ip.rebootCount} reboot{ip.rebootCount === 1 ? "" : "s"}</> : null}
        </div>
      </div>

      <div
        className="flex items-stretch gap-0 py-2"
        style={{ minWidth: "fit-content" }}
      >
        {nodes.map((node, i) => (
          <div key={node.key} className="flex items-stretch">
            {i > 0 && <Connector kind={node.precedingEdge} />}
            <LineageCard node={node} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- subcomponents ----------

function LineageCard({ node }: { node: LineageNode }) {
  if (node.kind === "reboot_marker") {
    return (
      <div
        className="flex flex-col items-center justify-center px-3"
        style={{ minWidth: 72 }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            background: PURPLE,
            border: `3px solid ${INK}`,
            color: CREAM,
            width: 40,
            height: 40,
            boxShadow: `3px 3px 0 ${INK}`,
            fontSize: 20,
            fontWeight: 700,
          }}
          title={`Rebooted ${formatDate(node.date)}`}
        >
          ↻
        </div>
        <div
          className="text-[10px] uppercase tracking-widest mt-1 font-semibold"
          style={{ color: INK, background: MUSTARD, padding: "1px 6px", borderRadius: 4 }}
        >
          Reboot
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: DIM }}>
          {yearOf(node.date)}
        </div>
      </div>
    );
  }

  const accent =
    node.kind === "in_dev"
      ? PURPLE
      : toneColorForScore(node.metacritic ?? 0);
  const bg = node.kind === "in_dev" ? `${CREAM}` : CREAM;
  const label =
    node.kind === "in_dev"
      ? "IN DEV"
      : node.metacritic != null
      ? `MC ${node.metacritic}`
      : "RELEASED";

  const card = (
    <div
      className="flex flex-col"
      style={{
        background: bg,
        border: `3px solid ${INK}`,
        borderRadius: 10,
        boxShadow: `3px 3px 0 ${INK}`,
        padding: "6px 10px 8px",
        minWidth: 150,
        maxWidth: 200,
        opacity: node.kind === "in_dev" ? 0.88 : 1,
      }}
    >
      {/* Accent top stripe */}
      <div
        style={{
          background: accent,
          height: 6,
          borderRadius: 3,
          margin: "-2px -4px 6px",
          border: `2px solid ${INK}`,
        }}
      />
      <div
        className="font-semibold text-sm leading-tight"
        style={{ color: INK, fontFamily: "Fredoka, sans-serif" }}
        title={node.title}
      >
        {truncate(node.title, 28)}
      </div>
      <div
        className="text-[10px] mt-0.5"
        style={{ color: DIM, fontFamily: "Fredoka, sans-serif" }}
      >
        {node.subtitle}
      </div>
      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{
            background: accent,
            color: node.kind === "in_dev" ? CREAM : INK,
            border: `1.5px solid ${INK}`,
          }}
        >
          {label}
        </span>
        {node.sequelBadge && (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              background: TEAL,
              color: INK,
              border: `1.5px solid ${INK}`,
            }}
          >
            {node.sequelBadge}
          </span>
        )}
      </div>
    </div>
  );

  return node.href ? (
    <Link
      href={node.href}
      className="!no-underline hover:brightness-105"
      style={{ textDecoration: "none" }}
    >
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  );
}

function Connector({ kind }: { kind: EdgeKind }) {
  // Horizontal arrow between cards. "reboot" edges get a different treatment
  // (dashed + marker) since the reboot-marker node sits beside them.
  const dashed = kind === "reboot";
  return (
    <div className="flex items-center justify-center px-1" style={{ minWidth: 24 }}>
      <svg viewBox="0 0 24 12" width="24" height="12">
        <line
          x1={0}
          y1={6}
          x2={20}
          y2={6}
          stroke={INK}
          strokeWidth={2.5}
          strokeDasharray={dashed ? "3 3" : undefined}
          strokeLinecap="round"
        />
        <polygon points="16,2 24,6 16,10" fill={INK} />
      </svg>
    </div>
  );
}

// ---------- data ----------

type EdgeKind = "sequential" | "reboot";

interface ReleasedNode {
  key: string;
  kind: "released";
  title: string;
  subtitle: string;      // e.g. "1995 · Oct 12"
  metacritic?: number;
  sequelBadge?: string;  // e.g. "II", "III"
  href?: string;
  precedingEdge: EdgeKind;
}

interface InDevNode {
  key: string;
  kind: "in_dev";
  title: string;
  subtitle: string;      // e.g. "target 1997-06-14"
  sequelBadge?: string;
  href?: string;
  precedingEdge: EdgeKind;
}

interface RebootMarkerNode {
  key: string;
  kind: "reboot_marker";
  date: string;
  precedingEdge: EdgeKind;
  title?: undefined;
}

type LineageNode = ReleasedNode | InDevNode | RebootMarkerNode;

function buildLineage(ip: IP, state: GameState): LineageNode[] {
  // Collect every project that belongs to this IP (released or in-dev).
  // We use project.ipId because ip.projectIds only tracks released games —
  // in-development sequels have ipId set at concept but aren't appended
  // until they ship.
  const all: Project[] = Object.values(state.projects).filter(
    (p) => p.ipId === ip.id && !p.cancelled
  );

  // Sort released by actualReleaseDate ASC, then in-dev by targetReleaseDate ASC.
  const released = all
    .filter((p) => p.status === "released" && p.actualReleaseDate)
    .sort((a, b) => (a.actualReleaseDate! < b.actualReleaseDate! ? -1 : 1));
  const inDev = all
    .filter((p) => p.status !== "released" && p.status !== "cancelled")
    .sort((a, b) => (a.targetReleaseDate < b.targetReleaseDate ? -1 : 1));

  const nodes: LineageNode[] = [];

  // Build released nodes
  for (const p of released) {
    nodes.push({
      key: `p-${p.id}`,
      kind: "released",
      title: p.name,
      subtitle: `${yearOf(p.actualReleaseDate!)} · ${shortMonthDay(p.actualReleaseDate!)}`,
      metacritic: p.metacriticScore,
      sequelBadge: p.isSequel && p.sequelNumber
        ? toRoman(p.sequelNumber)
        : undefined,
      href: `/projects/${p.id}`,
      precedingEdge: "sequential",
    });
  }

  // Insert reboot marker if the IP was rebooted. Best-effort: we only know
  // `lastRebootDate`, so we place a single marker before the first release
  // that followed it.
  if (ip.rebootCount && ip.lastRebootDate) {
    const rebootIso = ip.lastRebootDate;
    const insertIndex = nodes.findIndex((n) => {
      if (n.kind !== "released") return false;
      const p = state.projects[n.key.replace(/^p-/, "")];
      return !!p && !!p.actualReleaseDate && p.actualReleaseDate > rebootIso;
    });
    const marker: RebootMarkerNode = {
      key: `reboot-${ip.id}`,
      kind: "reboot_marker",
      date: rebootIso,
      precedingEdge: "reboot",
    };
    if (insertIndex === -1) {
      // Reboot is after every release so far — append at end (pre in-dev)
      nodes.push(marker);
    } else {
      // Mark the edge entering the next node as a reboot break
      if (nodes[insertIndex]) {
        nodes[insertIndex] = { ...nodes[insertIndex], precedingEdge: "reboot" } as LineageNode;
      }
      nodes.splice(insertIndex, 0, marker);
    }
  }

  // Append in-development sequels at the end
  for (const p of inDev) {
    nodes.push({
      key: `p-${p.id}`,
      kind: "in_dev",
      title: p.name,
      subtitle: `target ${formatDate(p.targetReleaseDate)}`,
      sequelBadge: p.isSequel && p.sequelNumber
        ? toRoman(p.sequelNumber)
        : undefined,
      href: `/projects/${p.id}`,
      precedingEdge: "sequential",
    });
  }

  return nodes;
}

// ---------- helpers ----------

function toneColorForScore(mc: number): string {
  if (mc >= 80) return TEAL;
  if (mc >= 60) return MUSTARD;
  return PINK;
}

function yearOf(iso: string): string {
  return iso.slice(0, 4);
}

function shortMonthDay(iso: string): string {
  // iso is YYYY-MM-DD
  const parts = iso.split("-");
  if (parts.length < 3) return iso;
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][parseInt(parts[1]!, 10) - 1];
  return `${month ?? parts[1]} ${parseInt(parts[2]!, 10)}`;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

function toRoman(n: number): string {
  if (n <= 0) return "";
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [8, "VIII"], [7, "VII"], [6, "VI"],
    [5, "V"], [4, "IV"], [3, "III"], [2, "II"], [1, "I"],
  ];
  let s = "";
  let x = n;
  for (const [v, sym] of map) {
    while (x >= v) {
      s += sym;
      x -= v;
    }
  }
  return s;
}
