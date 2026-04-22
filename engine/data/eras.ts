import type { EraId } from "../types/core";

export interface EraDef {
  id: EraId;
  name: string;
  description: string;
  startYear: number;
  endYear: number;
  tagline: string;
}

export const ERAS: EraDef[] = [
  {
    id: "era_8bit",
    name: "The 8-Bit Era",
    description: "Arcades dominate, home computers are new. A handful of brave developers in garages.",
    startYear: 1980,
    endYear: 1987,
    tagline: "Type. Run. Save to cassette.",
  },
  {
    id: "era_16bit",
    name: "The 16-Bit Era",
    description: "Consoles explode into the mainstream. The genre wars begin.",
    startYear: 1988,
    endYear: 1994,
    tagline: "Sprites, scrolling, and a growing medium.",
  },
  {
    id: "era_3d_revolution",
    name: "The 3D Revolution",
    description: "Polygons replace pixels. Everything changes overnight.",
    startYear: 1995,
    endYear: 1999,
    tagline: "Welcome to the third dimension.",
  },
  {
    id: "era_online",
    name: "The Online Era",
    description: "Broadband arrives. Massive worlds become possible.",
    startYear: 2000,
    endYear: 2005,
    tagline: "Always online, always playing.",
  },
  {
    id: "era_hd",
    name: "The HD Era",
    description: "High-definition graphics, dedicated servers, and AAA budgets.",
    startYear: 2006,
    endYear: 2012,
    tagline: "Bigger budgets, bigger worlds.",
  },
  {
    id: "era_mobile_indie",
    name: "Mobile & Indie Boom",
    description: "Touch screens reach billions. Indie devs reach the top charts.",
    startYear: 2013,
    endYear: 2019,
    tagline: "A studio in every pocket.",
  },
  {
    id: "era_streaming_vr",
    name: "Streaming & VR",
    description: "Cloud gaming matures. VR finds its audience.",
    startYear: 2020,
    endYear: 2029,
    tagline: "Any game, any device, anywhere.",
  },
  {
    id: "era_ai_neural",
    name: "AI-Native & Neural",
    description: "AI rewrites development. Neural interfaces become real platforms.",
    startYear: 2030,
    endYear: 2045,
    tagline: "The game thinks back.",
  },
];

export const ERA_BY_ID: Record<EraId, EraDef> = Object.fromEntries(
  ERAS.map((e) => [e.id, e])
) as Record<EraId, EraDef>;

export function eraForYear(year: number): EraDef {
  const found = ERAS.find((e) => year >= e.startYear && year <= e.endYear);
  return found ?? ERAS[ERAS.length - 1];
}

// ============ STARTING ERA PRESETS ============
// Player chooses one at new-game. Each presets cash, available platforms,
// pre-unlocked tech, and competitor roster.

export interface StartingEraPreset {
  id: string;
  eraId: EraId;
  startYear: number;
  label: string;
  description: string;
  startingCash: number;         // in cents
  // Tech nodes automatically unlocked at start for this era
  preUnlockedTechIds: string[];
  // Starting office tier
  startingOfficeTier: string;
  // Difficulty modifier (1.0 = normal)
  difficulty: number;
  // Flavor
  openingMessage: string;
}

