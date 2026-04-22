"use client";

// Post-Launch Content Panel
//
// Shows on released projects that are still in their live window (within 12
// months of release OR with live-service enabled). Three sub-sections:
//
//   1. SHIPPED / IN-DEV DLCs — each real DLC record attached to this project.
//   2. PLANNED (not yet built) — DLCPlan rows the player declared at concept
//      with status === "planned". Each gets a START DEVELOPMENT form.
//   3. NEW UNPLANNED DLC — buttons for each DLC kind currently unlocked
//      (year gate + R&D gate passed). Excludes season_pass (must be declared
//      at concept) and excludes any kind that's already covered by an active
//      plan unless the kind is content_pack / expansion (stackable).
//
// Each "start development" form is collapsed by default; clicking a kind or
// plan expands an inline form to pick a name + staff before calling
// createDlc() via the store.

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { useGameStore } from "@/store/gameStore";
import { formatDate, formatMoney, cn } from "@/lib/format";
import {
  DLC_PLAN_KINDS,
  dlcKindLabel,
  dlcKindDescription,
  isDlcKindUnlocked,
  dlcKindLockedReason,
} from "@/engine";
import type { Project, DLC, DLCKind, DLCPlan, ID } from "@/engine";

interface Props {
  project: Project;
}

// Form target — either an existing plan (startDevelopment for it) or a raw
// unplanned kind (ad-hoc post-launch DLC).
type FormTarget =
  | { kind: "fromPlan"; plan: DLCPlan }
  | { kind: "unplanned"; dlcKind: DLCKind };

