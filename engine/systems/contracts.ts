// Contracts system.
//
// Contracts are a steady-income source — especially valuable early on when
// the player can't yet afford to ship an original title. They work like this:
//   - Every month, a fresh batch of contract offers appears on the board.
//   - Offers have an expiration (if not accepted within N days, they disappear).
//   - When accepted, the player assigns staff; the contract ticks daily toward
//     completion, accumulating quality based on staff fit.
//   - At deadline OR workDaysRequired hit: payout calculated based on quality.
//   - Missing deadline or quality floor = failure + reputation hit.
//
// The pool scales with reputation — a low-rep studio sees only small tier-1
// contracts; higher rep unlocks tier-2 and tier-3 with much bigger payouts.
//
// Contracts do NOT compete with dev projects for engine cycles or consume
// engine licenses — they're abstracted work, not "real" game shipments.

import type { GameState } from "../core/state";
import type { ID, Money, StaffRole } from "../types/core";
import type { Contract, ContractKind } from "../types/contract";
import type { Staff } from "../types/staff";
import type { GenreId } from "../types/genre";

import { GENRES } from "../data/genres";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { addDays, dateToIso, isoToDate } from "../core/time";
import {
  rngInt, rngFloat, rngPick, rngChance, rngWeighted,
} from "../core/rng";

// ============ CLIENT NAME GENERATOR ============
// Fictional publisher/agency names for flavor — these are the "client"
// on the contract. They don't exist as real entities in the sim; they're
// just atmospheric strings.

const CLIENT_PREFIXES = [
  "Orange Coast", "Axiom", "Horizon", "Starpath", "Crescent",
  "Pacific", "Meridian", "Lodestone", "Waypoint", "Cardinal",
  "Apex", "Vector", "Northstar", "Midway", "Keystone",
  "Prism", "Anchor", "Summit", "Tidewater", "Granite",
];
const CLIENT_SUFFIXES = [
  "Publishing", "Interactive", "Entertainment", "Games", "Studios",
  "Media", "Digital", "Arcade", "Softworks", "Ventures",
  "Group", "Partners", "Holdings", "Collective", "Co.",
];

function generateClientName(rng: GameState["rng"]): [string, GameState["rng"]] {
  const [prefix, r1] = rngPick(rng, CLIENT_PREFIXES);
  const [suffix, r2] = rngPick(r1, CLIENT_SUFFIXES);
  return [`${prefix} ${suffix}`, r2];
}

// ============ CONTRACT TITLE GENERATOR ============
function generateContractTitle(
  rng: GameState["rng"],
  kind: ContractKind,
  genre?: GenreId
): [string, GameState["rng"]] {
  if (kind === "port_job") {
    const mockGames = [
      "Crystal Knights", "Nebula Run", "Shadowblade", "Rival Rally", "Deck Tactics",
      "Orbital", "Last Quarter", "Hexwitch", "Boulder Break", "Signal Lost",
    ];
    const mockPlatforms = [
      "the new handheld", "Genesis", "arcade cabinets", "CD-ROM", "the mobile platform",
    ];
    const [game, r1] = rngPick(rng, mockGames);
    const [plat, r2] = rngPick(r1, mockPlatforms);
    return [`Port ${game} to ${plat}`, r2];
  }
  if (kind === "asset_work") {
    const assetTypes = [
      "Character sprites", "Environment art", "Sound effects", "Title music",
      "Cutscene stills", "UI mockups", "Marketing illustrations", "Combat animations",
    ];
    const [t, r1] = rngPick(rng, assetTypes);
    return [`${t} for upcoming title`, r1];
  }
  if (kind === "custom_license") {
    return [`Custom engine deployment`, rng];
  }
  // work_for_hire
  const subjects = [
    "licensed tie-in", "promotional game", "arcade port", "kids edition",
    "holiday special", "budget release", "demo disc title", "compilation entry",
  ];
  const [subject, r1] = rngPick(rng, subjects);
  const g = genre ? GENRES.find((x) => x.id === genre)?.name ?? "" : "";
  return [`${g} ${subject}`.trim(), r1];
}

