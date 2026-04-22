"use client";

// Post-Mortem — "what went well, what went wrong, and what to learn for next
// time" readout for a released project. Pure derived view: all math happens
// in engine/systems/postmortem.ts. This component only renders.
//
// Layout:
//   - Headline stat row (Metacritic / launch UserScore / live UserScore / ROI)
//   - Per-axis report card (critic score per axis vs. genre expectation)
//   - Strengths + Weaknesses (two-column note lists)
//   - Forward-looking lessons (severity-badged, sorted critical → watch)

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Progress } from "@/components/ui/Progress";
import { useGameStore } from "@/store/gameStore";
import { formatMoney, cn } from "@/lib/format";
import { computePostMortem } from "@/engine";
import type {
  Project,
  PostMortem,
  PostMortemNote,
  PostMortemLesson,
  LessonSeverity,
  PostMortemNoteCategory,
} from "@/engine";

interface Props {
  project: Project;
}

export function PostMortemPanel({ project }: Props) {
  const state = useGameStore((s) => s.state);
  const [expanded, setExpanded] = useState(true);

  const mortem = useMemo<PostMortem | null>(() => {
    if (!state) return null;
    return computePostMortem(state, project);
  }, [state, project]);

  if (!mortem) return null;

  const {
    metacriticScore,
    initialUserScore,
    liveUserScore,
    visibleBugsAtLaunch,
    hiddenBugsAtLaunch,
    techDebtAtLaunch,
    axisReports,
    budgetUsedPct,
    crunchDaysTotal,
    qcDaysTotal,
    daysInDevelopment,
    staffMoraleAvgAtLaunch,
    netReturn,
    roiMultiple,
    paybackHit,
    launchedInBadState,
    strengths,
    weaknesses,
    lessons,
  } = mortem;

  // Sort lessons: critical → improve → watch
  const sortedLessons = [...lessons].sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  const roiLabel = roiMultiple >= 1
    ? `${roiMultiple.toFixed(1)}×`
    : `${(roiMultiple * 100).toFixed(0)}%`;

  return (
    <Panel
      title="POST-MORTEM"
      headerRight={
        <button onClick={() => setExpanded((e) => !e)}>
          {expanded ? "COLLAPSE" : "EXPAND"}
        </button>
      }
    >
      {/* Headline row — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <Stat
          label="METACRITIC"
          value={metacriticScore}
          tone={metacriticScore >= 85 ? "good" : metacriticScore >= 60 ? "default" : "bad"}
        />
        <Stat
          label="USER SCORE"
          value={liveUserScore}
          sub={liveUserScore !== initialUserScore ? `launched at ${initialUserScore}` : "launch day"}
          tone={
            liveUserScore < metacriticScore - 12 ? "bad" :
            liveUserScore > metacriticScore + 5 ? "good" :
            "default"
          }
        />
        <Stat
          label="ROI"
          value={roiLabel}
          sub={paybackHit ? `+${formatMoney(netReturn)}` : `−${formatMoney(Math.abs(netReturn))}`}
          tone={roiMultiple >= 2 ? "good" : roiMultiple >= 1 ? "default" : "bad"}
        />
        <Stat
          label="BUDGET"
          value={`${budgetUsedPct}%`}
          sub="of plan spent"
          tone={budgetUsedPct > 105 ? "bad" : budgetUsedPct > 95 ? "warn" : "default"}
        />
      </div>

      {!expanded && (
        <div className="text-xs text-[color:var(--amber-dim)]">
          {strengths.length} strengths · {weaknesses.length} weaknesses · {lessons.length} lessons
        </div>
      )}

      {expanded && (
        <>
          {/* Production hygiene row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <Stat
              label="DAYS IN DEV"
              value={daysInDevelopment}
              sub={`${Math.round(daysInDevelopment / 30)} months`}
            />
            <Stat
              label="CRUNCH DAYS"
              value={crunchDaysTotal}
              tone={crunchDaysTotal >= 120 ? "bad" : crunchDaysTotal >= 60 ? "warn" : "good"}
            />
            <Stat
              label="QC DAYS"
              value={qcDaysTotal}
              tone={qcDaysTotal > 0 ? "good" : "default"}
            />
            <Stat
              label="TEAM MORALE"
              value={staffMoraleAvgAtLaunch > 0 ? staffMoraleAvgAtLaunch : "—"}
              tone={
                staffMoraleAvgAtLaunch === 0 ? "default" :
                staffMoraleAvgAtLaunch < 45 ? "bad" :
                staffMoraleAvgAtLaunch < 65 ? "warn" :
                "good"
              }
            />
          </div>

          {/* Launch state row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <Stat
              label="VISIBLE BUGS @ LAUNCH"
              value={visibleBugsAtLaunch}
              tone={launchedInBadState ? "bad" : visibleBugsAtLaunch > 40 ? "warn" : "good"}
            />
            <Stat
              label="HIDDEN BUGS @ LAUNCH"
              value={hiddenBugsAtLaunch}
              tone={hiddenBugsAtLaunch > 60 ? "bad" : hiddenBugsAtLaunch > 25 ? "warn" : "good"}
            />
            <Stat
              label="TECH DEBT @ LAUNCH"
              value={techDebtAtLaunch}
              tone={techDebtAtLaunch > 150 ? "bad" : techDebtAtLaunch > 50 ? "warn" : "good"}
            />
            <Stat
              label="LAUNCH STATE"
              value={launchedInBadState ? "BAD" : "CLEAN"}
              tone={launchedInBadState ? "bad" : "good"}
            />
          </div>

          {/* Per-axis report card */}
          <div className="mb-5">
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mb-2">
              Critic report card by axis
            </div>
            <div className="space-y-2">
              {axisReports
                .filter((r) => r.weight > 0 || r.axisScore > 0)
                .sort((a, b) => b.weight - a.weight)
                .map((r) => {
                  const marquee = r.weight >= 0.18;
                  return (
                    <div key={r.axis}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="uppercase tracking-widest">
                          {r.axis}
                          {marquee && <span className="text-[color:var(--amber-bright)] ml-1">★</span>}
                          <span className="ml-2 text-[10px] text-[color:var(--amber-dim)]">
                            weight {(r.weight * 100).toFixed(0)}%
                          </span>
                        </span>
                        <span className={cn(
                          "tabular",
                          r.vsExpected === "above" && "status-ok",
                          r.vsExpected === "below" && "status-bad",
                        )}>
                          {r.axisScore}/100
                          <span className="ml-2 text-[10px] text-[color:var(--amber-dim)]">
                            {r.vsExpected === "above" ? "↑ above avg" :
                             r.vsExpected === "below" ? "↓ below avg" :
                             "on target"}
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={r.axisScore}
                        tone={
                          r.vsExpected === "above" ? "good" :
                          r.vsExpected === "below" && marquee ? "bad" :
                          "default"
                        }
                      />
                    </div>
                  );
                })}
            </div>
            <div className="text-[10px] text-[color:var(--amber-dim)] mt-2">
              ★ = marquee axis for this genre. Medians across all reviews, compared to the
              Metacritic {metacriticScore} baseline.
            </div>
          </div>

          {/* Strengths + Weaknesses — two-column on sm+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <NoteList
              title="What went well"
              empty="No standout strengths — the game was mid across the board."
              notes={strengths}
              tone="good"
            />
            <NoteList
              title="What went wrong"
              empty="Nothing major — the production held together."
              notes={weaknesses}
              tone="bad"
            />
          </div>

          {/* Forward-looking lessons */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mb-2">
              Lessons for the next project
            </div>
            {sortedLessons.length === 0 ? (
              <div className="text-sm text-[color:var(--amber-dim)]">
                No specific lessons surfaced. Keep doing what works.
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLessons.map((lesson, idx) => (
                  <LessonRow key={idx} lesson={lesson} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}

// -------- helpers --------

function severityRank(s: LessonSeverity): number {
  return s === "critical" ? 0 : s === "improve" ? 1 : 2;
}

function categoryLabel(c: PostMortemNoteCategory): string {
  switch (c) {
    case "quality":    return "QUALITY";
    case "scope":      return "SCOPE";
    case "bugs":       return "BUGS";
    case "team":       return "TEAM";
    case "production": return "PRODUCTION";
    case "market":     return "MARKET";
    case "engine":     return "ENGINE";
  }
}

function NoteList({
  title, notes, empty, tone,
}: {
  title: string;
  notes: PostMortemNote[];
  empty: string;
  tone: "good" | "bad";
}) {
  return (
    <div className="border border-[color:var(--bg-2)] p-3 rounded-[12px]">
      <div className={cn(
        "text-[11px] uppercase tracking-widest mb-2",
        tone === "good" ? "status-ok" : "status-bad",
      )}>
        {title}
      </div>
      {notes.length === 0 ? (
        <div className="text-sm text-[color:var(--amber-dim)] italic">{empty}</div>
      ) : (
        <div className="space-y-3">
          {notes.map((n, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn(
                  "text-sm",
                  tone === "good"
                    ? "text-[color:var(--amber-bright)]"
                    : "text-[color:var(--amber)]",
                )}>
                  {n.headline}
                </span>
                <span className="text-[10px] text-[color:var(--amber-dim)] uppercase tracking-widest shrink-0">
                  {categoryLabel(n.category)}
                </span>
              </div>
              <div className="text-xs text-[color:var(--amber-dim)] mt-1">{n.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson }: { lesson: PostMortemLesson }) {
  const badge =
    lesson.severity === "critical" ? "status-bad" :
    lesson.severity === "improve" ? "text-[color:var(--warn)]" :
    "text-[color:var(--amber-dim)]";
  const label =
    lesson.severity === "critical" ? "CRITICAL" :
    lesson.severity === "improve" ? "IMPROVE" :
    "WATCH";
  return (
    <div className="border border-[color:var(--bg-2)] p-3 rounded-[10px]">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-sm text-[color:var(--amber-bright)]">{lesson.headline}</span>
        <span className="flex gap-2 items-baseline shrink-0">
          <span className="text-[10px] text-[color:var(--amber-dim)] uppercase tracking-widest">
            {categoryLabel(lesson.category)}
          </span>
          <span className={cn("text-[10px] uppercase tracking-widest font-bold", badge)}>
            {label}
          </span>
        </span>
      </div>
      <div className="text-xs text-[color:var(--amber-dim)]">{lesson.rationale}</div>
    </div>
  );
}
