"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GenerateResult {
  shortCode: string;
  qrUrl: string;
  redirectUrl: string;
  statsUrl: string;
}

export default function SnapQRHome() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [demoScans, setDemoScans] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/snapqr/stats?code=sPaleBlu1")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.total != null) setDemoScans(d.total); })
      .catch(() => {});
    const key = localStorage.getItem("snapqr_api_key");
    setIsPro(!!key);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("snapqr_api_key");
    setIsPro(false);
  }

  function handleCopyUrl() {
    if (!result) return;
    navigator.clipboard.writeText(result.redirectUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    try {
      const storedApiKey = typeof window !== "undefined" ? localStorage.getItem("snapqr_api_key") : null;
      const res = await fetch("/api/snapqr/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedApiKey ? { "Authorization": `Bearer ${storedApiKey}` } : {}),
        },
        body: JSON.stringify({ url: url.trim(), ...(email.trim() && { email: email.trim() }) }),
      });

      const data: GenerateResult & { error?: string; upgrade?: boolean } = await res.json();

      if (!res.ok || data.error) {
        if (data.upgrade) {
          setError("");
          setShowUpgrade(true);
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      setShowUpgrade(false);
      setResult(data);
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
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link href="/snapqr/upgrade" className="text-zinc-500 hover:text-zinc-800 transition-colors">Pricing</Link>
          {isPro ? (
            <>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Pro</span>
              <button
                onClick={handleSignOut}
                className="text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/snapqr/account" className="text-zinc-500 hover:text-zinc-800 transition-colors">Account</Link>
          )}
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight mb-3">Know who scans your QR codes</h1>
          <p className="text-zinc-500 text-base max-w-md mx-auto">
            Generate a QR code in seconds. Track every scan — location, device, and time — on a live dashboard. Free, no signup.
          </p>
        </div>

        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any URL — https://example.com"
              className="w-full border border-zinc-300 rounded-xl px-4 py-3.5 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              disabled={loading}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Notify me when someone scans this (optional)"
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm px-1">{error}</p>
            )}
            {showUpgrade && (
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black mb-1">
                      You&apos;re growing! Time to upgrade.
                    </p>
                    <p className="text-sm text-zinc-600 mb-3">
                      You&apos;ve used all 3 free QR codes. Unlock unlimited codes, 30-day analytics, and CSV export with Pro.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href="/snapqr/upgrade"
                        className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Upgrade to Pro — $7/mo
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowUpgrade(false)}
                        className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating your QR code...
                </span>
              ) : (
                "Generate QR Code"
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 border border-zinc-200 rounded-2xl p-6 flex flex-col items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/snapqr/qr/${result.shortCode}`}
                alt="Your QR code"
                width={200}
                height={200}
                className="rounded-lg shadow-sm"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                <a
                  href={`/api/snapqr/qr/${result.shortCode}`}
                  download={`snapqr-${result.shortCode}.png`}
                  className="inline-flex items-center justify-center bg-black text-white font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                >
                  Download PNG
                </a>
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center justify-center border border-zinc-200 text-zinc-700 font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
                <Link
                  href={`/s/${result.shortCode}`}
                  className="inline-flex items-center justify-center border border-zinc-200 text-zinc-700 font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  View analytics
                </Link>
              </div>
            </div>
          )}
        </div>

        {!result && (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 max-w-lg w-full">
              {[
                { icon: "\u26A1", title: "Instant", desc: "Paste a URL, get a QR code" },
                { icon: "\uD83D\uDCCA", title: "Trackable", desc: "See every scan in real time" },
                { icon: "\u2728", title: "Free", desc: "No signup, no credit card" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 text-center sm:text-center px-3 py-2.5 sm:px-2 sm:py-2 rounded-lg">
                  <div className="text-xl sm:mb-1">{icon}</div>
                  <div className="text-left sm:text-center">
                    <span className="text-sm font-semibold text-black">{title}</span>
                    <p className="text-xs text-zinc-500 mt-0 sm:mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {demoScans !== null && (
              <div className="mt-12 w-full max-w-lg border border-zinc-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/snapqr/qr/sPaleBlu1"
                  alt="Demo QR code"
                  width={100}
                  height={100}
                  className="rounded-lg shadow-sm flex-shrink-0 sm:w-[120px] sm:h-[120px]"
                />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Live demo</p>
                  <div className="text-3xl font-bold text-black">{demoScans.toLocaleString()} scans</div>
                  <p className="text-sm text-zinc-500 mt-1 mb-3">
                    Scan this code or tap below to see analytics in action.
                  </p>
                  <Link
                    href="/s/sPaleBlu1"
                    className="inline-flex items-center justify-center border border-zinc-200 text-zinc-700 font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                  >
                    View live dashboard &rarr;
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        SnapQR by{" "}
        <a href="https://api-snap.com" className="text-zinc-500 hover:text-zinc-700 underline underline-offset-2">API Snap</a>
      </footer>
    </div>
  );
}
