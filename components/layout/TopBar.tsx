"use client";

import { useGameStore } from "@/store/gameStore";
import { formatDate, formatMoney, cn } from "@/lib/format";
import { eraForYear } from "@/engine";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/dashboard", label: "DASH" },
  { href: "/projects", label: "PROJ" },
  { href: "/staff", label: "STAFF" },
  { href: "/engines", label: "ENGINES" },
  { href: "/research", label: "R&D" },
  { href: "/market", label: "MARKET" },
  { href: "/competitors", label: "RIVALS" },
  { href: "/publishers", label: "PUBS" },
  { href: "/more", label: "MORE" },
];

export function TopBar({ activePath }: { activePath: string }) {
  const state = useGameStore((s) => s.state);
  const isPaused = useGameStore((s) => s.isPaused);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const togglePause = useGameStore((s) => s.togglePause);
  const save = useGameStore((s) => s.save);

  if (!state) return null;

  const year = parseInt(state.currentDate.slice(0, 4), 10);
  const era = eraForYear(year);
  const cashTone = state.studio.cash < 0 ? "bad" : state.studio.cash < 1000000 ? "warn" : "default";

  return (
    <header className="border-b-[3px] border-[color:var(--ink)] bg-[color:var(--cream)]">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
        {/* Studio + date */}
        <div className="topbar-chip">
          <span className="topbar-chip-label">{era.name.toUpperCase()}</span>
          <span className="topbar-chip-value">{state.studio.name}</span>
          <span className="text-[0.68rem] text-[color:var(--ink-soft)] font-semibold tracking-wide">
            {formatDate(state.currentDate)}
          </span>
        </div>

        {/* Readouts */}
        <div className="flex items-stretch gap-2 ml-auto">
          <div className="topbar-chip">
            <span className="topbar-chip-label">CASH</span>
            <span className={cn("topbar-chip-value", cashTone === "bad" && "status-bad", cashTone === "warn" && "status-warn")}>
              {formatMoney(state.studio.cash)}
            </span>
          </div>
          <div className="topbar-chip hidden sm:inline-flex">
            <span className="topbar-chip-label">REP</span>
            <span className="topbar-chip-value">{state.studio.reputation}</span>
          </div>
          <div className="topbar-chip hidden md:inline-flex">
            <span className="topbar-chip-label">GAMES</span>
            <span className="topbar-chip-value">{state.studio.gamesReleased}</span>
          </div>
        </div>

        {/* Speed controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePause}
            className={cn("btn-chip", isPaused && "is-on")}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? "▶" : "❚❚"}
          </button>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s as 1 | 2 | 4)}
              className={cn("btn-chip", !isPaused && state.gameSpeed === s && "is-on")}
              title={`Speed ${s}x`}
            >
              {s}x
            </button>
          ))}
          <button onClick={save} className="btn-chip ml-1" title="Save game">
            SAVE
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="border-t-[3px] border-[color:var(--ink)] bg-[color:var(--cream-2)]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-2 px-4 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-tab", activePath === link.href && "is-active")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
