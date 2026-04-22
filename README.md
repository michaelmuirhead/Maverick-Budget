# Maverick Game Tycoon

A browser-based game studio business sim spanning 1980–2045. Build your studio from a garage to a global empire, ship the classics, license your engine to rivals, survive the live-service era, and ride the waves of 60+ years of industry history.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Zustand** for state management
- **Tailwind** for styling
- **Saturday-morning vector cartoon** aesthetic — thick ink borders, cream panels with offset drop shadows, hot pink / teal / mustard / purple accents. Paytone One display + Fredoka body. Motion level 2: idle on decorative backdrop, hover-only on interactive UI. Start screen gets a louder motion envelope (spinning rays, wobbling cartridges, idle-jiggling CTA).

## Architecture

Pure simulation engine + React UI shell — same pattern as Maverick Sports Agency / Ground Floor.

```
/engine         Pure TypeScript simulation (no React, no DOM)
  /core         tick loop, RNG, time, state, newGame, ids, log
  /systems      development, release, bugs, dlc, hiring, rnd,
                engineBuilder, competitors, reputation, marketShifts,
                marketing, office, publishers, contracts, ips, awards,
                events, economy, consoles, staffGenerator
  /data         genres, themes, platforms, techTree, features,
                engines, traits, outlets, competitors, officeRooms,
                events, eras, publishers, marketing
  /types        strict type definitions
  index.ts      public API

/store          Zustand bridge + localStorage persistence
/app            Next.js routes (game shell + 14 screens)
/components     React UI (Panel, Stat, Progress, TopBar, GameShell, ...)
/lib            formatting helpers
```

### Engine system tick (once per simulated day)

Every in-game day, the pure `tickOneDay(state)` function runs:

1. Advance date
2. Development — active projects accumulate quality axes from team stats + slider weights, generate and fix bugs, accrue tech debt from crunch, drain energy. Quality Control Push pivots the whole team to bug-hunting across every phase at the cost of feature progress
3. DLC development — post-launch addon work runs in parallel with the main pipeline
4. Engine builds — 4-phase engine construction progress
5. Research — tech points accumulate from assigned researchers
6. Release — projects that reach Launch 100% transition to `ready_to_release` and sit at the gate; the player must explicitly approve the release. Once approved, bugs split into visible (freeze reviews) + hidden (surface post-launch), userScore initialized
7. Patch sprints — active sprints apply fixes today; may emit `patch_released`
8. Post-launch bugs — hidden bugs surface, QA Lab passive fixes applied, userScore recomputed
9. Active sales — released games earn daily revenue on a decay curve modulated by live userScore, royalties deducted
10. Competitors — daily release check + monthly strategic decisions (pick genre, pick engine, schedule release)
11. Monthly rollups — rent, engine maintenance, payroll, hiring pool refresh, live-service subscription revenue + player decay + auto-sunset, reputation decay, market-shift rotation
12. Engine currentness decay
13. Yearly rollups — staff aging, scheduled events reset
14. New competitor spawn + bankruptcy check
15. Staff attrition (monthly check)

All systems are pure functions: state-in → state-out, no side effects. React only subscribes through Zustand.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

Standard Next.js app — push to a GitHub repo and connect to Vercel. The build is fully static-compatible (no server-side dependencies beyond Next.js rendering).

## Features

- **8 starting eras** (1980, 1988, 1995, 2000, 2006, 2013, 2020, 2030) with pre-unlocked tech and era-appropriate market
- **43 platforms** with real historical names (Atari 2600 through speculative post-2028 neural platforms)
- **25 genres × 60 themes** with a Genre×Theme affinity matrix; MMO requires an engine
- **84 tech nodes** across 8 branches (graphics, audio, networking, simulation, platform, ai_tools, monetization, input_ux) × up to 7 tiers
- **141+ engine features** unlockable through R&D; HAND-CODED always valid (required pre-1993), sticky-default to your last-used engine on the new-project form
- **21 third-party engines** with realistic lineages (id Tech 1-3, Unreal 1-5, Source/2, CryEngine, Unity, Godot, etc.)
- **Player-built engines** with versioning, public release, and royalty/fee terms
- **25 staff traits** with synergies and conflicts; energy, crunch, tech debt
- **27 review outlets** — print mags → websites → YouTube → streamers → neural feeds
- **Competitor AI** — 12+ rival studios with distinct strategies (prestige/volume/innovator/copycat/etc.), they license player engines and pay royalties
- **Bug system** — visible/hidden split at launch, frozen reviews + live userScore that drags sales, QA Lab passive fixes, patch sprints to burn down hidden bugs, tech debt from crunch, in-dev Quality Control Push for aggressive bug burn-down across every phase
- **Release gate** — games never auto-ship; Launch phase completion parks the project at `ready_to_release` until the player approves
- **DLC & expansions** — declared at concept or added post-launch within the 12-month live window, 5 types (Cosmetic, Content Pack, Expansion, Season Pass, MMO Live Content), hard ceiling (DLC sales ≤ base-game lifetime sales), MMO expansions unified under the same model. Each priced kind is dual-gated: a year floor (Content Pack 1988+, Expansion 1994+, Cosmetic 2003+, Season Pass 2011+) AND a monetization-branch R&D node — your studio has to earn the pipeline before it can ship skins or expansions. Post-Launch Content panel on each released game lets you build from declared plans or add unplanned DLC with a staff picker
- **Sequels** — `MAKE A SEQUEL` button on any released project that cleared Metacritic ≥ 50 or 20k+ lifetime sales. Routes to a prefilled new-project form with the original's title (auto-incremented), genre, theme, audience, and franchise IP wired through — you still pick platforms, engine, scope, and team. Franchise fan affinity carries through the IP record at review/sales time
- **Live services** — MMO/live-game slot cap, subscription revenue, monthly player decay, auto-sunset failing services (with reputation hit)
- **Market shifts** — market-mover events: player and competitor hits spawn genre waves (era_definer / wave / trend) that modulate demand for months before rotating to played-out
- **Reputation system** — studio rep from 0–100, decaying penalty hits from bad launches, sunsetting live services, failed expansions
- **Offices** — tiered spaces with rooms (QA Lab, R&D Wing, Marketing Suite, Server Closet, Office of the Director, etc.), capacity, adjacency bonuses, monthly upkeep
- **IPs, publishers, contracts, marketing campaigns, awards shows** — full supporting systems
- **Dynamic industry events** — E3, GDC, Gamescom, TGS, GOTY Awards, Holiday Rush + scheduled and random events

## Smoke test

```bash
npx tsx engine/smoketest.ts
```

Verifies the core development → release → sales loop end-to-end without the UI.

## License

Private project. Made for Michael Muirhead.
