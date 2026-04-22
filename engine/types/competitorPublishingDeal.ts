// CompetitorPublishingDeal — the *inverse* of PublishingDeal.
//
// PublishingDeal:           an industry publisher takes on YOUR game for distribution.
// CompetitorPublishingDeal: YOUR (player-owned) publisher imprint takes on a
//                           COMPETITOR's next game for distribution.
//
// The mechanic mirrors how the existing publisher-offers-you flow works, but
// from the other side: the player picks a competitor whose next release looks
// promising (or whose cash-strapped state makes them likely to sign), pays an
// advance, and in return takes a revenue share off the top of that
// competitor's next released game.
//
// Lifecycle:
//   "offered"   → not used yet (competitor accept/decline is resolved
//                 immediately at sign-time today; reserved for future
//                 negotiation flows)
//   "active"    → competitor agreed; advance has been paid; waiting for them
//                 to ship a game before the deal expires
//   "fulfilled" → competitor shipped; cut was taken; appliedToGameId is set
//   "expired"   → competitor never shipped within the window; deal closes
//                 with no payback (advance is gone)
//   "declined"  → competitor refused at sign-time

import type { ID, Money } from "./core";

export type CompetitorPublishingDealStatus =
  | "active"
  | "fulfilled"
  | "expired"
  | "declined";

export interface CompetitorPublishingDeal {
  id: ID;
  publisherId: ID;           // player-owned publisher imprint
  competitorId: ID;          // the studio signed
  advanceAmount: Money;      // paid upfront at sign time
  revenueShare: number;      // 0..1 — fraction of competitor game revenue
  signedDate: string;        // ISO
  expiresDate: string;       // ISO — if no release by then, deal expires
  status: CompetitorPublishingDealStatus;
  // Tracking
  appliedToGameId?: ID;      // CompetitorGame.id once fulfilled
  revenueCollected: Money;   // total cut taken (0 until fulfilled)
}
