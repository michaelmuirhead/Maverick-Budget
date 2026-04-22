// Multi-beat narrative chains.
//
// A "chain" is a story that unfolds across multiple beats over weeks/months
// of game time. Each beat fires as a news entry and (optionally) parks the
// chain on a player choice. The choice picks which beat fires next, and after
// `delayDays` the next beat fires.
//
// Chains differ from one-shot RandomEvents in three ways:
//   1. They have multiple beats with their own logs and effects.
//   2. Player choices can branch the story — the chain takes different paths.
//   3. They unfold in real game time — beats are spaced days/weeks apart, so
//      decisions made now have consequences shown later.
//
// Each chain is one-shot per save by default (controlled by oneShot flag).

import type { ID } from "../types/core";

export type ChainCategory =
  | "industry"
  | "studio"
  | "staff"
  | "competitor"
  | "cultural";

// Effects a beat or choice can apply to game state. Strict subset of what
// applyChainEffects supports; keep this declarative.
export interface ChainEffects {
  cash?: number;            // cents delta
  reputation?: number;      // 0-100 delta
  moraleAll?: number;       // 0-100 delta to every employed staff
  setFlag?: string;         // sets state.flags[setFlag] = true
  // Free-form metadata for UI ("a competitor poached your lead designer").
  // Not enforced — purely descriptive in the news log.
}

export interface ChainChoice {
  id: string;
  label: string;
  // Description shown under the choice button in the modal.
  description: string;
  // Effects applied when the player picks this choice.
  effects?: ChainEffects;
  // Where the chain goes after this choice.
  // - nextBeatId: jump to this beat (after delayDays).
  // - endsChain: terminal — chain marked complete.
  nextBeatId?: string;
  delayDays?: number;       // default 7
  endsChain?: boolean;
}

export interface ChainBeat {
  id: string;                // unique within the chain
  // Headline shown in the news log when this beat fires.
  headline: string;
  // Body text shown in the news log + modal (if interactive).
  body: string;
  severity?: "info" | "success" | "warning" | "danger";
  // Effects applied immediately when this beat fires.
  effects?: ChainEffects;
  // If present, the chain parks here until the player picks a choice.
  choices?: ChainChoice[];
  // If present and no choices, the chain auto-advances after delayDays.
  autoAdvance?: { nextBeatId: string; delayDays: number };
  // If true and no choices/autoAdvance, chain ends after this beat.
  endsChain?: boolean;
}

export interface NarrativeChainDef {
  id: string;
  name: string;
  // Shown in the news/digest as the chain banner.
  description: string;
  category: ChainCategory;
  // Daily probability roll once trigger conditions are met. Once triggered
  // the chain runs to completion regardless of probability.
  baseProbability: number;
  // One-shot per save (default true).
  oneShot?: boolean;
  // Eligibility gates for the FIRST beat firing.
  triggerConditions?: {
    minYear?: number;
    maxYear?: number;
    minReputation?: number;
    maxReputation?: number;
    minStaffCount?: number;
    minCash?: number;
    requiresReleasedGame?: boolean;
    // Chain only triggers if this flag is set (e.g. requires platform launched).
    requiresFlag?: string;
    // Chain skips if this flag is set.
    blockedByFlag?: string;
  };
  // Ordered list of beats. beats[0] is the entry beat.
  beats: ChainBeat[];
}

// ============ SEEDED CHAINS ============
// Each chain captures a multi-beat story. The branches are intentionally
// asymmetric — different choices lead to genuinely different outcomes.

