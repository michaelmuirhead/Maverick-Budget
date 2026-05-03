import { useMemo, useState } from "react";
import { useSession } from "@/lib/session";
import {
  useAccounts,
  useAllCategoryMonths,
  useAllTransactions,
  useCategories,
  useCategoryGroups,
} from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import {
  computeCategoryActivity,
  computeCategoryAvailable,
  computeReadyToAssign,
  setAssignment,
} from "@/lib/budget";
import { addMonths, currentMonth, formatMonth, monthOf } from "@/lib/dates";
import { formatCents, parseCents } from "@/lib/money";
import { createCategory, createCategoryGroup } from "@/lib/categories";
import { Input } from "@/components/ui/Input";
import type {
  CategoryDoc,
  CategoryGroupDoc,
  CategoryMonthDoc,
  Cents,
  MonthString,
  TransactionDoc,
} from "@/types/schema";

export function BudgetScreen() {
  const { household } = useSession();
  const accounts = useAccounts();
  const transactions = useAllTransactions();
  const groups = useCategoryGroups();
  const categories = useCategories();

  const [month, setMonth] = useState<MonthString>(currentMonth());
  const allCategoryMonths = useAllCategoryMonths();

  const onBudgetIds = useMemo(
    () => new Set(accounts.data.filter((a) => a.onBudget).map((a) => a.id)),
    [accounts.data],
  );

  // Just this month's assignments — used to display Assigned/Activity per row.
  const thisMonthAssignments = useMemo(
    () => allCategoryMonths.data.filter((a) => a.month === month),
    [allCategoryMonths.data, month],
  );

  const ready = useMemo(
    () =>
      computeReadyToAssign(accounts.data, transactions.data, allCategoryMonths.data),
    [accounts.data, transactions.data, allCategoryMonths.data],
  );

  const categoriesByGroup = useMemo(() => {
    const m = new Map<string, CategoryDoc[]>();
    for (const c of categories.data) {
      if (c.hidden) continue;
      const list = m.get(c.groupId) ?? [];
      list.push(c);
      m.set(c.groupId, list);
    }
    return m;
  }, [categories.data]);

  const [editing, setEditing] = useState<CategoryDoc | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [creatingCategoryInGroup, setCreatingCategoryInGroup] =
    useState<CategoryGroupDoc | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 pt-12 pb-4">
      <header className="safe-top flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <p className="mt-1 text-sm text-white/60">{household.name}</p>
        </div>
      </header>

      <MonthSwitcher month={month} onChange={setMonth} />

      <ReadyToAssignCard cents={ready} currency={household.currency} />

      {groups.data.length === 0 ? (
        <EmptyCategories onAddGroup={() => setCreatingGroup(true)} />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.data.map((g) => (
            <GroupSection
              key={g.id}
              group={g}
              categories={categoriesByGroup.get(g.id) ?? []}
              transactions={transactions.data}
              monthAssignments={thisMonthAssignments}
              allAssignments={allCategoryMonths.data}
              month={month}
              currency={household.currency}
              onBudgetIds={onBudgetIds}
              onPickCategory={setEditing}
              onAddCategory={() => setCreatingCategoryInGroup(g)}
            />
          ))}
          <button
            type="button"
            onClick={() => setCreatingGroup(true)}
            className="self-start rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10 hover:bg-white/10"
          >
            + Add category group
          </button>
        </div>
      )}

      <Sheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.name ?? ""}
      >
        {editing ? (
          <AssignEditor
            month={month}
            category={editing}
            existing={thisMonthAssignments.find((a) => a.categoryId === editing.id)}
            onDone={() => setEditing(null)}
          />
        ) : null}
      </Sheet>

      <Sheet
        open={creatingGroup}
        onClose={() => setCreatingGroup(false)}
        title="New category group"
      >
        <CreateGroupForm onDone={() => setCreatingGroup(false)} />
      </Sheet>

      <Sheet
        open={creatingCategoryInGroup !== null}
        onClose={() => setCreatingCategoryInGroup(null)}
        title={`New category in ${creatingCategoryInGroup?.name ?? ""}`}
      >
        {creatingCategoryInGroup ? (
          <CreateCategoryForm
            group={creatingCategoryInGroup}
            onDone={() => setCreatingCategoryInGroup(null)}
          />
        ) : null}
      </Sheet>
    </div>
  );
}

