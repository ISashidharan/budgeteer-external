/**
 * Pricing tiers — the single source of truth shared by the pricing UI and the
 * Stripe checkout endpoint. Stripe Price IDs are injected from env so the same
 * code runs against test and live modes without edits.
 */

export type BillingPeriod = "monthly" | "yearly";

export interface PlanPrice {
  /** Display amount in whole dollars for the chosen period. */
  amount: number;
  /** Stripe recurring Price ID (server-side checkout). Empty for the free tier. */
  priceId: string;
}

export interface Plan {
  id: "starter" | "pro" | "wealth";
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
    id: "starter",
    name: "Starter",
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
    featured: true,
    cta: "Start Pro",
    prices: {
      monthly: { amount: 8, priceId: env.STRIPE_PRICE_PRO_MONTHLY ?? "" },
      yearly: { amount: 80, priceId: env.STRIPE_PRICE_PRO_YEARLY ?? "" },
    },
    featuresLead: "Everything in Starter, plus",
    features: [
      "Unlimited accounts & budgets",
      "CSV / XLSX statement import",
      "Smart categorization rules",
      "Full analytics & spending trends",
      "Loan tracking with amortization",
      "Budget projections",
    ],
  },
  {
    id: "wealth",
    name: "Wealth",
    tagline: "For builders optimizing every dollar toward long-term wealth.",
    cta: "Start Wealth",
    prices: {
      monthly: { amount: 16, priceId: env.STRIPE_PRICE_WEALTH_MONTHLY ?? "" },
      yearly: { amount: 160, priceId: env.STRIPE_PRICE_WEALTH_YEARLY ?? "" },
    },
    featuresLead: "Everything in Pro, plus",
    features: [
      "Multi-year net-worth forecasting",
      "Asset & portfolio tracking",
      "Goal planning & scenarios",
      "Advanced reporting & exports",
      "Priority support",
      "Early access to new features",
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
