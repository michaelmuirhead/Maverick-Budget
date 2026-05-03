import { useState, type FormEvent } from "react";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ACCOUNT_TYPES, createAccount } from "@/lib/accounts";
import { parseCents } from "@/lib/money";
import type { AccountType } from "@/types/schema";

interface Props {
  onDone: () => void;
}

export function CreateAccountForm({ onDone }: Props) {
  const { user, household } = useSession();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [balanceInput, setBalanceInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give the account a name.");
      return;
    }
    const startingBalanceCents = balanceInput ? parseCents(balanceInput) : 0;
    if (startingBalanceCents === null) {
      setError("Couldn't read that starting balance.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createAccount({
        householdId: household.id,
        createdByUid: user.uid,
        name,
        type,
        startingBalanceCents,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create account.");
      setSubmitting(false);
    }
  }

  const onBudgetMeta = ACCOUNT_TYPES.find((t) => t.value === type);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Chase Checking"
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
                "rounded-xl px-3 py-2 text-left text-sm ring-1 ring-inset transition-colors",
                "min-h-[44px] flex flex-col justify-center",
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
      </div>

      <Input
        label="Starting balance"
        value={balanceInput}
        onChange={(e) => setBalanceInput(e.target.value)}
        placeholder="0.00"
        inputMode="decimal"
        hint={
          onBudgetMeta?.onBudget
            ? "Positive amount = current balance. For credit cards, enter what you owe as a negative number (e.g. -250.00)."
            : "Current balance of the account."
        }
      />

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} fullWidth>
          Create account
        </Button>
      </div>
    </form>
  );
}
