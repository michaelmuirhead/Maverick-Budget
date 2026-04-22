// Marketing system.
//
// Running a campaign: deducts cash, applies an immediate hype boost to the project,
// bumps project.budget.marketing for accounting and sales-curve-multiplier purposes.
//
// Hype decay: each day, project hype drifts toward 0 at ~1.5% per day. Without
// fresh campaigns, hype fades. This makes late-stage campaigns especially valuable.
//
// Release-time integration: the release system reads project.hypeLevel and uses
// it to scale launchWeekBoost on the ActiveSale record. High hype also narrows
// review variance (see release.ts).

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { Project } from "../types/project";
import {
  CAMPAIGN_BY_ID, eraMarketingCostMultiplier, type CampaignTiming,
} from "../data/marketing";
import { appendLog } from "../core/log";
import { isoToDate } from "../core/time";

// ============ RUN A CAMPAIGN ============
// The player picks a campaign and runs it on a specific project.
// Validates timing (some campaigns are pre-launch only, some work post-launch),
// reputation floor, and era availability.
export function runCampaign(
  state: GameState,
  projectId: ID,
  campaignId: string
): GameState {
  const project = state.projects[projectId];
  if (!project) return state;

  const campaign = CAMPAIGN_BY_ID[campaignId];
  if (!campaign) return state;

  const year = isoToDate(state.currentDate).year;

  // Era gate
  if (year < campaign.firstYear) {
    return appendLog(state, {
      category: "event",
      headline: `${campaign.name} isn't available yet`,
      severity: "warning",
    });
  }
  if (campaign.lastYear !== undefined && year > campaign.lastYear) {
    return appendLog(state, {
      category: "event",
      headline: `${campaign.name} is obsolete by ${year}`,
      severity: "warning",
    });
  }

  // Reputation gate
  if (state.studio.reputation < campaign.minReputation) {
    return appendLog(state, {
      category: "event",
      headline: `${campaign.name} requires reputation ${campaign.minReputation}`,
      severity: "warning",
    });
  }

  // Timing gate — figure out where this project is in its lifecycle
  const timing = projectTiming(project);
  if (!campaign.timings.includes(timing)) {
    return appendLog(state, {
      category: "event",
      headline: `${campaign.name} not valid for ${timing.replace("_", " ")}`,
      body: `This campaign works during: ${campaign.timings.map((t) => t.replace("_", " ")).join(", ")}.`,
      severity: "warning",
    });
  }

  // Cost — era scaled
  const cost = Math.round(campaign.baseCost * eraMarketingCostMultiplier(year));
  if (state.studio.cash < cost) {
    return appendLog(state, {
      category: "event",
      headline: `Can't afford ${campaign.name} ($${Math.round(cost / 100).toLocaleString()})`,
      severity: "warning",
    });
  }

  // Hype boost — some campaigns scale with studio reputation
  let hypeBoost = campaign.hypeBoost;
  if (campaign.reputationScaling) {
    // Up to +50% boost at max rep
    hypeBoost = Math.round(hypeBoost * (1 + state.studio.reputation / 200));
  }

  const newHype = Math.min(100, (project.hypeLevel ?? 0) + hypeBoost);

  // Update project
  const updatedProject: Project = {
    ...project,
    hypeLevel: newHype,
    budget: {
      ...project.budget,
      marketing: project.budget.marketing + cost,
      total: project.budget.total + cost,
      spent: project.budget.spent + cost,
    },
  };

  let next: GameState = {
    ...state,
    projects: { ...state.projects, [project.id]: updatedProject },
    studio: { ...state.studio, cash: state.studio.cash - cost },
  };

  next = appendLog(next, {
    category: "finance",
    headline: `${campaign.name} running for ${project.name}`,
    body: `$${Math.round(cost / 100).toLocaleString()} spent. Hype: ${Math.round(project.hypeLevel ?? 0)} → ${Math.round(newHype)}.`,
    severity: "info",
    relatedIds: { projectId },
  });

  return next;
}

// ============ HYPE DECAY ============
// Runs daily from the master tick. Hype decays ~1.5% per day toward zero,
// but only for projects that are still in development or in their first
// ~45 days of release (word-of-mouth window).
export function tickHypeDecay(state: GameState): GameState {
  const updates: Record<ID, Project> = {};
  for (const project of Object.values(state.projects)) {
    if (project.status === "cancelled") continue;
    const hype = project.hypeLevel ?? 0;
    if (hype <= 0) continue;

    // Only decay in-development or just-released projects
    if (project.status === "released") {
      // Only decay for 45 days post-release
      if (project.actualReleaseDate) {
        const daysSince = daysBetweenIso(project.actualReleaseDate, state.currentDate);
        if (daysSince > 45) continue;
      }
    }

    const decayRate = project.status === "in_development" ? 0.015 : 0.04;
    const newHype = Math.max(0, hype - hype * decayRate);
    if (newHype !== hype) {
      updates[project.id] = { ...project, hypeLevel: newHype };
    }
  }

  if (Object.keys(updates).length === 0) return state;
  return { ...state, projects: { ...state.projects, ...updates } };
}

// ============ HELPERS ============
function projectTiming(project: Project): CampaignTiming {
  if (project.status === "in_development") {
    // Pre-launch = all dev phases; Launch week = final phase (launch)
    const phaseId = project.phases[project.currentPhaseIndex]?.id;
    if (phaseId === "launch") return "launch_week";
    return "pre_launch";
  }
  return "post_launch";
}

function daysBetweenIso(from: string, to: string): number {
  const fd = new Date(from + "T00:00:00Z").getTime();
  const td = new Date(to + "T00:00:00Z").getTime();
  return Math.floor((td - fd) / (1000 * 60 * 60 * 24));
}
