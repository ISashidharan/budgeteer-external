/**
 * Pricing tiers — the single source of truth shared by the pricing UI and the
 * Stripe checkout endpoint. Stripe Price IDs are injected from env so the same
 * code runs against test and live modes without edits.
 *
 * Annual pricing is billed at 10× the monthly rate (i.e. 2 months free).
 */

export type BillingPeriod = "monthly" | "yearly";

export interface PlanPrice {
  /** Display amount in dollars for the chosen period (e.g. 4.99, or 49.9 yearly). */
  amount: number;
  /** Stripe recurring Price ID (server-side checkout). Empty for the free tier. */
  priceId: string;
}

export interface Plan {
  id: "free" | "pro" | "auto" | "ai";
  name: string;
  tagline: string;
  /** Highlighted as the recommended plan in the UI. */
  featured?: boolean;
  /** Free plans skip Stripe and link straight to app sign-up. */
  free?: boolean;
  prices: Record<BillingPeriod, PlanPrice>;
  /** Short feature bullets shown on the pricing cards. */
  features: string[];
  /** Label preceding the feature list, e.g. "Everything in Pro, plus". */
  featuresLead?: string;
  cta: string;
}

// Stripe price IDs come from env (see .env.example). `import.meta.env` is
// replaced at build time; we fall back to "" so the site still renders without
// keys configured (the checkout call will surface a clear error instead).
const env = import.meta.env;

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get your whole financial picture in one place — free, forever.",
    free: true,
    cta: "Start free",
    prices: {
      monthly: { amount: 0, priceId: "" },
      yearly: { amount: 0, priceId: "" },
    },
    features: [
      "Track transactions across 2 accounts",
      "1 monthly budget",
      "Net-worth snapshot",
      "Manual entry & categorization",
      "Light & dark themes",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Everything you need to budget intentionally and stay on track.",
    cta: "Start Pro",
    prices: {
      monthly: { amount: 4.99, priceId: env.STRIPE_PRICE_PRO_MONTHLY ?? "" },
      yearly: { amount: 49.9, priceId: env.STRIPE_PRICE_PRO_YEARLY ?? "" },
    },
    featuresLead: "Everything in Free, plus",
    features: [
      "Unlimited accounts & budgets",
      "CSV / XLSX statement import",
      "Full analytics & spending trends",
      "Loan tracking with amortization",
      "Budget projections",
    ],
  },
  {
    id: "auto",
    name: "Auto",
    tagline: "Put your finances on autopilot with hands-off importing & sync.",
    featured: true,
    cta: "Start Auto",
    prices: {
      monthly: { amount: 9.99, priceId: env.STRIPE_PRICE_AUTO_MONTHLY ?? "" },
      yearly: { amount: 99.9, priceId: env.STRIPE_PRICE_AUTO_YEARLY ?? "" },
    },
    featuresLead: "Everything in Pro, plus",
    features: [
      "Automatic statement imports",
      "Smart auto-categorization rules",
      "Recurring transaction detection",
      "Scheduled background syncs",
      "Asset & portfolio tracking",
    ],
  },
  {
    id: "ai",
    name: "AI",
    tagline: "Your personal AI money coach — insights, forecasts & answers.",
    cta: "Start AI",
    prices: {
      monthly: { amount: 14.99, priceId: env.STRIPE_PRICE_AI_MONTHLY ?? "" },
      yearly: { amount: 149.9, priceId: env.STRIPE_PRICE_AI_YEARLY ?? "" },
    },
    featuresLead: "Everything in Auto, plus",
    features: [
      "AI spending insights & coaching",
      "Natural-language search & answers",
      "Net-worth forecasting & scenarios",
      "Anomaly & overspend alerts",
      "Priority support",
    ],
  },
];

/** Look up the plan that owns a given Stripe Price ID (used post-checkout). */
export function planForPriceId(priceId: string): Plan | undefined {
  return PLANS.find(
    (p) =>
      p.prices.monthly.priceId === priceId ||
      p.prices.yearly.priceId === priceId
  );
}
