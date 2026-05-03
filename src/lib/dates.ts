import type { DateString, MonthString } from "@/types/schema";

/** Today as YYYY-MM-DD in the local timezone (no UTC drift). */
export function todayISO(): DateString {
  const d = new Date();
  return formatDate(d);
}

export function formatDate(d: Date): DateString {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Convert a YYYY-MM-DD string to its YYYY-MM month bucket. */
export function monthOf(date: DateString): MonthString {
  return date.slice(0, 7);
}

export function currentMonth(): MonthString {
  return todayISO().slice(0, 7);
}

/** Add `n` months (can be negative) to a YYYY-MM string. */
export function addMonths(month: MonthString, n: number): MonthString {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

/** Human-friendly month label, e.g. "May 2026". */
export function formatMonth(month: MonthString): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

/** Human-friendly date label for transaction lists, e.g. "May 3" or "May 3, 2025". */
export function formatHumanDate(date: DateString): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const now = new Date();
  const sameYear = y === now.getFullYear();
  return dt.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}
