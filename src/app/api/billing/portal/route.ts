import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createPortalSession, resolveStripeCustomerId } from "@/lib/billing-portal";

// Opens the Stripe Customer Portal for the logged-in dashboard user (cancel, change card, invoices).
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = await resolveStripeCustomerId(user);
    if (!customerId) {
      return NextResponse.json(
        { error: "No subscription found for this account." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = await createPortalSession(customerId, `${appUrl}/dashboard/billing`);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Billing portal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
