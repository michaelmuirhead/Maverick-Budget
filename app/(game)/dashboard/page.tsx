"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Progress } from "@/components/ui/Progress";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import {
  GENRE_BY_ID,
  THEME_BY_ID,
  LIVE_SERVICE_SLOT_CAP,
  totalOutstandingRepPenalty,
  tierLabel,
  effectiveMultiplier,
  QA_LAB_PASSIVE_FIX_PER_CAP,
  QA_LAB_HIDDEN_REDUCTION_PER_CAP,
  MAX_QA_LAB_REDUCTION,
  AMBIENT_FIX_RATE_PER_DAY,
} from "@/engine";
import Link from "next/link";
import { ReputationGauge } from "@/components/dashboard/ReputationGauge";

const cardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "3px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "5px 5px 0 var(--ink)",
};

const miniPillStyle = (tone: "teal" | "pink" | "mustard" | "purple" | "dim"): React.CSSProperties => ({
  background:
    tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
        ? "var(--pink)"
        : tone === "mustard"
          ? "var(--mustard)"
          : tone === "purple"
            ? "var(--purple)"
            : "var(--cream-2)",
  color: tone === "mustard" || tone === "dim" ? "var(--ink)" : "#fff",
  border: "2px solid var(--ink)",
  borderRadius: 8,
  padding: "1px 8px",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.06em",
  display: "inline-block",
});

function ScoreChip({ score }: { score: number }) {
  const bg =
    score >= 85
      ? "var(--teal)"
      : score >= 70
        ? "var(--mustard)"
        : score < 60
          ? "var(--pink)"
          : "var(--cream-2)";
  const color = score < 60 || score >= 85 ? "#fff" : "var(--ink)";
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[11px] tabular"
      style={{
        background: bg,
        color,
        border: "2px solid var(--ink)",
        borderRadius: 6,
        fontFamily: "var(--font-display)",
      }}
    >
      {score}
    </span>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const bg =
    severity === "success"
      ? "var(--teal)"
      : severity === "warning"
        ? "var(--mustard)"
        : severity === "danger"
          ? "var(--pink)"
          : "var(--purple)";
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: 10,
        height: 10,
        background: bg,
        border: "2px solid var(--ink)",
        flexShrink: 0,
      }}
    />
  );
}