export function PostLaunchContentPanel({ project }: Props) {
  const state = useGameStore((s) => s.state)!;
  const createDlc = useGameStore((s) => s.createDlc);

  // Live-window gate: released within 365 days OR has live service.
  const inLiveWindow = useMemo(() => {
    if (project.status !== "released" || !project.actualReleaseDate) return false;
    const live = state.liveServices[project.id]?.enabled;
    if (live) return true;
    const released = new Date(project.actualReleaseDate).getTime();
    const now = new Date(state.currentDate).getTime();
    const daysSince = (now - released) / 86400000;
    return daysSince <= 365;
  }, [project.status, project.actualReleaseDate, project.id, state.currentDate, state.liveServices]);

  // All DLCs attached to this project.
  const dlcs: DLC[] = useMemo(
    () => Object.values(state.dlcs).filter((d) => d.parentProjectId === project.id),
    [state.dlcs, project.id]
  );

  const [form, setForm] = useState<FormTarget | null>(null);
  const [formName, setFormName] = useState("");
  const [formStaff, setFormStaff] = useState<ID[]>([]);

  // Plans still awaiting build.
  const plannedPlans = (project.dlcPlans ?? []).filter((p) => p.status === "planned");

  // Free staff the player can assign (not currently on any project/DLC).
  const freeStaff = useMemo(
    () => Object.values(state.staff).filter(
      (s) => s.status === "employed" && s.currentProjectId === null
    ),
    [state.staff]
  );

  // Unlocked unplanned kinds — excludes season_pass (concept-only) and any
  // kind already covered by a pending plan to reduce duplication noise.
  const plannedKinds = new Set(plannedPlans.map((p) => p.kind));
  const unplannedAddable = DLC_PLAN_KINDS
    .filter((k) => k !== "season_pass")
    .filter((k) => {
      // Stackable kinds (content_pack / expansion) are fine to add even if
      // a plan of the same kind exists; season_pass is already excluded;
      // cosmetic is stackable. So: allow everything except where a pending
      // plan of the *same* kind exists AND the kind is non-stackable.
      // For now, treat all as stackable — the plan UI still shows its own
      // start button, the button here is for ad-hoc additions.
      return true;
    });

  if (!inLiveWindow && dlcs.length === 0 && plannedPlans.length === 0) {
    // Project is past live window and shipped no DLC — nothing to show.
    return null;
  }

  const openForm = (target: FormTarget) => {
    setForm(target);
    const defaultName = target.kind === "fromPlan"
      ? (target.plan.name ?? `${dlcKindLabel(target.plan.kind)} — ${project.name}`)
      : `${dlcKindLabel(target.dlcKind)} — ${project.name}`;
    setFormName(defaultName);
    setFormStaff([]);
  };
  const closeForm = () => {
    setForm(null);
    setFormName("");
    setFormStaff([]);
  };
  const submitForm = () => {
    if (!form) return;
    const kind = form.kind === "fromPlan" ? form.plan.kind : form.dlcKind;
    const fromPlanId = form.kind === "fromPlan" ? form.plan.id : undefined;
    const id = createDlc({
      name: formName.trim() || `${dlcKindLabel(kind)} — ${project.name}`,
      parentProjectId: project.id,
      kind,
      assignedStaffIds: formStaff,
      fromPlanId,
    });
    if (id) closeForm();
  };

  return (
    <Panel title={`POST-LAUNCH CONTENT (${dlcs.length} DLC · ${plannedPlans.length} planned)`}>
      {!inLiveWindow && (
        <div className="text-xs text-[color:var(--amber-dim)] mb-3">
          Live window has closed. Ship a live-service update to extend it, or
          archive this project.
        </div>
      )}

      {/* ---------- SHIPPED / IN-DEV DLCs ---------- */}
      {dlcs.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)]">
            DLCs
          </div>
          {dlcs.map((dlc) => {
            const pct = Math.min(100, (dlc.workDaysCompleted / Math.max(1, dlc.totalWorkDays)) * 100);
            const tone =
              dlc.status === "released" ? "status-ok" :
              dlc.status === "cancelled" ? "status-bad" :
              "text-[color:var(--amber-bright)]";
            return (
              <div key={dlc.id} className="border border-[color:var(--bg-2)] p-2">
                <div className="flex justify-between items-baseline">
                  <div className="text-sm">
                    <span className={tone}>{dlc.name}</span>
                    <span className="text-[color:var(--amber-dim)] text-xs ml-2">
                      {dlcKindLabel(dlc.kind)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[color:var(--amber-dim)] tabular">
                    {dlc.status === "released"
                      ? `released ${formatDate(dlc.actualReleaseDate ?? dlc.estimatedReleaseDate)}`
                      : `target ${formatDate(dlc.estimatedReleaseDate)}`}
                  </div>
                </div>
                {dlc.status === "in_development" && (
                  <div className="mt-1">
                    <Progress value={pct} />
                    <div className="text-[11px] text-[color:var(--amber-dim)] mt-1 tabular">
                      {dlc.workDaysCompleted.toFixed(0)} / {dlc.totalWorkDays} days ·
                      {" "}{formatMoney(dlc.spent)} / {formatMoney(dlc.budget)} ·
                      {" "}{dlc.assignedStaffIds.length} staff
                    </div>
                  </div>
                )}
                {dlc.status === "released" && (
                  <div className="text-[11px] text-[color:var(--amber-dim)] mt-1 tabular">
                    sales: {(dlc.lifetimeSales ?? 0).toLocaleString()} ·
                    revenue: {formatMoney(dlc.lifetimeRevenue ?? 0)} ·
                    quality {dlc.qualityScore.toFixed(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- PLANNED DLC (awaiting build) ---------- */}
      {inLiveWindow && plannedPlans.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)]">
            Planned — not yet built
          </div>
          {plannedPlans.map((plan) => (
            <div key={plan.id} className="flex items-center justify-between border border-[color:var(--bg-2)] p-2">
              <div>
                <div className="text-sm text-[color:var(--amber-bright)]">
                  {dlcKindLabel(plan.kind)}
                  {plan.name && <span className="text-[color:var(--amber-dim)] ml-2">— {plan.name}</span>}
                </div>
                <div className="text-[11px] text-[color:var(--amber-dim)]">
                  {plan.plannedAtConcept ? "declared at concept" : "added post-launch"}
                </div>
              </div>
              <button
                onClick={() => openForm({ kind: "fromPlan", plan })}
                className="!border-[color:var(--amber)] !text-[color:var(--amber-bright)] text-xs px-2 py-1"
              >
                START DEVELOPMENT
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- ADD NEW UNPLANNED DLC ---------- */}
      {inLiveWindow && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)]">
            Add unplanned DLC
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unplannedAddable.map((k) => {
              const unlocked = isDlcKindUnlocked(state, k);
              const reason = unlocked ? null : dlcKindLockedReason(state, k);
              return (
                <button
                  key={k}
                  onClick={() => unlocked && openForm({ kind: "unplanned", dlcKind: k })}
                  disabled={!unlocked}
                  className={cn(
                    "text-left",
                    !unlocked && "opacity-40 cursor-not-allowed"
                  )}
                  title={reason ?? "Start development"}
                >
                  <div className="text-xs text-[color:var(--amber-bright)]">
                    {unlocked ? "+ " : "🔒 "}{dlcKindLabel(k)}
                  </div>
                  <div className="text-[11px] text-[color:var(--amber-dim)] leading-tight mt-0.5">
                    {unlocked ? dlcKindDescription(k) : (reason ?? dlcKindDescription(k))}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-[color:var(--amber-dim)] mt-1">
            Season passes can&apos;t be added post-launch — they must be declared at concept.
          </div>
        </div>
      )}

      {/* ---------- INLINE START-DEVELOPMENT FORM ---------- */}
      {form && (
        <div className="mt-4 border border-[color:var(--amber)] p-3 space-y-3">
          <div className="text-xs uppercase tracking-widest text-[color:var(--amber-bright)]">
            Start{" "}
            {form.kind === "fromPlan"
              ? dlcKindLabel(form.plan.kind)
              : dlcKindLabel(form.dlcKind)}{" "}
            Development
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mb-1">
              Name
            </label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full"
              placeholder="Working title"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[color:var(--amber-dim)] mb-1">
              Staff ({formStaff.length} selected)
            </label>
            {freeStaff.length === 0 ? (
              <div className="text-[color:var(--amber-dim)] text-xs">
                No free staff — unassign someone from another project first.
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {freeStaff.map((s) => {
                  const selected = formStaff.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setFormStaff((prev) =>
                        prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                      )}
                      className={cn(
                        "w-full text-left text-xs",
                        selected && "!border-[color:var(--amber)] !text-[color:var(--amber-bright)]"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {s.name}{" "}
                          <span className="text-[color:var(--amber-dim)]">· {s.role}</span>
                        </span>
                        <span className="text-[color:var(--amber-dim)]">
                          morale {s.morale.toFixed(0)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={closeForm} className="flex-1">CANCEL</button>
            <button
              onClick={submitForm}
              disabled={formStaff.length === 0 || formName.trim().length === 0}
              className="flex-1 !border-[color:var(--amber)] !text-[color:var(--amber-bright)] disabled:!border-[color:var(--border)] disabled:!text-[color:var(--amber-dim)]"
            >
              START DEVELOPMENT
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}
