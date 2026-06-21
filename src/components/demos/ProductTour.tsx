import { useState } from "react";
import HeroDemo from "./HeroDemo";
import BudgetDemo from "./BudgetDemo";
import AnalyticsDemo from "./AnalyticsDemo";
import NetWorthDemo from "./NetWorthDemo";
import LoanDemo from "./LoanDemo";

/**
 * Interactive product tour: a segmented control that swaps between the live,
 * code-driven demos. Each tab remounts its demo (via `key`) so the entrance
 * animations replay every time you switch — making the tour feel alive.
 */

const TABS = [
  { id: "dashboard", label: "Dashboard", render: () => <HeroDemo /> },
  { id: "budgets", label: "Budgets", render: () => <BudgetDemo /> },
  { id: "analytics", label: "Analytics", render: () => <AnalyticsDemo /> },
  { id: "networth", label: "Net worth", render: () => <NetWorthDemo /> },
  { id: "loans", label: "Loans", render: () => <LoanDemo /> },
] as const;

export default function ProductTour() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("dashboard");
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product tour"
        className="mx-auto mb-8 flex w-full max-w-xl flex-wrap items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-cream-paper p-1.5 shadow-card"
      >
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                selected
                  ? "bg-brand-teal text-white shadow-glow"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* `key` forces a remount per tab so demo animations replay. */}
      <div key={active} className="animate-fade-up mx-auto max-w-2xl">
        {current.render()}
      </div>
    </div>
  );
}
