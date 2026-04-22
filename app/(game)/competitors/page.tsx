"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { GENRE_BY_ID, competitorAcquisitionPrice } from "@/engine";
import { ReleaseShareArea } from "@/components/competitors/ReleaseShareArea";

const stickerHeading: React.CSSProperties = {
  background: "var(--pink)",
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

function StrategyChip({ strategy }: { strategy: string }) {
  const bg =
    strategy === "prestige"
      ? "var(--purple)"
      : strategy === "volume"
        ? "var(--teal)"
        : strategy === "innovator"
          ? "var(--mustard)"
          : strategy === "blockbuster"
            ? "var(--pink)"
            : strategy === "hardcore"
              ? "#6bc9ff"
              : strategy === "casual"
                ? "#ff9030"
                : strategy === "copycat"
                  ? "var(--cream-2)"
                  : "var(--cream-2)";
  const textColor =
    strategy === "copycat" || strategy === "indie" ? "var(--ink)" : "#fff";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] whitespace-nowrap"
      style={{
        background: bg,
        color: textColor,
        border: "2px solid var(--ink)",
        borderRadius: 8,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.05em",
      }}
    >
      {strategy.toUpperCase()}
    </span>
  );
}

function ScoreChip({ score }: { score: number }) {
  const bg = score >= 85 ? "var(--teal)" : score >= 70 ? "var(--mustard)" : score < 60 ? "var(--pink)" : "var(--cream-2)";
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

export default function CompetitorsPage() {
  const state = useGameStore((s) => s.state);
  const acquireCompetitor = useGameStore((s) => s.acquireCompetitor);
  if (!state) return null;

  const active = Object.values(state.competitors)
    .filter((c) => c.status === "active")
    .sort((a, b) => b.reputation - a.reputation);
  const bankrupt = Object.values(state.competitors).filter((c) => c.status === "bankrupt");
  const acquiredByPlayer = Object.values(state.competitors).filter(
    (c) => c.status === "acquired" && c.acquiredBy === state.studio.id,
  );

  const recentGames = Object.values(state.competitorGames)
    .slice()
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 20);

  const currentYear = parseInt(state.currentDate.slice(0, 4), 10);

  return (
    <div className="space-y-4">
      <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
        RIVAL STUDIOS
      </h2>

      <Panel
        title="RELEASES BY STUDIO"
        headerRight={
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px]"
            style={{
              background: "var(--cream-2)",
              color: "var(--ink)",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.05em",
            }}
          >
            STACKED BY YEAR
          </span>
        }
      >
        <ReleaseShareArea
          competitors={state.competitors}
          competitorGames={state.competitorGames}
          playerProjects={state.projects}
          playerStudioName={state.studio.name}
          currentYear={currentYear}
        />
      </Panel>

      <Panel title={`ACTIVE STUDIOS (${active.length})`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>STUDIO</th>
              <th>PARENT</th>
              <th>STRATEGY</th>
              <th>CITY</th>
              <th>REP</th>
              <th>CASH</th>
              <th>GAMES</th>
              <th>FOUNDED</th>
              <th>MARKET CAP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {active.map((c) => {
              const parent = c.parentPublisherId ? state.publishers[c.parentPublisherId] : undefined;
              const price = competitorAcquisitionPrice(c.marketCap);
              const canAcquire = state.studio.cash >= price;
              return (
                <tr key={c.id}>
                  <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{c.name}</td>
                  <td className="text-xs" style={{ color: "var(--ink-soft)" }}>
                    {parent ? parent.name : <span className="opacity-40">independent</span>}
                  </td>
                  <td><StrategyChip strategy={c.strategy} /></td>
                  <td style={{ color: "var(--ink-soft)" }}>{c.hqCity}</td>
                  <td className="tabular">{c.reputation.toFixed(0)}</td>
                  <td className="tabular">{formatMoney(c.cash)}</td>
                  <td className="tabular">{c.releasedProjectIds.length}</td>
                  <td className="tabular" style={{ color: "var(--ink-soft)" }}>{c.foundedYear}</td>
                  <td className="tabular">{formatMoney(c.marketCap)}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Acquire ${c.name} for ${formatMoney(price)}?\n\n` +
                              `This is a hostile takeover: their in-flight project will be ` +
                              `cancelled, their engines transferred to you, and their studio ` +
                              `wound down. May trigger antitrust scrutiny.`,
                          )
                        ) {
                          acquireCompetitor(c.id);
                        }
                      }}
                      disabled={!canAcquire}
                      title={canAcquire ? `Acquire for ${formatMoney(price)}` : `Need ${formatMoney(price)}`}
                      className="px-2.5 py-1 text-xs"
                      style={{
                        background: canAcquire ? "var(--pink)" : "var(--cream-2)",
                        color: canAcquire ? "#fff" : "var(--ink-soft)",
                        border: "2.5px solid var(--ink)",
                        borderRadius: 10,
                        boxShadow: canAcquire ? "2px 2px 0 var(--ink)" : "none",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.06em",
                        opacity: canAcquire ? 1 : 0.7,
                      }}
                    >
                      ACQUIRE
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      {acquiredByPlayer.length > 0 && (
        <Panel title={`OWNED STUDIOS (${acquiredByPlayer.length})`}>
          <div className="flex flex-wrap gap-2">
            {acquiredByPlayer.map((c) => (
              <div
                key={c.id}
                className="rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "var(--teal)",
                  color: "#fff",
                  border: "2.5px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                }}
              >
                {c.name}
                <span
                  className="ml-2 opacity-90"
                  style={{ fontFamily: "var(--font-body)", letterSpacing: 0 }}
                >
                  {c.hqCity} · founded {c.foundedYear}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {recentGames.length > 0 && (
        <Panel
          title={`RECENT RELEASES (${
            state.competitorGames ? Object.keys(state.competitorGames).length : 0
          } total)`}
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>STUDIO</th>
                <th>GENRE</th>
                <th>DATE</th>
                <th>MC</th>
                <th>SALES</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map((g) => (
                <tr key={g.id}>
                  <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{g.name}</td>
                  <td>{state.competitors[g.competitorId]?.name ?? "—"}</td>
                  <td style={{ color: "var(--ink-soft)" }}>
                    {GENRE_BY_ID[g.genreId]?.name ?? g.genreId}
                  </td>
                  <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                    {formatDate(g.releaseDate)}
                  </td>
                  <td><ScoreChip score={g.metacriticScore} /></td>
                  <td className="tabular">{formatNumber(g.lifetimeSales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {bankrupt.length > 0 && (
        <Panel title={`BANKRUPT (${bankrupt.length})`}>
          <div className="flex flex-wrap gap-2">
            {bankrupt.map((c) => (
              <div
                key={c.id}
                className="rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "var(--cream-2)",
                  color: "var(--ink-soft)",
                  border: "2.5px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  textDecoration: "line-through",
                  textDecorationColor: "var(--pink)",
                }}
              >
                {c.name}
                <span
                  className="ml-2 opacity-80"
                  style={{ fontFamily: "var(--font-body)", textDecoration: "none", letterSpacing: 0 }}
                >
                  {c.hqCity} · {c.foundedYear}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
