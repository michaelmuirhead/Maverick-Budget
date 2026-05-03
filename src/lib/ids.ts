// 26 letters + 10 digits, minus the easily-confused glyphs (0/O, 1/I/L).
// Yields ~10^9 codes at length 6 — plenty for a personal app.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateJoinCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** Cheap monotonic-ish ID for client-generated docs (transactions, etc). */
export function generateId(): string {
  return crypto.randomUUID();
}
