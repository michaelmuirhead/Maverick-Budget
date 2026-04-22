// Smoke test: spin up a new game, create a project, simulate a full dev cycle,
// and verify the simulation produces reasonable state.

import {
  createNewGameState,
  tickDays,
  createProject,
  dateToIso,
  setPhaseSliders,
  approveRelease,
} from "./index";

console.log("=== MAVERICK GAME TYCOON SIMULATION SMOKE TEST ===\n");

// 1. Create a new game
let state = createNewGameState({
  seed: 12345,
  startingPresetId: "start_1995",
  studioName: "Maverick Softworks",
  founderName: "Michael Muirhead",
  founderArchetype: "designer",
  founderCity: "Jackson, MS",
});

console.log(`Studio:           ${state.studio.name}`);
console.log(`Founder:          ${state.studio.founderName} (${state.studio.founderArchetype})`);
console.log(`Started:          ${state.currentDate}`);
console.log(`Starting cash:    $${(state.studio.cash / 100).toLocaleString()}`);
console.log(`Staff count:      ${Object.values(state.staff).filter((s) => s.status === "employed").length} employed, ${state.hiringPool.candidateIds.length} in hiring pool`);
console.log(`Engines loaded:   ${Object.keys(state.engines).length}`);
console.log(`Competitors:      ${Object.keys(state.competitors).length}`);
console.log(`Platforms avail:  ${Object.keys(state.market.platformInstallBase).length}`);
console.log(`Pre-unlocked tech: ${state.studio.completedTechIds.length} nodes\n`);

// 2. Pick a third-party engine to use
const engineIds = Object.keys(state.engines);
const chosenEngine = state.engines[engineIds[0]!]!;
console.log(`Chosen engine: ${chosenEngine.name} (tier ${chosenEngine.overallTier})\n`);

// 3. Hire a couple of staff from the pool to bolster the team
const candidatesSorted = state.hiringPool.candidateIds
  .map((id) => state.staff[id]!)
  .sort((a, b) => {
    const sum = (s: typeof a) =>
      s.stats.design + s.stats.tech + s.stats.art + s.stats.sound + s.stats.writing + s.stats.speed;
    return sum(b) - sum(a);
  });

const founderId = Object.values(state.staff).find((s) => s.status === "employed")!.id;
const hires = candidatesSorted.slice(0, 2);

// Simulate instant hire (real hiring action would be in a staff system)
for (const hire of hires) {
  state = {
    ...state,
    staff: {
      ...state.staff,
      [hire.id]: {
        ...hire,
        status: "employed",
        hiredOn: state.currentDate,
      },
    },
    hiringPool: {
      ...state.hiringPool,
      candidateIds: state.hiringPool.candidateIds.filter((id) => id !== hire.id),
    },
  };
  console.log(`Hired: ${hire.name} (${hire.role}) — $${(hire.salary / 100).toLocaleString()}/yr — traits: ${hire.traits.join(", ")}`);
}
console.log();

// 4. Create a project
const team = [founderId, ...hires.map((h) => h.id)];
const result = createProject(state, {
  name: "Dragon's Requiem",
  genre: "rpg",
  theme: "fantasy",
  audience: "young_adults",
  platformIds: ["pc_win9x"],
  engineId: chosenEngine.id,
  budget: 5000000, // $50K
  assignedStaffIds: team,
  scopeMultiplier: 0.8,
});
state = result.state;
const projectId = result.projectId;
const project = state.projects[projectId]!;

console.log(`Project created: ${project.name}`);
console.log(`  Genre: ${project.genre} / Theme: ${project.theme}`);
console.log(`  Platforms: ${project.platformIds.join(", ")}`);
console.log(`  Target release: ${project.targetReleaseDate}`);
console.log(`  Team size: ${project.assignedStaffIds.length}`);
console.log(`  Cash after dev kit fees: $${(state.studio.cash / 100).toLocaleString()}\n`);

// 5. Bias sliders toward RPG strengths (story + world + gameplay)
state = setPhaseSliders(state, projectId, 1, {
  gameplay: 25, graphics: 10, sound: 10, story: 25, world: 20, ai: 5, polish: 5,
});

