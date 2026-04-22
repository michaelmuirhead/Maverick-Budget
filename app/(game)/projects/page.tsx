"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { GENRE_BY_ID, THEME_BY_ID } from "@/engine";
import Link from "next/link";

const stickerHeading: React.CSSProperties = {
  background: "var(--teal)",
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

const cardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "3px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "5px 5px 0 var(--ink)",
};

const newProjectButton: React.CSSProperties = {
  background: "var(--pink)",
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

function ScoreChip({ score }: { score: number | null | undefined }) {
  if (score == null) {
    return (
      <span className="tabular" style={{ color: "var(--ink-soft)" }}>—</span>
    );
  }
  const tone =
    score >= 85
      ? { bg: "var(--teal)", color: "#fff" }
      : score >= 70
        ? { bg: "var(--mustard)", color: "var(--ink)" }
        : score < 60
          ? { bg: "var(--pink)", color: "#fff" }
          : { bg: "var(--cream-2)", color: "var(--ink)" };
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-md text-[11px] tabular"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
      }}
    >
      {score}
    </span>
  );
}

// Bug count chip — tone scales with severity. During dev we only have totalBugs;
// after release the more telling number is visibleBugs.
function BugChip({ count, label = "BUGS" }: { count: number; label?: string }) {
  const tone =
    count <= 0
      ? { bg: "var(--cream-2)", color: "var(--ink-soft)" }
      : count <= 15
        ? { bg: "var(--teal)", color: "#fff" }
        : count <= 40
          ? { bg: "var(--mustard)", color: "var(--ink)" }
          : { bg: "var(--pink)", color: "#fff" };
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] tabular"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
        fontWeight: 700,
      }}
      title={`${count} ${label.toLowerCase()}`}
    >
      {count} {label}
    </span>
  );
}

// Mirror of badStateThreshold from engine/systems/bugs.ts — lets us preview
// risk during development without having to call the simulation.
const BAD_STATE_BASE = 25;
const BAD_STATE_PER_SQRT_DAY = 2;
function devBadStateThreshold(daysAllocated: number): number {
  return BAD_STATE_BASE + Math.sqrt(Math.max(1, daysAllocated)) * BAD_STATE_PER_SQRT_DAY;
}

export default function ProjectsPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const all = Object.values(state.projects);
  const active = all.filter(
    (p) => p.status === "in_development" || p.status === "ready_to_release"
  );
  const released = all.filter((p) => p.status === "released");
  const cancelled = all.filter((p) => p.status === "cancelled");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          PROJECTS
        </h2>
        <Link
          href="/projects/new"
          className="!no-underline inline-flex items-center px-4 py-1.5 rounded-xl text-sm"
          style={newProjectButton}
        >
          + NEW PROJECT
        </Link>
      </div>

      <Panel title={`IN DEVELOPMENT (${active.length})`}>
        {active.length === 0 ? (
          <div className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>
            No active projects.
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((p) => {
              const current = p.phases[p.currentPhaseIndex]!;
              const overall =
                (p.currentPhaseIndex / p.phases.length) * 100 +
                current.completion / p.phases.length;
              const ready = p.status === "ready_to_release";
              const totalDevDays = p.phases.reduce((s, ph) => s + ph.daysAllocated, 0);
              // Conservative projection: assume ~70% of totalBugs surface at launch
              // (BASE_HIDDEN_RATIO is ~0.3 on default QA). Risk trips when projected
              // visible bugs meet the bad-state threshold.
              const projectedVisible = p.totalBugs * 0.7;
              const threshold = devBadStateThreshold(totalDevDays);
              const badStateRisk = p.totalBugs > 0 && projectedVisible >= threshold;
              return (
                <Link key={p.id} href={`/projects/${p.id}`} className="!no-underline block">
                  <div className="p-3" style={cardStyle}>
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {p.name}
                          </span>
                          {ready && (
                            <span
                              className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
                              style={{
                                background: "var(--teal)",
                                color: "#fff",
                                border: "2px solid var(--ink)",
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.06em",
                              }}
                            >
                              READY TO RELEASE
                            </span>
                          )}
                          <BugChip count={p.totalBugs} />
                          {badStateRisk && (
                            <span
                              className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
                              style={{
                                background: "var(--pink-deep)",
                                color: "#fff",
                                border: "2px solid var(--ink)",
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.06em",
                                transform: "rotate(-2deg)",
                              }}
                              title={`Projected visible bugs (~${Math.round(projectedVisible)}) meet the bad-state threshold (~${Math.round(threshold)}). Ship now and reviewers will notice.`}
                            >
                              ⚠ BAD STATE RISK
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                          {GENRE_BY_ID[p.genre]?.name} · {THEME_BY_ID[p.theme]?.name} ·{" "}
                          {p.platformIds.length} platform
                          {p.platformIds.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div style={{ fontWeight: 600 }}>{current.name}</div>
                        <div className="mt-1" style={{ color: "var(--ink-soft)" }}>
                          {p.assignedStaffIds.length} staff · target{" "}
                          <span className="tabular">{formatDate(p.targetReleaseDate)}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={overall} showLabel />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Panel>

      {released.length > 0 && (
        <Panel title={`RELEASED (${released.length})`}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>GENRE</th>
                  <th>DATE</th>
                  <th>MC</th>
                  <th>USER</th>
                  <th>BUGS</th>
                  <th className="text-right">SALES</th>
                  <th className="text-right">REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {released
                  .slice()
                  .reverse()
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => (window.location.href = `/projects/${p.id}`)}
                    >
                      <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                        {p.name}
                        {p.launchedInBadState && (
                          <span
                            className="ml-2 inline-block px-1 py-0.5 rounded text-[9px]"
                            style={{
                              background: "var(--pink-deep)",
                              color: "#fff",
                              border: "2px solid var(--ink)",
                              fontFamily: "var(--font-display)",
                              letterSpacing: "0.06em",
                              verticalAlign: "middle",
                            }}
                            title="Shipped in a bad state — visible bug count exceeded the bad-state threshold at launch."
                          >
                            BAD LAUNCH
                          </span>
                        )}
                      </td>
                      <td>{GENRE_BY_ID[p.genre]?.name}</td>
                      <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                        {p.actualReleaseDate ? formatDate(p.actualReleaseDate) : "—"}
                      </td>
                      <td>
                        <ScoreChip score={p.metacriticScore} />
                      </td>
                      <td>
                        <ScoreChip score={p.userScore} />
                      </td>
                      <td>
                        <BugChip count={p.visibleBugs} />
                      </td>
                      <td className="tabular text-right">
                        {formatNumber(p.lifetimeSales ?? 0)}
                      </td>
                      <td className="tabular text-right">
                        {formatMoney(p.lifetimeRevenue ?? 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {cancelled.length > 0 && (
        <Panel title={`CANCELLED (${cancelled.length})`}>
          <div className="space-y-1">
            {cancelled.map((p) => (
              <div
                key={p.id}
                className="flex items-baseline justify-between gap-2 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "var(--cream)",
                  border: "2.5px solid var(--cream-2)",
                }}
              >
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: "var(--ink-soft)" }}>
                  {GENRE_BY_ID[p.genre]?.name}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
