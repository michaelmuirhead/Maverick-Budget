// Deterministic ID generation — IDs are derived from the RNG state
// so saves are reproducible. We use a simple counter + random suffix.

import type { RngState } from "../types/core";
import { rngInt } from "./rng";

export function generateId(prefix: string, rng: RngState): [string, RngState] {
  const [n, next] = rngInt(rng, 0, 0xffffff);
  const hex = n.toString(16).padStart(6, "0");
  return [`${prefix}_${hex}`, next];
}
