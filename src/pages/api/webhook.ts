import type { APIRoute } from "astro";
import type Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

export const prerender = false;

/**
 * Stripe webhook receiver. Verifies the signature, then handles subscription
 * lifecycle events. Entitlement is currently logged; wire the TODO below to the
 * Budgeteer app backend when subscriber → user provisioning is built.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secret || !signature) {
    return new Response("Webhook not configured.", { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe] webhook verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[stripe] checkout completed: customer=${session.customer} email=${session.customer_details?.email} sub=${session.subscription}`
      );
      // TODO: provision/entitle this customer in the Budgeteer app backend.
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[stripe] ${event.type}: sub=${sub.id} status=${sub.status}`);
      // TODO: sync subscription status → user record.
      break;
    }
    default:
      // Unhandled events are acknowledged so Stripe stops retrying.
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
