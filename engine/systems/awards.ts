// Awards system.
//
// Fires once a year when the Game of the Year Awards scheduled event triggers.
// Evaluates all games (player + competitor) released in the calendar year
// being awarded (previous year). Picks winners for:
//   - Game of the Year (highest metacritic + volume)
//   - Best in each genre (top metacritic in that genre)
//   - Best Innovation (new IP, high metacritic)
//   - Best Mobile/Indie (by platform/budget profile)
//   - Best Art/Narrative (by axis score)
//   - Studio of the Year (by aggregate release quality)
//
// Effects on player wins:
//   - +5-15 reputation per award (GOTY is biggest)
//   - +sales boost on any active-sale game that won (10-30%)
//   - Cash prize for Studio of the Year
//   - IP fan affinity boost for the winning game's IP
// Effects on competitor wins:
//   - Tracked for flavor + studio of year comparisons

import type { GameState } from "../core/state";
import type { ID } from "../types/core";
import type { Award, AwardCategory } from "../types/awards";
import type { Project } from "../types/project";
import type { CompetitorGame } from "../types/competitor";

import { generateId } from "../core/ids";
import { appendLog } from "../core/log";
import { isoToDate } from "../core/time";
import { CATEGORY_GENRE_MAP, AWARD_DISPLAY_NAMES } from "../types/awards";

