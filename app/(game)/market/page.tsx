"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatNumber } from "@/lib/format";
import { GENRE_BY_ID, platformsAvailableInYear, formatManufacturer } from "@/engine";

const stickerHeading: React.CSSProperties = {
  background: "var(--mustard)",
  color: "var(--ink)",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

const sideStickerChip: React.CSSProperties = {
  background: "var(--cream-2)",
  color: "var(--ink)",
  border: "2.5px solid var(--ink)",
  boxShadow: "3px 3px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.06em",
};

export default function MarketPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const year = parseInt(state.currentDate.slice(0, 4), 10);
  const activePlatforms = platformsAvailableInYear(year).sort((a, b) => {
    const aBase = state.market.platformInstallBase[a.id] ?? 0;
    const bBase = state.market.platformInstallBase[b.id] ?? 0;
    return bBase - aBase;
  });

  const genreTrends = Object.entries(state.market.genreTrends ?? {})
    .map(([id, trend]) => ({ id, trend, genre: GENRE_BY_ID[id as keyof typeof GENRE_BY_ID] }))
    .filter((g) => g.genre)
    .sort((a, b) => b.trend - a.trend);

  const maxInstallBase = Math.max(
    1,
    ...activePlatforms.map((p) => state.market.platformInstallBase[p.id] ?? 0)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          MARKET INTELLIGENCE
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs" style={sideStickerChip}>
          {activePlatforms.length} ACTIVE PLATFORMS · {year}
        </span>
      </div>

      <Panel title={`PLATFORM INSTALL BASES — ${year}`}>
        {activePlatforms.length === 0 ? (
          <div className="py-6 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
            No platforms currently active.
          </div>
        ) : (
          <div className="space-y-2">
            {activePlatforms.map((p) => {
              const base = state.market.platformInstallBase[p.id] ?? 0;
              const pct = (base / maxInstallBase) * 100;
              return (
                <div
                  key={p.id}
                  className="p-3"
                  style={{
                    background: "var(--cream)",
                    border: "3px solid var(--ink)",
                    borderRadius: 14,
                    boxShadow: "4px 4px 0 var(--ink)",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{p.name}</span>
                      <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                        {formatManufacturer(p.manufacturer)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded-md text-xs tabular"
                        style={{
                          background: "var(--teal)",
                          color: "#fff",
                          border: "2px solid var(--ink)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                        }}
                      >
                        {formatNumber(Math.round(base))}
                      </span>
                    </div>
                  </div>
                  <Progress value={pct} tone="default" />
                  <div className="flex items-baseline justify-between mt-2 text-[11px] flex-wrap gap-2" style={{ color: "var(--ink-soft)" }}>
                    <span>
                      Devkit:{" "}
                      <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
                        ${(p.devKitCost / 100).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      Royalty:{" "}
                      <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
                        {(p.royaltyRate * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {genreTrends.length > 0 && (
        <Panel title="GENRE TRENDS">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {genreTrends.map((g) => {
              const tone =
                g.trend > 10
                  ? { bg: "var(--teal)", color: "#fff" }
                  : g.trend < -10
                    ? { bg: "var(--pink)", color: "#fff" }
                    : { bg: "var(--cream-2)", color: "var(--ink)" };
              return (
                <div
                  key={g.id}
                  className="flex justify-between items-baseline rounded-xl px-3 py-2"
                  style={{
                    background: "var(--cream)",
                    border: "2.5px solid var(--cream-2)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{g.genre!.name}</span>
                  <span
                    className="inline-block px-2 py-0.5 rounded-md text-xs tabular"
                    style={{
                      background: tone.bg,
                      color: tone.color,
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                    }}
                  >
                    {g.trend > 0 ? "+" : ""}
                    {g.trend.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
