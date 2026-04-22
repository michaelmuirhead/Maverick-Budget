// Save/load utilities — multi-slot edition.
// GameState is fully JSON-serializable; the slot system is just localStorage
// keys plus a small index that the start screen reads.
//
// Storage layout (v2):
//   mvtycoon_slot_index_v2          → JSON array of SlotMeta (lightweight)
//   mvtycoon_slot_<id>_v2           → manual save payload for slot <id>
//   mvtycoon_slot_<id>_auto_v2      → autosave payload for slot <id>
//   mvtycoon_active_slot_v2         → id of last-used slot (Continue convenience)
//
// Legacy v1 keys (single-slot world) are migrated into a "Legacy save" slot
// the first time we read the index after upgrading.

import type { GameState } from "../engine";

const SLOT_INDEX_KEY = "mvtycoon_slot_index_v2";
const ACTIVE_SLOT_KEY = "mvtycoon_active_slot_v2";
const SLOT_PREFIX = "mvtycoon_slot_";
const SLOT_SUFFIX_MANUAL = "_v2";
const SLOT_SUFFIX_AUTO = "_auto_v2";

// Legacy v1 keys — migrated on first listSlots() call, then deleted.
const LEGACY_MANUAL_KEY = "mvtycoon_save_v1";
const LEGACY_AUTOSAVE_KEY = "mvtycoon_autosave_v1";

const CURRENT_SCHEMA_VERSION = 1;

export const MAX_SLOTS = 8;

// What the start screen and in-game slot picker render. Lightweight —
// stays in the index so we don't have to parse every full save just to
// list them.
export interface SlotMeta {
  id: string;
  label: string;
  studioName: string;
  gameDate: string;
  daysElapsed: number;
  cash: number;
  schemaVersion: number;
  manualSavedAt?: string;   // ISO when last manual save occurred
  autoSavedAt?: string;     // ISO when last autosave occurred
  createdAt: string;        // ISO when slot was first created
}

interface SavePayload {
  schemaVersion: number;
  savedAt: string;
  state: GameState;
}

// ============ KEY HELPERS ============

function manualKey(slotId: string): string {
  return `${SLOT_PREFIX}${slotId}${SLOT_SUFFIX_MANUAL}`;
}
function autoKey(slotId: string): string {
  return `${SLOT_PREFIX}${slotId}${SLOT_SUFFIX_AUTO}`;
}

// ============ INDEX READ/WRITE ============

function readIndex(): SlotMeta[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(SLOT_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SlotMeta[];
  } catch {
    return [];
  }
}

function writeIndex(index: SlotMeta[]): void {
  try {
    localStorage.setItem(SLOT_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error("Failed to write slot index:", err);
  }
}

function upsertSlotMeta(meta: SlotMeta): void {
  const index = readIndex();
  const existing = index.findIndex((s) => s.id === meta.id);
  if (existing >= 0) {
    index[existing] = meta;
  } else {
    index.push(meta);
  }
  writeIndex(index);
}

// ============ ID GENERATION ============

function generateSlotId(): string {
  // Short collision-resistant id; doesn't need crypto guarantees for local saves.
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============ LEGACY MIGRATION ============
// Run once: if we find legacy v1 keys but no slot index, create a single
// migrated slot from whichever legacy save is more recent (manual or autosave).

let legacyMigrationAttempted = false;
function migrateLegacyIfNeeded(): void {
  if (legacyMigrationAttempted) return;
  legacyMigrationAttempted = true;
  if (typeof localStorage === "undefined") return;

  const existingIndex = readIndex();
  if (existingIndex.length > 0) return; // already migrated or fresh install with v2 saves

  const legacyManual = localStorage.getItem(LEGACY_MANUAL_KEY);
  const legacyAuto = localStorage.getItem(LEGACY_AUTOSAVE_KEY);
  if (!legacyManual && !legacyAuto) return; // nothing to migrate

  // Pick whichever is newer to seed the slot label / metadata.
  const parseLegacy = (raw: string | null): SavePayload | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SavePayload;
    } catch {
      return null;
    }
  };
  const manualPayload = parseLegacy(legacyManual);
  const autoPayload = parseLegacy(legacyAuto);

  // The "primary" payload — the one we'll write into the new slot's manual
  // key. Manual wins if both exist; otherwise whichever one is non-null.
  const primary = manualPayload ?? autoPayload;
  if (!primary) return;

  const slotId = generateSlotId();
  const meta: SlotMeta = {
    id: slotId,
    label: `${primary.state.studio.name} (legacy save)`,
    studioName: primary.state.studio.name,
    gameDate: primary.state.currentDate,
    daysElapsed: primary.state.daysElapsed,
    cash: primary.state.studio.cash,
    schemaVersion: primary.schemaVersion ?? CURRENT_SCHEMA_VERSION,
    manualSavedAt: manualPayload?.savedAt,
    autoSavedAt: autoPayload?.savedAt,
    createdAt: primary.savedAt ?? new Date().toISOString(),
  };

  try {
    if (manualPayload) {
      localStorage.setItem(manualKey(slotId), JSON.stringify(manualPayload));
    }
    if (autoPayload) {
      localStorage.setItem(autoKey(slotId), JSON.stringify(autoPayload));
    }
    writeIndex([meta]);
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
    // Drop the legacy keys — they're now living in their new home.
    localStorage.removeItem(LEGACY_MANUAL_KEY);
    localStorage.removeItem(LEGACY_AUTOSAVE_KEY);
  } catch (err) {
    console.error("Failed legacy save migration:", err);
  }
}

