// Generates candidate staff for the hiring pool.
// Stats are tuned by role; traits are sampled with conflict/role-affinity respected;
// salary expectations scale with stats and trait modifiers.

import type { RngState, StaffRole } from "../types/core";
import type { Staff, StaffStats, TraitId } from "../types/staff";
import { TRAITS, TRAIT_BY_ID, TRAIT_ROLE_AFFINITY } from "../data/traits";
import { rngInt, rngFloat, rngGaussian, rngPick, rngShuffle, rngChance } from "../core/rng";
import { generateId } from "../core/ids";

// Name pools — kept small and reusable; diverse enough to feel human.
const FIRST_NAMES = [
  "Alex", "Jordan", "Sam", "Morgan", "Riley", "Casey", "Quinn", "Taylor", "Cameron",
  "Akira", "Hiroki", "Mei", "Yuki", "Ren", "Sora", "Naomi", "Kenji", "Aiko",
  "Elena", "Marco", "Luca", "Sofia", "Miguel", "Rosa", "Andres", "Valentina",
  "Amara", "Kwame", "Zola", "Jabari", "Adaeze", "Kofi", "Nia", "Tendai",
  "Priya", "Arjun", "Ananya", "Rohan", "Kavya", "Vikram", "Isha", "Dev",
  "Ingrid", "Magnus", "Sigrid", "Olaf", "Freya", "Soren", "Astrid",
  "Rachel", "Michael", "Sarah", "David", "Emma", "James", "Olivia", "Daniel",
  "Chen", "Wei", "Lin", "Jun", "Ming", "Xia", "Yun",
  "Dimitri", "Anya", "Yuri", "Katarina", "Viktor", "Irina",
];

const LAST_NAMES = [
  "Chen", "Patel", "Okafor", "Rodriguez", "Kim", "Nakamura", "Anderson", "Müller",
  "Silva", "Yamamoto", "Abebe", "Tanaka", "Reyes", "Jensen", "O'Connor",
  "Tenor", "Matsuda", "Cole", "Vega", "Larsen", "Huang", "Markov", "Ellis",
  "Okonkwo", "Petrov", "Liu", "Gupta", "Brennan", "Nguyen", "Santos",
  "Hoffman", "Torres", "Kowalski", "Ferreira", "Haddad", "Mwangi", "Takeda",
  "Bergström", "Moreau", "Schäfer", "Sato", "Ivanov", "Cohen", "Rossi",
];

// Role-specific stat profiles — mean stats for each role
// Primary stats are high, secondaries medium, tertiaries low.
const ROLE_STAT_PROFILES: Record<StaffRole, {
  primary: (keyof StaffStats)[];
  secondary: (keyof StaffStats)[];
}> = {
  designer:   { primary: ["design"],           secondary: ["writing", "art"] },
  programmer: { primary: ["tech"],             secondary: ["speed", "design"] },
  artist:     { primary: ["art"],              secondary: ["design", "speed"] },
  composer:   { primary: ["sound"],            secondary: ["writing"] },
  writer:     { primary: ["writing"],          secondary: ["design"] },
  qa:         { primary: ["tech", "speed"],    secondary: ["design"] },
  producer:   { primary: ["design", "speed"],  secondary: ["writing"] },
  marketer:   { primary: ["writing", "design"],secondary: ["art"] },
  exec:       { primary: ["design"],           secondary: ["writing", "speed"] },
};

// Tier profile: junior/mid/senior/legendary determines stat means and variance
type TalentTier = "junior" | "mid" | "senior" | "legendary";

function pickTalentTier(rng: RngState): [TalentTier, RngState] {
  // Weighted — most candidates are juniors/mids
  const [roll, next] = rngFloat(rng, 0, 1);
  if (roll < 0.45) return ["junior", next];
  if (roll < 0.80) return ["mid", next];
  if (roll < 0.97) return ["senior", next];
  return ["legendary", next];
}

