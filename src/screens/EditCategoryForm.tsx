import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import {
  CategoryInUseError,
  deleteCategory,
  updateCategory,
} from "@/lib/categories";
import { parseCents } from "@/lib/money";
import { ToggleRow } from "./EditGroupForm";
import type { CategoryDoc, CategoryGoal, GoalType } from "@/types/schema";

interface Props {
  category: CategoryDoc;
  onDone: () => void;
}

type GoalKind = "none" | GoalType;

export function EditCategoryForm({ category, onDone }: Props) {
  const { household } = useSession();
  const [name, setName] = useState(category.name);
  const [hidden, setHidden] = useState(category.hidden);
  const [note, setNote] = useState(category.note ?? "");

  // Goal state, derived from existing category.goal.
  const [goalKind, setGoalKind] = useState<GoalKind>(category.goal?.type ?? "none");
  const [goalAmountInput, setGoalAmountInput] = useState(
    category.goal ? (category.goal.targetCents / 100).toFixed(2) : "",
  );
  const [goalDate, setGoalDate] = useState(category.goal?.targetDate ?? "");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category needs a name.");
      return;
    }
    // Build the goal payload.
    let goal: CategoryGoal | null = null;
    if (goalKind !== "none") {
      const cents = parseCents(goalAmountInput);
      if (cents === null || cents <= 0) {
        setError("Goal needs a positive amount.");
        return;
      }
      if (goalKind === "byDate" && !goalDate) {
        setError("Pick a target date.");
        return;
      }
      goal = {
        type: goalKind,
        targetCents: cents,
        targetDate: goalKind === "byDate" ? goalDate : undefined,
      };
    }
    setError(null);
    setSaving(true);
    try {
      await updateCategory(household.id, category.id, {
        name,
        hidden,
        note: note.trim() || null,
        goal,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save category.");
      setSaving(false);
    }
  }

  async function onDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteCategory(household.id, category.id);
      onDone();
    } catch (err) {
      if (err instanceof CategoryInUseError) setError(err.message);
      else setError(err instanceof Error ? err.message : "Couldn't delete category.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  const busy = saving || deleting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <Input
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional"
      />
      <ToggleRow
        label="Hide from budget"
        description="History is preserved; the row just stops showing."
        checked={hidden}
        onChange={setHidden}
      />

      <GoalEditor
        kind={goalKind}
        onKind={setGoalKind}
        amountInput={goalAmountInput}
        onAmountInput={setGoalAmountInput}
        date={goalDate}
        onDate={setGoalDate}
      />
      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} fullWidth>
          Save
        </Button>
      </div>
      <div className="border-t border-white/5 pt-4" />
      <div>
        {confirmingDelete ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-white/60">
              Delete this category? Only works if no transactions reference it.
              Otherwise, hide it instead.
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
                Delete category
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
            Delete category
          </Button>
        )}
      </div>
    </form>
  );
}

const GOAL_OPTIONS: { value: GoalKind; label: string; help: string }[] = [
  { value: "none", label: "No goal", help: "" },
  {
    value: "monthlyContribution",
    label: "Monthly funding",
    help: "Set this much aside every month.",
  },
  {
    value: "refillUpTo",
    label: "Refill up to",
    help: "Top up Available to this amount each month.",
  },
  {
    value: "byDate",
    label: "Save by date",
    help: "Have this amount saved by a target date.",
  },
  {
    value: "spendingTarget",
    label: "Spending cap",
    help: "Spend at most this amount each month.",
  },
];

function GoalEditor({
  kind,
  onKind,
  amountInput,
  onAmountInput,
  date,
  onDate,
}: {
  kind: GoalKind;
  onKind: (v: GoalKind) => void;
  amountInput: string;
  onAmountInput: (v: string) => void;
  date: string;
  onDate: (v: string) => void;
}) {
  const selected = GOAL_OPTIONS.find((o) => o.value === kind);
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">Goal</h3>
      <div className="grid grid-cols-2 gap-2">
        {GOAL_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onKind(o.value)}
            className={[
              "min-h-[44px] rounded-xl px-3 py-2 text-left text-sm ring-1 ring-inset transition-colors",
              "flex flex-col justify-center",
              kind === o.value
                ? "bg-brand-500/15 text-white ring-brand-500/60"
                : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            <span>{o.label}</span>
            {o.help ? (
              <span className="text-[10px] text-white/40">{o.help}</span>
            ) : null}
          </button>
        ))}
      </div>
      {kind !== "none" && selected ? (
        <div className="flex flex-col gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
          <Input
            label="Amount"
            value={amountInput}
            onChange={(e) => onAmountInput(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
          />
          {kind === "byDate" ? (
            <Input
              label="Target date"
              type="date"
              value={date}
              onChange={(e) => onDate(e.target.value)}
            />
          ) : null}
          <p className="text-[11px] text-white/40">{selected.help}</p>
        </div>
      ) : null}
    </section>
  );
}
