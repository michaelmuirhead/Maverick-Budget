// Events system.
//
// Two kinds of events fire in the world:
//  1. Scheduled events — specific dates (E3, GDC, etc.). They fire once per year
//     in their active year range, and if interactive, queue a choice for the player.
//  2. Random events — daily probability rolls with conditions. They can be one-shot
//     (fire once ever) or recurring.
//
// Both use the same resolution flow:
//  - If the event has choices, it's enqueued as a PendingEventChoice — the tick
//    loop still runs but the UI shows a modal prompting the player.
//  - If no choices, effects fire immediately and a log entry is written.
//
// Effects are resolved by a single apply function that takes the effects bag
// and the current state, returning the mutated state. This keeps event data
// declarative and the system tiny.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { PendingEventChoice } from "../core/state";
import type { EventChoice, ScheduledEventDef, RandomEventDef } from "../data/events";

import { SCHEDULED_EVENTS, RANDOM_EVENTS } from "../data/events";
import { NARRATIVE_CHAINS } from "../data/narrativeChains";
import { runAnnualAwards } from "./awards";
import { advanceChainOnChoice } from "./narrativeChains";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate } from "../core/time";
import { rngChance, rngPick } from "../core/rng";

// ============ EFFECTS APPLICATION ============
// Takes an EventChoice's effects and applies them to state.
export function applyEventEffects(
  state: GameState,
  effects: EventChoice["effects"]
): GameState {
  let next = state;

  if (effects.cash !== undefined && effects.cash !== 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        cash: next.studio.cash + effects.cash,
        // Only count positive cash as "lifetime revenue"
        lifetimeRevenue: effects.cash > 0
          ? next.studio.lifetimeRevenue + effects.cash
          : next.studio.lifetimeRevenue,
      },
    };
  }

  if (effects.reputation !== undefined && effects.reputation !== 0) {
    next = {
      ...next,
      studio: {
        ...next.studio,
        reputation: Math.max(0, Math.min(100, next.studio.reputation + effects.reputation)),
      },
    };
  }

  if (effects.moraleAll !== undefined && effects.moraleAll !== 0) {
    const staffUpdates: typeof next.staff = {};
    for (const [sid, s] of Object.entries(next.staff)) {
      if (s.status !== "employed") continue;
      staffUpdates[sid] = {
        ...s,
        morale: Math.max(0, Math.min(100, s.morale + effects.moraleAll)),
      };
    }
    next = { ...next, staff: { ...next.staff, ...staffUpdates } };
  }

  if (effects.unlockFlag) {
    next = {
      ...next,
      flags: { ...next.flags, [effects.unlockFlag]: true },
    };
  }

  // spawnCompetitor and hypeBoostForProjectId handled by specific integrations
  // (competitor system / release system) if/when needed

  return next;
}

// ============ SCHEDULED EVENT DISPATCHER ============
// Called daily — fires any scheduled events whose (month, day) matches today
// and are in their active year range, haven't already fired this year.
export function tickScheduledEvents(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  let next = state;

  for (const evt of SCHEDULED_EVENTS) {
    if (today.month !== evt.month || today.day !== evt.day) continue;
    if (today.year < evt.firstYear || today.year > evt.lastYear) continue;
    if (state.firedScheduledEventIds.includes(evt.id)) continue;

    next = fireScheduledEvent(next, evt);
  }

  return next;
}

function fireScheduledEvent(state: GameState, evt: ScheduledEventDef): GameState {
  let next = state;

  // Mark as fired
  next = {
    ...next,
    firedScheduledEventIds: [...next.firedScheduledEventIds, evt.id],
  };

  if (evt.choices && evt.choices.length > 0) {
    // Enqueue as interactive
    let rng = next.rng;
    const [pendingId, r1] = generateId("pend", rng);
    rng = r1;
    const pending: PendingEventChoice = {
      id: pendingId,
      eventDefId: evt.id,
      spawnedDate: next.currentDate,
    };
    next = {
      ...next,
      rng,
      pendingEvents: [...next.pendingEvents, pending],
    };
    next = appendLog(next, {
      category: "event",
      headline: `${evt.name}`,
      body: evt.description,
      severity: "info",
    });
  } else {
    next = appendLog(next, {
      category: "event",
      headline: evt.name,
      body: evt.description,
      severity: "info",
    });
    // Special scheduled events that trigger real mechanics
    if (evt.id === "evt_goty_awards") {
      next = runAnnualAwards(next);
    }
  }

  return next;
}

