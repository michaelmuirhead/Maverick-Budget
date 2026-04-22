// The master tick dispatcher. Called once per simulated day.
// Each tick:
//   1. Advances the date by one day
//   2. Runs the development system on all active projects
//   3. (future) Runs other systems — staff lifecycle, R&D, market, competitors, events
//   4. Handles monthly/quarterly/yearly rollups
//
// All systems are pure functions that take and return GameState.

import type { GameState } from "./state";
import { addDays, dateToIso, isoToDate, isFirstOfMonth, isFirstOfYear } from "./time";
import { tickDevelopment } from "../systems/development";
import { processReadyReleases, tickActiveSales } from "../systems/release";
import { refreshHiringPool, runPayroll, tickStaffAttrition, tickStaffRecovery } from "../systems/hiring";
import { tickResearch } from "../systems/rnd";
import { tickEngineBuilds, tickEngineCurrentness } from "../systems/engineBuilder";
import { tickEngineRoyalties, tickExpireLicenses } from "../systems/engineLicensing";
import { tickCompetitors, maybeSpawnNewCompetitor, checkCompetitorBankruptcies } from "../systems/competitors";
import { tickPatchSprints, tickPostLaunchBugs } from "../systems/bugs";
import { tickDlcDevelopment, tickLiveServicesMonthly } from "../systems/dlc";
import { tickRepDecay } from "../systems/reputation";
import { tickMarketShifts } from "../systems/marketShifts";
import { tickPublishersMonthly, tickPublisherOffersDuringDev, maybeFoundNewPublisher } from "../systems/publishers";
import { expireSubscriptionOffers } from "../systems/subscriptions";
import { expireCompetitorPublishingDeals } from "../systems/playerImprint";
import { tickScheduledEvents, tickRandomEvents, tickEventEffectsDecay } from "../systems/events";
import { tickNarrativeChains } from "../systems/narrativeChains";
import { tickHypeDecay } from "../systems/marketing";
import { tickContracts } from "../systems/contracts";
import { tickOfficeMonthly } from "../systems/office";
import { tickIpLicensingRevenue, tickIpFatigueDecay } from "../systems/ips";
import { tickEconomicCycle } from "../systems/economy";
import { tickPlatformLaunches } from "../systems/consoles";

export function tickOneDay(state: GameState): GameState {
  let next = state;

  // 1. Advance date
  const today = isoToDate(state.currentDate);
  const tomorrow = addDays(today, 1);
  next = {
    ...next,
    currentDate: dateToIso(tomorrow),
    daysElapsed: next.daysElapsed + 1,
  };

  // 2. Development (active project progression)
  next = tickDevelopment(next);

  // 2.0 Off-duty staff recovery — assigned staff get their meters updated
  // inside tickDevelopment; everyone else gets a gentle daily restore so
  // burnout/energy/morale recover during between-projects downtime.
  next = tickStaffRecovery(next);

  // 2a. DLC development (post-launch addon work runs in parallel with the
  // main project pipeline).
  next = tickDlcDevelopment(next);

  // 3. Engine builds (parallel to dev)
  next = tickEngineBuilds(next);

  // 4. Research (tech point accumulation)
  next = tickResearch(next);

  // 4a. Expire any subscription buyout offers whose 14-day window has passed.
  // Cheap O(projects) — no work if no offers are pending.
  next = expireSubscriptionOffers(next);

  // 4b. Expire any player-imprint deals whose 18-month window has passed
  // without the competitor shipping a game.
  next = expireCompetitorPublishingDeals(next);

  // 5. Release any player projects that just finished Launch phase
  next = processReadyReleases(next);

  // 5a. Advance any active patch sprints — applies fixes today, may emit `patch_released`.
  // Must run before tickPostLaunchBugs so today's fixes feed into today's userScore.
  next = tickPatchSprints(next);

  // 5b. Surface hidden bugs, apply passive QA Lab fixes, recompute userScore.
  // Must run before tickActiveSales so today's userScore drives today's sales drag.
  next = tickPostLaunchBugs(next);

  // 6. Process daily sales from all released games (player's)
  next = tickActiveSales(next);

  // 7. Competitors make release-day decisions every day (cheap check)
  next = tickCompetitors(next);

  // 7a. Contract work — each active work-for-hire contract accrues progress
  // and fails on deadline miss.
  next = tickContracts(next);

  // 7b. Marketing hype decay — pre-launch hype leaks 1.5%/day; the word-of-
  // mouth window for released titles decays faster.
  next = tickHypeDecay(next);

  // 7c. Scheduled industry events (E3, GDC, Gamescom, TGS, GOTY Awards,
  // Holiday Rush) — fire if today matches (month,day) and active year range.
  next = tickScheduledEvents(next);

  // 7d. Random events — daily probability rolls; capped to 1 firing per day.
  next = tickRandomEvents(next);

  // 7e. Multi-beat narrative chains — independent of the random-event slot.
  // Advances any active chains whose beat is due, then rolls trigger
  // probabilities for inactive chains (capped to 1 trigger per day).
  next = tickNarrativeChains(next);

  // 8. Monthly rollups (first of each month)
  if (isFirstOfMonth(tomorrow)) {
    next = onMonthStart(next);
  }

  // 9. Monthly engine currentness decay
  next = tickEngineCurrentness(next);

  // 9a. Monthly engine licensing rollup: backcatalog royalty trickle for
  // active licenses, and cleanup of licenses whose licensee/engine is gone.
  next = tickExpireLicenses(next);
  next = tickEngineRoyalties(next);

  // 10. Yearly rollups (first of each year)
  if (isFirstOfYear(tomorrow)) {
    next = onYearStart(next);
  }

  // 11. New competitor spawn + bankruptcy check
  next = maybeSpawnNewCompetitor(next);
  next = checkCompetitorBankruptcies(next);

  // 11a. New publishers come online on their historical founding year (Jan 1).
  next = maybeFoundNewPublisher(next);

  // 12. Staff attrition check (runs inside tickStaffAttrition only on day-1)
  next = tickStaffAttrition(next);

  return next;
}