// ============ PUBLIC API ============

export function listSlots(): SlotMeta[] {
  migrateLegacyIfNeeded();
  return readIndex().slice().sort((a, b) => {
    // Most-recently-touched first.
    const aTime = Math.max(
      a.manualSavedAt ? Date.parse(a.manualSavedAt) : 0,
      a.autoSavedAt ? Date.parse(a.autoSavedAt) : 0
    );
    const bTime = Math.max(
      b.manualSavedAt ? Date.parse(b.manualSavedAt) : 0,
      b.autoSavedAt ? Date.parse(b.autoSavedAt) : 0
    );
    return bTime - aTime;
  });
}

export function getSlotMeta(slotId: string): SlotMeta | null {
  migrateLegacyIfNeeded();
  return readIndex().find((s) => s.id === slotId) ?? null;
}

// Create a fresh slot, persist the initial state into its manual key,
// and mark it active. Throws if at the slot cap.
export function createSlot(label: string, state: GameState): SlotMeta {
  migrateLegacyIfNeeded();
  const index = readIndex();
  if (index.length >= MAX_SLOTS) {
    throw new Error(
      `Save slot limit reached (${MAX_SLOTS}). Delete an existing slot first.`
    );
  }
  const slotId = generateSlotId();
  const now = new Date().toISOString();
  const meta: SlotMeta = {
    id: slotId,
    label: label.trim() || `Save ${index.length + 1}`,
    studioName: state.studio.name,
    gameDate: state.currentDate,
    daysElapsed: state.daysElapsed,
    cash: state.studio.cash,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    manualSavedAt: now,
    createdAt: now,
  };
  const payload: SavePayload = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    savedAt: now,
    state,
  };
  try {
    localStorage.setItem(manualKey(slotId), JSON.stringify(payload));
    upsertSlotMeta(meta);
    setActiveSlotId(slotId);
  } catch (err) {
    console.error("Failed to create slot:", err);
    throw err;
  }
  return meta;
}

// Save into an existing slot. `kind: "manual"` updates manualSavedAt;
// `kind: "auto"` writes to the autosave key. Both refresh the lightweight
// metadata snapshot (game date, cash, etc.).
export function saveToSlot(
  slotId: string,
  state: GameState,
  kind: "manual" | "auto" = "manual"
): void {
  const index = readIndex();
  const meta = index.find((s) => s.id === slotId);
  if (!meta) {
    throw new Error(`Cannot save to unknown slot: ${slotId}`);
  }
  const now = new Date().toISOString();
  const payload: SavePayload = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    savedAt: now,
    state,
  };
  try {
    const key = kind === "manual" ? manualKey(slotId) : autoKey(slotId);
    localStorage.setItem(key, JSON.stringify(payload));
    const updated: SlotMeta = {
      ...meta,
      studioName: state.studio.name,
      gameDate: state.currentDate,
      daysElapsed: state.daysElapsed,
      cash: state.studio.cash,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      manualSavedAt: kind === "manual" ? now : meta.manualSavedAt,
      autoSavedAt: kind === "auto" ? now : meta.autoSavedAt,
    };
    upsertSlotMeta(updated);
  } catch (err) {
    console.error(`Failed to save slot ${slotId} (${kind}):`, err);
    throw err;
  }
}

// Load from an explicit slot. Tries the manual save by default; pass
// `kind: "auto"` to load the autosave instead.
export function loadFromSlot(
  slotId: string,
  kind: "manual" | "auto" = "manual"
): GameState | null {
  migrateLegacyIfNeeded();
  try {
    const key = kind === "manual" ? manualKey(slotId) : autoKey(slotId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Fallback: if requested manual but only autosave exists, try autosave.
      if (kind === "manual") {
        const autoRaw = localStorage.getItem(autoKey(slotId));
        if (autoRaw) {
          const payload = JSON.parse(autoRaw) as SavePayload;
          return migrateState(payload.state, payload.schemaVersion);
        }
      }
      return null;
    }
    const payload = JSON.parse(raw) as SavePayload;
    return migrateState(payload.state, payload.schemaVersion);
  } catch (err) {
    console.error(`Failed to load slot ${slotId} (${kind}):`, err);
    return null;
  }
}

