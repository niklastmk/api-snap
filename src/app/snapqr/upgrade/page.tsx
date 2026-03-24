"use client";

import { useState } from "react";
import Link from "next/link";

export default function SnapQRUpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function handleCheckout() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/snapqr/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/snapqr" className="text-2xl font-bold text-black">
            SnapQR
          </Link>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">SnapQR Pro</h1>
            <div className="text-3xl font-bold text-black mb-1">$7<span className="text-lg font-normal text-zinc-500">/mo</span></div>
            <p className="text-sm text-zinc-500">
              Unlimited QR codes with full analytics.
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Remove SnapQR branding from stats pages",
              "Unlimited QR codes",
              "Full scan analytics (device, browser, OS, country)",
              "All API Snap developer tools included",
              "Priority support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-zinc-700">
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="block w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base text-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting..." : "Subscribe to QR Pro"}
          </button>

          <p className="text-center text-xs text-zinc-400 mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Just want the free tier?{" "}
          <Link href="/snapqr" className="text-blue-600 hover:underline font-medium">
            Generate a free QR code
          </Link>
        </p>
      </div>
    </div>
  );
}
