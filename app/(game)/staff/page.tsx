"use client";

// Staff screen — cartoon palette.
//
// Two tabs: ROSTER (current employees + team-strengths radar) and HIRING POOL
// (monthly candidates). All visual treatments use the cartoon system tokens
// (ink, cream, pink, teal, mustard, purple) and sticker-style cards/pills so
// this screen sits inside the same visual world as Finance / Market / IPs.
//
// Behavior is identical to the previous amber-era page — same actions, same
// confirms, same store wiring. Only styling has changed.

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatMoney, cn } from "@/lib/format";
import { TeamSkillsRadar } from "@/components/staff/TeamSkillsRadar";

export default function StaffPage() {
  const state = useGameStore((s) => s.state);
  const hireCandidate = useGameStore((s) => s.hireCandidate);
  const fireStaff = useGameStore((s) => s.fireStaff);
  const giveRaise = useGameStore((s) => s.giveRaise);
  const [tab, setTab] = useState<"roster" | "pool">("roster");

  if (!state) return null;

  const employed = Object.values(state.staff).filter((s) => s.status === "employed");
  const candidates = state.hiringPool.candidateIds
    .map((id) => state.staff[id])
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Sticker heading + tab pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl"
          style={{
            background: "var(--purple)",
            color: "#fff",
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.08em",
          }}
        >
          STAFF
        </h2>
        <div className="ml-auto flex gap-2">
          <TabPill active={tab === "roster"} onClick={() => setTab("roster")}>
            ROSTER ({employed.length})
          </TabPill>
          <TabPill active={tab === "pool"} onClick={() => setTab("pool")}>
            HIRING POOL ({candidates.length})
          </TabPill>
        </div>
      </div>

      {tab === "roster" && employed.length > 0 && (
        <Panel title="TEAM STRENGTHS">
          <TeamSkillsRadar
            staff={Object.values(state.staff).filter(
              (s): s is NonNullable<typeof s> => Boolean(s)
            )}
          />
        </Panel>
      )}

      {tab === "roster" && (
        <Panel title="CURRENT ROSTER">
          {employed.length === 0 ? (
            <div
              className="text-sm py-2"
              style={{ color: "var(--ink-soft)" }}
            >
              No employees yet — head over to the hiring pool.
            </div>
          ) : (
            <div className="space-y-3">
              {employed.map((s) => {
                const assignedTo = s!.currentProjectId
                  ? state.projects[s!.currentProjectId]?.name ?? "—"
                  : "free";
                return (
                  <StaffCard key={s!.id}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-display)",
                            fontSize: "1.05rem",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {s!.name}{" "}
                          <span
                            className="text-xs"
                            style={{
                              color: "var(--ink-soft)",
                              fontFamily: "var(--font-body)",
                              fontWeight: 600,
                            }}
                          >
                            · {s!.role} · age {s!.age}
                          </span>
                        </div>
                        {s!.traits.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {s!.traits.map((t) => (
                              <TraitChip key={t}>{t}</TraitChip>
                            ))}
                          </div>
                        )}
                        <div className="text-xs mt-2">
                          {assignedTo === "free" ? (
                            <span
                              style={{
                                background: "var(--cream-2)",
                                border: "2px solid var(--ink)",
                                borderRadius: 999,
                                padding: "2px 10px",
                                color: "var(--ink-soft)",
                                fontWeight: 700,
                                boxShadow: "2px 2px 0 var(--ink)",
                              }}
                            >
                              FREE
                            </span>
                          ) : (
                            <span
                              style={{
                                background: "var(--teal)",
                                color: "#fff",
                                border: "2px solid var(--ink)",
                                borderRadius: 999,
                                padding: "2px 10px",
                                fontWeight: 700,
                                boxShadow: "2px 2px 0 var(--ink)",
                              }}
                            >
                              ON: {assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <ActionButton
                          tone="teal"
                          onClick={() => {
                            if (confirm(`Give ${s!.name} a 10% raise?`))
                              giveRaise(s!.id, 10);
                          }}
                        >
                          + RAISE
                        </ActionButton>
                        <ActionButton
                          tone="pink"
                          onClick={() => {
                            if (
                              confirm(
                                `Fire ${s!.name}? This will pay 2 months severance and hurt team morale.`
                              )
                            ) {
                              fireStaff(s!.id);
                            }
                          }}
                        >
                          FIRE
                        </ActionButton>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                      <StatSticker label="DES" value={s!.stats.design} />
                      <StatSticker label="TECH" value={s!.stats.tech} />
                      <StatSticker label="ART" value={s!.stats.art} />
                      <StatSticker label="SND" value={s!.stats.sound} />
                      <StatSticker label="WRT" value={s!.stats.writing} />
                      <StatSticker label="SPD" value={s!.stats.speed} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                      <BarRow label="Morale" value={s!.morale} tone={s!.morale < 40 ? "bad" : s!.morale < 65 ? "warn" : "good"} />
                      <BarRow label="Energy" value={s!.energy} tone={s!.energy < 30 ? "bad" : s!.energy < 60 ? "warn" : "good"} />
                      <BarRow label="Burnout" value={s!.health} tone={s!.health < 30 ? "bad" : s!.health < 60 ? "warn" : "good"} />
                      <BarRow label="Loyalty" value={s!.loyalty} />
                    </div>

                    <div
                      className="text-xs mt-2.5"
                      style={{ color: "var(--ink-soft)", fontWeight: 600 }}
                    >
                      {formatMoney(s!.salary)}/yr · {s!.gamesWorkedOn.length}{" "}
                      games · rep {s!.reputation}
                    </div>
                  </StaffCard>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {tab === "pool" && (
        <Panel
          title="HIRING POOL"
          headerRight={
            <span
              className="text-xs"
              style={{ color: "var(--ink-soft)", fontWeight: 600 }}
            >
              refreshes monthly
            </span>
          }
        >
          {candidates.length === 0 ? (
            <div
              className="text-sm py-2"
              style={{ color: "var(--ink-soft)" }}
            >
              No candidates this month. Check back when the calendar rolls over.
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((s) => {
                const signingBonus = Math.round(s!.salary * 0.1);
                const canAfford = state.studio.cash >= signingBonus;
                return (
                  <StaffCard key={s!.id}>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-display)",
                            fontSize: "1.05rem",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {s!.name}{" "}
                          <span
                            className="text-xs"
                            style={{
                              color: "var(--ink-soft)",
                              fontFamily: "var(--font-body)",
                              fontWeight: 600,
                            }}
                          >
                            · {s!.role} · age {s!.age}
                          </span>
                        </div>
                        {s!.traits.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {s!.traits.map((t) => (
                              <TraitChip key={t}>{t}</TraitChip>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                          <StatSticker label="DES" value={s!.stats.design} />
                          <StatSticker label="TECH" value={s!.stats.tech} />
                          <StatSticker label="ART" value={s!.stats.art} />
                          <StatSticker label="SND" value={s!.stats.sound} />
                          <StatSticker label="WRT" value={s!.stats.writing} />
                          <StatSticker label="SPD" value={s!.stats.speed} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-display)",
                            fontSize: "1.05rem",
                          }}
                          className="tabular"
                        >
                          {formatMoney(s!.salary)}/yr
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--ink-soft)", fontWeight: 600 }}
                        >
                          + {formatMoney(signingBonus)} signing
                        </div>
                        <ActionButton
                          tone={canAfford ? "teal" : "default"}
                          onClick={() => hireCandidate(s!.id)}
                          disabled={!canAfford}
                          className="mt-2"
                        >
                          HIRE
                        </ActionButton>
                      </div>
                    </div>
                  </StaffCard>
                );
              })}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- helpers */

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "var(--pink)" : "var(--cream)",
        color: active ? "#fff" : "var(--ink)",
        borderColor: "var(--ink)",
        fontFamily: "var(--font-display)",
        fontSize: "0.78rem",
        letterSpacing: "0.08em",
        boxShadow: "3px 3px 0 var(--ink)",
        borderRadius: 999,
        padding: "0.3rem 0.85rem",
        textShadow: active ? "1px 1px 0 var(--ink)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function StaffCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--cream)",
        border: "3px solid var(--ink)",
        borderRadius: 16,
        boxShadow: "5px 5px 0 var(--ink)",
        padding: "0.95rem 1rem",
      }}
    >
      {children}
    </div>
  );
}

function TraitChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "var(--cream-2)",
        border: "2px solid var(--ink)",
        borderRadius: 999,
        padding: "1px 10px",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "var(--ink)",
        letterSpacing: "0.02em",
        boxShadow: "2px 2px 0 var(--ink)",
        textTransform: "lowercase",
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </span>
  );
}

function ActionButton({
  tone = "default",
  onClick,
  disabled,
  children,
  className,
}: {
  tone?: "default" | "teal" | "pink";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const bg =
    tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
      ? "var(--pink)"
      : "var(--cream)";
  const fg = tone === "default" ? "var(--ink)" : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        background: bg,
        color: fg,
        borderColor: "var(--ink)",
        fontFamily: "var(--font-display)",
        fontSize: "0.78rem",
        letterSpacing: "0.06em",
        textShadow: tone === "default" ? "none" : "1px 1px 0 var(--ink)",
      }}
    >
      {children}
    </button>
  );
}

function StatSticker({ label, value }: { label: string; value: number }) {
  // Tone the value by absolute skill quality.
  const valueColor =
    value >= 75
      ? "var(--teal-deep)"
      : value >= 50
      ? "var(--ink)"
      : "var(--pink-deep)";
  return (
    <div
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        borderRadius: 12,
        boxShadow: "3px 3px 0 var(--ink)",
        padding: "0.35rem 0.45rem",
        textAlign: "center",
        lineHeight: 1.05,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </div>
      <div
        className={cn("tabular")}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.05rem",
          color: valueColor,
          marginTop: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "good" | "warn" | "bad";
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "var(--ink-soft)",
          minWidth: 52,
        }}
      >
        {label.toUpperCase()}
      </span>
      <div className="flex-1">
        <Progress value={value} tone={tone} />
      </div>
    </div>
  );
}
