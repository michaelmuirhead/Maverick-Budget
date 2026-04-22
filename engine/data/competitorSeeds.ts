import type { CompetitorStrategy } from "../types/competitor";
import type { GenreId } from "../types/genre";

// Seed definitions for competitor studios. At game start, the engine filters
// these by foundedYear <= startYear to build the initial competitor roster.
// Additional studios spawn organically over time.
//
// IMPORTANT (fan project disclaimer): This sim uses the names of real video
// game studios and their founders for flavor. Maverick Game Tycoon is an
// unofficial fan project with no affiliation, endorsement, or sponsorship by
// any of the studios or people referenced below. All trademarks are property
// of their respective owners. Ownership relationships below reflect a
// canonical modern-era snapshot and may not match every historical moment.

export interface CompetitorSeed {
  id: string;
  name: string;
  founderName: string;
  hqCity: string;
  foundedYear: number;
  strategy: CompetitorStrategy;
  startingCash: number;         // in cents
  startingStaffCount: number;
  startingReputation: number;   // 0-100
  preferredGenres: GenreId[];
  backstory: string;
  // Optional publisher that owns this studio (must match a PUBLISHER_SEEDS.id
  // for the ownership to wire at new-game time).
  parentPublisherId?: string;
}

export const COMPETITOR_SEEDS: CompetitorSeed[] = [
  // ============ CLASSIC ARCADE / CONSOLE ERA (pre-1990) ============
  {
    id: "comp_atari_games",
    name: "Atari Games",
    founderName: "Nolan Bushnell",
    hqCity: "Sunnyvale, CA",
    foundedYear: 1972,
    strategy: "volume",
    startingCash: 500000000,            // $5M — arcade giant of its era
    startingStaffCount: 50,
    startingReputation: 60,
    preferredGenres: ["action", "shooter", "racing"],
    backstory: "The arcade pioneer that launched the industry. Cabinets in every pizza joint in America.",
  },
  {
    id: "comp_lucasarts",
    name: "LucasArts",
    founderName: "George Lucas",
    hqCity: "San Rafael, CA",
    foundedYear: 1982,
    strategy: "prestige",
    startingCash: 50000000,             // $500K
    startingStaffCount: 10,
    startingReputation: 25,
    preferredGenres: ["adventure", "action", "strategy"],
    backstory: "Spun out of Lucasfilm's computer division. Hollywood DNA and SCUMM-powered storytelling.",
  },
  {
    id: "comp_naughty_dog",
    name: "Naughty Dog",
    founderName: "Jason Rubin",
    hqCity: "Santa Monica, CA",
    foundedYear: 1984,
    strategy: "blockbuster",
    startingCash: 10000000,             // $100K — two guys in a garage
    startingStaffCount: 4,
    startingReputation: 10,
    preferredGenres: ["platformer", "action", "adventure"],
    backstory: "Two Ivy League kids making games from a bedroom. Cinematic ambition on an indie budget.",
    parentPublisherId: "pub_sony",
  },
  {
    id: "comp_westwood",
    name: "Westwood Studios",
    founderName: "Brett Sperry",
    hqCity: "Las Vegas, NV",
    foundedYear: 1985,
    strategy: "innovator",
    startingCash: 20000000,             // $200K
    startingStaffCount: 5,
    startingReputation: 12,
    preferredGenres: ["strategy", "rpg"],
    backstory: "Invented the modern RTS. Every base-build-and-rush since has their fingerprints on it.",
  },
  {
    id: "comp_squaresoft",
    name: "Squaresoft",
    founderName: "Masafumi Miyamoto",
    hqCity: "Tokyo, JP",
    foundedYear: 1986,
    strategy: "prestige",
    startingCash: 40000000,             // $400K
    startingStaffCount: 8,
    startingReputation: 15,
    preferredGenres: ["rpg", "strategy", "adventure"],
    backstory: "A scrappy JRPG shop betting the farm on one more game. That one game would save the company.",
    parentPublisherId: "pub_square_enix",
  },
  {
    id: "comp_fromsoftware",
    name: "FromSoftware",
    founderName: "Naotoshi Zin",
    hqCity: "Tokyo, JP",
    foundedYear: 1986,
    strategy: "hardcore",
    startingCash: 30000000,
    startingStaffCount: 6,
    startingReputation: 12,
    preferredGenres: ["action", "rpg", "horror"],
    backstory: "Niche dungeon-crawler studio. Relentless about difficulty before anyone had a word for it.",
  },
  {
    id: "comp_rockstar_north",
    name: "Rockstar North",
    founderName: "David Jones",
    hqCity: "Edinburgh, UK",
    foundedYear: 1987,
    strategy: "blockbuster",
    startingCash: 15000000,             // $150K — as DMA Design
    startingStaffCount: 4,
    startingReputation: 10,
    preferredGenres: ["action", "adventure", "shooter"],
    backstory: "Started as DMA Design making side-scrollers. Open-world sandbox obsession will eat the decade.",
    parentPublisherId: "pub_take_two",
  },
  {
    id: "comp_game_freak",
    name: "Game Freak",
    founderName: "Satoshi Tajiri",
    hqCity: "Tokyo, JP",
    foundedYear: 1989,
    strategy: "blockbuster",
    startingCash: 8000000,              // $80K — tiny
    startingStaffCount: 3,
    startingReputation: 8,
    preferredGenres: ["rpg", "adventure"],
    backstory: "Former fanzine editor. Obsessed with insects and trading mechanics. Will define a generation.",
    parentPublisherId: "pub_nintendo",
  },

  // ============ PC GOLDEN AGE (1990-2000) ============
  {
    id: "comp_id_software",
    name: "id Software",
    founderName: "John Carmack",
    hqCity: "Dallas, TX",
    foundedYear: 1991,
    strategy: "innovator",
    startingCash: 10000000,             // $100K
    startingStaffCount: 4,
    startingReputation: 15,
    preferredGenres: ["shooter", "action"],
    backstory: "Four guys in a lake house, convinced 3D is the only thing that matters. They're right.",
    parentPublisherId: "pub_bethesda",
  },
  {
    id: "comp_bungie",
    name: "Bungie",
    founderName: "Alex Seropian",
    hqCity: "Bellevue, WA",
    foundedYear: 1991,
    strategy: "blockbuster",
    startingCash: 10000000,             // $100K
    startingStaffCount: 3,
    startingReputation: 8,
    preferredGenres: ["shooter", "action"],
    backstory: "Mac-first dev shop betting that shooters belong on every platform. They're about to be right.",
  },
  {
    id: "comp_epic_games",
    name: "Epic Games",
    founderName: "Tim Sweeney",
    hqCity: "Cary, NC",
    foundedYear: 1991,
    strategy: "innovator",
    startingCash: 8000000,              // $80K
    startingStaffCount: 3,
    startingReputation: 8,
    preferredGenres: ["shooter", "action", "battle_royale"],
    backstory: "Tim's making shareware from his bedroom. The engine will eat the industry before the games do.",
  },
  {
    id: "comp_blizzard",
    name: "Blizzard Entertainment",
    founderName: "Mike Morhaime",
    hqCity: "Irvine, CA",
    foundedYear: 1991,
    strategy: "prestige",
    startingCash: 20000000,             // $200K
    startingStaffCount: 5,
    startingReputation: 10,
    preferredGenres: ["rpg", "strategy", "mmo"],
    backstory: "Three UCLA grads. Ship-when-it's-ready discipline. Will make some of the most-played PC games ever.",
    parentPublisherId: "pub_activision",
  },
  {
    id: "comp_insomniac",
    name: "Insomniac Games",
    founderName: "Ted Price",
    hqCity: "Burbank, CA",
    foundedYear: 1994,
    strategy: "blockbuster",
    startingCash: 25000000,             // $250K
    startingStaffCount: 5,
    startingReputation: 12,
    preferredGenres: ["platformer", "shooter", "action"],
    backstory: "Started as Xtreme Software. Found their voice with playful platformers and precision shooters.",
    parentPublisherId: "pub_sony",
  },
  {
    id: "comp_remedy",
    name: "Remedy Entertainment",
    founderName: "Sami Järvi",
    hqCity: "Espoo, FI",
    foundedYear: 1995,
    strategy: "prestige",
    startingCash: 15000000,             // $150K
    startingStaffCount: 4,
    startingReputation: 10,
    preferredGenres: ["action", "horror", "adventure"],
    backstory: "Finnish demoscene. Cinematic bullet-time. Every game is more film than game and they like it.",
  },
  {
    id: "comp_bioware",
    name: "BioWare",
    founderName: "Ray Muzyka",
    hqCity: "Edmonton, CA",
    foundedYear: 1995,
    strategy: "prestige",
    startingCash: 20000000,             // $200K
    startingStaffCount: 5,
    startingReputation: 12,
    preferredGenres: ["rpg", "adventure"],
    backstory: "Two doctors and an engineer making story-first CRPGs. About to redefine what RPG dialogue means.",
    parentPublisherId: "pub_ea",
  },
  {
    id: "comp_valve",
    name: "Valve",
    founderName: "Gabe Newell",
    hqCity: "Bellevue, WA",
    foundedYear: 1996,
    strategy: "innovator",
    startingCash: 300000000,            // $3M — ex-Microsoft stock money
    startingStaffCount: 8,
    startingReputation: 20,
    preferredGenres: ["shooter", "puzzle", "action"],
    backstory: "Ex-Microsoft engineers. Flat org chart. No deadlines. Will ship the Half-Life that eats FPS history.",
  },
  {
    id: "comp_treyarch",
    name: "Treyarch",
    founderName: "Peter Akemann",
    hqCity: "Santa Monica, CA",
    foundedYear: 1996,
    strategy: "volume",
    startingCash: 25000000,             // $250K
    startingStaffCount: 6,
    startingReputation: 12,
    preferredGenres: ["shooter", "action"],
    backstory: "Work-for-hire shooter shop. Annual cadence. Will become one of the bedrocks of live service.",
    parentPublisherId: "pub_activision",
  },
  {
    id: "comp_larian",
    name: "Larian Studios",
    founderName: "Swen Vincke",
    hqCity: "Ghent, BE",
    foundedYear: 1996,
    strategy: "prestige",
    startingCash: 10000000,             // $100K
    startingStaffCount: 4,
    startingReputation: 8,
    preferredGenres: ["rpg", "strategy"],
    backstory: "Belgian CRPG lifers. Swen has been trying to ship Divinity since before it was called that. Patient.",
  },
  {
    id: "comp_gearbox",
    name: "Gearbox Software",
    founderName: "Randy Pitchford",
    hqCity: "Frisco, TX",
    foundedYear: 1999,
    strategy: "blockbuster",
    startingCash: 50000000,             // $500K
    startingStaffCount: 8,
    startingReputation: 15,
    preferredGenres: ["shooter", "rpg"],
    backstory: "Ex-Rebel Boat Rocker crew. Pitchford's a showman. Loot-shooter reinvention coming in a decade.",
  },

  // ============ MODERN AAA (2001-2009) ============
  {
    id: "comp_bethesda_studios",
    name: "Bethesda Game Studios",
    founderName: "Todd Howard",
    hqCity: "Rockville, MD",
    foundedYear: 2001,
    strategy: "blockbuster",
    startingCash: 200000000,            // $2M — backed by Softworks
    startingStaffCount: 15,
    startingReputation: 25,
    preferredGenres: ["rpg", "adventure"],
    backstory: "Carved out of Bethesda Softworks to focus on first-party megaprojects. Open-world-first, always.",
    parentPublisherId: "pub_bethesda",
  },
  {
    id: "comp_cdpr",
    name: "CD Projekt Red",
    founderName: "Marcin Iwiński",
    hqCity: "Warsaw, PL",
    foundedYear: 2002,
    strategy: "prestige",
    startingCash: 30000000,             // $300K
    startingStaffCount: 8,
    startingReputation: 10,
    preferredGenres: ["rpg", "adventure"],
    backstory: "Polish localizers turned developers. The Slavic-fantasy itch nobody else was scratching.",
  },
  {
    id: "comp_hi_rez",
    name: "Hi-Rez Studios",
    founderName: "Todd Harris",
    hqCity: "Atlanta, GA",
    foundedYear: 2005,
    strategy: "volume",
    startingCash: 50000000,             // $500K
    startingStaffCount: 10,
    startingReputation: 12,
    preferredGenres: ["moba", "shooter"],
    backstory: "F2P-first. Season-after-season content cadence. Live-service is in the DNA from day one.",
  },

  // ============ INDIE RENAISSANCE / MODERN (2009+) ============
  {
    id: "comp_supergiant",
    name: "Supergiant Games",
    founderName: "Amir Rao",
    hqCity: "San Francisco, CA",
    foundedYear: 2009,
    strategy: "indie",
    startingCash: 10000000,             // $100K
    startingStaffCount: 7,
    startingReputation: 10,
    preferredGenres: ["rpg", "roguelike", "adventure"],
    backstory: "Ex-EA refugees. Small by design. Every release is hand-crafted from Darren Korb's soundtrack out.",
  },
  {
    id: "comp_respawn",
    name: "Respawn Entertainment",
    founderName: "Vince Zampella",
    hqCity: "Los Angeles, CA",
    foundedYear: 2010,
    strategy: "blockbuster",
    startingCash: 500000000,            // $5M — ex-Infinity Ward, well-funded
    startingStaffCount: 20,
    startingReputation: 35,
    preferredGenres: ["shooter", "battle_royale", "action"],
    backstory: "Founded by Zampella and West after the Infinity Ward split. Shooter veterans with a chip to prove.",
    parentPublisherId: "pub_ea",
  },
  {
    id: "comp_mihoyo",
    name: "miHoYo",
    founderName: "Cai Haoyu",
    hqCity: "Shanghai, CN",
    foundedYear: 2012,
    strategy: "innovator",
    startingCash: 20000000,             // $200K
    startingStaffCount: 10,
    startingReputation: 10,
    preferredGenres: ["rpg", "mmo", "action"],
    backstory: "Three Shanghai Jiao Tong grads. Anime-stylized action-RPGs, global distribution via gacha live-service.",
  },
];