// ============ ANNUAL AWARDS CEREMONY ============
// Called once per year when the GOTY Awards scheduled event fires.
// Awards the previous calendar year's games.
export function runAnnualAwards(state: GameState): GameState {
  const awardYear = isoToDate(state.currentDate).year - 1;
  if (awardYear < 1980) return state;

  // Guard: don't run twice for the same year
  if (state.awards.some((a) => a.year === awardYear)) return state;

  let next = state;
  let rng = state.rng;
  const newAwards: Award[] = [];

  // Gather all games released that year
  const playerGames: Project[] = Object.values(state.projects).filter(
    (p) => p.status === "released" &&
    p.actualReleaseDate &&
    p.metacriticScore !== undefined &&
    isoToDate(p.actualReleaseDate).year === awardYear
  );
  const competitorGames: CompetitorGame[] = Object.values(state.competitorGames).filter(
    (g) => isoToDate(g.releaseDate).year === awardYear
  );

  // ==== GOTY CAMPAIGN BIAS ====
  // If the player ran a "For Your Consideration" / major awards campaign
  // (set by evt_goty_submission), voter bias tilts toward player games in
  // the mixed player-vs-competitor rankings. This is an effective-score
  // bonus used only for sort comparisons — the displayed metacritic stays
  // accurate. Cleared at the end of this function so it doesn't leak into
  // next year's ceremony. Stored in metadata (not flags) so the numeric
  // value survives the boolean-only constraint on flags.
  const rawBoost = state.metadata.gotyCampaignBoost;
  const campaignBoost = typeof rawBoost === "number" ? rawBoost : 0;

  // No games released that year? No ceremony — but still clear the campaign
  // entry so this year's spend doesn't leak into next year's ceremony.
  if (playerGames.length === 0 && competitorGames.length === 0) {
    if (campaignBoost > 0) {
      const newMetadata = { ...state.metadata };
      delete newMetadata.gotyCampaignBoost;
      return { ...state, metadata: newMetadata };
    }
    return state;
  }

  // ==== GAME OF THE YEAR ====
  // Highest metacritic among all games; ties broken by player over competitor.
  // `score` is the voter-facing effective score (may include campaign boost
  // for player games). `displayScore` is the real metacritic used in the
  // award record so history stays truthful.
  const allScored: {
    id: ID; score: number; displayScore: number; name: string; isPlayer: boolean; projectId?: ID
  }[] = [
    ...playerGames.map((p) => ({
      id: p.id, score: p.metacriticScore! + campaignBoost,
      displayScore: p.metacriticScore!, name: p.name,
      isPlayer: true, projectId: p.id,
    })),
    ...competitorGames.map((g) => ({
      id: g.id, score: g.metacriticScore, displayScore: g.metacriticScore, name: g.name,
      isPlayer: false, projectId: undefined,
    })),
  ];
  allScored.sort((a, b) => b.score - a.score || (a.isPlayer ? -1 : 1));
  const goty = allScored[0];
  if (goty && goty.score >= 75) {
    const [awardId, r1] = generateId("awd", rng);
    rng = r1;
    newAwards.push({
      id: awardId,
      category: "goty",
      year: awardYear,
      projectId: goty.projectId,
      projectName: goty.name,
      metacriticScore: goty.displayScore,
      isPlayerStudio: goty.isPlayer,
      awardedDate: state.currentDate,
    });
  }

  // ==== GENRE AWARDS ====
  for (const [category, genreId] of Object.entries(CATEGORY_GENRE_MAP) as [AwardCategory, string][]) {
    const candidates: {
      id: ID; score: number; displayScore: number; name: string; isPlayer: boolean; projectId?: ID
    }[] = [
      ...playerGames.filter((p) => p.genre === genreId).map((p) => ({
        id: p.id, score: p.metacriticScore! + campaignBoost,
        displayScore: p.metacriticScore!, name: p.name,
        isPlayer: true, projectId: p.id,
      })),
      ...competitorGames.filter((g) => g.genreId === genreId).map((g) => ({
        id: g.id, score: g.metacriticScore, displayScore: g.metacriticScore, name: g.name,
        isPlayer: false, projectId: undefined,
      })),
    ];
    if (candidates.length === 0) continue;
    candidates.sort((a, b) => b.score - a.score || (a.isPlayer ? -1 : 1));
    const winner = candidates[0]!;
    if (winner.score < 70) continue; // no award if no one scored well
    const [awardId, r2] = generateId("awd", rng);
    rng = r2;
    newAwards.push({
      id: awardId,
      category,
      year: awardYear,
      projectId: winner.projectId,
      projectName: winner.name,
      metacriticScore: winner.displayScore,
      isPlayerStudio: winner.isPlayer,
      awardedDate: state.currentDate,
    });
  }

  // ==== BEST ART ====
  // Player games only — we track axis scores for players.
  // Winner is highest graphics axis among top-quartile games.
  if (playerGames.length > 0) {
    const byArt = [...playerGames]
      .filter((p) => p.metacriticScore! >= 75)
      .sort((a, b) => (b.qualityAxes.graphics ?? 0) - (a.qualityAxes.graphics ?? 0));
    if (byArt.length > 0) {
      const [awardId, r3] = generateId("awd", rng);
      rng = r3;
      const winner = byArt[0]!;
      newAwards.push({
        id: awardId,
        category: "best_art",
        year: awardYear,
        projectId: winner.id,
        projectName: winner.name,
        metacriticScore: winner.metacriticScore,
        isPlayerStudio: true,
        awardedDate: state.currentDate,
      });
    }
  }

  // ==== BEST NARRATIVE ====
  if (playerGames.length > 0) {
    const byWriting = [...playerGames]
      .filter((p) => p.metacriticScore! >= 75)
      .sort((a, b) => (b.qualityAxes.story ?? 0) - (a.qualityAxes.story ?? 0));
    if (byWriting.length > 0) {
      const [awardId, r4] = generateId("awd", rng);
      rng = r4;
      const winner = byWriting[0]!;
      newAwards.push({
        id: awardId,
        category: "best_narrative",
        year: awardYear,
        projectId: winner.id,
        projectName: winner.name,
        metacriticScore: winner.metacriticScore,
        isPlayerStudio: true,
        awardedDate: state.currentDate,
      });
    }
  }

  // ==== BEST INNOVATION ====
  // Brand-new IP (no sequel) with a high metacritic
  const innovationCandidates = playerGames.filter(
    (p) => !p.isSequel && p.metacriticScore! >= 80
  );
  if (innovationCandidates.length > 0) {
    innovationCandidates.sort((a, b) => b.metacriticScore! - a.metacriticScore!);
    const winner = innovationCandidates[0]!;
    const [awardId, r5] = generateId("awd", rng);
    rng = r5;
    newAwards.push({
      id: awardId,
      category: "best_innovation",
      year: awardYear,
      projectId: winner.id,
      projectName: winner.name,
      metacriticScore: winner.metacriticScore,
      isPlayerStudio: true,
      awardedDate: state.currentDate,
    });
  }

  // ==== STUDIO OF THE YEAR ====
  // Aggregate release quality — sum of (metacritic-60) for games that scored 60+
  const studioScores: { id: ID; name: string; score: number; isPlayer: boolean }[] = [];
  const playerSum = playerGames
    .filter((p) => p.metacriticScore! >= 60)
    .reduce((sum, p) => sum + (p.metacriticScore! - 60), 0);
  if (playerSum > 0) {
    studioScores.push({ id: state.studio.id, name: state.studio.name, score: playerSum, isPlayer: true });
  }
  for (const comp of Object.values(state.competitors)) {
    if (comp.status !== "active") continue;
    const compSum = competitorGames
      .filter((g) => g.competitorId === comp.id && g.metacriticScore >= 60)
      .reduce((sum, g) => sum + (g.metacriticScore - 60), 0);
    if (compSum > 0) {
      studioScores.push({ id: comp.id, name: comp.name, score: compSum, isPlayer: false });
    }
  }
  if (studioScores.length > 0) {
    studioScores.sort((a, b) => b.score - a.score);
    const winner = studioScores[0]!;
    const [awardId, r6] = generateId("awd", rng);
    rng = r6;
    newAwards.push({
      id: awardId,
      category: "studio_of_year",
      year: awardYear,
      studioId: winner.id,
      studioName: winner.name,
      isPlayerStudio: winner.isPlayer,
      awardedDate: state.currentDate,
    });
  }

  // ==== APPLY EFFECTS ====
  next = { ...next, rng, awards: [...next.awards, ...newAwards] };

  const playerWins = newAwards.filter((a) => a.isPlayerStudio);
  if (playerWins.length === 0) {
    // Clear campaign boost even on a zero-wins year — the bias has been spent.
    if (campaignBoost > 0) {
      const newMetadata = { ...next.metadata };
      delete newMetadata.gotyCampaignBoost;
      next = { ...next, metadata: newMetadata };
    }
    // No wins this year
    if (newAwards.length > 0) {
      next = appendLog(next, {
        category: "event",
        headline: `${awardYear} Game of the Year Awards`,
        body: `${newAwards.length} awards handed out. You didn't take home any this year.`,
        severity: "info",
      });
    }
    return next;
  }

  // Player wins — apply bonuses
  let repBonus = 0;
  let cashBonus = 0;
  const saleBoostProjectIds = new Set<ID>();
  const ipAffinityBoosts: Record<ID, number> = {};

  for (const award of playerWins) {
    // Reputation bonus per award
    const repForAward = {
      goty: 15,
      studio_of_year: 12,
      best_innovation: 7,
      best_art: 5,
      best_narrative: 5,
    } as Partial<Record<AwardCategory, number>>;
    const thisRep = repForAward[award.category] ?? 6;
    repBonus += thisRep;

    // Studio of year — cash prize
    if (award.category === "studio_of_year") {
      cashBonus += 50000000; // $500K prize
    }

    // Sales boost on winning games — re-boost the active sale
    if (award.projectId) {
      saleBoostProjectIds.add(award.projectId);
    }

    // IP affinity bump
    if (award.projectId) {
      const project = state.projects[award.projectId];
      if (project?.ipId) {
        ipAffinityBoosts[project.ipId] = (ipAffinityBoosts[project.ipId] ?? 0) + 8;
      }
    }

    // Project reviewsIds/awards tracking
    if (award.projectId) {
      const project = next.projects[award.projectId];
      if (project) {
        const recep = next.receptions[award.projectId];
        if (recep) {
          next = {
            ...next,
            receptions: {
              ...next.receptions,
              [award.projectId]: {
                ...recep,
                awardsWon: [...recep.awardsWon, AWARD_DISPLAY_NAMES[award.category]],
              },
            },
          };
        }
      }
    }
  }

  // Apply sale boosts — 20% projection bump
  const saleUpdates: typeof next.activeSales = {};
  for (const sale of Object.values(next.activeSales)) {
    if (saleBoostProjectIds.has(sale.projectId) && sale.active) {
      saleUpdates[sale.id] = {
        ...sale,
        projectedLifetimeUnits: Math.round(sale.projectedLifetimeUnits * 1.2),
        projectedLifetimeRevenue: Math.round(sale.projectedLifetimeRevenue * 1.2),
      };
    }
  }

  // Apply IP affinity boosts
  const ipUpdates: typeof next.ips = {};
  for (const [ipId, boost] of Object.entries(ipAffinityBoosts)) {
    const ip = next.ips[ipId];
    if (ip) {
      ipUpdates[ipId] = {
        ...ip,
        fanAffinity: Math.min(100, ip.fanAffinity + boost),
      };
    }
  }

  next = {
    ...next,
    activeSales: { ...next.activeSales, ...saleUpdates },
    ips: { ...next.ips, ...ipUpdates },
    studio: {
      ...next.studio,
      cash: next.studio.cash + cashBonus,
      lifetimeRevenue: next.studio.lifetimeRevenue + cashBonus,
      reputation: Math.min(100, next.studio.reputation + repBonus),
      awardsWon: next.studio.awardsWon + playerWins.length,
    },
  };

  // Summary log
  const headline = playerWins.some((a) => a.category === "goty")
    ? `🏆 GAME OF THE YEAR — ${playerWins.find((a) => a.category === "goty")!.projectName}`
    : `Awards: ${playerWins.length} wins`;

  next = appendLog(next, {
    category: "event",
    headline,
    body: `+${repBonus} reputation${cashBonus > 0 ? `, +$${Math.round(cashBonus / 100).toLocaleString()}` : ""}. Awards: ${playerWins.map((a) => AWARD_DISPLAY_NAMES[a.category]).join(", ")}.`,
    severity: "success",
  });

  // Clear the campaign boost entry — it's a one-shot per-year voter bias.
  // Must happen at the very end (success or no-wins path) so a zero-wins
  // year doesn't leave the boost hanging into next year's ceremony.
  if (campaignBoost > 0) {
    const newMetadata = { ...next.metadata };
    delete newMetadata.gotyCampaignBoost;
    next = { ...next, metadata: newMetadata };
  }

  return next;
}
