"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatMoney } from "@/lib/format";

// Everything not on the primary top nav tab bar. Each entry gets its own
// sticker accent so the grid reads as a cartoon "choose your adventure"
// tile board rather than a flat list.
const MORE_SECTIONS: Array<{
  href: string;
  label: string;
  icon: string;
  hint: string;
  accent: "pink" | "teal" | "mustard" | "purple";
}> = [
  { href: "/finance",     label: "FINANCE",       icon: "$",  hint: "Cash, revenue & burn",     accent: "teal"    },
  { href: "/publishers",  label: "PUBLISHERS",    icon: "⌂",  hint: "Deals & acquisitions",     accent: "pink"    },
  { href: "/ips",         label: "IP FRANCHISES", icon: "★",  hint: "Manage your franchises",   accent: "mustard" },
  { href: "/awards",      label: "AWARDS",        icon: "🏆", hint: "Hall of Fame & trophies",  accent: "mustard" },
  { href: "/contracts",   label: "CONTRACTS",     icon: "✎",  hint: "Work-for-hire jobs",       accent: "teal"    },
  { href: "/competitors", label: "COMPETITORS",   icon: "⚔",  hint: "Track rival studios",      accent: "pink"    },
  { href: "/engines",     label: "ENGINES",       icon: "⚙",  hint: "Build & license tech",     accent: "purple"  },
  { href: "/research",    label: "R&D LAB",       icon: "⚛",  hint: "Research tech tree",       accent: "purple"  },
  { href: "/office",      label: "OFFICE",        icon: "▢",  hint: "Tier, rooms & amenities",  accent: "teal"    },
  { href: "/market",      label: "MARKET",        icon: "📊", hint: "Platforms & economy",      accent: "teal"    },
  { href: "/credits",     label: "CREDITS",       icon: "©",  hint: "Acknowledgments & notes",  accent: "pink"    },
];

// Sticker color swatches — each tile's icon bubble gets a solid fill from
// one of the palette accents. Kept separate from the data list so the color
// math stays obvious when tuning the grid.
const ACCENT_FILL: Record<string, string> = {
  pink:    "var(--pink)",
  teal:    "var(--teal)",
  mustard: "var(--mustard)",
  purple:  "var(--purple)",
};
const ACCENT_FG: Record<string, string> = {
  pink:    "#fff",
  teal:    "#fff",
  mustard: "var(--ink)",
  purple:  "#fff",
};

export default function MorePage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const pendingOffers = Object.values(state.publishingDeals).filter((d) => d.status === "offered").length;
  const offeredContracts = Object.values(state.contracts).filter((c) => c.status === "offered").length;
  const awardsCount = state.awards.filter((a) => a.isPlayerStudio).length;
  const ipsCount = Object.keys(state.ips).length;

  // Badge counts surfaced on relevant tiles. Undefined = no badge.
  const badges: Record<string, number | undefined> = {
    "/publishers": pendingOffers || undefined,
    "/ips":        ipsCount || undefined,
    "/awards":     awardsCount || undefined,
    "/contracts":  offeredContracts || undefined,
  };

  return (
    <div className="space-y-6">
      {/* Section sticker heading */}
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h2
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl"
          style={{
            background: "var(--mustard)",
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.08em",
          }}
        >
          MORE
        </h2>
        <div className="text-xs font-semibold text-[color:var(--ink-soft)] tracking-wide">
          REP {state.studio.reputation} · {state.studio.gamesReleased} GAMES RELEASED
        </div>
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MORE_SECTIONS.map((s) => {
          const badge = badges[s.href];
          return (
            <Link
              key={s.href}
              href={s.href}
              className="more-tile group"
              style={{
                background: "var(--cream)",
                border: "3px solid var(--ink)",
                borderRadius: "16px",
                boxShadow: "5px 5px 0 var(--ink)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                textDecoration: "none",
                borderBottomWidth: "3px",
                transition: "transform 120ms ease, box-shadow 120ms ease, background 150ms ease",
              }}
            >
              {/* Icon sticker bubble */}
              <span
                className="shrink-0 flex items-center justify-center text-2xl"
                style={{
                  width: "48px",
                  height: "48px",
                  background: ACCENT_FILL[s.accent],
                  color: ACCENT_FG[s.accent],
                  border: "3px solid var(--ink)",
                  borderRadius: "14px",
                  boxShadow: "3px 3px 0 var(--ink)",
                  lineHeight: 1,
                }}
              >
                {s.icon}
              </span>

              {/* Label + hint */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                    color: "var(--ink)",
                  }}
                >
                  {s.label}
                </div>
                <div className="text-xs font-semibold text-[color:var(--ink-soft)] mt-0.5">
                  {s.hint}
                </div>
              </div>

              {/* Badge + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                {badge !== undefined && (
                  <span
                    className="text-xs font-bold tabular"
                    style={{
                      background: "var(--pink)",
                      color: "#fff",
                      border: "2px solid var(--ink)",
                      borderRadius: "999px",
                      padding: "0.1rem 0.55rem",
                      boxShadow: "2px 2px 0 var(--ink)",
                      minWidth: "26px",
                      textAlign: "center",
                    }}
                  >
                    {badge}
                  </span>
                )}
                <span
                  className="text-lg font-black"
                  style={{ color: "var(--ink)" }}
                >
                  ›
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Studio summary */}
      <Panel title="STUDIO">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <SummaryStat label="CASH" value={formatMoney(state.studio.cash)} />
          <SummaryStat label="LIFETIME REV" value={formatMoney(state.studio.lifetimeRevenue)} />
          <SummaryStat label="REPUTATION" value={String(state.studio.reputation)} />
          <SummaryStat label="GAMES RELEASED" value={String(state.studio.gamesReleased)} />
          <SummaryStat label="ENGINES OWNED" value={String(state.studio.ownedEngineIds.length)} />
          <SummaryStat label="IPS OWNED" value={String(state.studio.ownedIpIds.length)} />
        </div>
      </Panel>

      {/* Hover behavior for tiles — can't do :hover inline styles so we
          scope a small block of CSS here. Kept tight + named so it doesn't
          bleed into other screens. */}
      <style jsx>{`
        .more-tile:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 var(--ink) !important;
          background: var(--cream-2) !important;
        }
        .more-tile:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 var(--ink) !important;
        }
      `}</style>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        borderRadius: "12px",
        boxShadow: "3px 3px 0 var(--ink)",
        padding: "0.55rem 0.7rem",
      }}
    >
      <div
        className="text-[0.68rem] tracking-widest"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </div>
      <div
        className="tabular text-base mt-1"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