function generateContractDescription(
  rng: GameState["rng"],
  kind: ContractKind,
  tier: 1 | 2 | 3
): [string, GameState["rng"]] {
  const tierWords = { 1: "modest", 2: "solid", 3: "high-profile" };
  const descriptions: Record<ContractKind, string[]> = {
    port_job: [
      `A ${tierWords[tier]} porting job — the client needs a clean conversion with minimal feature loss.`,
      `Port work for a ${tierWords[tier]} client. Performance and stability matter most.`,
      `Bring an existing title to a new platform. Keep the feel intact.`,
    ],
    work_for_hire: [
      `Build a ${tierWords[tier]} game to their spec. Creative latitude is limited but the payout is guaranteed.`,
      `Ghostwrite a ${tierWords[tier]} title — client owns the IP, you get paid on delivery.`,
      `Turn their concept into a shippable product. Deadline is firm.`,
    ],
    custom_license: [
      `The client wants an engine license with a little hand-holding. Good money, low risk.`,
      `A ${tierWords[tier]} deal for a bespoke engine deployment + integration support.`,
      `Engine licensing deal with a ${tierWords[tier]} client. They pay for your setup time.`,
    ],
    asset_work: [
      `A ${tierWords[tier]} asset package. Quick turn, steady pay.`,
      `Create assets for another studio's project. Clean scope, clear brief.`,
      `${tierWords[tier].charAt(0).toUpperCase() + tierWords[tier].slice(1)} art/sound pass for a friendly studio.`,
    ],
  };
  const [desc, r1] = rngPick(rng, descriptions[kind]);
  return [desc, r1];
}

// ============ CONTRACT GENERATION ============
// Called monthly to refresh the contract board with new offers.

