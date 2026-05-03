import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "@/lib/session";
import {
  useAccountTransactions,
  useAccounts,
  useCategories,
} from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { TransactionForm } from "./TransactionForm";
import { EditAccountForm } from "./EditAccountForm";
import { computeAccountBalance } from "@/lib/budget";
import { formatCents, formatCentsSigned } from "@/lib/money";
import { formatHumanDate } from "@/lib/dates";
import type { CategoryDoc, TransactionDoc } from "@/types/schema";

export function AccountDetailScreen() {
  const { accountId } = useParams<{ accountId: string }>();
  const { household } = useSession();
  const accounts = useAccounts();
  const categories = useCategories();
  const txns = useAccountTransactions(accountId ?? null);
  const [adding, setAdding] = useState(false);
  const [editingTxn, setEditingTxn] = useState<TransactionDoc | null>(null);
  const [editingAccount, setEditingAccount] = useState(false);

  const account = accounts.data.find((a) => a.id === accountId);

  const balance = useMemo(() => {
    if (!account) return { totalCents: 0, clearedCents: 0 };
    return computeAccountBalance(account.id, txns.data);
  }, [account, txns.data]);

  const categoryById = useMemo(() => {
    const m = new Map<string, CategoryDoc>();
    for (const c of categories.data) m.set(c.id, c);
    return m;
  }, [categories.data]);

  if (!accountId) return null;

  if (accounts.status === "ready" && !account) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-12">
        <div className="text-sm text-white/60">Account not found.</div>
        <Link to="/accounts" className="text-sm text-brand-300 hover:text-brand-200">
          ← Back to accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-12">
      <header className="safe-top flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link
            to="/accounts"
            className="text-xs uppercase tracking-wide text-white/40 hover:text-white/70"
          >
            ← Accounts
          </Link>
          {account ? (
            <button
              type="button"
              onClick={() => setEditingAccount(true)}
              aria-label="Edit account"
              className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{account?.name ?? "…"}</h1>
            <p className="mt-1 text-sm text-white/60">
              {account?.closed ? <span className="text-amber-300">Closed · </span> : null}
              Cleared {formatCents(balance.clearedCents, household.currency)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Balance</div>
            <div
              className={[
                "text-2xl font-bold tabular-nums",
                balance.totalCents < 0 ? "text-red-300" : "text-white",
              ].join(" ")}
            >
              {formatCents(balance.totalCents, household.currency)}
            </div>
          </div>
        </div>
        <Button onClick={() => setAdding(true)} variant="secondary">
          + Add transaction
        </Button>
      </header>

      {txns.status === "loading" ? (
        <div className="text-sm text-white/40">Loading transactions…</div>
      ) : txns.data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          No transactions yet.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          {txns.data.map((t, i) => (
            <li key={t.id} className={i > 0 ? "border-t border-white/5" : undefined}>
              <button
                type="button"
                onClick={() => setEditingTxn(t)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/[0.03]"
              >
                <TxnRow
                  txn={t}
                  category={t.categoryId ? categoryById.get(t.categoryId) : undefined}
                  currency={household.currency}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={adding} onClose={() => setAdding(false)} title="New transaction">
        {account ? (
          <TransactionForm
            accountId={account.id}
            accountName={account.name}
            onDone={() => setAdding(false)}
          />
        ) : null}
      </Sheet>

      <Sheet
        open={editingTxn !== null}
        onClose={() => setEditingTxn(null)}
        title="Edit transaction"
      >
        {account && editingTxn ? (
          <TransactionForm
            accountId={account.id}
            accountName={account.name}
            existing={editingTxn}
            onDone={() => setEditingTxn(null)}
          />
        ) : null}
      </Sheet>

      <Sheet
        open={editingAccount}
        onClose={() => setEditingAccount(false)}
        title="Edit account"
      >
        {account ? (
          <EditAccountForm
            account={account}
            onDone={() => setEditingAccount(false)}
          />
        ) : null}
      </Sheet>
    </div>
  );
}

function TxnRow({
  txn,
  category,
  currency,
}: {
  txn: TransactionDoc;
  category: CategoryDoc | undefined;
  currency: string;
}) {
  const isInflow = txn.amountCents > 0;
  const isCleared = txn.status === "cleared" || txn.status === "reconciled";
  return (
    <>
      <div className="min-w-0 flex flex-col">
        <div className="flex items-center gap-2">
          {isCleared ? (
            <span
              className="inline-block size-1.5 shrink-0 rounded-full bg-emerald-400"
              aria-label="Cleared"
              title="Cleared"
            />
          ) : (
            <span
              className="inline-block size-1.5 shrink-0 rounded-full bg-white/30"
              aria-label="Uncleared"
              title="Uncleared"
            />
          )}
          <span className="truncate text-sm font-medium">
            {txn.payeeName ?? <span className="text-white/40">(no payee)</span>}
          </span>
        </div>
        <span className="truncate text-xs text-white/40">
          {formatHumanDate(txn.date)}
          {category ? <> · {category.name}</> : txn.categoryId === null ? <> · Inflow</> : null}
          {txn.memo ? <> · {txn.memo}</> : null}
        </span>
      </div>
      <span
        className={[
          "shrink-0 text-sm font-semibold tabular-nums",
          isInflow ? "text-emerald-300" : "text-white",
        ].join(" ")}
      >
        {formatCentsSigned(txn.amountCents, currency)}
      </span>
    </>
  );
}
