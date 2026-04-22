// Public Engine API
// The store and UI layers import from here, never from internal files.
// This is the stable contract between the simulation and the rest of the app.

// Types
export type { GameState, LogEntry, LogCategory, Studio, MarketState, HiringPool, RepHit, CashHistorySample } from "./core/state";
export type * from "./types";
export type { PatchSprint, PatchSprintStatus } from "./types/project";

// Value re-exports from types (constants + lookup tables)
export { AWARD_DISPLAY_NAMES, CATEGORY_GENRE_MAP } from "./types/awards";
export {
  DLC_PLAN_KINDS,
  dlcKindAvailableInYear,
  dlcKindRequiredTechId,
  dlcKindLabel,
  dlcKindDescription,
} from "./types/dlc";

// Core
export { createNewGameState } from "./core/newGame";
export type { NewGameOptions } from "./core/newGame";
export { tickOneDay, tickDays } from "./core/tick";
export { dateToIso, isoToDate, addDays, daysBetween, compareDate } from "./core/time";

// Development actions
export {
  createProject,
  setPhaseSliders,
  setPhaseCrunch,
  cancelProject,
  toggleQualityControl,
  approveRelease,
} from "./systems/development";
export type { CreateProjectInput } from "./systems/development";

// Release actions + sales-curve preview helpers (used by the release-approval UI)
export {
  releaseProject,
  processReadyReleases,
  computeProjectBaseQuality,
  salesCurveParamsForScore,
  salesCurveDailyShare,
} from "./systems/release";
export type { SalesCurveParams } from "./systems/release";

// Post-mortem — derived "what went well / what went wrong" report on a
// released project. Pure function, no state persistence.
export { computePostMortem } from "./systems/postmortem";
export type {
  PostMortem,
  AxisReport,
  PostMortemNote,
  PostMortemLesson,
  PostMortemNoteCategory,
  LessonSeverity,
} from "./types/postmortem";

// Hiring & staff actions
export {
  hireCandidate,
  fireStaff,
  giveRaise,
  assignStaffToProject,
  unassignStaffFromProject,
  refreshHiringPool,
  runPayroll,
} from "./systems/hiring";

// R&D actions
export {
  startResearch,
  cancelResearch,
  availableResearchNodes,
} from "./systems/rnd";

// Engine builder actions
export {
  startEngineProject,
  cancelEngineProject,
  publiclyReleaseEngine,
  updateEngineLicenseTerms,
  deprecateEngine,
} from "./systems/engineBuilder";
export type { StartEngineProjectInput } from "./systems/engineBuilder";

// IP actions (reboot, license-out, rename)
export { rebootIp, licenseIpOut, revokeIpLicense, renameIp, IP_NAME_MAX_LENGTH } from "./systems/ips";

// Office actions
export { upgradeOffice, addRoom, removeRoom } from "./systems/office";

// Publisher actions (publishing deals + acquisitions)
export {
  acceptPublishingDeal,
  declinePublishingDeal,
  acquirePublisher,
  // Lifecycle hooks — usually invoked by the tick dispatcher, but exported
  // so the store and debug tools can call them directly.
  generatePublishingOffersForProject,
  tickPublisherOffersDuringDev,
  tickPublishersMonthly,
  maybeFoundNewPublisher,
} from "./systems/publishers";

// Contract actions
export {
  acceptContract,
  declineContract,
} from "./systems/contracts";

// DLC + live-service actions
export {
  createDlc,
  enableLiveService,
  addDlcPlanToProject,
  removeDlcPlan,
  countActiveLiveServices,
  isDlcKindUnlocked,
  dlcKindLockedReason,
  LIVE_SERVICE_SLOT_CAP,
} from "./systems/dlc";

// Reputation
export {
  applyRepHit,
  totalOutstandingRepPenalty,
  DEFAULT_REP_DECAY_DAYS,
} from "./systems/reputation";
export type { ApplyRepHitInput } from "./systems/reputation";

// Bugs / patch sprints — post-launch fix loop
export {
  startPatchSprint,
  cancelPatchSprint,
  computeUserScore,
  salesDragMultiplier,
  // Tuning constants the UI displays as cap/curve hints
  QA_LAB_PASSIVE_FIX_PER_CAP,
  QA_LAB_HIDDEN_REDUCTION_PER_CAP,
  MAX_QA_LAB_REDUCTION,
  PATCH_SPRINT_FIX_PER_STAFF_DAY,
  PATCH_SPRINT_FINAL_BURST_PER_DAY,
  PATCH_MARKETING_USER_SCORE_BUMP_PER_MILLION_CENTS,
  AMBIENT_FIX_RATE_PER_DAY,
} from "./systems/bugs";
export type { StartPatchSprintInput } from "./systems/bugs";

// Market shifts (industry waves)
export {
  evaluateMarketShiftFromRelease,
  recordCopycatRelease,
  marketShiftMultiplierFor,
  activeShiftFor,
  listActiveShifts,
  era90thPercentileSales,
  mmoPeakCcuThreshold,
} from "./systems/marketShifts";
export {
  tierLabel,
  effectiveMultiplier,
  TIER_MULTIPLIER,
  TIER_DURATION_DAYS,
  PLAYED_OUT_MULTIPLIER,
  PLAYED_OUT_DAYS,
} from "./types/marketShift";

// Events — player responses to pending interactive events
export { resolveEventChoice } from "./systems/events";

// Subscription buyout offers — accept/decline at the ready_to_release gate
export {
  acceptSubscriptionOffer,
  declineSubscriptionOffer,
  maybeGenerateSubscriptionOffer,
  expireSubscriptionOffers,
} from "./systems/subscriptions";

// Player publishing imprint — found your own publisher and sign competitor
// studios to distribution deals on their next releases.
export {
  foundPublisherImprint,
  signCompetitorToImprint,
  applyCompetitorPublisherCutOnRelease,
  expireCompetitorPublishingDeals,
  suggestedDealTerms,
  IMPRINT_FOUNDING_COST,
  IMPRINT_STARTING_CASH,
  IMPRINT_STARTING_REPUTATION,
} from "./systems/playerImprint";
export type { CompetitorPublishingDeal, CompetitorPublishingDealStatus } from "./types/competitorPublishingDeal";

// Competitor AI (internal — usually invoked by tick, but exported for debugging)
export {
  tickCompetitors,
  maybeSpawnNewCompetitor,
  checkCompetitorBankruptcies,
} from "./systems/competitors";

// Hostile competitor acquisitions (#119)
export {
  acquireCompetitor,
  competitorAcquisitionPrice,
  COMPETITOR_ACQUISITION_PREMIUM,
} from "./systems/competitorAcquisitions";

// Staff generation (re-exported for hiring UI)
export { generateStaff } from "./systems/staffGenerator";

// Data (re-exported so UI can render catalogs)
export * from "./data";
