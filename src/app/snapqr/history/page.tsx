"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getQRHistoryShortCodes } from "@/lib/qr-history";

interface HistoryItem {
  shortCode: string;
  targetUrl: string;
  scans: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem("snapqr_api_key");
    setIsPro(!!apiKey);

    const codes = getQRHistoryShortCodes();

    fetch("/api/snapqr/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ codes }),
    })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/snapqr" className="text-base font-bold text-black tracking-tight">SnapQR</Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <span className="text-black font-medium">My QR Codes</span>
          <Link href="/snapqr/upgrade" className="text-zinc-500 hover:text-zinc-800 transition-colors">Pricing</Link>
          {isPro ? (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Pro</span>
          ) : (
            <Link href="/snapqr/account" className="text-zinc-500 hover:text-zinc-800 transition-colors">Account</Link>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-black mb-1">My QR Codes</h1>
        <p className="text-sm text-zinc-500 mb-8">
          QR codes you&apos;ve generated on this device.
          {!isPro && " Sign up to sync across devices."}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 mb-4">No QR codes yet.</p>
            <Link
              href="/snapqr"
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Generate your first QR code
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.shortCode}
                className="border border-zinc-200 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-300 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/snapqr/qr/${item.shortCode}`}
                  alt={`QR code for ${item.targetUrl}`}
                  width={64}
                  height={64}
                  className="rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{item.targetUrl}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span>{item.scans} {item.scans === 1 ? "scan" : "scans"}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link
                  href={`/s/${item.shortCode}`}
                  className="flex-shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Stats
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        SnapQR by{" "}
        <a href="https://api-snap.com" className="text-zinc-500 hover:text-zinc-700 underline underline-offset-2">API Snap</a>
      </footer>
    </div>
  );
}
