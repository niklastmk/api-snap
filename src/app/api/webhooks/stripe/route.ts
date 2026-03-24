import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, apiKeys } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import Stripe from "stripe";

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN: Record<string, "hobby" | "pro" | "business" | "qr_pro"> = {
  [process.env.STRIPE_PRICE_HOBBY || "price_1TE9vQFAtUvZANbzzoWEI87L"]: "hobby",
  [process.env.STRIPE_PRICE_PRO || "price_1TE9vcFAtUvZANbzEnpD1q4G"]: "pro",
  [process.env.STRIPE_PRICE_BUSINESS || "price_1TE9vqFAtUvZANbzRvveyRBq"]: "business",
  [process.env.STRIPE_PRICE_QR_PRO || "price_1TETKiFAtUvZANbzpImtM48J"]: "qr_pro",
};

function getPlanFromSubscription(sub: Stripe.Subscription): "hobby" | "pro" | "business" | "qr_pro" | null {
  const priceId = sub.items.data[0]?.price?.id;
  if (!priceId) return null;
  return PRICE_TO_PLAN[priceId] || null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured — cannot verify webhook");
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 });
  }

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;
        const metaEmail = session.metadata?.email || session.customer_email;

        if (userId) {
          // Existing user — link customer ID (plan set by subscription events)
          await db.update(users)
            .set({ stripeCustomerId: customerId })
            .where(eq(users.id, userId))
            .run();
          console.log(`Linked customer ${customerId} to user ${userId}`);
        } else if (metaEmail) {
          // Email-only checkout — link customer to user by email if they exist
          const result = await db.update(users)
            .set({ stripeCustomerId: customerId })
            .where(eq(users.email, metaEmail))
            .run();
          if (result.rowsAffected > 0) {
            console.log(`checkout.session.completed: linked customer ${customerId} to email ${metaEmail}`);
          } else {
            // No existing user — create one for this paying customer
            const userId = nanoid();
            const passwordHash = "$2a$12$placeholder"; // email-only checkout, no password login
            await db.insert(users).values({
              id: userId,
              email: metaEmail,
              passwordHash,
              stripeCustomerId: customerId,
              plan: "qr_pro",
              createdAt: new Date(),
            }).run();

            // Generate an API key for the new user
            const apiKeyId = nanoid();
            const apiKeyValue = `snp_${nanoid(32)}`;
            await db.insert(apiKeys).values({
              id: apiKeyId,
              userId,
              key: apiKeyValue,
              name: "Default",
              createdAt: new Date(),
            }).run();

            console.log(`checkout.session.completed: created new user for ${metaEmail} with plan qr_pro`);
          }
        } else {
          console.error("checkout.session.completed: no userId or email in metadata", session.id);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const status = sub.status;

        if (status === "active" || status === "trialing") {
          const plan = getPlanFromSubscription(sub);
          if (plan) {
            // Try updating by stripeCustomerId first
            const result = await db.update(users)
              .set({ plan, stripeCustomerId: customerId })
              .where(eq(users.stripeCustomerId, customerId))
              .run();

            // If no rows matched, the checkout event may not have linked the customer yet.
            // Look up the customer's email from Stripe and match by email instead.
            if (result.rowsAffected === 0) {
              const customer = await stripe.customers.retrieve(customerId);
              if (!customer.deleted && customer.email) {
                await db.update(users)
                  .set({ plan, stripeCustomerId: customerId })
                  .where(eq(users.email, customer.email))
                  .run();
                console.log(`${event.type}: linked and set plan ${plan} for ${customer.email} (fallback)`);
              } else {
                console.error(`${event.type}: could not find user for customer ${customerId}`);
              }
            } else {
              console.log(`${event.type}: set plan ${plan} for customer ${customerId} (status: ${status})`);
            }
          } else {
            console.error(`${event.type}: unknown price ID for customer ${customerId}`);
          }
        } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
          await db.update(users)
            .set({ plan: "free" })
            .where(eq(users.stripeCustomerId, customerId))
            .run();
          console.log(`${event.type}: downgraded customer ${customerId} to free (status: ${status})`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await db.update(users)
          .set({ plan: "free" })
          .where(eq(users.stripeCustomerId, customerId))
          .run();

        console.log(`Subscription deleted: downgraded customer ${customerId} to free`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error processing webhook ${event.type}:`, err);
    // Return 500 so Stripe retries the webhook
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