function generateSingleContract(
  rng: GameState["rng"],
  state: GameState,
  tier: 1 | 2 | 3
): [Contract, GameState["rng"]] {
  let r = rng;

  // Pick kind — each kind has different base parameters.
  // Custom license requires having a public engine, so gate it.
  const hasPublicEngine = Object.values(state.engines).some(
    (e) => e.ownerStudioId === state.studio.id && e.status === "public_release"
  );
  const kindOptions: { kind: ContractKind; weight: number }[] = [
    { kind: "asset_work", weight: 25 },
    { kind: "port_job", weight: 20 },
    { kind: "work_for_hire", weight: 30 },
  ];
  if (hasPublicEngine) kindOptions.push({ kind: "custom_license", weight: 15 });

  const [kind, r1] = rngWeighted(
    r,
    kindOptions.map((o) => ({ item: o.kind, weight: o.weight }))
  );
  r = r1;

  // Genre only applies to work_for_hire
  let genre: GenreId | undefined;
  if (kind === "work_for_hire") {
    const year = isoToDate(state.currentDate).year;
    const available = GENRES.filter((g) => g.emergedYear <= year);
    const [g, r2] = rngPick(r, available);
    r = r2;
    genre = g.id;
  }

  // Tier-dependent parameters
  // Base payouts are in cents. Tier 1: ~$5K-$15K, Tier 2: ~$25K-$60K, Tier 3: ~$100K-$300K
  const tierPayout: Record<1 | 2 | 3, [number, number]> = {
    1: [500000, 1500000],
    2: [2500000, 6000000],
    3: [10000000, 30000000],
  };
  const tierWorkDays: Record<1 | 2 | 3, [number, number]> = {
    1: [14, 45],
    2: [45, 120],
    3: [90, 240],
  };
  // Tier 1 heavily weights 1-staff to keep solo founders viable early.
  // Tier 2/3 still need bigger teams.
  const tierStaff: Record<1 | 2 | 3, [number, number]> = {
    1: [1, 1],
    2: [2, 3],
    3: [3, 6],
  };
  const tierRepFloor: Record<1 | 2 | 3, number> = { 1: 0, 2: 20, 3: 50 };
  const tierQualityFloor: Record<1 | 2 | 3, number> = { 1: 30, 2: 45, 3: 60 };
  const tierBonusThreshold: Record<1 | 2 | 3, number> = { 1: 75, 2: 80, 3: 85 };

  const [payout, r3] = rngInt(r, tierPayout[tier][0], tierPayout[tier][1]);
  r = r3;
  const [workDays, r4] = rngInt(r, tierWorkDays[tier][0], tierWorkDays[tier][1]);
  r = r4;
  const [staffCount, r5] = rngInt(r, tierStaff[tier][0], tierStaff[tier][1]);
  r = r5;

  // Era-scale payouts (same multiplier used for competitor budgets)
  const year = isoToDate(state.currentDate).year;
  const eraMult =
    year < 1990 ? 0.6 :
    year < 1995 ? 0.85 :
    year < 2005 ? 1.0 :
    year < 2015 ? 1.5 :
    year < 2025 ? 2.2 : 3.0;
  const scaledPayout = Math.round(payout * eraMult);

  // Work for hire / port job pay somewhat less per day because they're
  // abstracted; asset work pays the least; custom license pays best
  const kindPayoutMult: Record<ContractKind, number> = {
    asset_work: 0.9,
    port_job: 1.0,
    work_for_hire: 1.1,
    custom_license: 1.4,
  };
  const finalPayout = Math.round(scaledPayout * kindPayoutMult[kind]);

  // Deadline generously padded over minimum work time — 2.0-3.0x.
  // Wide padding gives players runway for role mismatches, crunching other projects,
  // or staff swaps mid-contract. Original 1.5-2.5 was too tight for imperfect fits.
  const [padPct, r6] = rngFloat(r, 2.0, 3.0);
  r = r6;
  const deadlineDays = Math.ceil(workDays * padPct);

  // Offer window — 10-25 days
  const [expiryDays, r7] = rngInt(r, 10, 25);
  r = r7;

  // Client name
  const [clientName, r8] = generateClientName(r);
  r = r8;

  // Client reputation (not used much yet, but shown in UI)
  const [clientRep, r9] = rngInt(r, 20, 90);
  r = r9;

  // Flavor
  const [title, r10] = generateContractTitle(r, kind, genre);
  r = r10;
  const [description, r11] = generateContractDescription(r, kind, tier);
  r = r11;

  // Preferred roles by kind
  const preferredRoles: Record<ContractKind, StaffRole[]> = {
    port_job: ["programmer"],
    work_for_hire: ["programmer", "designer", "artist"],
    custom_license: ["programmer"],
    asset_work: ["artist", "composer", "writer"],
  };

  // Advance percentage — higher for low-tier (client wants you to start)
  // Lower for high-tier (more at risk)
  const advancePct = tier === 1 ? 0.3 : tier === 2 ? 0.2 : 0.15;

  // Bonus for beating quality threshold
  const qualityBonusAmount = Math.round(finalPayout * 0.3);

  // Reputation delta
  const repReward = tier === 1 ? 1 : tier === 2 ? 3 : 6;
  const repPenalty = tier === 1 ? 2 : tier === 2 ? 4 : 8;

  const [id, rFinal] = generateId("ctr", r);

  // Engine reference for custom_license
  let requiresEngineId: ID | undefined;
  if (kind === "custom_license") {
    // Pick a random publicly released player engine
    const pubEngines = Object.values(state.engines).filter(
      (e) => e.ownerStudioId === state.studio.id && e.status === "public_release"
    );
    if (pubEngines.length > 0) {
      const [eng, rEng] = rngPick(rFinal, pubEngines);
      requiresEngineId = eng.id;
      return [buildContract(id, kind, tier, clientName, clientRep, title, description,
        finalPayout, advancePct, tierQualityFloor[tier], tierBonusThreshold[tier],
        qualityBonusAmount, workDays, staffCount, preferredRoles[kind],
        tierRepFloor[tier], repReward, repPenalty, expiryDays, deadlineDays,
        state.currentDate, genre, requiresEngineId), rEng];
    }
  }

  return [buildContract(id, kind, tier, clientName, clientRep, title, description,
    finalPayout, advancePct, tierQualityFloor[tier], tierBonusThreshold[tier],
    qualityBonusAmount, workDays, staffCount, preferredRoles[kind],
    tierRepFloor[tier], repReward, repPenalty, expiryDays, deadlineDays,
    state.currentDate, genre, requiresEngineId), rFinal];
}

