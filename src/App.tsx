import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAppState } from "@/lib/useAppState";
import { AuthScreen } from "@/screens/AuthScreen";
import { HouseholdSetupScreen } from "@/screens/HouseholdSetupScreen";
import { AppShell } from "@/screens/AppShell";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { BudgetScreen } from "@/screens/BudgetScreen";
import { AccountsScreen } from "@/screens/AccountsScreen";
import { AccountDetailScreen } from "@/screens/AccountDetailScreen";
import { ScheduledScreen } from "@/screens/ScheduledScreen";
import { PlaceholderScreen } from "@/screens/PlaceholderScreen";

export function App() {
  const state = useAppState();

  if (state.status === "loading") {
    return <Splash />;
  }

  if (state.status === "signedOut") {
    return <AuthScreen />;
  }

  if (state.status === "needsHousehold") {
    return <HouseholdSetupScreen user={state.user} />;
  }

  // status === "ready"
  const session = {
    user: state.user,
    userDoc: state.userDoc,
    household: state.household,
  };

  return (
    <Router>
      <Routes>
        <Route element={<AppShell session={session} />}>
          <Route path="/budget" element={<BudgetScreen />} />
          <Route path="/accounts" element={<AccountsScreen />} />
          <Route path="/accounts/:accountId" element={<AccountDetailScreen />} />
          <Route
            path="/reports"
            element={<PlaceholderScreen title="Reports" />}
          />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/scheduled" element={<ScheduledScreen />} />
          <Route path="*" element={<Navigate to="/budget" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Splash() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4">
      <img
        src="/icon-192.png"
        alt="Maverick Budget"
        className="size-16 rounded-2xl shadow-lg shadow-brand-500/20"
      />
      <div className="text-sm text-white/40">Loading…</div>
    </div>
  );
}
