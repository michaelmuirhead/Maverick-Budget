// Helpers for pushing log entries to the news feed in an immutable way.

import type { GameState, LogEntry, LogCategory } from "./state";
import { generateId } from "./ids";

export interface LogInput {
  category: LogCategory;
  headline: string;
  body?: string;
  severity?: "info" | "success" | "warning" | "danger";
  relatedIds?: LogEntry["relatedIds"];
}

export function appendLog(state: GameState, input: LogInput): GameState {
  const [id, rng] = generateId("log", state.rng);
  const entry: LogEntry = {
    id,
    date: state.currentDate,
    severity: input.severity ?? "info",
    ...input,
  };
  const next = [...state.log, entry];
  // Ring buffer — keep only most recent maxLogEntries
  const trimmed = next.length > state.maxLogEntries
    ? next.slice(next.length - state.maxLogEntries)
    : next;
  return { ...state, rng, log: trimmed };
}
