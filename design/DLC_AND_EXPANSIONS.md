# DLC & Expansions — Design Spec

**Status:** Draft v0.1
**Author:** for Michael Muirhead
**Date:** 2026-04-20
**Related docs:** `MMORPG_AND_SERVERS.md` (which this doc supersedes for "expansion" terminology)

DLC is a first-class concept on the **game concept**, not a bolt-on. Every released project — standard, sequel, or MMO — can ship downloadable content that extends the revenue tail, drives a hype re-spike, and (sometimes) carries the brand into a market shift it would otherwise miss. The whole system is built around one hard rule the player can plan against:

> **A DLC can never sell more units than the base game it attaches to has sold (lifetime).**

If the base game sold 300k, the DLC ceiling is 300k. Period. This single constraint shapes pricing, attach rates, marketing, and most importantly the strategic decision of "should I ship DLC for this game or move on."

---

## 1. Why DLC needs its own system

The current engine ships a project, decays it, and forgets it. DLC re-opens that project as a **revenue extension surface**:

- It re-uses the base game's IP, audience, and review-equity rather than starting at zero.
- It costs a fraction of a full release and ships in a fraction of the time.
- It can re-trigger sales of the base game ("DLC bump"), which is sometimes the actual point.
- It interacts with — but is distinct from — sequels (sequel = new project, DLC = same project).

Without a DLC system, the only way to monetize a hit further is a sequel, which is too coarse.

---

## 2. DLC as part of the game concept

DLC is **declared at concept time** as a planning slot, not invented after launch.

Add to the project model:

```ts
type DLCPlan = {
  id: string;
  type: DLCType;
  name: string;          // optional — null until the player names it
  plannedAfterMonths: number; // intended ship date relative to base launch
  scopePoints: number;   // dev cost, in the existing "scope point" unit
  status: 'planned' | 'in_dev' | 'shipped' | 'cancelled';
  releaseId?: string;    // link to the DLCRelease record once shipped
};

type Project = {
  // ...existing fields
  dlcPlans: DLCPlan[];   // empty array if none
};
```

The player can declare 0–N DLC plans during the concept phase. Plans are **non-binding** — they're a roadmap, not a commitment. They can be added, edited, or cancelled until they enter `in_dev`.

Why declare at concept time:
- It signals to the marketing/hype system that this is a "live" title (slight pre-launch hype boost; some critics dock points if it looks like content was carved out — see §9).
- It earmarks future studio capacity in the planner UI.
- It lets the player commit to a season pass at launch (which itself is a DLC type — see §3).