function buildContract(
  id: ID, kind: ContractKind, tier: 1 | 2 | 3,
  clientName: string, clientReputation: number,
  title: string, description: string,
  payoutAmount: Money, advancePct: number,
  qualityFloor: number, qualityBonusThreshold: number, qualityBonusAmount: Money,
  workDays: number, staffCount: number, preferredRoles: StaffRole[],
  minStudioReputation: number, repReward: number, repPenalty: number,
  expiryDays: number, deadlineDays: number, currentDate: string,
  genre?: GenreId, requiresEngineId?: ID,
): Contract {
  const offeredOn = currentDate;
  const expiresOn = dateToIso(addDays(isoToDate(currentDate), expiryDays));
  const deadline = dateToIso(addDays(isoToDate(currentDate), expiryDays + deadlineDays));
  const upfrontPayment = Math.round(payoutAmount * advancePct);
  const completionPayment = payoutAmount - upfrontPayment;
  return {
    id,
    kind,
    tier,
    offeredOn,
    expiresOn,
    deadline,
    status: "offered",
    clientName,
    clientReputation,
    title,
    description,
    requiredStaffCount: staffCount,
    preferredRoles,
    minStudioReputation,
    requiresEngineId,
    genre,
    payoutAmount,
    advancePct,
    qualityFloor,
    qualityBonusThreshold,
    qualityBonusAmount,
    workDaysRequired: workDays,
    workCompleted: 0,
    qualityAccumulated: 0,
    reputationReward: repReward,
    reputationPenalty: repPenalty,
    // Legacy aliases populated for the contracts page UI.
    offeredDate: offeredOn,
    expiresDate: expiresOn,
    dueDate: deadline,
    upfrontPayment,
    completionPayment,
    bonusPayment: qualityBonusAmount,
    name: title,
    publisherName: clientName,
  };
}

