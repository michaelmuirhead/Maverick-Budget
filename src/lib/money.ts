import type { Cents } from "@/types/schema";

const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

function formatter(currency: string): Intl.NumberFormat {
  const cached = FORMATTER_CACHE.get(currency);
  if (cached) return cached;
  const f = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  });
  FORMATTER_CACHE.set(currency, f);
  return f;
}

/** Format integer cents as a currency string, e.g. 1234 → "$12.34". */
export function formatCents(cents: Cents, currency = "USD"): string {
  return formatter(currency).format(cents / 100);
}

/** Format with a leading "+" for positive (income) values. */
export function formatCentsSigned(cents: Cents, currency = "USD"): string {
  const s = formatCents(Math.abs(cents), currency);
  if (cents > 0) return `+${s}`;
  if (cents < 0) return `−${s}`;
  return s;
}

/**
 * Parse a user-typed money string into integer cents. Tolerates "$", commas,
 * spaces, and a leading minus. Returns null if the input can't be parsed.
 *   "12.34"   → 1234
 *   "$1,234"  → 123400
 *   "-50.5"   → -5050
 *   "abc"     → null
 */
export function parseCents(input: string): Cents | null {
  if (!input) return null;
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return null;
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  // Round to two decimals to avoid floating drift.
  return Math.round(n * 100);
}
