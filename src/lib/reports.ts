import type {
  AccountDoc,
  CategoryDoc,
  Cents,
  DateString,
  MonthString,
  TransactionDoc,
} from "@/types/schema";
import { addMonths, monthOf } from "./dates";

// ─────────────────────────────────────────────────────────────────────────────
// Reports — pure functions over the same data the UI already subscribes to.
// All amounts in cents. All months as MonthString ("YYYY-MM").
// ─────────────────────────────────────────────────────────────────────────────

/** Last day of a YYYY-MM month, as YYYY-MM-DD. */
export function endOfMonth(month: MonthString): DateString {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return `${month}-${String(last).padStart(2, "0")}`;
}

/** Inclusive list of months from `start` to `end`. */
export function monthRange(start: MonthString, end: MonthString): MonthString[] {
  const out: MonthString[] = [];
  let cur = start;
  while (cur <= end) {
    out.push(cur);
    cur = addMonths(cur, 1);
  }
  return out;
}

// ── Net Worth ───────────────────────────────────────────────────────────────

export interface NetWorthPoint {
  month: MonthString;
  totalCents: Cents;
  onBudgetCents: Cents;
  trackingCents: Cents;
}

/** Compute end-of-month total balance across all accounts for each month. */
export function computeNetWorthByMonth(
  accounts: AccountDoc[],
  transactions: TransactionDoc[],
  months: MonthString[],
): NetWorthPoint[] {
  // Sort transactions by date once; a single pass per month suffices.
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  return months.map((m) => {
    const cutoff = endOfMonth(m);
    let onBudget = 0;
    let tracking = 0;
    for (const t of sorted) {
      if (t.date > cutoff) break;
      if (onBudgetIds.has(t.accountId)) onBudget += t.amountCents;
      else tracking += t.amountCents;
    }
    return {
      month: m,
      onBudgetCents: onBudget,
      trackingCents: tracking,
      totalCents: onBudget + tracking,
    };
  });
}

// ── Income vs Expense ───────────────────────────────────────────────────────

export interface IncomeExpensePoint {
  month: MonthString;
  incomeCents: Cents;   // positive
  expenseCents: Cents;  // positive (magnitude of outflows)
  netCents: Cents;
}

/**
 * Per-month inflow vs outflow on on-budget accounts. Transfers are excluded.
 * Income = positive amounts (RTA inflows + categorized refunds).
 * Expense = absolute value of negative amounts (split children counted).
 */
export function computeIncomeExpenseByMonth(
  accounts: AccountDoc[],
  transactions: TransactionDoc[],
  months: MonthString[],
): IncomeExpensePoint[] {
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  const buckets = new Map<MonthString, { income: number; expense: number }>();
  for (const m of months) buckets.set(m, { income: 0, expense: 0 });

  for (const t of transactions) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;
    const m = monthOf(t.date);
    const b = buckets.get(m);
    if (!b) continue;

    // Splits: walk children. For our purposes the parent's amount equals the
    // sum of split amounts, so attribute to children individually.
    if (t.splits && t.splits.length > 0) {
      for (const s of t.splits) {
        if (s.amountCents > 0) b.income += s.amountCents;
        else b.expense += -s.amountCents;
      }
    } else {
      if (t.amountCents > 0) b.income += t.amountCents;
      else b.expense += -t.amountCents;
    }
  }

  return months.map((m) => {
    const b = buckets.get(m)!;
    return {
      month: m,
      incomeCents: b.income,
      expenseCents: b.expense,
      netCents: b.income - b.expense,
    };
  });
}

// ── Spending by Category ────────────────────────────────────────────────────

export interface CategorySpend {
  categoryId: string | null; // null = uncategorized
  categoryName: string;
  groupName: string | null;
  /** Positive = magnitude of outflows. Negative income/refunds are excluded. */
  spentCents: Cents;
}

/**
 * Spent-by-category summary for outflows on on-budget accounts within a date
 * range. Returns rows sorted by descending magnitude.
 */