// ============ REFRESH BOARD ============
// Called monthly — generate a fresh batch of contract offers.
// Expires any outstanding unaccepted offers that are past their expiry window.
export function refreshContractBoard(state: GameState): GameState {
  let next = state;
  let rng = state.rng;

  // Expire any "offered" contracts past expiresOn (and not accepted)
  const contractUpdates: Record<ID, Contract> = {};
  for (const c of Object.values(state.contracts)) {
    if (c.status === "offered" && c.expiresOn < state.currentDate) {
      contractUpdates[c.id] = { ...c, status: "expired" };
    }
  }
  if (Object.keys(contractUpdates).length > 0) {
    next = { ...next, contracts: { ...next.contracts, ...contractUpdates } };
  }

  // How many to generate — scales with reputation
  const baseCount = 3;
  const repBonus = Math.floor(state.studio.reputation / 25);
  const [poolSize, r1] = rngInt(rng, baseCount, baseCount + 2 + repBonus);
  rng = r1;

  // Tier distribution based on reputation
  // Low rep: mostly tier 1
  // Medium rep: mix of 1 and 2
  // High rep: rare tier 3 appearances
  const newContracts: Record<ID, Contract> = {};
  for (let i = 0; i < poolSize; i++) {
    const [tierRoll, r2] = rngFloat(rng, 0, 1);
    rng = r2;

    let tier: 1 | 2 | 3 = 1;
    if (state.studio.reputation >= 50) {
      // Mix of all three
      if (tierRoll < 0.4) tier = 1;
      else if (tierRoll < 0.8) tier = 2;
      else tier = 3;
    } else if (state.studio.reputation >= 20) {
      // Tier 1 and 2 only
      if (tierRoll < 0.6) tier = 1;
      else tier = 2;
    } else {
      // Early game — mostly tier 1, occasional tier 2
      if (tierRoll < 0.85) tier = 1;
      else tier = 2;
    }

    // Gate by min-rep requirement too
    if (tier === 3 && state.studio.reputation < 50) tier = 2;
    if (tier === 2 && state.studio.reputation < 20) tier = 1;

    const [contract, r3] = generateSingleContract(rng, next, tier);
    rng = r3;
    newContracts[contract.id] = contract;
  }

  next = {
    ...next,
    rng,
    contracts: { ...next.contracts, ...newContracts },
  };

  next = appendLog(next, {
    category: "event",
    headline: `${Object.keys(newContracts).length} new contract offer${Object.keys(newContracts).length !== 1 ? "s" : ""} on the board`,
    severity: "info",
  });

  return next;
}

// ============ PLAYER ACTIONS ============

