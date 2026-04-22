// Date handling for the game simulation.
// Dates are stored as ISO strings in state for serializability,
// but manipulated as GameDate objects internally.

import type { GameDate } from "../types/core";
import { ERAS } from "../data/eras";

// Days in each month — simple calendar (ignore leap years for simulation simplicity;
// years always have 365 days, February always has 28)
const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function makeDate(year: number, month: number, day: number): GameDate {
  return { year, month, day };
}

export function dateToIso(d: GameDate): string {
  const m = String(d.month).padStart(2, "0");
  const day = String(d.day).padStart(2, "0");
  return `${d.year}-${m}-${day}`;
}

export function isoToDate(iso: string): GameDate {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y!, month: m!, day: d! };
}

export function daysInMonth(_year: number, month: number): number {
  return DAYS_IN_MONTH[month] ?? 30;
}

// Advance a date by N days
export function addDays(date: GameDate, days: number): GameDate {
  let { year, month, day } = date;
  day += days;
  while (day > daysInMonth(year, month)) {
    day -= daysInMonth(year, month);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  while (day < 1) {
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    day += daysInMonth(year, month);
  }
  return { year, month, day };
}

// Number of days between two dates (b - a); positive if b is after a
export function daysBetween(a: GameDate, b: GameDate): number {
  const aDays = toAbsoluteDays(a);
  const bDays = toAbsoluteDays(b);
  return bDays - aDays;
}

// Convert a date to an absolute day count (since some arbitrary epoch).
// Used for comparisons and deltas. Not serialized.
export function toAbsoluteDays(d: GameDate): number {
  let days = d.year * 365;
  for (let m = 1; m < d.month; m++) {
    days += DAYS_IN_MONTH[m]!;
  }
  days += d.day - 1;
  return days;
}

// Compare two dates. Returns negative if a < b, 0 if equal, positive if a > b.
export function compareDate(a: GameDate, b: GameDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function isSameDay(a: GameDate, b: GameDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isFirstOfMonth(d: GameDate): boolean {
  return d.day === 1;
}

export function isFirstOfYear(d: GameDate): boolean {
  return d.day === 1 && d.month === 1;
}

export function isStartOfQuarter(d: GameDate): boolean {
  return d.day === 1 && [1, 4, 7, 10].includes(d.month);
}

// Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday.
// Uses a fixed epoch (1980-01-01 is a Tuesday) for determinism.
// Since years are always 365 days in our sim, Jan 1 cycles through days.
export function dayOfWeek(d: GameDate): number {
  const abs = toAbsoluteDays(d);
  // 1980-01-01 is an absolute day value; we need to find what that maps to.
  // Set our epoch to 1980-01-01 = Tuesday (2).
  const epochAbs = toAbsoluteDays({ year: 1980, month: 1, day: 1 });
  const diff = abs - epochAbs;
  return ((diff % 7) + 7 + 2) % 7;
}

export function isWeekend(d: GameDate): boolean {
  const dow = dayOfWeek(d);
  return dow === 0 || dow === 6; // Sunday or Saturday
}

// Era helpers
export function eraIdForYear(year: number): string {
  const era = ERAS.find((e) => year >= e.startYear && year <= e.endYear);
  return era?.id ?? ERAS[ERAS.length - 1]!.id;
}