DLC can also be **declared post-launch** with no penalty, but the player loses the season-pass option (you can't sell a season pass after the season started).

---

## 3. DLC types

Five canonical types, each with its own economics. The first four apply to every project type; the fifth is MMO-only.

| Type | Use case | Dev cost (% of base) | Price (% of base) | Attach rate (% of base sales) | Era unlock |
|---|---|---|---|---|---|
| **Cosmetic** | Skin packs, character outfits, color variants | 2-5% | 5-15% | 8-25% | 2003+ |
| **Content pack** | New levels, missions, characters, weapons | 8-20% | 20-40% | 20-50% | 1980 (always) |
| **Expansion** | Substantial new content, sometimes standalone | 30-50% | 40-60% | 30-70% | 1980 (always) |
| **Season pass** | Bundle of all DLC for a window, sold at launch | n/a (sells future content) | 60-100% | 10-30% of launch buyers | 2011+ |
| **MMO live-content** | Patches, seasons, expansions for live-service games | 10-80% (per content treadmill in MMORPG doc §5) | varies (often free; expansions paid) | n/a — drives subs, not unit sales | Once MMO tech tier unlocked |

**Era gating notes.** Content packs and expansions existed in physical-distribution form from day one (mission disks for Wing Commander, expansion sets for Master of Orion), so they're available the whole timeline. Cosmetic DLC barely existed before microtransactions normalized around 2003 (horse armor came in 2006 but the category emerged a couple years earlier). Season passes are a 2011-onward construct (LA Noire, BF3, Saints Row IV-era). The engine should hide unavailable types from the concept-screen DLC planner UI based on the project's launch year.

Notes on each:

**Cosmetic** — cheapest to make, smallest revenue per unit, highest margin. Ceiling rarely binds because attach rate is low. Genre/theme matters: a Stardew-like ships skins poorly, an MMO or shooter ships them well.

**Content pack** — the workhorse. 1-3 of these is the typical "we're not done with this game" signal.

**Expansion** — the heavyweight. Treat as roughly half a project. Can re-trigger market-mover evaluation (see §6). For MMOs, this is the same beast described in `MMORPG_AND_SERVERS.md` §5 — same concept, same data model, same ceiling rule (subscriber-equivalent, see §8).

**Season pass** — must be declared at concept and sold at base launch. Bundles the next 6-12 months of content packs/expansions at a discount. Players who buy it count toward the attach rate of every DLC inside it (with no marginal sale).

**MMO live-content** — covered in detail in the MMORPG doc; treated here only insofar as it shares the data model and ceiling logic.

---

## 4. The hard ceiling rule

> `dlc.unitsSold` ≤ `baseGame.lifetimeUnitsSold` at all times.

This is enforced in the sales tick. It is **not** a soft economic effect — the engine literally caps DLC sales at the base game's running total.

### What "lifetime base sales" means

For each DLC sales tick, look up `baseGame.lifetimeUnitsSold` **as of the tick date**, not as of DLC launch. So a DLC released early in the base game's life is not stuck at the launch-week ceiling — as the base game sells more, the DLC's headroom grows.

### Practical implications

- **Early DLC has a problem.** If you ship DLC two months after a base game that's still ramping, the ceiling is low and the DLC will sell badly even if it's good. The engine should recommend an 8-12 month DLC window for typical releases, longer for slow-burners.
- **Late DLC has a different problem.** Ship DLC three years after a base game and the ceiling is huge but the audience has moved on. Attach rates collapse.
- **Hits get DLC well, flops do not.** A 2M-unit hit can carry 600k DLC sales. A 200k flop cannot ship a financially serious DLC. This is by design — it forces the player to accept that some games are dead and shouldn't be milked.
- **Cosmetic DLC almost never hits the ceiling.** With attach rates of 8-25%, even a flop's ceiling is comfortably above projected sales. So cosmetic DLC remains viable for mid-tier games.

### What happens at the ceiling

If `dlc.unitsSold == baseGame.lifetimeUnitsSold` and a tick would push DLC sales higher, the surplus is **dropped** (not deferred). The engine emits a `dlc_ceiling_hit` event so the UI can show "DLC sales paused — base game must sell more units before more DLC can move."

This creates a real, in-game-visible feedback: hitting the ceiling tells the player "if you want this DLC to keep selling, run a sale on the base game" (which the marketing system already supports).

---

## 5. Pricing & revenue formula

Per DLC, per tick:

```
demand_DLC(t) = base_attach_rate
              × type_multiplier
              × quality_factor          // own quality, 0.6–1.4
              × base_game_review_factor // base game critical score, 0.7–1.3
              × audience_residual(t)    // exponential decay since base launch
              × hype_multiplier         // own marketing/hype, 0.8–1.3

raw_units_DLC(t) = demand_DLC(t) × baseGame.deltaUnitsThisTick
                 + carryover_from_attach_pool

units_DLC(t) = min(
  raw_units_DLC(t),
  baseGame.lifetimeUnitsSold - dlc.unitsSoldSoFar
)
```

The `carryover_from_attach_pool` term models the fact that any base-game purchaser is a candidate for the DLC for their lifetime. Each tick, some fraction of accumulated base-game owners who haven't bought the DLC convert.

`audience_residual(t)` decays slowly — about half-life of 18 months from base launch — so DLC stays viable but with diminishing power.

---

## 6. DLC and market-movers

Per the market-mover mechanic locked in `MMORPG_AND_SERVERS.md` §11:

- A **content pack** cannot trigger a market shift. Too small.
- An **expansion** can trigger a market shift, but only if its attached base game's lifetime sales already cleared the era 90th percentile. (You're riding the base game's existing reach.) Hype threshold is the expansion's own peak hype.
- Active market shifts boost DLC demand the same way they boost base-game demand for matching genre×theme — so a well-timed expansion onto an active wave gets the multiplier.
- Saturation counters increment when an expansion ships into an active shift, same as a new release.

This means the right play, when a market shift hits a genre you already have a hit in, is often "ship the expansion fast" rather than "start a sequel" — sequel takes years, expansion takes months.

---

## 7. Reputation & critical reception

DLC can damage or help studio reputation independently of the base game.

- **Generous DLC** (high-quality content pack/expansion at fair price) → modest rep boost, audience-trust signal.
- **Stingy DLC** (cosmetic at premium price, or content cut from base) → modest rep hit.
- **Day-one DLC** (DLC shipping within 2 weeks of base launch) → **always** triggers a "carved-out content" event. Significant rep hit unless dev cost was clearly additive (engine can detect this from when the DLC entered production relative to base polish phase).
- **Pay-to-win DLC in a competitive multiplayer game** → severe rep hit, ongoing for the life of the game.
- **Free DLC** → small rep boost, drives base-game long-tail sales (which raises the ceiling for any future paid DLC).

Critics review DLC and emit a separate score that **half-weighted** rolls into the base game's "definitive edition" rolling score (used by enterprise-search Library badges and the "should I sequel this" suggestion).

---

## 8. MMO-specific reconciliation

The MMORPG doc (§5) describes minor patches, major content updates / seasons, and expansions. Reconciling with this DLC system:

| MMORPG doc term | This doc | Notes |
|---|---|---|
| Minor patch | MMO live-content (free) | Not a DLC SKU, but uses the same dev-capacity model |
| Major content update / season | Season-pass content OR free MMO live-content | If sold via season pass, attach rate counts; if free, no ceiling |
| Expansion | **Expansion** (DLC type) | Same ceiling logic, but applied to subscriber-equivalents |

### MMO ceiling translation

MMOs don't have a "lifetime unit sales" number in the same shape as a standard release. For ceiling purposes, treat:

```
mmo.equivalentBaseSales = max(
  mmo.lifetimeBoxSales,                // for box-then-subscribe MMOs
  mmo.peakConcurrentSubscribers × 2.5  // rough multiplier of peak CCU to total accounts ever
)
```

This means a 200k-CCU MMO has an expansion ceiling around 500k — which matches the historical pattern (WoW expansions selling several million each off a peak of ~12M subs).

For a free-to-play MMO with no box sales, only the peak-CCU term applies. A 50k-CCU F2P MMO has an expansion ceiling around 125k — small but workable.

### MMO ceiling exceptions (none)

The hard ceiling is a model invariant. There are no exceptions for MMOs, even though "you can't go over peak subscribers" is a softer real-world rule. Keeping the rule rigid keeps the model legible — the player should always be able to reason about expansion sizing from a single number on the title's status panel.

---

## 9. Failure modes

| Failure | Trigger | Effect |
|---|---|---|
| Ceiling-bound DLC | `unitsSold` parks at the ceiling for 3+ months while demand persists | UI prompt to discount/promote the base game; rep neutral |
| Day-one carve-out | DLC shipped within 2 weeks of base launch and clearly built during base dev | Rep hit, audience-trust meter drops |
| Season pass underdelivery | Player promises a season pass but ships less content than the bundle implies | Big rep hit at end of season window; future season-pass attach rate halved on this studio's titles for ~36 months |
| Buggy or low-quality DLC | DLC review score < 60 OR DLC's release returns `launchedInBadState: true` from `splitBugsAtRelease` (≥ size-aware visible-bug threshold at launch; emits `launched_in_bad_state` log event) | Critic reviews drop the DLC's own score; effect propagates back to **base game's rolling user score** at half-weight, which suppresses base-game long-tail sales for ~6 months (applied via `salesDragMultiplier` on the base game's `ActiveSale`). Subsequent `bug_storm` events on the DLC each reduce the base game's sales-drag multiplier further for that storm day. No refund modeling — the penalty is review-driven, not transactional |
| DLC quality skepticism | DLC review score 30+ points lower than base game review score | Each subsequent DLC for this game gets a "quality skepticism" demand penalty (×0.7 attach rate) until a DLC clears the base score |
| DLC fatigue | 5+ DLCs shipped for same base game, with declining attach rates | Audience treats the next DLC as cynical; attach rate floor of 5% of base sales |