// ── Header pieces ───────────────────────────────────────────────────────────

function MonthSwitcher({
  month,
  onChange,
}: {
  month: MonthString;
  onChange: (m: MonthString) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <ArrowButton onClick={() => onChange(addMonths(month, -1))} aria-label="Previous month">
        ‹
      </ArrowButton>
      <div className="text-center">
        <div className="text-xs uppercase tracking-wide text-white/40">Viewing</div>
        <div className="text-base font-semibold">{formatMonth(month)}</div>
      </div>
      <ArrowButton onClick={() => onChange(addMonths(month, 1))} aria-label="Next month">
        ›
      </ArrowButton>
    </div>
  );
}

function ArrowButton({
  onClick,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full bg-white/5 text-xl text-white/70 ring-1 ring-white/10 hover:bg-white/10"
      {...rest}
    >
      {children}
    </button>
  );
}

function ReadyToAssignCard({ cents, currency }: { cents: Cents; currency: string }) {
  const surplus = cents > 0;
  const deficit = cents < 0;
  return (
    <div
      className={[
        "rounded-2xl p-4 ring-1 ring-inset",
        surplus
          ? "bg-emerald-500/10 ring-emerald-500/30"
          : deficit
            ? "bg-red-500/10 ring-red-500/30"
            : "bg-white/5 ring-white/10",
      ].join(" ")}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
        Ready to Assign
      </div>
      <div
        className={[
          "mt-1 text-3xl font-bold tabular-nums",
          surplus ? "text-emerald-300" : deficit ? "text-red-300" : "text-white",
        ].join(" ")}
      >
        {formatCents(cents, currency)}
      </div>
      {deficit ? (
        <p className="mt-1 text-xs text-red-300/80">
          You've assigned more than you have. Reduce an assignment to fix this.
        </p>
      ) : surplus ? (
        <p className="mt-1 text-xs text-white/50">
          Tap a category below to give these dollars a job.
        </p>
      ) : (
        <p className="mt-1 text-xs text-white/50">Every dollar is assigned.</p>
      )}
    </div>
  );
}

// ── Group + category rows ───────────────────────────────────────────────────

function GroupSection({
  group,
  categories,
  transactions,
  monthAssignments,
  allAssignments,
  month,
  currency,
  onBudgetIds,
  onPickCategory,
  onAddCategory,
}: {
  group: CategoryGroupDoc;
  categories: CategoryDoc[];
  transactions: TransactionDoc[];
  monthAssignments: CategoryMonthDoc[];
  allAssignments: CategoryMonthDoc[];
  month: MonthString;
  currency: string;
  onBudgetIds: Set<string>;
  onPickCategory: (c: CategoryDoc) => void;
  onAddCategory: () => void;
}) {
  // Group header total = sum of THIS MONTH assignments across the group's
  // categories. (Available rollover happens per category, not per group.)
  const groupAssigned = categories.reduce((s, c) => {
    const a = monthAssignments.find((x) => x.categoryId === c.id);
    return s + (a?.assignedCents ?? 0);
  }, 0);

  return (
    <section className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {group.name}
        </div>
        <div className="text-xs text-white/40 tabular-nums">
          {formatCents(groupAssigned, currency)}
        </div>
      </header>
      <ul>
        {categories.length === 0 ? (
          <li className="px-4 py-3 text-xs text-white/40">No categories yet.</li>
        ) : (
          categories.map((c, i) => {
            const a = monthAssignments.find((x) => x.categoryId === c.id);
            const assigned = a?.assignedCents ?? 0;
            const activity = computeCategoryActivity(
              c.id,
              month,
              transactions,
              onBudgetIds,
            );
            // Rollover-aware: walks every prior month's assigned + activity.
            const available = computeCategoryAvailable(
              c.id,
              month,
              allAssignments,
              transactions,
              onBudgetIds,
            );
            return (
              <li key={c.id} className={i > 0 ? "border-t border-white/5" : undefined}>
                <CategoryRow
                  category={c}
                  assigned={assigned}
                  activity={activity}
                  available={available}
                  currency={currency}
                  onPick={() => onPickCategory(c)}
                />
              </li>
            );
          })
        )}
        <li className="border-t border-white/5">
          <button
            type="button"
            onClick={onAddCategory}
            className="w-full px-4 py-3 text-left text-xs text-white/50 hover:bg-white/[0.03] hover:text-white"
          >
            + Add category
          </button>
        </li>
      </ul>
    </section>
  );
}

