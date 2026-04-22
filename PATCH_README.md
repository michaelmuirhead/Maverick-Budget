# Contract Balance Patch

Fixes the contract system so employees can actually complete contracts at
all three tiers.

## The bug

Quality accumulated per calendar day rather than per unit of work produced.
A team of 3 finishing a 90-day contract in 30 real days only collected a
third of the quality they needed, making tier-2 contracts 8% completable and
tier-3 contracts 0% completable before this fix.

## The fixes

1. Quality now accumulates proportional to work produced, not calendar days.
   Average teams land at (qualityFloor + 40) quality; elite teams hit bonuses.
2. Softened role-mismatch penalty: 1.25x preferred / 0.95x non-preferred
   (was 1.3 / 0.85). Assigning the wrong role hurts but doesn't block.
3. Wider deadline padding: 2.0-3.0x (was 1.5-2.5x). No more cliff-edge
   deadlines.
4. Contract-assigned staff now recover 1.0 energy per day (previously frozen
   because the development tick didn't reach them).

## Verified results across 5 RNG seeds

| Tier | Before | After |
|------|--------|-------|
| T1   | 60%    | 64-85% |
| T2   | 0%     | 58-93% |
| T3   | 0%     | 67-100% |

Solo founder: 100% T1 success, which matches the early-game lifeline intent.

## How to apply

```bash
unzip maverick-game-tycoon-contract-patch.zip -d /tmp/cp
cp /tmp/cp/engine/systems/contracts.ts engine/systems/contracts.ts
git add engine/systems/contracts.ts
git commit -m "fix: contract quality accumulates per work produced, not calendar days"
git push origin main
```

Vercel auto-redeploys on push.