// Accept a contract offer. Validates requirements, assigns staff, pays advance.
export function acceptContract(
  state: GameState,
  contractId: ID,
  assignedStaffIds: ID[]
): GameState {
  const c = state.contracts[contractId];
  if (!c || c.status !== "offered") return state;

  // Validate expiry
  if (c.expiresOn < state.currentDate) {
    return appendLog(state, {
      category: "event",
      headline: `Contract offer expired: ${c.title}`,
      severity: "warning",
    });
  }

  // Validate staff
  const validStaff = assignedStaffIds
    .map((id) => state.staff[id])
    .filter((s): s is Staff => !!s && s.status === "employed" && s.currentProjectId === null);

  if (validStaff.length < c.requiredStaffCount) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot accept ${c.title}: need ${c.requiredStaffCount} free staff, have ${validStaff.length}`,
      severity: "warning",
    });
  }

  // Validate reputation
  if (state.studio.reputation < c.minStudioReputation) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot accept ${c.title}: studio reputation too low`,
      severity: "warning",
    });
  }

  // Pay advance
  const advance = Math.round(c.payoutAmount * c.advancePct);

  // Mark staff as assigned (using contract ID as their currentProjectId)
  const staffUpdates: Record<ID, Staff> = {};
  for (const s of validStaff) {
    staffUpdates[s.id] = { ...s, currentProjectId: c.id };
  }

  const updated: Contract = {
    ...c,
    status: "in_progress",
    acceptedOn: state.currentDate,
    assignedStaffIds: validStaff.map((s) => s.id),
  };

  let next: GameState = {
    ...state,
    staff: { ...state.staff, ...staffUpdates },
    contracts: { ...state.contracts, [c.id]: updated },
    studio: {
      ...state.studio,
      cash: state.studio.cash + advance,
      lifetimeRevenue: state.studio.lifetimeRevenue + advance,
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Accepted contract: ${c.title}`,
    body: `Advance of ${formatCash(advance)} paid. Deadline ${c.deadline}.`,
    severity: "success",
  });

  return next;
}

// Decline a contract offer. Small reputation hit (they remember).
export function declineContract(state: GameState, contractId: ID): GameState {
  const c = state.contracts[contractId];
  if (!c || c.status !== "offered") return state;

  return {
    ...state,
    contracts: {
      ...state.contracts,
      [c.id]: { ...c, status: "declined" },
    },
  };
}

// ============ DAILY CONTRACT TICK ============
// Each active contract accrues work + quality; on completion (or deadline miss)
// pay out and resolve.
export function tickContracts(state: GameState): GameState {
  if (Object.keys(state.contracts).length === 0) return state;

  const today = state.currentDate;
  let next = state;
  const contractUpdates: Record<ID, Contract> = {};

  for (const c of Object.values(state.contracts)) {
    if (c.status !== "in_progress") continue;

    // Deadline missed? Fail.
    if (c.deadline < today) {
      next = resolveContract(next, c, "failed_deadline");
      continue;
    }

    const assigned = (c.assignedStaffIds ?? [])
      .map((id) => state.staff[id])
      .filter((s): s is Staff => !!s && s.status === "employed");

    if (assigned.length === 0) {
      // All staff gone (resigned/fired) — contract fails
      next = resolveContract(next, c, "failed_no_staff");
      continue;
    }

    // Daily work output — each staff contributes based on role fit + stats
    // A productive staff produces 1.0 work-day per day.
    let workProduced = 0;
    let qualityContribution = 0;
    for (const s of assigned) {
      // Role match bonus — softened from 1.3/0.85 so role mismatches are less
      // crushing. Players should be punished for poor fit, not blocked entirely.
      const isPreferredRole = c.preferredRoles.includes(s.role);
      const roleMult = isPreferredRole ? 1.25 : 0.95;

      // Primary stat for contribution depends on kind
      let primaryStat = 50;
      if (c.kind === "port_job" || c.kind === "custom_license") primaryStat = s.stats.tech;
      else if (c.kind === "asset_work") {
        // Best of art/sound/writing based on role
        primaryStat = Math.max(s.stats.art, s.stats.sound, s.stats.writing);
      } else {
        // work_for_hire — blended
        primaryStat = (s.stats.design + s.stats.tech + s.stats.art) / 3;
      }

      const statMult = 0.5 + (primaryStat / 100);
      const moraleMult = 0.7 + (s.morale / 100) * 0.4;
      const energyMult = 0.6 + (s.energy / 100) * 0.4;

      const daily = roleMult * statMult * moraleMult * energyMult;
      workProduced += daily;
      qualityContribution += daily * (primaryStat / 100);
    }

    const newWork = c.workCompleted + workProduced;
    // Quality accumulates proportional to WORK PRODUCED (not calendar days).
    // This way, doubling your team doubles your completion AND keeps quality
    // on target. An average team (teamFit 0.5) with typical output completes
    // all work and lands quality at ~(qualityFloor + 20), leaving headroom
    // for the bonus threshold.
    const targetCeilingQuality = c.qualityFloor + 40;
    const teamFit = qualityContribution / Math.max(1, workProduced);
    // Per unit of work done, we gain (targetCeiling / workDays) × teamFit × 2 quality.
    // Integrated over all workDays, final quality = targetCeiling × teamFit × 2.
    // With teamFit 0.5, quality ≈ targetCeiling = qualityFloor + 40. Good.
    const qualityRatePerWork = (targetCeilingQuality / c.workDaysRequired) * teamFit * 2;
    const newQuality = Math.min(100, c.qualityAccumulated + qualityRatePerWork * workProduced);

    // Contract staff energy recovery — since they don't go through the
    // development loop where project staff recover naturally, they need
    // a recovery bump here so they don't stagnate indefinitely.
    const staffEnergyUpdates: Record<ID, Staff> = {};
    for (const s of assigned) {
      const newEnergy = Math.min(100, s.energy + 1.0);
      if (newEnergy !== s.energy) {
        staffEnergyUpdates[s.id] = { ...s, energy: newEnergy };
      }
    }
    if (Object.keys(staffEnergyUpdates).length > 0) {
      next = { ...next, staff: { ...next.staff, ...staffEnergyUpdates } };
    }

    const updated: Contract = {
      ...c,
      workCompleted: newWork,
      qualityAccumulated: newQuality,
    };
    contractUpdates[c.id] = updated;

    // Complete?
    if (newWork >= c.workDaysRequired) {
      next = resolveContract(next, updated, "completed");
      continue;
    }
  }

  if (Object.keys(contractUpdates).length > 0) {
    // Merge any in-progress updates for contracts that haven't resolved this tick
    const mergedContracts = { ...next.contracts };
    for (const [id, u] of Object.entries(contractUpdates)) {
      if (mergedContracts[id]?.status === "in_progress") {
        mergedContracts[id] = u;
      }
    }
    next = { ...next, contracts: mergedContracts };
  }

  return next;
}

// Resolve a contract — pay remainder (or not), update rep, unassign staff.
function resolveContract(
  state: GameState,
  contract: Contract,
  outcome: "completed" | "failed_deadline" | "failed_no_staff"
): GameState {
  let next = state;

  const finalQuality = contract.qualityAccumulated;
  const hitFloor = finalQuality >= contract.qualityFloor;

  // Determine final status
  let finalStatus: Contract["status"] = "failed";
  let paidOut = 0;
  let repDelta = 0;
  let severity: "success" | "warning" | "danger" | "info" = "info";
  let headline = "";

  if (outcome === "completed" && hitFloor) {
    finalStatus = "completed";
    // Paid remainder of payout
    const remainder = Math.round(contract.payoutAmount * (1 - contract.advancePct));
    paidOut = remainder;
    // Bonus for exceeding quality threshold
    if (finalQuality >= contract.qualityBonusThreshold) {
      paidOut += contract.qualityBonusAmount;
    }
    repDelta = contract.reputationReward;
    severity = "success";
    headline = `Contract delivered: ${contract.title}`;
  } else if (outcome === "completed" && !hitFloor) {
    // Finished work but below quality floor — partial failure
    finalStatus = "failed";
    paidOut = 0;
    repDelta = -contract.reputationPenalty;
    severity = "danger";
    headline = `Contract delivered below quality floor: ${contract.title}`;
  } else {
    // Deadline missed or staff vanished
    finalStatus = "failed";
    paidOut = 0;
    repDelta = -contract.reputationPenalty;
    severity = "danger";
    headline = outcome === "failed_deadline"
      ? `Contract deadline missed: ${contract.title}`
      : `Contract abandoned (no staff): ${contract.title}`;
  }

  // Unassign staff + morale delta
  const staffUpdates: Record<ID, Staff> = {};
  for (const sid of contract.assignedStaffIds ?? []) {
    const s = state.staff[sid];
    if (!s) continue;
    if (s.currentProjectId === contract.id) {
      staffUpdates[sid] = {
        ...s,
        currentProjectId: null,
        morale: Math.max(0, Math.min(100, s.morale + (finalStatus === "completed" ? 4 : -6))),
      };
    }
  }

  const updatedContract: Contract = {
    ...contract,
    status: finalStatus,
    completedOn: state.currentDate,
    finalQuality,
    paidOut,
  };

  next = {
    ...next,
    staff: { ...next.staff, ...staffUpdates },
    contracts: { ...next.contracts, [contract.id]: updatedContract },
    studio: {
      ...next.studio,
      cash: next.studio.cash + paidOut,
      lifetimeRevenue: next.studio.lifetimeRevenue + paidOut,
      reputation: Math.max(0, Math.min(100, next.studio.reputation + repDelta)),
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline,
    body: finalStatus === "completed"
      ? `Paid ${formatCash(paidOut)} on delivery. Quality: ${finalQuality.toFixed(0)}.`
      : `No remainder paid. Quality: ${finalQuality.toFixed(0)}.`,
    severity,
  });

  return next;
}

// Small formatter — local to avoid a circular dep
function formatCash(cents: Money): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000) return `$${(d / 1_000).toFixed(0)}K`;
  return `$${d.toFixed(0)}`;
}
