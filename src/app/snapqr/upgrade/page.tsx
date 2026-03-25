"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function UpgradePageInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
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
        body: JSON.stringify({ email, ...(code ? { code } : {}) }),
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

  const Check = () => (
    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
  const Cross = () => (
    <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col overflow-x-hidden">
      <nav className="bg-white border-b border-zinc-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/snapqr" className="text-base font-bold text-black tracking-tight">SnapQR</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/snapqr/account" className="text-zinc-500 hover:text-zinc-800 transition-colors">Account</Link>
          <Link href="/snapqr" className="text-zinc-500 hover:text-zinc-800 transition-colors">
            &larr; Back
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-black mb-2">Go Pro, track every scan</h1>
            <p className="text-zinc-500">Unlimited QR codes with analytics that actually help you grow.</p>
            {code && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800">
                <span>Upgrading QR code:</span>
                <code className="font-mono font-semibold">{code}</code>
              </div>
            )}
          </div>

          {/* Comparison table */}
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 mb-8">
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <div className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-4">Free</div>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li className="flex items-center gap-2"><Check /> 3 QR codes</li>
                <li className="flex items-center gap-2"><Check /> 7-day history</li>
                <li className="flex items-center gap-2"><Check /> Basic analytics</li>
                <li className="flex items-center gap-2"><Cross /> <span className="text-zinc-400">CSV export</span></li>
                <li className="flex items-center gap-2"><Cross /> <span className="text-zinc-400">Clean images</span></li>
              </ul>
              <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
                <span className="text-lg font-bold text-black">$0</span>
                <span className="text-xs text-zinc-400 ml-1">forever</span>
              </div>
            </div>
            <div className="bg-white border-2 border-blue-600 rounded-xl p-5 relative shadow-sm shadow-blue-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Best value
              </div>
              <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-4">Pro</div>
              <ul className="space-y-3 text-sm text-zinc-700">
                <li className="flex items-center gap-2"><Check /> <strong>Unlimited</strong> QR codes</li>
                <li className="flex items-center gap-2"><Check /> <strong>30-day</strong> history</li>
                <li className="flex items-center gap-2"><Check /> Full analytics</li>
                <li className="flex items-center gap-2"><Check /> CSV export</li>
                <li className="flex items-center gap-2"><Check /> Clean images</li>
              </ul>
              <div className="mt-5 pt-4 border-t border-blue-100 text-center">
                <span className="text-lg font-bold text-black">$7</span>
                <span className="text-xs text-zinc-400 ml-1">/month</span>
              </div>
            </div>
          </div>

          {/* Checkout */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
              placeholder="your@email.com"
              className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors text-base text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting to Stripe..." : "Start Pro — $7/mo"}
            </button>

            <p className="text-center text-xs text-zinc-400 mt-3">
              Secure checkout via Stripe. Cancel anytime, no questions asked.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-zinc-500">
            <Link href="/snapqr" className="text-blue-600 hover:underline font-medium">
              Stay on Free
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/snapqr/account" className="hover:underline">
              Already Pro? Restore access
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SnapQRUpgradePage() {
  return (
    <Suspense>
      <UpgradePageInner />
    </Suspense>
  );
}
