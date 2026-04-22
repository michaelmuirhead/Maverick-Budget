// Office management — actions for upgrading office tier and adding/removing rooms.
//
// Key actions:
//   - upgradeOffice: move to next tier (garage → apartment → ...). Pays upgrade cost,
//     rent goes up, gridWidth/Height expand. Existing rooms stay in place.
//   - addRoom: install a new room at a specific grid position. Pays install cost,
//     bumps monthly upkeep. Validates available grid space and tier gating.
//   - removeRoom: tear down a room. No refund. Frees up grid space.
//   - tickOfficeMonthly: monthly — deducts rent + upkeep, recomputes amenityScore.

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { Office, Room, RoomKind, RoomTier, OfficeTier } from "../types/office";
import { OFFICE_TIER_BY_ID, ROOM_KIND_BY_ID } from "../data/officeRooms";
import { appendLog } from "../core/log";
import { generateId } from "../core/ids";

// ============ UPGRADE OFFICE ============
// Move to the next tier. Pays upgrade cost, bumps rent, expands grid.
export function upgradeOffice(state: GameState): GameState {
  const currentTier = state.office.tier;
  const currentDef = OFFICE_TIER_BY_ID[currentTier];
  if (!currentDef) return state;

  // Find next tier
  const tierOrder: OfficeTier[] = [
    "garage", "apartment", "small_office", "floor", "corporate", "campus", "global_hq",
  ];
  const idx = tierOrder.indexOf(currentTier);
  if (idx < 0 || idx >= tierOrder.length - 1) {
    return appendLog(state, {
      category: "event",
      headline: "Already at the highest office tier",
      severity: "warning",
    });
  }
  const nextTierId = tierOrder[idx + 1]!;
  const nextDef = OFFICE_TIER_BY_ID[nextTierId];
  if (!nextDef) return state;

  if (state.studio.cash < nextDef.upgradeCost) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot afford upgrade to ${nextDef.name}`,
      body: `Costs $${Math.round(nextDef.upgradeCost / 100).toLocaleString()}. You have $${Math.round(state.studio.cash / 100).toLocaleString()}.`,
      severity: "warning",
    });
  }

  // Upgrade — grid expands, existing rooms stay, rent jumps
  const updatedOffice: Office = {
    ...state.office,
    tier: nextTierId,
    gridWidth: nextDef.gridWidth,
    gridHeight: nextDef.gridHeight,
    monthlyRent: nextDef.monthlyRent,
    totalCapacity: state.office.rooms.reduce((sum, r) => sum + r.capacity, 0),
  };

  let next: GameState = {
    ...state,
    office: updatedOffice,
    studio: {
      ...state.studio,
      cash: state.studio.cash - nextDef.upgradeCost,
      // Upgrading is a big deal — +3 reputation
      reputation: Math.min(100, state.studio.reputation + 3),
    },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Upgraded to ${nextDef.name}`,
    body: `$${Math.round(nextDef.upgradeCost / 100).toLocaleString()} paid. New grid: ${nextDef.gridWidth}×${nextDef.gridHeight}. Monthly rent: $${Math.round(nextDef.monthlyRent / 100).toLocaleString()}.`,
    severity: "success",
  });

  return next;
}

