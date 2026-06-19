import { useInView, usePrefersReducedMotion, useCountUp, fmtUSD } from "./hooks";

/** Animated spending-analytics card: monthly bars grow + a category donut sweeps in. */

const months = [
  { m: "Jan", v: 2800 },
  { m: "Feb", v: 3100 },
  { m: "Mar", v: 2600 },
  { m: "Apr", v: 3400 },
  { m: "May", v: 2950 },
  { m: "Jun", v: 3180 },
];
const max = Math.max(...months.map((m) => m.v));

const categories = [
  { label: "Housing", pct: 38, color: "#0F766E" },
  { label: "Food", pct: 22, color: "#14B8A6" },
  { label: "Transport", pct: 14, color: "#F97316" },
  { label: "Other", pct: 26, color: "#FDBA74" },
];

const R = 52;
const C = 2 * Math.PI * R;

export default function AnalyticsDemo() {
  const { ref, inView } = useInView(0.3);
  const reduced = usePrefersReducedMotion();
  const total = useCountUp(3180, inView, 1400);

  let offsetAcc = 0;

  return (
    <div ref={ref} className="card p-5" aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Spending analytics</span>
        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
          6 months
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.3fr_1fr]">
        {/* Bars */}
        <div>
          <div className="flex h-36 items-end justify-between gap-2">
            {months.map((mo, i) => (
              <div key={mo.m} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-28 w-full items-end">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: inView ? `${(mo.v / max) * 100}%` : "0%",
                      background:
                        i === months.length - 1
                          ? "linear-gradient(180deg,#14B8A6,#0F766E)"
                          : "rgba(15,118,110,0.22)",
                      transition: reduced
                        ? "none"
                        : `height 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
                    }}
                  />
                </div>
                <span className="text-[0.65rem] font-medium text-ink-soft">
                  {mo.m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 140 140" className="h-32 w-32 shrink-0">
            <g transform="rotate(-90 70 70)">
              {categories.map((c) => {
                const len = (c.pct / 100) * C;
                const seg = (
                  <circle
                    key={c.label}
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke={c.color}
                    strokeWidth="16"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={inView ? -offsetAcc : -C}
                    style={{
                      transition: reduced
                        ? "none"
                        : "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                );
                offsetAcc += len;
                return seg;
              })}
            </g>
            <text
              x="70"
              y="66"
              textAnchor="middle"
              className="fill-ink font-serif text-[13px] font-bold"
            >
              {fmtUSD(total)}
            </text>
            <text
              x="70"
              y="82"
              textAnchor="middle"
              className="fill-[#5B6474] text-[8px] font-semibold uppercase"
            >
              this month
            </text>
          </svg>
          <ul className="space-y-1.5">
            {categories.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c.color }}
                />
                <span className="font-semibold text-ink">{c.label}</span>
                <span className="text-ink-soft">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
