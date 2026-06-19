import type { APIRoute } from "astro";
import { stripe } from "../../lib/stripe";

export const prerender = false;

/**
 * Creates a Stripe Checkout Session for the selected recurring price and
 * returns its hosted URL. The client redirects the browser to that URL.
 */
export const POST: APIRoute = async ({ request, url }) => {
  if (!import.meta.env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe is not configured on the server." }, 500);
  }

  let body: { priceId?: string; plan?: string; period?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { priceId, plan, period } = body;
  if (!priceId || typeof priceId !== "string") {
    return json({ error: "A valid priceId is required." }, 400);
  }

  const origin = url.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: { plan: plan ?? "", period: period ?? "" },
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/canceled`,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("[stripe] checkout session error:", err);
    const message =
      err instanceof Error ? err.message : "Could not create checkout session.";
    return json({ error: message }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
