"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-trigger checkout if plan is specified in URL
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      handleCheckout(plan);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        router.push("/login?next=/dashboard/billing");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  const plans = [
    {
      id: "hobby",
      name: "Hobby",
      price: "$9",
      period: "/mo",
      calls: "5,000",
      callsRaw: 5000,
      features: ["5,000 API calls/month", "All 13+ endpoints", "Email support", "Usage dashboard"],
      highlight: false,
      cta: "Get Hobby",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/mo",
      calls: "50,000",
      callsRaw: 50000,
      features: ["50,000 API calls/month", "All 13+ endpoints", "Priority support", "Usage dashboard", "Higher rate limits"],
      highlight: true,
      cta: "Upgrade to Pro",
    },
    {
      id: "business",
      name: "Business",
      price: "$99",
      period: "/mo",
      calls: "500,000",
      callsRaw: 500000,
      features: ["500,000 API calls/month", "All 13+ endpoints", "Dedicated support", "Usage dashboard", "Highest rate limits", "SLA guarantee"],
      highlight: false,
      cta: "Get Business",
    },
  ];

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            API Snap
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            You&apos;ve hit your API limit
          </div>
          <h1 className="text-3xl font-bold mb-3">Upgrade your plan</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your free tier quota is exhausted. Upgrade now to keep your integrations running without interruption.
          </p>
        </div>

        {/* What you're missing */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-10">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">What happens when you upgrade</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold">1</div>
              <div>
                <p className="text-sm font-medium text-white">Instant activation</p>
                <p className="text-xs text-gray-500 mt-0.5">Your new quota is live the moment payment goes through</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold">2</div>
              <div>
                <p className="text-sm font-medium text-white">No 429 errors</p>
                <p className="text-xs text-gray-500 mt-0.5">Your API calls go through without interruption</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold">3</div>
              <div>
                <p className="text-sm font-medium text-white">Cancel anytime</p>
                <p className="text-xs text-gray-500 mt-0.5">No long-term commitments, cancel with one click</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-8">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                  : "border-gray-800 bg-gray-900"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{plan.calls} calls/month</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="h-4 w-4 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting...
                  </span>
                ) : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Payments are processed securely by Stripe. Cancel anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
