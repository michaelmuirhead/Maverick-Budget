# MMORPG & Live-Service Servers — Design Spec

**Status:** Draft v0.2 — open questions resolved, market-mover mechanic added
**Author:** for Michael Muirhead
**Date:** 2026-04-20

A new game category that breaks the ship-and-decay loop the rest of the engine runs on. MMORPGs (and their later cousins — MMOFPS, persistent-world survival, live-service shooters) are **infrastructure businesses**: you don't ship a game, you run one. Done right, they're the most profitable thing in the studio. Done wrong, they're the only thing that can take down a 50-person studio overnight.

---

## 1. Why MMORPGs need their own system

Everything else in the engine assumes:

- A project ships once.
- Revenue follows a decay curve from the release date.
- Quality is locked at launch. (**Resolved**: as of the 2026-04-20 bug system build-out, the engine now models post-launch quality via `visibleBugs`/`hiddenBugs`, a rolling `userScore`, and `PatchSprint` — see `engine/systems/bugs.ts`. MMOs reuse this system and layer content-patch cadence on top.)
- The game stops mattering 18-36 months after release.

MMOs invert all four. They have an **operating cost that scales with success**, **revenue that depends on retention not launch hype**, and a **content treadmill that consumes 30-60% of your studio capacity for years**. They're a strategic commitment, not a project.

---

## 2. New project type: `liveservice`

Add a fourth project category alongside the existing types:

| Type | Revenue model | Lifecycle | Studio cost |
|---|---|---|---|
| Standard release | Unit sales, decay curve | 18-36 mo | One-time dev |
| Sequel | Inherits IP value | Same as standard | One-time dev |
| Engine | Royalties from licensees | Indefinite | Maintenance |
| **MMO / Live-service** | **Subscription / MTX / season pass** | **Indefinite (until sunset)** | **Dev + perpetual LiveOps + servers** |

A live-service project goes through the same dev phases as a normal release (concept → pre-prod → production → polish → launch), then **transitions into a permanent "Operating" state** instead of disappearing into the sales-decay system.

---

## 3. New mechanic: server provisioning

When a live-service game ships, the player must provision **server capacity** before they can launch. This is the new strategic layer.

### Server units

Servers are bought/rented in slots. Each slot has:

- **Region** — NA-East, NA-West, EU-West, EU-Central, JP, APAC, LATAM (8 regions)
- **Capacity** — concurrent players supported (CCU)
- **Monthly cost** — scales with capacity, era, and tech tier
- **Reliability** — uptime % based on hardware tier and your `networking` tech level

Three hardware tiers, unlocked by era and tech tree:

| Tier | Era available | $/mo | Capacity | Notes |
|---|---|---|---|---|
| Co-located rack | 1996+ | $$ | Low | High latency, you babysit it |
| Datacenter lease | 2002+ | $$$ | Medium | The 2003-2010 sweet spot |
| Cloud (AWS-style) | 2008+ | $ per CCU | Elastic | Scales with demand, cheaper at low load, can autoscale |
| Edge / mesh | 2025+ | $ per CCU | Massive | Future-tech, requires endgame networking research |

### Demand & load

Each in-game day:
1. Compute concurrent player demand from your title's `popularity` curve, current marketing, real in-game events, and competitor pressure.
2. Compare to your provisioned CCU.
3. **If demand > capacity:** queues form. Each day of queues drains `playerSatisfaction` (a new state field). Severe queues spawn negative `event` entries (forum thread storms, "the launch was a disaster" review hit pieces from outlets like _PC Gamer_, drops to current `Reputation`).
4. **If demand < 50% capacity:** you're bleeding cash on idle iron. Generates a soft `LogEntry` warning the player to scale down.

This creates a real provisioning game: launch under-spec'd and you eat the [WoW Vanilla launch] forum-fire penalty; launch over-spec'd and you burn through the war chest before subscriber revenue ramps.

---

## 4. Live revenue model

