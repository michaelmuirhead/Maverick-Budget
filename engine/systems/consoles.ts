// Console generations system.
//
// At year-start, check which platforms launch or discontinue this year.
// Emit log entries announcing the events. These are macro industry shifts
// that players feel via platform install base changes and new target platforms.
//
// Also tracks generation boundaries — when a "family" of platforms cycles to
// the next generation (roughly every 6-8 years), it's a big industry moment.

import type { GameState } from "../core/state";
import { PLATFORMS, formatManufacturer } from "../data/platforms";
import { appendLog } from "../core/log";
import { isoToDate } from "../core/time";

// Platforms by manufacturer form "families" — generations cycle within each
const CONSOLE_MANUFACTURERS = ["sony", "microsoft", "nintendo", "sega", "atari"];

// Fires at year-start. Announces any platform launches/discontinuations this year.
export function tickPlatformLaunches(state: GameState): GameState {
  const year = isoToDate(state.currentDate).year;
  let next = state;
  let launchCount = 0;
  let discontinueCount = 0;

  for (const platform of PLATFORMS) {
    // Launch event
    if (platform.launchYear === year) {
      // Skip if already announced (guard against double-fire)
      const flagKey = `platform_launched_${platform.id}`;
      if (next.flags[flagKey]) continue;

      next = {
        ...next,
        flags: { ...next.flags, [flagKey]: true },
      };

      // Is this the start of a new generation? Big event vs. small event
      const isConsole = platform.kind === "home_console" || platform.kind === "handheld";
      const severity = isConsole ? "success" : "info";

      next = appendLog(next, {
        category: "market",
        headline: `${platform.name} launches`,
        body: `${formatManufacturer(platform.manufacturer)}'s new ${platform.kind.replace("_", " ")} is now on the market. Peak install base projected: ${platform.peakInstallBase}M.`,
        severity,
      });
      launchCount++;

      // Seed starting install base (1M at launch; grows over time via peakYear curve)
      next = {
        ...next,
        market: {
          ...next.market,
          platformInstallBase: {
            ...next.market.platformInstallBase,
            [platform.id]: 1, // 1M at launch
          },
        },
      };
    }

    // Discontinuation event
    if (platform.discontinuedYear && platform.discontinuedYear === year) {
      const flagKey = `platform_discontinued_${platform.id}`;
      if (next.flags[flagKey]) continue;

      next = {
        ...next,
        flags: { ...next.flags, [flagKey]: true },
      };

      next = appendLog(next, {
        category: "market",
        headline: `${platform.name} discontinued`,
        body: `Platform exits the market. New releases on this platform will reach a shrinking user base.`,
        severity: "warning",
      });
      discontinueCount++;
    }
  }

  // Summary if multiple simultaneous launches
  if (launchCount >= 2) {
    next = appendLog(next, {
      category: "market",
      headline: `Console generation shift`,
      body: `${launchCount} new platforms this year. A new generation is beginning.`,
      severity: "success",
    });
  }

  return next;
}

// Get platforms currently active (launched but not yet discontinued) in a given year
export function activePlatformsInYear(year: number) {
  return PLATFORMS.filter(
    (p) => p.launchYear <= year && (!p.discontinuedYear || p.discontinuedYear > year)
  );
}

// Rough generation count — count active home consoles per manufacturer, as each
// generation brings new console. Useful for market UI.
export function currentGenerationByManufacturer(year: number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const mfr of CONSOLE_MANUFACTURERS) {
    const launches = PLATFORMS.filter(
      (p) => p.manufacturer === mfr &&
      (p.kind === "home_console" || p.kind === "handheld") &&
      p.launchYear <= year
    );
    result[mfr] = launches.length;
  }
  return result;
}
