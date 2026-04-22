// Mulberry32 — fast, tiny, deterministic PRNG.
// Pure functional: given a state, returns { value, nextState } rather than mutating.
// This keeps the engine fully pure and serializable.

import type { RngState } from "../types/core";

export function createRng(seed: number): RngState {
  return { seed: seed >>> 0 };
}

// Core step: returns [float in [0,1), new state]
export function rngNext(state: RngState): [number, RngState] {
  let t = (state.seed + 0x6d2b79f5) >>> 0;
  const nextSeed = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, { seed: nextSeed }];
}

// Integer in [min, max] inclusive
export function rngInt(state: RngState, min: number, max: number): [number, RngState] {
  const [v, next] = rngNext(state);
  return [Math.floor(v * (max - min + 1)) + min, next];
}

// Float in [min, max)
export function rngFloat(state: RngState, min: number, max: number): [number, RngState] {
  const [v, next] = rngNext(state);
  return [v * (max - min) + min, next];
}

// Pick random element from an array
export function rngPick<T>(state: RngState, arr: readonly T[]): [T, RngState] {
  const [idx, next] = rngInt(state, 0, arr.length - 1);
  return [arr[idx]!, next];
}

// Weighted pick — weights don't need to sum to 1
export function rngWeighted<T>(
  state: RngState,
  entries: readonly { item: T; weight: number }[]
): [T, RngState] {
  const total = entries.reduce((s, e) => s + e.weight, 0);
  const [roll, next] = rngFloat(state, 0, total);
  let cumulative = 0;
  for (const entry of entries) {
    cumulative += entry.weight;
    if (roll < cumulative) return [entry.item, next];
  }
  return [entries[entries.length - 1]!.item, next];
}

// Gaussian-ish (box-muller); clamped
export function rngGaussian(
  state: RngState,
  mean: number,
  stdDev: number
): [number, RngState] {
  const [u1, s1] = rngNext(state);
  const [u2, s2] = rngNext(s1);
  const safeU1 = Math.max(u1, 1e-10); // avoid log(0)
  const z = Math.sqrt(-2 * Math.log(safeU1)) * Math.cos(2 * Math.PI * u2);
  return [mean + z * stdDev, s2];
}

// Probability check — true with given probability (0-1)
export function rngChance(state: RngState, probability: number): [boolean, RngState] {
  const [v, next] = rngNext(state);
  return [v < probability, next];
}

// Shuffle (Fisher-Yates); returns new array
export function rngShuffle<T>(state: RngState, arr: readonly T[]): [T[], RngState] {
  const result = [...arr];
  let current = state;
  for (let i = result.length - 1; i > 0; i--) {
    const [j, next] = rngInt(current, 0, i);
    [result[i], result[j]] = [result[j]!, result[i]!];
    current = next;
  }
  return [result, current];
}