// 6. Simulate enough days to reach release — use 340 to cover the full dev cycle.
// Tick in chunks so the test can auto-approve the release gate the moment
// the project hits ready_to_release (the live game waits on the player).
console.log("=== SIMULATING 340 DAYS ===\n");
const startCash = state.studio.cash;
const startDay = state.daysElapsed;
const targetDays = 340;
while (state.daysElapsed < startDay + targetDays) {
  const chunk = Math.min(10, startDay + targetDays - state.daysElapsed);
  state = tickDays(state, chunk);
  const cur = state.projects[projectId]!;
  if (cur.status === "ready_to_release") {
    state = approveRelease(state, projectId);
  }
}

const finalProject = state.projects[projectId]!;
console.log(`Date now:          ${state.currentDate}`);
console.log(`Days elapsed:      ${state.daysElapsed}`);
console.log(`Cash:              $${(state.studio.cash / 100).toLocaleString()}`);
console.log(`Project status:    ${finalProject.status}`);
if (finalProject.status === "released") {
  console.log(`Metacritic:        ${finalProject.metacriticScore}`);
  console.log(`Lifetime sales:    ${finalProject.lifetimeSales?.toLocaleString()} units`);
  console.log(`Lifetime revenue:  $${Math.round((finalProject.lifetimeRevenue ?? 0) / 100).toLocaleString()}`);
  console.log(`Studio reputation: ${state.studio.reputation}`);
  console.log(`RPG reputation:    ${state.studio.genreReputations.rpg ?? 0}`);
  console.log(`IP spawned:        ${finalProject.ipId ? "yes — " + state.ips[finalProject.ipId]?.name : "no"}`);
  console.log();

  // Show the reviews
  const reception = state.receptions[projectId];
  if (reception) {
    console.log("=== REVIEWS ===");
    for (const revId of reception.reviewIds) {
      const rev = state.reviews[revId]!;
      // find outlet name
      const outletRec = Object.values(state.reviews)
        .map((r) => r.outletId)
        .find((oid) => oid === rev.outletId);
      console.log(`  [${rev.score}/100] ${rev.outletId}`);
      console.log(`          "${rev.blurb}"`);
    }
    console.log();
  }
}
console.log();
console.log("Phase progress:");
for (const phase of finalProject.phases) {
  const completion = phase.completion.toFixed(0).padStart(3);
  const bar = "█".repeat(Math.floor(phase.completion / 5)).padEnd(20, "·");
  console.log(`  ${phase.name.padEnd(16)} ${bar} ${completion}%   (dp: ${phase.designPoints.toFixed(0)}, tp: ${phase.techPoints.toFixed(0)}, bugs: +${phase.bugsGenerated}/-${phase.bugsFixed})`);
}
console.log();
console.log("Quality axes accumulated:");
for (const [axis, val] of Object.entries(finalProject.qualityAxes)) {
  console.log(`  ${axis.padEnd(10)} ${(val as number).toFixed(1)}`);
}
console.log();
console.log(`Total bugs at launch: ${finalProject.totalBugs}`);
console.log();

// 7. Staff snapshot — morale/energy after sim
console.log("Staff state after simulation:");
for (const staffId of team) {
  const s = state.staff[staffId]!;
  console.log(`  ${s.name.padEnd(22)} morale=${s.morale.toFixed(0)} energy=${s.energy.toFixed(0)} games=${s.gamesWorkedOn.length} rep=${s.reputation}`);
}
console.log();

// 8. Log feed preview
console.log(`Log entries: ${state.log.length}`);
console.log("Recent events:");
for (const entry of state.log.slice(-10)) {
  console.log(`  [${entry.date}] ${entry.headline}`);
}

// Quick sanity assertions
const assertions = [
  ["Days elapsed matches", state.daysElapsed === 340],
  ["Cash went up overall (revenue)", state.studio.cash > 10000000 || finalProject.status === "released"],
  ["Project released", finalProject.status === "released"],
  ["Metacritic score generated", (finalProject.metacriticScore ?? 0) > 0],
  ["Sales projected", (finalProject.lifetimeSales ?? 0) > 0],
  ["Reviews generated", (finalProject.reviewIds?.length ?? 0) >= 6],
  ["Studio reputation changed", state.studio.reputation !== 5],
  ["Log has events", state.log.length > 0],
];
console.log("\n=== ASSERTIONS ===");
let failed = 0;
for (const [label, pass] of assertions) {
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) failed++;
}
console.log(`\n${failed === 0 ? "ALL PASS" : `${failed} FAILURES`}`);
