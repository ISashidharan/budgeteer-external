// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// Public site URL — used for canonical links, sitemap and Open Graph tags.
// Override via the SITE_URL env var in production.
const SITE_URL = process.env.SITE_URL || "https://budgeteer.app";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Marketing pages are prerendered (see `export const prerender = true`),
  // while the Stripe API routes run on-demand on the Node server.
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [tailwind(), react(), sitemap()],
});