export const NARRATIVE_CHAINS: NarrativeChainDef[] = [
  // -----------------------------------------------------------------
  // 1. Indie darling pressure — a small studio's surprise hit captures
  // attention. Player decides whether to react with a quick competitor
  // pivot, ride out the cycle, or poach the breakout team.
  // -----------------------------------------------------------------
  {
    id: "chain_indie_darling",
    name: "Indie Darling Emerges",
    description:
      "A no-name studio just shipped the game everyone's talking about. The market noticed. So did your investors.",
    category: "competitor",
    baseProbability: 0.0008,
    oneShot: true,
    triggerConditions: {
      minYear: 2008,
      requiresReleasedGame: true,
      minReputation: 25,
    },
    beats: [
      {
        id: "beat1_buzz",
        headline: "Tiny studio's debut is the surprise hit of the year",
        body: "Press is fawning. Streamers are everywhere. Your sales team is asking what you're going to do about it.",
        severity: "warning",
        autoAdvance: { nextBeatId: "beat2_decision", delayDays: 14 },
      },
      {
        id: "beat2_decision",
        headline: "Board wants a response to the indie darling",
        body: "You can chase the hot genre with a fast-track pivot, double down on what you do well, or quietly try to poach the breakout team.",
        severity: "info",
        choices: [
          {
            id: "pivot",
            label: "Greenlight a fast-track competitor",
            description: "Spin up a similar project. Burns morale and cash but keeps you in the conversation.",
            effects: { moraleAll: -5, cash: -2500000 },
            nextBeatId: "beat3a_pivot_outcome",
            delayDays: 60,
          },
          {
            id: "stay_course",
            label: "Stay the course",
            description: "Trust your roadmap. The trend may pass — or it may not.",
            effects: { reputation: -2 },
            nextBeatId: "beat3b_stay_outcome",
            delayDays: 60,
          },
          {
            id: "poach",
            label: "Quietly poach their lead",
            description: "Open the wallet. If it works you get the talent. If it leaks, the press will love that.",
            effects: { cash: -5000000 },
            nextBeatId: "beat3c_poach_outcome",
            delayDays: 30,
          },
        ],
      },
      {
        id: "beat3a_pivot_outcome",
        headline: "The chase project ships — to a cooled market",
        body: "Your fast-track competitor landed, but the indie wave already crested. Press calls it derivative. Some sales, no glory.",
        severity: "warning",
        effects: { reputation: -3 },
        endsChain: true,
      },
      {
        id: "beat3b_stay_outcome",
        headline: "Indie darling's studio collapses on the follow-up",
        body: "The breakout couldn't ship a sophomore hit. Industry chatter shifts back toward proven studios — and you're one of them.",
        severity: "success",
        effects: { reputation: 4 },
        endsChain: true,
      },
      {
        id: "beat3c_poach_outcome",
        headline: "You hired their lead — and the press found out",
        body: "Mixed reception: indie scene is bitter, but the talent is real. Reputation took a hit; bench depth grew.",
        severity: "warning",
        effects: { reputation: -4, moraleAll: 3 },
        endsChain: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  // 2. Press hit-piece chain — a journalist is digging. Player can
  // engage, stonewall, or pre-empt with a transparency push.
  // -----------------------------------------------------------------
  {
    id: "chain_press_investigation",
    name: "Press Investigation",
    description:
      "A trade journalist is asking former employees pointed questions about your studio's culture.",
    category: "studio",
    baseProbability: 0.0005,
    oneShot: true,
    triggerConditions: {
      minYear: 2014,
      minStaffCount: 12,
      minReputation: 30,
    },
    beats: [
      {
        id: "beat1_inquiry",
        headline: "Reporter requesting comment on culture concerns",
        body: "A respected industry journalist is on a fishing trip. Sources unknown. Deadline: 10 days.",
        severity: "warning",
        choices: [
          {
            id: "engage",
            label: "Sit for a candid interview",
            description: "Risky but humanizing. Could land well or backfire on a quote.",
            nextBeatId: "beat2a_interview",
            delayDays: 10,
          },
          {
            id: "stonewall",
            label: "No comment",
            description: "The story runs anyway, but with less material.",
            nextBeatId: "beat2b_stonewall",
            delayDays: 10,
          },
          {
            id: "preempt",
            label: "Preempt with a transparency post ($300K PR)",
            description: "Get ahead of the story. Costs cash and morale-honesty up front.",
            effects: { cash: -30000000, moraleAll: 2 },
            nextBeatId: "beat2c_preempt",
            delayDays: 7,
          },
        ],
      },
      {
        id: "beat2a_interview",
        headline: "Profile published — \"the studio's frank reckoning\"",
        body: "The interview reads as humble and self-aware. Industry peers respect it. Some former employees aren't so sure.",
        severity: "success",
        effects: { reputation: 3, moraleAll: 1 },
        endsChain: true,
      },
      {
        id: "beat2b_stonewall",
        headline: "Hit piece runs without your input",
        body: "The article paints with a broad brush. Without your voice, it lands hard. Investor calls coming in.",
        severity: "danger",
        effects: { reputation: -8, moraleAll: -4 },
        autoAdvance: { nextBeatId: "beat3b_aftermath", delayDays: 30 },
      },
      {
        id: "beat3b_aftermath",
        headline: "Story fades, scars remain",
        body: "News cycle moved on. Recruiters say it's harder to land senior hires for a few months.",
        severity: "warning",
        effects: { reputation: -2 },
        endsChain: true,
      },
      {
        id: "beat2c_preempt",
        headline: "Transparency post lands ahead of the story",
        body: "Your post controls the narrative. The eventual hit piece gets little oxygen. Some readers see it as spin.",
        severity: "info",
        effects: { reputation: 1 },
        endsChain: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  // 3. Acquisition courtship chain — a major publisher circles you.
  // Multi-beat: initial contact → due diligence → final offer.
  // -----------------------------------------------------------------
  {
    id: "chain_acquisition_courtship",
    name: "Acquisition Courtship",
    description:
      "A major publisher has expressed interest in acquiring your studio. The dance has begun.",
    category: "industry",
    baseProbability: 0.00015,
    oneShot: true,
    triggerConditions: {
      minYear: 2005,
      minReputation: 60,
      requiresReleasedGame: true,
    },
    beats: [
      {
        id: "beat1_initial",
        headline: "Major publisher requests an exploratory call",
        body: "It's a feeler, not an offer. They want to know if you'd take a meeting. The board is listening.",
        severity: "info",
        choices: [
          {
            id: "take_meeting",
            label: "Take the meeting",
            description: "Doesn't commit you to anything. Information gathering.",
            nextBeatId: "beat2_diligence",
            delayDays: 21,
          },
          {
            id: "decline_polite",
            label: "Decline politely",
            description: "Door stays open for later. Independence preserved.",
            effects: { reputation: 1 },
            endsChain: true,
          },
        ],
      },
      {
        id: "beat2_diligence",
        headline: "Due diligence underway",
        body: "Their team is reviewing your books, your roadmap, your IP. Your CFO says expect three weeks of distraction. An offer is coming.",
        severity: "info",
        effects: { moraleAll: -2 },
        autoAdvance: { nextBeatId: "beat3_offer", delayDays: 30 },
      },
      {
        id: "beat3_offer",
        headline: "Formal acquisition offer received",
        body: "The number is real money. Studio would become a label under the publisher. Founders earn out over 4 years.",
        severity: "warning",
        choices: [
          {
            id: "accept",
            label: "Accept — sell the studio",
            description: "Big cash event. Loss of independence. Game over for the indie story.",
            effects: { cash: 25000000000, reputation: -5, moraleAll: -10, setFlag: "studio_acquired" },
            endsChain: true,
          },
          {
            id: "counter",
            label: "Counter at a higher number",
            description: "They might walk. Or they might pay.",
            nextBeatId: "beat4_counter_response",
            delayDays: 14,
          },
          {
            id: "reject",
            label: "Reject — stay independent",
            description: "Reputation up among indie peers. Investors grumble.",
            effects: { reputation: 4, moraleAll: 5 },
            endsChain: true,
          },
        ],
      },
      {
        id: "beat4_counter_response",
        headline: "Publisher walks from the negotiation",
        body: "The counter was too aggressive. They've moved on. Your independence is intact, but the door closed harder than you'd like.",
        severity: "warning",
        effects: { reputation: -2, moraleAll: -3 },
        endsChain: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  // 4. Crunch revolt chain — sustained crunch surfaces as a public issue.
  // Triggered by accumulated crunch days across the studio.
  // -----------------------------------------------------------------
  {
    id: "chain_crunch_revolt",
    name: "Crunch Revolt",
    description:
      "Quiet murmuring inside the studio is getting louder. Anonymous accounts are starting to post.",
    category: "staff",
    baseProbability: 0.0006,
    oneShot: true,
    triggerConditions: {
      minYear: 2018,
      minStaffCount: 10,
    },
    beats: [
      {
        id: "beat1_anonymous",
        headline: "Anonymous account posts about your studio's culture",
        body: "A burner account on dev Twitter shares specifics — hours, tasks, deadlines. It's accurate enough to sting.",
        severity: "warning",
        autoAdvance: { nextBeatId: "beat2_internal", delayDays: 7 },
      },
      {
        id: "beat2_internal",
        headline: "Internal Slack lights up",
        body: "Staff are demanding a town hall. You can call one, send out a memo, or push through the milestone first.",
        severity: "warning",
        choices: [
          {
            id: "town_hall",
            label: "Hold the town hall",
            description: "Hard conversations, but morale recovers if it's real.",
            effects: { moraleAll: 8 },
            nextBeatId: "beat3a_townhall_outcome",
            delayDays: 14,
          },
          {
            id: "memo_only",
            label: "Send a memo, keep working",
            description: "Half-measure. Some buy in, others see through it.",
            effects: { moraleAll: -2 },
            nextBeatId: "beat3b_memo_outcome",
            delayDays: 14,
          },
          {
            id: "push_through",
            label: "Push through the milestone first",
            description: "Eyes on the prize. Or, eyes on the door.",
            effects: { moraleAll: -8 },
            nextBeatId: "beat3c_push_outcome",
            delayDays: 14,
          },
        ],
      },
      {
        id: "beat3a_townhall_outcome",
        headline: "Town hall lands — concrete commitments made",
        body: "You committed to PTO mandates and dropped the next milestone's scope. Risky for the timeline, healthy for the team.",
        severity: "success",
        effects: { reputation: 2, moraleAll: 4 },
        endsChain: true,
      },
      {
        id: "beat3b_memo_outcome",
        headline: "Memo seen as PR — story expands externally",
        body: "Industry press picked up the thread. The memo's empty calories made it worse, not better.",
        severity: "danger",
        effects: { reputation: -5, moraleAll: -3 },
        endsChain: true,
      },
      {
        id: "beat3c_push_outcome",
        headline: "Walkout — three senior staff resigned this week",
        body: "Post on a major industry site names you. Recruiters call it 'a culture problem.' The milestone shipped, mostly.",
        severity: "danger",
        effects: { reputation: -10, moraleAll: -8 },
        endsChain: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  // 5. Console-cycle bet chain — a new generation is rumored. Player
  // bets early, late, or skips it. Outcome depends on choice.
  // -----------------------------------------------------------------
  {
    id: "chain_console_bet",
    name: "Next-Gen Bet",
    description:
      "Rumors of a new console generation are picking up. Tooling decisions made now will pay off — or not — in three years.",
    category: "industry",
    baseProbability: 0.0006,
    oneShot: true,
    triggerConditions: {
      minYear: 1996,
      minReputation: 35,
    },
    beats: [
      {
        id: "beat1_rumors",
        headline: "Industry rumors of a new console generation",
        body: "Devkits are rumored to ship in 18 months. Early adopters get launch-window slots — and risk betting on vapor.",
        severity: "info",
        choices: [
          {
            id: "early_bet",
            label: "Bet early — pre-commit to devkits",
            description: "Pay now to be first in line. If the platform lands, you're a launch title.",
            effects: { cash: -15000000 },
            nextBeatId: "beat2a_early_outcome",
            delayDays: 540,
          },
          {
            id: "wait_see",
            label: "Wait and see",
            description: "Save the cash. Late to the party but no risk.",
            nextBeatId: "beat2b_wait_outcome",
            delayDays: 540,
          },
        ],
      },
      {
        id: "beat2a_early_outcome",
        headline: "New console launches — your team is in the launch window",
        body: "The bet paid off. Press eats up your launch title. Platform-holder marketing budget is yours to spend.",
        severity: "success",
        effects: { reputation: 6, cash: 8000000, setFlag: "early_bet_winner" },
        endsChain: true,
      },
      {
        id: "beat2b_wait_outcome",
        headline: "New console launched — without you",
        body: "Launch went well; you weren't part of the story. Year-two slot is still open, but the buzz has moved on.",
        severity: "warning",
        effects: { reputation: -1 },
        endsChain: true,
      },
    ],
  },
];