---

## 10. UI surfaces

This is a Pixel Workshop product (per project memory). Suggested surfaces, all in Pixel Workshop style:

- **Concept screen** gets a new "Roadmap" tab listing planned DLCs as parchment scrolls pinned below the base game cartridge. Drag-and-drop to reorder.
- **Library cartridge** shows DLC count and total franchise revenue (base + all DLC). Tapping into the cartridge reveals a per-DLC P&L in the same table style as the existing Library detail.
- **Live Ops War Room** (existing) gets a "Content Pipeline" panel — same kanban metaphor as the existing patch queue, but for content packs/expansions instead of patches. Slot already exists in the wireframe (`pixel-workshop-war-room.html`); reuse the patch-scroll pattern.
- **Hub notification** when DLC ships, when DLC hits the ceiling, when an expansion is eligible to ride an active market shift.
- **Ceiling indicator** — on any DLC's status row, show a chunky pixel progress bar of `dlc.unitsSold / baseGame.lifetimeUnitsSold`. Bar turns brass-yellow at 80%, terracotta at 100%.
- **"Definitive Edition" / GOTY bundle action** — once a base game has shipped at least one expansion (or 3+ content packs), a "Bundle as Definitive Edition" action appears on the Library cartridge. Bundling re-launches the title as a **discount event** (not a new release): pulls the price down ~30%, runs a small new-customer hype window (~6 weeks), boosts base-game weekly sales for that window, and proportionally lifts the DLC ceiling. No new project record, no new review cycle, no market-mover trigger. Available 2007+ (when GOTY-edition repackaging became a normalized pattern).

