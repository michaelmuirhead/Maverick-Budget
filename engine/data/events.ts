import type { EraId } from "../types/core";

// Events fire from the tick dispatcher based on conditions and probability.
// Scheduled events fire on specific dates (platform launches, trade shows).
// Random events fire based on weights and preconditions.

export type EventCategory =
  | "industry"        // broad market/platform events
  | "studio"          // things that happen to the player studio
  | "staff"           // HR events
  | "competitor"      // rival actions
  | "financial"       // economy, cash crunches
  | "cultural";       // external world events affecting gaming

export type EventSeverity = "flavor" | "minor" | "moderate" | "major" | "landmark";

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  // Effects applied when chosen — resolved by events system
  effects: {
    cash?: number;              // cents delta
    reputation?: number;        // 0-100 delta
    moraleAll?: number;         // all staff
    hypeBoostForProjectId?: boolean;
    unlockFlag?: string;
    spawnCompetitor?: boolean;
  };
}

export interface ScheduledEventDef {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  // Exact date (month, day) — year inferred from era/schedule
  month: number;
  day: number;
  // Which years this event fires in (inclusive range)
  firstYear: number;
  lastYear: number;
  // How many times per year (usually 1)
  perYear: number;
  // Optional era filter
  eraIds?: EraId[];
  // Choices if this is an interactive event
  choices?: EventChoice[];
}

export interface RandomEventDef {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  // Base daily probability (0-1). Conditions scale this up/down.
  baseProbability: number;
  // Precondition flags that must be true (checked by events system)
  conditions?: {
    minYear?: number;
    maxYear?: number;
    minStaffCount?: number;
    minReputation?: number;
    minCash?: number;
    requiresReleasedGame?: boolean;
    requiresActiveProject?: boolean;
  };
  // One-shot? Or can it repeat?
  oneShot: boolean;
  choices?: EventChoice[];
}