// ============ RANDOM EVENT DISPATCHER ============
// Runs daily — for each event definition, roll against baseProbability if
// conditions are met. Cap total firings per day to avoid spam (max 1/day).
export function tickRandomEvents(state: GameState): GameState {
  let next = state;
  let rng = next.rng;

  const today = isoToDate(next.currentDate);
  const year = today.year;
  const employed = Object.values(next.staff).filter((s) => s.status === "employed").length;
  const releasedCount = Object.values(next.projects).filter((p) => p.status === "released").length;
  const activeCount = Object.values(next.projects).filter((p) => p.status === "in_development").length;

  // Shuffle order so we don't always check the same events first
  const eligible = RANDOM_EVENTS.filter((evt) => {
    if (evt.oneShot && next.firedOneShotEventIds.includes(evt.id)) return false;
    const cond = evt.conditions;
    if (!cond) return true;
    if (cond.minYear !== undefined && year < cond.minYear) return false;
    if (cond.maxYear !== undefined && year > cond.maxYear) return false;
    if (cond.minStaffCount !== undefined && employed < cond.minStaffCount) return false;
    if (cond.minReputation !== undefined && next.studio.reputation < cond.minReputation) return false;
    if (cond.minCash !== undefined && next.studio.cash < cond.minCash) return false;
    if (cond.requiresReleasedGame && releasedCount === 0) return false;
    if (cond.requiresActiveProject && activeCount === 0) return false;
    return true;
  });

  if (eligible.length === 0) return { ...next, rng };

  // Cap to 1 fired event per day to avoid overwhelming the player
  let firedThisDay = 0;
  for (const evt of eligible) {
    if (firedThisDay >= 1) break;
    const [roll, r1] = rngChance(rng, evt.baseProbability);
    rng = r1;
    if (!roll) continue;

    next = fireRandomEvent(next, evt);
    firedThisDay++;
  }

  return { ...next, rng };
}

function fireRandomEvent(state: GameState, evt: RandomEventDef): GameState {
  let next = state;

  // Mark one-shot as fired forever
  if (evt.oneShot) {
    next = {
      ...next,
      firedOneShotEventIds: [...next.firedOneShotEventIds, evt.id],
    };
  }

  if (evt.choices && evt.choices.length > 0) {
    let rng = next.rng;
    const [pendingId, r1] = generateId("pend", rng);
    rng = r1;

    // Context — for staff events, pick a random staff member to attach
    let context: Record<string, unknown> | undefined;
    if (evt.category === "staff") {
      const employed = Object.values(next.staff).filter((s) => s.status === "employed");
      if (employed.length > 0) {
        const [picked, r2] = rngPick(rng, employed);
        rng = r2;
        context = { staffId: picked.id, staffName: picked.name };
      }
    }

    const pending: PendingEventChoice = {
      id: pendingId,
      eventDefId: evt.id,
      spawnedDate: next.currentDate,
      context,
    };
    next = {
      ...next,
      rng,
      pendingEvents: [...next.pendingEvents, pending],
    };
    next = appendLog(next, {
      category: "event",
      headline: `${evt.name}`,
      body: context?.staffName ? `Involves ${context.staffName}. ${evt.description}` : evt.description,
      severity: "info",
    });
  } else {
    // Fire-and-forget event — apply a sensible default effect based on event ID
    next = applyAutoResolvedEvent(next, evt);
  }

  return next;
}

