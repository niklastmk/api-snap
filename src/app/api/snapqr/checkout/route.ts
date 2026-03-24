import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_QR_PRO;
    if (!priceId) {
      console.error("STRIPE_PRICE_QR_PRO not configured");
      return NextResponse.json({ error: "Checkout not available" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/snapqr/upgrade/success`,
      cancel_url: `${appUrl}/snapqr/upgrade`,
      customer_email: email,
      metadata: {
        plan: "qr_pro",
        email: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("QR Pro checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
