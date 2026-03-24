"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface GenerateResult {
  shortCode: string;
  qrUrl: string;
  redirectUrl: string;
  statsUrl: string;
}

export default function QRGeneratorPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = url.trim();
    if (!input) return;

    const fullUrl = /^https?:\/\//i.test(input) ? input : `https://${input}`;

    setLoading(true);
    setError("");
    setResult(null);
    setLimitReached(false);

    try {
      const res = await fetch("/api/snapqr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgrade) {
          setLimitReached(true);
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      setResult(data as GenerateResult);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Nav current="/qr" />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-block rounded-full bg-green-600/10 border border-green-500/20 px-4 py-1.5 text-sm text-green-400 mb-6">
            Free &mdash; no signup required
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            QR Code Generator
            <br />
            <span className="text-indigo-400">with Scan Analytics</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Paste any URL and get a trackable QR code instantly. See who scans
            it &mdash; device, browser, location, and more. No account needed.
          </p>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-site.com"
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 max-w-xl mx-auto rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Rate limit */}
        {limitReached && (
          <div className="mt-6 max-w-xl mx-auto rounded-xl border-2 border-indigo-500 bg-indigo-600/10 p-6 text-center">
            <p className="text-base font-semibold text-white mb-1">
              Free limit reached
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Free usage allows 3 QR codes (lifetime). Sign up for a free API key
              to get 100 calls/month across all endpoints.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Sign Up Free &mdash; No Credit Card
            </Link>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-10 max-w-xl mx-auto">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 flex flex-col items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/snapqr/qr/${result.shortCode}`}
                alt="Your QR code"
                width={250}
                height={250}
                className="rounded-lg"
              />

              <div className="flex gap-3 w-full flex-wrap justify-center">
                <a
                  href={`/api/snapqr/qr/${result.shortCode}`}
                  download={`qr-${result.shortCode}.png`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center rounded-lg bg-white text-gray-900 font-medium px-4 py-2.5 hover:bg-gray-200 transition text-sm"
                >
                  Download PNG
                </a>
                <Link
                  href={`/s/${result.shortCode}`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center rounded-lg border border-gray-700 text-gray-300 font-medium px-4 py-2.5 hover:border-gray-500 hover:text-white transition text-sm"
                >
                  View Scan Analytics
                </Link>
              </div>

              <p className="text-xs text-gray-500">
                Redirect URL:{" "}
                <code className="text-gray-400">{result.redirectUrl}</code>
              </p>
            </div>

            {/* API equivalent */}
            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Build this into your app
              </p>
              <pre className="text-sm text-green-400 overflow-x-auto">
                <code>{`curl -X POST "https://api-snap.com/api/snapqr/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${url.trim()}"}'`}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Features */}
        {!result && (
          <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            {[
              {
                title: "Instant QR Codes",
                desc: "Generate a trackable QR code for any URL in under a second.",
              },
              {
                title: "Scan Analytics",
                desc: "See every scan in real time — device, browser, OS, country, and more.",
              },
              {
                title: "No Signup Needed",
                desc: "Start generating right away. 5 free QR codes per day, no account required.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center"
              >
                <h3 className="text-base font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Need QR codes in your app?
          </h2>
          <p className="mt-2 text-gray-400 max-w-lg mx-auto">
            Use the API Snap QR endpoint to generate QR codes programmatically.
            One API key, 13+ endpoints including QR codes, screenshots, image
            resize, and more.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-500 transition"
            >
              Get Free API Key
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-gray-700 px-8 py-3 text-base font-medium text-gray-300 hover:border-gray-500 transition"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