---

## 11. Implementation hooks in current engine

- Extend `engine/types/projects.ts` with `dlcPlans: DLCPlan[]` and a new `DLCRelease` type (sibling of the existing `Release`).
- New file `engine/systems/dlc.ts` exporting `tickDLCSales(state, dlcReleaseId, baseReleaseId, date) → state` — pure, called from the existing daily tick after the base-game sales pass for each shipped DLC.
- New file `engine/systems/dlcPlanning.ts` for the concept-phase plan management (add/edit/cancel plans, season-pass bundling).
- Modify `engine/systems/release.ts` to call into DLC sales after base-sales for each tick, and to compute `equivalentBaseSales` for live-service titles.
- Modify `engine/systems/marketShifts.ts` (planned, per MMORPG doc §11) so that expansion releases run through the same `evaluateMarketShifts` check as base-game releases.
- Modify `engine/systems/reputation.ts` to handle the rep events in §7 and §9.
- Add `dlc_ceiling_hit`, `day_one_dlc_published`, `season_pass_underdelivered` events to the existing event bus.
- DLC releases use the shared bug system in `engine/systems/bugs.ts`: `splitBugsAtRelease` splits total bugs into visible/hidden at launch, `tickPostLaunchBugs` surfaces hidden bugs and drives the DLC's own `userScore`, and a `launched_in_bad_state` log event (from `release.ts`) is what the DLC penalty in §9 keys off of. Patch sprints (`startPatchSprint`) apply to DLCs as first-class citizens — the same dev-capacity pool.

This is an additive system — none of the existing release/decay/market code needs to change shape, only get a new pass appended.

---

## 12. Resolved decisions (2026-04-20)

1. **Mods — yes, as a separate v0.2 system.** See §13 below for the stub. Mods are user-generated and don't have the ceiling rule; they extend the base game's lifetime sales by keeping the title alive longer.
2. **Refunds — no.** The engine does not model transactional refunds. Bad DLC is punished through the existing critic-review pipeline: low DLC scores hit the DLC's own attach rate AND propagate back to the base game's rolling review score at half-weight, which suppresses base-game long-tail sales (and therefore caps the ceiling). See §9 "Buggy or low-quality DLC" row.
3. **Era gating — confirmed.** Content packs and expansions: always available. Cosmetic DLC: 2003+. Season pass: 2011+. MMO live-content: gated by MMO tech tier unlock. Encoded in the §3 type table and enforced in the concept-screen DLC planner UI.
4. **Definitive editions — discount event, confirmed.** GOTY/definitive-edition bundles are a Library-cartridge action that re-launches a title as a discount event with a small new-customer hype window. Not a new release record. Not a new review cycle. Not a market-mover trigger. Available 2007+. See §10 last bullet.

---

## 13. Mods (v0.2 stub)

Mods are user-generated content for the base game. They are **not DLC** — the studio doesn't ship them, doesn't price them, and doesn't earn unit revenue from them. But they materially affect the sim, so they need a model.

**What mods do:**
- Extend the base game's `audience_residual` decay curve. A modded title decays slower — half-life can stretch from the standard 18 months to 36+ months for heavily-modded games.
- Increase the base game's lifetime ceiling, which in turn raises the DLC ceiling per §4. This is the strategic point: a moddable game grows its own DLC headroom.
- Apply a small ongoing rep boost (audience-trust signal: "this studio supports the community").
- Optionally feed into a **mod-marketplace cut** mechanic post-2015 (Skyrim Workshop, Dota 2 Arcade era) — small revenue stream proportional to mod popularity.

**What unlocks mods:**
- A `mod_support` engine feature on the `tools` branch of the engine tech tree, available 1995+ (Doom WAD-era). Not all genres benefit equally (RPGs and strategy games get a much bigger residual boost than narrative or sports titles).
- The player chooses at concept time whether to ship with mod support. It costs a small dev premium (~5-10% of base scope) and locks the studio into supporting community tools post-launch.

**What mods do NOT do:**
- They don't have a ceiling. Mods aren't sold; they don't compete with DLC for the same revenue pool.
- They don't trigger market-mover evaluation. (Though they can extend a base game's eligibility window for triggering a market-mover via late-blooming sales.)
- They don't show up in the Library DLC list.

**Surface in UI:**
- A "MOD SUPPORT" badge on the concept screen and Library cartridge.
- A "Community" stat row on the title's Library detail showing mod count, monthly active modders, and mod-driven residual sales.

Out of scope for v0.1 of the DLC system but not blocked by it; mods can land any time after DLC ships.