export function computeSpendingByCategory(
  accounts: AccountDoc[],
  categories: CategoryDoc[],
  transactions: TransactionDoc[],
  startDate: DateString,
  endDate: DateString,
): CategorySpend[] {
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  const catById = new Map(categories.map((c) => [c.id, c]));
  const totals = new Map<string, number>();

  function add(catId: string | null, cents: number) {
    const key = catId ?? "__uncategorized";
    totals.set(key, (totals.get(key) ?? 0) + cents);
  }

  for (const t of transactions) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;
    if (t.date < startDate || t.date > endDate) continue;

    if (t.splits && t.splits.length > 0) {
      for (const s of t.splits) {
        if (s.amountCents < 0) add(s.categoryId, -s.amountCents);
      }
    } else {
      if (t.amountCents < 0) add(t.categoryId, -t.amountCents);
    }
  }

  const rows: CategorySpend[] = [];
  for (const [key, cents] of totals.entries()) {
    if (cents <= 0) continue;
    if (key === "__uncategorized") {
      rows.push({
        categoryId: null,
        categoryName: "Uncategorized",
        groupName: null,
        spentCents: cents,
      });
    } else {
      const c = catById.get(key);
      rows.push({
        categoryId: key,
        categoryName: c?.name ?? "(deleted category)",
        groupName: null,
        spentCents: cents,
      });
    }
  }
  rows.sort((a, b) => b.spentCents - a.spentCents);
  return rows;
}

// ── Age of Money ────────────────────────────────────────────────────────────

export interface AgeOfMoneyPoint {
  date: DateString;
  /** Weighted-average age in days of dollars spent ON or BEFORE this date,
   *  considering the last `windowOutflows` outflow events. */
  averageAgeDays: number;
}

/**
 * FIFO-match outflows to prior inflows on on-budget accounts. Each outflow's
 * "average age in days" is the dollar-weighted age of the inflow dollars it
 * consumed. Then we report a rolling average over the last `windowOutflows`
 * outflows for each date a spend happened.
 *
 * Simplifications:
 *   • Transfers are skipped.
 *   • Splits contribute as separate outflow events at the transaction date.
 *   • Refunds (positive categorized) are treated as inflows that go into the
 *     income queue, same as RTA inflows.
 */
export function computeAgeOfMoney(
  accounts: AccountDoc[],
  transactions: TransactionDoc[],
  windowOutflows = 10,
): AgeOfMoneyPoint[] {
  const onBudgetIds = new Set(accounts.filter((a) => a.onBudget).map((a) => a.id));
  const events: { date: DateString; cents: number; isOutflow: boolean }[] = [];

  for (const t of transactions) {
    if (!onBudgetIds.has(t.accountId)) continue;
    if (t.transferTransactionId) continue;
    if (t.splits && t.splits.length > 0) {
      for (const s of t.splits) {
        events.push({
          date: t.date,
          cents: Math.abs(s.amountCents),
          isOutflow: s.amountCents < 0,
        });
      }
    } else {
      events.push({
        date: t.date,
        cents: Math.abs(t.amountCents),
        isOutflow: t.amountCents < 0,
      });
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));

  // FIFO queue of inflow dollar lots.
  const queue: { date: DateString; cents: number }[] = [];
  const outflowAges: { date: DateString; ageDays: number }[] = [];

  for (const e of events) {
    if (!e.isOutflow) {
      queue.push({ date: e.date, cents: e.cents });
      continue;
    }
    let remaining = e.cents;
    let weightedAge = 0;
    let consumed = 0;
    while (remaining > 0 && queue.length > 0) {
      const head = queue[0];
      const take = Math.min(head.cents, remaining);
      const age = daysBetween(head.date, e.date);
      weightedAge += age * take;
      consumed += take;
      remaining -= take;
      head.cents -= take;
      if (head.cents === 0) queue.shift();
    }
    if (consumed > 0) {
      outflowAges.push({ date: e.date, ageDays: weightedAge / consumed });
    }
    // If queue runs dry, we silently drop the unmatched portion. (You spent
    // money you hadn't received yet — credit, etc.) The chart will reflect it
    // by simply not including those dollars in the age calc.
  }

  // Rolling weighted average across the last N outflows.
  const out: AgeOfMoneyPoint[] = [];
  for (let i = 0; i < outflowAges.length; i++) {
    const lo = Math.max(0, i - windowOutflows + 1);
    const slice = outflowAges.slice(lo, i + 1);
    const avg = slice.reduce((s, x) => s + x.ageDays, 0) / slice.length;
    out.push({ date: outflowAges[i].date, averageAgeDays: avg });
  }
  return out;
}

function daysBetween(a: DateString, b: DateString): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86_400_000);
}
