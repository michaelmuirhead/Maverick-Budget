// Post-mortem system — derive a "what went well / what went wrong" report
// from a released project's actual run.
//
// Pure function. Nothing mutates state. The UI passes a released Project +
// the global GameState (for reception, reviews, staff context) and gets back
// a PostMortem record describing strengths, weaknesses, and forward-looking
// lessons. Re-derivable on every read so the story keeps evolving as the
// player runs patch sprints / hidden bugs surface / live userScore drifts.

import type { GameState } from "../core/state";
import type { Project } from "../types/project";
import type { QualityAxis } from "../types/core";
import type { Review } from "../types/review";
import type {
  PostMortem,
  AxisReport,
  PostMortemNote,
  PostMortemLesson,
  PostMortemNoteCategory,
} from "../types/postmortem";
import { GENRE_BY_ID } from "../data/genres";
import { THEME_BY_ID } from "../data/themes";
import { isoToDate, daysBetween } from "../core/time";

// ============ TUNING ============
// Thresholds for promoting an observation into a strength/weakness/lesson.
// Tuned against the smoke-test target: a clean RPG launch around MC 80.

const AXIS_ABOVE_THRESHOLD = 8;        // axis score - expected baseline
const AXIS_BELOW_THRESHOLD = -8;
const HIGH_WEIGHT_AXIS = 0.18;         // genre weight at which an axis is "marquee"
const HEAVY_CRUNCH_DAYS = 60;
const VERY_HEAVY_CRUNCH_DAYS = 120;
const HIGH_BUG_LAUNCH = 80;            // total bugs at launch
const HIDDEN_BUG_CONCERN = 40;
const POOR_THEME_AFFINITY = 0.4;
const STRONG_THEME_AFFINITY = 0.85;
const BUDGET_OVERRUN_PCT = 105;        // spent > 105% of total
const TIGHT_BUDGET_PCT = 75;           // spent < 75% — under-invested?
const ROI_FLOP_THRESHOLD = 0.6;        // < 0.6x return = clear flop
const ROI_HIT_THRESHOLD = 3.0;         // ≥ 3x return = bona fide hit
const USER_VS_CRITIC_DRIFT = 12;       // |userScore - metacritic| above this is notable
const LOW_MORALE_AT_LAUNCH = 45;

// ============ MAIN ENTRY ============

