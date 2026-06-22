# AtlasIQ — Marketing & External Site

The public marketing site for **AtlasIQ**, the personal-finance app that helps
people plan, track, and grow their money. Built with **Astro + Tailwind**,
deployed on **Vercel**, with **code-based animated product demos** (SVG/CSS — no
video files). Pricing CTAs hand off to the AtlasIQ app, which owns sign-up and
Stripe Checkout — this site holds no payment logic or keys.

## Stack

- [Astro](https://astro.build) (`output: 'server'`, Vercel adapter)
- [Tailwind CSS](https://tailwindcss.com) — brand tokens mirror the AtlasIQ app
- [React](https://react.dev) islands for the pricing toggle + animated demos
- `@astrojs/sitemap` for SEO

## Plans

Four tiers (defined in [`src/lib/plans.ts`](./src/lib/plans.ts), the single source
of truth for the pricing UI):

| Plan | Monthly | Annual (2 months free) |
| --- | --- | --- |
| Free | $0 | — |
| Pro | $4.99 | $49.90 |
| Auto | $9.99 | $99.90 |
| AI | $14.99 | $149.90 |

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
| `PUBLIC_APP_URL` | AtlasIQ app URL — sign-in / sign-up / pricing CTAs |

Pricing tiers live in [`src/lib/plans.ts`](./src/lib/plans.ts) — the single source
of truth for the pricing UI. Checkout itself lives in the AtlasIQ app: the pricing
buttons link to `${PUBLIC_APP_URL}/register?plan=<id>&period=<monthly|yearly>`,
and the app creates the account and runs Stripe Checkout.

## Project structure

```
src/
  components/        Navbar, Footer, Logo, Section, FeatureCard, FAQ, CtaBand, ...
    demos/           Animated React product demos (Hero, Analytics, Budget, NetWorth)
    PricingCards.tsx Pricing island (monthly/annual toggle) — links to the app
  layouts/           BaseLayout (SEO/OG/JSON-LD, nav + footer)
  lib/               plans.ts, site.ts
  pages/             index, features, pricing, about, contact, privacy, terms
  styles/global.css  Tailwind + brand design tokens
```

## Build & deploy (Vercel)

```bash
npm run build      # outputs .vercel/output
```

Deploy by connecting the repo to Vercel (zero-config — the `@astrojs/vercel`
adapter handles the build), or run `vercel` with the CLI. Set the env vars from
`.env.example` in the Vercel project settings.

> The Vercel runtime uses Node 22. A local Node 24 build prints a harmless
> version-mismatch warning — it doesn't affect the deployed functions.

> Brand identity (colors, fonts, logo) mirrors the AtlasIQ app so the site → app
> transition feels seamless. The `privacy` and `terms` pages are starting
> templates — have them reviewed before launch.