export const STARTING_ERA_PRESETS: StartingEraPreset[] = [
  {
    id: "start_1980",
    eraId: "era_8bit",
    startYear: 1980,
    label: "1980 — Year One",
    description: "The birth of the industry. Long road ahead, maximum legacy potential.",
    startingCash: 7500000, // $75K
    preUnlockedTechIds: [],
    startingOfficeTier: "garage",
    difficulty: 1.2,
    openingMessage: "You've quit your day job. The garage smells like solder. The future is unwritten.",
  },
  {
    id: "start_1988",
    eraId: "era_16bit",
    startYear: 1988,
    label: "1988 — The Console War Begins",
    description: "Consoles are mainstream. Strategy is everything.",
    startingCash: 15000000, // $150K
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling",
      "aud_chiptune", "aud_fm_synth",
      "net_modem",
      "sim_state_machines",
      "plat_console_cert",
    ],
    startingOfficeTier: "apartment",
    difficulty: 1.0,
    openingMessage: "The 16-bit wave is cresting. Every kid wants a console. Your studio is poised to ride it.",
  },
  {
    id: "start_1995",
    eraId: "era_3d_revolution",
    startYear: 1995,
    label: "1995 — The 3D Gold Rush",
    description: "Polygons are the new frontier. Old studios scramble; new ones leap.",
    startingCash: 30000000,
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed",
      "net_modem", "net_lan",
      "sim_state_machines", "sim_pathfinding",
      "plat_console_cert", "plat_cd_pipeline",
    ],
    startingOfficeTier: "small_office",
    difficulty: 1.0,
    openingMessage: "The transition is bloody. Studios that can't make the jump are already dead. Yours has to move.",
  },
  {
    id: "start_2000",
    eraId: "era_online",
    startYear: 2000,
    label: "2000 — The Online Frontier",
    description: "Broadband is changing everything. MMOs, multiplayer, persistent worlds.",
    startingCash: 50000000,
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d", "gfx_texture_filtering",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed", "aud_3d_positional",
      "net_modem", "net_lan", "net_broadband",
      "sim_state_machines", "sim_pathfinding", "sim_physics_basic",
      "plat_console_cert", "plat_cd_pipeline",
    ],
    startingOfficeTier: "small_office",
    difficulty: 1.0,
    openingMessage: "The new millennium. Games are connected now. What will you build in the always-on world?",
  },
  {
    id: "start_2006",
    eraId: "era_hd",
    startYear: 2006,
    label: "2006 — The HD Generation",
    description: "Budgets balloon. The AAA model solidifies. Risk or reward?",
    startingCash: 100000000,
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d", "gfx_texture_filtering", "gfx_shaders", "gfx_normal_maps", "gfx_hdr",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed", "aud_3d_positional", "aud_dynamic_mix",
      "net_modem", "net_lan", "net_broadband", "net_p2p",
      "sim_state_machines", "sim_pathfinding", "sim_physics_basic", "sim_ragdoll",
      "plat_console_cert", "plat_cd_pipeline", "plat_digital_dist",
    ],
    startingOfficeTier: "floor",
    difficulty: 0.95,
    openingMessage: "The industry is flush. Budgets are bigger than films. But so are the stakes.",
  },
  {
    id: "start_2013",
    eraId: "era_mobile_indie",
    startYear: 2013,
    label: "2013 — Indie & Mobile Boom",
    description: "Phones are platforms. Steam is flooded. Distribution is democratized.",
    startingCash: 25000000, // Easier to start small in this era
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d", "gfx_texture_filtering", "gfx_shaders", "gfx_normal_maps", "gfx_hdr", "gfx_deferred", "gfx_pbr",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed", "aud_3d_positional", "aud_dynamic_mix", "aud_surround",
      "net_modem", "net_lan", "net_broadband", "net_p2p", "net_dedicated_servers", "net_massive",
      "sim_state_machines", "sim_pathfinding", "sim_physics_basic", "sim_ragdoll", "sim_behavior_trees", "sim_destruction",
      "plat_console_cert", "plat_cd_pipeline", "plat_digital_dist", "plat_dlc_framework", "plat_mobile_sdk",
    ],
    startingOfficeTier: "apartment",
    difficulty: 0.9,
    openingMessage: "A good game can be made by two people in a kitchen. The gatekeepers are gone. Time to prove it.",
  },
  {
    id: "start_2020",
    eraId: "era_streaming_vr",
    startYear: 2020,
    label: "2020 — The Streaming Future",
    description: "Cloud gaming, VR at scale, live service everywhere.",
    startingCash: 80000000,
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d", "gfx_texture_filtering", "gfx_shaders", "gfx_normal_maps", "gfx_hdr", "gfx_deferred", "gfx_pbr", "gfx_ray_tracing",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed", "aud_3d_positional", "aud_dynamic_mix", "aud_surround", "aud_spatial",
      "net_modem", "net_lan", "net_broadband", "net_p2p", "net_dedicated_servers", "net_massive", "net_cloud_sync",
      "sim_state_machines", "sim_pathfinding", "sim_physics_basic", "sim_ragdoll", "sim_behavior_trees", "sim_destruction", "sim_fluid", "sim_ml_npcs",
      "plat_console_cert", "plat_cd_pipeline", "plat_digital_dist", "plat_dlc_framework", "plat_mobile_sdk", "plat_live_service", "plat_vr_sdk", "plat_cloud_streaming", "plat_crossplay",
    ],
    startingOfficeTier: "floor",
    difficulty: 0.95,
    openingMessage: "Every device is a gaming device. Every session might be streamed. Identity in the noise — that's the challenge.",
  },
  {
    id: "start_2030",
    eraId: "era_ai_neural",
    startYear: 2030,
    label: "2030 — The AI-Native Studio",
    description: "Neural interfaces exist. AI writes code, art, and music. What does a studio even mean now?",
    startingCash: 150000000,
    preUnlockedTechIds: [
      "gfx_2d_sprites", "gfx_scrolling", "gfx_mode7", "gfx_polygon_3d", "gfx_texture_filtering", "gfx_shaders", "gfx_normal_maps", "gfx_hdr", "gfx_deferred", "gfx_pbr", "gfx_ray_tracing", "gfx_neural_render",
      "aud_chiptune", "aud_fm_synth", "aud_midi", "aud_streamed", "aud_3d_positional", "aud_dynamic_mix", "aud_surround", "aud_spatial", "aud_neural_voice",
      "net_modem", "net_lan", "net_broadband", "net_p2p", "net_dedicated_servers", "net_massive", "net_cloud_sync",
      "sim_state_machines", "sim_pathfinding", "sim_physics_basic", "sim_ragdoll", "sim_behavior_trees", "sim_destruction", "sim_fluid", "sim_ml_npcs", "sim_emergent_ai",
      "plat_console_cert", "plat_cd_pipeline", "plat_digital_dist", "plat_dlc_framework", "plat_mobile_sdk", "plat_live_service", "plat_vr_sdk", "plat_cloud_streaming", "plat_crossplay",
    ],
    startingOfficeTier: "corporate",
    difficulty: 1.1, // Late-era complexity + high operating costs
    openingMessage: "The machine can do most of it. Your job is to know what's worth making in the first place.",
  },
];

export const STARTING_PRESET_BY_ID: Record<string, StartingEraPreset> = Object.fromEntries(
  STARTING_ERA_PRESETS.map((p) => [p.id, p])
);
