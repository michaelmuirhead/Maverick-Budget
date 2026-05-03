import { useMemo, useState } from "react";
import { useSession } from "@/lib/session";
import {
  useAccounts,
  useAllTransactions,
  useCategories,
} from "@/hooks/useHouseholdData";
import { addMonths, currentMonth, formatMonth, todayISO } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import {
  computeAgeOfMoney,
  computeIncomeExpenseByMonth,
  computeNetWorthByMonth,
  computeSpendingByCategory,
  monthRange,
} from "@/lib/reports";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DateString, MonthString } from "@/types/schema";

type TabId = "netWorth" | "incomeExpense" | "spending" | "ageOfMoney";
type RangePreset = "6m" | "12m" | "ytd" | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "netWorth", label: "Net Worth" },
  { id: "incomeExpense", label: "Income / Expense" },
  { id: "spending", label: "Spending" },
  { id: "ageOfMoney", label: "Age of Money" },
];

const RANGES: { id: RangePreset; label: string }[] = [
  { id: "6m", label: "6 mo" },
  { id: "12m", label: "12 mo" },
  { id: "ytd", label: "YTD" },
  { id: "all", label: "All" },
];

export function ReportsScreen() {
  const { household } = useSession();
  const accounts = useAccounts();
  const transactions = useAllTransactions();
  const categories = useCategories();

  const [tab, setTab] = useState<TabId>("netWorth");
  const [range, setRange] = useState<RangePreset>("12m");

  // Earliest transaction date sets the "all time" lower bound.
  const earliestMonth = useMemo<MonthString>(() => {
    if (transactions.data.length === 0) return currentMonth();
    let min = transactions.data[0].date;
    for (const t of transactions.data) {
      if (t.date < min) min = t.date;
    }
    return min.slice(0, 7) as MonthString;
  }, [transactions.data]);

  const { startMonth, startDate, endDate } = useMemo(() => {
    const cur = currentMonth();
    let start: MonthString;
    switch (range) {
      case "6m":
        start = addMonths(cur, -5);
        break;
      case "12m":
        start = addMonths(cur, -11);
        break;
      case "ytd":
        start = `${new Date().getFullYear()}-01`;
        break;
      case "all":
        start = earliestMonth;
        break;
    }
    return {
      startMonth: start,
      startDate: `${start}-01` as DateString,
      endDate: todayISO(),
    };
  }, [range, earliestMonth]);

  const months = useMemo(
    () => monthRange(startMonth, currentMonth()),
    [startMonth],
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-12">
      <header className="safe-top">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-white/60">{household.name}</p>
      </header>

      {/* Tab pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors",
              tab === t.id
                ? "bg-brand-500/15 text-white ring-brand-500/60"
                : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Date-range picker */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/50">
          {formatMonth(startMonth)} – present
        </div>
        <div className="flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                range === r.id ? "bg-brand-500 text-white" : "text-white/60 hover:text-white",
              ].join(" ")}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {transactions.data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
          Log some transactions to populate the reports.
        </div>
      ) : (
        <>
          {tab === "netWorth" && (
            <NetWorthChart
              accounts={accounts.data}
              transactions={transactions.data}
              months={months}
              currency={household.currency}
            />
          )}
          {tab === "incomeExpense" && (
            <IncomeExpenseChart
              accounts={accounts.data}
              transactions={transactions.data}
              months={months}
              currency={household.currency}
            />
          )}
          {tab === "spending" && (
            <SpendingChart
              accounts={accounts.data}
              categories={categories.data}
              transactions={transactions.data}
              startDate={startDate}
              endDate={endDate}
              currency={household.currency}
            />
          )}
          {tab === "ageOfMoney" && (
            <AgeOfMoneyChart
              accounts={accounts.data}
              transactions={transactions.data}
            />
          )}
        </>
      )}
    </div>
  );
}

// ── Charts ──────────────────────────────────────────────────────────────────

const BRAND = "#8a8eff";
const SUCCESS = "#34d399";
const DANGER = "#fb7185";
const WARN = "#f59e0b";
const SLATE = "rgba(255,255,255,0.45)";
const GRID = "rgba(255,255,255,0.08)";

function CardWrap({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <header className="mb-2 px-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle ? <p className="text-xs text-white/50">{subtitle}</p> : null}
      </header>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}

function shortMonthLabel(m: MonthString): string {
  const [y, mm] = m.split("-").map(Number);
  return new Date(y, mm - 1, 1).toLocaleString(undefined, { month: "short" });
}

function formatTickCents(currency: string) {
  const f = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    notation: "compact",
  });
  return (cents: number) => f.format(cents / 100);
}