// ============ ADD ROOM ============
// Install a new room at the given grid coordinates.
export function addRoom(
  state: GameState,
  input: {
    kind: RoomKind;
    tier: RoomTier;
    x: number;
    y: number;
  }
): GameState {
  const kindDef = ROOM_KIND_BY_ID[input.kind];
  if (!kindDef) {
    return appendLog(state, {
      category: "event",
      headline: `Unknown room kind: ${input.kind}`,
      severity: "warning",
    });
  }

  // Tier-compatibility gate
  if (!kindDef.availableInOfficeTiers.includes(state.office.tier)) {
    return appendLog(state, {
      category: "event",
      headline: `${kindDef.name} not available in ${state.office.tier} office`,
      severity: "warning",
    });
  }

  // Era gate
  const year = parseInt(state.currentDate.slice(0, 4));
  if (year < kindDef.emergedYear) {
    return appendLog(state, {
      category: "event",
      headline: `${kindDef.name} doesn't exist yet (requires year ${kindDef.emergedYear}+)`,
      severity: "warning",
    });
  }

  // Cost
  const cost = kindDef.installCostByTier[input.tier - 1] ?? 0;
  if (state.studio.cash < cost) {
    return appendLog(state, {
      category: "event",
      headline: `Cannot afford ${kindDef.name} (tier ${input.tier})`,
      body: `Costs $${Math.round(cost / 100).toLocaleString()}. You have $${Math.round(state.studio.cash / 100).toLocaleString()}.`,
      severity: "warning",
    });
  }

  // Grid fit
  const w = kindDef.defaultWidth;
  const h = kindDef.defaultHeight;
  if (input.x + w > state.office.gridWidth || input.y + h > state.office.gridHeight) {
    return appendLog(state, {
      category: "event",
      headline: `${kindDef.name} doesn't fit at (${input.x}, ${input.y})`,
      severity: "warning",
    });
  }

  // Overlap check — no two rooms on the same tile
  for (const r of state.office.rooms) {
    if (
      input.x < r.x + r.width &&
      input.x + w > r.x &&
      input.y < r.y + r.height &&
      input.y + h > r.y
    ) {
      return appendLog(state, {
        category: "event",
        headline: `Cannot place ${kindDef.name} — overlaps existing room`,
        severity: "warning",
      });
    }
  }

  let rng = state.rng;
  const [roomId, r1] = generateId("room", rng);
  rng = r1;

  const newRoom: Room = {
    id: roomId,
    kind: input.kind,
    tier: input.tier,
    x: input.x,
    y: input.y,
    width: w,
    height: h,
    capacity: kindDef.capacityByTier[input.tier - 1] ?? 0,
    qualityScore: input.tier * 25,
    monthlyUpkeep: kindDef.monthlyUpkeepByTier[input.tier - 1] ?? 0,
    installedOn: state.currentDate,
  };

  const updatedOffice: Office = {
    ...state.office,
    rooms: [...state.office.rooms, newRoom],
    totalCapacity: state.office.totalCapacity + newRoom.capacity,
    amenityScore: computeAmenityScore([...state.office.rooms, newRoom]),
  };

  let next: GameState = {
    ...state,
    rng,
    office: updatedOffice,
    studio: { ...state.studio, cash: state.studio.cash - cost },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Installed ${kindDef.name} (tier ${input.tier})`,
    body: `$${Math.round(cost / 100).toLocaleString()} paid. Capacity +${newRoom.capacity}. Monthly upkeep +$${Math.round(newRoom.monthlyUpkeep / 100).toLocaleString()}.`,
    severity: "success",
  });

  return next;
}

// ============ REMOVE ROOM ============
export function removeRoom(state: GameState, roomId: ID): GameState {
  const room = state.office.rooms.find((r) => r.id === roomId);
  if (!room) return state;

  const kindDef = ROOM_KIND_BY_ID[room.kind];

  const updatedRooms = state.office.rooms.filter((r) => r.id !== roomId);
  const updatedOffice: Office = {
    ...state.office,
    rooms: updatedRooms,
    totalCapacity: Math.max(0, state.office.totalCapacity - room.capacity),
    amenityScore: computeAmenityScore(updatedRooms),
  };

  let next: GameState = {
    ...state,
    office: updatedOffice,
  };

  next = appendLog(next, {
    category: "event",
    headline: `Removed ${kindDef?.name ?? room.kind}`,
    body: `Capacity -${room.capacity}. Saves $${Math.round(room.monthlyUpkeep / 100).toLocaleString()}/mo.`,
    severity: "info",
  });

  return next;
}

// ============ MONTHLY UPKEEP ============
// Deducts office rent + all room upkeep. Called from master tick.
export function tickOfficeMonthly(state: GameState): GameState {
  const rent = state.office.monthlyRent;
  const upkeep = state.office.rooms.reduce((sum, r) => sum + r.monthlyUpkeep, 0);
  const totalCost = rent + upkeep;
  if (totalCost <= 0) return state;

  let next: GameState = {
    ...state,
    studio: { ...state.studio, cash: state.studio.cash - totalCost },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `Office costs: $${Math.round(totalCost / 100).toLocaleString()}`,
    body: `Rent $${Math.round(rent / 100).toLocaleString()} + upkeep $${Math.round(upkeep / 100).toLocaleString()}.`,
    severity: "info",
  });

  return next;
}

// ============ AMENITY SCORE ============
// Aggregate score — morale/energy recovery rooms contribute. Used by staff
// recovery systems indirectly via passive morale drift.
function computeAmenityScore(rooms: Room[]): number {
  let score = 0;
  for (const r of rooms) {
    if (r.kind === "lounge" || r.kind === "cafeteria") score += 10 * r.tier;
    if (r.kind === "gym") score += 15 * r.tier;
    if (r.kind === "training_room") score += 8 * r.tier;
    if (r.kind === "archive") score += 5 * r.tier;
  }
  return score;
}
