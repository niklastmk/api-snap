"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    calls: "100",
    features: [
      "100 API calls/month",
      "All endpoints",
      "Community support",
    ],
  },
  {
    key: "hobby",
    name: "Hobby",
    price: "$9",
    period: "/month",
    calls: "5,000",
    features: [
      "5,000 API calls/month",
      "All endpoints",
      "Email support",
      "API usage dashboard",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    calls: "50,000",
    popular: true,
    features: [
      "50,000 API calls/month",
      "All endpoints",
      "Priority support",
      "Higher rate limits",
      "API usage dashboard",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: "$99",
    period: "/month",
    calls: "500,000",
    features: [
      "500,000 API calls/month",
      "All endpoints",
      "Dedicated support",
      "Custom rate limits",
      "SLA guarantee",
      "API usage dashboard",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: string) {
    if (plan === "free") {
      router.push("/signup");
      return;
    }

    setError("");
    setLoading(plan);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            ⚡ SnapAPI
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">
          Simple, Predictable Pricing
        </h1>
        <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">
          Start free, upgrade when you need more. All plans include access to
          every API endpoint. No hidden fees.
        </p>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center mb-8 max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500"
                  : "border-gray-800 bg-gray-900"
              }`}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-indigo-400 mb-2">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {plan.calls} API calls/month
              </p>

              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key}
                className={`mt-6 w-full rounded-lg py-2.5 font-medium transition disabled:opacity-50 ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {loading === plan.key
                  ? "Redirecting..."
                  : plan.key === "free"
                  ? "Get Started"
                  : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
