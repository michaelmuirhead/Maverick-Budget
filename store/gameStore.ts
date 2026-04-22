// The Zustand store is the single subscription surface the UI uses.
// It wraps the pure engine and manages:
//   - current GameState
//   - game speed (paused / 1x / 2x / 4x) and the RAF-driven tick loop
//   - save/load to localStorage
//   - dispatch wrappers for every engine action (each returns new state)

import { create } from "zustand";
import type {
  GameState, NewGameOptions, CreateProjectInput, StartEngineProjectInput,
  ID, PhaseFocusSliders, LicenseTerms,
} from "../engine";
import {
  createNewGameState, tickOneDay, tickDays,
  createProject, setPhaseSliders, setPhaseCrunch, cancelProject,
  toggleQualityControl, approveRelease,
  hireCandidate, fireStaff, giveRaise, assignStaffToProject, unassignStaffFromProject,
  startResearch, cancelResearch,
  startEngineProject, cancelEngineProject, publiclyReleaseEngine,
  updateEngineLicenseTerms, deprecateEngine,
  rebootIp, licenseIpOut, revokeIpLicense, renameIp,
  upgradeOffice, addRoom, removeRoom,
  acceptPublishingDeal, declinePublishingDeal, acquirePublisher,
  foundPublisherImprint, signCompetitorToImprint,
  acquireCompetitor,
  resolveEventChoice,
  acceptSubscriptionOffer, declineSubscriptionOffer,
  createDlc, enableLiveService, addDlcPlanToProject, removeDlcPlan,
  startPatchSprint, cancelPatchSprint,
} from "../engine";
import type { DLCKind, StartPatchSprintInput } from "../engine";
import type { PublisherTier, GenreId, Money } from "../engine";
import {
  listSlots,
  createSlot,
  saveToSlot,
  loadFromSlot,
  renameSlot,
  deleteSlot,
  getActiveSlotId,
  setActiveSlotId,
  getMostRecentSlot,
  hasAnySave,
  type SlotMeta,
} from "./persistence";

// Game-speed: days advanced per real-time second at 1x
const DAYS_PER_SECOND_1X = 4;

type GameSpeed = 0 | 1 | 2 | 4;

interface GameStoreState {
  state: GameState | null;
  isInitialized: boolean;
  isPaused: boolean;
  // Autosave tracking
  lastAutosaveDaysElapsed: number;
  // Which save slot we're playing in (writes go here)
  activeSlotId: string | null;

  // Lifecycle
  newGame: (options: NewGameOptions, slotLabel?: string) => void;
  load: () => boolean;                                    // back-compat: load most-recent slot
  loadSlot: (slotId: string, kind?: "manual" | "auto") => boolean;
  save: () => void;                                       // saves to active slot
  reset: () => void;

  // Slot management (start screen / pause menu)
  listSaves: () => SlotMeta[];
  deleteSave: (slotId: string) => void;
  renameSave: (slotId: string, label: string) => void;
  setActiveSlot: (slotId: string | null) => void;

  // Time control
  setSpeed: (speed: GameSpeed) => void;
  togglePause: () => void;
  tickOne: () => void;
  tickMany: (days: number) => void;

  // Development
  createProject: (input: CreateProjectInput) => ID | null;
  setPhaseSliders: (projectId: ID, phaseIndex: number, sliders: PhaseFocusSliders) => void;
  setPhaseCrunch: (projectId: ID, phaseIndex: number, crunching: boolean) => void;
  cancelProject: (projectId: ID) => void;
  toggleQualityControl: (projectId: ID, active: boolean) => void;
  approveRelease: (projectId: ID) => void;

  // Staff
  hireCandidate: (candidateId: ID) => void;
  fireStaff: (staffId: ID) => void;
  giveRaise: (staffId: ID, pctIncrease: number) => void;
  assignStaffToProject: (staffId: ID, projectId: ID) => void;
  unassignStaffFromProject: (staffId: ID, projectId: ID) => void;

  // R&D
  startResearch: (nodeId: string, staffIds: ID[]) => void;
  cancelResearch: (researchId: ID) => void;

  // Engine builder
  startEngineProject: (input: StartEngineProjectInput) => ID | null;
  cancelEngineProject: (projectId: ID) => void;
  publiclyReleaseEngine: (engineId: ID, terms?: Partial<LicenseTerms>) => void;
  updateEngineLicenseTerms: (engineId: ID, terms: Partial<LicenseTerms>) => void;
  deprecateEngine: (engineId: ID) => void;

  // IP actions
  rebootIp: (ipId: ID) => void;
  licenseIpOut: (ipId: ID, options?: { years?: number; licenseeId?: ID }) => void;
  revokeIpLicense: (ipId: ID) => void;
  renameIp: (ipId: ID, newName: string) => void;