export default function DashboardPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const activeProjects = Object.values(state.projects).filter(
    (p) => p.status === "in_development"
  );
  const releasedGames = Object.values(state.projects).filter((p) => p.status === "released");
  const employed = Object.values(state.staff).filter((s) => s.status === "employed");
  const activeResearch = Object.values(state.researchProjects).filter((r) => !r.completed);
  const playerEngines = Object.values(state.engines).filter((e) => e.origin === "player");
  const publicEngines = playerEngines.filter((e) => e.status === "public_release");

  const allLiveServices = Object.values(state.liveServices);
  const activeLiveServices = allLiveServices
    .filter((l) => l.enabled)
    .sort((a, b) => b.activePlayers - a.activePlayers);
  const sunsetLiveServices = allLiveServices.filter((l) => !l.enabled);
  const liveSlotsUsed = activeLiveServices.length;
  const liveSlotsRemaining = LIVE_SERVICE_SLOT_CAP - liveSlotsUsed;

  const repHits = [...state.studio.repHits].sort((a, b) =>
    a.incurredDate < b.incurredDate ? 1 : -1
  );
  const outstandingPenalty = totalOutstandingRepPenalty(state);

  const tierRank: Record<string, number> = { era_definer: 0, wave: 1, trend: 2 };
  const activeShifts = [...state.market.activeShifts].sort((a, b) => {
    const t = (tierRank[a.tier] ?? 9) - (tierRank[b.tier] ?? 9);
    return t !== 0 ? t : a.sourceProjectName.localeCompare(b.sourceProjectName);
  });
  const playedOutShifts = state.market.playedOutShifts;

  const qaLabCapacity = state.office.rooms.reduce(
    (sum, r) => sum + (r.kind === "qa_lab" ? r.capacity : 0),
    0
  );
  const qaLabRoomCount = state.office.rooms.filter((r) => r.kind === "qa_lab").length;
  const liveGameCount = Object.values(state.activeSales).filter((s) => s.active).length;
  const qaPassivePerGame =
    (qaLabCapacity * QA_LAB_PASSIVE_FIX_PER_CAP) / Math.max(1, liveGameCount) +
    AMBIENT_FIX_RATE_PER_DAY;
  const qaHiddenReduction = Math.min(
    MAX_QA_LAB_REDUCTION,
    qaLabCapacity * QA_LAB_HIDDEN_REDUCTION_PER_CAP
  );

  const activePatchSprints = Object.values(state.patchSprints).filter(
    (s) => s.status === "active"
  );

  const recent = [...state.log].slice(-8).reverse();

  return (
    <div className="space-y-4">
      <Panel title="STUDIO STATUS">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat
            label="CASH"
            value={formatMoney(state.studio.cash)}
            tone={state.studio.cash < 0 ? "bad" : "default"}
          />
          <Stat
            label="REPUTATION"
            value={state.studio.reputation}
            sub={
              outstandingPenalty > 0
                ? `−${outstandingPenalty} from ${repHits.length} active hit${
                    repHits.length === 1 ? "" : "s"
                  }`
                : "of 100"
            }
            tone={outstandingPenalty > 0 ? "warn" : "default"}
          />
          <Stat label="GAMES SHIPPED" value={state.studio.gamesReleased} />
          <Stat label="LIFETIME REV" value={formatMoney(state.studio.lifetimeRevenue)} />
          <Stat
            label="STAFF"
            value={employed.length}
            sub={`pool: ${state.hiringPool.candidateIds.length}`}
          />
          <Stat label="ACTIVE PROJECTS" value={activeProjects.length} />
          <Stat
            label="ENGINES OWNED"
            value={playerEngines.length}
            sub={publicEngines.length > 0 ? `${publicEngines.length} public` : undefined}
          />
          <Stat
            label="RESEARCH"
            value={activeResearch.length}
            sub={`${state.studio.completedTechIds.length} unlocked`}
          />
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel
          title="STUDIO STANDING"
          headerRight={
            <span className="text-xs" style={{ color: "var(--ink-soft)", fontWeight: 600 }}>
              {repHits.length > 0
                ? `${repHits.length} active hit${repHits.length === 1 ? "" : "s"}`
                : "no active hits"}
            </span>
          }
        >
          <ReputationGauge
            reputation={state.studio.reputation}
            outstandingPenalty={outstandingPenalty}
          />
        </Panel>

        <Panel
          title="ACTIVE PROJECTS"
          headerRight={
            <Link
              href="/projects"
              className="!no-underline text-xs"
              style={{ color: "var(--pink-deep)", fontWeight: 700 }}
            >
              → ALL
            </Link>
          }
        >
          {activeProjects.length === 0 ? (
            <EmptyState
              label="No active projects"
              cta={
                <Link href="/projects/new" className="!no-underline">
                  <span
                    className="inline-block px-4 py-2 rounded-xl text-xs"
                    style={{
                      background: "var(--teal)",
                      color: "#fff",
                      border: "3px solid var(--ink)",
                      boxShadow: "3px 3px 0 var(--ink)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    » START A NEW PROJECT
                  </span>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {activeProjects.map((p) => {
                const currentPhase = p.phases[p.currentPhaseIndex]!;
                const overallPct =
                  (p.currentPhaseIndex / p.phases.length) * 100 +
                  currentPhase.completion / p.phases.length;
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="!no-underline block p-3"
                    style={cardStyle}
                  >
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <div style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                          {p.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                          {GENRE_BY_ID[p.genre]?.name} · {currentPhase.name}
                        </div>
                      </div>
                      <span
                        className="text-[10px] inline-block"
                        style={miniPillStyle("purple")}
                      >
                        {p.assignedStaffIds.length} STAFF
                      </span>
                    </div>
                    <Progress value={overallPct} showLabel />
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="NEWS FEED">
          {recent.length === 0 ? (
            <EmptyState label="No events yet — unpause to begin." />
          ) : (
            <div className="space-y-2">
              {recent.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 rounded-xl"
                  style={{
                    background: "var(--cream)",
                    border: "2.5px solid var(--cream-2)",
                  }}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <SeverityDot severity={e.severity} />
                    <span
                      className="text-xs tabular"
                      style={{ color: "var(--ink-soft)", width: 88, flexShrink: 0 }}
                    >
                      {formatDate(e.date)}
                    </span>
                    <span style={{ color: "var(--ink)", fontWeight: 600 }}>{e.headline}</span>
                  </div>
                  {e.body && (
                    <div className="text-xs mt-1 ml-5" style={{ color: "var(--ink-soft)" }}>
                      {e.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="INDUSTRY WAVES"
          headerRight={
            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
              {activeShifts.length} active · {playedOutShifts.length} played out
            </span>
          }
        >
          {activeShifts.length === 0 && playedOutShifts.length === 0 ? (
            <EmptyState label="No industry waves yet. Ship an era-defining hit to start one." />
          ) : (
            <div className="space-y-3">
              {activeShifts.length === 0 && (
                <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  No industry waves active right now. Ship a hype-driven hit at era-defining sales
                  to start one.
                </div>
              )}
              {activeShifts.map((shift) => {
                const mult = effectiveMultiplier(shift);
                const remainingDays = Math.max(
                  0,
                  Math.floor(
                    (new Date(shift.endDate + "T00:00:00Z").getTime() -
                      new Date(state.currentDate + "T00:00:00Z").getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
                const monthsLeft = Math.round(remainingDays / 30);
                const genreName = GENRE_BY_ID[shift.genre]?.name ?? shift.genre;
                const themeName = THEME_BY_ID[shift.theme]?.name ?? shift.theme;
                const tierTone: "teal" | "pink" | "mustard" =
                  shift.tier === "era_definer"
                    ? "teal"
                    : shift.tier === "wave"
                      ? "pink"
                      : "mustard";
                return (
                  <div key={shift.id} className="p-3" style={cardStyle}>
                    <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                      <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                        {genreName} × {themeName}
                      </span>
                      <span
                        className="text-[10px] inline-block tabular"
                        style={miniPillStyle(tierTone)}
                      >
                        {tierLabel(shift.tier).toUpperCase()} · ×{mult.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      Sparked by{" "}
                      <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                        {shift.sourceProjectName}
                      </span>
                      {shift.isMmoTriggered ? " (live-service)" : ""} · {monthsLeft}mo left ·{" "}
                      {shift.copycatCount} copycat{shift.copycatCount === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })}

              {playedOutShifts.length > 0 && (
                <div className="pt-2" style={{ borderTop: "2px dashed var(--cream-2)" }}>
                  <div
                    className="text-xs mb-1"
                    style={{
                      color: "var(--ink-soft)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    PLAYED OUT (avoid these combos)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {playedOutShifts.map((shift) => {
                      const genreName = GENRE_BY_ID[shift.genre]?.name ?? shift.genre;
                      const themeName = THEME_BY_ID[shift.theme]?.name ?? shift.theme;
                      return (
                        <span
                          key={shift.id}
                          className="text-xs inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg"
                          style={{
                            background: "var(--cream-2)",
                            color: "var(--ink-soft)",
                            border: "2px solid var(--ink)",
                            textDecoration: "line-through",
                            textDecorationColor: "var(--pink)",
                          }}
                        >
                          {genreName} × {themeName}{" "}
                          <span
                            className="text-[10px] inline-block tabular"
                            style={{
                              background: "var(--pink)",
                              color: "#fff",
                              border: "1.5px solid var(--ink)",
                              borderRadius: 4,
                              padding: "0 3px",
                              textDecoration: "none",
                            }}
                          >
                            ×0.85
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>

      {(allLiveServices.length > 0 || repHits.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel
            title="LIVE SERVICES"
            headerRight={
              <span
                className="text-xs tabular"
                style={miniPillStyle(
                  liveSlotsUsed >= LIVE_SERVICE_SLOT_CAP ? "pink" : "dim"
                )}
              >
                {liveSlotsUsed}/{LIVE_SERVICE_SLOT_CAP} SLOTS
                {liveSlotsRemaining > 0 ? ` · ${liveSlotsRemaining} OPEN` : " · CAP"}
              </span>
            }
          >
            {activeLiveServices.length === 0 && sunsetLiveServices.length === 0 ? (
              <EmptyState label="No live services running." />
            ) : (
              <div className="space-y-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: LIVE_SERVICE_SLOT_CAP }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 flex-1 rounded-full"
                      style={{
                        background: i < liveSlotsUsed ? "var(--teal)" : "var(--cream-2)",
                        border: "2px solid var(--ink)",
                      }}
                      title={i < liveSlotsUsed ? activeLiveServices[i]?.projectId : "Open slot"}
                    />
                  ))}
                </div>

                {activeLiveServices.map((live) => {
                  const project = state.projects[live.projectId];
                  const daysSinceContent = Math.floor(
                    (new Date(state.currentDate + "T00:00:00Z").getTime() -
                      new Date(live.lastContentDate + "T00:00:00Z").getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  const contentStale = daysSinceContent >= 90;
                  return (
                    <Link
                      key={live.projectId}
                      href={`/projects/${live.projectId}`}
                      className="!no-underline block p-3"
                      style={cardStyle}
                    >
                      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                        <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                          {project?.name ?? live.projectId}
                        </span>
                        <span
                          className="text-[10px] inline-block"
                          style={miniPillStyle("teal")}
                        >
                          LIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <LiveStat label="PLAYERS" value={formatNumber(live.activePlayers)} />
                        <LiveStat
                          label="MO. REV"
                          value={formatMoney(live.monthlySubscriptionRevenue)}
                        />
                        <LiveStat
                          label="LAST CONTENT"
                          value={`${daysSinceContent}d`}
                          tone={contentStale ? "warn" : "default"}
                        />
                      </div>
                    </Link>
                  );
                })}

                {sunsetLiveServices.length > 0 && (
                  <div className="pt-2" style={{ borderTop: "2px dashed var(--cream-2)" }}>
                    <div
                      className="text-xs mb-1"
                      style={{
                        color: "var(--ink-soft)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      SUNSET
                    </div>
                    <div className="space-y-0.5">
                      {sunsetLiveServices.map((live) => {
                        const project = state.projects[live.projectId];
                        return (
                          <div
                            key={live.projectId}
                            className="flex justify-between text-xs"
                            style={{ color: "var(--ink-soft)" }}
                          >
                            <span>{project?.name ?? live.projectId}</span>
                            <span className="tabular">
                              {live.sunsetDate ? formatDate(live.sunsetDate) : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Panel>

          <Panel
            title="REPUTATION HITS"
            headerRight={
              outstandingPenalty > 0 ? (
                <span
                  className="text-xs tabular inline-block"
                  style={miniPillStyle("pink")}
                >
                  −{outstandingPenalty} OUTSTANDING
                </span>
              ) : (
                <span className="text-xs inline-block" style={miniPillStyle("teal")}>
                  CLEAN
                </span>
              )
            }
          >
            {repHits.length === 0 ? (
              <EmptyState label="No active reputation hits. The studio's name is intact." />
            ) : (
              <div className="space-y-3">
                {repHits.map((hit) => {
                  const restoredPct = Math.round((hit.restoredAmount / hit.totalPenalty) * 100);
                  const remaining = Math.max(0, hit.totalPenalty - hit.restoredAmount);
                  const totalDays = hit.decayDurationDays;
                  const elapsedDays = Math.floor(
                    (new Date(state.currentDate + "T00:00:00Z").getTime() -
                      new Date(hit.incurredDate + "T00:00:00Z").getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  const yearsRemaining = Math.max(
                    0,
                    Math.round(((totalDays - elapsedDays) / 365) * 10) / 10
                  );
                  return (
                    <div key={hit.id} className="p-3" style={cardStyle}>
                      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                        <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                          {hit.source}
                        </span>
                        <span
                          className="text-[10px] inline-block tabular"
                          style={miniPillStyle("pink")}
                        >
                          −{Math.round(remaining)} PT{remaining === 1 ? "" : "S"}
                        </span>
                      </div>
                      <div className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
                        Incurred {formatDate(hit.incurredDate)} · {yearsRemaining}y to fully heal
                      </div>
                      <Progress value={restoredPct} showLabel />
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      )}

      {(releasedGames.length > 0 || qaLabRoomCount > 0) && (
        <Panel
          title="QA LAB & POST-LAUNCH SUPPORT"
          headerRight={
            qaLabRoomCount > 0 ? (
              <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                {qaLabRoomCount} lab{qaLabRoomCount === 1 ? "" : "s"} · {qaLabCapacity} seats
              </span>
            ) : (
              <span className="text-xs inline-block" style={miniPillStyle("pink")}>
                NO QA LAB
              </span>
            )
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            <Stat
              label="QA SEATS"
              value={qaLabCapacity}
              tone={qaLabCapacity === 0 ? "warn" : "default"}
              sub={
                qaLabCapacity === 0
                  ? "build a lab to reduce hidden bugs"
                  : `across ${qaLabRoomCount} room${qaLabRoomCount === 1 ? "" : "s"}`
              }
            />
            <Stat
              label="HIDDEN BUG SHIELD"
              value={`-${(qaHiddenReduction * 100).toFixed(0)}%`}
              tone={
                qaHiddenReduction >= 0.15 ? "good" : qaHiddenReduction === 0 ? "warn" : "default"
              }
              sub={`cap −${(MAX_QA_LAB_REDUCTION * 100).toFixed(0)}% at launch`}
            />
            <Stat
              label="PASSIVE FIX/DAY"
              value={qaPassivePerGame.toFixed(1)}
              sub={liveGameCount > 1 ? `split ${liveGameCount} ways` : "per live game"}
            />
            <Stat
              label="ACTIVE SPRINTS"
              value={activePatchSprints.length}
              tone={activePatchSprints.length > 0 ? "info" : "default"}
              sub={activePatchSprints.length === 0 ? "no patches in flight" : undefined}
            />
          </div>

          {activePatchSprints.length > 0 && (
            <div className="space-y-2">
              {activePatchSprints.map((sprint) => {
                const proj = state.projects[sprint.projectId];
                if (!proj) return null;
                const pct =
                  sprint.plannedDays > 0
                    ? Math.min(100, (sprint.daysSpent / sprint.plannedDays) * 100)
                    : 0;
                return (
                  <Link
                    key={sprint.id}
                    href={`/projects/${sprint.projectId}`}
                    className="!no-underline block p-3"
                    style={cardStyle}
                  >
                    <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                      <span>
                        <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                          {sprint.name}
                        </span>
                        <span className="ml-2" style={{ color: "var(--ink-soft)" }}>
                          — {proj.name}
                        </span>
                      </span>
                      <span
                        className="text-[10px] inline-block tabular"
                        style={miniPillStyle("mustard")}
                      >
                        {sprint.daysSpent}/{sprint.plannedDays}D · {sprint.bugsFixedSoFar} FIXED
                      </span>
                    </div>
                    <Progress value={pct} />
                  </Link>
                );
              })}
            </div>
          )}

          {qaLabCapacity === 0 && releasedGames.length > 0 && (
            <div
              className="text-xs mt-3 italic p-3 rounded-xl"
              style={{
                background: "var(--cream-2)",
                color: "var(--ink-soft)",
                border: "2.5px dashed var(--ink)",
              }}
            >
              Without a QA Lab, games ship with the maximum hidden-bug ratio and rely only on the{" "}
              {AMBIENT_FIX_RATE_PER_DAY.toFixed(1)} bugs/day ambient fix rate post-launch.
            </div>
          )}
        </Panel>
      )}

      {releasedGames.length > 0 && (
        <Panel title="RELEASED CATALOG">
          <table className="data-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>GENRE</th>
                <th>RELEASED</th>
                <th>MC</th>
                <th>SALES</th>
                <th>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {releasedGames
                .slice()
                .reverse()
                .slice(0, 10)
                .map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{p.name}</td>
                    <td>{GENRE_BY_ID[p.genre]?.name}</td>
                    <td style={{ color: "var(--ink-soft)" }} className="tabular">
                      {p.actualReleaseDate ? formatDate(p.actualReleaseDate) : "—"}
                    </td>
                    <td className="tabular">
                      {p.metacriticScore != null ? <ScoreChip score={p.metacriticScore} /> : "—"}
                    </td>
                    <td className="tabular">{formatNumber(p.lifetimeSales ?? 0)}</td>
                    <td className="tabular">{formatMoney(p.lifetimeRevenue ?? 0)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function LiveStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn";
}) {
  const valueColor = tone === "warn" ? "var(--pink-deep)" : "var(--ink)";
  return (
    <div
      className="rounded-xl px-2 py-1"
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        boxShadow: "2px 2px 0 var(--ink)",
      }}
    >
      <div
        className="text-[9px]"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div className="tabular text-sm" style={{ color: valueColor, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

function EmptyState({ label, cta }: { label: string; cta?: React.ReactNode }) {
  return (
    <div className="py-8 text-center">
      <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
        {label}
      </div>
      {cta && <div className="mt-3">{cta}</div>}
    </div>
  );
}