// Advance N days in a batch (used by game-speed settings)
export function tickDays(state: GameState, days: number): GameState {
  let next = state;
  for (let i = 0; i < days; i++) {
    next = tickOneDay(next);
  }
  return next;
}

// ============ MONTHLY ROLLUPS ============
function onMonthStart(state: GameState): GameState {
  let next = state;

  // Snapshot the studio's financial state BEFORE monthly bills run so the
  // chart shows the cash on hand heading into each month (the "opening
  // balance" convention). Payroll + office + live-service + licensing will
  // all modify cash over the course of this day; the next sample a month
  // from now will reflect the net.
  next = {
    ...next,
    studio: {
      ...next.studio,
      cashHistory: [
        ...next.studio.cashHistory,
        {
          date: next.currentDate,
          cash: next.studio.cash,
          lifetimeRevenue: next.studio.lifetimeRevenue,
          debt: next.studio.debt,
        },
      ],
    },
  };

  // Office monthly costs: rent + per-room upkeep, with a consolidated log entry.
  // (Replaces the old inline rent block — `tickOfficeMonthly` also pays upkeep
  // for every installed room, which used to silently never bill.)
  next = tickOfficeMonthly(next);

  // Pay engine maintenance costs for all owned engines
  let maintenanceCost = 0;
  for (const engineId of state.studio.ownedEngineIds) {
    const engine = state.engines[engineId];
    if (!engine) continue;
    if (engine.status === "internal_only" || engine.status === "public_release") {
      maintenanceCost += engine.monthlyMaintenanceCost;
    }
  }
  if (maintenanceCost > 0) {
    next = {
      ...next,
      studio: { ...next.studio, cash: next.studio.cash - maintenanceCost },
    };
  }

  // Run payroll
  next = runPayroll(next);

  // Refresh hiring pool
  next = refreshHiringPool(next);

  // Live-service monthly: collect subscription revenue, decay player counts,
  // auto-sunset failing services (which itself may apply a rep hit).
  next = tickLiveServicesMonthly(next);

  // IP licensing: collect 1/12 of each outstanding annual license fee and
  // retire any license whose end date has passed.
  next = tickIpLicensingRevenue(next);

  // Franchise fatigue drains 2 points/month so resting an IP is a viable
  // alternative to outright rebooting.
  next = tickIpFatigueDecay(next);

  // Decay active random/scheduled event effects by one month — removes any
  // modifiers whose (start + durationMonths) window has now closed.
  next = tickEventEffectsDecay(next);

  // Decay any outstanding reputation hits one month's worth.
  next = tickRepDecay(next);

  // Rotate any expired market-mover waves into their played-out window;
  // drop ones whose played-out window has also expired.
  next = tickMarketShifts(next);

  // Publisher monthly rollup: expire stale offers, grow publisher cash, recompute market caps.
  next = tickPublishersMonthly(next);

  // Mid-development publisher pitches — bigger publishers re-evaluate
  // in-development projects against accumulated quality signal and pitch
  // promising games with better terms than concept-phase offers.
  next = tickPublisherOffersDuringDev(next);

  return next;
}

// ============ YEARLY ROLLUPS ============
function onYearStart(state: GameState): GameState {
  let next = state;

  // Reset yearly-fired scheduled events
  next = { ...next, firedScheduledEventIds: [] };

  // Age all staff by one year
  const newStaff = { ...next.staff };
  for (const [id, staff] of Object.entries(newStaff)) {
    newStaff[id] = { ...staff, age: staff.age + 1 };
  }
  next = { ...next, staff: newStaff };

  // Macro economy rolls over — global demand multipliers shift (boom / recession).
  next = tickEconomicCycle(next);

  // New consoles / PC generations launch on their historical debut year and
  // begin accruing install base; retiring platforms stop growing.
  next = tickPlatformLaunches(next);

  return next;
}
