import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/session";
import {
  useAccounts,
  useCategories,
  useCategoryGroups,
  useScheduledTransactions,
} from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { formatCentsSigned, parseCents } from "@/lib/money";
import { formatHumanDate, todayISO } from "@/lib/dates";
import {
  createScheduledTransaction,
  deleteScheduledTransaction,
  postScheduledTransaction,
  updateScheduledTransaction,
} from "@/lib/scheduled";
import type {
  AccountDoc,
  CategoryDoc,
  ScheduledTransactionDoc,
  ScheduleFrequency,
} from "@/types/schema";

const FREQUENCIES: { value: ScheduleFrequency; label: string }[] = [
  { value: "never", label: "Once (no repeat)" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "everyOtherWeek", label: "Every other week" },
  { value: "twiceAMonth", label: "Twice a month" },
  { value: "every4Weeks", label: "Every 4 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "everyOtherMonth", label: "Every other month" },
  { value: "every3Months", label: "Every 3 months" },
  { value: "every4Months", label: "Every 4 months" },
  { value: "twiceAYear", label: "Twice a year" },
  { value: "yearly", label: "Yearly" },
  { value: "everyOtherYear", label: "Every other year" },
];

export function ScheduledScreen() {
  const { household } = useSession();
  const accounts = useAccounts();
  const categories = useCategories();
  const scheduled = useScheduledTransactions();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ScheduledTransactionDoc | null>(null);

  const today = todayISO();
  const due = scheduled.data.filter((s) => s.nextDate <= today);
  const upcoming = scheduled.data.filter((s) => s.nextDate > today);

  const accountById = useMemo(() => {
    const m = new Map<string, AccountDoc>();
    for (const a of accounts.data) m.set(a.id, a);
    return m;
  }, [accounts.data]);

  const categoryById = useMemo(() => {
    const m = new Map<string, CategoryDoc>();
    for (const c of categories.data) m.set(c.id, c);
    return m;
  }, [categories.data]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-12">
      <header className="safe-top flex items-end justify-between gap-4">
        <div>
          <Link
            to="/settings"
            className="text-xs uppercase tracking-wide text-white/40 hover:text-white/70"
          >
            ← Settings
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Scheduled</h1>
          <p className="mt-1 text-sm text-white/60">
            {scheduled.data.length === 0
              ? "Set up recurring bills, paychecks, and transfers."
              : `${due.length} due · ${upcoming.length} upcoming`}
          </p>
        </div>
        <Button onClick={() => setAdding(true)} disabled={accounts.data.length === 0}>
          + Add
        </Button>
      </header>

      {accounts.data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
          Add an account first.
        </div>
      ) : null}

      {due.length > 0 ? (
        <Section title="Due now">
          {due.map((s) => (
            <ScheduledRow
              key={s.id}
              scheduled={s}
              account={accountById.get(s.accountId)}
              category={s.categoryId ? categoryById.get(s.categoryId) : undefined}
              currency={household.currency}
              isDue
              onPost={async () => {
                await postScheduledTransaction(household.id, s);
              }}
              onEdit={() => setEditing(s)}
            />
          ))}
        </Section>
      ) : null}

      {upcoming.length > 0 ? (
        <Section title="Upcoming">
          {upcoming.map((s) => (
            <ScheduledRow
              key={s.id}
              scheduled={s}
              account={accountById.get(s.accountId)}
              category={s.categoryId ? categoryById.get(s.categoryId) : undefined}
              currency={household.currency}
              isDue={false}
              onPost={async () => {
                await postScheduledTransaction(household.id, s);
              }}
              onEdit={() => setEditing(s)}
            />
          ))}
        </Section>
      ) : null}

      {scheduled.data.length === 0 && accounts.data.length > 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          Nothing scheduled. Add one with the + button.
        </div>
      ) : null}

      <Sheet open={adding} onClose={() => setAdding(false)} title="Schedule a transaction">
        <ScheduledForm onDone={() => setAdding(false)} />
      </Sheet>
      <Sheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit scheduled"
      >
        {editing ? (
          <ScheduledForm existing={editing} onDone={() => setEditing(null)} />
        ) : null}
      </Sheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-white/50">
        {title}
      </h2>
      <ul className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">{children}</ul>
    </section>
  );
}

