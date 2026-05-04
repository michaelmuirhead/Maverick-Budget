import { useState } from "react";
import type { User } from "firebase/auth";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useUserHouseholds } from "@/hooks/useUserHouseholds";
import { setActiveHousehold } from "@/lib/household";
import { NewPlanModal } from "./NewPlanModal";
import type { HouseholdDoc } from "@/types/schema";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  activeHouseholdId: string;
}

export function HouseholdSwitcher({ open, onClose, user, activeHouseholdId }: Props) {
  const { loading, households } = useUserHouseholds(user.uid);
  const [creating, setCreating] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  async function pick(h: HouseholdDoc) {
    if (h.id === activeHouseholdId) {
      onClose();
      return;
    }
    setSwitching(h.id);
    try {
      await setActiveHousehold(user.uid, h.id);
      // useAppState picks up the change and re-renders the whole app.
      onClose();
    } finally {
      setSwitching(null);
    }
  }

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Switch plan">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-sm text-white/40">Loading…</div>
          ) : households.length === 0 ? (
            <div className="text-sm text-white/40">No plans yet.</div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {households.map((h) => {
                const active = h.id === activeHouseholdId;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => pick(h)}
                      disabled={switching !== null}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left ring-1 ring-inset transition-colors",
                        active
                          ? "bg-brand-500/15 text-white ring-brand-500/60"
                          : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{h.name}</span>
                        <span className="text-[11px] text-white/40">
                          {h.currency}
                          {" · "}
                          {h.memberUids.length} member{h.memberUids.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      {active ? (
                        <span className="text-xs uppercase tracking-wide text-brand-300">
                          Active
                        </span>
                      ) : switching === h.id ? (
                        <span className="text-xs text-white/40">Switching…</span>
                      ) : (
                        <span className="text-white/40">›</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-white/5 pt-3">
            <Button onClick={() => setCreating(true)} fullWidth>
              + New Plan
            </Button>
          </div>
        </div>
      </Sheet>

      <NewPlanModal
        open={creating}
        onClose={() => {
          setCreating(false);
          onClose(); // close the switcher too — the new plan is now active.
        }}
        user={user}
      />
    </>
  );
}
