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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/snapqr" className="text-2xl font-bold text-black">SnapQR</Link>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-black mb-1">My Account</h1>
          <p className="text-zinc-500 text-sm mb-6">Enter your email to restore Pro access in this browser.</p>

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
            </div>
          ) : status === "not_found" ? (
            <div className="text-center">
              <p className="text-zinc-600 text-sm mb-4">No Pro account found for that email. <Link href="/snapqr/upgrade" className="text-blue-600 hover:underline">Upgrade now &rarr;</Link></p>
              <button onClick={() => setStatus("idle")} className="text-sm text-zinc-500 hover:underline">Try again</button>
            </div>
          ) : (
            <>
              {isPro && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm text-green-700">
                  Pro access is active in this browser.
                </div>
              )}
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleLookup}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
              >
                {loading ? "Looking up\u2026" : "Restore Pro access"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          <Link href="/snapqr" className="text-blue-600 hover:underline">&larr; Back to SnapQR</Link>
        </p>
      </div>
    </div>
  );
}
