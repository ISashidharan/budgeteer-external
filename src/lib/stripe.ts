/**
 * Server-only Stripe client. Imported exclusively from API routes so the secret
 * key never reaches the browser bundle.
 */
import Stripe from "stripe";

const secretKey = import.meta.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // Surfaced at request time in the API routes; logged here for clarity in dev.
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not set — checkout will fail until it is configured (see .env.example)."
  );
}

export const stripe = new Stripe(secretKey ?? "", {
  apiVersion: "2025-01-27.acacia",
  appInfo: { name: "Budgeteer Marketing Site" },
});

/** Absolute base URL of the Budgeteer app, used for post-checkout redirects. */
export const APP_URL = import.meta.env.PUBLIC_APP_URL || "http://localhost:3000";