  // Office
  upgradeOffice: () => void;
  addRoom: (input: { kind: string; tier: number; x: number; y: number }) => void;
  removeRoom: (roomId: ID) => void;

  // Publishers
  acceptPublishingDeal: (dealId: ID) => void;
  declinePublishingDeal: (dealId: ID) => void;
  acquirePublisher: (publisherId: ID) => void;

  // Player publishing imprint (#114)
  foundPublisherImprint: (input: { name: string; hqCity: string; tier: PublisherTier; preferredGenres: GenreId[] }) => void;
  signCompetitorToImprint: (input: { publisherId: ID; competitorId: ID; advanceAmount: Money; revenueShare: number }) => void;

  // Hostile studio acquisitions (#119)
  acquireCompetitor: (competitorId: ID) => void;

  // DLC + live service
  createDlc: (input: { name: string; parentProjectId: ID; kind: DLCKind; assignedStaffIds: ID[]; fromPlanId?: ID }) => ID | null;
  enableLiveService: (projectId: ID) => void;
  addDlcPlanToProject: (input: { projectId: ID; kind: DLCKind; name?: string }) => void;
  removeDlcPlan: (input: { projectId: ID; planId: ID }) => void;

  // Events
  resolveEventChoice: (pendingId: ID, choiceId: string) => void;

  // Subscription buyout offers
  acceptSubscriptionOffer: (projectId: ID) => void;
  declineSubscriptionOffer: (projectId: ID) => void;

  // Patch sprints — returns { sprintId } on success or { error } on rejection
  startPatchSprint: (input: StartPatchSprintInput) => { sprintId: ID } | { error: string };
  cancelPatchSprint: (sprintId: ID) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  state: null,
  isInitialized: false,
  isPaused: true,
  lastAutosaveDaysElapsed: 0,
  activeSlotId: null,

  // ============ LIFECYCLE ============
  newGame: (options, slotLabel) => {
    const state = createNewGameState(options);
    // Create a new slot to hold this universe. Default label is the studio name.
    const label = (slotLabel ?? state.studio.name).trim() || state.studio.name;
    let activeSlotId: string | null = null;
    try {
      const meta = createSlot(label, state);
      activeSlotId = meta.id;
    } catch (err) {
      // Slot cap reached — game still starts in memory but won't persist until
      // the user deletes a slot. Surface in console so it's debuggable.
      console.error("Could not create save slot:", err);
    }
    set({
      state,
      isInitialized: true,
      isPaused: true,
      lastAutosaveDaysElapsed: 0,
      activeSlotId,
    });
  },

  // Back-compat: load whichever slot was most recently active. Used by
  // the GameShell auto-resume when the user lands on /dashboard directly
  // without going through the start screen.
  load: () => {
    const meta = getMostRecentSlot();
    if (!meta) return false;
    return get().loadSlot(meta.id);
  },

  loadSlot: (slotId, kind = "manual") => {
    const loaded = loadFromSlot(slotId, kind);
    if (!loaded) return false;
    setActiveSlotId(slotId);
    set({
      state: loaded,
      isInitialized: true,
      isPaused: true,
      lastAutosaveDaysElapsed: loaded.daysElapsed,
      activeSlotId: slotId,
    });
    return true;
  },

  save: () => {
    const { state, activeSlotId } = get();
    if (!state) return;
    if (!activeSlotId) {
      // No active slot (e.g. slot was deleted mid-session). Best effort:
      // create a new slot named after the studio so the user doesn't lose work.
      try {
        const meta = createSlot(state.studio.name, state);
        set({ activeSlotId: meta.id });
      } catch (err) {
        console.error("Save failed: no active slot and could not create one:", err);
      }
      return;
    }
    try {
      saveToSlot(activeSlotId, state, "manual");
    } catch (err) {
      console.error("Save failed:", err);
    }
  },

  reset: () => {
    setActiveSlotId(null);
    set({ state: null, isInitialized: false, isPaused: true, activeSlotId: null });
  },

  // ============ SLOT MANAGEMENT ============
  listSaves: () => listSlots(),

  deleteSave: (slotId) => {
    deleteSlot(slotId);
    if (get().activeSlotId === slotId) {
      set({ activeSlotId: null });
    }
  },

  renameSave: (slotId, label) => {
    renameSlot(slotId, label);
  },

  setActiveSlot: (slotId) => {
    setActiveSlotId(slotId);
    set({ activeSlotId: slotId });
  },

  // ============ TIME CONTROL ============
  setSpeed: (speed) => {
    const state = get().state;
    if (!state) return;
    set({ state: { ...state, gameSpeed: speed }, isPaused: speed === 0 });
  },

  togglePause: () => {
    const { state, isPaused } = get();
    if (!state) return;
    const nextPaused = !isPaused;
    set({
      state: { ...state, gameSpeed: nextPaused ? 0 : (state.gameSpeed || 1) },
      isPaused: nextPaused,
    });
  },

