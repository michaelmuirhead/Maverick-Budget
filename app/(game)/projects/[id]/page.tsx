"use client";

import { useGameStore } from "@/store/gameStore";
import { useParams, useRouter } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { Stat } from "@/components/ui/Stat";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import {
  GENRE_BY_ID, THEME_BY_ID, OUTLET_BY_ID,
  dlcKindLabel,
} from "@/engine";
import type { PhaseFocusSliders } from "@/engine";
import { PatchSprintPanel } from "@/components/projects/PatchSprintPanel";
import { PostMortemPanel } from "@/components/projects/PostMortemPanel";
import { PostLaunchContentPanel } from "@/components/projects/PostLaunchContentPanel";
import { SalesCurvePreview } from "@/components/projects/SalesCurvePreview";
import Link from "next/link";

const stickerHeading: React.CSSProperties = {
  background: "var(--pink)",
  color: "#fff",
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

const subCardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "2.5px solid var(--cream-2)",
  borderRadius: 14,
};

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  children,
  full,
  title,
}: {
  tone?: "teal" | "pink" | "mustard" | "default";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  full?: boolean;
  title?: string;
}) {
  const bg = disabled
    ? "var(--cream-2)"
    : tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
        ? "var(--pink)"
        : tone === "mustard"
          ? "var(--mustard)"
          : "var(--cream)";
  const color = disabled
    ? "var(--ink-soft)"
    : tone === "default" || tone === "mustard"
      ? "var(--ink)"
      : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 text-xs ${full ? "flex-1" : ""}`}
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

function StatusChip({ status }: { status: string }) {
  const tone =
    status === "released"
      ? { bg: "var(--teal)", color: "#fff" }
      : status === "cancelled"
        ? { bg: "var(--pink)", color: "#fff" }
        : status === "ready_to_release"
          ? { bg: "var(--mustard)", color: "var(--ink)" }
          : { bg: "var(--cream-2)", color: "var(--ink)" };
  const label =
    status === "ready_to_release"
      ? "READY TO SHIP"
      : status.replace(/_/g, " ").toUpperCase();
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-[11px]"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function ScoreChip({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  const tone =
    score >= 85
      ? { bg: "var(--teal)", color: "#fff" }
      : score >= 70
        ? { bg: "var(--mustard)", color: "var(--ink)" }
        : score < 60
          ? { bg: "var(--pink)", color: "#fff" }
          : { bg: "var(--cream-2)", color: "var(--ink)" };
  return (
    <span
      className={`inline-block rounded-md tabular ${size === "lg" ? "px-2 py-0.5 text-base" : "px-1.5 py-0.5 text-xs"}`}
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
      }}
    >
      {score}
      {size === "lg" ? "/100" : ""}
    </span>
  );
}

function TierChip({ tier }: { tier: string }) {
  const tone =
    tier === "mega"
      ? { bg: "var(--purple)", color: "#fff" }
      : tier === "major"
        ? { bg: "var(--teal)", color: "#fff" }
        : tier === "mid_major"
          ? { bg: "var(--mustard)", color: "var(--ink)" }
          : { bg: "var(--cream-2)", color: "var(--ink)" };
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {tier.replace("_", " ").toUpperCase()}
    </span>
  );
}

function MiniStat({ label, value, valueColor = "var(--ink)" }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div
      className="rounded-xl p-2"
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        boxShadow: "3px 3px 0 var(--ink)",
      }}
    >
      <div
        className="text-[10px]"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div className="tabular text-sm mt-0.5" style={{ color: valueColor, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

function DlcStatusChip({ status }: { status: string }) {
  const tone =
    status === "released"
      ? { bg: "var(--teal)", color: "#fff" }
      : status === "in_development"
        ? { bg: "var(--mustard)", color: "var(--ink)" }
        : status === "cancelled"
          ? { bg: "var(--cream-2)", color: "var(--ink-soft)" }
          : { bg: "var(--purple)", color: "#fff" };
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const setPhaseSliders = useGameStore((s) => s.setPhaseSliders);
  const setPhaseCrunch = useGameStore((s) => s.setPhaseCrunch);
  const cancelProject = useGameStore((s) => s.cancelProject);
  const toggleQualityControl = useGameStore((s) => s.toggleQualityControl);
  const approveRelease = useGameStore((s) => s.approveRelease);
  const removeDlcPlan = useGameStore((s) => s.removeDlcPlan);
  const acceptPublishingDeal = useGameStore((s) => s.acceptPublishingDeal);
  const declinePublishingDeal = useGameStore((s) => s.declinePublishingDeal);
  const acceptSubscriptionOffer = useGameStore((s) => s.acceptSubscriptionOffer);
  const declineSubscriptionOffer = useGameStore((s) => s.declineSubscriptionOffer);

  if (!state) return null;
  const project = state.projects[id];
  if (!project) {
    return (
      <div style={{ color: "var(--ink-soft)" }}>Project not found.</div>
    );
  }

  const engine = project.engineId ? state.engines[project.engineId] : undefined;
  const engineLabel = engine ? engine.name : "Hand-coded (no engine)";
  const genre = GENRE_BY_ID[project.genre]!;
  const theme = THEME_BY_ID[project.theme];
  const team = project.assignedStaffIds.map((sid) => state.staff[sid]).filter(Boolean);

  const currentPhase = project.phases[project.currentPhaseIndex]!;
  const overall =
    (project.currentPhaseIndex / project.phases.length) * 100 +
    currentPhase.completion / project.phases.length;

  const reception = state.receptions[project.id];
  const reviews = (project.reviewIds ?? []).map((rid) => state.reviews[rid]).filter(Boolean);

  const updateSlider = (key: keyof PhaseFocusSliders, value: number) => {
    const next: PhaseFocusSliders = { ...currentPhase.sliders, [key]: value };
    setPhaseSliders(project.id, project.currentPhaseIndex, next);
  };

  const sequelEligible = (() => {
    if (project.status !== "released") return false;
    const meta = project.metacriticScore ?? 0;
    const sales = project.lifetimeSales ?? 0;
    return meta >= 50 || sales >= 20000;
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
            {project.name}
          </h2>
          <div className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
            {genre.name} · {theme?.name} · {project.audience.replace("_", " ")} ·
            started {formatDate(project.startDate)}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(project.status === "in_development" || project.status === "ready_to_release") && (
            <ActionButton
              tone="pink"
              onClick={() => {
                if (confirm(`Cancel ${project.name}?`)) {
                  cancelProject(project.id);
                  router.push("/projects");
                }
              }}
            >
              CANCEL PROJECT
            </ActionButton>
          )}
          {sequelEligible && (
            <Link
              href={`/projects/new?sequel=${project.id}`}
              className="!no-underline inline-flex items-center px-3 py-1.5 text-xs"
              title={`Start a sequel to ${project.name}`}
              style={{
                background: "var(--purple)",
                color: "#fff",
                border: "2.5px solid var(--ink)",
                borderRadius: 10,
                boxShadow: "2px 2px 0 var(--ink)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
              }}
            >
              MAKE A SEQUEL
            </Link>
          )}
        </div>
      </div>

      <Panel title="STATUS" headerRight={<StatusChip status={project.status} />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Stat
            label="STATUS"
            value={
              project.status === "ready_to_release"
                ? "READY TO SHIP"
                : project.status.replace(/_/g, " ").toUpperCase()
            }
            tone={
              project.status === "released"
                ? "good"
                : project.status === "cancelled"
                  ? "bad"
                  : project.status === "ready_to_release"
                    ? "warn"
                    : "default"
            }
          />
          <Stat
            label="BUGS"
            value={project.totalBugs}
            tone={project.totalBugs > 50 ? "bad" : project.totalBugs > 10 ? "warn" : "good"}
          />
          <Stat
            label="BUDGET"
            value={formatMoney(project.budget.total)}
            sub={`${formatMoney(project.budget.spent)} spent`}
          />
          <Stat
            label="TEAM"
            value={team.length}
            sub={`${project.crunchDaysTotal} crunch days`}
          />
        </div>
        <Progress value={overall} showLabel />
        <div className="text-xs mt-3 flex justify-between flex-wrap gap-x-4" style={{ color: "var(--ink-soft)" }}>
          <span>
            Target release:{" "}
            <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
              {formatDate(project.targetReleaseDate)}
            </span>
          </span>
          <span>
            Engine:{" "}
            <span style={{ color: engine ? "var(--pink-deep)" : "var(--ink)", fontWeight: 700 }}>
              {engineLabel}
            </span>
          </span>
        </div>
      </Panel>

      <Panel title="PHASES">
        <div className="space-y-3">
          {project.phases.map((p, idx) => {
            const isCurrent = idx === project.currentPhaseIndex;
            const isPast = idx < project.currentPhaseIndex;
            return (
              <div
                key={p.id}
                className="p-2"
                style={{
                  ...subCardStyle,
                  borderColor: isCurrent ? "var(--ink)" : "var(--cream-2)",
                  borderWidth: isCurrent ? 3 : 2.5,
                  boxShadow: isCurrent ? "3px 3px 0 var(--ink)" : "none",
                }}
              >
                <div className="flex justify-between items-baseline mb-1 flex-wrap gap-2">
                  <span
                    style={{
                      color: isCurrent
                        ? "var(--pink-deep)"
                        : isPast
                          ? "var(--ink-soft)"
                          : "var(--ink)",
                      fontWeight: isCurrent ? 700 : 600,
                    }}
                  >
                    {idx + 1}.{" "}
                    {p.name === "Launch" && project.status === "ready_to_release"
                      ? "Ready to Launch"
                      : p.name}
                  </span>
                  <span className="text-xs tabular" style={{ color: "var(--ink-soft)" }}>
                    {p.daysSpent.toFixed(0)} / {p.daysAllocated} days
                  </span>
                </div>
                <Progress value={p.completion} />
                {p.bugsGenerated > 0 && (
                  <div className="text-xs mt-2 tabular flex gap-2 flex-wrap" style={{ color: "var(--ink-soft)" }}>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded-md"
                      style={{
                        background: "var(--pink)",
                        color: "#fff",
                        border: "2px solid var(--ink)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      +{p.bugsGenerated} BUGS
                    </span>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded-md"
                      style={{
                        background: "var(--teal)",
                        color: "#fff",
                        border: "2px solid var(--ink)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      −{p.bugsFixed} FIXED
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {project.status === "ready_to_release" && project.subscriptionOffer &&
        !project.subscriptionDealAccepted && (() => {
          const offer = project.subscriptionOffer!;
          const expiresDays = Math.max(
            0,
            Math.ceil(
              (new Date(offer.expiresDate).getTime() -
                new Date(state.currentDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          return (
            <Panel
              title={`SUBSCRIPTION OFFER — ${offer.serviceName.toUpperCase()}`}
              headerRight={
                <div className="flex gap-2">
                  <ActionButton
                    tone="default"
                    onClick={() => {
                      if (
                        confirm(
                          `Decline ${offer.serviceName}? You'll go to market on traditional sales.`
                        )
                      )
                        declineSubscriptionOffer(project.id);
                    }}
                  >
                    DECLINE
                  </ActionButton>
                  <ActionButton
                    tone="teal"
                    onClick={() => {
                      const msg = `Sign ${project.name} to ${offer.serviceName}?\n\n` +
                        `+ $${(offer.flatPayment / 100).toLocaleString()} guaranteed cash now\n` +
                        (offer.reputationBonus > 0
                          ? `+ ${offer.reputationBonus} reputation\n`
                          : "") +
                        `− ${Math.round(offer.salesReductionPct * 100)}% lifetime unit sales\n\n` +
                        `Once accepted, this is locked in at release.`;
                      if (confirm(msg)) acceptSubscriptionOffer(project.id);
                    }}
                  >
                    ACCEPT
                  </ActionButton>
                </div>
              }
            >
              <div className="text-sm mb-3" style={{ color: "var(--ink)" }}>
                {offer.serviceName} wants to add{" "}
                <strong>{project.name}</strong> to their catalog. Accept and
                you trade most of your potential lifetime sales for a
                guaranteed flat payment now. Decline to ship traditionally —
                higher upside, full risk.
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat
                  label="FLAT PAYMENT"
                  value={`$${(offer.flatPayment / 100).toLocaleString()}`}
                  tone="good"
                />
                <Stat
                  label="SALES HAIRCUT"
                  value={`${Math.round(offer.salesReductionPct * 100)}%`}
                  tone="warn"
                  sub="of projected lifetime units"
                />
                <Stat
                  label="REP BONUS"
                  value={`+${offer.reputationBonus}`}
                  tone={offer.reputationBonus > 0 ? "good" : "default"}
                  sub="catalog prestige"
                />
                <Stat
                  label="EXPIRES IN"
                  value={`${expiresDays}d`}
                  tone={expiresDays <= 3 ? "bad" : expiresDays <= 7 ? "warn" : "default"}
                />
              </div>
            </Panel>
          );
        })()}

      {project.status === "ready_to_release" && project.subscriptionDealAccepted && (
        <Panel title={`SIGNED — ${(project.subscriptionServiceName ?? "SERVICE").toUpperCase()}`}>
          <div className="text-sm" style={{ color: "var(--ink)" }}>
            Locked into{" "}
            <strong>{project.subscriptionServiceName}</strong> at release.
            Lifetime unit sales projection will be reduced by{" "}
            <strong>
              {Math.round((project.subscriptionSalesReductionPct ?? 0) * 100)}%
            </strong>{" "}
            in exchange for the{" "}
            <strong>
              ${((project.subscriptionPayment ?? 0) / 100).toLocaleString()}
            </strong>{" "}
            you've already received.
          </div>
        </Panel>
      )}

      {project.status === "ready_to_release" && (
        <Panel
          title="READY TO SHIP"
          headerRight={
            <ActionButton
              tone="teal"
              onClick={() => {
                const msg = project.totalBugs > 100
                  ? `${project.name} still has ${project.totalBugs} bugs on the books. Ship anyway?`
                  : `Ship ${project.name} now? Reviews drop next tick.`;
                if (confirm(msg)) approveRelease(project.id);
              }}
            >
              APPROVE RELEASE
            </ActionButton>
          }
        >
          <div className="text-sm mb-3" style={{ color: "var(--ink)" }}>
            Launch phase is complete. The game will <strong>not</strong> ship until you
            approve it here — use the time to run a Quality Control Push, burn down bugs,
            or just hold for a better window.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat
              label="BUGS ON THE BOOKS"
              value={project.totalBugs}
              tone={project.totalBugs > 100 ? "bad" : project.totalBugs > 25 ? "warn" : "good"}
            />
            <Stat
              label="TECH DEBT"
              value={Math.round(project.techDebt)}
              tone={project.techDebt > 150 ? "bad" : project.techDebt > 50 ? "warn" : "good"}
              sub="raises hidden bug ratio at launch"
            />
            <Stat
              label="CRUNCH DAYS"
              value={project.crunchDaysTotal}
              tone={project.crunchDaysTotal > 60 ? "warn" : "default"}
            />
            <Stat label="QC DAYS" value={project.qcDaysTotal} tone="default" />
          </div>

          <SalesCurvePreview project={project} />
        </Panel>
      )}

      {project.status === "in_development" && (
        <Panel
          title={`PHASE FOCUS — ${currentPhase.name}`}
          headerRight={
            <ActionButton
              tone={currentPhase.crunching ? "pink" : "default"}
              onClick={() =>
                setPhaseCrunch(project.id, project.currentPhaseIndex, !currentPhase.crunching)
              }
              disabled={project.qualityControlActive}
              title={
                project.qualityControlActive
                  ? "Disabled while Quality Control Push is active"
                  : undefined
              }
            >
              CRUNCH: {currentPhase.crunching ? "ON" : "OFF"}
            </ActionButton>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(currentPhase.sliders) as (keyof PhaseFocusSliders)[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span
                    style={{
                      color: "var(--ink-soft)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {key}
                  </span>
                  <span className="tabular" style={{ fontWeight: 700 }}>
                    {currentPhase.sliders[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={currentPhase.sliders[key]}
                  onChange={(e) => updateSlider(key, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
            Sliders are normalized automatically. Higher values prioritize that quality axis.
          </div>
        </Panel>
      )}

      {(project.status === "in_development" || project.status === "ready_to_release") && (
        <Panel
          title="QUALITY CONTROL"
          headerRight={
            <ActionButton
              tone={project.qualityControlActive ? "teal" : "default"}
              onClick={() => toggleQualityControl(project.id, !project.qualityControlActive)}
            >
              {project.qualityControlActive ? "END QC PUSH" : "START QC PUSH"}
            </ActionButton>
          }
        >
          <div className="text-sm mb-3" style={{ color: "var(--ink)" }}>
            {project.qualityControlActive ? (
              project.status === "ready_to_release" ? (
                <>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[11px] mr-1"
                    style={{
                      background: "var(--teal)",
                      color: "#fff",
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                    }}
                  >
                    QC ACTIVE
                  </span>{" "}
                  at the gate. The project is ready to launch but isn&apos;t shipping yet —
                  the team is burning down bugs and tech debt while you decide. Approve the
                  release whenever you&apos;re ready.
                </>
              ) : (
                <>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[11px] mr-1"
                    style={{
                      background: "var(--teal)",
                      color: "#fff",
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                    }}
                  >
                    QC ACTIVE
                  </span>{" "}
                  Team is pivoted to bug hunting: phase progress slows to 25%, no new bugs
                  generate, fix rate is at patch-sprint levels, and tech debt is ticking
                  down. Crunch is disabled.
                </>
              )
            ) : project.status === "ready_to_release" ? (
              <>
                Launch phase is done and the game is parked at the gate. Start a QC Push to
                keep burning down bugs and tech debt while you hold for a better ship
                window — no new bugs will generate, fix rate climbs to patch-sprint levels,
                and existing debt chips away.
              </>
            ) : (
              <>
                Pivot the whole team from feature work to bug hunting. Phase progress slows
                to 25%, new-bug generation stops, fix rate jumps to patch-sprint levels
                across <em>every</em> phase, and existing tech debt gets chipped away.
                Small morale tax while active.
              </>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat
              label="BUGS"
              value={project.totalBugs}
              tone={project.totalBugs > 100 ? "bad" : project.totalBugs > 25 ? "warn" : "good"}
            />
            <Stat
              label="TECH DEBT"
              value={Math.round(project.techDebt)}
              tone={project.techDebt > 150 ? "bad" : project.techDebt > 50 ? "warn" : "good"}
            />
            <Stat label="QC DAYS" value={project.qcDaysTotal} />
            <Stat
              label="STATE"
              value={project.qualityControlActive ? "HUNTING" : "IDLE"}
              tone={project.qualityControlActive ? "good" : "default"}
            />
          </div>
        </Panel>
      )}

      <Panel title="QUALITY ACCUMULATED">
        <div className="space-y-2">
          {(
            Object.entries(project.qualityAxes) as [
              keyof typeof project.qualityAxes,
              number,
            ][]
          ).map(([axis, val]) => {
            const weight = genre.axisWeights[axis] ?? 0;
            const normalized = Math.min(100, val / 50);
            return (
              <div key={axis}>
                <div className="flex justify-between text-xs mb-1">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {axis}
                    {weight >= 0.2 && (
                      <span style={{ color: "var(--mustard)", marginLeft: 4 }}>★</span>
                    )}
                  </span>
                  <span className="tabular" style={{ color: "var(--ink-soft)" }}>
                    {val.toFixed(0)} pts · weight {(weight * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={normalized} />
              </div>
            );
          })}
        </div>
      </Panel>

      {(() => {
        const projectOffers = Object.values(state.publishingDeals).filter(
          (d) =>
            d.projectId === project.id &&
            d.status === "offered" &&
            d.expiresOn >= state.currentDate
        );
        const projectActiveDeal = Object.values(state.publishingDeals).find(
          (d) => d.projectId === project.id && d.status === "active"
        );
        const showOffers =
          (project.status === "in_development" || project.status === "ready_to_release") &&
          (projectOffers.length > 0 || projectActiveDeal);
        if (!showOffers) return null;

        return (
          <Panel
            title="PUBLISHING"
            headerRight={
              <Link
                href="/publishers"
                className="text-xs no-underline"
                style={{ color: "var(--pink-deep)", fontWeight: 700 }}
              >
                ALL PUBLISHERS →
              </Link>
            }
          >
            {projectActiveDeal && (() => {
              const pub = state.publishers[projectActiveDeal.publisherId]!;
              return (
                <div className="p-3 mb-3" style={cardStyle}>
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span
                      className="inline-block px-2 py-0.5 rounded-md text-[10px]"
                      style={{
                        background: "var(--teal)",
                        color: "#fff",
                        border: "2px solid var(--ink)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      ACTIVE DEAL
                    </span>
                    <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                      {pub.name}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                    Their cut:{" "}
                    <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
                      {(projectActiveDeal.revenueShare * 100).toFixed(0)}%
                    </span>{" "}
                    · Collected so far:{" "}
                    <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
                      {formatMoney(projectActiveDeal.revenueCollected)}
                    </span>
                  </div>
                  {projectActiveDeal.metacriticBonusAmount &&
                    projectActiveDeal.metacriticBonusThreshold && (
                      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                        Bonus:{" "}
                        <span
                          className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
                          style={{
                            background: projectActiveDeal.bonusPaid
                              ? "var(--teal)"
                              : "var(--mustard)",
                            color: projectActiveDeal.bonusPaid ? "#fff" : "var(--ink)",
                            border: "2px solid var(--ink)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                          }}
                        >
                          {formatMoney(projectActiveDeal.metacriticBonusAmount)} @ MC{" "}
                          {projectActiveDeal.metacriticBonusThreshold}+
                          {projectActiveDeal.bonusPaid ? " ✓ PAID" : ""}
                        </span>
                      </div>
                    )}
                </div>
              );
            })()}

            {projectOffers.length > 0 && (
              <>
                <div
                  className="text-[11px] mb-2"
                  style={{
                    color: "var(--ink-soft)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Pending offers ({projectOffers.length})
                </div>
                <div className="space-y-2">
                  {projectOffers.map((d) => {
                    const pub = state.publishers[d.publisherId]!;
                    return (
                      <div key={d.id} className="p-3" style={cardStyle}>
                        <div className="flex items-baseline gap-2 flex-wrap mb-2">
                          <TierChip tier={pub.tier} />
                          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {pub.name}
                          </span>
                          <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                            · expires{" "}
                            <span className="tabular">{formatDate(d.expiresOn)}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                          <MiniStat
                            label="Advance"
                            value={formatMoney(d.advanceAmount)}
                            valueColor="var(--pink-deep)"
                          />
                          <MiniStat label="Marketing" value={formatMoney(d.marketingBudget)} />
                          <MiniStat
                            label="Their share"
                            value={`${(d.revenueShare * 100).toFixed(0)}%`}
                          />
                          <MiniStat
                            label="MC bonus"
                            value={
                              d.metacriticBonusAmount && d.metacriticBonusThreshold
                                ? `${formatMoney(d.metacriticBonusAmount)} @ ${d.metacriticBonusThreshold}+`
                                : "—"
                            }
                          />
                        </div>
                        <div className="flex gap-2 mt-3 justify-end">
                          <ActionButton tone="pink" onClick={() => declinePublishingDeal(d.id)}>
                            DECLINE
                          </ActionButton>
                          <ActionButton tone="teal" onClick={() => acceptPublishingDeal(d.id)}>
                            ACCEPT
                          </ActionButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Panel>
        );
      })()}

      <Panel title="TEAM">
        {team.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No staff assigned.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>MORALE</th>
                  <th>ENERGY</th>
                  <th>BURNOUT</th>
                  <th>TRAITS</th>
                </tr>
              </thead>
              <tbody>
                {team.map((s) => (
                  <tr key={s!.id}>
                    <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{s!.name}</td>
                    <td style={{ color: "var(--ink-soft)" }}>{s!.role}</td>
                    <td>
                      <Progress
                        value={s!.morale}
                        tone={s!.morale < 40 ? "bad" : s!.morale < 65 ? "warn" : "good"}
                      />
                    </td>
                    <td>
                      <Progress
                        value={s!.energy}
                        tone={s!.energy < 30 ? "bad" : s!.energy < 60 ? "warn" : "good"}
                      />
                    </td>
                    <td>
                      <Progress
                        value={s!.health}
                        tone={s!.health < 30 ? "bad" : s!.health < 60 ? "warn" : "good"}
                      />
                    </td>
                    <td className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {s!.traits.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {project.status !== "released" && (project.dlcPlans?.length ?? 0) > 0 && (
        <Panel title={`DLC ROADMAP (${project.dlcPlans!.length})`}>
          <div className="space-y-2">
            {project.dlcPlans!.map((plan) => {
              const canRemove = plan.status === "planned";
              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-2 flex-wrap gap-2"
                  style={subCardStyle}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm flex items-center gap-2 flex-wrap">
                      <DlcStatusChip status={plan.status} />
                      <span style={{ fontWeight: 700 }}>{dlcKindLabel(plan.kind)}</span>
                      {plan.name && (
                        <span style={{ color: "var(--ink-soft)" }}>— {plan.name}</span>
                      )}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: "var(--ink-soft)" }}>
                      {plan.plannedAtConcept ? "declared at concept" : "added post-launch"}
                    </div>
                  </div>
                  {canRemove && (
                    <ActionButton
                      tone="pink"
                      onClick={() =>
                        removeDlcPlan({ projectId: project.id, planId: plan.id })
                      }
                    >
                      REMOVE
                    </ActionButton>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] mt-3" style={{ color: "var(--ink-soft)" }}>
            Start building these in the Post-Launch Content panel after the game ships.
          </div>
        </Panel>
      )}

      {project.status === "released" && <PostLaunchContentPanel project={project} />}
      {project.status === "released" && <PatchSprintPanel project={project} />}
      {project.status === "released" && <PostMortemPanel project={project} />}

      {project.status === "released" && reception && (
        <Panel title={`RECEPTION — METACRITIC ${reception.metacriticScore}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Stat
              label="METACRITIC"
              value={reception.metacriticScore}
              tone={
                reception.metacriticScore >= 85
                  ? "good"
                  : reception.metacriticScore >= 60
                    ? "default"
                    : "bad"
              }
            />
            <Stat
              label="USER SCORE"
              value={project.userScore ?? reception.userScore}
              sub={
                project.userScore != null && project.userScore !== reception.userScore
                  ? `launched at ${reception.userScore}`
                  : undefined
              }
              tone={
                project.userScore == null
                  ? "default"
                  : project.userScore < reception.metacriticScore - 15
                    ? "bad"
                    : project.userScore > reception.metacriticScore + 5
                      ? "good"
                      : "default"
              }
            />
            <Stat label="SALES" value={formatNumber(project.lifetimeSales ?? 0)} />
            <Stat label="REVENUE" value={formatMoney(project.lifetimeRevenue ?? 0)} />
          </div>
          <div className="space-y-3">
            {reviews.map((r) => {
              const outlet = OUTLET_BY_ID[r!.outletId];
              return (
                <div key={r!.id} className="p-3" style={subCardStyle}>
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                      {outlet?.name ?? r!.outletId}
                    </span>
                    <ScoreChip score={r!.score} size="lg" />
                  </div>
                  <div className="text-sm italic mt-1" style={{ color: "var(--ink-soft)" }}>
                    &ldquo;{r!.blurb}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
