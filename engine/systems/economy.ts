// Economic cycle system.
//
// market.economicCycle: -2 deep recession, -1 recession, 0 neutral, +1 boom, +2 bubble.
// Transitions happen yearly with Markov-style drift — cycles tend to regress
// toward neutral but can persist or intensify.
//
// Effects:
//   - Release sales projections multiplied by economyMultiplier()
//   - Platform install base growth rate modulated
//   - Publisher deals get slightly worse in downturns
//   - Random event rates of economic boom/recession still fire, but no longer
//     in isolation — they now move the underlying cycle.

import type { GameState } from "../core/state";
import { appendLog } from "../core/log";
import { rngFloat, rngPick } from "../core/rng";

// Convert cycle value to a sales multiplier
// -2 → 0.7x (deep recession), -1 → 0.85x, 0 → 1x, +1 → 1.15x, +2 → 1.3x bubble
export function economyMultiplier(cycle: number): number {
  const clamped = Math.max(-2, Math.min(2, cycle));
  return 1 + clamped * 0.15;
}

// Phase name for UI
export function economyPhaseName(cycle: number): string {
  if (cycle <= -2) return "Deep Recession";
  if (cycle <= -1) return "Recession";
  if (cycle <= -0.3) return "Downturn";
  if (cycle < 0.3) return "Stable";
  if (cycle <= 1) return "Growth";
  if (cycle <= 2) return "Boom";
  return "Bubble";
}

// Yearly Markov transition. Call from onYearStart.
// Each cycle state has transition probabilities to adjacent states.
// Tendency: drift toward neutral, but with noise.
export function tickEconomicCycle(state: GameState): GameState {
  const currentCycle = state.market.economicCycle;
  let rng = state.rng;

  // Transition table — for current cycle, probabilities to move {-1, 0, +1} adjacent
  // First column: prob of going deeper in direction (-0.5), second: stay, third: recover (+0.5)
  // Current  [deeper, stay, recover]
  let deeper = 0.2;
  let stay = 0.4;
  let recover = 0.4;

  if (currentCycle <= -1.5) {
    // Deep recession — more likely to recover than deepen
    deeper = 0.1;
    stay = 0.3;
    recover = 0.6;
  } else if (currentCycle <= -0.5) {
    // Recession — balanced, slight recovery bias
    deeper = 0.2;
    stay = 0.4;
    recover = 0.4;
  } else if (currentCycle <= 0.5) {
    // Neutral — mostly stable, slight drift either way
    deeper = 0.25;
    stay = 0.5;
    recover = 0.25;
  } else if (currentCycle <= 1.5) {
    // Boom — more likely to cool than intensify
    deeper = 0.45; // "deeper" here = more boom
    stay = 0.35;
    recover = 0.2;
  } else {
    // Bubble — usually pops
    deeper = 0.15;
    stay = 0.25;
    recover = 0.6; // "recover" here = drop back
  }

  const [roll, r1] = rngFloat(rng, 0, 1);
  rng = r1;
  let delta = 0;
  // For recessions and neutral: "deeper" = -0.5, "recover" = +0.5
  // For booms: "deeper" = +0.5 (more boom), "recover" = -0.5 (cool off)
  const direction = currentCycle >= 0 ? 1 : -1;
  if (roll < deeper) delta = direction * 0.5;
  else if (roll < deeper + stay) delta = 0;
  else delta = -direction * 0.5;

  // If we're near zero, the direction is ambiguous — randomize
  if (Math.abs(currentCycle) < 0.3) {
    const [coin, r2] = rngFloat(rng, 0, 1);
    rng = r2;
    delta = roll < 0.33 ? -0.5 : roll < 0.66 ? 0 : 0.5;
    if (coin > 0.5) delta = -delta;
  }

  const newCycle = Math.max(-2, Math.min(2, currentCycle + delta));

  let next: GameState = {
    ...state,
    rng,
    market: { ...state.market, economicCycle: newCycle },
  };

  // Log transitions when they cross thresholds
  const oldPhase = economyPhaseName(currentCycle);
  const newPhase = economyPhaseName(newCycle);
  if (oldPhase !== newPhase) {
    const severity =
      newCycle < currentCycle ? (newCycle <= -1 ? "danger" : "warning") :
      newCycle > currentCycle ? (newCycle >= 1 ? "success" : "info") :
      "info";
    next = appendLog(next, {
      category: "market",
      headline: `Economy shifts: ${oldPhase} → ${newPhase}`,
      body: `Multiplier on game sales: ${economyMultiplier(newCycle).toFixed(2)}x`,
      severity,
    });
  }

  return next;
}
