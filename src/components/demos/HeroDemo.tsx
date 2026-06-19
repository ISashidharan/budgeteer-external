import { useInView, useCountUp, usePrefersReducedMotion, fmtUSD } from "./hooks";

/**
 * The hero "marketing video": an auto-playing mock of the Budgeteer dashboard.
 * Numbers count up, the net-worth line draws itself, budget bars fill and
 * category donut animates — all in code (SVG + CSS), crisp at any resolution
 * and respectful of prefers-reduced-motion.
 */

const NETWORTH_POINTS = [38, 41, 40, 46, 52, 50, 58, 64, 62, 71, 78, 86];
const W = 520;
const H = 150;

function buildPath(points: number[]) {
  const max = Math.max(...points);
  const min = Math.min(...points) - 6;
  const stepX = W / (points.length - 1);
  const toY = (v: number) => H - ((v - min) / (max - min)) * H;
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p)}`)
    .join(" ");
}

const budgets = [
  { label: "Housing", spent: 1480, total: 1800, color: "#0D9488" },
  { label: "Groceries", spent: 540, total: 600, color: "#14B8A6" },
  { label: "Transport", spent: 210, total: 350, color: "#F97316" },
  { label: "Dining", spent: 320, total: 300, color: "#EA580C" },
];

const transactions = [
  { name: "Whole Foods", cat: "Groceries", amt: -86.4, icon: "🛒" },
  { name: "Salary", cat: "Income", amt: 4200, icon: "💼" },
  { name: "Shell", cat: "Transport", amt: -52.1, icon: "⛽" },
  { name: "Netflix", cat: "Subscriptions", amt: -15.99, icon: "🎬" },
];

export default function HeroDemo() {
  const { ref, inView } = useInView(0.25);
  const reduced = usePrefersReducedMotion();
  const active = inView;

  const netWorth = useCountUp(128450, active, 1600);
  const income = useCountUp(6240, active, 1400);
  const spending = useCountUp(3180, active, 1400);

  const linePath = buildPath(NETWORTH_POINTS);
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div ref={ref} className="select-none" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-cream-paper shadow-float">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-ink/10 bg-white/60 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#EF4444]/70" />
          <span className="h-3 w-3 rounded-full bg-[#F59E0B]/70" />
          <span className="h-3 w-3 rounded-full bg-[#10B981]/70" />
          <span className="ml-3 rounded-md bg-ink/5 px-3 py-1 text-xs font-medium text-ink-soft">
            app.budgeteer.app/dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[150px_1fr]">
          {/* Sidebar */}
          <aside className="hidden flex-col gap-1 sm:flex">
            <div className="mb-2 px-2 text-[0.7rem] font-bold uppercase tracking-wider text-ink-soft">
              Budgeteer
            </div>
            {[
              { l: "Dashboard", active: true },
              { l: "Transactions" },
              { l: "Budgets" },
              { l: "Analytics" },
              { l: "Loans" },
              { l: "Net Worth" },
            ].map((it) => (
              <div
                key={it.l}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  it.active
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-ink-soft"
                }`}
              >
                {it.l}
              </div>
            ))}
          </aside>

          {/* Main panel */}
          <div className="space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Net worth" value={fmtUSD(netWorth)} trend="+6.4%" />
              <StatCard label="Income (mo)" value={fmtUSD(income)} trend="+2.1%" />
              <StatCard
                label="Spending (mo)"
                value={fmtUSD(spending)}
                trend="-3.0%"
                down
              />
            </div>

            {/* Net worth chart */}
            <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-ink">Net worth</span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-600">
                  12 months
                </span>
              </div>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-[110px] w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#nwFill)" className={active ? "nw-area" : "nw-area-hidden"} />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={reduced ? "" : active ? "nw-line" : "nw-line-hidden"}
                />
              </svg>
            </div>

            {/* Budgets + transactions */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
                <span className="text-sm font-bold text-ink">Budgets</span>
                <div className="mt-3 space-y-3">
                  {budgets.map((b, i) => {
                    const pct = Math.min((b.spent / b.total) * 100, 100);
                    const over = b.spent > b.total;
                    return (
                      <div key={b.label}>
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-ink">{b.label}</span>
                          <span className={over ? "text-coin-600" : "text-ink-soft"}>
                            {fmtUSD(b.spent)} / {fmtUSD(b.total)}
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/8">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: active ? `${pct}%` : "0%",
                              background: b.color,
                              transition: reduced
                                ? "none"
                                : `width 1.1s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.12}s`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
                <span className="text-sm font-bold text-ink">Recent activity</span>
                <div className="mt-2 space-y-1.5">
                  {transactions.map((t, i) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5"
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active ? "none" : "translateX(8px)",
                        transition: reduced
                          ? "none"
                          : `all 0.5s ease ${0.4 + i * 0.12}s`,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/5 text-sm">
                          {t.icon}
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-ink">
                            {t.name}
                          </span>
                          <span className="block text-[0.65rem] text-ink-soft">
                            {t.cat}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          t.amt > 0 ? "text-teal-600" : "text-ink"
                        }`}
                      >
                        {t.amt > 0 ? "+" : ""}
                        {fmtUSD(t.amt, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nw-line { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: nwDraw 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s forwards; }
        .nw-line-hidden { stroke-dasharray: 1200; stroke-dashoffset: 1200; }
        .nw-area { opacity: 0; animation: nwFade 1.2s ease 1s forwards; }
        .nw-area-hidden { opacity: 0; }
        @keyframes nwDraw { to { stroke-dashoffset: 0; } }
        @keyframes nwFade { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .nw-line, .nw-line-hidden { stroke-dashoffset: 0; }
          .nw-area, .nw-area-hidden { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  down,
}: {
  label: string;
  value: string;
  trend: string;
  down?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/70 p-3">
      <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </div>
      <div className="mt-1 font-serif text-base font-bold text-ink sm:text-lg">
        {value}
      </div>
      <div
        className={`mt-0.5 text-[0.65rem] font-bold ${
          down ? "text-coin-600" : "text-teal-600"
        }`}
      >
        {trend}
      </div>
    </div>
  );
}