const TIER_STAT_RANGES: Record<TalentTier, { primary: [number, number]; secondary: [number, number]; tertiary: [number, number] }> = {
  junior:     { primary: [30, 55], secondary: [15, 35], tertiary: [5, 20] },
  mid:        { primary: [50, 75], secondary: [30, 55], tertiary: [15, 35] },
  senior:     { primary: [70, 90], secondary: [50, 75], tertiary: [25, 50] },
  legendary:  { primary: [85, 99], secondary: [70, 90], tertiary: [40, 65] },
};

const TIER_TRAIT_COUNT: Record<TalentTier, [number, number]> = {
  junior: [1, 2],
  mid: [2, 3],
  senior: [2, 4],
  legendary: [3, 4],
};

// Base salary in cents, by role and tier (annual)
const BASE_SALARY: Record<StaffRole, Record<TalentTier, number>> = {
  designer:   { junior: 3500000, mid: 6500000, senior: 12000000, legendary: 22000000 },
  programmer: { junior: 4000000, mid: 7500000, senior: 14000000, legendary: 25000000 },
  artist:     { junior: 3500000, mid: 6500000, senior: 12000000, legendary: 20000000 },
  composer:   { junior: 3000000, mid: 5500000, senior: 10000000, legendary: 18000000 },
  writer:     { junior: 3000000, mid: 5500000, senior: 10000000, legendary: 18000000 },
  qa:         { junior: 2500000, mid: 4500000, senior: 8000000,  legendary: 14000000 },
  producer:   { junior: 4500000, mid: 8000000, senior: 14000000, legendary: 24000000 },
  marketer:   { junior: 3500000, mid: 6500000, senior: 11000000, legendary: 18000000 },
  exec:       { junior: 6000000, mid: 11000000, senior: 20000000, legendary: 40000000 },
};

function rollStat(rng: RngState, range: [number, number]): [number, RngState] {
  return rngInt(rng, range[0], range[1]);
}

function generateStats(
  rng: RngState,
  role: StaffRole,
  tier: TalentTier
): [StaffStats, RngState] {
  const profile = ROLE_STAT_PROFILES[role];
  const ranges = TIER_STAT_RANGES[tier];
  let r = rng;
  const stats: StaffStats = { design: 0, tech: 0, art: 0, sound: 0, writing: 0, speed: 0 };
  const allKeys: (keyof StaffStats)[] = ["design", "tech", "art", "sound", "writing", "speed"];
  for (const key of allKeys) {
    let range = ranges.tertiary;
    if (profile.primary.includes(key)) range = ranges.primary;
    else if (profile.secondary.includes(key)) range = ranges.secondary;
    const [v, next] = rollStat(r, range);
    stats[key] = v;
    r = next;
  }
  return [stats, r];
}

function generateTraits(
  rng: RngState,
  role: StaffRole,
  tier: TalentTier
): [TraitId[], RngState] {
  const [min, max] = TIER_TRAIT_COUNT[tier];
  const [count, r1] = rngInt(rng, min, max);

  // Trait pool: prefer role-affinity traits but not exclusively
  const pool: { trait: TraitId; weight: number }[] = TRAITS.map((t) => {
    const affinities = TRAIT_ROLE_AFFINITY[t.id];
    const roleMatches = affinities ? (affinities.includes(role) ? 3 : 1) : 1.5;
    // Rarity weighting
    const rarityWeight =
      t.rarity === "common" ? 4 :
      t.rarity === "uncommon" ? 2 :
      t.rarity === "rare" ? 1 :
      0.3; // legendary
    return { trait: t.id as TraitId, weight: roleMatches * rarityWeight };
  });

  // Legendary talent tier gets a boost on rare/legendary traits
  if (tier === "legendary") {
    for (const p of pool) {
      const t = TRAIT_BY_ID[p.trait]!;
      if (t.rarity === "rare" || t.rarity === "legendary") p.weight *= 3;
    }
  }

  const picked: TraitId[] = [];
  let current = r1;
  // Shuffle weighted order
  const [shuffled, r2] = rngShuffle(current, pool);
  current = r2;
  shuffled.sort((a, b) => b.weight - a.weight); // heaviest first

  for (const candidate of shuffled) {
    if (picked.length >= count) break;
    const def = TRAIT_BY_ID[candidate.trait]!;
    // Check conflicts — skip if any conflict already picked
    const hasConflict = (def.conflicts ?? []).some((c) => picked.includes(c as TraitId));
    if (hasConflict) continue;
    // Roll against weight to add variety
    const [roll, next] = rngFloat(current, 0, 10);
    current = next;
    if (roll < candidate.weight) {
      picked.push(candidate.trait);
    }
  }

  // Guarantee at least one trait
  if (picked.length === 0) {
    const [fallback, r3] = rngPick(current, TRAITS.filter((t) => t.rarity === "common"));
    return [[fallback.id as TraitId], r3];
  }

  return [picked, current];
}