// ============ SCHEDULED EVENTS ============
export const SCHEDULED_EVENTS: ScheduledEventDef[] = [
  {
    id: "evt_e3",
    name: "Electronic Entertainment Expo (E3)",
    description: "The biggest gaming trade show. A strong showing spikes hype on announced games.",
    category: "industry",
    severity: "major",
    month: 6,
    day: 11,
    firstYear: 1995,
    lastYear: 2022,
    perYear: 1,
    choices: [
      {
        id: "skip",
        label: "Skip the show",
        description: "Save the marketing budget.",
        effects: {},
      },
      {
        id: "small_booth",
        label: "Small booth ($500K)",
        description: "Modest presence to stay visible.",
        effects: { cash: -50000000, reputation: 1 },
      },
      {
        id: "big_booth",
        label: "Big booth + showcase ($3M)",
        description: "Major presence with a playable demo.",
        effects: { cash: -300000000, reputation: 4 },
      },
      {
        id: "keynote",
        label: "Headline keynote ($10M)",
        description: "You are the story of the show.",
        effects: { cash: -1000000000, reputation: 10 },
      },
    ],
  },
  {
    id: "evt_gdc",
    name: "Game Developers Conference",
    description: "Industry professionals gather. Good for hiring and tech learning.",
    category: "industry",
    severity: "moderate",
    month: 3,
    day: 20,
    firstYear: 1988,
    lastYear: 2045,
    perYear: 1,
    choices: [
      {
        id: "attend",
        label: "Send team ($200K)",
        description: "Knowledge sharing and recruiting leads.",
        effects: { cash: -20000000 },
      },
      {
        id: "sponsor",
        label: "Sponsor conference ($1.5M)",
        description: "Major visibility boosts hiring appeal.",
        effects: { cash: -150000000, reputation: 3 },
      },
      {
        id: "skip",
        label: "Skip it",
        description: "Focus on development.",
        effects: {},
      },
    ],
  },
  {
    id: "evt_gamescom",
    name: "Gamescom",
    description: "European trade show rivaling E3 for consumer reach. The Indie Arena and consumer halls drive massive footfall.",
    category: "industry",
    severity: "major",
    month: 8,
    day: 22,
    firstYear: 2009,
    lastYear: 2045,
    perYear: 1,
    choices: [
      { id: "skip", label: "Skip", description: "Focus elsewhere.", effects: {} },
      {
        id: "press_kit",
        label: "Press kit only ($300K)",
        description: "Send materials to outlets without renting floor space.",
        effects: { cash: -30000000, reputation: 1 },
      },
      {
        id: "booth",
        label: "Booth ($2M)",
        description: "Strong European showing with playable demos.",
        effects: { cash: -200000000, reputation: 3 },
      },
      {
        id: "showcase",
        label: "Opening Night showcase ($5M)",
        description: "Headline the consumer-facing keynote — every in-development game gets a hype injection.",
        effects: { cash: -500000000, reputation: 6 },
      },
    ],
  },
  {
    id: "evt_goty_awards",
    name: "Game of the Year Awards",
    description: "Annual industry awards ceremony. Nominations boost sales.",
    category: "industry",
    severity: "major",
    month: 12,
    day: 10,
    firstYear: 1988,
    lastYear: 2045,
    perYear: 1,
  },
  {
    id: "evt_goty_submission",
    name: "GOTY Awards Submission Window",
    description: "The awards submission window is open. How aggressively do you campaign for nominations?",
    category: "industry",
    severity: "moderate",
    month: 11,
    day: 1,
    firstYear: 1988,
    lastYear: 2045,
    perYear: 1,
    choices: [
      {
        id: "skip",
        label: "Skip submission",
        description: "Save the money. You'll be considered on merit alone — if at all.",
        effects: {},
      },
      {
        id: "standard",
        label: "Standard submission ($100K)",
        description: "File the paperwork, send screeners. Baseline visibility.",
        effects: { cash: -10000000 },
      },
      {
        id: "fyc_campaign",
        label: '"For Your Consideration" campaign ($800K)',
        description: "Trade-press ads, junket screeners, voter outreach. A real tilt at the field.",
        effects: { cash: -80000000, reputation: 2 },
      },
      {
        id: "major_push",
        label: "Major awards push ($3M)",
        description: "Full Hollywood-style campaign. Voters will remember your games on ballot day.",
        effects: { cash: -300000000, reputation: 4 },
      },
    ],
  },
  {
    id: "evt_tgs",
    name: "Tokyo Game Show",
    description: "Japan's major industry showcase. The path to the Japanese consumer runs through Makuhari Messe.",
    category: "industry",
    severity: "moderate",
    month: 9,
    day: 15,
    firstYear: 1996,
    lastYear: 2045,
    perYear: 1,
    choices: [
      { id: "skip", label: "Skip", description: "Western markets are your focus.", effects: {} },
      {
        id: "small_booth",
        label: "Small booth ($800K)",
        description: "Modest presence to test the waters.",
        effects: { cash: -80000000, reputation: 1 },
      },
      {
        id: "mainstage",
        label: "Mainstage presentation ($2.5M)",
        description: "Major showcase with localized demos and Japanese press junket.",
        effects: { cash: -250000000, reputation: 4 },
      },
      {
        id: "jp_partnership",
        label: "Japanese distribution partnership ($1.5M)",
        description: "Cut a deal with a local distributor. Boosts visibility on every game currently selling.",
        effects: { cash: -150000000, reputation: 2 },
      },
    ],
  },
  {
    id: "evt_holiday_rush",
    name: "Holiday Shopping Rush",
    description: "Games released in Q4 see sales spikes. But competition is fierce.",
    category: "industry",
    severity: "minor",
    month: 11,
    day: 15,
    firstYear: 1980,
    lastYear: 2045,
    perYear: 1,
    choices: [
      {
        id: "normal",
        label: "Ride the wave",
        description: "No extra spend — let the seasonal lift do its thing.",
        effects: {},
      },
      {
        id: "tv_burst",
        label: "Holiday TV burst ($1.5M)",
        description: "Targeted ad spend across the gift-buying weeks. Active sales projections climb.",
        effects: { cash: -150000000 },
      },
      {
        id: "massive_push",
        label: "All-channel holiday push ($5M)",
        description: "TV, billboards, retail end-caps. You will not be ignored at Christmas.",
        effects: { cash: -500000000, reputation: 1 },
      },
    ],
  },
];

// ============ AWARDS ============
// Award display names live in `engine/types/awards.ts` (typed against the
// canonical `AwardCategory` union). Re-exported from `engine/index.ts`.