// ============ AUTO-RESOLVED (non-interactive) EVENTS ============
// Fire-and-forget events still need to have their impact felt. These resolve
// by event ID to avoid adding special fields to every event def.
function applyAutoResolvedEvent(state: GameState, evt: RandomEventDef): GameState {
  let next = state;

  switch (evt.id) {
    case "evt_viral_moment": {
      // Pick a recent release — boost its lifetime sales by +30% if still active
      const activeSales = Object.values(next.activeSales).filter((s) => s.active);
      if (activeSales.length > 0) {
        let rng = next.rng;
        const [picked, r1] = rngPick(rng, activeSales);
        rng = r1;
        next = {
          ...next,
          rng,
          activeSales: {
            ...next.activeSales,
            [picked.id]: {
              ...picked,
              projectedLifetimeUnits: Math.round(picked.projectedLifetimeUnits * 1.3),
              projectedLifetimeRevenue: Math.round(picked.projectedLifetimeRevenue * 1.3),
            },
          },
        };
        const project = next.projects[picked.projectId];
        next = appendLog(next, {
          category: "event",
          headline: `${evt.name}: ${project?.name ?? "a release"}`,
          body: "Sales projection up 30% from viral buzz.",
          severity: "success",
        });
      }
      break;
    }

    case "evt_hardware_shortage": {
      next = {
        ...next,
        flags: { ...next.flags, event_hardware_shortage_active: true },
      };
      // Drop platform install base growth 15% temporarily via metadata flag
      next = appendLog(next, {
        category: "event",
        headline: evt.name,
        body: "Platform sales will be depressed for the next few months.",
        severity: "warning",
      });
      break;
    }

    case "evt_economic_boom": {
      // Boost all active sales by 20% projected revenue
      const saleUpdates: typeof next.activeSales = {};
      for (const s of Object.values(next.activeSales)) {
        if (!s.active) continue;
        saleUpdates[s.id] = {
          ...s,
          projectedLifetimeRevenue: Math.round(s.projectedLifetimeRevenue * 1.2),
          projectedLifetimeUnits: Math.round(s.projectedLifetimeUnits * 1.2),
        };
      }
      next = { ...next, activeSales: { ...next.activeSales, ...saleUpdates } };
      next = appendLog(next, {
        category: "event",
        headline: evt.name,
        body: "All active sales projections boosted.",
        severity: "success",
      });
      break;
    }

    case "evt_recession": {
      // Shrink all active sales by 25%
      const saleUpdates: typeof next.activeSales = {};
      for (const s of Object.values(next.activeSales)) {
        if (!s.active) continue;
        saleUpdates[s.id] = {
          ...s,
          projectedLifetimeRevenue: Math.round(s.projectedLifetimeRevenue * 0.75),
          projectedLifetimeUnits: Math.round(s.projectedLifetimeUnits * 0.75),
        };
      }
      next = { ...next, activeSales: { ...next.activeSales, ...saleUpdates } };
      next = appendLog(next, {
        category: "event",
        headline: evt.name,
        body: "Sales projections cut by 25%.",
        severity: "danger",
      });
      break;
    }

    case "evt_genre_trend_up": {
      // Pick a random genre — set a market trend
      const genres = Object.keys(next.market.genreTrends ?? {});
      const allGenres = [
        "action", "adventure", "rpg", "strategy", "simulation", "sports", "racing",
        "fighting", "shooter", "platformer", "puzzle", "horror", "survival",
      ];
      let rng = next.rng;
      const [genre, r1] = rngPick(rng, allGenres);
      rng = r1;
      next = {
        ...next,
        rng,
        market: {
          ...next.market,
          genreTrends: { ...next.market.genreTrends, [genre]: 25 },
        },
      };
      next = appendLog(next, {
        category: "event",
        headline: `${evt.name}: ${genre}`,
        body: `The ${genre} genre is trending — +25% sales boost for ${genre} releases until trend cools.`,
        severity: "success",
      });
      break;
    }

    case "evt_press_praise": {
      next = {
        ...next,
        studio: {
          ...next.studio,
          reputation: Math.min(100, next.studio.reputation + 3),
        },
      };
      next = appendLog(next, {
        category: "event",
        headline: evt.name,
        body: "Reputation +3 from favorable press coverage.",
        severity: "success",
      });
      break;
    }

    case "evt_indie_breakout":
    case "evt_new_platform_leak":
    case "evt_publisher_pitch":
    case "evt_acquisition_interest":
    default: {
      next = appendLog(next, {
        category: "event",
        headline: evt.name,
        body: evt.description,
        severity: "info",
      });
      break;
    }
  }

  return next;
}

// ============ MONTHLY DECAY ============
// Market trends drift back toward neutral over time, and temporary flags
// (like hardware shortage) expire after a few months. Called monthly from
// the master tick.
export function tickEventEffectsDecay(state: GameState): GameState {
  let next = state;

  // Decay genre trends 20% per month toward 0
  const trends = next.market.genreTrends ?? {};
  const newTrends: Record<string, number> = {};
  for (const [genre, value] of Object.entries(trends)) {
    const decayed = Math.round(value * 0.8);
    // Drop near-zero trends entirely
    if (Math.abs(decayed) >= 2) {
      newTrends[genre] = decayed;
    }
  }
  next = {
    ...next,
    market: { ...next.market, genreTrends: newTrends },
  };

  // Hardware shortage — expires ~3 months after firing (rough implementation
  // via a monthly coin flip once active)
  if (next.flags.event_hardware_shortage_active) {
    let rng = next.rng;
    const [lifts, r1] = rngChance(rng, 0.35);
    rng = r1;
    next = { ...next, rng };
    if (lifts) {
      const newFlags = { ...next.flags };
      delete newFlags.event_hardware_shortage_active;
      next = { ...next, flags: newFlags };
      next = appendLog(next, {
        category: "event",
        headline: "Chip shortage eases",
        body: "Supply returns to normal.",
        severity: "success",
      });
    }
  }

  return next;
}

