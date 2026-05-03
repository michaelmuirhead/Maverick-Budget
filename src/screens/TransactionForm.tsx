import { useId, useMemo, useState, type FormEvent } from "react";
import { useSession } from "@/lib/session";
import {
  useAccounts,
  useAllTransactions,
  useCategories,
  useCategoryGroups,
} from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createTransaction,
  createTransfer,
  deleteTransaction,
  setTransactionStatus,
  updateTransaction,
  updateTransfer,
} from "@/lib/transactions";
import { parseCents } from "@/lib/money";
import { todayISO } from "@/lib/dates";
import type {
  AccountDoc,
  TransactionDoc,
  TransactionSplit,
  TransactionStatus,
} from "@/types/schema";

interface SplitDraft {
  /** Magnitude as the user types it (e.g. "12.34"). Sign is applied at save. */
  amountInput: string;
  categoryId: string | null;
  memo: string;
}

interface Props {
  /** The account this form is anchored to (the source side, for transfers). */
  accountId: string;
  accountName: string;
  /** When set, the form runs in edit mode (with a Delete button). */
  existing?: TransactionDoc;
  onDone: () => void;
}

type Direction = "outflow" | "inflow" | "transfer";

export function TransactionForm({ accountId, accountName, existing, onDone }: Props) {
  const { user, household } = useSession();
  const accounts = useAccounts();
  const groups = useCategoryGroups();
  const categories = useCategories();
  const allTxns = useAllTransactions();
  const payeeListId = useId();

  /**
   * Index of payee names → most-recently-used category, derived from history.
   * When the user picks a known payee and hasn't set a category, we pre-fill.
   * Skips transfer txns (their payee names are auto-generated).
   */
  const payeeIndex = useMemo(() => {
    const m = new Map<
      string,
      { name: string; defaultCategoryId: string | null; lastUsedAt: string }
    >();
    for (const t of allTxns.data) {
      if (!t.payeeName || t.transferTransactionId) continue;
      const trimmed = t.payeeName.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      const existing = m.get(key);
      if (!existing || t.date > existing.lastUsedAt) {
        m.set(key, {
          name: trimmed,
          defaultCategoryId: t.categoryId,
          lastUsedAt: t.date,
        });
      }
    }
    return m;
  }, [allTxns.data]);

  const payeeOptions = useMemo(
    () =>
      Array.from(payeeIndex.values())
        .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt))
        .map((p) => p.name),
    [payeeIndex],
  );

  const initialDirection: Direction = existing
    ? existing.transferTransactionId
      ? "transfer"
      : existing.amountCents > 0
        ? "inflow"
        : "outflow"
    : "outflow";

  const initialAmount = existing
    ? Math.abs(existing.amountCents / 100).toFixed(2)
    : "";

  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [amountInput, setAmountInput] = useState(initialAmount);
  const [date, setDate] = useState(existing?.date ?? todayISO());
  const [payeeName, setPayeeName] = useState(
    existing && !existing.transferTransactionId ? (existing.payeeName ?? "") : "",
  );
  const [isSplit, setIsSplit] = useState(
    existing?.splits != null && existing.splits.length > 0,
  );
  const [splits, setSplits] = useState<SplitDraft[]>(() => {
    if (existing?.splits && existing.splits.length > 0) {
      return existing.splits.map((s) => ({
        amountInput: Math.abs(s.amountCents / 100).toFixed(2),
        categoryId: s.categoryId,
        memo: s.memo ?? "",
      }));
    }
    return [
      { amountInput: "", categoryId: null, memo: "" },
      { amountInput: "", categoryId: null, memo: "" },
    ];
  });
  const [categoryId, setCategoryId] = useState<string | null>(
    existing?.categoryId ?? null,
  );
  const [memo, setMemo] = useState(existing?.memo ?? "");
  const [status, setStatus] = useState<TransactionStatus>(
    existing?.status ?? "uncleared",
  );
  // For transfers, the OTHER account. Defaults to the first non-source open account.
  const [destAccountId, setDestAccountId] = useState<string>(() => {
    if (existing?.transferAccountId) return existing.transferAccountId;
    const firstOther = accounts.data.find((a) => a.id !== accountId && !a.closed);
    return firstOther?.id ?? "";
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Direction is locked in edit mode — switching modes mid-edit gets weird
  // (would require deleting one shape and creating another). Hide the segments.
  const editMode = existing !== undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const magnitude = parseCents(amountInput);
    if (!magnitude || magnitude <= 0) {
      setError("Enter an amount.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (direction === "transfer") {
        if (!destAccountId || destAccountId === accountId) {
          throw new Error("Pick a different destination account.");
        }
        const destAcc = accounts.data.find((a) => a.id === destAccountId);
        if (!destAcc) throw new Error("Destination account not found.");
        if (existing) {
          // Update both sides of the transfer (date, amount, memo). Status is
          // handled separately below for the side the user is editing.
          await updateTransfer({
            householdId: household.id,
            transactionId: existing.id,
            date,
            amountCents: magnitude,
            memo,
          });
          if (status !== existing.status) {
            await setTransactionStatus(household.id, existing.id, status);
          }
        } else {
          await createTransfer({
            householdId: household.id,
            createdByUid: user.uid,
            fromAccountId: accountId,
            fromAccountName: accountName,
            toAccountId: destAcc.id,
            toAccountName: destAcc.name,
            date,
            amountCents: magnitude,
            memo,
            status,
          });
        }
      } else {
        const signed = direction === "outflow" ? -magnitude : magnitude;
        const effectiveCategory = direction === "inflow" ? null : categoryId;

        // Build splits payload (outflow + isSplit only).
        let splitsPayload: TransactionSplit[] | null = null;
        if (direction === "outflow" && isSplit) {
          if (splits.length < 2) {
            throw new Error("A split needs at least two lines.");
          }
          let sum = 0;
          const built: TransactionSplit[] = [];
          for (let i = 0; i < splits.length; i++) {
            const s = splits[i];
            const m = parseCents(s.amountInput);
            if (m === null || m <= 0) {
              throw new Error(`Split #${i + 1} needs a positive amount.`);
            }
            if (!s.categoryId) {
              throw new Error(`Split #${i + 1} needs a category.`);
            }
            const signedSplit = -m; // outflow
            sum += signedSplit;
            built.push({
              amountCents: signedSplit,
              categoryId: s.categoryId,
              memo: s.memo.trim() || null,
            });
          }
          if (sum !== signed) {
            throw new Error(
              `Splits add to ${(Math.abs(sum) / 100).toFixed(2)} but total is ${(magnitude / 100).toFixed(2)}.`,
            );
          }
          splitsPayload = built;
        }

        if (existing) {
          await updateTransaction({
            householdId: household.id,
            transactionId: existing.id,
            date,
            amountCents: signed,
            categoryId: splitsPayload ? null : effectiveCategory,
            payeeName,
            memo,
            status,
            splits: splitsPayload,
          });
        } else {
          await createTransaction({
            householdId: household.id,
            createdByUid: user.uid,
            accountId,
            date,
            amountCents: signed,
            categoryId: splitsPayload ? null : effectiveCategory,
            payeeName,
            memo,
            status,
            splits: splitsPayload,
          });
        }
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save transaction.");
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!existing) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteTransaction(household.id, existing.id);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete transaction.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  const groupedCats = groups.data
    .filter((g) => !g.hidden)
    .map((g) => ({
      group: g,
      cats: categories.data.filter((c) => c.groupId === g.id && !c.hidden),
    }));

  const otherAccounts = accounts.data.filter((a) => a.id !== accountId && !a.closed);

  const busy = submitting || deleting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {!editMode ? (
        <div className="grid grid-cols-3 gap-2">
          <SegmentedButton active={direction === "outflow"} onClick={() => setDirection("outflow")}>
            Outflow
          </SegmentedButton>
          <SegmentedButton active={direction === "inflow"} onClick={() => setDirection("inflow")}>
            Inflow
          </SegmentedButton>
          <SegmentedButton
            active={direction === "transfer"}
            onClick={() => setDirection("transfer")}
            disabled={otherAccounts.length === 0}
          >
            Transfer
          </SegmentedButton>
        </div>
      ) : (
        <div className="text-xs text-white/40">
          {direction === "outflow" && "Outflow"}
          {direction === "inflow" && "Inflow"}
          {direction === "transfer" && "Transfer"}
        </div>
      )}

      <Input
        label="Amount"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        placeholder="0.00"
        inputMode="decimal"
        autoFocus={!editMode}
      />

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {direction === "transfer" ? (
        <DestAccountPicker
          accounts={otherAccounts}
          accountId={destAccountId}
          onChange={setDestAccountId}
          fromName={accountName}
          editMode={editMode}
        />
      ) : (
        <>
          <Input
            label="Payee"
            value={payeeName}
            onChange={(e) => {
              const value = e.target.value;
              setPayeeName(value);
              // Auto-fill the category when the user picks a remembered payee
              // and hasn't already chosen a different category.
              if (direction === "outflow" && !isSplit && categoryId === null) {
                const match = payeeIndex.get(value.trim().toLowerCase());
                if (match?.defaultCategoryId) {
                  setCategoryId(match.defaultCategoryId);
                }
              }
            }}
            placeholder={direction === "inflow" ? "e.g. Acme Payroll" : "e.g. Trader Joe's"}
            list={payeeListId}
            autoComplete="off"
          />
          <datalist id={payeeListId}>
            {payeeOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </>
      )}

      {direction === "outflow" ? (
        <>
          {!isSplit ? (
            <CategoryPicker
              categoryId={categoryId}
              onChange={setCategoryId}
              grouped={groupedCats}
            />
          ) : (
            <SplitsEditor
              splits={splits}
              onChange={setSplits}
              grouped={groupedCats}
              totalMagnitudeCents={parseCents(amountInput) ?? 0}
            />
          )}
          <button
            type="button"
            onClick={() => {
              if (!isSplit) {
                // Pre-seed first split with the current single category so
                // the user doesn't lose context when toggling.
                setSplits((prev) =>
                  prev[0] && prev[0].categoryId === null && categoryId
                    ? [{ ...prev[0], categoryId }, ...prev.slice(1)]
                    : prev,
                );
              }
              setIsSplit((v) => !v);
            }}
            className="self-start text-xs text-brand-300 hover:text-brand-200"
          >
            {isSplit ? "Use a single category" : "Split this transaction"}
          </button>
        </>
      ) : direction === "inflow" ? (
        <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
          Inflow goes to <strong>Ready to Assign</strong> on the Budget tab.
        </div>
      ) : (
        <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-xs text-blue-300 ring-1 ring-blue-500/20">
          Transfers move money between accounts and don't affect Ready to Assign.
        </div>
      )}

      <Input
        label="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Optional"
      />

      <StatusPicker status={status} onChange={setStatus} disabled={busy} />

      <div className="text-xs text-white/40">
        Account: <span className="text-white/70">{accountName}</span>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} fullWidth>
          {existing ? "Save changes" : "Save transaction"}
        </Button>
      </div>

      {existing ? (
        <div className="border-t border-white/5 pt-4">
          {confirmingDelete ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/60">
                {direction === "transfer"
                  ? "Delete this transfer? Both sides will be removed."
                  : "Delete this transaction? It can't be undone."}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                >
                  Keep it
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={onDelete}
                  loading={deleting}
                  fullWidth
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
              className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
            >
              Delete transaction
            </Button>
          )}
        </div>
      ) : null}
    </form>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SegmentedButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "min-h-[44px] rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-inset transition-colors",
        active
          ? "bg-brand-500/15 text-white ring-brand-500/60"
          : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CategoryPicker({
  categoryId,
  onChange,
  grouped,
}: {
  categoryId: string | null;
  onChange: (id: string | null) => void;
  grouped: { group: { id: string; name: string }; cats: { id: string; name: string }[] }[];
}) {
  const flat = grouped.flatMap((g) => g.cats);
  if (flat.length === 0) {
    return (
      <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-200 ring-1 ring-amber-500/20">
        No categories yet. Create some on the <strong>Budget</strong> tab first.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/70">Category</label>
      <select
        value={categoryId ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
      >
        <option value="">— uncategorized —</option>
        {grouped.map((g) =>
          g.cats.length > 0 ? (
            <optgroup key={g.group.id} label={g.group.name}>
              {g.cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ) : null,
        )}
      </select>
    </div>
  );
}

function DestAccountPicker({
  accounts,
  accountId,
  onChange,
  fromName,
  editMode,
}: {
  accounts: AccountDoc[];
  accountId: string;
  onChange: (id: string) => void;
  fromName: string;
  editMode: boolean;
}) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-200 ring-1 ring-amber-500/20">
        Create another account before transferring.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/70">
        Transfer from {fromName} to
      </label>
      <select
        value={accountId}
        onChange={(e) => onChange(e.target.value)}
        disabled={editMode}
        className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60 disabled:opacity-60"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      {editMode ? (
        <p className="text-[11px] text-white/40">
          To change the destination, delete this transfer and create a new one.
        </p>
      ) : null}
    </div>
  );
}

function SplitsEditor({
  splits,
  onChange,
  grouped,
  totalMagnitudeCents,
}: {
  splits: SplitDraft[];
  onChange: (next: SplitDraft[]) => void;
  grouped: { group: { id: string; name: string }; cats: { id: string; name: string }[] }[];
  totalMagnitudeCents: number;
}) {
  const sumCents = splits.reduce(
    (s, x) => s + (parseCents(x.amountInput) ?? 0),
    0,
  );
  const remaining = totalMagnitudeCents - sumCents;

  function patch(i: number, p: Partial<SplitDraft>) {
    onChange(splits.map((s, idx) => (idx === i ? { ...s, ...p } : s)));
  }
  function remove(i: number) {
    if (splits.length <= 2) return;
    onChange(splits.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...splits, { amountInput: "", categoryId: null, memo: "" }]);
  }
  function fillRemainingInto(i: number) {
    if (remaining <= 0) return;
    const cur = parseCents(splits[i].amountInput) ?? 0;
    patch(i, { amountInput: ((cur + remaining) / 100).toFixed(2) });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-white/70">Splits</label>
      <div className="flex flex-col gap-2 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
        {splits.map((s, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg bg-white/5 p-2 ring-1 ring-white/5">
            <div className="flex items-center gap-2">
              <input
                value={s.amountInput}
                onChange={(e) => patch(i, { amountInput: e.target.value })}
                placeholder="0.00"
                inputMode="decimal"
                className="min-h-[40px] w-24 rounded-lg bg-white/5 px-3 text-sm text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-brand-400/60 tabular-nums"
              />
              <select
                value={s.categoryId ?? ""}
                onChange={(e) => patch(i, { categoryId: e.target.value || null })}
                className="min-h-[40px] flex-1 rounded-lg bg-white/5 px-3 text-sm text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-brand-400/60"
              >
                <option value="">Pick a category…</option>
                {grouped.map((g) =>
                  g.cats.length > 0 ? (
                    <optgroup key={g.group.id} label={g.group.name}>
                      {g.cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null,
                )}
              </select>
              {splits.length > 2 ? (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove split"
                  className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={s.memo}
                onChange={(e) => patch(i, { memo: e.target.value })}
                placeholder="Memo (optional)"
                className="min-h-[36px] flex-1 rounded-lg bg-white/5 px-3 text-xs text-white/80 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-brand-400/60"
              />
              {remaining > 0 ? (
                <button
                  type="button"
                  onClick={() => fillRemainingInto(i)}
                  className="text-[11px] text-brand-300 hover:text-brand-200"
                >
                  Fill remaining
                </button>
              ) : null}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="self-start rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white/70 ring-1 ring-white/10 hover:bg-white/10"
        >
          + Add split
        </button>
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-[11px] tabular-nums">
          <span className="text-white/50">
            Sum {(sumCents / 100).toFixed(2)} of {(totalMagnitudeCents / 100).toFixed(2)}
          </span>
          <span
            className={
              remaining === 0
                ? "text-emerald-300"
                : remaining > 0
                  ? "text-amber-300"
                  : "text-red-300"
            }
          >
            {remaining === 0
              ? "Balanced"
              : remaining > 0
                ? `${(remaining / 100).toFixed(2)} remaining`
                : `${(Math.abs(remaining) / 100).toFixed(2)} over`}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusPicker({
  status,
  onChange,
  disabled,
}: {
  status: TransactionStatus;
  onChange: (s: TransactionStatus) => void;
  disabled?: boolean;
}) {
  const opts: { value: TransactionStatus; label: string }[] = [
    { value: "uncleared", label: "Uncleared" },
    { value: "cleared", label: "Cleared" },
  ];
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/70">Status</label>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o) => (
          <SegmentedButton
            key={o.value}
            active={status === o.value}
            onClick={() => onChange(o.value)}
            disabled={disabled}
          >
            {o.label}
          </SegmentedButton>
        ))}
      </div>
    </div>
  );
}
