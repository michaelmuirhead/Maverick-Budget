import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/session";
import { useAccounts, useAllTransactions } from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { CreateAccountForm } from "./CreateAccountForm";
import { computeAccountBalance } from "@/lib/budget";
import { formatCents } from "@/lib/money";
import type { AccountDoc, TransactionDoc } from "@/types/schema";

export function AccountsScreen() {
  const { household } = useSession();
  const accounts = useAccounts();
  const transactions = useAllTransactions();
  const [creating, setCreating] = useState(false);

  const balancesByAccountId = useMemo(() => {
    const m = new Map<string, ReturnType<typeof computeAccountBalance>>();
    for (const acc of accounts.data) {
      m.set(acc.id, computeAccountBalance(acc.id, transactions.data));
    }
    return m;
  }, [accounts.data, transactions.data]);

  const onBudget = accounts.data.filter((a) => a.onBudget && !a.closed);
  const offBudget = accounts.data.filter((a) => !a.onBudget && !a.closed);

  const totalOnBudget = sumBalances(onBudget, balancesByAccountId);
  const totalOffBudget = sumBalances(offBudget, balancesByAccountId);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-12">
      <header className="safe-top flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-white/60">
            {accounts.data.length === 0
              ? "Add an account to start tracking."
              : `${accounts.data.length} account${accounts.data.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Add</Button>
      </header>

      {accounts.status === "loading" ? <Skeleton /> : null}

      {accounts.status !== "loading" && accounts.data.length === 0 ? (
        <EmptyState onAdd={() => setCreating(true)} />
      ) : null}

      {onBudget.length > 0 ? (
        <Section
          title="Budget accounts"
          total={formatCents(totalOnBudget, household.currency)}
          accounts={onBudget}
          balances={balancesByAccountId}
          currency={household.currency}
        />
      ) : null}

      {offBudget.length > 0 ? (
        <Section
          title="Tracking accounts"
          total={formatCents(totalOffBudget, household.currency)}
          accounts={offBudget}
          balances={balancesByAccountId}
          currency={household.currency}
        />
      ) : null}

      <Sheet open={creating} onClose={() => setCreating(false)} title="Add account">
        <CreateAccountForm onDone={() => setCreating(false)} />
      </Sheet>
    </div>
  );
}

function sumBalances(
  accounts: AccountDoc[],
  balances: Map<string, { totalCents: number }>,
) {
  return accounts.reduce((sum, a) => sum + (balances.get(a.id)?.totalCents ?? 0), 0);
}

function Section({
  title,
  total,
  accounts,
  balances,
  currency,
}: {
  title: string;
  total: string;
  accounts: AccountDoc[];
  balances: Map<string, ReturnType<typeof computeAccountBalance>>;
  currency: string;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-white/50">
          {title}
        </h2>
        <span className="text-xs text-white/50">{total}</span>
      </div>
      <ul className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        {accounts.map((a, i) => (
          <li key={a.id} className={i > 0 ? "border-t border-white/5" : undefined}>
            <Link
              to={`/accounts/${a.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.03]"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{a.name}</span>
                <span className="text-xs text-white/40">{prettyType(a.type)}</span>
              </div>
              <BalancePill cents={balances.get(a.id)?.totalCents ?? 0} currency={currency} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BalancePill({ cents, currency }: { cents: number; currency: string }) {
  const negative = cents < 0;
  return (
    <span
      className={[
        "rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums",
        negative ? "text-red-300" : "text-white",
      ].join(" ")}
    >
      {formatCents(cents, currency)}
    </span>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <div className="text-sm text-white/60">
        You don't have any accounts yet.
      </div>
      <div className="mt-3">
        <Button onClick={onAdd}>+ Add your first account</Button>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-2xl bg-white/5"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function prettyType(t: TransactionDoc["accountId"] | string): string {
  // accountId param is misused for typing; this is just a string lookup.
  const map: Record<string, string> = {
    checking: "Checking",
    savings: "Savings",
    cash: "Cash",
    creditCard: "Credit Card",
    lineOfCredit: "Line of Credit",
    loan: "Loan",
    mortgage: "Mortgage",
    investment: "Investment",
    tracking: "Tracking",
  };
  return map[t as string] ?? (t as string);
}