export function renameSlot(slotId: string, label: string): void {
  const trimmed = label.trim();
  if (!trimmed) return;
  const index = readIndex();
  const i = index.findIndex((s) => s.id === slotId);
  if (i < 0) return;
  index[i] = { ...index[i], label: trimmed } as SlotMeta;
  writeIndex(index);
}

export function deleteSlot(slotId: string): void {
  const index = readIndex();
  const next = index.filter((s) => s.id !== slotId);
  writeIndex(next);
  try {
    localStorage.removeItem(manualKey(slotId));
    localStorage.removeItem(autoKey(slotId));
  } catch {
    // ignore — best effort
  }
  if (getActiveSlotId() === slotId) {
    setActiveSlotId(null);
  }
}

export function getActiveSlotId(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(ACTIVE_SLOT_KEY);
}

export function setActiveSlotId(slotId: string | null): void {
  if (typeof localStorage === "undefined") return;
  if (slotId === null) {
    localStorage.removeItem(ACTIVE_SLOT_KEY);
  } else {
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
  }
}

// True if any slot exists (used by start screen to decide whether to show
// the slots panel vs. the bare new-game CTA).
export function hasAnySave(): boolean {
  return listSlots().length > 0;
}

// Default slot to load on Continue: active slot if it still exists,
// otherwise the most-recently-saved one.
export function getMostRecentSlot(): SlotMeta | null {
  const slots = listSlots();
  if (slots.length === 0) return null;
  const activeId = getActiveSlotId();
  if (activeId) {
    const active = slots.find((s) => s.id === activeId);
    if (active) return active;
  }
  return slots[0]!; // listSlots is sorted most-recent-first
}

// ============ MIGRATION PIPELINE ============
// Apply each version-bump transform in sequence. Same logic as v1; the
// slot system itself doesn't change schema versioning.
function migrateState(state: GameState, _fromVersion: number): GameState {
  let migrated = state;

  // Backfill QC fields + ready_to_release status from pre-QC saves.
  const projects = { ...migrated.projects };
  let changed = false;
  for (const [pid, p] of Object.entries(projects)) {
    if (!p) continue;
    let patched = p;
    if (typeof patched.qualityControlActive !== "boolean") {
      patched = { ...patched, qualityControlActive: false };
      changed = true;
    }
    if (typeof patched.qcDaysTotal !== "number") {
      patched = { ...patched, qcDaysTotal: 0 };
      changed = true;
    }
    const launchIdx = patched.phases.length - 1;
    const launchPhase = patched.phases[launchIdx];
    const launchDone = launchPhase ? launchPhase.completion >= 100 : false;
    const wasFlagged = migrated.flags[`${pid}_ready_for_release`];
    if (
      launchDone &&
      wasFlagged &&
      patched.status === "in_development"
    ) {
      patched = { ...patched, status: "ready_to_release" };
      changed = true;
    }
    projects[pid] = patched;
  }
  if (changed) migrated = { ...migrated, projects };

  // Backfill cashHistory — added for the financials chart.
  if (!Array.isArray(migrated.studio.cashHistory)) {
    migrated = {
      ...migrated,
      studio: {
        ...migrated.studio,
        cashHistory: [
          {
            date: migrated.currentDate,
            cash: migrated.studio.cash,
            lifetimeRevenue: migrated.studio.lifetimeRevenue,
            debt: migrated.studio.debt,
          },
        ],
      },
    };
  }

  // Backfill narrative chain state — added for multi-beat news chains.
  // Older saves don't have these fields; default to empty so the new tick
  // can start cleanly without crashing.
  if (!migrated.activeChains || typeof migrated.activeChains !== "object") {
    migrated = { ...migrated, activeChains: {} };
  }
  if (!Array.isArray(migrated.completedChainIds)) {
    migrated = { ...migrated, completedChainIds: [] };
  }

  // Backfill staff.health for older saves — added when the burnout system
  // was wired. Idle saves had this initialized but mid-game saves before
  // 2026-04-22 may have undefined here; default to 100 (healthy baseline).
  const staffWithHealth = { ...migrated.staff };
  let staffPatched = false;
  for (const [sid, s] of Object.entries(staffWithHealth)) {
    if (!s) continue;
    if (typeof s.health !== "number") {
      staffWithHealth[sid] = { ...s, health: 100 };
      staffPatched = true;
    }
  }
  if (staffPatched) migrated = { ...migrated, staff: staffWithHealth };

  return migrated;
}
