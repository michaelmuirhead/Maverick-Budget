import type { ID, Money, QualityAxis } from "./core";

// Categories a post-mortem observation can live under.
// Used by strengths, weaknesses, and lessons so the UI can badge them.
export type PostMortemNoteCategory =
  | "quality"     // per-axis scoring (story, graphics, etc.)
  | "scope"       // size/ambition vs. delivery
  | "bugs"        // bug count, hidden bugs, bad-state launch
  | "team"        // morale, attrition risk, crunch
  | "production"  // budget, schedule, ROI, process
  | "market"      // theme×genre, audience fit, userScore divergence
  | "engine";     // engine tier, features, hand-coded tradeoffs

export type LessonSeverity =
  | "watch"       // worth noting
  | "improve"     // clear improvement opportunity
  | "critical";   // must-fix going forward

// Per-axis report card — how did critics actually score each axis, vs. what
// the genre weights say it should have been?
export interface AxisReport {
  axis: QualityAxis;
  weight: number;           // genre weight, 0-1
  axisScore: number;        // median critic score on this axis (0-100)
  vsExpected: "above" | "on_target" | "below";
}

// A strength/weakness observation — "here's something that went well/poorly."
export interface PostMortemNote {
  category: PostMortemNoteCategory;
  headline: string;
  detail: string;
}

// A forward-looking lesson — "do this on the next project."
export interface PostMortemLesson {
  severity: LessonSeverity;
  category: PostMortemNoteCategory;
  headline: string;         // imperative — "Cut crunch on next project"
  rationale: string;        // why
}

export interface PostMortem {
  projectId: ID;
  generatedDate: string;          // ISO — when this mortem was computed

  // ----- Reception snapshot -----
  metacriticScore: number;
  initialUserScore: number;       // launch-day snapshot
  liveUserScore: number;          // current (drifts with bugs + patches)

  // ----- Launch-state snapshot -----
  visibleBugsAtLaunch: number;
  hiddenBugsAtLaunch: number;
  techDebtAtLaunch: number;
  launchedInBadState: boolean;

  // ----- Per-axis report card -----
  axisReports: AxisReport[];

  // ----- Production hygiene -----
  budgetUsedPct: number;          // spent / total * 100
  crunchDaysTotal: number;
  qcDaysTotal: number;
  daysInDevelopment: number;
  staffMoraleAvgAtLaunch: number; // avg morale of originally-assigned, still-employed staff

  // ----- ROI -----
  netReturn: Money;               // lifetimeRevenue - spend
  roiMultiple: number;            // lifetimeRevenue / spend
  paybackHit: boolean;

  // ----- Narrative sections -----
  strengths: PostMortemNote[];
  weaknesses: PostMortemNote[];
  lessons: PostMortemLesson[];
}
