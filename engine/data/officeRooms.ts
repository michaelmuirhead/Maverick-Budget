import type { RoomKind, OfficeTier } from "../types/office";

export interface RoomKindDef {
  kind: RoomKind;
  name: string;
  description: string;
  // Cost at each tier (1-4) in cents
  installCostByTier: [number, number, number, number];
  monthlyUpkeepByTier: [number, number, number, number];
  // Default grid footprint
  defaultWidth: number;
  defaultHeight: number;
  // Base capacity per tier
  capacityByTier: [number, number, number, number];
  // Which rooms nearby provide adjacency synergy
  adjacencySynergies: RoomKind[];
  // Year this room type becomes available
  emergedYear: number;
  // Which office tiers can house this room kind
  availableInOfficeTiers: OfficeTier[];
  // Icon hint for UI
  iconHint: string;
}

export const ROOM_KINDS: RoomKindDef[] = [
  {
    kind: "dev_room",
    name: "Development Room",
    description: "Where programmers and designers build the game.",
    installCostByTier: [500000, 2000000, 8000000, 25000000],
    monthlyUpkeepByTier: [50000, 150000, 400000, 1000000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [3, 6, 12, 20],
    adjacencySynergies: ["art_room", "audio_booth", "lounge"],
    emergedYear: 1980,
    availableInOfficeTiers: ["garage", "apartment", "small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "💻",
  },
  {
    kind: "art_room",
    name: "Art Studio",
    description: "Dedicated space for artists and animators. Boosts visual quality.",
    installCostByTier: [800000, 3000000, 10000000, 30000000],
    monthlyUpkeepByTier: [75000, 200000, 500000, 1200000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [2, 5, 10, 18],
    adjacencySynergies: ["dev_room", "mocap_studio"],
    emergedYear: 1982,
    availableInOfficeTiers: ["apartment", "small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🎨",
  },
  {
    kind: "audio_booth",
    name: "Audio Booth",
    description: "Sound-isolated recording and composition space.",
    installCostByTier: [1200000, 4000000, 12000000, 35000000],
    monthlyUpkeepByTier: [80000, 220000, 550000, 1300000],
    defaultWidth: 2,
    defaultHeight: 2,
    capacityByTier: [1, 2, 4, 8],
    adjacencySynergies: ["dev_room"],
    emergedYear: 1983,
    availableInOfficeTiers: ["apartment", "small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🎧",
  },
  {
    kind: "qa_lab",
    name: "QA Lab",
    description: "Testing stations with multiple dev kits. Where bugs come to die.",
    installCostByTier: [1000000, 3500000, 11000000, 32000000],
    monthlyUpkeepByTier: [90000, 250000, 600000, 1400000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [2, 4, 8, 16],
    adjacencySynergies: ["dev_room"],
    emergedYear: 1984,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🐛",
  },
  {
    kind: "rnd_lab",
    name: "R&D Lab",
    description: "Research space generating tech points toward engine upgrades.",
    installCostByTier: [2000000, 6000000, 18000000, 50000000],
    monthlyUpkeepByTier: [150000, 400000, 900000, 2000000],
    defaultWidth: 3,
    defaultHeight: 3,
    capacityByTier: [2, 4, 8, 15],
    adjacencySynergies: ["dev_room", "server_room"],
    emergedYear: 1985,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🔬",
  },
  {
    kind: "mocap_studio",
    name: "Motion Capture Studio",
    description: "Body and facial capture for high-fidelity animation.",
    installCostByTier: [8000000, 20000000, 45000000, 100000000],
    monthlyUpkeepByTier: [400000, 900000, 1800000, 3500000],
    defaultWidth: 4,
    defaultHeight: 4,
    capacityByTier: [3, 6, 12, 20],
    adjacencySynergies: ["art_room", "audio_booth"],
    emergedYear: 2000,
    availableInOfficeTiers: ["floor", "corporate", "campus", "global_hq"],
    iconHint: "🎬",
  },
  {
    kind: "server_room",
    name: "Server Room",
    description: "Required to self-host online games and live services.",
    installCostByTier: [3000000, 10000000, 25000000, 70000000],
    monthlyUpkeepByTier: [250000, 700000, 1500000, 3000000],
    defaultWidth: 2,
    defaultHeight: 3,
    capacityByTier: [1, 2, 4, 8],
    adjacencySynergies: ["rnd_lab"],
    emergedYear: 1994,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🗄️",
  },
  {
    kind: "marketing_dept",
    name: "Marketing Department",
    description: "Amplifies hype and review impact on sales.",
    installCostByTier: [1500000, 5000000, 14000000, 40000000],
    monthlyUpkeepByTier: [120000, 350000, 800000, 1800000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [2, 5, 10, 18],
    adjacencySynergies: ["legal_biz", "boardroom"],
    emergedYear: 1986,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "📣",
  },
  {
    kind: "legal_biz",
    name: "Legal & Biz Dev",
    description: "Contract negotiation, IP protection, acquisition support.",
    installCostByTier: [1500000, 4500000, 13000000, 38000000],
    monthlyUpkeepByTier: [150000, 400000, 900000, 2000000],
    defaultWidth: 2,
    defaultHeight: 2,
    capacityByTier: [2, 4, 8, 14],
    adjacencySynergies: ["marketing_dept", "boardroom"],
    emergedYear: 1988,
    availableInOfficeTiers: ["floor", "corporate", "campus", "global_hq"],
    iconHint: "⚖️",
  },
  {
    kind: "cafeteria",
    name: "Cafeteria",
    description: "Raises morale and energy for all staff. Free meals are nice.",
    installCostByTier: [1000000, 3500000, 10000000, 28000000],
    monthlyUpkeepByTier: [200000, 500000, 1100000, 2400000],
    defaultWidth: 3,
    defaultHeight: 3,
    capacityByTier: [10, 25, 60, 150],
    adjacencySynergies: ["lounge", "gym"],
    emergedYear: 1982,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🍱",
  },
  {
    kind: "gym",
    name: "Gym",
    description: "Helps staff recover energy and resist burnout.",
    installCostByTier: [1800000, 5500000, 15000000, 42000000],
    monthlyUpkeepByTier: [180000, 450000, 1000000, 2200000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [5, 12, 30, 60],
    adjacencySynergies: ["cafeteria", "lounge"],
    emergedYear: 1990,
    availableInOfficeTiers: ["floor", "corporate", "campus", "global_hq"],
    iconHint: "💪",
  },
  {
    kind: "lounge",
    name: "Lounge",
    description: "Morale and creativity boost. Where the best ideas come from.",
    installCostByTier: [500000, 2000000, 6000000, 18000000],
    monthlyUpkeepByTier: [60000, 180000, 450000, 1000000],
    defaultWidth: 2,
    defaultHeight: 2,
    capacityByTier: [4, 10, 25, 50],
    adjacencySynergies: ["cafeteria", "dev_room", "art_room"],
    emergedYear: 1980,
    availableInOfficeTiers: ["apartment", "small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🛋️",
  },
  {
    kind: "training_room",
    name: "Training Room",
    description: "Raises staff stat growth rate. Perfect for grooming juniors.",
    installCostByTier: [1500000, 4000000, 12000000, 32000000],
    monthlyUpkeepByTier: [100000, 300000, 700000, 1600000],
    defaultWidth: 2,
    defaultHeight: 2,
    capacityByTier: [4, 8, 16, 30],
    adjacencySynergies: ["archive"],
    emergedYear: 1988,
    availableInOfficeTiers: ["small_office", "floor", "corporate", "campus", "global_hq"],
    iconHint: "🎓",
  },
  {
    kind: "archive",
    name: "Archive / Lore Vault",
    description: "Stores the studio's legacy. Mentors gain bonuses here.",
    installCostByTier: [800000, 2500000, 8000000, 22000000],
    monthlyUpkeepByTier: [40000, 120000, 300000, 700000],
    defaultWidth: 2,
    defaultHeight: 2,
    capacityByTier: [2, 4, 8, 15],
    adjacencySynergies: ["training_room"],
    emergedYear: 1992,
    availableInOfficeTiers: ["floor", "corporate", "campus", "global_hq"],
    iconHint: "📚",
  },
  {
    kind: "boardroom",
    name: "Boardroom",
    description: "Where major deals happen. Required for IPO and big acquisitions.",
    installCostByTier: [3000000, 8000000, 20000000, 55000000],
    monthlyUpkeepByTier: [100000, 300000, 700000, 1500000],
    defaultWidth: 3,
    defaultHeight: 2,
    capacityByTier: [8, 12, 20, 40],
    adjacencySynergies: ["legal_biz", "marketing_dept"],
    emergedYear: 1995,
    availableInOfficeTiers: ["floor", "corporate", "campus", "global_hq"],
    iconHint: "🏛️",
  },
];

export const ROOM_KIND_BY_ID: Record<RoomKind, RoomKindDef> = Object.fromEntries(
  ROOM_KINDS.map((r) => [r.kind, r])
) as Record<RoomKind, RoomKindDef>;

// Office tier definitions — footprint, rent, staff cap
export interface OfficeTierDef {
  tier: OfficeTier;
  name: string;
  description: string;
  gridWidth: number;
  gridHeight: number;
  maxStaff: number;
  monthlyRent: number;      // cents
  upgradeCost: number;      // cents, cost to move up to this tier
}

export const OFFICE_TIERS: OfficeTierDef[] = [
  {
    tier: "garage",
    name: "Garage",
    description: "A humble beginning. Just enough for the founder's vision.",
    gridWidth: 5,
    gridHeight: 4,
    maxStaff: 2,
    monthlyRent: 0,
    upgradeCost: 0,
  },
  {
    tier: "apartment",
    name: "Converted Apartment",
    description: "A proper space, barely. Can fit a small team.",
    gridWidth: 8,
    gridHeight: 6,
    maxStaff: 5,
    monthlyRent: 200000,
    upgradeCost: 2500000,
  },
  {
    tier: "small_office",
    name: "Small Office",
    description: "A real office. You have a logo on the door.",
    gridWidth: 12,
    gridHeight: 8,
    maxStaff: 12,
    monthlyRent: 800000,
    upgradeCost: 15000000,
  },
  {
    tier: "floor",
    name: "Corporate Floor",
    description: "An entire floor in a nice building. Feels legitimate.",
    gridWidth: 18,
    gridHeight: 12,
    maxStaff: 30,
    monthlyRent: 3000000,
    upgradeCost: 80000000,
  },
  {
    tier: "corporate",
    name: "Corporate HQ",
    description: "A whole building with your name on it.",
    gridWidth: 24,
    gridHeight: 16,
    maxStaff: 80,
    monthlyRent: 10000000,
    upgradeCost: 400000000,
  },
  {
    tier: "campus",
    name: "Campus",
    description: "Multi-building complex. Other studios tour it in awe.",
    gridWidth: 32,
    gridHeight: 24,
    maxStaff: 200,
    monthlyRent: 35000000,
    upgradeCost: 2000000000,
  },
  {
    tier: "global_hq",
    name: "Global HQ",
    description: "The crown jewel. Satellite studios worldwide report to this building.",
    gridWidth: 40,
    gridHeight: 32,
    maxStaff: 9999,
    monthlyRent: 100000000,
    upgradeCost: 10000000000,
  },
];

export const OFFICE_TIER_BY_ID: Record<OfficeTier, OfficeTierDef> = Object.fromEntries(
  OFFICE_TIERS.map((o) => [o.tier, o])
) as Record<OfficeTier, OfficeTierDef>;
