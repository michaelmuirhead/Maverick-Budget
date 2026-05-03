import { useState, type FormEvent } from "react";
import { useSession } from "@/lib/session";
import { useCategories, useCategoryGroups } from "@/hooks/useHouseholdData";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createTransaction } from "@/lib/transactions";
import { parseCents } from "@/lib/money";
import { todayISO } from "@/lib/dates";

interface Props {
  accountId: string;
  accountName: string;
  onDone: () => void;
}

type Direction = "outflow" | "inflow";

export function CreateTransactionForm({ accountId, accountName, onDone }: Props) {
  const { user, household } = useSession();
  const groups = useCategoryGroups();
  const categories = useCategories();

  const [direction, setDirection] = useState<Direction>("outflow");
  const [amountInput, setAmountInput] = useState("");
  const [date, setDate] = useState(todayISO());
  const [payeeName, setPayeeName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      await createTransaction({
        householdId: household.id,
        createdByUid: user.uid,
        accountId,
        date,
        amountCents: direction === "outflow" ? -magnitude : magnitude,
        // Inflows default to uncategorized → feeds Ready to Assign.
        categoryId: direction === "inflow" ? null : categoryId,
        payeeName,
        memo,
        status: "uncleared",
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save transaction.");
      setSubmitting(false);
    }
  }

  // Group categories by group name for the picker.
  const groupedCats = groups.data.map((g) => ({
    group: g,
    cats: categories.data.filter((c) => c.groupId === g.id && !c.hidden),
  }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <SegmentedButton
          active={direction === "outflow"}
          onClick={() => setDirection("outflow")}
        >
          Outflow
        </SegmentedButton>
        <SegmentedButton
          active={direction === "inflow"}
          onClick={() => setDirection("inflow")}
        >
          Inflow
        </SegmentedButton>
      </div>

      <Input
        label="Amount"
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        placeholder="0.00"
        inputMode="decimal"
        autoFocus
      />

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        label="Payee"
        value={payeeName}
        onChange={(e) => setPayeeName(e.target.value)}
        placeholder={direction === "inflow" ? "e.g. Acme Payroll" : "e.g. Trader Joe's"}
      />

      {direction === "outflow" ? (
        <CategoryPicker
          categoryId={categoryId}
          onChange={setCategoryId}
          grouped={groupedCats}
        />
      ) : (
        <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
          Inflow goes to <strong>Ready to Assign</strong> on the Budget tab.
        </div>
      )}

      <Input
        label="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Optional"
      />

      <div className="text-xs text-white/40">
        Account: <span className="text-white/70">{accountName}</span>
      </div>

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
          Save transaction
        </Button>
      </div>
    </form>
  );
}

function SegmentedButton({
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