Live-service titles replace the decay curve with a **monthly recurring revenue calculation**:

```
monthlyRevenue = activeSubscribers × monetizationRate
                 - serverCost
                 - liveOpsPayroll
                 - bandwidthCost(CCU)
```

Three monetization models, each unlocked by era:

| Model | Era | Mechanics |
|---|---|---|
| Subscription | 1997+ | Flat $/mo per subscriber. EQ/UO/WoW model. |
| Box + Sub | 1999+ | Initial sale revenue + monthly. |
| Free-to-play + MTX | 2008+ | No purchase wall, revenue from cosmetics/battle passes. ARPU varies wildly with content quality. |
| Hybrid (Battle Pass) | 2018+ | Free entry, seasonal premium tier. The Fortnite-era default. |

The player picks at launch, and the choice is sticky (changing it later → "controversial monetization shift" event, big rep hit, transient subscriber bleed — see _SWG NGE_, _Helldivers PSN_).

---

## 5. The content treadmill

A live game loses ~3-8% of subscribers per month to **natural churn**. To keep the population alive, you must ship **content patches** on a cadence:

- **Minor patch** (every 1-2 months) — small content drop, balance pass. Costs ~10% of a normal release in dev time. Slows churn ~30%.
- **Major content update / season** (every 3-4 months) — new zone, new class, new raid. Costs ~30% of a normal release. Reverses churn for 4-6 weeks.

**Content patches vs. bug patches** — these are two different cadences layered on the same project:

- **Bug patches** use the shared engine-level `PatchSprint` from `engine/systems/bugs.ts` (`startPatchSprint` → `tickPatchSprints` → `patch_released` event). They fix `visibleBugs`, raise `userScore`, and emit `bug_storm` / `launched_in_bad_state` log events when the live game gets rough. MMOs use this system unchanged.
- **Content patches** (this section) are an MMO-only construct modeled as mini-projects with their own dev-capacity cost and churn effect. They do NOT fix bugs; a broken live game needs both cadences running in parallel.
- **Expansion** (every 18-24 months) — full new act. Costs 50-80% of a normal release. Massive subscriber spike (returning players + boxed sales) and a fresh hype window.

> **Terminology note:** "Expansion" here is one instance of the broader DLC system defined in `DLC_AND_EXPANSIONS.md`. The same DLC data model, ceiling rule, and market-mover trigger apply — the ceiling uses `equivalentBaseSales = max(lifetimeBoxSales, peakCCU × 2.5)` for live-service titles. See DLC doc §8 for the MMO reconciliation.

**Staff implication:** assigning crew to a live game's "LiveOps team" locks them into ongoing duty (they aren't available for other projects). A successful MMO might consume 8-15 of your 30 employees, indefinitely.

This creates the central strategic tension: every staff-month spent feeding the MMO is a staff-month not spent shipping new IP.

---

## 6. Tech tree dependencies

The MMO unlock should ride entirely on the **networking** branch — which the README confirms already exists. Suggested dependency chain for new nodes:

```
NETWORKING TIER 3
├── client-server-architecture (req: existing networking T2)
├── persistent-world-database
└── lag-compensation

NETWORKING TIER 4
├── instance-sharding
├── matchmaking-services
└── voip-stack (optional but unlocks harder genres)

NETWORKING TIER 5
├── seamless-world-streaming     (unlocks "AAA MMO")
├── server-side-anti-cheat
└── elastic-cloud-infrastructure  (unlocks cheap scaling)

NETWORKING TIER 6 (2015+)
├── data-driven-liveops           (boosts retention)
└── peer-to-peer-mesh

NETWORKING TIER 7 (2030+)
└── neural-presence-protocol      (VR/MMO-VR enabler)
```

You can ship a tier-3 MMO in 1996 (Meridian 59-tier), but it'll be a small, niche, sub-only game with hard CCU caps. Don't expect to ship a WoW-killer until tier 5.

---

## 7. New screens (Pixel Workshop direction)

