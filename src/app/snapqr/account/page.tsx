"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SnapQRAccountPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "not_found">("idle");
  const [storedEmail, setStoredEmail] = useState("");
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check if we already have an API key stored
    const key = localStorage.getItem("snapqr_api_key");
    if (key) {
      setIsPro(true);
    }
  }, []);

  function handleClearAccess() {
    localStorage.removeItem("snapqr_api_key");
    setIsPro(false);
    setStatus("idle");
    setStoredEmail("");
    setEmail("");
  }

  async function handleLookup() {
    if (!email || !email.includes("@")) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/snapqr/account?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.apiKey) {
        localStorage.setItem("snapqr_api_key", data.apiKey);
        setStoredEmail(email);
        setIsPro(true);
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <nav className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/snapqr" className="text-base font-bold text-black tracking-tight">SnapQR</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/snapqr/upgrade" className="text-zinc-500 hover:text-zinc-800 transition-colors">Pricing</Link>
          <Link href="/snapqr" className="text-zinc-500 hover:text-zinc-800 transition-colors">&larr; Back</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {status === "found" ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-black mb-1">Pro access restored!</p>
              <p className="text-zinc-500 text-sm mb-6">Confirmed for {storedEmail}</p>
              <Link href="/snapqr" className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                Create QR codes &rarr;
              </Link>
              <div className="mt-4">
                <button
                  onClick={handleClearAccess}
                  className="text-xs text-zinc-400 hover:text-red-600 underline underline-offset-2 transition-colors"
                >
                  Sign out of this browser
                </button>
              </div>
            </div>
          ) : status === "not_found" ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-zinc-100 rounded-full mb-4">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-black mb-1">No Pro account found</p>
              <p className="text-zinc-500 text-sm mb-5">We couldn&apos;t find a subscription for that email.</p>
              <div className="flex flex-col gap-2">
                <Link href="/snapqr/upgrade" className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  Upgrade to Pro &rarr;
                </Link>
                <button onClick={() => setStatus("idle")} className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors py-2">
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-black">Restore Pro on this device</h1>
                </div>
              </div>
              <p className="text-zinc-500 text-sm mb-6">Paid on another device or cleared your browser? Enter the email you subscribed with to re-activate Pro here.</p>

              {isPro && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm text-green-700 flex items-center justify-between gap-3">
                  <span>Pro is already active on this device.</span>
                  <button
                    onClick={handleClearAccess}
                    className="text-xs text-zinc-500 hover:text-red-600 underline underline-offset-2 whitespace-nowrap transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <label className="block text-sm font-medium text-zinc-700 mb-1">Subscription email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder="your@email.com"
                className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleLookup}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
              >
                {loading ? "Looking up\u2026" : "Restore access"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have Pro yet?{" "}
          <Link href="/snapqr/upgrade" className="text-blue-600 hover:underline font-medium">
            See pricing &rarr;
          </Link>
        </p>
      </div>
      </main>
    </div>
  );
}