// ============ PLAYER RESOLVES A CHOICE ============
// Called when the player clicks a choice button on a pending event.
// Applies the choice's effects and removes the pending from the queue.
export function resolveEventChoice(
  state: GameState,
  pendingId: ID,
  choiceId: string
): GameState {
  const pending = state.pendingEvents.find((p) => p.id === pendingId);
  if (!pending) return state;

  // ---- Narrative chain resolution path ----
  // Chain-linked pendings carry a `chain` ref instead of a real event def.
  // Apply the choice via the chain runtime, then drop the pending.
  if (pending.chain) {
    let next = state;
    next = advanceChainOnChoice(next, pending.chain.chainId, pending.chain.beatId, choiceId);
    next = {
      ...next,
      pendingEvents: next.pendingEvents.filter((p) => p.id !== pendingId),
    };
    return next;
  }

  // Find the event def (scheduled or random)
  const scheduled = SCHEDULED_EVENTS.find((e) => e.id === pending.eventDefId);
  const random = RANDOM_EVENTS.find((e) => e.id === pending.eventDefId);
  const evtDef = scheduled ?? random;
  if (!evtDef) return state;

  const choice = evtDef.choices?.find((c) => c.id === choiceId);
  if (!choice) return state;

  let next = state;

  // Apply declared effects
  next = applyEventEffects(next, choice.effects);

  // Contextual side effects that depend on which choice was picked and which
  // event fired. Each case handles the specific nuance that the declarative
  // `effects` bag can't express.
  next = applyChoiceSideEffects(next, evtDef.id, choice.id, pending);

  // Remove pending
  next = {
    ...next,
    pendingEvents: next.pendingEvents.filter((p) => p.id !== pendingId),
  };

  next = appendLog(next, {
    category: "event",
    headline: `${evtDef.name}: ${choice.label}`,
    body: choice.description,
    severity: "info",
  });

  return next;
}

// Lookup helper used by the event modal UI: given a chain-linked pending,
// return the corresponding chain beat so the modal can render the prompt and
// choice buttons. Returns null if the chain or beat can't be found.
export function lookupChainBeatForPending(
  pending: PendingEventChoice
): { chainName: string; description: string; choices: { id: string; label: string; description: string }[] } | null {
  if (!pending.chain) return null;
  const def = NARRATIVE_CHAINS.find((c) => c.id === pending.chain!.chainId);
  if (!def) return null;
  const beat = def.beats.find((b) => b.id === pending.chain!.beatId);
  if (!beat?.choices) return null;
  return {
    chainName: def.name,
    description: beat.body,
    choices: beat.choices.map((c) => ({ id: c.id, label: c.label, description: c.description })),
  };
}

