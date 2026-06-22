import { useInView, usePrefersReducedMotion, useCountUp, fmtUSD } from "./hooks";

/**
 * Animated loan / amortization demo: the remaining-balance curve draws itself
 * down to zero while the principal-vs-interest split bar fills and the payoff
 * stats count up. All code-driven (SVG + CSS), crisp at any resolution and
 * respectful of prefers-reduced-motion.
 */

// Remaining balance over a 30-year mortgage ($320k @ 4.25%), sampled per year
// end-of-year (in $000s). 31 points: year 0 through year 30 (payoff).
const BALANCE = [
  320, 315, 309, 303, 297, 291, 284, 277, 270, 262, 254, 246, 237, 228, 219,
  209, 199, 188, 177, 166, 154, 141, 128, 114, 100, 85, 69, 53, 36, 18, 0,
];
const W = 460;
const H = 150;

function buildPath(points: number[]) {
  const max = Math.max(...points);
  const stepX = W / (points.length - 1);
  const toY = (v: number) => H - (v / max) * (H - 8);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p)}`)
    .join(" ");
}

export default function LoanDemo() {
  const { ref, inView } = useInView(0.3);
  const reduced = usePrefersReducedMotion();
  const draw = inView && !reduced;

  const interest = useCountUp(246715, inView, 1600);
  const monthly = useCountUp(1574, inView, 1400);

  const linePath = buildPath(BALANCE);
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  // Principal vs. total interest paid over the life of the loan.
  // $320k principal of $566.7k total paid ≈ 56%.
  const principalPct = 56;

  return (
    <div ref={ref} className="card p-5" aria-hidden="true">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Home loan · $320,000</span>
        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
          30-yr · 4.25%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
            Monthly payment
          </div>
          <div className="font-serif text-xl font-bold text-ink">
            {fmtUSD(monthly)}
          </div>
        </div>
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
            Total interest
          </div>
          <div className="font-serif text-xl font-bold text-coin-600">
            {fmtUSD(interest)}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 h-32 w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="loanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#loanFill)"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 1s ease 0.9s" }}
        />
        <path
          d={linePath}
          fill="none"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1100,
            strokeDashoffset: draw ? 0 : 1100,
            transition: reduced
              ? "none"
              : "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        />
      </svg>
      <div className="-mt-1 flex justify-between text-[0.65rem] font-medium text-ink-soft">
        <span>Today</span>
        <span>Payoff · 2056</span>
      </div>

      {/* Principal vs interest split */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-teal-600">Principal</span>
          <span className="text-coin-600">Interest</span>
        </div>
        <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-ink/8">
          <div
            className="h-full"
            style={{
              width: inView ? `${principalPct}%` : "0%",
              background: "linear-gradient(90deg,#818CF8,#4F46E5)",
              transition: reduced
                ? "none"
                : "width 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s",
            }}
          />
          <div
            className="h-full flex-1"
            style={{ background: "linear-gradient(90deg,#22D3EE,#0891B2)" }}
          />
        </div>
      </div>
    </div>
  );
}
