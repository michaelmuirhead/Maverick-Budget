"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { AWARD_DISPLAY_NAMES } from "@/engine";

export default function AwardsPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  // Group awards by year, most recent first
  const byYear: Record<number, typeof state.awards> = {};
  for (const award of state.awards) {
    if (!byYear[award.year]) byYear[award.year] = [];
    byYear[award.year]!.push(award);
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  const playerAwards = state.awards.filter((a) => a.isPlayerStudio);

  const stickerHeading: React.CSSProperties = {
    background: "var(--mustard)",
    color: "var(--ink)",
    border: "3px solid var(--ink)",
    boxShadow: "4px 4px 0 var(--ink)",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.08em",
  };

  const trophyBg = (isPlayer: boolean, isGoty: boolean): string => {
    if (isPlayer && isGoty) return "var(--mustard)";
    if (isPlayer) return "var(--pink)";
    if (isGoty) return "var(--purple)";
    return "var(--cream-2)";
  };

  const trophyText = (isPlayer: boolean, isGoty: boolean): string => {
    if (isPlayer && isGoty) return "var(--ink)";
    if (isPlayer) return "#fff";
    if (isGoty) return "#fff";
    return "var(--ink)";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          HALL OF FAME
        </h2>
        <span
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs"
          style={{
            background: "var(--cream-2)",
            color: "var(--ink)",
            border: "2.5px solid var(--ink)",
            boxShadow: "3px 3px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
          }}
        >
          {playerAwards.length} PLAYER {playerAwards.length === 1 ? "AWARD" : "AWARDS"}
        </span>
      </div>

      {state.awards.length === 0 ? (
        <Panel>
          <div className="py-12 text-center" style={{ color: "var(--ink-soft)" }}>
            No awards yet. Game of the Year Awards ceremony fires every December 10 starting in
            1988.
          </div>
        </Panel>
      ) : (
        <>
          {/* Player-only summary */}
          {playerAwards.length > 0 && (
            <Panel title={`YOUR TROPHY CASE (${playerAwards.length})`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {playerAwards.map((a) => {
                  const isGoty = a.category === "goty";
                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl p-3"
                      style={{
                        background: trophyBg(true, isGoty),
                        color: trophyText(true, isGoty),
                        border: "3px solid var(--ink)",
                        boxShadow: "5px 5px 0 var(--ink)",
                      }}
                    >
                      <div
                        className="text-[11px] opacity-80"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
                      >
                        {a.year}
                      </div>
                      <div
                        className="text-sm mt-0.5"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                      >
                        {isGoty && "🏆 "}
                        {AWARD_DISPLAY_NAMES[a.category]}
                      </div>
                      {a.projectName && (
                        <div className="text-[11px] mt-1 opacity-85 truncate">{a.projectName}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* Full history by year */}
          {years.map((year) => {
            const awards = byYear[year]!;
            return (
              <Panel key={year} title={`${year} AWARDS`}>
                <div className="space-y-2">
                  {awards.map((a) => {
                    const isGoty = a.category === "goty";
                    const isSoy = a.category === "studio_of_year";
                    const accent = a.isPlayerStudio
                      ? "var(--pink)"
                      : isGoty
                        ? "var(--purple)"
                        : isSoy
                          ? "var(--teal)"
                          : "var(--ink-soft)";
                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                        style={{
                          background: a.isPlayerStudio ? "var(--cream-2)" : "var(--cream)",
                          border: `2.5px solid ${a.isPlayerStudio ? "var(--ink)" : "var(--cream-2)"}`,
                          boxShadow: a.isPlayerStudio ? "3px 3px 0 var(--ink)" : "none",
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap"
                            style={{
                              background: accent,
                              color: "#fff",
                              border: "2px solid var(--ink)",
                              fontFamily: "var(--font-display)",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {isGoty && "🏆 "}
                            {AWARD_DISPLAY_NAMES[a.category]}
                          </span>
                        </div>
                        <div className="text-right min-w-0 flex items-baseline gap-2 justify-end flex-1">
                          <span
                            className="truncate"
                            style={{
                              color: a.isPlayerStudio ? "var(--pink-deep)" : "var(--ink)",
                              fontWeight: a.isPlayerStudio ? 700 : 500,
                            }}
                          >
                            {a.projectName ?? a.studioName ?? "—"}
                          </span>
                          {a.metacriticScore && (
                            <span
                              className="text-[11px] tabular whitespace-nowrap"
                              style={{ color: "var(--ink-soft)" }}
                            >
                              MC {a.metacriticScore}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            );
          })}
        </>
      )}
    </div>
  );
}
