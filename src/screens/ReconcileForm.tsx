import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import { planReconcile, reconcileAccount } from "@/lib/transactions";
import { formatCents, formatCentsSigned, parseCents } from "@/lib/money";
import { todayISO } from "@/lib/dates";
import type { AccountDoc, TransactionDoc } from "@/types/schema";

interface Props {
  account: AccountDoc;
  transactions: TransactionDoc[];
  onDone: () => void;
}

export function ReconcileForm({ account, transactions, onDone }: Props) {
  const { user, household } = useSession();
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [balanceInput, setBalanceInput] = useState(
    (
      transactions.reduce((s, t) => s + t.amountCents, 0) / 100
    ).toFixed(2),
  );
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const statedBalanceCents = useMemo(() => parseCents(balanceInput), [balanceInput]);
  const plan = useMemo(() => {
    if (statedBalanceCents === null) return null;
    return planReconcile(transactions, statedBalanceCents);
  }, [transactions, statedBalanceCents]);

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (statedBalanceCents === null) {
      setError("Enter the balance from your bank.");
      return;
    }
    setError(null);
    setStep("confirm");
  }

  async function commit() {
    if (statedBalanceCents === null) return;
    setError(null);
    setSubmitting(true);
    try {
      await reconcileAccount({
        householdId: household.id,
        accountId: account.id,
        createdByUid: user.uid,
        statedBalanceCents,
        date,
        accountTransactions: transactions,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reconcile.");
      setSubmitting(false);
    }
  }

  if (step === "input") {
    return (
      <form onSubmit={next} className="flex flex-col gap-4">
        <p className="text-sm text-white/70">
          Open your bank or card account and find the current balance — that's the
          number we'll match.
        </p>
        <Input
          label={`Today's balance for ${account.name}`}
          value={balanceInput}
          onChange={(e) => setBalanceInput(e.target.value)}
          placeholder="0.00"
          inputMode="decimal"
          autoFocus
          hint="Enter as it appears on your bank — negative for credit-card debt."
        />
        <Input
          label="Adjustment date (if needed)"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {error ? (
          <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
            {error}
          </div>
        ) : null}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" fullWidth>
            Next
          </Button>
        </div>
      </form>
    );
  }

  // Confirm step.
  return (
    <div className="flex flex-col gap-4">
      <PlanSummary
        statedCents={statedBalanceCents ?? 0}
        plan={plan}
        currency={household.currency}
      />
      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep("input")}
          disabled={submitting}
        >
          Back
        </Button>
        <Button type="button" onClick={commit} loading={submitting} fullWidth>
          Reconcile
        </Button>
      </div>
    </div>
  );
}

function PlanSummary({
  statedCents,
  plan,
  currency,
}: {
  statedCents: number;
  plan: ReturnType<typeof planReconcile> | null;
  currency: string;
}) {
  if (!plan) return null;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <Row label="Bank balance" value={formatCents(statedCents, currency)} />
      <Row
        label="Adjustment"
        value={
          plan.adjustmentCents === 0 ? (
            <span className="text-emerald-300">None — books match!</span>
          ) : (
            <span
              className={
                plan.adjustmentCents < 0 ? "text-red-300" : "text-emerald-300"
              }
            >
              {formatCentsSigned(plan.adjustmentCents, currency)}
            </span>
          )
        }
      />
      <Row
        label="Will mark reconciled"
        value={
          <span>
            {plan.reconciledCount} transaction{plan.reconciledCount === 1 ? "" : "s"}
          </span>
        }
      />
      {plan.unclearedCount > 0 ? (
        <p className="text-xs text-white/50">
          ({plan.unclearedCount} were uncleared and will be cleared as part of reconciling.)
        </p>
      ) : null}
      {plan.adjustmentCents !== 0 ? (
        <p className="text-xs text-white/50">
          A "Reconciliation Adjustment" transaction will be created so the running
          balance matches your bank. It's uncategorized and feeds Ready to Assign
          if positive (or pulls from RTA if negative).
        </p>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