Three new screens, one new nav slot:

### a) **Live Ops** tab (replaces a current nav slot when you have ≥1 live game)

A row per live title, each showing:
- Concurrent-player meter (real-time, animated)
- Server load % across regions
- Monthly P&L delta
- Days since last content patch
- Subscriber count + 7-day churn %

Acts like the dashboard's "Active Quests" panel but for ongoing operations. Tap into a single title for the **War Room** (next screen).

### b) **War Room** (per-title detail)

Pixel-art "command bunker" frame containing:
- **Region map** — pixelated world map with brass pins. Each pin shows that region's CCU/cap, with red glow when overloaded.
- **Server rack** — visual list of provisioned servers, drag-to-add new ones (cha-ching on purchase).
- **Patch queue** — kanban of patches in dev / queued / live, each represented as a pixel scroll.
- **Subscriber graph** — chunky pixel bar chart, last 12 months.
- **Threats panel** — competitor releases that are siphoning your players, balance complaints trending in forums, exploit incidents.

### c) **Library** entry (already drafted in the new mockup)

Live games appear with a green border and pulsing "LIVE" tag, showing **all-time net P&L** rather than a single sales figure. Sunset games convert back to a normal entry with their final lifetime totals frozen.

---

## 8. Failure modes (the fun part)

A non-trivial percentage of MMO launches in real life were studio-killers. Model these as discrete, dramatic events the engine can throw:

| Event | Trigger | Effect |
|---|---|---|
| **Launch meltdown** | demand > 200% capacity in first 14 days | -40 reviewer score in week-1 outlet pass; players "stuck in queue" subscribe but never play, churn off after 30 days |
| **Server exploit** | random, weighted by inverse `anti-cheat` tech | duplication or gold-spawn exploit. Devalues in-game economy → mass unsubs unless patched within 7 days |
| **DDoS attack** | random in 2003+, weight grows in 2010+ | Days of downtime. -15 satisfaction per day. Mitigated by edge-tier hosting. |
| **The big sequel killer** | a competitor ships a same-genre MMO within 90 days | Your subscriber count splits. If your retention features are worse, you bleed. |
| **Legal trouble** | RMT in countries that ban it, gambling probes on lootboxes | Forced monetization changes mid-flight. |
| **The sunset spiral** | 12 consecutive months of subscriber decline | Choice point: invest in a Hail-Mary expansion or announce sunset (and convert to free permanent run-down or shutdown). |

---

## 9. Competitor AI changes

The existing `competitors.ts` system already picks genre + engine + release date for rivals. To make MMOs interesting strategically, competitor studios need to:

- **Run their own live games.** A rival MMO competes for your subscribers in the same region, era, and theme.
- **License your engine for their MMO** if your engine has the networking features. Royalty cheques while their game eats your potential market — perfect Maverick Tycoon dilemma.
- **Sometimes blow up their own studio** by mis-launching an MMO. Watching SOE-style implosions in your news feed is content.

---

## 10. Suggested implementation order

If you decide to build this, the cheapest sequence:

