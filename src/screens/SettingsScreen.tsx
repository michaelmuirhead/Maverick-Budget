import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signOutCurrentUser } from "@/lib/auth";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { useSession } from "@/lib/session";

export function SettingsScreen() {
  const { user, household } = useSession();
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(household.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
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