function NetWorthChart({
  accounts,
  transactions,
  months,
  currency,
}: {
  accounts: ReturnType<typeof useAccounts>["data"];
  transactions: ReturnType<typeof useAllTransactions>["data"];
  months: MonthString[];
  currency: string;
}) {
  const data = useMemo(
    () =>
      computeNetWorthByMonth(accounts, transactions, months).map((p) => ({
        ...p,
        label: shortMonthLabel(p.month),
      })),
    [accounts, transactions, months],
  );
  const last = data[data.length - 1];
  return (
    <CardWrap
      title="Net Worth"
      subtitle={
        last ? `Now: ${formatCents(last.totalCents, currency)}` : undefined
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" stroke={SLATE} fontSize={11} />
          <YAxis
            stroke={SLATE}
            fontSize={11}
            tickFormatter={formatTickCents(currency)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={((v: unknown) => formatCents(Number(v), currency)) as never}
          />
          <Line
            type="monotone"
            dataKey="totalCents"
            stroke={BRAND}
            strokeWidth={2}
            dot={false}
            name="Total"
          />
          <Line
            type="monotone"
            dataKey="onBudgetCents"
            stroke={SUCCESS}
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
            name="On budget"
          />
          <Line
            type="monotone"
            dataKey="trackingCents"
            stroke={WARN}
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
            name="Tracking"
          />
          <Legend wrapperStyle={legendStyle} iconSize={8} />
        </LineChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

function IncomeExpenseChart({
  accounts,
  transactions,
  months,
  currency,
}: {
  accounts: ReturnType<typeof useAccounts>["data"];
  transactions: ReturnType<typeof useAllTransactions>["data"];
  months: MonthString[];
  currency: string;
}) {
  const data = useMemo(
    () =>
      computeIncomeExpenseByMonth(accounts, transactions, months).map((p) => ({
        ...p,
        label: shortMonthLabel(p.month),
      })),
    [accounts, transactions, months],
  );
  const totalIncome = data.reduce((s, d) => s + d.incomeCents, 0);
  const totalExpense = data.reduce((s, d) => s + d.expenseCents, 0);
  const net = totalIncome - totalExpense;

  return (
    <CardWrap
      title="Income vs Expense"
      subtitle={`Net ${formatCents(net, currency)} · ${formatCents(totalIncome, currency)} in / ${formatCents(totalExpense, currency)} out`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" stroke={SLATE} fontSize={11} />
          <YAxis stroke={SLATE} fontSize={11} tickFormatter={formatTickCents(currency)} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={((v: unknown) => formatCents(Number(v), currency)) as never}
          />
          <Bar dataKey="incomeCents" fill={SUCCESS} name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenseCents" fill={DANGER} name="Expense" radius={[4, 4, 0, 0]} />
          <Legend wrapperStyle={legendStyle} iconSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

function SpendingChart({
  accounts,
  categories,
  transactions,
  startDate,
  endDate,
  currency,
}: {
  accounts: ReturnType<typeof useAccounts>["data"];
  categories: ReturnType<typeof useCategories>["data"];
  transactions: ReturnType<typeof useAllTransactions>["data"];
  startDate: DateString;
  endDate: DateString;
  currency: string;
}) {
  const rows = useMemo(
    () => computeSpendingByCategory(accounts, categories, transactions, startDate, endDate),
    [accounts, categories, transactions, startDate, endDate],
  );
  const total = rows.reduce((s, r) => s + r.spentCents, 0);
  // Show top 8, group the rest into "Other".
  const top = rows.slice(0, 8);
  const other = rows.slice(8).reduce((s, r) => s + r.spentCents, 0);
  const data = [
    ...top.map((r) => ({ name: r.categoryName, spentCents: r.spentCents })),
    ...(other > 0 ? [{ name: "Other", spentCents: other }] : []),
  ];
  const palette = [
    BRAND,
    SUCCESS,
    DANGER,
    WARN,
    "#22d3ee",
    "#a78bfa",
    "#f472b6",
    "#facc15",
    "#94a3b8",
  ];

  if (rows.length === 0) {
    return (
      <CardWrap title="Spending by Category">
        <div className="flex h-full items-center justify-center text-sm text-white/50">
          No outflows in this range.
        </div>
      </CardWrap>
    );
  }

  return (
    <CardWrap
      title="Spending by Category"
      subtitle={`${formatCents(total, currency)} total in range`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 12, bottom: 0, left: 16 }}
        >
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis
            type="number"
            stroke={SLATE}
            fontSize={11}
            tickFormatter={formatTickCents(currency)}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={SLATE}
            fontSize={11}
            width={110}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={((v: unknown) => formatCents(Number(v), currency)) as never}
          />
          <Bar dataKey="spentCents" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

function AgeOfMoneyChart({
  accounts,
  transactions,
}: {
  accounts: ReturnType<typeof useAccounts>["data"];
  transactions: ReturnType<typeof useAllTransactions>["data"];
}) {
  const data = useMemo(
    () =>
      computeAgeOfMoney(accounts, transactions).map((p) => ({
        ...p,
        label: p.date.slice(5), // MM-DD
        averageAgeDays: Math.round(p.averageAgeDays * 10) / 10,
      })),
    [accounts, transactions],
  );
  const last = data[data.length - 1];

  if (data.length === 0) {
    return (
      <CardWrap title="Age of Money">
        <div className="flex h-full items-center justify-center text-sm text-white/50">
          No outflows yet — add some spending to see how long money sits before
          you spend it.
        </div>
      </CardWrap>
    );
  }

  return (
    <CardWrap
      title="Age of Money"
      subtitle={
        last ? `Today: ${last.averageAgeDays.toFixed(1)} days` : undefined
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" stroke={SLATE} fontSize={11} />
          <YAxis
            stroke={SLATE}
            fontSize={11}
            tickFormatter={(v: number) => `${v}d`}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={((v: unknown) => `${v} days`) as never}
          />
          <Line
            type="monotone"
            dataKey="averageAgeDays"
            stroke={BRAND}
            strokeWidth={2}
            dot={false}
            name="Avg age"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "rgba(10, 10, 26, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
};
const legendStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.6)",
};
