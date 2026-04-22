// Engine licensing market.
//
// This system manages the downstream lifecycle of a player-owned engine
// that has been `public_release`-d. It covers three things the pure
// competitor tick doesn't handle on its own:
//
//   1. EngineLicense record creation. When a competitor signs on to use
//      a player engine (i.e., picks it for a new project), we stamp a
//      durable EngineLicense record. Subsequent games the licensee ships
//      roll up under the same license; only the first signing increments
//      engine.totalLicensees.
//
//   2. Per-license royalty attribution. When a licensee ships a game, the
//      per-release royalty (already paid via releaseCompetitorGame) is
//      recorded against the license too — both the projectId and the
//      cash added to lifetimeRoyaltiesPaid — so the UI can show
//      "which licensees are actually earning me money".
//
//   3. Backcatalog royalty trickle. Engines that already have active
//      licensees earn a small recurring monthly royalty from all the
//      games those studios have shipped on the engine. This simulates
//      long-tail back-catalog revenue (GTA V is still selling ten years
//      later) so an engine with 5 active licensees and 50 shipped titles
//      is worth holding even once the big one-time payments dry up.
//
// These functions are pure — state in, state out. Licenses are addressed
// by {engineId, licenseeStudioId}; we treat that as the unique key even
// though storage is still by license id.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { EngineLicense, GameEngine } from "../types/engine";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { rngFloat } from "../core/rng";
import { isoToDate } from "../core/time";

// ============ HELPERS ============

function findExistingLicense(
  state: GameState,
  engineId: ID,
  licenseeStudioId: ID
): EngineLicense | undefined {
  for (const lic of Object.values(state.engineLicenses)) {
    if (lic.engineId === engineId && lic.licenseeStudioId === licenseeStudioId && lic.active) {
      return lic;
    }
  }
  return undefined;
}

// ============ LICENSE SIGNING ============
// Called when a competitor picks a player engine for a new project.
// Idempotent per-licensee: if they've already signed a license on this
// engine, we reuse it; otherwise we stamp a new record and bump
// engine.totalLicensees.
export function signEngineLicenseIfNew(
  state: GameState,
  engineId: ID,
  licenseeStudioId: ID
): GameState {
  const engine = state.engines[engineId];
  if (!engine || engine.ownerStudioId === null) return state;
  // Only player engines: the licensing system currently models player-side
  // income; third-party engine licenses can be added later.
  if (engine.ownerStudioId !== state.studio.id) return state;

  const existing = findExistingLicense(state, engineId, licenseeStudioId);
  if (existing) return state;

  let rng = state.rng;
  const [licId, rng2] = generateId("lic", rng);
  rng = rng2;

  const license: EngineLicense = {
    id: licId,
    engineId,
    licenseeStudioId,
    licensorStudioId: engine.ownerStudioId,
    termsSnapshot: { ...engine.licenseTerms },
    signedDate: state.currentDate,
    lifetimeRoyaltiesPaid: 0,
    projectIds: [],
    active: true,
  };

  const updatedEngine: GameEngine = {
    ...engine,
    totalLicensees: engine.totalLicensees + 1,
  };

  return {
    ...state,
    rng,
    engineLicenses: { ...state.engineLicenses, [licId]: license },
    engines: { ...state.engines, [engineId]: updatedEngine },
  };
}

// ============ RECORD SHIPPED PROJECT ============
// Called when a licensee ships a game. Records the projectId under the
// license and adds the royalty amount to lifetimeRoyaltiesPaid. Also
// bumps engine.projectsBuilt (the per-project counter was previously
// maintained at release time; we keep doing that here centrally).
export function recordLicenseeRelease(
  state: GameState,
  engineId: ID,
  licenseeStudioId: ID,
  projectId: ID,
  royaltyPaid: number
): GameState {
  const engine = state.engines[engineId];
  if (!engine) return state;

  // Only track if it's a player engine
  if (engine.ownerStudioId !== state.studio.id) return state;

  const license = findExistingLicense(state, engineId, licenseeStudioId);
  const updatedEngine: GameEngine = {
    ...engine,
    projectsBuilt: engine.projectsBuilt + 1,
  };

  let next: GameState = {
    ...state,
    engines: { ...state.engines, [engineId]: updatedEngine },
  };

  if (license) {
    const updatedLicense: EngineLicense = {
      ...license,
      projectIds: [...license.projectIds, projectId],
      lifetimeRoyaltiesPaid: license.lifetimeRoyaltiesPaid + royaltyPaid,
    };
    next = {
      ...next,
      engineLicenses: { ...next.engineLicenses, [license.id]: updatedLicense },
    };
  }

  return next;
}

