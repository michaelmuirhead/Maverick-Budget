import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import { ACCOUNT_TYPES, updateAccount } from "@/lib/accounts";
import { ToggleRow } from "./EditGroupForm";
import type { AccountDoc, AccountType } from "@/types/schema";

interface Props {
  account: AccountDoc;
  onDone: () => void;
}

export function EditAccountForm({ account, onDone }: Props) {
  const { household } = useSession();
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [closed, setClosed] = useState(account.closed);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Account needs a name.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateAccount(household.id, account.id, { name, type, closed });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save account.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white/70">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {ACCOUNT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={[
                "min-h-[44px] rounded-xl px-3 py-2 text-left text-sm ring-1 ring-inset transition-colors",
                "flex flex-col justify-center",
                type === t.value
                  ? "bg-brand-500/15 text-white ring-brand-500/60"
                  : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              <span>{t.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/40">
                {t.onBudget ? "On budget" : "Tracking"}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-white/40">
          Changing on-budget vs tracking can shift Ready to Assign — be deliberate.
        </p>
      </div>

      <ToggleRow
        label={closed ? "Closed account" : "Close this account"}
        description={
          closed
            ? "Closed accounts are hidden from the main UI. History is preserved."
            : "Closing keeps the history but hides the account from the main UI."
        }
        checked={closed}
        onChange={setClosed}
      />

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} fullWidth>
          Save
        </Button>
      </div>
    </form>
  );
}
