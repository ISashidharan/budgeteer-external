import { useInView, usePrefersReducedMotion, useCountUp, fmtUSD } from "./hooks";

/** Animated net-worth tracker: assets vs liabilities line draws itself + total counts up. */

const assets = [62, 64, 67, 70, 74, 79, 83, 88, 94, 99, 106, 114];
const liabilities = [40, 39, 38, 37, 36, 35, 33, 32, 31, 30, 29, 28];
const W = 460;
const H = 160;

function path(points: number[], min: number, max: number) {
  const stepX = W / (points.length - 1);
  const toY = (v: number) => H - ((v - min) / (max - min)) * H;
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p)}`)
    .join(" ");
}

export default function NetWorthDemo() {
  const { ref, inView } = useInView(0.3);
  const reduced = usePrefersReducedMotion();
  const total = useCountUp(86000, inView, 1600);

  const all = [...assets, ...liabilities];
  const min = Math.min(...all) - 6;
  const max = Math.max(...all) + 6;
  const aPath = path(assets, min, max);
  const lPath = path(liabilities, min, max);
  const draw = inView && !reduced;

  return (
    <div ref={ref} className="card p-5" aria-hidden="true">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Net worth</span>
        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
          ↑ trending up
        </span>
      </div>
      <div className="font-serif text-2xl font-bold text-gradient-teal">
        {fmtUSD(total)}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-40 w-full overflow-visible">
        <defs>
          <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${aPath} L ${W} ${H} L 0 ${H} Z`}
          fill="url(#aFill)"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 1s ease 0.9s" }}
        />
        <path
          d={aPath}
          fill="none"
          stroke="#0D9488"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: draw ? 0 : 1000,
            transition: reduced ? "none" : "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        />
        <path
          d={lPath}
          fill="none"
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={draw ? "6 6" : "1000"}
          style={{
            strokeDashoffset: draw ? 0 : 1000,
            transition: reduced ? "none" : "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1) 0.4s",
          }}
        />
      </svg>

      <div className="mt-2 flex gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-teal-500" />
          <span className="font-semibold text-ink">Assets</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-coin-500" />
          <span className="font-semibold text-ink">Liabilities</span>
        </span>
      </div>
    </div>
  );
}
