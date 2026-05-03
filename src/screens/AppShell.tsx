import type { ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import type { Session } from "@/lib/session";

interface Tab {
  to: string;
  label: string;
  icon: (active: boolean) => ReactNode;
}

const TABS: Tab[] = [
  { to: "/budget", label: "Budget", icon: (a) => <BudgetIcon active={a} /> },
  { to: "/accounts", label: "Accounts", icon: (a) => <AccountsIcon active={a} /> },
  { to: "/reports", label: "Reports", icon: (a) => <ReportsIcon active={a} /> },
  { to: "/settings", label: "Settings", icon: (a) => <SettingsIcon active={a} /> },
];

interface Props {
  session: Session;
}

export function AppShell({ session }: Props) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink-950">
      <main className="flex-1 overflow-y-auto pb-24 safe-x">
        <Outlet context={session} />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-950/90 backdrop-blur-md safe-bottom"
        aria-label="Primary"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-4">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.to);
            return (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  className={[
                    "flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-medium uppercase tracking-wide transition-colors",
                    active ? "text-brand-300" : "text-white/50 hover:text-white/80",
                  ].join(" ")}
                >
                  {tab.icon(active)}
                  <span>{tab.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// ── Tab icons (inline SVG; minimal but recognizable) ─────────────────────────

function IconShell({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.4 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function BudgetIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </IconShell>
  );
}

function AccountsIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 13h2" />
      <path d="M3 10h18" />
    </IconShell>
  );
}

function ReportsIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15v-4" />
      <path d="M12 15V8" />
      <path d="M16 15v-2" />
    </IconShell>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </IconShell>
  );
}