  tickOne: () => {
    const { state } = get();
    if (!state) return;
    const next = tickOneDay(state);
    maybeAutosave(next, set, get);
    set({ state: next });
  },

  tickMany: (days) => {
    const { state } = get();
    if (!state) return;
    const next = tickDays(state, days);
    maybeAutosave(next, set, get);
    set({ state: next });
  },

  // ============ DISPATCH WRAPPERS ============
  // Each wrapper: mutate engine state purely, save back to store.
  // Most return nothing; project/engine creators return the new ID.

  createProject: (input) => {
    const { state } = get();
    if (!state) return null;
    const result = createProject(state, input);
    set({ state: result.state });
    return result.projectId;
  },

  setPhaseSliders: (projectId, phaseIndex, sliders) => {
    const { state } = get();
    if (!state) return;
    set({ state: setPhaseSliders(state, projectId, phaseIndex, sliders) });
  },

  setPhaseCrunch: (projectId, phaseIndex, crunching) => {
    const { state } = get();
    if (!state) return;
    set({ state: setPhaseCrunch(state, projectId, phaseIndex, crunching) });
  },

  cancelProject: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: cancelProject(state, projectId) });
  },

  toggleQualityControl: (projectId, active) => {
    const { state } = get();
    if (!state) return;
    set({ state: toggleQualityControl(state, projectId, active) });
  },

  approveRelease: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: approveRelease(state, projectId) });
  },

  hireCandidate: (candidateId) => {
    const { state } = get();
    if (!state) return;
    set({ state: hireCandidate(state, candidateId) });
  },

  fireStaff: (staffId) => {
    const { state } = get();
    if (!state) return;
    set({ state: fireStaff(state, staffId) });
  },

  giveRaise: (staffId, pctIncrease) => {
    const { state } = get();
    if (!state) return;
    set({ state: giveRaise(state, staffId, pctIncrease) });
  },

  assignStaffToProject: (staffId, projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: assignStaffToProject(state, staffId, projectId) });
  },

  unassignStaffFromProject: (staffId, projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: unassignStaffFromProject(state, staffId, projectId) });
  },

  startResearch: (nodeId, staffIds) => {
    const { state } = get();
    if (!state) return;
    set({ state: startResearch(state, nodeId, staffIds) });
  },

  cancelResearch: (researchId) => {
    const { state } = get();
    if (!state) return;
    set({ state: cancelResearch(state, researchId) });
  },

  startEngineProject: (input) => {
    const { state } = get();
    if (!state) return null;
    const result = startEngineProject(state, input);
    set({ state: result.state });
    return result.projectId;
  },

  cancelEngineProject: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: cancelEngineProject(state, projectId) });
  },

  publiclyReleaseEngine: (engineId, terms) => {
    const { state } = get();
    if (!state) return;
    set({ state: publiclyReleaseEngine(state, engineId, terms) });
  },

  updateEngineLicenseTerms: (engineId, terms) => {
    const { state } = get();
    if (!state) return;
    set({ state: updateEngineLicenseTerms(state, engineId, terms) });
  },

  deprecateEngine: (engineId) => {
    const { state } = get();
    if (!state) return;
    set({ state: deprecateEngine(state, engineId) });
  },

  rebootIp: (ipId) => {
    const { state } = get();
    if (!state) return;
    set({ state: rebootIp(state, ipId) });
  },

  licenseIpOut: (ipId, options) => {
    const { state } = get();
    if (!state) return;
    set({ state: licenseIpOut(state, ipId, options) });
  },

  revokeIpLicense: (ipId) => {
    const { state } = get();
    if (!state) return;
    set({ state: revokeIpLicense(state, ipId) });
  },

  renameIp: (ipId, newName) => {
    const { state } = get();
    if (!state) return;
    set({ state: renameIp(state, ipId, newName) });
  },

  // ============ OFFICE ============
  upgradeOffice: () => {
    const { state } = get();
    if (!state) return;
    set({ state: upgradeOffice(state) });
  },

  addRoom: (input) => {
    const { state } = get();
    if (!state) return;
    // Cast to the system's RoomKind/RoomTier — the UI passes validated ids.
    set({ state: addRoom(state, input as Parameters<typeof addRoom>[1]) });
  },

  removeRoom: (roomId) => {
    const { state } = get();
    if (!state) return;
    set({ state: removeRoom(state, roomId) });
  },

  // ============ PUBLISHERS ============
  acceptPublishingDeal: (dealId) => {
    const { state } = get();
    if (!state) return;
    set({ state: acceptPublishingDeal(state, dealId) });
  },

  declinePublishingDeal: (dealId) => {
    const { state } = get();
    if (!state) return;
    set({ state: declinePublishingDeal(state, dealId) });
  },

  acquirePublisher: (publisherId) => {
    const { state } = get();
    if (!state) return;
    set({ state: acquirePublisher(state, publisherId) });
  },

  // ============ PLAYER PUBLISHING IMPRINT (#114) ============
  foundPublisherImprint: (input) => {
    const { state } = get();
    if (!state) return;
    set({ state: foundPublisherImprint(state, input) });
  },

  signCompetitorToImprint: (input) => {
    const { state } = get();
    if (!state) return;
    set({ state: signCompetitorToImprint(state, input) });
  },

  // ============ HOSTILE STUDIO ACQUISITIONS (#119) ============
  acquireCompetitor: (competitorId) => {
    const { state } = get();
    if (!state) return;
    set({ state: acquireCompetitor(state, competitorId) });
  },

  // ============ DLC + LIVE SERVICE ============
  createDlc: (input) => {
    const { state } = get();
    if (!state) return null;
    const result = createDlc(state, input);
    set({ state: result.state });
    return result.dlcId ?? null;
  },

  enableLiveService: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: enableLiveService(state, projectId) });
  },

  addDlcPlanToProject: (input) => {
    const { state } = get();
    if (!state) return;
    set({ state: addDlcPlanToProject(state, input) });
  },

  removeDlcPlan: (input) => {
    const { state } = get();
    if (!state) return;
    set({ state: removeDlcPlan(state, input) });
  },

  // ============ EVENTS ============
  resolveEventChoice: (pendingId, choiceId) => {
    const { state } = get();
    if (!state) return;
    set({ state: resolveEventChoice(state, pendingId, choiceId) });
  },

  // ============ SUBSCRIPTION BUYOUTS ============
  acceptSubscriptionOffer: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: acceptSubscriptionOffer(state, projectId) });
  },

  declineSubscriptionOffer: (projectId) => {
    const { state } = get();
    if (!state) return;
    set({ state: declineSubscriptionOffer(state, projectId) });
  },

  // ============ PATCH SPRINTS ============
  startPatchSprint: (input) => {
    const { state } = get();
    if (!state) return { error: "Game not initialized" };
    const result = startPatchSprint(state, input);
    if ("error" in result) {
      // Engine rejected — state unchanged, surface the error to the UI.
      return { error: result.error };
    }
    set({ state: result.state });
    return { sprintId: result.sprintId };
  },

  cancelPatchSprint: (sprintId) => {
    const { state } = get();
    if (!state) return;
    set({ state: cancelPatchSprint(state, sprintId) });
  },
}));

