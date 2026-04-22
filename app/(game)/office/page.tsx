"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { OfficeCanvas } from "@/components/ui/OfficeCanvas";
import { formatMoney } from "@/lib/format";
import { ROOM_KINDS, OFFICE_TIER_BY_ID } from "@/engine";
import type { RoomKind, OfficeTier, RoomTier } from "@/engine";

const TIER_ORDER: OfficeTier[] = [
  "garage",
  "apartment",
  "small_office",
  "floor",
  "corporate",
  "campus",
  "global_hq",
];

const stickerHeading: React.CSSProperties = {
  background: "var(--mustard)",
  color: "var(--ink)",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

const cardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "3px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "5px 5px 0 var(--ink)",
};

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  children,
  full,
  size = "md",
}: {
  tone?: "teal" | "pink" | "default";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  full?: boolean;
  size?: "sm" | "md";
}) {
  const bg = disabled
    ? "var(--cream-2)"
    : tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
        ? "var(--pink)"
        : "var(--cream)";
  const color = disabled ? "var(--ink-soft)" : tone === "default" ? "var(--ink)" : "#fff";
  const pad = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${pad} ${full ? "w-full" : ""}`}
      style={{
        background: bg,
        color,
        border: "2.5px solid var(--ink)",
        borderRadius: 10,
        boxShadow: disabled ? "none" : "2px 2px 0 var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

const selectableButton = (active: boolean): React.CSSProperties => ({
  background: active ? "var(--mustard)" : "var(--cream)",
  color: "var(--ink)",
  border: "2.5px solid var(--ink)",
  borderRadius: 10,
  boxShadow: active ? "3px 3px 0 var(--ink)" : "2px 2px 0 var(--ink)",
  padding: "6px 10px",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.04em",
  textAlign: "left",
});

const numberInputStyle: React.CSSProperties = {
  background: "var(--cream-2)",
  color: "var(--ink)",
  border: "2.5px solid var(--ink)",
  borderRadius: 8,
  padding: "4px 6px",
  fontFamily: "var(--font-display)",
};

export default function OfficePage() {
  const state = useGameStore((s) => s.state);
  const upgradeOffice = useGameStore((s) => s.upgradeOffice);
  const addRoom = useGameStore((s) => s.addRoom);
  const removeRoom = useGameStore((s) => s.removeRoom);

  const [selectedKind, setSelectedKind] = useState<RoomKind | null>(null);
  const [selectedTier, setSelectedTier] = useState<RoomTier>(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  if (!state) return null;

  const employed = Object.values(state.staff).filter((s) => s.status === "employed");
  const working = employed.filter((s) => s.currentProjectId !== null).length;

  const currentTierDef = OFFICE_TIER_BY_ID[state.office.tier];
  const currentIdx = TIER_ORDER.indexOf(state.office.tier);
  const nextTierId =
    currentIdx >= 0 && currentIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentIdx + 1]! : null;
  const nextTierDef = nextTierId ? OFFICE_TIER_BY_ID[nextTierId] : null;
  const canUpgrade = nextTierDef && state.studio.cash >= nextTierDef.upgradeCost;

  const year = parseInt(state.currentDate.slice(0, 4));
  const availableKinds = ROOM_KINDS.filter(
    (k) => k.availableInOfficeTiers.includes(state.office.tier) && year >= k.emergedYear
  );
  const selectedKindDef = selectedKind ? ROOM_KINDS.find((k) => k.kind === selectedKind) : null;
  const installCost = selectedKindDef
    ? selectedKindDef.installCostByTier[selectedTier - 1] ?? 0
    : 0;
  const canAffordRoom = selectedKindDef && state.studio.cash >= installCost;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          OFFICE
        </h2>
        <span
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs"
          style={{
            background: "var(--cream-2)",
            color: "var(--ink)",
            border: "2.5px solid var(--ink)",
            boxShadow: "3px 3px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
          }}
        >
          {(currentTierDef?.name ?? state.office.tier).toUpperCase()} · {state.office.city}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          <Panel title="FLOOR PLAN">
            <OfficeCanvas />
          </Panel>

          <Panel title="ADD ROOM">
            <div className="space-y-3">
              <div>
                <div
                  className="text-xs mb-2"
                  style={{
                    color: "var(--ink-soft)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.06em",
                  }}
                >
                  ROOM TYPE
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableKinds.map((k) => (
                    <button
                      key={k.kind}
                      onClick={() => setSelectedKind(k.kind)}
                      style={selectableButton(selectedKind === k.kind)}
                      className="text-xs"
                    >
                      <div style={{ fontWeight: 700 }}>
                        {k.iconHint} {k.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedKindDef && (
                <>
                  <div
                    className="text-xs p-3 rounded-xl"
                    style={{
                      background: "var(--cream-2)",
                      border: "2.5px solid var(--ink)",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {selectedKindDef.description}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div
                        className="text-[10px] mb-1"
                        style={{
                          color: "var(--ink-soft)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        TIER
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTier(t as RoomTier)}
                            className="px-3 py-1 text-xs"
                            style={selectableButton(selectedTier === t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[10px] mb-1"
                        style={{
                          color: "var(--ink-soft)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        GRID X
                      </div>
                      <input
                        type="number"
                        value={posX}
                        onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                        min={0}
                        max={state.office.gridWidth - 1}
                        className="w-full text-xs"
                        style={numberInputStyle}
                      />
                    </div>
                    <div>
                      <div
                        className="text-[10px] mb-1"
                        style={{
                          color: "var(--ink-soft)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        GRID Y
                      </div>
                      <input
                        type="number"
                        value={posY}
                        onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                        min={0}
                        max={state.office.gridHeight - 1}
                        className="w-full text-xs"
                        style={numberInputStyle}
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between text-xs flex-wrap gap-2">
                    <div style={{ color: "var(--ink-soft)" }}>
                      Size {selectedKindDef.defaultWidth}×{selectedKindDef.defaultHeight} · Capacity +
                      {selectedKindDef.capacityByTier[selectedTier - 1]} · Upkeep $
                      {Math.round(
                        (selectedKindDef.monthlyUpkeepByTier[selectedTier - 1] ?? 0) / 100
                      ).toLocaleString()}
                      /mo
                    </div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md tabular"
                      style={{
                        background: canAffordRoom ? "var(--teal)" : "var(--cream-2)",
                        color: canAffordRoom ? "#fff" : "var(--ink-soft)",
                        border: "2px solid var(--ink)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                      }}
                    >
                      {formatMoney(installCost)}
                    </span>
                  </div>

                  <ActionButton
                    full
                    tone="teal"
                    onClick={() => {
                      addRoom({ kind: selectedKind!, tier: selectedTier, x: posX, y: posY });
                    }}
                    disabled={!canAffordRoom}
                  >
                    INSTALL {selectedKindDef.name.toUpperCase()}
                  </ActionButton>
                </>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="STATS">
            <div className="space-y-3">
              <Stat label="CAPACITY" value={`${employed.length} / ${state.office.totalCapacity}`} />
              <Stat label="AT WORK" value={working} tone="good" />
              <Stat label="IDLE" value={employed.length - working} />
              <Stat label="AMENITY SCORE" value={state.office.amenityScore} />
              <Stat label="GRID" value={`${state.office.gridWidth}×${state.office.gridHeight}`} />
              <Stat label="MONTHLY RENT" value={formatMoney(state.office.monthlyRent)} />
            </div>
          </Panel>

          {nextTierDef && (
            <Panel title="UPGRADE OFFICE">
              <div className="space-y-3">
                <div>
                  <div className="text-[10px]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                    NEXT
                  </div>
                  <div style={{ color: "var(--pink-deep)", fontWeight: 700, fontSize: "1rem" }}>
                    {nextTierDef.name}
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  {nextTierDef.description}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MiniStat
                    label="GRID"
                    value={`${nextTierDef.gridWidth}×${nextTierDef.gridHeight}`}
                  />
                  <MiniStat label="MAX STAFF" value={`${nextTierDef.maxStaff}`} />
                  <MiniStat
                    label="NEW RENT"
                    value={`${formatMoney(nextTierDef.monthlyRent)}/mo`}
                  />
                  <MiniStat
                    label="COST"
                    value={formatMoney(nextTierDef.upgradeCost)}
                    highlight={canUpgrade ? "good" : "dim"}
                  />
                </div>
                <ActionButton
                  full
                  tone="teal"
                  disabled={!canUpgrade}
                  onClick={() => {
                    if (
                      confirm(
                        `Upgrade to ${nextTierDef.name} for ${formatMoney(nextTierDef.upgradeCost)}?`
                      )
                    ) {
                      upgradeOffice();
                    }
                  }}
                >
                  UPGRADE
                </ActionButton>
              </div>
            </Panel>
          )}

          <Panel title={`ROOMS (${state.office.rooms.length})`}>
            {state.office.rooms.length === 0 ? (
              <div className="text-xs py-2" style={{ color: "var(--ink-soft)" }}>
                No rooms yet.
              </div>
            ) : (
              <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
                {state.office.rooms.map((r) => {
                  const def = ROOM_KINDS.find((k) => k.kind === r.kind);
                  return (
                    <div key={r.id} className="p-2" style={cardStyle}>
                      <div className="flex justify-between items-baseline">
                        <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                          {def?.iconHint} {def?.name}
                        </span>
                        <span
                          className="inline-block px-1.5 rounded-md tabular text-[10px]"
                          style={{
                            background: "var(--purple)",
                            color: "#fff",
                            border: "1.5px solid var(--ink)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          T{r.tier}
                        </span>
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>
                        ({r.x}, {r.y}) · cap {r.capacity} · $
                        {Math.round(r.monthlyUpkeep / 100).toLocaleString()}/mo
                      </div>
                      <div className="mt-2">
                        <ActionButton
                          full
                          tone="pink"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Remove this ${def?.name ?? r.kind}? No refund.`)) {
                              removeRoom(r.id);
                            }
                          }}
                        >
                          REMOVE
                        </ActionButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "good" | "dim";
}) {
  return (
    <div
      className="rounded-xl px-2 py-1"
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        boxShadow: "2px 2px 0 var(--ink)",
      }}
    >
      <div
        className="text-[9px]"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        className="tabular text-sm"
        style={{
          color:
            highlight === "good"
              ? "var(--pink-deep)"
              : highlight === "dim"
                ? "var(--ink-soft)"
                : "var(--ink)",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}
