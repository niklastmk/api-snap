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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [demoScans, setDemoScans] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/snapqr/stats?code=demo")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.total != null) setDemoScans(d.total); })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

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
        body: JSON.stringify({ url: url.trim() }),
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
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/snapqr" className="text-base font-bold text-black tracking-tight">SnapQR</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/snapqr/upgrade" className="text-zinc-500 hover:text-zinc-800 transition-colors">Pricing</Link>
          <Link href="/snapqr/account" className="text-zinc-500 hover:text-zinc-800 transition-colors">My account</Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-2">SnapQR</h1>
          <p className="text-zinc-500 text-base">
            Free QR codes with real-time scan analytics
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
            {error && (
              <p className="text-red-500 text-sm px-1">{error}</p>
            )}
            {showUpgrade && (
              <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-black mb-1">
                  Free limit reached
                </p>
                <p className="text-sm text-zinc-600 mb-3">
                  Free accounts can generate 3 QR codes, lifetime. Upgrade for unlimited.
                </p>
                <Link
                  href="/snapqr/upgrade"
                  className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Upgrade to QR Pro &mdash; $7/mo
                </Link>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate QR Code"}
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

              <div className="flex gap-3 w-full flex-wrap justify-center">
                <a
                  href={`/api/snapqr/qr/${result.shortCode}`}
                  download={`snapqr-${result.shortCode}.png`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center bg-black text-white font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                >
                  Download PNG
                </a>
                <Link
                  href={`/s/${result.shortCode}`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center border border-zinc-200 text-zinc-700 font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  View analytics
                </Link>
              </div>

              <div className="w-full text-center">
                <p className="text-xs text-zinc-400">
                  Track scans at{" "}
                  <Link
                    href={`/s/${result.shortCode}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    /s/{result.shortCode}
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {!result && (
          <>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg w-full text-center">
              {[
                { icon: "\u26A1", label: "Instant generation" },
                { icon: "\uD83D\uDCCA", label: "Real-time scan tracking" },
                { icon: "\uD83C\uDD93", label: "Always free to use" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs text-zinc-500 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {demoScans !== null && (
              <div className="mt-12 w-full max-w-lg border border-zinc-200 rounded-2xl p-6 flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/snapqr/qr/demo"
                  alt="Demo QR code"
                  width={160}
                  height={160}
                  className="rounded-lg shadow-sm"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{demoScans.toLocaleString()} scans</div>
                  <p className="text-sm text-zinc-500 mt-1">and counting</p>
                </div>
                <p className="text-xs text-zinc-400 text-center max-w-xs">
                  This QR was generated with SnapQR &mdash; scan it to see live analytics.
                </p>
                <Link
                  href="/s/demo"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View live analytics &rarr;
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        Powered by SnapQR &mdash;{" "}
        <Link href="/s/demo" className="text-blue-600 hover:underline">
          See what live analytics look like &rarr;
        </Link>
        {" "}&mdash;{" "}
        Already subscribed?{" "}
        <Link href="/snapqr/account" className="text-blue-600 hover:underline">
          Find my account &rarr;
        </Link>
      </footer>
    </div>
  );
}
