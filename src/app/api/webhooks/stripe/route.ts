import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const plan = (session.metadata?.plan || "hobby") as "hobby" | "pro" | "business";

      db.update(users)
        .set({ stripeCustomerId: customerId, plan })
        .where(eq(users.id, session.metadata?.userId || ""))
        .run();
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const user = db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .get();

      if (user) {
        const status = sub.status;
        if (status === "active") {
          // Plan is set via checkout metadata
        } else if (status === "canceled" || status === "unpaid") {
          db.update(users)
            .set({ plan: "free" })
            .where(eq(users.id, user.id))
            .run();
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      db.update(users)
        .set({ plan: "free" })
        .where(eq(users.stripeCustomerId, customerId))
        .run();
      break;
    }
  }

  return NextResponse.json({ received: true });
}
