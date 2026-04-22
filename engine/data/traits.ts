import type { Trait } from "../types/staff";

// Traits give personality to staff and make hiring/firing decisions meaningful.
// Conflicts prevent incompatible traits from spawning together.
// Synergies create bonus chemistry when two staff with paired traits work together.

export const TRAITS: Trait[] = [
  // ============ PERFORMANCE TRAITS ============
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Produces higher-quality work but takes longer and hates crunch.",
    rarity: "uncommon",
    effects: [
      { type: "stat_mod", stat: "speed", value: -10 },
      { type: "bug_rate", value: -0.3 },
      { type: "crunch_tolerance", value: -30 },
    ],
    conflicts: ["workhorse", "speed_demon"],
  },
  {
    id: "workhorse",
    name: "Workhorse",
    description: "Handles heavy workload without complaint. Loves shipping.",
    rarity: "common",
    effects: [
      { type: "stat_mod", stat: "speed", value: 10 },
      { type: "crunch_tolerance", value: 40 },
      { type: "morale_mod", value: -5 },
    ],
    conflicts: ["perfectionist", "prima_donna"],
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Ships fast. Bugs come with the territory.",
    rarity: "common",
    effects: [
      { type: "stat_mod", stat: "speed", value: 20 },
      { type: "bug_rate", value: 0.4 },
    ],
    conflicts: ["perfectionist", "methodical"],
  },
  {
    id: "methodical",
    name: "Methodical",
    description: "Careful, thorough work. Low bug rate, slower pace.",
    rarity: "common",
    effects: [
      { type: "stat_mod", stat: "speed", value: -5 },
      { type: "bug_rate", value: -0.35 },
    ],
    conflicts: ["speed_demon"],
  },

  // ============ PERSONALITY TRAITS ============
  {
    id: "burnout_prone",
    name: "Burnout Prone",
    description: "Crunch hits them hard. Watch the energy meter.",
    rarity: "common",
    effects: [
      { type: "crunch_tolerance", value: -50 },
      { type: "morale_mod", value: -10 },
    ],
    conflicts: ["workhorse"],
  },
  {
    id: "prima_donna",
    name: "Prima Donna",
    description: "Demands the spotlight and a premium salary.",
    rarity: "uncommon",
    effects: [
      { type: "salary_demand", value: 1.5 },
      { type: "morale_mod", value: -8 },
      { type: "quit_risk", value: 0.3 },
    ],
    conflicts: ["team_player", "workhorse", "loyal"],
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Raises morale for everyone around them.",
    rarity: "common",
    effects: [
      { type: "morale_mod", value: 8 },
      { type: "mentorship_bonus", value: 0.15 },
    ],
    synergies: ["mentor", "charismatic"],
    conflicts: ["lone_wolf", "prima_donna"],
  },
  {
    id: "lone_wolf",
    name: "Lone Wolf",
    description: "Does their best work alone. Resents large teams.",
    rarity: "uncommon",
    effects: [
      { type: "morale_mod", value: -5 },
    ],
    conflicts: ["team_player", "mentor"],
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Slowly raises the stats of junior staff working alongside them.",
    rarity: "rare",
    effects: [
      { type: "mentorship_bonus", value: 0.4 },
    ],
    synergies: ["team_player", "rising_star"],
    conflicts: ["lone_wolf"],
  },
  {
    id: "rising_star",
    name: "Rising Star",
    description: "Stats grow faster than normal. Gets poaching offers.",
    rarity: "rare",
    effects: [
      { type: "quit_risk", value: 0.2 },
      { type: "morale_mod", value: 5 },
    ],
    synergies: ["mentor"],
  },

  // ============ ROLE-SPECIFIC GENIUSES ============
  {
    id: "code_wizard",
    name: "Code Wizard",
    description: "Elite programming output. Solves hard problems fast.",
    rarity: "rare",
    effects: [
      { type: "stat_mod", stat: "tech", value: 25 },
      { type: "bug_rate", value: -0.2 },
    ],
  },
  {
    id: "art_prodigy",
    name: "Art Prodigy",
    description: "Exceptional visual work. Every pixel matters.",
    rarity: "rare",
    effects: [
      { type: "stat_mod", stat: "art", value: 25 },
    ],
  },
  {
    id: "sound_virtuoso",
    name: "Sound Virtuoso",
    description: "Unforgettable soundtracks and audio design.",
    rarity: "rare",
    effects: [
      { type: "stat_mod", stat: "sound", value: 25 },
    ],
  },
  {
    id: "narrative_mind",
    name: "Narrative Mind",
    description: "Writes stories that make critics weep.",
    rarity: "rare",
    effects: [
      { type: "stat_mod", stat: "writing", value: 25 },
    ],
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    description: "A QA savant. Finds what others miss.",
    rarity: "uncommon",
    effects: [
      { type: "bug_rate", value: -0.5 },
    ],
  },

  // ============ GENRE SPECIALISTS ============
  {
    id: "genre_savant",
    name: "Genre Savant",
    description: "Exceptional understanding of one specific genre.",
    rarity: "uncommon",
    effects: [
      // Specific genre picked at spawn time — handled by generator
      { type: "genre_affinity", genre: "rpg", value: 0.2 },
    ],
  },
  {
    id: "innovator",
    name: "Innovator",
    description: "Thrives on pioneering new genres and tech.",
    rarity: "rare",
    effects: [
      { type: "stat_mod", stat: "design", value: 15 },
      { type: "stat_mod", stat: "tech", value: 10 },
    ],
    synergies: ["visionary"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Reliable spark for fresh ideas.",
    rarity: "common",
    effects: [
      { type: "stat_mod", stat: "design", value: 12 },
    ],
  },
  {
    id: "visionary",
    name: "Visionary",
    description: "Legendary talent. Shapes genres. Expensive.",
    rarity: "legendary",
    effects: [
      { type: "stat_mod", stat: "design", value: 30 },
      { type: "salary_demand", value: 2.0 },
      { type: "quit_risk", value: 0.15 },
    ],
    synergies: ["innovator"],
  },

  // ============ LIFESTYLE / LOYALTY ============
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Works late, handles crunch. Slower to start.",
    rarity: "common",
    effects: [
      { type: "crunch_tolerance", value: 20 },
      { type: "stat_mod", stat: "speed", value: -3 },
    ],
  },
  {
    id: "charismatic",
    name: "Charismatic",
    description: "Natural recruiter. Easier to hire when they're on staff.",
    rarity: "uncommon",
    effects: [
      { type: "morale_mod", value: 5 },
      { type: "mentorship_bonus", value: 0.1 },
    ],
    synergies: ["team_player"],
  },
  {
    id: "diplomat",
    name: "Diplomat",
    description: "Smooths over team conflicts and negotiates well.",
    rarity: "uncommon",
    effects: [
      { type: "morale_mod", value: 6 },
    ],
  },
  {
    id: "loyal",
    name: "Loyal",
    description: "Sticks with the studio. Ignores poaching offers.",
    rarity: "uncommon",
    effects: [
      { type: "loyalty_mod", value: 40 },
      { type: "quit_risk", value: -0.4 },
    ],
    conflicts: ["mercenary", "prima_donna"],
  },
  {
    id: "mercenary",
    name: "Mercenary",
    description: "Goes where the money is. Accepts poaching offers readily.",
    rarity: "common",
    effects: [
      { type: "loyalty_mod", value: -30 },
      { type: "quit_risk", value: 0.4 },
      { type: "salary_demand", value: 1.2 },
    ],
    conflicts: ["loyal"],
  },
  {
    id: "moneyhound",
    name: "Moneyhound",
    description: "Wants raises constantly. Top-tier work when paid well.",
    rarity: "common",
    effects: [
      { type: "salary_demand", value: 1.3 },
    ],
  },
];

export const TRAIT_BY_ID: Record<string, Trait> = Object.fromEntries(
  TRAITS.map((t) => [t.id, t])
);

// Role-preference: which traits are more likely to spawn on which roles
export const TRAIT_ROLE_AFFINITY: Record<string, string[]> = {
  code_wizard: ["programmer"],
  art_prodigy: ["artist"],
  sound_virtuoso: ["composer"],
  narrative_mind: ["writer"],
  bug_hunter: ["qa", "programmer"],
  diplomat: ["producer", "exec"],
  charismatic: ["marketer", "producer", "exec"],
  visionary: ["designer", "exec"],
};