function ScheduledRow({
  scheduled,
  account,
  category,
  currency,
  isDue,
  onPost,
  onEdit,
}: {
  scheduled: ScheduledTransactionDoc;
  account: AccountDoc | undefined;
  category: CategoryDoc | undefined;
  currency: string;
  isDue: boolean;
  onPost: () => Promise<void>;
  onEdit: () => void;
}) {
  const [posting, setPosting] = useState(false);
  return (
    <li className="border-b border-white/5 last:border-b-0">
      <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2 px-4 py-3">
        <button type="button" onClick={onEdit} className="text-left hover:opacity-80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {scheduled.payeeName ?? <span className="text-white/40">(no payee)</span>}
            </span>
            {isDue ? (
              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                Due
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 text-[11px] text-white/40">
            {formatHumanDate(scheduled.nextDate)} ·
            {" "}
            {FREQUENCIES.find((f) => f.value === scheduled.frequency)?.label}
            {account ? <> · {account.name}</> : null}
            {category ? <> · {category.name}</> : null}
          </div>
        </button>
        <div className="flex items-center gap-2">
          <span
            className={[
              "shrink-0 text-sm font-semibold tabular-nums",
              scheduled.amountCents > 0 ? "text-emerald-300" : "text-white",
            ].join(" ")}
          >
            {formatCentsSigned(scheduled.amountCents, currency)}
          </span>
          {isDue ? (
            <Button
              variant="secondary"
              loading={posting}
              onClick={async () => {
                setPosting(true);
                try {
                  await onPost();
                } finally {
                  setPosting(false);
                }
              }}
            >
              Post
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

interface ScheduledFormProps {
  existing?: ScheduledTransactionDoc;
  onDone: () => void;
}

function ScheduledForm({ existing, onDone }: ScheduledFormProps) {
  const { user, household } = useSession();
  const accounts = useAccounts();
  const groups = useCategoryGroups();
  const categories = useCategories();

  const [accountId, setAccountId] = useState(
    existing?.accountId ?? accounts.data.find((a) => !a.closed)?.id ?? "",
  );
  const [direction, setDirection] = useState<"outflow" | "inflow">(
    existing && existing.amountCents > 0 ? "inflow" : "outflow",
  );
  const [amountInput, setAmountInput] = useState(
    existing ? Math.abs(existing.amountCents / 100).toFixed(2) : "",
  );
  const [nextDate, setNextDate] = useState(existing?.nextDate ?? todayISO());
  const [frequency, setFrequency] = useState<ScheduleFrequency>(
    existing?.frequency ?? "monthly",
  );
  const [payeeName, setPayeeName] = useState(existing?.payeeName ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(
    existing?.categoryId ?? null,
  );
  const [memo, setMemo] = useState(existing?.memo ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const magnitude = parseCents(amountInput);
    if (!magnitude || magnitude <= 0) {
      setError("Enter an amount.");
      return;
    }
    if (!accountId) {
      setError("Pick an account.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const signed = direction === "outflow" ? -magnitude : magnitude;
    const effectiveCategory = direction === "inflow" ? null : categoryId;
    try {
      if (existing) {
        await updateScheduledTransaction(household.id, existing.id, {
          accountId,
          amountCents: signed,
          categoryId: effectiveCategory,
          payeeName: payeeName.trim() || null,
          memo: memo.trim() || null,
          nextDate,
          frequency,
        });
      } else {
        await createScheduledTransaction({
          householdId: household.id,
          createdByUid: user.uid,
          accountId,
          amountCents: signed,
          categoryId: effectiveCategory,
          payeeName,
          memo,
          nextDate,
          frequency,
        });
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!existing) return;
    setDeleting(true);
    try {
      await deleteScheduledTransaction(household.id, existing.id);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete.");
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
  const openAccounts = accounts.data.filter((a) => !a.closed);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <Seg active={direction === "outflow"} onClick={() => setDirection("outflow")}>
          Outflow
        </Seg>
        <Seg active={direction === "inflow"} onClick={() => setDirection("inflow")}>
          Inflow
        </Seg>
      </div>

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

      <Input
        label="Amount"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        placeholder="0.00"
        inputMode="decimal"
      />

      <Input
        label="Next occurrence"
        type="date"
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white/70">Repeats</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
          className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Payee"
        value={payeeName}
        onChange={(e) => setPayeeName(e.target.value)}
        placeholder={direction === "inflow" ? "e.g. Acme Payroll" : "e.g. Rent"}
      />

      {direction === "outflow" ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-white/70">Category</label>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
          >
            <option value="">— uncategorized —</option>
            {groupedCats.map((g) =>
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
      ) : (
        <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
          Inflow goes to <strong>Ready to Assign</strong> when posted.
        </div>
      )}

      <Input
        label="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Optional"
      />

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={submitting || deleting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} fullWidth>
          {existing ? "Save changes" : "Create schedule"}
        </Button>
      </div>

      {existing ? (
        <div className="border-t border-white/5 pt-4">
          {confirmingDelete ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/60">Delete this scheduled transaction?</p>
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
              disabled={submitting}
              className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
            >
              Delete schedule
            </Button>
          )}
        </div>
      ) : null}

    </form>
  );
}

function Seg({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-[44px] rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-inset transition-colors",
        active
          ? "bg-brand-500/15 text-white ring-brand-500/60"
          : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