// ============ MONTHLY BACKCATALOG ROYALTY TRICKLE ============
// Engines with shipped-on-engine titles keep earning small amounts each
// month from back-catalog sales. The trickle scales with:
//   - engine.currentness (newer engines → bigger back-catalog waves)
//   - number of shipped projects under this license
//   - terms royaltyRate (naturally already baked in at release; this is
//     a smaller recurring slice)
// This is explicitly a small trickle — the big money comes from
// per-release royalties in releaseCompetitorGame. Scale tuned so a
// healthy engine with ~10 licensed games earns low-thousands/month and
// a flagship engine with 50+ games earns five-figure/month.
export function tickEngineRoyalties(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  if (today.day !== 1) return state;

  const licenses = Object.values(state.engineLicenses).filter((l) => l.active);
  if (licenses.length === 0) return state;

  let rng = state.rng;
  let totalTrickle = 0;
  const licenseUpdates: Record<ID, EngineLicense> = {};

  for (const lic of licenses) {
    const engine = state.engines[lic.engineId];
    if (!engine) continue;
    if (engine.status === "discontinued") continue;
    if (lic.projectIds.length === 0) continue; // no shipped games yet → no backcatalog
    if (lic.licensorStudioId !== state.studio.id) continue; // only player income

    // Base trickle per project per month, scaled by currentness
    // ($150/month/game at full currentness → ~$1.5K/mo for a 10-title license)
    const perProject = 15000; // cents — $150/mo baseline per title
    const currentnessMult = 0.3 + (engine.currentness / 100) * 1.0; // 0.3x at 0, 1.3x at 100
    const royaltyRateMult = 0.5 + lic.termsSnapshot.royaltyRate * 4; // 0% → 0.5x, 10% → 0.9x, 25% → 1.5x

    // Per-license jitter — +/-25% each month so the number isn't mechanical
    const [jitter, rng2] = rngFloat(rng, 0.75, 1.25);
    rng = rng2;

    const monthly = Math.round(
      perProject * lic.projectIds.length * currentnessMult * royaltyRateMult * jitter
    );
    if (monthly <= 0) continue;

    totalTrickle += monthly;
    licenseUpdates[lic.id] = {
      ...lic,
      lifetimeRoyaltiesPaid: lic.lifetimeRoyaltiesPaid + monthly,
    };
  }

  if (totalTrickle === 0) return { ...state, rng };

  let next: GameState = {
    ...state,
    rng,
    engineLicenses: { ...state.engineLicenses, ...licenseUpdates },
    studio: {
      ...state.studio,
      cash: state.studio.cash + totalTrickle,
      lifetimeRevenue: state.studio.lifetimeRevenue + totalTrickle,
    },
  };

  // Only log when trickle is meaningful — $1K+ threshold so low-traffic
  // engines don't spam the feed. (Below threshold the royalty still pays
  // out — it's just a silent deposit.)
  if (totalTrickle >= 100000) {
    next = appendLog(next, {
      category: "finance",
      headline: `Engine back-catalog royalties: $${Math.round(totalTrickle / 100).toLocaleString()}`,
      body: `Monthly royalty trickle from ${Object.keys(licenseUpdates).length} active license${Object.keys(licenseUpdates).length === 1 ? "" : "s"}.`,
      severity: "success",
    });
  }

  return next;
}

// ============ EXPIRE INACTIVE LICENSES ============
// If a licensee goes bankrupt or the engine is discontinued, mark the
// license inactive so it stops generating income. Currently called from
// tick.ts monthly alongside the royalty tick.
export function tickExpireLicenses(state: GameState): GameState {
  const today = isoToDate(state.currentDate);
  if (today.day !== 1) return state;

  const updates: Record<ID, EngineLicense> = {};
  for (const lic of Object.values(state.engineLicenses)) {
    if (!lic.active) continue;

    const licensee = state.competitors[lic.licenseeStudioId];
    const engine = state.engines[lic.engineId];

    const licenseeGone = licensee && licensee.status !== "active";
    const engineGone = !engine || engine.status === "discontinued";

    if (licenseeGone || engineGone) {
      updates[lic.id] = { ...lic, active: false };
    }
  }

  if (Object.keys(updates).length === 0) return state;
  return {
    ...state,
    engineLicenses: { ...state.engineLicenses, ...updates },
  };
}
