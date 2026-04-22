"use client";

// Financials dashboard — cash over time + revenue breakdown.
//
// Surfaces the same numbers the dashboard top-row shows (cash, lifetime rev),
// but gives them temporal and categorical context. The cash line reads from
// studio.cashHistory (monthly samples captured at the start of each month in
// the tick dispatcher). The donut derives categories from existing
// per-entity totals so it stays in sync with the books without needing a
// dedicated aggregate.

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { formatMoney, formatNumber } from "@/lib/format";
import { CashHistoryChart } from "@/components/finance/CashHistoryChart";
import { RevenueDonut } from "@/components/finance/RevenueDonut";

export default function FinancePage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const { studio } = state;
  const released = Object.values(state.projects).filter(
    (p) => p.status === "released"
  );
  const activeLiveServices = Object.values(state.liveServices).filter(
    (l) => l.enabled
  );
  const totalMonthlySubs = activeLiveServices.reduce(
    (sum, l) => sum + l.monthlySubscriptionRevenue,
    0
  );

  // Engine licensing income (current MRR-ish trickle)
  const ownedEngineIds = new Set(studio.ownedEngineIds);
  const activeLicensesOut = Object.values(state.engineLicenses).filter(
    (l) => ownedEngineIds.has(l.engineId) && l.active
  );

  // In-flight work-for-hire contracts
  const activeContracts = Object.values(state.contracts).filter(
    (c) => c.status === "active" || c.status === "in_progress"
  );

  // Office monthly burn (rent + upkeep, approx — matches tickOfficeMonthly)
  const officeMonthlyCost = computeOfficeMonthlyCost(state);

  // Payroll approximation — sum of salaries / 12
  const monthlyPayroll = Object.values(state.staff).reduce((sum, s) => {
    if (s.status !== "employed") return sum;
    return sum + s.salary / 12;
  }, 0);

  return (
    <div className="space-y-4">
      <h2
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl"
        style={{
          background: "var(--teal)",
          color: "#fff",
          border: "3px solid var(--ink)",
          boxShadow: "4px 4px 0 var(--ink)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.08em",
        }}
      >
        FINANCE
      </h2>

      {/* Top-line stats */}
      <Panel title="BALANCE SHEET">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat
            label="CASH"
            value={formatMoney(studio.cash)}
            tone={studio.cash < 0 ? "bad" : "default"}
          />
          <Stat
            label="LIFETIME REV"
            value={formatMoney(studio.lifetimeRevenue)}
            sub={`across ${studio.gamesReleased} release${studio.gamesReleased === 1 ? "" : "s"}`}
          />
          <Stat
            label="MONTHLY BURN"
            value={formatMoney(monthlyPayroll + officeMonthlyCost)}
            sub={`${formatMoney(monthlyPayroll)} payroll · ${formatMoney(officeMonthlyCost)} office`}
          />
          <Stat
            label="RECURRING INCOME"
            value={formatMoney(totalMonthlySubs)}
            sub={
              activeLiveServices.length > 0 || activeLicensesOut.length > 0
                ? `${activeLiveServices.length} live · ${activeLicensesOut.length} engine license${activeLicensesOut.length === 1 ? "" : "s"}`
                : "no live services or licenses"
            }
          />
        </div>
      </Panel>

      {/* Cash line chart */}
      <Panel title="CASH OVER TIME">
        <CashHistoryChart
          history={studio.cashHistory}
          currentDate={state.currentDate}
          currentCash={studio.cash}
          currentLifetimeRevenue={studio.lifetimeRevenue}
        />
      </Panel>

      {/* Revenue breakdown */}
      <Panel
        title="REVENUE BY SOURCE"
        headerRight={
          <span className="text-xs text-[color:var(--ink-soft)]">
            lifetime
          </span>
        }
      >
        <RevenueDonut state={state} />
      </Panel>

      {/* Released games table — recent catalog with revenue per title */}
      {released.length > 0 && (
        <Panel title="TOP EARNERS">
          <table className="data-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>RELEASED</th>
                <th>MC</th>
                <th>SALES</th>
                <th>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {released
                .slice()
                .sort(
                  (a, b) => (b.lifetimeRevenue ?? 0) - (a.lifetimeRevenue ?? 0)
                )
                .slice(0, 10)
                .map((p) => (
                  <tr key={p.id}>
                    <td className="text-[color:var(--ink)]">{p.name}</td>
                    <td className="text-[color:var(--ink-soft)]">
                      {p.actualReleaseDate ?? "—"}
                    </td>
                    <td className="tabular">{p.metacriticScore ?? "—"}</td>
                    <td className="tabular">
                      {formatNumber(p.lifetimeSales ?? 0)}
                    </td>
                    <td className="tabular">
                      {formatMoney(p.lifetimeRevenue ?? 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function computeOfficeMonthlyCost(state: ReturnType<typeof useGameStore.getState>["state"]): number {
  if (!state) return 0;
  const roomUpkeep = state.office.rooms.reduce(
    (sum, r) => sum + (r.monthlyUpkeep ?? 0),
    0
  );
  return roomUpkeep + (state.office.monthlyRent ?? 0);
}
