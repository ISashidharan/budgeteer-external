import { useInView, useCountUp } from "./hooks";

/**
 * A row of headline metrics that count up when scrolled into view. Pure code,
 * no images — values are illustrative marketing figures.
 */

type Stat = {
  /** Numeric target to count toward. */
  value: number;
  /** Rendered prefix/suffix around the formatted number. */
  prefix?: string;
  suffix?: string;
  /** Decimal places + thousands separators. */
  decimals?: number;
  label: string;
};

const STATS: Stat[] = [
  { value: 250, suffix: "K+", label: "People budgeting" },
  { value: 4.2, prefix: "$", suffix: "B", decimals: 1, label: "Tracked & analyzed" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average app rating" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime, bank-grade" },
];

function StatItem({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView(0.4);
  const n = useCountUp(stat.value, inView, 1500);
  const display = n.toLocaleString("en-US", {
    minimumFractionDigits: stat.decimals ?? 0,
    maximumFractionDigits: stat.decimals ?? 0,
  });
  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-3xl font-bold text-gradient-teal sm:text-4xl">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm font-medium text-ink-soft">{stat.label}</div>
    </div>
  );
}

export default function StatStrip() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {STATS.map((s) => (
        <StatItem key={s.label} stat={s} />
      ))}
    </div>
  );
}
