# Budgeteer — Marketing & External Site

The public marketing site for **Budgeteer**, the personal-finance app that helps
people plan, track, and grow their money. Built with **Astro + Tailwind**,
deployed on **Vercel**, with **real Stripe Checkout** for subscriptions and
**code-based animated product demos** (SVG/CSS — no video files).

## Stack

- [Astro](https://astro.build) (`output: 'server'`, Vercel adapter)
- [Tailwind CSS](https://tailwindcss.com) — brand tokens mirror the Budgeteer app
- [React](https://react.dev) islands for the pricing toggle + animated demos
- [Stripe](https://stripe.com) Checkout + webhooks
- `@astrojs/sitemap` for SEO

## Plans

Four tiers (defined in [`src/lib/plans.ts`](./src/lib/plans.ts), the single source
of truth shared by the pricing UI and the checkout endpoint):

| Plan | Monthly | Annual (2 months free) |
| --- | --- | --- |
| Free | $0 | — |
| Pro | $4.99 | $49.90 |
| Auto | $9.99 | $99.90 |
| AI | $15.99 | $159.90 |

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your values
npm run dev            # http://localhost:4321
```

### Environment variables

See [`.env.example`](./.env.example). You'll need:

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public URL of this site (canonical, OG, sitemap) |
| `PUBLIC_APP_URL` | Budgeteer app URL — sign-in / sign-up / post-checkout CTAs |
| `STRIPE_SECRET_KEY` / `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe API keys (use test keys in dev) |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming webhooks |
| `STRIPE_PRICE_*` | Recurring Price IDs for each plan/period |

Pricing tiers live in [`src/lib/plans.ts`](./src/lib/plans.ts) — the single source
of truth shared by the pricing UI and the checkout endpoint.

## Stripe locally

```bash
# Forward webhooks to the dev server
stripe listen --forward-to localhost:4321/api/webhook

# In another terminal, simulate an event
stripe trigger checkout.session.completed
```

Test card: `4242 4242 4242 4242`, any future expiry / CVC.

## Project structure

```
src/
  components/        Navbar, Footer, Logo, Section, FeatureCard, FAQ, CtaBand, ...
    demos/           Animated React product demos (Hero, Analytics, Budget, NetWorth)
    PricingCards.tsx Stripe checkout island (monthly/annual toggle)
  layouts/           BaseLayout (SEO/OG/JSON-LD, nav + footer)
  lib/               plans.ts, stripe.ts, site.ts
  pages/             index, features, pricing, about, contact, privacy, terms,
                     success, canceled, api/create-checkout-session, api/webhook
  styles/global.css  Tailwind + brand design tokens
```

## Build & deploy (Vercel)

```bash
npm run build      # outputs .vercel/output
```

Deploy by connecting the repo to Vercel (zero-config — the `@astrojs/vercel`
adapter handles the build), or run `vercel` with the CLI. Set the env vars from
`.env.example` in the Vercel project settings, and point the Stripe webhook at
`https://<your-domain>/api/webhook`.

> The Vercel runtime uses Node 22. A local Node 24 build prints a harmless
> version-mismatch warning — it doesn't affect the deployed functions.

> Brand identity (colors, fonts, logo) mirrors the Budgeteer app so the site → app
> transition feels seamless. The `privacy` and `terms` pages are starting
> templates — have them reviewed before launch.