// ============ AUTOSAVE HEURISTIC ============
// Autosave on every 7 in-game days elapsed, into the active slot's
// dedicated autosave key (kept separate from the manual save so a bad
// autosave can't blow away a deliberate one).
function maybeAutosave(
  next: GameState,
  set: (s: Partial<GameStoreState>) => void,
  get: () => GameStoreState
): void {
  const { lastAutosaveDaysElapsed, activeSlotId } = get();
  if (!activeSlotId) return; // unsaved (slot cap reached) — skip silently
  if (next.daysElapsed - lastAutosaveDaysElapsed >= 7) {
    try {
      saveToSlot(activeSlotId, next, "auto");
      set({ lastAutosaveDaysElapsed: next.daysElapsed });
    } catch {
      // Autosave is best-effort; don't break gameplay if localStorage is full.
    }
  }
}

// ============ TICK LOOP ============
// Must be called once from the app (e.g. in useEffect on mount).
// Uses requestAnimationFrame for smooth timing; advances days based on gameSpeed.
let loopHandle: number | null = null;
let lastFrameTime = 0;

export function startTickLoop(): void {
  if (loopHandle !== null) return;
  lastFrameTime = performance.now();
  const frame = (now: number) => {
    const store = useGameStore.getState();
    const { state, isPaused } = store;
    if (state && !isPaused && state.gameSpeed > 0) {
      const dt = (now - lastFrameTime) / 1000;
      const daysThisFrame = Math.floor(dt * DAYS_PER_SECOND_1X * state.gameSpeed);
      if (daysThisFrame > 0) {
        store.tickMany(daysThisFrame);
        lastFrameTime = now;
      }
    } else {
      lastFrameTime = now;
    }
    loopHandle = requestAnimationFrame(frame);
  };
  loopHandle = requestAnimationFrame(frame);
}

export function stopTickLoop(): void {
  if (loopHandle !== null) {
    cancelAnimationFrame(loopHandle);
    loopHandle = null;
  }
}

// ============ SAVE-EXISTS HELPER (for main menu) ============
// `hasSave` kept as a back-compat alias of the new `hasAnySave` so any
// remaining importers don't break. Prefer `listSaves()` for the slot picker.
export { hasAnySave as hasSave, hasAnySave, listSlots };
export type { SlotMeta };
