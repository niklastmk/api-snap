import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    _stripe = new Stripe(key || "sk_test_placeholder", { apiVersion: "2025-02-24.acacia" });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  hobby: {
    name: "Hobby",
    price: "$9/mo",
    priceId: process.env.STRIPE_PRICE_HOBBY || "",
    requests: "5,000",
    features: ["5,000 API calls/month", "All endpoints", "Email support"],
  },
  pro: {
    name: "Pro",
    price: "$29/mo",
    priceId: process.env.STRIPE_PRICE_PRO || "",
    requests: "50,000",
    features: [
      "50,000 API calls/month",
      "All endpoints",
      "Priority support",
      "Higher rate limits",
    ],
  },
  business: {
    name: "Business",
    price: "$99/mo",
    priceId: process.env.STRIPE_PRICE_BUSINESS || "",
    requests: "500,000",
    features: [
      "500,000 API calls/month",
      "All endpoints",
      "Dedicated support",
      "Custom rate limits",
      "SLA guarantee",
    ],
  },
} as const;
