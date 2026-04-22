import type { Theme } from "../types/market";

// Themes pair with genres to produce synergy multipliers on review scores.
// High affinity (>=0.75) combos feel like "a match made in heaven" (RPG + Fantasy).
// Mid affinity (~0.5) is neutral. Low affinity (<=0.3) caps quality ceiling.

export const THEMES: Theme[] = [
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magic, dragons, kingdoms, and mythic heroes.",
    emergedYear: 1980,
    peakYear: 2002,
    genreAffinity: {
      rpg: 0.95, adventure: 0.85, strategy: 0.7, action: 0.7,
      mmo: 0.95, metroidvania: 0.75, card: 0.8, moba: 0.8,
      platformer: 0.6, roguelike: 0.85, fighting: 0.55, puzzle: 0.45,
    },
  },
  {
    id: "sci_fi",
    name: "Sci-Fi",
    description: "Spaceships, alien worlds, and far futures.",
    emergedYear: 1980,
    peakYear: 2008,
    genreAffinity: {
      shooter: 0.9, strategy: 0.85, rpg: 0.8, action: 0.75,
      adventure: 0.75, simulation: 0.7, mmo: 0.8, survival: 0.75,
      horror: 0.7, metroidvania: 0.85, roguelike: 0.75, racing: 0.6,
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon dystopias, hackers, and megacorps.",
    emergedYear: 1988,
    peakYear: 2020,
    genreAffinity: {
      rpg: 0.9, shooter: 0.85, adventure: 0.8, action: 0.8,
      stealth: 0.9, horror: 0.7, strategy: 0.55, sandbox: 0.75,
    },
  },
  {
    id: "post_apocalyptic",
    name: "Post-Apocalyptic",
    description: "Wastelands, mutants, and civilization's ruins.",
    emergedYear: 1988,
    peakYear: 2015,
    genreAffinity: {
      rpg: 0.85, shooter: 0.85, survival: 0.95, action: 0.75,
      horror: 0.8, sandbox: 0.75, strategy: 0.65, stealth: 0.7,
      roguelike: 0.7,
    },
  },
  {
    id: "horror",
    name: "Horror",
    description: "Haunted settings, supernatural dread.",
    emergedYear: 1982,
    peakYear: 2017,
    genreAffinity: {
      horror: 1.0, adventure: 0.85, action: 0.6, rpg: 0.55,
      survival: 0.9, stealth: 0.75, puzzle: 0.6,
    },
  },
  {
    id: "military",
    name: "Military",
    description: "Modern, historical, or near-future warfare.",
    emergedYear: 1980,
    peakYear: 2012,
    genreAffinity: {
      shooter: 0.95, strategy: 0.9, action: 0.75, simulation: 0.8,
      stealth: 0.8, rpg: 0.5,
    },
  },
  {
    id: "wwii",
    name: "WWII",
    description: "The Second World War, from D-Day to the Pacific.",
    emergedYear: 1980,
    peakYear: 2003,
    genreAffinity: {
      shooter: 0.95, strategy: 0.9, simulation: 0.75, action: 0.7,
      stealth: 0.6,
    },
  },
  {
    id: "modern_warfare",
    name: "Modern Warfare",
    description: "Contemporary military conflicts and special ops.",
    emergedYear: 2002,
    peakYear: 2012,
    genreAffinity: {
      shooter: 1.0, strategy: 0.7, action: 0.7, stealth: 0.8,
      simulation: 0.7,
    },
  },
  {
    id: "space",
    name: "Space",
    description: "Exploration, combat, and commerce among the stars.",
    emergedYear: 1980,
    peakYear: 2016,
    genreAffinity: {
      strategy: 0.9, rpg: 0.75, shooter: 0.8, simulation: 0.9,
      adventure: 0.7, survival: 0.7, sandbox: 0.8, action: 0.6,
    },
  },
  {
    id: "pirates",
    name: "Pirates",
    description: "Ships, plunder, and the age of sail.",
    emergedYear: 1987,
    peakYear: 2003,
    genreAffinity: {
      adventure: 0.85, action: 0.8, rpg: 0.7, strategy: 0.7,
      sandbox: 0.8, simulation: 0.6,
    },
  },
  {
    id: "medieval",
    name: "Medieval",
    description: "Knights, castles, and feudal realms.",
    emergedYear: 1981,
    peakYear: 2013,
    genreAffinity: {
      rpg: 0.85, strategy: 0.9, action: 0.75, simulation: 0.7,
      sandbox: 0.7, adventure: 0.75,
    },
  },
  {
    id: "wild_west",
    name: "Wild West",
    description: "Frontier America, outlaws, and cowboys.",
    emergedYear: 1985,
    peakYear: 2018,
    genreAffinity: {
      adventure: 0.85, shooter: 0.85, action: 0.8, rpg: 0.75,
      sandbox: 0.7, strategy: 0.5,
    },
  },
  {
    id: "noir",
    name: "Noir",
    description: "Detective stories of corruption and shadows.",
    emergedYear: 1988,
    peakYear: 2011,
    genreAffinity: {
      adventure: 0.9, visual_novel: 0.85, rpg: 0.7, stealth: 0.65,
      puzzle: 0.6,
    },
  },
  {
    id: "mythology",
    name: "Mythology",
    description: "Gods, legends, and ancient epics.",
    emergedYear: 1982,
    peakYear: 2005,
    genreAffinity: {
      rpg: 0.85, action: 0.85, adventure: 0.8, strategy: 0.7,
      fighting: 0.6, card: 0.7,
    },
  },
  {
    id: "steampunk",
    name: "Steampunk",
    description: "Brass, gears, and Victorian machines.",
    emergedYear: 1990,
    peakYear: 2013,
    genreAffinity: {
      rpg: 0.8, adventure: 0.85, strategy: 0.7, action: 0.7,
      metroidvania: 0.8, puzzle: 0.65,
    },
  },
  {
    id: "school",
    name: "School Life",
    description: "Classrooms, friendships, and teenage drama.",
    emergedYear: 1985,
    peakYear: 2012,
    genreAffinity: {
      visual_novel: 0.95, rpg: 0.75, simulation: 0.7, adventure: 0.7,
      rhythm: 0.7,
    },
  },
  {
    id: "detective",
    name: "Detective",
    description: "Mystery-solving, interrogation, and deduction.",
    emergedYear: 1981,
    peakYear: 2010,
    genreAffinity: {
      adventure: 0.95, visual_novel: 0.85, puzzle: 0.8, rpg: 0.65,
      stealth: 0.5,
    },
  },
  {
    id: "superhero",
    name: "Superhero",
    description: "Masked vigilantes and world-saving powers.",
    emergedYear: 1989,
    peakYear: 2016,
    genreAffinity: {
      action: 0.9, fighting: 0.85, adventure: 0.75, rpg: 0.7,
      shooter: 0.6, moba: 0.7, mmo: 0.6,
    },
  },
  {
    id: "zombie",
    name: "Zombie",
    description: "Shambling hordes, outbreaks, and survival.",
    emergedYear: 1993,
    peakYear: 2014,
    genreAffinity: {
      survival: 0.95, shooter: 0.9, horror: 0.95, action: 0.8,
      strategy: 0.65, rpg: 0.6,
    },
  },
  {
    id: "vampire",
    name: "Vampire",
    description: "Blood, immortality, and gothic romance.",
    emergedYear: 1990,
    peakYear: 2011,
    genreAffinity: {
      rpg: 0.8, horror: 0.85, adventure: 0.75, action: 0.7,
      visual_novel: 0.7,
    },
  },
  {
    id: "racing_theme",
    name: "Racing",
    description: "Street racing, motorsport, and high-speed culture.",
    emergedYear: 1980,
    peakYear: 2005,
    genreAffinity: {
      racing: 1.0, simulation: 0.8, action: 0.5, sports: 0.7,
    },
  },
  {
    id: "sports_theme",
    name: "Sports",
    description: "Athletic competition across disciplines.",
    emergedYear: 1980,
    peakYear: 2012,
    genreAffinity: {
      sports: 1.0, simulation: 0.7, rpg: 0.5, strategy: 0.55,
      tycoon: 0.7,
    },
  },
  {
    id: "urban",
    name: "Urban",
    description: "Modern city streets, crime, and hustle.",
    emergedYear: 1997,
    peakYear: 2014,
    genreAffinity: {
      action: 0.85, rpg: 0.75, shooter: 0.8, sandbox: 0.9,
      racing: 0.75, stealth: 0.7, adventure: 0.7,
    },
  },
  {
    id: "nature",
    name: "Nature",
    description: "Wildlife, wilderness, and the natural world.",
    emergedYear: 1990,
    peakYear: 2018,
    genreAffinity: {
      simulation: 0.9, adventure: 0.7, survival: 0.85, puzzle: 0.6,
      educational: 0.85, sandbox: 0.75,
    },
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Non-representational, pure mechanics and form.",
    emergedYear: 1980,
    peakYear: 2014,
    genreAffinity: {
      puzzle: 0.95, rhythm: 0.85, platformer: 0.6, roguelike: 0.65,
    },
  },
  {
    id: "life_sim",
    name: "Everyday Life",
    description: "Daily routines, relationships, and mundane beauty.",
    emergedYear: 1989,
    peakYear: 2014,
    genreAffinity: {
      simulation: 0.95, visual_novel: 0.8, rpg: 0.65, adventure: 0.7,
      sandbox: 0.7,
    },
  },
  {
    id: "business",
    name: "Business",
    description: "Commerce, corporate climbing, and capital.",
    emergedYear: 1990,
    peakYear: 2003,
    genreAffinity: {
      tycoon: 1.0, strategy: 0.85, simulation: 0.85, rpg: 0.5,
    },
  },
  {
    id: "historical",
    name: "Historical",
    description: "Real past events and civilizations.",
    emergedYear: 1982,
    peakYear: 2008,
    genreAffinity: {
      strategy: 0.95, rpg: 0.75, simulation: 0.85, adventure: 0.7,
      action: 0.6, educational: 0.9,
    },
  },
  {
    id: "ninja",
    name: "Ninja",
    description: "Shadow warriors and acrobatic stealth.",
    emergedYear: 1984,
    peakYear: 2004,
    genreAffinity: {
      action: 0.9, stealth: 0.95, platformer: 0.75, fighting: 0.75,
      rpg: 0.65,
    },
  },
  {
    id: "samurai",
    name: "Samurai",
    description: "Honor, steel, and feudal Japan.",
    emergedYear: 1986,
    peakYear: 2020,
    genreAffinity: {
      action: 0.9, rpg: 0.85, fighting: 0.8, strategy: 0.75,
      stealth: 0.7,
    },
  },
  {
    id: "alien",
    name: "Alien",
    description: "Invasions, first contact, and xenobiology.",
    emergedYear: 1981,
    peakYear: 2005,
    genreAffinity: {
      shooter: 0.9, strategy: 0.85, horror: 0.8, adventure: 0.7,
      action: 0.75,
    },
  },
  {
    id: "comedy",
    name: "Comedy",
    description: "Humor, parody, and slapstick.",
    emergedYear: 1985,
    peakYear: 2009,
    genreAffinity: {
      adventure: 0.85, platformer: 0.7, rpg: 0.6, puzzle: 0.6,
      visual_novel: 0.75, action: 0.55,
    },
  },
  {
    id: "romance",
    name: "Romance",
    description: "Love stories and emotional connections.",
    emergedYear: 1985,
    peakYear: 2014,
    genreAffinity: {
      visual_novel: 0.95, rpg: 0.65, adventure: 0.75, simulation: 0.7,
    },
  },
  {
    id: "stealth_spy",
    name: "Spy Thriller",
    description: "Espionage, gadgets, and double-crosses.",
    emergedYear: 1995,
    peakYear: 2008,
    genreAffinity: {
      stealth: 0.95, action: 0.8, adventure: 0.75, shooter: 0.7,
      strategy: 0.5,
    },
  },
  {
    id: "dystopia",
    name: "Dystopia",
    description: "Oppressive regimes and fading freedoms.",
    emergedYear: 1988,
    peakYear: 2016,
    genreAffinity: {
      rpg: 0.8, adventure: 0.85, stealth: 0.8, shooter: 0.75,
      strategy: 0.7, horror: 0.6,
    },
  },

  // ============================================================
  // Gap-filler themes (biomes & high-concept hooks)
  // ============================================================
  {
    id: "underwater",
    name: "Underwater",
    description: "Deep-sea exploration, reefs, and oceanic mystery.",
    emergedYear: 1989,
    peakYear: 2018,
    genreAffinity: {
      adventure: 0.85, survival: 0.85, simulation: 0.75, horror: 0.75,
      rpg: 0.7, puzzle: 0.6, action: 0.6, sandbox: 0.7, metroidvania: 0.7,
    },
  },
  {
    id: "arctic",
    name: "Arctic",
    description: "Frozen expeditions, whiteout storms, and isolation.",
    emergedYear: 1995,
    peakYear: 2015,
    genreAffinity: {
      survival: 0.95, adventure: 0.85, horror: 0.75, simulation: 0.7,
      strategy: 0.6, rpg: 0.65, action: 0.55, stealth: 0.55,
    },
  },
  {
    id: "desert_arabian",
    name: "Desert Arabian",
    description: "Bazaars, dune seas, and Thousand-and-One-Nights adventure.",
    emergedYear: 1989,
    peakYear: 2007,
    genreAffinity: {
      adventure: 0.9, rpg: 0.8, action: 0.8, platformer: 0.75,
      stealth: 0.75, strategy: 0.65, puzzle: 0.6, metroidvania: 0.65,
    },
  },
  {
    id: "jungle",
    name: "Jungle",
    description: "Rainforest temples, vine swings, and feral wildlife.",
    emergedYear: 1982,
    peakYear: 2001,
    genreAffinity: {
      adventure: 0.9, survival: 0.85, platformer: 0.75, action: 0.75,
      rpg: 0.6, simulation: 0.55, shooter: 0.6, metroidvania: 0.7,
    },
  },
  {
    id: "prehistoric",
    name: "Prehistoric",
    description: "Dinosaurs, cavemen, and the primeval world.",
    emergedYear: 1993,
    peakYear: 1998,
    genreAffinity: {
      survival: 0.85, action: 0.8, adventure: 0.8, simulation: 0.7,
      strategy: 0.65, educational: 0.85, sandbox: 0.7, shooter: 0.65,
    },
  },
  {
    id: "ancient_egypt",
    name: "Ancient Egypt",
    description: "Pyramids, pharaohs, and tomb-robbing archaeology.",
    emergedYear: 1985,
    peakYear: 2005,
    genreAffinity: {
      adventure: 0.9, strategy: 0.8, puzzle: 0.8, rpg: 0.75,
      action: 0.65, simulation: 0.7, educational: 0.8, metroidvania: 0.6,
    },
  },
  {
    id: "viking",
    name: "Viking",
    description: "Longships, Norse myth, and raiding the cold north.",
    emergedYear: 1990,
    peakYear: 2021,
    genreAffinity: {
      action: 0.9, rpg: 0.85, strategy: 0.8, adventure: 0.8,
      fighting: 0.65, survival: 0.75, sandbox: 0.7, roguelike: 0.65,
    },
  },
  {
    id: "heist",
    name: "Heist",
    description: "Crew planning, infiltration, and the perfect score.",
    emergedYear: 1998,
    peakYear: 2013,
    genreAffinity: {
      stealth: 0.95, action: 0.8, adventure: 0.75, strategy: 0.7,
      shooter: 0.7, sandbox: 0.7, puzzle: 0.65, simulation: 0.6,
    },
  },
  {
    id: "time_travel",
    name: "Time Travel",
    description: "Paradoxes, parallel timelines, and historic set-pieces.",
    emergedYear: 1988,
    peakYear: 2015,
    genreAffinity: {
      adventure: 0.9, puzzle: 0.85, rpg: 0.75, visual_novel: 0.7,
      platformer: 0.65, metroidvania: 0.7, strategy: 0.55, action: 0.6,
    },
  },
  {
    id: "kaiju",
    name: "Kaiju",
    description: "Skyscraper-tall monsters and city-leveling battles.",
    emergedYear: 1985,
    peakYear: 2019,
    genreAffinity: {
      action: 0.85, fighting: 0.85, shooter: 0.75, sandbox: 0.75,
      simulation: 0.6, strategy: 0.6, tycoon: 0.5,
    },
  },

  // ============================================================
  // Era / cultural nostalgia themes
  // ============================================================
  {
    id: "synthwave_80s",
    name: "80s Synthwave",
    description: "Neon sunsets, chrome cars, and retro-future cool.",
    emergedYear: 2011,
    peakYear: 2019,
    genreAffinity: {
      action: 0.85, shooter: 0.8, racing: 0.85, roguelike: 0.8,
      platformer: 0.7, rhythm: 0.8, puzzle: 0.55,
    },
  },
  {
    id: "cold_war",
    name: "Cold War",
    description: "Iron Curtain intrigue, spy games, and nuclear brinkmanship.",
    emergedYear: 1987,
    peakYear: 2010,
    genreAffinity: {
      shooter: 0.85, stealth: 0.9, strategy: 0.85, action: 0.7,
      adventure: 0.7, simulation: 0.7, rpg: 0.6,
    },
  },
  {
    id: "victorian",
    name: "Victorian",
    description: "Gaslight London, gothic drawing-rooms, and proper terror.",
    emergedYear: 1990,
    peakYear: 2015,
    genreAffinity: {
      adventure: 0.9, horror: 0.8, rpg: 0.75, puzzle: 0.75,
      visual_novel: 0.75, strategy: 0.6, stealth: 0.65, action: 0.6,
    },
  },
  {
    id: "renaissance",
    name: "Renaissance",
    description: "Italian city-states, masters of art, and political intrigue.",
    emergedYear: 1996,
    peakYear: 2010,
    genreAffinity: {
      adventure: 0.85, rpg: 0.75, strategy: 0.85, action: 0.7,
      stealth: 0.75, simulation: 0.7, educational: 0.75, tycoon: 0.6,
    },
  },
  {
    id: "roaring_20s",
    name: "Roaring 20s",
    description: "Jazz, speakeasies, and Art Deco glamour.",
    emergedYear: 1995,
    peakYear: 2013,
    genreAffinity: {
      adventure: 0.85, shooter: 0.7, rpg: 0.7, visual_novel: 0.75,
      stealth: 0.7, action: 0.65, tycoon: 0.6, rhythm: 0.55,
    },
  },
  {
    id: "wuxia",
    name: "Wuxia",
    description: "Flying swordsmen, inner qi, and jianghu honor.",
    emergedYear: 1999,
    peakYear: 2021,
    genreAffinity: {
      action: 0.9, rpg: 0.9, fighting: 0.85, adventure: 0.75,
      strategy: 0.7, mmo: 0.8, stealth: 0.65,
    },
  },
  {
    id: "ancient_rome",
    name: "Ancient Rome",
    description: "Legions, gladiators, and the grandeur of empire.",
    emergedYear: 1985,
    peakYear: 2008,
    genreAffinity: {
      strategy: 0.95, rpg: 0.75, action: 0.75, simulation: 0.8,
      tycoon: 0.75, educational: 0.85, fighting: 0.7, sandbox: 0.6,
    },
  },
  {
    id: "hollywood_golden",
    name: "Hollywood Golden Age",
    description: "Studio-era starlets, red carpets, and silver-screen glamour.",
    emergedYear: 2000,
    peakYear: 2015,
    genreAffinity: {
      adventure: 0.8, visual_novel: 0.85, simulation: 0.75, tycoon: 0.8,
      puzzle: 0.6, rpg: 0.6, rhythm: 0.5,
    },
  },

  // ============================================================
  // Grounded / slice-of-life themes
  // ============================================================
  {
    id: "cooking",
    name: "Cooking",
    description: "Kitchens, restaurants, and the culinary grind.",
    emergedYear: 1994,
    peakYear: 2019,
    genreAffinity: {
      simulation: 0.95, tycoon: 0.85, puzzle: 0.75, rhythm: 0.65,
      visual_novel: 0.65, adventure: 0.55, educational: 0.75, card: 0.5,
    },
  },
  {
    id: "music_rockstar",
    name: "Music & Rockstar",
    description: "Garage bands, sold-out arenas, and the road to fame.",
    emergedYear: 1998,
    peakYear: 2009,
    genreAffinity: {
      rhythm: 0.95, simulation: 0.75, tycoon: 0.7, rpg: 0.6,
      visual_novel: 0.7, adventure: 0.6, sports: 0.45,
    },
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Runways, styling, and the business of couture.",
    emergedYear: 1995,
    peakYear: 2012,
    genreAffinity: {
      simulation: 0.85, tycoon: 0.85, visual_novel: 0.75, puzzle: 0.55,
      rpg: 0.55, educational: 0.5,
    },
  },
  {
    id: "pastoral",
    name: "Pastoral",
    description: "Farms, small towns, and the cozy countryside.",
    emergedYear: 1996,
    peakYear: 2017,
    genreAffinity: {
      simulation: 0.95, rpg: 0.8, sandbox: 0.85, visual_novel: 0.75,
      adventure: 0.65, educational: 0.6, tycoon: 0.7, puzzle: 0.5,
    },
  },
  {
    id: "political_thriller",
    name: "Political Thriller",
    description: "Backroom deals, leaks, and the mechanics of power.",
    emergedYear: 1995,
    peakYear: 2015,
    genreAffinity: {
      adventure: 0.85, stealth: 0.8, strategy: 0.85, rpg: 0.75,
      visual_novel: 0.8, shooter: 0.65, simulation: 0.7,
    },
  },
  {
    id: "courtroom",
    name: "Courtroom",
    description: "Trials, cross-examinations, and the thrill of objection.",
    emergedYear: 2001,
    peakYear: 2014,
    genreAffinity: {
      visual_novel: 0.95, puzzle: 0.85, adventure: 0.85, rpg: 0.55,
      simulation: 0.5,
    },
  },
  {
    id: "medical",
    name: "Medical",
    description: "ER triage, surgery, and the business of healing.",
    emergedYear: 1994,
    peakYear: 2011,
    genreAffinity: {
      simulation: 0.9, tycoon: 0.85, puzzle: 0.75, visual_novel: 0.7,
      strategy: 0.65, rpg: 0.55, educational: 0.85,
    },
  },
];

export const THEME_BY_ID: Record<string, Theme> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
);
