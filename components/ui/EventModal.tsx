"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatDate, formatMoney, cn } from "@/lib/format";
import { SCHEDULED_EVENTS, RANDOM_EVENTS } from "@/engine";
import { NARRATIVE_CHAINS } from "@/engine/data/narrativeChains";

// Shape the modal renders against. Both regular events and chain beats
// project into this so the JSX below stays single-codepath.
interface ModalEvent {
  category: string;
  name: string;
  description: string;
  severity: string;
  choices: {
    id: string;
    label: string;
    description: string;
    effects?: { cash?: number; reputation?: number };
  }[];
}

// Shows the oldest pending event (if any) as a modal overlay.
// Player must pick a choice to dismiss. Tick loop keeps running behind it.
export function EventModal() {
  const state = useGameStore((s) => s.state);
  const resolveEventChoice = useGameStore((s) => s.resolveEventChoice);

  if (!state || state.pendingEvents.length === 0) return null;

  const pending = state.pendingEvents[0]!;

  // Project the pending into a uniform ModalEvent shape: chain pendings
  // pull from NARRATIVE_CHAINS, everything else from the event tables.
  let evt: ModalEvent | null = null;
  if (pending.chain) {
    const def = NARRATIVE_CHAINS.find((c) => c.id === pending.chain!.chainId);
    const beat = def?.beats.find((b) => b.id === pending.chain!.beatId);
    if (def && beat?.choices) {
      evt = {
        category: def.category,
        name: def.name,
        description: beat.body,
        severity: beat.severity ?? "info",
        choices: beat.choices.map((c) => ({
          id: c.id,
          label: c.label,
          description: c.description,
          effects: { cash: c.effects?.cash, reputation: c.effects?.reputation },
        })),
      };
    }
  } else {
    const scheduled = SCHEDULED_EVENTS.find((e) => e.id === pending.eventDefId);
    const random = RANDOM_EVENTS.find((e) => e.id === pending.eventDefId);
    const def = scheduled ?? random;
    if (def && def.choices) {
      evt = {
        category: def.category,
        name: def.name,
        description: def.description,
        severity: def.severity,
        choices: def.choices.map((c) => ({
          id: c.id,
          label: c.label,
          description: c.description,
          effects: { cash: c.effects?.cash, reputation: c.effects?.reputation },
        })),
      };
    }
  }
  if (!evt) return null;

  const staffName = pending.context?.staffName as string | undefined;

  // Cover both event severity vocab (flavor/minor/moderate/major/landmark)
  // and chain beat vocab (info/success/warning/danger).
  const severityTone = ({
    flavor: "text-[color:var(--amber-dim)]",
    minor: "text-[color:var(--amber)]",
    moderate: "text-[color:var(--amber-bright)]",
    major: "status-warn",
    landmark: "status-ok",
    info: "text-[color:var(--amber)]",
    success: "status-ok",
    warning: "status-warn",
    danger: "status-warn",
  } as Record<string, string>)[evt.severity] ?? "text-[color:var(--amber)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{
        background: "rgba(10, 8, 5, 0.85)",
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-w-xl w-full max-h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <Panel
          title={`EVENT — ${evt.category.toUpperCase()}`}
          headerRight={
            <span className={cn("text-xs uppercase tracking-widest", severityTone)}>
              {evt.severity}
            </span>
          }
        >
          <div className="mb-2">
            <h3 className="text-[color:var(--amber-bright)] font-[family-name:var(--font-display)] tracking-widest mb-2">
              {evt.name}
            </h3>
            {staffName && (
              <div className="text-xs text-[color:var(--amber-dim)] mb-2">
                Involves <span className="text-[color:var(--amber)]">{staffName}</span>
              </div>
            )}
            <div className="text-sm text-[color:var(--amber-dim)]">
              {evt.description}
            </div>
          </div>

          <hr className="divider" />

          <div className="space-y-2">
            {evt.choices.map((choice) => {
              const costDisplay = formatChoiceBadge(choice);
              return (
                <button
                  key={choice.id}
                  onClick={() => resolveEventChoice(pending.id, choice.id)}
                  className="w-full text-left p-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[color:var(--amber-bright)]">{choice.label}</span>
                    {costDisplay && <span className="text-xs tabular">{costDisplay}</span>}
                  </div>
                  <div className="text-xs text-[color:var(--amber-dim)] mt-1">
                    {choice.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-[color:var(--amber-dim)] text-center">
            {formatDate(pending.spawnedDate)} · {state.pendingEvents.length > 1 ? `${state.pendingEvents.length - 1} more queued` : "this needs your decision"}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function formatChoiceBadge(choice: { effects?: { cash?: number; reputation?: number } }) {
  const eff = choice.effects;
  if (!eff) return null;
  const bits: string[] = [];
  if (eff.cash !== undefined && eff.cash !== 0) {
    bits.push(formatMoney(eff.cash));
  }
  if (eff.reputation !== undefined && eff.reputation !== 0) {
    bits.push(`${eff.reputation > 0 ? "+" : ""}${eff.reputation} REP`);
  }
  return bits.length > 0 ? bits.join(" · ") : null;
}