// ============ RANDOM EVENTS ============
export const RANDOM_EVENTS: RandomEventDef[] = [
  {
    id: "evt_staff_raise_request",
    name: "Raise Request",
    description: "A staff member asks for a raise, citing market rates.",
    category: "staff",
    severity: "minor",
    baseProbability: 0.003,
    conditions: { minStaffCount: 3 },
    oneShot: false,
    choices: [
      { id: "grant", label: "Grant the raise (+15%)", description: "Loyalty boost.", effects: {} },
      { id: "partial", label: "Partial raise (+7%)", description: "Compromise.", effects: {} },
      { id: "deny", label: "Deny", description: "Might resign.", effects: {} },
    ],
  },
  {
    id: "evt_poaching_offer",
    name: "Poaching Offer",
    description: "A competitor offers one of your staff a lucrative contract.",
    category: "staff",
    severity: "moderate",
    baseProbability: 0.002,
    conditions: { minStaffCount: 4, minYear: 1984 },
    oneShot: false,
    choices: [
      { id: "counter", label: "Counter-offer", description: "Match or beat the offer.", effects: {} },
      { id: "let_go", label: "Let them walk", description: "Keep the budget.", effects: {} },
      { id: "plead", label: "Personal plea", description: "Appeal to loyalty.", effects: {} },
    ],
  },
  {
    id: "evt_burnout_incident",
    name: "Burnout Incident",
    description: "A staff member is visibly crashing. Hospital visit likely if ignored.",
    category: "staff",
    severity: "moderate",
    baseProbability: 0.001,
    conditions: { minStaffCount: 3 },
    oneShot: false,
    choices: [
      { id: "mandatory_leave", label: "Force mandatory leave", description: "Lose their output but save them.", effects: {} },
      { id: "reduced_hours", label: "Reduced hours", description: "Partial recovery.", effects: {} },
      { id: "ignore", label: "Push through", description: "Risk resignation and reputation hit.", effects: {} },
    ],
  },
  {
    id: "evt_viral_moment",
    name: "Viral Moment",
    description: "One of your released games is trending on social media.",
    category: "cultural",
    severity: "moderate",
    baseProbability: 0.0015,
    conditions: { minYear: 2010, requiresReleasedGame: true },
    oneShot: false,
  },
  {
    id: "evt_hardware_shortage",
    name: "Chip Shortage",
    description: "Global semiconductor shortage affects platform sales and dev kit prices.",
    category: "industry",
    severity: "major",
    baseProbability: 0.0003,
    conditions: { minYear: 2000 },
    oneShot: false,
  },
  {
    id: "evt_economic_boom",
    name: "Economic Boom",
    description: "Consumer spending surges. All game sales temporarily boosted.",
    category: "financial",
    severity: "moderate",
    baseProbability: 0.0008,
    oneShot: false,
  },
  {
    id: "evt_recession",
    name: "Recession",
    description: "Economic downturn. Sales dip, hiring pool shrinks, salaries drop.",
    category: "financial",
    severity: "major",
    baseProbability: 0.0004,
    oneShot: false,
  },
  {
    id: "evt_lawsuit_frivolous",
    name: "Frivolous Lawsuit",
    description: "Someone claims your game infringed on theirs.",
    category: "studio",
    severity: "moderate",
    baseProbability: 0.0006,
    conditions: { requiresReleasedGame: true, minReputation: 20 },
    oneShot: false,
    choices: [
      { id: "fight", label: "Fight in court ($500K legal fees)", description: "Long battle but you probably win.", effects: { cash: -50000000 } },
      { id: "settle", label: "Settle quietly ($200K)", description: "Fast resolution, minor reputation ding.", effects: { cash: -20000000, reputation: -2 } },
    ],
  },
  {
    id: "evt_genre_trend_up",
    name: "Genre Going Hot",
    description: "A particular genre is trending upward — bonus sales for your relevant releases.",
    category: "cultural",
    severity: "minor",
    baseProbability: 0.002,
    oneShot: false,
  },
  {
    id: "evt_new_platform_leak",
    name: "Platform Leak",
    description: "Rumors of a next-gen console reach devs early. Do you prepare?",
    category: "industry",
    severity: "moderate",
    baseProbability: 0.0005,
    conditions: { minReputation: 30 },
    oneShot: false,
  },
  {
    id: "evt_indie_breakout",
    name: "Indie Darling Emerges",
    description: "A tiny studio's debut is the surprise hit of the year. Competition intensifies.",
    category: "competitor",
    severity: "moderate",
    baseProbability: 0.0006,
    conditions: { minYear: 2008 },
    oneShot: false,
  },
  {
    id: "evt_press_praise",
    name: "Profile Piece",
    description: "A major publication runs a flattering feature on your studio.",
    category: "studio",
    severity: "minor",
    baseProbability: 0.001,
    conditions: { minReputation: 40 },
    oneShot: false,
  },
  {
    id: "evt_scandal",
    name: "Workplace Scandal",
    description: "Internal issues surface publicly. Damage control needed.",
    category: "studio",
    severity: "major",
    baseProbability: 0.0003,
    conditions: { minStaffCount: 15, minReputation: 30 },
    oneShot: false,
    choices: [
      { id: "pr_campaign", label: "PR campaign ($1M)", description: "Minimize reputation hit.", effects: { cash: -100000000, reputation: -3 } },
      { id: "internal_reforms", label: "Internal reforms", description: "Slower, more credible recovery.", effects: { reputation: -5, moraleAll: 4 } },
      { id: "ignore", label: "No comment", description: "Bigger reputation loss.", effects: { reputation: -10 } },
    ],
  },
  {
    id: "evt_publisher_pitch",
    name: "Publisher Pitch",
    description: "A third-party publisher offers you a work-for-hire contract.",
    category: "studio",
    severity: "moderate",
    baseProbability: 0.0008,
    conditions: { minReputation: 25 },
    oneShot: false,
  },
  {
    id: "evt_acquisition_interest",
    name: "Acquisition Interest",
    description: "A major publisher inquires about acquiring your studio.",
    category: "studio",
    severity: "landmark",
    baseProbability: 0.00005,
    conditions: { minReputation: 65, minYear: 2000 },
    oneShot: false,
  },
];