export function computePostMortem(
  state: GameState,
  project: Project
): PostMortem | null {
  if (project.status !== "released") return null;
  const reception = state.receptions[project.id];
  if (!reception) return null;
  const reviews = (project.reviewIds ?? [])
    .map((rid) => state.reviews[rid])
    .filter((r): r is Review => !!r);
  if (reviews.length === 0) return null;

  const genre = GENRE_BY_ID[project.genre];
  const theme = THEME_BY_ID[project.theme];
  if (!genre) return null;

  // ---------- Per-axis report card ----------
  // Aggregate per-axis scores across reviews (median per axis), then compare to
  // the metacritic baseline. Genre weight tells the player how much each axis
  // actually mattered for this kind of game.
  const axisKeys: QualityAxis[] = [
    "gameplay", "graphics", "sound", "story", "world", "ai", "polish",
  ];
  const axisReports: AxisReport[] = axisKeys.map((axis) => {
    const samples = reviews
      .map((r) => r.axisScores[axis])
      .filter((v): v is number => typeof v === "number");
    const median = samples.length > 0 ? medianOf(samples) : 0;
    const weight = genre.axisWeights[axis] ?? 0;
    const delta = median - reception.metacriticScore;
    const vsExpected: AxisReport["vsExpected"] =
      delta >= AXIS_ABOVE_THRESHOLD ? "above" :
      delta <= AXIS_BELOW_THRESHOLD ? "below" :
      "on_target";
    return { axis, weight, axisScore: median, vsExpected };
  });

  // ---------- Production hygiene ----------
  const budgetUsedPct = project.budget.total > 0
    ? Math.round((project.budget.spent / project.budget.total) * 100)
    : 0;
  const startDate = isoToDate(project.startDate);
  const releaseDate = isoToDate(project.actualReleaseDate ?? state.currentDate);
  const daysInDevelopment = Math.max(1, daysBetween(startDate, releaseDate));

  // ---------- ROI ----------
  const lifetimeRevenue = project.lifetimeRevenue ?? 0;
  const spend = project.budget.spent;
  const netReturn = lifetimeRevenue - spend;
  const roiMultiple = spend > 0 ? lifetimeRevenue / spend : 0;
  const paybackHit = lifetimeRevenue >= spend;

  // ---------- Team morale at glance ----------
  // Use current morale of the originally-assigned staff (still on staff) as a
  // rough proxy. Released games unassign staff on launch but don't reset
  // morale, so the number reflects the post-launch ambient state.
  const teamMorale = avgOrZero(
    project.assignedStaffIds
      .map((id) => state.staff[id])
      .filter((s) => !!s && s.status === "employed")
      .map((s) => s!.morale)
  );

  // ---------- Strengths ----------
  const strengths: PostMortemNote[] = [];
  for (const r of axisReports) {
    if (r.vsExpected === "above" && r.weight >= HIGH_WEIGHT_AXIS) {
      strengths.push({
        category: "quality",
        headline: `${capitalize(r.axis)} carried the game`,
        detail: `${capitalize(r.axis)} scored ${r.axisScore}/100 — well above the ${reception.metacriticScore} review average, in a genre that weights it ${(r.weight * 100).toFixed(0)}%.`,
      });
    }
  }
  if (theme && (theme.genreAffinity[project.genre] ?? 0.5) >= STRONG_THEME_AFFINITY) {
    strengths.push({
      category: "market",
      headline: `${theme.name} fits ${genre.name} like a glove`,
      detail: `Theme × genre affinity is ${(theme.genreAffinity[project.genre]! * 100).toFixed(0)}%. Players responded to a familiar pairing.`,
    });
  }
  if (project.totalBugs <= 25 && !project.launchedInBadState) {
    strengths.push({
      category: "bugs",
      headline: "Clean launch",
      detail: `Only ${project.totalBugs} bugs on the books at ship — reviews weren't dragged down by visible jank.`,
    });
  }
  if (project.qcDaysTotal >= 14 && project.totalBugs <= 40) {
    strengths.push({
      category: "production",
      headline: "Quality Control paid off",
      detail: `${project.qcDaysTotal} days on QC Push kept the bug count manageable at launch.`,
    });
  }
  if (project.crunchDaysTotal === 0) {
    strengths.push({
      category: "team",
      headline: "Shipped without crunch",
      detail: "No crunch days logged. Staff morale and tech debt both stay healthy going into the next project.",
    });
  }
  if (paybackHit && roiMultiple >= ROI_HIT_THRESHOLD) {
    strengths.push({
      category: "production",
      headline: "Strong ROI",
      detail: `${roiMultiple.toFixed(1)}× return on a ${formatCents(spend)} budget — clear hit by the numbers.`,
    });
  }
  if (project.userScore != null && project.userScore - reception.metacriticScore >= USER_VS_CRITIC_DRIFT) {
    strengths.push({
      category: "market",
      headline: "Players outpaced critics",
      detail: `User score of ${project.userScore} is well above the ${reception.metacriticScore} Metacritic — strong word-of-mouth and forgiveness.`,
    });
  }

  // ---------- Weaknesses ----------
  const weaknesses: PostMortemNote[] = [];
  for (const r of axisReports) {
    if (r.vsExpected === "below" && r.weight >= HIGH_WEIGHT_AXIS) {
      weaknesses.push({
        category: "quality",
        headline: `${capitalize(r.axis)} dragged the score down`,
        detail: `${capitalize(r.axis)} only scored ${r.axisScore}/100 in a genre that weights it ${(r.weight * 100).toFixed(0)}% — critics noticed.`,
      });
    }
  }
  if (project.launchedInBadState) {
    weaknesses.push({
      category: "bugs",
      headline: "Launched in a bad state",
      detail: `${project.visibleBugs} visible bugs at launch crossed the bad-state threshold. Reviews and userScore both took the hit.`,
    });
  }
  if (project.hiddenBugs >= HIDDEN_BUG_CONCERN) {
    weaknesses.push({
      category: "bugs",
      headline: "Hidden bugs lurking",
      detail: `${project.hiddenBugs} hidden bugs at ship are surfacing post-launch — userScore will continue drifting unless patched.`,
    });
  }
  if (project.crunchDaysTotal >= VERY_HEAVY_CRUNCH_DAYS) {
    weaknesses.push({
      category: "team",
      headline: "Severe crunch",
      detail: `${project.crunchDaysTotal} crunch days. Tech debt accrued, morale drained, and attrition risk is elevated.`,
    });
  } else if (project.crunchDaysTotal >= HEAVY_CRUNCH_DAYS) {
    weaknesses.push({
      category: "team",
      headline: "Heavy crunch",
      detail: `${project.crunchDaysTotal} crunch days left a tech-debt and morale tax going into the next cycle.`,
    });
  }
  if (theme && (theme.genreAffinity[project.genre] ?? 0.5) <= POOR_THEME_AFFINITY) {
    weaknesses.push({
      category: "market",
      headline: `${theme.name} is a hard sell on ${genre.name}`,
      detail: `Theme × genre affinity is only ${(theme.genreAffinity[project.genre]! * 100).toFixed(0)}%. Future ${genre.name} projects should consider a more natural pairing.`,
    });
  }
  if (budgetUsedPct >= BUDGET_OVERRUN_PCT) {
    weaknesses.push({
      category: "production",
      headline: "Budget overran",
      detail: `Spent ${budgetUsedPct}% of the planned budget. Padding the next project's budget is prudent.`,
    });
  }
  if (!paybackHit && roiMultiple < ROI_FLOP_THRESHOLD) {
    weaknesses.push({
      category: "production",
      headline: "Did not recoup",
      detail: `Returned ${(roiMultiple * 100).toFixed(0)}% of spend. The studio absorbed a ${formatCents(-netReturn)} loss on this title.`,
    });
  }
  if (project.userScore != null && reception.metacriticScore - project.userScore >= USER_VS_CRITIC_DRIFT) {
    weaknesses.push({
      category: "market",
      headline: "Players turned on it",
      detail: `User score of ${project.userScore} is well below the ${reception.metacriticScore} Metacritic — backlash, bugs, or marketing-vs-reality gap.`,
    });
  }
  if (teamMorale > 0 && teamMorale < LOW_MORALE_AT_LAUNCH) {
    weaknesses.push({
      category: "team",
      headline: "Team is exhausted",
      detail: `Average morale on the original team is ${teamMorale.toFixed(0)}. Watch for attrition before staffing the next project.`,
    });
  }

  // ---------- Forward-looking lessons ----------
  const lessons: PostMortemLesson[] = [];
  if (project.launchedInBadState) {
    lessons.push({
      severity: "critical",
      category: "bugs",
      headline: "Run a QC Push at the gate next time",
      rationale: "This project shipped with the bug count above the bad-state threshold. The release gate gives you a window to burn down bugs before approving — use it.",
    });
  } else if (project.visibleBugs >= HIGH_BUG_LAUNCH && project.qcDaysTotal === 0) {
    lessons.push({
      severity: "improve",
      category: "bugs",
      headline: "Try a Quality Control Push earlier",
      rationale: `You shipped with ${project.visibleBugs} visible bugs and never used QC. Even a short QC sprint suppresses new bug generation while burning the backlog down.`,
    });
  }
  if (project.crunchDaysTotal >= VERY_HEAVY_CRUNCH_DAYS) {
    lessons.push({
      severity: "critical",
      category: "team",
      headline: "Cut crunch on the next project",
      rationale: `${project.crunchDaysTotal} crunch days is unsustainable. Crunch added to tech debt (which raised the hidden-bug ratio at ship) and is still suppressing morale.`,
    });
  } else if (project.crunchDaysTotal >= HEAVY_CRUNCH_DAYS) {
    lessons.push({
      severity: "improve",
      category: "team",
      headline: "Lean less on crunch",
      rationale: "Crunch buys phase progress but leaves a tech-debt and morale tax that follows the team into the next project.",
    });
  }
  for (const r of axisReports) {
    if (r.vsExpected === "below" && r.weight >= HIGH_WEIGHT_AXIS) {
      lessons.push({
        severity: "improve",
        category: "quality",
        headline: `Increase ${r.axis} focus on the next ${genre.name}`,
        rationale: `${capitalize(r.axis)} is weighted ${(r.weight * 100).toFixed(0)}% for this genre but only scored ${r.axisScore}/100 here. Bias the early-phase sliders toward ${r.axis}, or staff specialists who buff that axis.`,
      });
    }
  }
  if (theme && (theme.genreAffinity[project.genre] ?? 0.5) <= POOR_THEME_AFFINITY) {
    lessons.push({
      severity: "improve",
      category: "market",
      headline: "Pick a friendlier theme next time",
      rationale: `${theme.name} on ${genre.name} only had ${(theme.genreAffinity[project.genre]! * 100).toFixed(0)}% affinity. The Theme × Genre matrix at concept time previewed this — check it before greenlighting.`,
    });
  }
  if (project.hiddenBugs >= HIDDEN_BUG_CONCERN) {
    lessons.push({
      severity: project.hiddenBugs >= HIDDEN_BUG_CONCERN * 2 ? "critical" : "improve",
      category: "bugs",
      headline: "Patch sprint recommended",
      rationale: `${project.hiddenBugs} hidden bugs are still leaking out. A named patch (e.g. "1.1") burns them down and recovers user score (and sales).`,
    });
  }
  if (budgetUsedPct >= BUDGET_OVERRUN_PCT) {
    lessons.push({
      severity: "watch",
      category: "production",
      headline: "Pad budgets by ~10–15%",
      rationale: `Spent ${budgetUsedPct}% of the planned budget on this title — pad the next one to avoid scrambling.`,
    });
  } else if (budgetUsedPct <= TIGHT_BUDGET_PCT && roiMultiple < 1.2) {
    lessons.push({
      severity: "watch",
      category: "production",
      headline: "May have under-invested",
      rationale: `Only used ${budgetUsedPct}% of the budget and ROI was modest. A larger team or longer schedule might have lifted the score.`,
    });
  }
  if (!paybackHit && roiMultiple < ROI_FLOP_THRESHOLD) {
    lessons.push({
      severity: "critical",
      category: "production",
      headline: "Re-evaluate before greenlighting a sequel",
      rationale: `Returns of ${(roiMultiple * 100).toFixed(0)}% don't justify a follow-up at this scope. Consider smaller-scope or a different audience next.`,
    });
  }
  if (paybackHit && roiMultiple >= ROI_HIT_THRESHOLD && !project.ipId) {
    lessons.push({
      severity: "watch",
      category: "market",
      headline: "Capture the hit — consider a sequel",
      rationale: "A clear hit that hasn't spawned an IP yet. Revisit the franchise while fan affinity is fresh.",
    });
  }
  if (teamMorale > 0 && teamMorale < LOW_MORALE_AT_LAUNCH) {
    lessons.push({
      severity: "improve",
      category: "team",
      headline: "Schedule recovery before next kickoff",
      rationale: `Team morale of ${teamMorale.toFixed(0)} is fragile. Time off, raises, or a smaller next project all reduce attrition risk.`,
    });
  }

  // De-duplicate by headline (defensive — multiple axes etc. can't collide
  // because they include the axis name, but this is a cheap safety net).
  const dedupedLessons = dedupeBy(lessons, (l) => l.headline);

  return {
    projectId: project.id,
    generatedDate: state.currentDate,
    metacriticScore: reception.metacriticScore,
    initialUserScore: reception.userScore,
    liveUserScore: project.userScore ?? reception.userScore,
    visibleBugsAtLaunch: project.visibleBugs,
    hiddenBugsAtLaunch: project.hiddenBugs,
    techDebtAtLaunch: Math.round(project.techDebt),
    axisReports,
    budgetUsedPct,
    crunchDaysTotal: project.crunchDaysTotal,
    qcDaysTotal: project.qcDaysTotal,
    daysInDevelopment,
    netReturn,
    roiMultiple,
    paybackHit,
    launchedInBadState: project.launchedInBadState,
    staffMoraleAvgAtLaunch: Math.round(teamMorale),
    strengths,
    weaknesses,
    lessons: dedupedLessons,
  };
}

// ============ HELPERS ============

function medianOf(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

function avgOrZero(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatCents(cents: number): string {
  const dollars = Math.round(Math.abs(cents) / 100);
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`;
  return `$${dollars.toLocaleString()}`;
}

function dedupeBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

// Re-export the category union so consumers don't have to import from types.
export type { PostMortemNoteCategory };
