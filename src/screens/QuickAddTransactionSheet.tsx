import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { useAccounts } from "@/hooks/useHouseholdData";
import { TransactionForm } from "./TransactionForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Quick-add transaction sheet, accessible from anywhere via the floating
 * action button. Picks a default account (first open on-budget account, or
 * first open account at all) and lets the user change it inline before
 * delegating to the existing TransactionForm.
 *
 * Plaid matching readiness: every transaction created here is recorded with
 * source: "manual" and a precise date + amount. When Phase 2.8 ships and
 * Plaid begins importing transactions, the import will run a match query of
 * the form `accountId == X AND amountCents == Y AND |date − plaidDate| ≤ 5d`
 * before creating new docs — so a manual entry made today won't double up
 * when the same transaction lands from the bank a few days later.
 */
export function QuickAddTransactionSheet({ open, onClose }: Props) {
  const accounts = useAccounts();

  const openAccounts = accounts.data.filter((a) => !a.closed);
  const defaultAccountId =
    openAccounts.find((a) => a.onBudget)?.id ?? openAccounts[0]?.id ?? "";
  const [accountId, setAccountId] = useState(defaultAccountId);

  // Whenever the account list (re)loads, ensure we have a valid selection.
  useEffect(() => {
    if (openAccounts.length === 0) {
      setAccountId("");
      return;
    }
    if (!openAccounts.find((a) => a.id === accountId)) {
      setAccountId(defaultAccountId);
    }
  }, [openAccounts.map((a) => a.id).join("|"), defaultAccountId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const selected = openAccounts.find((a) => a.id === accountId);

  return (
    <Sheet open={open} onClose={onClose} title="Quick add">
      {openAccounts.length === 0 ? (
        <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-200 ring-1 ring-amber-500/20">
          Add an account first before logging transactions.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-white/70">Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
            >
              {openAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {selected ? (
            <TransactionForm
              key={selected.id /* re-mount when account changes */}
              accountId={selected.id}
              accountName={selected.name}
              onDone={onClose}
            />
          ) : null}
        </div>
      )}
    </Sheet>
  );
}