function CategoryRow({
  category,
  assigned,
  activity,
  available,
  currency,
  onPick,
}: {
  category: CategoryDoc;
  assigned: Cents;
  activity: Cents;
  available: Cents;
  currency: string;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="grid w-full grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 text-left hover:bg-white/[0.03]"
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{category.name}</div>
        <div className="mt-0.5 text-[11px] text-white/40 tabular-nums">
          Assigned {formatCents(assigned, currency)} · Activity {formatCents(activity, currency)}
        </div>
      </div>
      <div
        className={[
          "rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums",
          available > 0
            ? "bg-emerald-500/15 text-emerald-300"
            : available < 0
              ? "bg-red-500/15 text-red-300"
              : "text-white/50",
        ].join(" ")}
      >
        {formatCents(available, currency)}
      </div>
    </button>
  );
}

// ── Editors ─────────────────────────────────────────────────────────────────

function AssignEditor({
  month,
  category,
  existing,
  onDone,
}: {
  month: MonthString;
  category: CategoryDoc;
  existing: CategoryMonthDoc | undefined;
  onDone: () => void;
}) {
  const { household } = useSession();
  const [input, setInput] = useState(
    existing ? (existing.assignedCents / 100).toFixed(2) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(value: Cents) {
    setError(null);
    setSubmitting(true);
    try {
      await setAssignment({
        householdId: household.id,
        month,
        categoryId: category.id,
        assignedCents: value,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save assignment.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const cents = parseCents(input);
        if (cents === null) {
          setError("Enter a number.");
          return;
        }
        void save(cents);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label={`Assign to ${category.name} for ${formatMonth(month)}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="0.00"
        inputMode="decimal"
        autoFocus
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
          Save
        </Button>
      </div>
    </form>
  );
}

function CreateGroupForm({ onDone }: { onDone: () => void }) {
  const { household } = useSession();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSubmitting(true);
        try {
          await createCategoryGroup({ householdId: household.id, name });
          onDone();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Couldn't create group.");
          setSubmitting(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Bills"
        autoFocus
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
          Create group
        </Button>
      </div>
    </form>
  );
}

function CreateCategoryForm({
  group,
  onDone,
}: {
  group: CategoryGroupDoc;
  onDone: () => void;
}) {
  const { household } = useSession();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSubmitting(true);
        try {
          await createCategory({
            householdId: household.id,
            groupId: group.id,
            name,
          });
          onDone();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Couldn't create category.");
          setSubmitting(false);
        }
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Rent"
        autoFocus
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
          Create category
        </Button>
      </div>
    </form>
  );
}

function EmptyCategories({ onAddGroup }: { onAddGroup: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <div className="text-sm text-white/60">
        Set up your category groups to start budgeting.
      </div>
      <p className="mt-1 text-xs text-white/40">
        Group examples: Bills, Daily Needs, Quality of Life, True Expenses.
      </p>
      <div className="mt-4">
        <Button onClick={onAddGroup}>+ Add your first group</Button>
      </div>
    </div>
  );
}

// Re-export so other files can import the helper directly if needed.
export { monthOf };