// Apply trait salary-demand multipliers
function applyTraitSalaryModifiers(baseSalary: number, traits: TraitId[]): number {
  let mult = 1.0;
  for (const tid of traits) {
    const def = TRAIT_BY_ID[tid];
    if (!def) continue;
    for (const eff of def.effects) {
      if (eff.type === "salary_demand") mult *= eff.value;
    }
  }
  return Math.round(baseSalary * mult);
}

export interface GenerateStaffOptions {
  role?: StaffRole;        // if not specified, random
  forceTier?: TalentTier;  // testing hook
  minAge?: number;
  maxAge?: number;
}

export function generateStaff(
  rng: RngState,
  options: GenerateStaffOptions = {}
): [Staff, RngState] {
  let r = rng;

  // Role
  let role: StaffRole;
  if (options.role) {
    role = options.role;
  } else {
    const roles: StaffRole[] = ["designer", "programmer", "artist", "composer", "writer", "qa", "producer", "marketer"];
    const [pickedRole, next] = rngPick(r, roles);
    role = pickedRole;
    r = next;
  }

  // Tier
  let tier: TalentTier;
  if (options.forceTier) {
    tier = options.forceTier;
  } else {
    const [t, next] = pickTalentTier(r);
    tier = t;
    r = next;
  }

  // Name
  const [firstName, rFn] = rngPick(r, FIRST_NAMES);
  r = rFn;
  const [lastName, rLn] = rngPick(r, LAST_NAMES);
  r = rLn;

  // Age — roughly correlated with tier
  const ageRanges: Record<TalentTier, [number, number]> = {
    junior: [20, 28],
    mid: [26, 38],
    senior: [32, 52],
    legendary: [38, 62],
  };
  const minAge = options.minAge ?? ageRanges[tier][0];
  const maxAge = options.maxAge ?? ageRanges[tier][1];
  const [age, rAge] = rngInt(r, minAge, maxAge);
  r = rAge;

  // Stats
  const [stats, rStats] = generateStats(r, role, tier);
  r = rStats;

  // Traits
  const [traits, rTraits] = generateTraits(r, role, tier);
  r = rTraits;

  // Base salary + trait modifiers
  const base = BASE_SALARY[role][tier];
  const [salaryVariance, rSal] = rngGaussian(r, 1.0, 0.12);
  r = rSal;
  const salary = applyTraitSalaryModifiers(
    Math.max(0.75, Math.min(1.35, salaryVariance)) * base,
    traits
  );

  // Starting morale/energy/loyalty — slightly randomized
  const [morale, rMor] = rngInt(r, 60, 85);
  r = rMor;
  const [loyalty, rLoy] = rngInt(r, 40, 70);
  r = rLoy;

  // ID
  const [id, rId] = generateId("staff", r);
  r = rId;

  const staff: Staff = {
    id,
    name: `${firstName} ${lastName}`,
    age,
    role,
    stats,
    specializations: {},
    traits,
    salary: Math.round(salary),
    morale,
    energy: 100,
    loyalty,
    reputation: tier === "legendary" ? 50 : tier === "senior" ? 25 : 10,
    health: 100,
    currentProjectId: null,
    status: "candidate",
    hiredOn: null,
    gamesWorkedOn: [],
    awardsWon: 0,
  };

  return [staff, r];
}
