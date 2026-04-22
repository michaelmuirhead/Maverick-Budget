import type { ID, Money } from "./core";

export type OfficeTier =
  | "garage"         // 1 room, 2 staff max
  | "apartment"      // 3 rooms, 5 staff
  | "small_office"   // 6 rooms, 12 staff
  | "floor"          // 12 rooms, 30 staff
  | "corporate"      // 25 rooms, 80 staff
  | "campus"         // 50 rooms, 200 staff
  | "global_hq";     // 100+ rooms, unlimited staff + satellites

export type RoomKind =
  | "dev_room"       // houses developers
  | "art_room"       // artist/animator bonus
  | "audio_booth"    // composer/sound bonus
  | "qa_lab"         // bug burndown
  | "rnd_lab"        // tech point generation
  | "mocap_studio"   // art boost (3D era+)
  | "server_room"    // required for online games
  | "marketing_dept" // marketing effectiveness
  | "legal_biz"      // contract/acquisition bonuses
  | "cafeteria"      // morale
  | "gym"            // energy recovery
  | "lounge"         // morale/creativity
  | "training_room"  // staff stat growth
  | "archive"        // legacy/mentorship bonus
  | "boardroom";     // exec/IPO flavor

export type RoomTier = 1 | 2 | 3 | 4;

export interface Room {
  id: ID;
  kind: RoomKind;
  tier: RoomTier;
  // Grid placement (office layout)
  x: number;
  y: number;
  width: number;
  height: number;
  // Capacity & quality
  capacity: number;     // how many staff can work here
  qualityScore: number; // derived from tier + adjacency
  // Upkeep
  monthlyUpkeep: Money;
  installedOn: string;  // ISO
}

export interface Office {
  id: ID;
  tier: OfficeTier;
  city: string;
  rooms: Room[];
  // Grid dimensions (max footprint)
  gridWidth: number;
  gridHeight: number;
  // Monthly rent/mortgage
  monthlyRent: Money;
  // Aggregate metrics (computed)
  totalCapacity: number;
  amenityScore: number;
}
