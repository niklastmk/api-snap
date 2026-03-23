"use client";

import { useState } from "react";
import Link from "next/link";

type DemoMode = "qr" | "meta";

interface MetaResult {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
}

interface QrResult {
  data: string;
  size: number;
  imageDataUrl: string;
}

export default function TryPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<DemoMode>("qr");
  const [loading, setLoading] = useState(false);
  const [qrResult, setQrResult] = useState<QrResult | null>(null);
  const [metaResult, setMetaResult] = useState<MetaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = url.trim();
    if (!input) return;

    // Ensure URL has protocol
    const fullUrl = /^https?:\/\//i.test(input) ? input : `https://${input}`;

    setLoading(true);
    setError(null);
    setQrResult(null);
    setMetaResult(null);

    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: mode,
          params: mode === "qr" ? { data: fullUrl, size: 300 } : { url: fullUrl },
        }),
      });

      const remainingHeader = res.headers.get("X-Playground-Remaining");
      if (remainingHeader !== null) setRemaining(Number(remainingHeader));

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (mode === "qr") {
        setQrResult(data as QrResult);
      } else {
        setMetaResult(data as MetaResult);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white">
            API Snap
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/playground"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Full Playground
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Try it. <span className="text-indigo-400">Right now.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Enter any URL and get a live API response in seconds. No signup, no API key.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mt-10 flex justify-center gap-2">
          <button
            onClick={() => { setMode("qr"); setQrResult(null); setMetaResult(null); setError(null); }}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              mode === "qr"
                ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                : "text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white"
            }`}
          >
            Generate QR Code
          </button>
          <button
            onClick={() => { setMode("meta"); setQrResult(null); setMetaResult(null); setError(null); }}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              mode === "meta"
                ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                : "text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white"
            }`}
          >
            Extract Metadata
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={mode === "qr" ? "https://your-site.com" : "https://github.com"}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-base text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Working..." : mode === "qr" ? "Generate" : "Extract"}
            </button>
          </div>
        </form>

        {/* Rate limit indicator */}
        {remaining !== null && (
          <p className="mt-3 text-center text-xs text-gray-500">
            {remaining} demo {remaining === 1 ? "call" : "calls"} remaining this hour
            {remaining <= 5 && (
              <span className="text-gray-400">
                {" "}— <Link href="/signup" className="text-indigo-400 hover:underline">sign up free</Link> for 100/month
              </span>
            )}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-300">
            {error}
            {error.includes("rate limit") && (
              <p className="mt-2">
                <Link href="/signup" className="text-indigo-400 hover:underline font-medium">
                  Sign up free
                </Link>{" "}
                to get 100 API calls/month with your own key.
              </p>
            )}
          </div>
        )}

        {/* QR Result */}
        {qrResult && (
          <div className="mt-8 flex flex-col items-center">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
              <img
                src={qrResult.imageDataUrl}
                alt={`QR code for ${qrResult.data}`}
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              QR code for <span className="text-gray-300">{qrResult.data}</span>
            </p>

            {/* API equivalent */}
            <div className="mt-6 w-full rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                API Equivalent
              </p>
              <code className="block text-sm text-green-400 break-all">
                GET /api/qr?data={encodeURIComponent(qrResult.data)}&size=300
              </code>
            </div>
          </div>
        )}

        {/* Meta Result */}
        {metaResult && (
          <div className="mt-8">
            <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              {/* Preview card */}
              {metaResult.image && (
                <img
                  src={metaResult.image}
                  alt=""
                  className="w-full h-48 object-cover border-b border-gray-800"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {metaResult.favicon && (
                    <img src={metaResult.favicon} alt="" className="h-5 w-5 rounded" />
                  )}
                  {metaResult.siteName && (
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {metaResult.siteName}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {metaResult.title || "No title found"}
                </h3>
                {metaResult.description && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                    {metaResult.description}
                  </p>
                )}
              </div>
            </div>

            {/* Raw JSON */}
            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                JSON Response
              </p>
              <pre className="text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(metaResult, null, 2)}
              </pre>
            </div>

            {/* API equivalent */}
            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                API Equivalent
              </p>
              <code className="block text-sm text-green-400 break-all">
                GET /api/meta?url={encodeURIComponent(metaResult.url)}
              </code>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Want more?</h2>
          <p className="mt-2 text-gray-400">
            Get your own API key with 100 free calls/month. Access 13+ endpoints — QR codes, screenshots, image resize, hashing, and more.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-500 transition"
            >
              Sign Up Free
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
    </div>
  );
}
