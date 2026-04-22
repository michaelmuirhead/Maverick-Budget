import type { GenreId } from "./genre";

export type ThemeId =
  | "fantasy" | "sci_fi" | "cyberpunk" | "post_apocalyptic" | "horror"
  | "military" | "wwii" | "modern_warfare" | "space" | "pirates"
  | "medieval" | "wild_west" | "noir" | "mythology" | "steampunk"
  | "school" | "detective" | "superhero" | "zombie" | "vampire"
  | "racing_theme" | "sports_theme" | "urban" | "nature" | "abstract"
  | "life_sim" | "business" | "historical" | "ninja" | "samurai"
  | "alien" | "comedy" | "romance" | "stealth_spy" | "dystopia"
  // --- Expansion themes (2026-04) ---
  // Gap-fillers: biomes & high-concept hooks
  | "underwater" | "arctic" | "desert_arabian" | "jungle" | "prehistoric"
  | "ancient_egypt" | "viking" | "heist" | "time_travel" | "kaiju"
  // Era / cultural nostalgia
  | "synthwave_80s" | "cold_war" | "victorian" | "renaissance" | "roaring_20s"
  | "wuxia" | "ancient_rome" | "hollywood_golden"
  // Grounded / slice-of-life
  | "cooking" | "music_rockstar" | "fashion" | "pastoral"
  | "political_thriller" | "courtroom" | "medical";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  emergedYear: number;
  peakYear: number; // when the theme is hottest
  // Hidden synergy scores with genres (0-1)
  genreAffinity: Partial<Record<GenreId, number>>;
}

// ---- Platform ----

export type PlatformKind =
  | "pc" | "home_console" | "handheld" | "arcade"
  | "mobile" | "vr" | "cloud" | "neural";

export type PlatformManufacturer =
  | "atari" | "nintendo" | "sega" | "sony" | "microsoft" | "apple"
  | "google" | "commodore" | "meta" | "valve" | "nvidia"
  | "pcopen" | "mavsynth";

export interface Platform {
  id: string;
  name: string;
  kind: PlatformKind;
  manufacturer: PlatformManufacturer;
  launchYear: number;    // year platform becomes available
  discontinuedYear: number; // when platform is pulled
  peakYear: number;      // when market share peaks
  // Base install-base curve (millions). Market share modeled dynamically.
  peakInstallBase: number;
  // Dev kit cost
  devKitCost: number;
  // Certification/royalty cut (0-1)
  royaltyRate: number;
  // Which era this platform belongs to
  era: string;
  // Tech requirements — minimum graphics/audio/network tier to develop for
  minGraphicsTier: number;
  minAudioTier: number;
  minNetworkTier: number;
  // Audience skew
  audienceProfile: {
    kids: number;
    teens: number;
    young_adults: number;
    mature: number;
  };
  // Genre affinity on this platform
  genreAffinity: Partial<Record<GenreId, number>>;
}
