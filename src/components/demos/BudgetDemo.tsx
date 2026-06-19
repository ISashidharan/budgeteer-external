import { useInView, usePrefersReducedMotion, fmtUSD } from "./hooks";

/** Animated budget planner: envelope bars fill to their spent ratio on view. */

const rows = [
  { label: "🏠 Housing", spent: 1480, total: 1800 },
  { label: "🛒 Groceries", spent: 540, total: 600 },
  { label: "🚗 Transport", spent: 210, total: 350 },
  { label: "🍽️ Dining out", spent: 320, total: 300 },
  { label: "💡 Utilities", spent: 165, total: 220 },
  { label: "🎬 Fun", spent: 90, total: 200 },
];

export default function BudgetDemo() {
  const { ref, inView } = useInView(0.3);
  const reduced = usePrefersReducedMotion();
  const totalBudget = rows.reduce((s, r) => s + r.total, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);

  return (
    <div ref={ref} className="card p-5" aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Monthly budget</span>
        <span className="text-xs font-semibold text-ink-soft">
          {fmtUSD(totalSpent)} of {fmtUSD(totalBudget)}
        </span>
      </div>
      <div className="space-y-3.5">
        {rows.map((r, i) => {
          const pct = Math.min((r.spent / r.total) * 100, 100);
          const over = r.spent > r.total;
          return (
            <div key={r.label}>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-ink">{r.label}</span>
                <span className={over ? "text-coin-600 font-bold" : "text-ink-soft"}>
                  {fmtUSD(r.spent)} / {fmtUSD(r.total)}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: inView ? `${pct}%` : "0%",
                    background: over
                      ? "linear-gradient(90deg,#F97316,#EA580C)"
                      : "linear-gradient(90deg,#14B8A6,#0F766E)",
                    transition: reduced
                      ? "none"
                      : `width 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
