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
import { DragHandle, Sortable } from "@/components/ui/Sortable";
import {
  reorderCategories,
  reorderCategoryGroups,
} from "@/lib/categories";
import {
  computeCategoryActivity,
  computeCategoryAvailable,
  computeGoalStatus,
  computeReadyToAssign,
  moveBetweenCategories,
  setAssignment,
  type GoalStatus,
} from "@/lib/budget";
import { addMonths, currentMonth, formatMonth, monthOf } from "@/lib/dates";
import { formatCents, parseCents } from "@/lib/money";
import { createCategory, createCategoryGroup } from "@/lib/categories";
// (reorder helpers imported above)
import { Input } from "@/components/ui/Input";
import { EditGroupForm } from "./EditGroupForm";
import { EditCategoryForm } from "./EditCategoryForm";
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
  const [editingCategory, setEditingCategory] = useState<CategoryDoc | null>(null);
  const [editingGroup, setEditingGroup] = useState<CategoryGroupDoc | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [creatingCategoryInGroup, setCreatingCategoryInGroup] =
    useState<CategoryGroupDoc | null>(null);

  const visibleGroups = useMemo(
    () => groups.data.filter((g) => !g.hidden),
    [groups.data],
  );

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

      {visibleGroups.length === 0 ? (
        <EmptyCategories onAddGroup={() => setCreatingGroup(true)} />
      ) : (
        <div className="flex flex-col gap-4">
          <Sortable
            items={visibleGroups}
            onReorder={(ids) => reorderCategoryGroups(household.id, ids)}
          >
            {(g, h) => (
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
                onEditCategory={setEditingCategory}
                onEditGroup={setEditingGroup}
                onAddCategory={() => setCreatingCategoryInGroup(g)}
                sortableRef={h.ref}
                sortableStyle={h.style}
                groupDragHandleProps={h.dragHandleProps}
              />
            )}
          </Sortable>
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
            allMonthAssignments={thisMonthAssignments}
            allCategories={categories.data.filter((c) => !c.hidden)}
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

      <Sheet
        open={editingGroup !== null}
        onClose={() => setEditingGroup(null)}
        title={`Edit ${editingGroup?.name ?? ""}`}
      >
        {editingGroup ? (
          <EditGroupForm
            group={editingGroup}
            onDone={() => setEditingGroup(null)}
          />
        ) : null}
      </Sheet>

      <Sheet
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title={`Edit ${editingCategory?.name ?? ""}`}
      >
        {editingCategory ? (
          <EditCategoryForm
            category={editingCategory}
            onDone={() => setEditingCategory(null)}
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
  onEditCategory,
  onEditGroup,
  onAddCategory,
  sortableRef,
  sortableStyle,
  groupDragHandleProps,
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
  onEditCategory: (c: CategoryDoc) => void;
  onEditGroup: (g: CategoryGroupDoc) => void;
  onAddCategory: () => void;
  sortableRef?: (n: HTMLElement | null) => void;
  sortableStyle?: React.CSSProperties;
  groupDragHandleProps?: React.HTMLAttributes<HTMLElement>;
}) {
  const { household } = useSession();
  // Group header total = sum of THIS MONTH assignments across the group's
  // categories. (Available rollover happens per category, not per group.)
  const groupAssigned = categories.reduce((s, c) => {
    const a = monthAssignments.find((x) => x.categoryId === c.id);
    return s + (a?.assignedCents ?? 0);
  }, 0);

  return (
    <section
      ref={sortableRef}
      style={sortableStyle}
      className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
    >
      <header className="flex items-center justify-between gap-2 border-b border-white/5 px-2 py-2">
        <DragHandle
          {...(groupDragHandleProps as React.HTMLAttributes<HTMLButtonElement>)}
          label={`Reorder ${group.name}`}
        />
        <button
          type="button"
          onClick={() => onEditGroup(group)}
          className="flex flex-1 items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide text-white/60 hover:text-white"
        >
          <span>{group.name}</span>
          <span className="text-white/30 text-[10px]">⋯</span>
        </button>
        <div className="pr-2 text-xs text-white/40 tabular-nums">
          {formatCents(groupAssigned, currency)}
        </div>
      </header>
      <ul>
        {categories.length === 0 ? (
          <li className="px-4 py-3 text-xs text-white/40">No categories yet.</li>
        ) : (
          <Sortable
            items={categories}
            onReorder={(ids) => reorderCategories(household.id, ids)}
          >
            {(c, h) => {
              const a = monthAssignments.find((x) => x.categoryId === c.id);
              const assigned = a?.assignedCents ?? 0;
              const activity = computeCategoryActivity(
                c.id,
                month,
                transactions,
                onBudgetIds,
              );
              const available = computeCategoryAvailable(
                c.id,
                month,
                allAssignments,
                transactions,
                onBudgetIds,
              );
              const goalStatus = computeGoalStatus(
                c,
                month,
                assigned,
                allAssignments,
                transactions,
                onBudgetIds,
              );
              return (
                <li
                  ref={h.ref as (n: HTMLLIElement | null) => void}
                  style={h.style}
                  className="border-t border-white/5 first:border-t-0 bg-white/[0.02]"
                >
                  <CategoryRow
                    category={c}
                    assigned={assigned}
                    activity={activity}
                    available={available}
                    goalStatus={goalStatus}
                    currency={currency}
                    onPick={() => onPickCategory(c)}
                    onEdit={() => onEditCategory(c)}
                    dragHandleProps={h.dragHandleProps}
                  />
                </li>
              );
            }}
          </Sortable>
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
  goalStatus,
  currency,
  onPick,
  onEdit,
  dragHandleProps,
}: {
  category: CategoryDoc;
  assigned: Cents;
  activity: Cents;
  available: Cents;
  goalStatus: GoalStatus;
  currency: string;
  onPick: () => void;
  onEdit: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-2 py-3">
      <DragHandle
        {...(dragHandleProps as React.HTMLAttributes<HTMLButtonElement>)}
        label={`Reorder ${category.name}`}
      />
      <button
        type="button"
        onClick={onPick}
        className="min-w-0 text-left hover:opacity-80"
      >
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{category.name}</span>
          <GoalBadge status={goalStatus} currency={currency} />
        </div>
        <div className="mt-0.5 text-[11px] text-white/40 tabular-nums">
          Assigned {formatCents(assigned, currency)} · Activity {formatCents(activity, currency)}
        </div>
      </button>
      <button
        type="button"
        onClick={onPick}
        className={[
          "rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums hover:opacity-80",
          available > 0
            ? "bg-emerald-500/15 text-emerald-300"
            : available < 0
              ? "bg-red-500/15 text-red-300"
              : "text-white/50",
        ].join(" ")}
      >
        {formatCents(available, currency)}
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${category.name}`}
        className="rounded-full p-1 text-white/30 hover:bg-white/10 hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>
    </div>
  );
}

// ── Editors ─────────────────────────────────────────────────────────────────

type AssignMode = "assign" | "moveIn";

function AssignEditor({
  month,
  category,
  existing,
  allMonthAssignments,
  allCategories,
  onDone,
}: {
  month: MonthString;
  category: CategoryDoc;
  existing: CategoryMonthDoc | undefined;
  allMonthAssignments: CategoryMonthDoc[];
  allCategories: CategoryDoc[];
  onDone: () => void;
}) {
  const { household } = useSession();
  const [mode, setMode] = useState<AssignMode>("assign");

  const [input, setInput] = useState(
    existing ? (existing.assignedCents / 100).toFixed(2) : "",
  );
  const [moveAmountInput, setMoveAmountInput] = useState("");
  const [sourceCategoryId, setSourceCategoryId] = useState<string>(() => {
    const others = allCategories.filter((c) => c.id !== category.id);
    return others[0]?.id ?? "";
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveAssign(value: Cents) {
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

  async function saveMove() {
    const cents = parseCents(moveAmountInput);
    if (cents === null || cents <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    if (!sourceCategoryId) {
      setError("Pick a source category.");
      return;
    }
    const fromCurrent =
      allMonthAssignments.find((a) => a.categoryId === sourceCategoryId)?.assignedCents ?? 0;
    const toCurrent = existing?.assignedCents ?? 0;
    setError(null);
    setSubmitting(true);
    try {
      await moveBetweenCategories({
        householdId: household.id,
        month,
        fromCategoryId: sourceCategoryId,
        fromCurrentCents: fromCurrent,
        toCategoryId: category.id,
        toCurrentCents: toCurrent,
        cents,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't move money.");
      setSubmitting(false);
    }
  }

  const otherCats = allCategories.filter((c) => c.id !== category.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <ModeButton active={mode === "assign"} onClick={() => setMode("assign")}>
          Assign
        </ModeButton>
        <ModeButton
          active={mode === "moveIn"}
          onClick={() => setMode("moveIn")}
          disabled={otherCats.length === 0}
        >
          Move money in
        </ModeButton>
      </div>

      {mode === "assign" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const cents = parseCents(input);
            if (cents === null) {
              setError("Enter a number.");
              return;
            }
            void saveAssign(cents);
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
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveMove();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-white/70">Move from</label>
            <select
              value={sourceCategoryId}
              onChange={(e) => setSourceCategoryId(e.target.value)}
              className="min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
            >
              {otherCats.map((c) => {
                const a = allMonthAssignments.find((x) => x.categoryId === c.id);
                const cur = a?.assignedCents ?? 0;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} (assigned {(cur / 100).toFixed(2)})
                  </option>
                );
              })}
            </select>
          </div>
          <Input
            label={`Move to ${category.name}`}
            value={moveAmountInput}
            onChange={(e) => setMoveAmountInput(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            autoFocus
            hint="Both this month's assignments are updated atomically."
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
              Move
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function GoalBadge({ status, currency }: { status: GoalStatus; currency: string }) {
  if (status.kind === "none") return null;
  if (status.kind === "funded") {
    return (
      <span
        className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300"
        title={`Goal of ${formatCents(status.targetCents, currency)} funded`}
      >
        ✓
      </span>
    );
  }
  if (status.kind === "underfunded") {
    return (
      <span
        className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300"
        title={`Goal needs ${formatCents(status.neededCents, currency)} more`}
      >
        Need {formatCents(status.neededCents, currency)}
      </span>
    );
  }
  // overSpent (spendingTarget exceeded)
  return (
    <span
      className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300"
      title={`Spent ${formatCents(status.overByCents, currency)} over the cap`}
    >
      Over {formatCents(status.overByCents, currency)}
    </span>
  );
}

function ModeButton({
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
        "min-h-[40px] rounded-xl px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition-colors",
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
