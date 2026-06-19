import { useState } from "react";
import { PLANS, type BillingPeriod, type Plan } from "../lib/plans";

const APP_URL =
  import.meta.env.PUBLIC_APP_URL || "http://localhost:3000";
const SIGN_UP_URL = `${APP_URL}/register`;

const Check = () => (
  <svg
    className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PricingCards() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(plan: Plan) {
    setError(null);

    // Free tier → straight to app sign-up, no Stripe.
    if (plan.free) {
      window.location.href = SIGN_UP_URL;
      return;
    }

    const priceId = plan.prices[period].priceId;
    if (!priceId) {
      setError(
        "This plan isn't configured for checkout yet. Add its Stripe Price ID to your environment."
      );
      return;
    }

    try {
      setLoadingId(plan.id);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan: plan.id, period }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoadingId(null);
    }
  }

  const yearlyHint = (plan: Plan) => {
    const m = plan.prices.monthly.amount;
    const y = plan.prices.yearly.amount;
    if (!m || !y) return null;
    const saved = m * 12 - y;
    return saved > 0 ? `Save ${"$"}${saved}/yr` : null;
  };

  return (
    <div>
      {/* Billing toggle */}
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-ink/10 bg-cream-paper p-1 shadow-sm">
        {(["monthly", "yearly"] as BillingPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-5 py-2 text-sm font-bold capitalize transition-all ${
              period === p
                ? "bg-teal-600 text-white shadow"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {p}
            {p === "yearly" && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[0.6rem] ${
                  period === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-coin-500/15 text-coin-600"
                }`}
              >
                2 months free
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mx-auto mb-6 max-w-md rounded-xl border border-coin-500/30 bg-coin-500/10 px-4 py-3 text-center text-sm font-medium text-coin-700">
          {error}
        </div>
      )}

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = plan.prices[period];
          const featured = plan.featured;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                featured
                  ? "border-teal-500/40 bg-cream-paper shadow-float ring-2 ring-teal-500/30 lg:-mt-4 lg:mb-4"
                  : "border-ink/10 bg-cream-paper shadow-card"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                  Most popular
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold text-ink">
                {plan.name}
              </h3>
              <p className="mt-1.5 min-h-[2.75rem] text-sm leading-relaxed text-ink-soft">
                {plan.tagline}
              </p>

              <div className="mt-5 flex items-end gap-1.5">
                <span className="font-serif text-4xl font-bold text-ink">
                  ${period === "monthly" ? price.amount : Math.round(price.amount / 12)}
                </span>
                <span className="mb-1.5 text-sm font-medium text-ink-soft">
                  {plan.free ? "forever" : "/mo"}
                </span>
              </div>
              <div className="mt-1 h-4 text-xs font-semibold text-coin-600">
                {period === "yearly" ? yearlyHint(plan) : ""}
                {period === "yearly" && !plan.free && price.amount
                  ? ` · billed $${price.amount}/yr`
                  : ""}
              </div>

              <button
                onClick={() => handleSelect(plan)}
                disabled={loadingId === plan.id}
                className={`mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-all disabled:opacity-70 ${
                  featured
                    ? "text-white shadow-glow hover:-translate-y-0.5"
                    : "border border-teal-600/30 bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
                style={
                  featured
                    ? {
                        backgroundImage:
                          "linear-gradient(120deg,#0F766E,#0D9488 55%,#14B8A6)",
                      }
                    : undefined
                }
              >
                {loadingId === plan.id ? "Redirecting…" : plan.cta}
              </button>

              <div className="mt-6 border-t border-ink/10 pt-5">
                {plan.featuresLead && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
                    {plan.featuresLead}
                  </p>
                )}
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-ink">
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        All paid plans include a 14-day money-back guarantee. Prices in USD.
      </p>
    </div>
  );
}
