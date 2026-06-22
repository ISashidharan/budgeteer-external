/**
 * Server-only Stripe client. Imported exclusively from API routes so the secret
 * key never reaches the browser bundle.
 *
 * The client is created lazily: constructing `new Stripe("")` throws, so we defer
 * construction until a route actually needs it. That lets the API routes return a
 * clean, JSON error when keys aren't configured instead of crashing on import.
 */
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns a configured Stripe client, or throws if the secret key is missing. */
export function getStripe(): Stripe {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — configure it in your environment (see .env.example)."
    );
  }
  if (!client) {
    client = new Stripe(secretKey, {
      appInfo: { name: "AtlasIQ Marketing Site" },
    });
  }
  return client;
}

/** True when Stripe is configured and checkout can proceed. */
export const isStripeConfigured = () => Boolean(import.meta.env.STRIPE_SECRET_KEY);

/** Absolute base URL of the AtlasIQ app, used for post-checkout redirects. */
export const APP_URL = import.meta.env.PUBLIC_APP_URL || "http://localhost:3000";
