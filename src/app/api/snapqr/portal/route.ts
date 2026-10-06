import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth";
import { createPortalSession, resolveStripeCustomerId } from "@/lib/billing-portal";

// Opens the Stripe Customer Portal for a SnapQR Pro subscriber, identified by their API key
// (the same credential the SnapQR pages keep in localStorage after checkout or email restore).
export async function POST(req: NextRequest) {
  try {
    let apiKey: string | undefined;
    try {
      const body = await req.json();
      apiKey = typeof body?.apiKey === "string" ? body.apiKey : undefined;
    } catch {
      apiKey = undefined;
    }
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 400 });
    }

    const auth = await authenticateApiKey(apiKey);
    if (!auth) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const customerId = await resolveStripeCustomerId(auth.user);
    if (!customerId) {
      return NextResponse.json(
        { error: "No subscription found for this account." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = await createPortalSession(customerId, `${appUrl}/snapqr/account`);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("SnapQR portal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