// Side-effect hooks for specific event/choice combinations that need custom
// logic beyond what the generic effects bag supports.
function applyChoiceSideEffects(
  state: GameState,
  eventId: string,
  choiceId: string,
  pending: PendingEventChoice
): GameState {
  let next = state;

  // ---- Staff raise request ----
  if (eventId === "evt_staff_raise_request" && pending.context) {
    const staffId = pending.context.staffId as string;
    const s = next.staff[staffId];
    if (s) {
      if (choiceId === "grant") {
        next = {
          ...next,
          staff: {
            ...next.staff,
            [staffId]: {
              ...s,
              salary: Math.round(s.salary * 1.15),
              loyalty: Math.min(100, s.loyalty + 15),
              morale: Math.min(100, s.morale + 10),
            },
          },
        };
      } else if (choiceId === "partial") {
        next = {
          ...next,
          staff: {
            ...next.staff,
            [staffId]: {
              ...s,
              salary: Math.round(s.salary * 1.07),
              loyalty: Math.min(100, s.loyalty + 5),
              morale: Math.min(100, s.morale + 3),
            },
          },
        };
      } else if (choiceId === "deny") {
        next = {
          ...next,
          staff: {
            ...next.staff,
            [staffId]: {
              ...s,
              loyalty: Math.max(0, s.loyalty - 15),
              morale: Math.max(0, s.morale - 10),
            },
          },
        };
      }
    }
  }

  // ---- Poaching offer ----
  if (eventId === "evt_poaching_offer" && pending.context) {
    const staffId = pending.context.staffId as string;
    const s = next.staff[staffId];
    if (s) {
      if (choiceId === "counter") {
        const counterCost = Math.round(s.salary * 0.25);
        next = {
          ...next,
          studio: { ...next.studio, cash: next.studio.cash - counterCost },
          staff: {
            ...next.staff,
            [staffId]: {
              ...s,
              salary: Math.round(s.salary * 1.2),
              loyalty: Math.min(100, s.loyalty + 10),
            },
          },
        };
        next = appendLog(next, {
          category: "staff",
          headline: `Counter-offer accepted: ${s.name}`,
          body: `$${Math.round(counterCost / 100).toLocaleString()} in signing bonus.`,
          severity: "success",
        });
      } else if (choiceId === "let_go") {
        // 70% chance they leave
        let rng = next.rng;
        const [leaves, r1] = rngChance(rng, 0.7);
        rng = r1;
        if (leaves) {
          next = {
            ...next,
            rng,
            staff: {
              ...next.staff,
              [staffId]: { ...s, status: "resigned", currentProjectId: null },
            },
          };
          // Remove from any project assignments
          const projectUpdates: typeof next.projects = {};
          for (const p of Object.values(next.projects)) {
            if (p.assignedStaffIds.includes(staffId)) {
              projectUpdates[p.id] = {
                ...p,
                assignedStaffIds: p.assignedStaffIds.filter((id) => id !== staffId),
              };
            }
          }
          next = {
            ...next,
            projects: { ...next.projects, ...projectUpdates },
          };
          next = appendLog(next, {
            category: "staff",
            headline: `${s.name} accepted the outside offer`,
            severity: "danger",
          });
        }
      } else if (choiceId === "plead") {
        // 50% retention without cost, but loyalty bumped either way
        let rng = next.rng;
        const [stays, r1] = rngChance(rng, 0.5);
        rng = r1;
        if (stays) {
          next = {
            ...next,
            rng,
            staff: {
              ...next.staff,
              [staffId]: { ...s, loyalty: Math.min(100, s.loyalty + 20) },
            },
          };
          next = appendLog(next, {
            category: "staff",
            headline: `${s.name} decided to stay`,
            severity: "success",
          });
        } else {
          next = {
            ...next,
            rng,
            staff: {
              ...next.staff,
              [staffId]: { ...s, status: "resigned", currentProjectId: null },
            },
          };
          next = appendLog(next, {
            category: "staff",
            headline: `${s.name} accepted the outside offer despite the plea`,
            severity: "danger",
          });
        }
      }
    }
  }

  // ---- Gamescom Opening Night showcase ----
  // Headlining the consumer keynote blasts hype across every in-development
  // game. +8 hypeLevel on each project currently in development. Booths and
  // press kits already did their rep work through the generic effects bag.
  if (eventId === "evt_gamescom" && choiceId === "showcase") {
    const projectUpdates: typeof next.projects = {};
    for (const p of Object.values(next.projects)) {
      if (p.status !== "in_development") continue;
      projectUpdates[p.id] = {
        ...p,
        hypeLevel: Math.min(100, p.hypeLevel + 8),
      };
    }
    if (Object.keys(projectUpdates).length > 0) {
      next = { ...next, projects: { ...next.projects, ...projectUpdates } };
      next = appendLog(next, {
        category: "event",
        headline: "Gamescom showcase lifts hype across slate",
        body: `+8 hype on ${Object.keys(projectUpdates).length} in-development project(s).`,
        severity: "success",
      });
    }
  }

  // ---- TGS Japanese distribution partnership ----
  // A real JP distributor behind your releases broadens visibility. Flat +12%
  // projected revenue and units across every active sale. Mirrors the shape
  // of evt_viral_moment but spread across the whole catalog rather than one
  // game. Smaller per-title lift than a viral moment, but hits everything.
  if (eventId === "evt_tgs" && choiceId === "jp_partnership") {
    const saleUpdates: typeof next.activeSales = {};
    for (const s of Object.values(next.activeSales)) {
      if (!s.active) continue;
      saleUpdates[s.id] = {
        ...s,
        projectedLifetimeRevenue: Math.round(s.projectedLifetimeRevenue * 1.12),
        projectedLifetimeUnits: Math.round(s.projectedLifetimeUnits * 1.12),
      };
    }
    if (Object.keys(saleUpdates).length > 0) {
      next = { ...next, activeSales: { ...next.activeSales, ...saleUpdates } };
      next = appendLog(next, {
        category: "event",
        headline: "Japanese distribution deal signed",
        body: `+12% projected sales across ${Object.keys(saleUpdates).length} active release(s).`,
        severity: "success",
      });
    }
  }

  // ---- GOTY awards submission / campaign ----
  // Set a voter-bias metadata entry that runAnnualAwards reads when the
  // ceremony fires in December. The entry is an effective-score bonus that
  // the awards system adds to player-game sort keys (not to displayed
  // metacritic). Cleared by the awards system after it runs. skip/standard
  // don't set anything. Using metadata (string|number) instead of flags
  // (boolean-only) so the numeric boost value can be stored.
  if (eventId === "evt_goty_submission") {
    let boost = 0;
    if (choiceId === "fyc_campaign") boost = 3;
    else if (choiceId === "major_push") boost = 8;
    if (boost > 0) {
      next = {
        ...next,
        metadata: { ...next.metadata, gotyCampaignBoost: boost },
      };
    }
  }

  // ---- Holiday Rush marketing burst ----
  // Q4 advertising lifts projections across every active sale. TV burst gets
  // +15%, the all-channel push gets +25% and also spawns a small rep halo
  // (already covered by the generic effects bag for rep). Uses the same
  // projection-adjustment shape as evt_economic_boom.
  if (eventId === "evt_holiday_rush") {
    const mult = choiceId === "tv_burst" ? 1.15 : choiceId === "massive_push" ? 1.25 : 1.0;
    if (mult > 1.0) {
      const saleUpdates: typeof next.activeSales = {};
      for (const s of Object.values(next.activeSales)) {
        if (!s.active) continue;
        saleUpdates[s.id] = {
          ...s,
          projectedLifetimeRevenue: Math.round(s.projectedLifetimeRevenue * mult),
          projectedLifetimeUnits: Math.round(s.projectedLifetimeUnits * mult),
        };
      }
      if (Object.keys(saleUpdates).length > 0) {
        next = { ...next, activeSales: { ...next.activeSales, ...saleUpdates } };
        next = appendLog(next, {
          category: "event",
          headline: "Holiday marketing push lifts active sales",
          body: `+${Math.round((mult - 1) * 100)}% projected sales across ${Object.keys(saleUpdates).length} release(s).`,
          severity: "success",
        });
      }
    }
  }

  // ---- Burnout incident ----
  if (eventId === "evt_burnout_incident" && pending.context) {
    const staffId = pending.context.staffId as string;
    const s = next.staff[staffId];
    if (s) {
      if (choiceId === "mandatory_leave") {
        next = {
          ...next,
          staff: {
            ...next.staff,
            [staffId]: { ...s, energy: 100, morale: Math.min(100, s.morale + 20), currentProjectId: null },
          },
        };
      } else if (choiceId === "reduced_hours") {
        next = {
          ...next,
          staff: {
            ...next.staff,
            [staffId]: { ...s, energy: Math.min(100, s.energy + 40), morale: Math.min(100, s.morale + 10) },
          },
        };
      } else if (choiceId === "ignore") {
        // 50% chance resignation
        let rng = next.rng;
        const [resigns, r1] = rngChance(rng, 0.5);
        rng = r1;
        if (resigns) {
          next = {
            ...next,
            rng,
            staff: {
              ...next.staff,
              [staffId]: { ...s, status: "resigned", currentProjectId: null },
            },
            studio: {
              ...next.studio,
              reputation: Math.max(0, next.studio.reputation - 5),
            },
          };
          next = appendLog(next, {
            category: "staff",
            headline: `${s.name} resigned, citing burnout publicly`,
            severity: "danger",
          });
        } else {
          next = {
            ...next,
            rng,
            staff: {
              ...next.staff,
              [staffId]: { ...s, morale: Math.max(0, s.morale - 20) },
            },
          };
        }
      }
    }
  }

  return next;
}
