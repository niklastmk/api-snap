import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, apiKeys } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const email = session.customer_email || session.metadata?.email;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // Look up user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      // Webhook may not have fired yet — retry after a short delay on the client
      return NextResponse.json({ error: "Account not ready yet", retry: true }, { status: 202 });
    }

    // Get their API key
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.userId, user.id)).limit(1);
    if (!key) {
      return NextResponse.json({ error: "No API key found", retry: true }, { status: 202 });
    }

    return NextResponse.json({ apiKey: key.key, email, plan: user.plan });
  } catch (err) {
    console.error("Session lookup error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
