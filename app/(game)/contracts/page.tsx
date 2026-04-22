"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatDate, formatMoney } from "@/lib/format";
import type { Contract, GameState } from "@/engine";

const stickerHeading: React.CSSProperties = {
  background: "var(--teal)",
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

const chipStyle = (bg: string, color: string = "#fff"): React.CSSProperties => ({
  background: bg,
  color,
  border: "2px solid var(--ink)",
  borderRadius: 8,
  padding: "1px 6px",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.06em",
  display: "inline-block",
});

export default function ContractsPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const all = Object.values(state.contracts);
  const offers = all.filter((c) => c.status === "offered");
  const active = all.filter((c) => c.status === "active");
  const history = all.filter(
    (c) =>
      c.status === "completed" ||
      c.status === "failed" ||
      c.status === "expired" ||
      c.status === "declined"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          PUBLISHER CONTRACTS
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
          {offers.length} OPEN · {active.length} ACTIVE · {history.length} ARCHIVED
        </span>
      </div>

      {all.length === 0 ? (
        <Panel>
          <div className="py-12 text-center" style={{ color: "var(--ink-soft)" }}>
            No contracts yet. Publishers will start sending work-for-hire offers as your studio
            reputation grows.
          </div>
        </Panel>
      ) : (
        <>
          {offers.length > 0 && (
            <Panel title={`OPEN OFFERS (${offers.length})`}>
              <div className="space-y-3">
                {offers.map((c) => (
                  <ContractRow key={c.id} contract={c} state={state} variant="offer" />
                ))}
              </div>
            </Panel>
          )}

          {active.length > 0 && (
            <Panel title={`ACTIVE CONTRACTS (${active.length})`}>
              <div className="space-y-3">
                {active.map((c) => (
                  <ContractRow key={c.id} contract={c} state={state} variant="active" />
                ))}
              </div>
            </Panel>
          )}

          {history.length > 0 && (
            <Panel title={`HISTORY (${history.length})`}>
              <div className="space-y-2">
                {history
                  .slice()
                  .sort((a, b) =>
                    (b.completedDate ?? b.offeredDate).localeCompare(
                      a.completedDate ?? a.offeredDate
                    )
                  )
                  .map((c) => {
                    const bg =
                      c.status === "completed"
                        ? "var(--teal)"
                        : c.status === "failed"
                          ? "var(--pink)"
                          : "var(--cream-2)";
                    const color =
                      c.status === "expired" || c.status === "declined" ? "var(--ink)" : "#fff";
                    return (
                      <div
                        key={c.id}
                        className="flex items-baseline justify-between gap-2 rounded-xl px-3 py-2 text-xs flex-wrap"
                        style={{
                          background: "var(--cream)",
                          border: "2.5px solid var(--cream-2)",
                        }}
                      >
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            className="text-[10px]"
                            style={chipStyle(bg, color)}
                          >
                            {c.status.toUpperCase()}
                          </span>
                          <span style={{ fontWeight: 600 }}>{c.name}</span>
                        </div>
                        <div className="text-right" style={{ color: "var(--ink-soft)" }}>
                          {c.publisherName}
                          {c.completedDate && (
                            <span className="ml-2 tabular">{formatDate(c.completedDate)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

function ContractRow({
  contract: c,
  state,
  variant,
}: {
  contract: Contract;
  state: GameState;
  variant: "offer" | "active";
}) {
  const linkedProject = c.projectId ? state.projects[c.projectId] : undefined;
  const totalPayment = c.upfrontPayment + c.completionPayment + (c.bonusPayment ?? 0);

  const targetDate = variant === "offer" ? c.expiresDate : c.dueDate;
  const daysRemaining = targetDate ? daysBetweenIso(state.currentDate, targetDate) : null;

  let progressPct: number | null = null;
  if (variant === "active" && linkedProject && linkedProject.phases.length > 0) {
    const phaseIndex = linkedProject.currentPhaseIndex;
    const current = linkedProject.phases[phaseIndex];
    progressPct =
      (phaseIndex / linkedProject.phases.length) * 100 +
      (current?.completion ?? 0) / linkedProject.phases.length;
  }

  const daysTone =
    daysRemaining == null
      ? "var(--ink-soft)"
      : daysRemaining < 0
        ? "var(--pink-deep)"
        : daysRemaining < 14
          ? "var(--pink-deep)"
          : "var(--ink-soft)";

  return (
    <div className="p-3" style={cardStyle}>
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div className="flex-1 min-w-0">
          <div style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{c.name}</div>
          <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {c.publisherName}
            {c.flavor && <> · {c.flavor}</>}
          </div>
        </div>
        <div className="text-right text-xs">
          <div
            className="rounded-xl px-2.5 py-1"
            style={{
              background: "var(--teal)",
              color: "#fff",
              border: "2.5px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            {formatMoney(totalPayment)}
          </div>
          {c.bonusPayment ? (
            <div className="mt-1 text-[11px]" style={{ color: "var(--ink-soft)" }}>
              +{formatMoney(c.bonusPayment)} bonus
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {c.requiredGenreId && (
          <MiniChip label="Genre" value={c.requiredGenreId} tone="purple" />
        )}
        {c.requiredThemeId && (
          <MiniChip label="Theme" value={c.requiredThemeId} tone="mustard" />
        )}
        {c.targetMetacriticScore != null && (
          <MiniChip label="Score target" value={`${c.targetMetacriticScore}+`} tone="teal" />
        )}
        {c.scopeBudgetMonths != null && (
          <MiniChip label="Scope" value={`${c.scopeBudgetMonths} mo`} tone="pink" />
        )}
      </div>

      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <div style={{ color: "var(--ink-soft)" }}>
          {variant === "offer" && c.expiresDate && <>Offer expires {formatDate(c.expiresDate)}</>}
          {variant === "active" && c.dueDate && <>Due {formatDate(c.dueDate)}</>}
        </div>
        {daysRemaining != null && (
          <div
            className="tabular inline-flex items-center px-2 py-0.5 rounded-md"
            style={{
              background: daysTone === "var(--pink-deep)" ? "var(--pink)" : "var(--cream-2)",
              color: daysTone === "var(--pink-deep)" ? "#fff" : "var(--ink)",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            {daysRemaining < 0
              ? `${Math.abs(daysRemaining)}d overdue`
              : `${daysRemaining}d left`}
          </div>
        )}
      </div>

      {progressPct != null && (
        <div className="mt-3">
          <Progress value={progressPct} tone="default" showLabel />
        </div>
      )}
    </div>
  );
}

function MiniChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "teal" | "purple" | "mustard" | "pink";
}) {
  const bg =
    tone === "teal"
      ? "var(--teal)"
      : tone === "purple"
        ? "var(--purple)"
        : tone === "mustard"
          ? "var(--mustard)"
          : "var(--pink)";
  const color = tone === "mustard" ? "var(--ink)" : "#fff";
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px]"
      style={{
        background: "var(--cream-2)",
        color: "var(--ink)",
        border: "2px solid var(--ink)",
        borderRadius: 8,
        padding: "2px 6px 2px 2px",
        boxShadow: "2px 2px 0 var(--ink)",
      }}
    >
      <span
        className="inline-block text-[9px] px-1.5 py-0.5 rounded-md"
        style={{
          background: bg,
          color,
          border: "2px solid var(--ink)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
        }}
      >
        {label.toUpperCase()}
      </span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </span>
  );
}

function daysBetweenIso(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  const from = Date.UTC(fy!, fm! - 1, fd!);
  const to = Date.UTC(ty!, tm! - 1, td!);
  return Math.round((to - from) / 86_400_000);
}
