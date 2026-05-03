import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { signOutCurrentUser } from "@/lib/auth";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { useSession } from "@/lib/session";
import { recomputeHousehold } from "@/lib/recompute";

export function SettingsScreen() {
  const { user, household } = useSession();
  const [copied, setCopied] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const [recomputeMsg, setRecomputeMsg] = useState<string | null>(null);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(household.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  async function rebuildCaches() {
    setRecomputeMsg(null);
    setRecomputing(true);
    try {
      const r = await recomputeHousehold(household.id);
      setRecomputeMsg(
        `Rebuilt: ${r.accounts} accounts, ${r.transactions} transactions, ${r.months} months.`,
      );
    } catch (err) {
      setRecomputeMsg(
        err instanceof Error ? err.message : "Couldn't rebuild caches.",
      );
    } finally {
      setRecomputing(false);
    }
  }

  return (
    <PlaceholderScreen
      title="Settings"
      subtitle={`${household.name} · ${household.memberUids.length} member${household.memberUids.length === 1 ? "" : "s"}`}
    >
      <Section title="Invite your spouse">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex flex-col">
            <div className="text-xs uppercase tracking-wide text-white/40">Join code</div>
            <div className="font-mono text-2xl tracking-[0.4em]">{household.joinCode}</div>
          </div>
          <Button variant="secondary" onClick={copyCode}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-white/40">
          Share this code with your spouse. They'll enter it after signing up.
        </p>
      </Section>

      <Section title="Tools">
        <Link
          to="/scheduled"
          className="flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10"
        >
          <div>
            <div className="text-sm text-white/80">Scheduled transactions</div>
            <div className="text-xs text-white/40">Recurring bills, paychecks, transfers.</div>
          </div>
          <span className="text-white/40">›</span>
        </Link>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-white/80">Rebuild caches</div>
              <div className="text-xs text-white/40">
                Recompute every account balance and budget-month summary on the
                server. Use after a CSV import or if a number looks off.
              </div>
            </div>
            <Button
              variant="secondary"
              loading={recomputing}
              onClick={rebuildCaches}
            >
              Rebuild
            </Button>
          </div>
          {recomputeMsg ? (
            <div className="mt-2 text-xs text-emerald-300">{recomputeMsg}</div>
          ) : null}
        </div>
      </Section>

      <Section title="Account">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm text-white/80">{user.displayName ?? "(no name)"}</div>
          <div className="text-xs text-white/40">{user.email}</div>
        </div>
        <Button variant="ghost" onClick={() => void signOutCurrentUser()}>
          Sign out
        </Button>
      </Section>
    </PlaceholderScreen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-white/50">
        {title}
      </h2>
      {children}
    </section>
  );
}