1. Add `liveservice` to the `ProjectType` enum and let the dev systems treat it like a normal release through launch. (Half a day of plumbing.)
2. Add a `LiveTitle` shape on `GameState` that one-shot-spawns when a `liveservice` project hits launch. Wire a daily revenue tick that uses placeholder constants. (Now it works end-to-end.)
3. Add server provisioning and the demand/capacity calc. (The first interesting decision.)
4. Add the content patch system + LiveOps staff assignment. (The first interesting tradeoff.)
5. Add competitor MMOs. (Now the world feels alive.)
6. Add the failure-mode event table. (Now it's exciting.)
7. Build the War Room screen. (Now it looks great.)

Each step is independently shippable and the game is more interesting after each one.

---

## 11. Era timing reference

For grounding the random events and unlock dates against real-world history:

- **1996** — Meridian 59 (first graphical MMO). Tier-3 tech sufficient.
- **1997-99** — Ultima Online, EverQuest, Asheron's Call. Subscription model dominant.
- **2003** — Eve Online ships single-shard architecture (sharding tech node payoff).
- **2004** — World of Warcraft. Genre-defining; competitors should pivot hard after this.
- **2007-12** — Sub-model collapse. F2P + MTX rises. _Lord of the Rings Online_ converts in 2010, _Star Wars: The Old Republic_ converts in 2012.
- **2014** — _Destiny_ launches the modern shooter live-service model.
- **2017** — _Fortnite Battle Royale_. Battle pass becomes default.
- **2020+** — Cross-progression, cloud-elastic capacity standard.
- **2030+** — Neural/VR presence MMOs (speculative, fits the existing 1980-2045 era band).

---

## 12. Resolved design rules

These were open in v0.1 — Michael ruled on them 2026-04-20. Locking them in:

1. **MMO is not its own genre.** Any existing genre becomes MMO-eligible once the studio has the required networking tech tier. An "MMO" is a flag on the project (`isLiveService: true`) plus the server/LiveOps systems wrapping it. So you can ship an MMO RPG, an MMO shooter, an MMO sandbox, etc. — they all draw from the same genre×theme affinity matrix as their non-live counterparts, with the MMO flag adding the recurring revenue model and infrastructure cost on top.

2. **MMOs require an in-house engine with MMO tech built in.** Third-party engines cannot ship live-service titles. To build an MMO-capable engine, the player must:
   - Have the relevant `networking` tech nodes researched (tier 3 minimum, tier 5 for AAA-scale)
   - Include the MMO-specific engine features in the engine build (persistent-world DB, sharding, anti-cheat, etc. — these become unlockable feature checkboxes in the engine builder once the tech is researched)
   - Maintain the engine actively — engine currentness decay (already in the tick loop) will eventually break MMO compatibility if neglected
   This makes engine R&D a **prerequisite**, not optional, for entering the MMO business — and it gives a long-term reason to keep building bigger engines. Side benefit: rival studios can license your MMO-capable engine to ship their own MMOs, paying you royalties while competing for your subscribers (the pure Maverick dilemma).

3. **Hard cap of 3 simultaneous live games.** Even if you can afford the staff and servers, the studio cannot operate more than three live titles concurrently. This stops late-game players from owning the entire market via brute force, forces sunset decisions ("we can't launch the new MMO unless we kill Shadowfall first"), and keeps the strategic surface area readable. The cap is part of the studio data model, not soft-enforced — UI greys out the "Convert to live service" toggle when the slots are full.

4. **Failed sunsets damage reputation for one generation of players only.** Reputation hit from a botched MMO launch or a bitter shutdown decays automatically over ~10 in-game years, representing the playerbase aging out. Long-tenured studios can recover from a Star Wars Galaxies-grade disaster eventually — but in the short and medium term it hurts every project's review scores and hype generation. Decay is linear from year 1 to year 10, no permanent stain.

---

## 13. Market-mover effect (NEW)

Hit games reshape the market. A breakout success drags the entire industry's appetite toward its genre×theme combo for a period — competitors pivot, players seek out clones, and the player can ride the wave (or get washed out by it).

### Trigger conditions

A released title becomes a **market mover** when, in any rolling 90-day window post-launch:

- **Sales** exceed the era's 90th percentile *or* its peer-cohort 95th percentile (whichever is higher), AND
- **Hype** at peak ≥ 80 (out of 100) — measured at any point in the launch + first 60 days.

Critical reception is **not required.** A mid-reviewed game that prints money and dominates conversation still moves the market. Examples this models well: _Madden_ outsold most GOTY winners in its prime; _Call of Duty_ hits sold like hotcakes regardless of metacritic; _Genshin Impact_ shifted the F2P market without prestige reviews. Conversely, a critical darling with weak sales (think _Psychonauts_ at launch) does **not** move the market — the industry only chases what sells loudly.

### Effect

When a title triggers, set a **market-shift** record on `MarketState`:

```ts
type MarketShift = {
  triggeredBy: string;          // releaseId
  genreId: string;
  themeId: string;
  startDate: IsoDate;
  endDate: IsoDate;             // start + duration
  demandMultiplier: number;     // 1.25 to 1.75 — see below
  saturationCount: number;      // how many copycats have shipped since
};
```

Active shifts add a multiplier to the demand calculation for any project matching that exact genre×theme combo (or, with diminished effect, just-genre or just-theme matches). The multiplier compounds with the existing era/preset demand baseline.

### Magnitude scale

The size of the multiplier scales with how dominant the hit was:

| Tier | Trigger | Multiplier | Duration |
|---|---|---|---|
| Trend | Sales > 90th, hype ≥ 80 | ×1.25 | 18 months |
| Wave | Sales > 95th, hype ≥ 90 | ×1.50 | 30 months |
| Era-definer | Sales > 99th, hype ≥ 95 | ×1.75 | 48 months |

_Doom_ (1993), _Half-Life_ (1998), _GTA III_ (2001), _WoW_ (2004), _Minecraft_ (2011), _Fortnite_ (2018) would all be era-definers. Most years will see 0–1 trends, occasional waves, and a handful of era-definers per decade.

### Saturation decay

Each subsequent release in the same genre×theme that ships during an active shift increments `saturationCount`. The effective multiplier scales down with saturation:

```
effectiveMultiplier = 1 + (rawMultiplier - 1) × max(0.2, 1 - saturationCount × 0.15)
```

So an era-definer at ×1.75 still gives the next shipper roughly ×1.64, but by the 8th copycat the bonus is essentially gone. This recreates the real industry pattern where the third Battle Royale clone ate well, the eighth one starved.

### Player & competitor implications

- **Player can ride waves with sequels.** A sequel to a market-mover keeps most of the bonus (sequels get a personalized affinity boost in the existing system) — strong incentive to greenlight a sequel fast after a hit.
- **Competitors will pivot.** Modify the competitor strategic-decision tick (already monthly per the README) so that during an active shift, competitors with `copycat` or `volume` strategy are 3-5× more likely to pick the trending genre×theme. Their `prestige` and `innovator` rivals largely ignore the trend.
- **The wave is a finite resource.** Once the multiplier expires, demand for that combo can actually undershoot baseline for ~12 months ("the genre is played out" effect) before normalizing. Late-arrivals to an expired wave get punished.
- **Market movers go in the player's Library.** A "🌊 MARKET MOVER" badge sits alongside the GOTY and outlet badges on the cartridge in the Library screen. These are the games the studio is remembered for in industry history.
- **MMOs and live-service titles can also trigger,** measured on **peak concurrent subscribers** instead of peak hype, with sales = lifetime gross at the trigger-window check. _WoW_ becomes the canonical case.

### New screens / UI surfaces

- **Market Trends panel** added to the existing `market` route — lists active shifts with their demand multipliers, saturation counts, and time remaining. In Pixel Workshop style: a "Wind Direction" dial (literal pixel-art weather vane) with the trending genre×theme tags pinned around it.
- **Hub notification** when a new shift triggers ("THE MARKET HAS MOVED · Cyberpunk Shooters surge"), ideally with a one-tap shortcut to start a project in that combo.

### Implementation hooks in current engine

- New file: `engine/systems/marketShifts.ts` — pure function `evaluateMarketShifts(state) → MarketShift[]` invoked by the release tick when a project hits a milestone.
- Extend `MarketState` (in `engine/types/market.ts`) with `activeShifts: MarketShift[]`.
- Modify the demand-side of the release/sales calculation to apply the multiplier from any matching active shift.
- Modify `competitors.ts` monthly strategic decision to bias genre/theme selection on active shifts, weighted by their strategy archetype.

This system is independent of the MMO build and could ship before, with, or after the live-service work.

