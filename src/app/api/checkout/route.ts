import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  const planConfig = PLANS[plan as keyof typeof PLANS];

  if (!planConfig || !planConfig.priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
