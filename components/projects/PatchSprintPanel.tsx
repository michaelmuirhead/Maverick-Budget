"use client";

// Post-launch health & patch-sprint controls for a single released project.
//
// Shows:
//   - Visible vs hidden bug split, plus the "size-aware" bad-state threshold.
//   - User score vs metacritic gap and the resulting sales-drag multiplier.
//   - Any active patch sprint's progress (days, bugs fixed, staff committed).
//   - Roster of past completed/cancelled sprints.
//   - "Start a new sprint" form (collapsed by default), with name, planned-days
//     slider, employed-staff multi-select, and optional marketing spend.
//
// All math comes from the engine (computeUserScore / salesDragMultiplier),
// so this component is purely presentational + form-state.

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Progress } from "@/components/ui/Progress";
import { useGameStore } from "@/store/gameStore";
import { formatDate, formatMoney, cn } from "@/lib/format";
import {
  computeUserScore,
  salesDragMultiplier,
  PATCH_SPRINT_FIX_PER_STAFF_DAY,
  PATCH_MARKETING_USER_SCORE_BUMP_PER_MILLION_CENTS,
} from "@/engine";
import type { Project, PatchSprint, Staff, ID } from "@/engine";

interface Props {
  project: Project;
}

export function PatchSprintPanel({ project }: Props) {
  const state = useGameStore((s) => s.state)!;
  const startPatchSprint = useGameStore((s) => s.startPatchSprint);
  const cancelPatchSprint = useGameStore((s) => s.cancelPatchSprint);

  // Sprints attached to this project, sorted: active first, then by startDate desc
  const sprints = useMemo<PatchSprint[]>(() => {
    const list = Object.values(state.patchSprints).filter((s) => s.projectId === project.id);
    list.sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      return b.startDate.localeCompare(a.startDate);
    });
    return list;
  }, [state.patchSprints, project.id]);

  const activeSprint = sprints.find((s) => s.status === "active");
  const pastSprints = sprints.filter((s) => s.status !== "active");

  // ---- Health stats ----
  const visible = project.visibleBugs ?? 0;
  const hidden = project.hiddenBugs ?? 0;
  const total = visible + hidden;
  const userScore = project.userScore ?? computeUserScore(project);
  const metacritic = project.metacriticScore ?? 0;
  const gap = userScore - metacritic;
  const dragMult = salesDragMultiplier(project);
  const dragPct = Math.round((dragMult - 1) * 100);

  const visiblePct = total > 0 ? (visible / total) * 100 : 0;

  return (
    <>
      {/* ============ POST-LAUNCH HEALTH ============ */}
      <Panel
        title="POST-LAUNCH HEALTH"
        headerRight={
          project.launchedInBadState ? (
            <span className="status-bad">SHIPPED BROKEN</span>
          ) : undefined
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
          <Stat
            label="VISIBLE BUGS"
            value={visible}
            tone={visible > 50 ? "bad" : visible > 15 ? "warn" : "good"}
            sub={`${hidden} hidden, surfacing`}
          />
          <Stat
            label="USER SCORE"
            value={userScore}
            tone={gap >= 0 ? "good" : gap < -10 ? "bad" : "warn"}
            sub={`${gap >= 0 ? "+" : ""}${gap} vs metacritic ${metacritic}`}
          />
          <Stat
            label="SALES DRAG"
            value={`${dragPct >= 0 ? "+" : ""}${dragPct}%`}
            tone={dragMult >= 1 ? "good" : dragMult <= 0.7 ? "bad" : "warn"}
            sub={`×${dragMult.toFixed(2)} on daily sales`}
          />
          <Stat
            label="POST-LAUNCH FIXES"
            value={project.bugsFixedPostLaunch ?? 0}
            sub={`${project.surfacedBugsToDate ?? 0} hidden surfaced`}
          />
        </div>

        {/* Bug composition bar */}
        {total > 0 && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="uppercase tracking-widest text-[color:var(--amber-dim)]">
                Bug composition
              </span>
              <span className="tabular text-[color:var(--amber-dim)]">
                {visible} visible · {hidden} hidden · {total} total
              </span>
            </div>
            <div className="relative h-3 border border-[color:var(--bg-2)] bg-[color:var(--bg-1)] overflow-hidden">
              {/* Visible portion */}
              <div
                className="absolute inset-y-0 left-0 bg-[color:var(--red)]"
                style={{ width: `${visiblePct}%` }}
              />
              {/* Hidden portion (subdued) */}
              <div
                className="absolute inset-y-0 bg-[color:var(--amber-dim)]"
                style={{ left: `${visiblePct}%`, width: `${100 - visiblePct}%`, opacity: 0.5 }}
              />
            </div>
            <div className="text-[11px] text-[color:var(--amber-dim)] mt-1">
              Hidden bugs surface over time — most within the first month — and drag
              user score as they appear.
            </div>
          </div>
        )}
      </Panel>

      {/* ============ ACTIVE SPRINT ============ */}
      {activeSprint && (
        <ActiveSprintPanel
          sprint={activeSprint}
          onCancel={() => {
            if (confirm(`Cancel patch sprint "${activeSprint.name}"? Any planned final burst will be lost.`)) {
              cancelPatchSprint(activeSprint.id);
            }
          }}
        />
      )}

      {/* ============ START NEW SPRINT ============ */}
      {!activeSprint && (
        <NewSprintForm
          project={project}
          onStart={(input) => {
            const result = startPatchSprint(input);
            if ("error" in result) {
              alert(result.error);
              return false;
            }
            return true;
          }}
        />
      )}

      {/* ============ PAST SPRINTS ============ */}
      {pastSprints.length > 0 && (
        <Panel title={`PAST SPRINTS (${pastSprints.length})`}>
          <div className="space-y-2">
            {pastSprints.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-[color:var(--bg-2)] pb-2 last:border-0"
              >
                <div>
                  <div className="text-sm">
                    <span className={cn(
                      s.status === "completed" ? "status-ok" : "text-[color:var(--amber-dim)]"
                    )}>
                      {s.name}
                    </span>
                    <span className="text-[color:var(--amber-dim)] ml-2">
                      {s.status === "completed" ? "shipped" : "cancelled"}
                    </span>
                  </div>
                  <div className="text-[11px] text-[color:var(--amber-dim)]">
                    {formatDate(s.startDate)}
                    {s.endDate && ` → ${formatDate(s.endDate)}`}
                    {" · "}{s.bugsFixedSoFar} bugs fixed
                    {s.marketingSpend > 0 && ` · ${formatMoney(s.marketingSpend)} marketing`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}

// ============ ACTIVE SPRINT VIEW ============
function ActiveSprintPanel({ sprint, onCancel }: { sprint: PatchSprint; onCancel: () => void }) {
  const state = useGameStore((s) => s.state)!;
  const team: Staff[] = sprint.assignedStaffIds
    .map((sid) => state.staff[sid])
    .filter((s): s is Staff => !!s);

  const pct = sprint.plannedDays > 0 ? (sprint.daysSpent / sprint.plannedDays) * 100 : 0;
  const daysRemaining = Math.max(0, sprint.plannedDays - sprint.daysSpent);

  return (
    <Panel
      title={`ACTIVE SPRINT — ${sprint.name.toUpperCase()}`}
      headerRight={
        <button
          onClick={onCancel}
          className="status-bad border-[color:var(--red)] text-[11px]"
        >
          CANCEL SPRINT
        </button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
        <Stat
          label="DAYS"
          value={`${sprint.daysSpent}/${sprint.plannedDays}`}
          sub={`${daysRemaining} remaining`}
        />
        <Stat label="BUGS FIXED" value={sprint.bugsFixedSoFar} sub="excludes final burst" />
        <Stat label="STAFF" value={team.length} sub="committed full-time" />
        <Stat
          label="MARKETING"
          value={sprint.marketingSpend > 0 ? formatMoney(sprint.marketingSpend) : "—"}
          sub={sprint.marketingSpend > 0 ? "forgiveness boost on ship" : "no campaign"}
        />
      </div>
      <Progress value={pct} showLabel />
      {team.length > 0 && (
        <div className="text-[11px] text-[color:var(--amber-dim)] mt-3">
          Team: {team.map((t) => t.name).join(", ")}
        </div>
      )}
    </Panel>
  );
}

// ============ NEW SPRINT FORM ============
function NewSprintForm({
  project,
  onStart,
}: {
  project: Project;
  onStart: (input: {
    projectId: ID;
    name: string;
    plannedDays: number;
    assignedStaffIds: ID[];
    marketingSpend?: number;
  }) => boolean;
}) {
  const state = useGameStore((s) => s.state)!;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(`${project.name} Patch`);
  const [days, setDays] = useState(21);
  const [marketing, setMarketing] = useState(0);
  const [selected, setSelected] = useState<Set<ID>>(new Set());

  // Eligible staff: employed and either unassigned or already on this project.
  const eligibleStaff = useMemo<Staff[]>(() => {
    return Object.values(state.staff)
      .filter((s) => s.status === "employed")
      .filter((s) => s.currentProjectId == null || s.currentProjectId === project.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [state.staff, project.id]);

  const toggleStaff = (id: ID) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  // Estimated daily output (matches engine math) for the live planner readout.
  const estDailyFix = useMemo(() => {
    if (selected.size === 0) return 0;
    const team = Array.from(selected)
      .map((sid) => state.staff[sid])
      .filter((s): s is Staff => !!s);
    if (team.length === 0) return 0;
    const avgPolish =
      team.reduce((s, st) => s + (st.stats.tech + st.stats.design) / 2, 0) / team.length;
    const polishMult = 0.6 + avgPolish / 100;
    return team.length * PATCH_SPRINT_FIX_PER_STAFF_DAY * polishMult;
  }, [selected, state.staff]);

  // Marketing → user-score bump preview
  const projectedScoreBump =
    (marketing / 1_000_000) * PATCH_MARKETING_USER_SCORE_BUMP_PER_MILLION_CENTS;

  const cashAfter = state.studio.cash - marketing;
  const insufficientCash = marketing > state.studio.cash;
  const canStart = !insufficientCash && selected.size > 0 && days >= 3 && name.trim().length > 0;

  const handleStart = () => {
    if (!canStart) return;
    const ok = onStart({
      projectId: project.id,
      name: name.trim(),
      plannedDays: days,
      assignedStaffIds: Array.from(selected),
      marketingSpend: marketing > 0 ? marketing : undefined,
    });
    if (ok) {
      setOpen(false);
      setSelected(new Set());
      setMarketing(0);
    }
  };

  if (!open) {
    return (
      <Panel title="PATCH SPRINT">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-[color:var(--amber-dim)]">
            No active sprint. Start one to pull staff onto a focused fix burst —
            named patches restore user score and slow sales decay.
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1 border border-[color:var(--amber)] text-[color:var(--amber-bright)] hover:bg-[color:var(--amber)] hover:text-black text-xs"
          >
            + START SPRINT
          </button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="START PATCH SPRINT"
      headerRight={
        <button
          onClick={() => setOpen(false)}
          className="text-[color:var(--amber-dim)] hover:text-[color:var(--amber-bright)] text-[11px]"
        >
          CANCEL
        </button>
      }
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mb-1">
            Patch name
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[color:var(--bg-1)] border border-[color:var(--bg-2)] text-[color:var(--amber-bright)] px-2 py-1 text-sm focus:border-[color:var(--amber)] outline-none"
            placeholder="1.1 Patch, Definitive Update…"
          />
        </div>

        {/* Days slider */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="uppercase tracking-widest text-[color:var(--amber-dim)]">
              Planned days
            </span>
            <span className="tabular">{days} days</span>
          </div>
          <input
            type="range"
            min={3}
            max={120}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-[11px] text-[color:var(--amber-dim)] mt-1">
            Short patches (≤14 days) = small named hotfix. Long patches (60-120) =
            "Definitive Edition" treatment with bigger final burst.
          </div>
        </div>

        {/* Staff picker */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="uppercase tracking-widest text-[color:var(--amber-dim)]">
              Team ({selected.size} selected)
            </span>
            <span className="tabular text-[color:var(--amber-dim)]">
              ~{estDailyFix.toFixed(1)} bugs/day
            </span>
          </div>
          {eligibleStaff.length === 0 ? (
            <div className="text-xs text-[color:var(--amber-dim)] italic">
              No idle staff available. Free up developers from active projects first.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto border border-[color:var(--bg-2)] p-2 bg-[color:var(--bg-1)]">
              {eligibleStaff.map((s) => {
                const isSelected = selected.has(s.id);
                const polish = (s.stats.tech + s.stats.design) / 2;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStaff(s.id)}
                    className={cn(
                      "text-left px-2 py-1 text-xs border",
                      isSelected
                        ? "border-[color:var(--amber)] text-[color:var(--amber-bright)] bg-[color:var(--bg-2)]"
                        : "border-transparent text-[color:var(--amber-dim)] hover:text-[color:var(--amber-bright)] hover:border-[color:var(--bg-2)]"
                    )}
                  >
                    <span className="tabular w-4 inline-block">{isSelected ? "✓" : "·"}</span>{" "}
                    {s.name}
                    <span className="text-[color:var(--amber-dim)] ml-1">
                      ({s.role}, polish {polish.toFixed(0)})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Marketing spend */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="uppercase tracking-widest text-[color:var(--amber-dim)]">
              Marketing spend (optional)
            </span>
            <span className="tabular">{formatMoney(marketing)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(50_000_00, state.studio.cash)}
            step={100_00}
            value={marketing}
            onChange={(e) => setMarketing(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] mt-1">
            <span className="text-[color:var(--amber-dim)]">
              Cash after spend: <span className={cn("tabular", insufficientCash && "status-bad")}>
                {formatMoney(cashAfter)}
              </span>
            </span>
            <span className="text-[color:var(--amber-dim)] tabular">
              +{projectedScoreBump.toFixed(1)} user score on ship
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[color:var(--bg-2)]">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-xs text-[color:var(--amber-dim)] hover:text-[color:var(--amber-bright)]"
          >
            BACK
          </button>
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              "px-3 py-1 text-xs border",
              canStart
                ? "border-[color:var(--amber)] text-[color:var(--amber-bright)] hover:bg-[color:var(--amber)] hover:text-black"
                : "border-[color:var(--bg-2)] text-[color:var(--amber-dim)] cursor-not-allowed"
            )}
          >
            COMMIT SPRINT
          </button>
        </div>
      </div>
    </Panel>
  );
}
