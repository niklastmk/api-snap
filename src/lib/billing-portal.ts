import Stripe from "stripe";
import { stripe } from "./stripe";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

type PortalUser = { id: string; email: string; stripeCustomerId: string | null };

/**
 * Find the Stripe customer for a user. Prefers the stored customer ID; falls back to
 * looking the customer up by email in Stripe (and persists the ID) for accounts whose
 * checkout webhook never linked them.
 */
export async function resolveStripeCustomerId(user: PortalUser): Promise<string | null> {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const found = await stripe.customers.list({ email: user.email, limit: 10 });
  const customer = found.data.find((c) => !c.deleted) ?? null;
  if (!customer) return null;

  await db.update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, user.id))
    .run();

  return customer.id;
}

function isMissingPortalConfig(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /default configuration|No configuration provided/i.test(message);
}

/** Create a Customer Portal configuration that allows cancelling, so the portal works without dashboard setup. */
async function createDefaultPortalConfiguration(): Promise<Stripe.BillingPortal.Configuration> {
  return stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your API Snap subscription",
    },
    features: {
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
    },
  });
}

/**
 * Create a Stripe Customer Portal session where the customer can cancel, update their card,
 * and see invoices. If the Stripe account has no portal configuration yet, one is created.
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  } catch (err) {
    if (!isMissingPortalConfig(err)) throw err;
    const config = await createDefaultPortalConfiguration();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      configuration: config.id,
    });
    return session.url;
  }
}
