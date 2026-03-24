"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ApiKeyInfo {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
}

interface UsageInfo {
  plan: string;
  usage: number;
  limit: number;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgraded, setUpgraded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
    if (searchParams.get("upgraded") === "true") {
      setUpgraded(true);
    }
  }, [searchParams]);

  async function fetchData() {
    const [keysRes, usageRes] = await Promise.all([
      fetch("/api/keys"),
      fetch("/api/usage"),
    ]);

    if (keysRes.status === 401 || usageRes.status === 401) {
      router.push("/login");
      return;
    }

    const keysData = await keysRes.json();
    const usageData = await usageRes.json();

    setKeys(keysData.keys || []);
    setUsage(usageData);
    setLoading(false);
  }

  async function createKey() {
    if (!newKeyName.trim()) return;

    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });

    const data = await res.json();
    setNewKey(data.key);
    setNewKeyName("");
    fetchData();
  }

  async function deleteKey(id: string) {
    await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const usagePercent = usage ? Math.min((usage.usage / usage.limit) * 100, 100) : 0;
  const remaining = usage ? usage.limit - usage.usage : 0;

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            API Snap
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition">Docs</Link>
            <Link href="/playground" className="text-sm text-gray-400 hover:text-white transition">Playground</Link>
            <span className="rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-medium text-indigo-400 uppercase">
              {usage?.plan || "free"}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Upgrade success banner */}
        {upgraded && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-green-400">
                  Welcome to {usage?.plan ? usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1) : "your new plan"}!
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Your plan has been upgraded successfully. You now have {usage?.limit.toLocaleString()} API calls per month.
                </p>
              </div>
              <button
                onClick={() => setUpgraded(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Upgrade nudge — shown when usage >= 80% on free/hobby plans */}
        {usage && usagePercent >= 80 && (usage.plan === "free" || usage.plan === "hobby") && (
          <div className={`rounded-xl border p-5 mb-8 ${
            usagePercent >= 100
              ? "border-red-500/40 bg-red-500/10"
              : usagePercent >= 90
              ? "border-orange-500/40 bg-orange-500/10"
              : "border-yellow-500/30 bg-yellow-500/10"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {usagePercent >= 100 && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  )}
                  <h3 className={`font-semibold ${
                    usagePercent >= 100 ? "text-red-400"
                    : usagePercent >= 90 ? "text-orange-400"
                    : "text-yellow-400"
                  }`}>
                    {usagePercent >= 100
                      ? "You're at your monthly limit — upgrade to keep building"
                      : usagePercent >= 90
                      ? `Critical: only ${remaining.toLocaleString()} calls left this month`
                      : `Heads up: ${usagePercent.toFixed(0)}% of your monthly quota used`}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  {usagePercent >= 100
                    ? `Your ${usage.limit} free calls are used up. Every request returns a 429 until you upgrade.`
                    : usagePercent >= 90
                    ? `You have ${remaining.toLocaleString()} calls left before your API goes dark. Upgrade takes 30 seconds.`
                    : `You're close to your ${usage.limit.toLocaleString()}-call limit. Upgrade now to avoid downtime.`}
                </p>
                {usage.plan === "free" && (
                  <p className="text-xs text-gray-500 mt-2">
                    Hobby plan ($9/mo) gives you 5,000 calls — 50× your current limit.
                  </p>
                )}
                {usage.plan === "hobby" && (
                  <p className="text-xs text-gray-500 mt-2">
                    Pro plan ($29/mo) gives you 50,000 calls — 10× your current limit.
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Link
                  href={usagePercent >= 100 ? "/dashboard/billing?plan=hobby" : "/dashboard/billing"}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition whitespace-nowrap ${
                    usagePercent >= 100
                      ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20"
                      : usagePercent >= 90
                      ? "bg-orange-600 hover:bg-orange-500"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {usagePercent >= 100 ? "Upgrade to Hobby — $9/mo" : "Upgrade to Pro"}
                </Link>
                <Link href="/pricing" className="text-xs text-gray-500 hover:text-gray-400">
                  Compare plans
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Usage */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Usage</h2>
            {usage && (usage.plan === "free" || usage.plan === "hobby") && (
              <Link
                href="/dashboard/billing"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Upgrade plan →
              </Link>
            )}
          </div>
          {usage && (
            <>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{usage.usage.toLocaleString()} requests</span>
                <span>{usage.limit.toLocaleString()} limit</span>
              </div>
              <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent > 90
                      ? "bg-red-500"
                      : usagePercent > 70
                      ? "bg-yellow-500"
                      : "bg-indigo-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {remaining > 0
                  ? `${remaining.toLocaleString()} calls remaining this billing period`
                  : <><span className="text-red-400 font-medium">Quota exhausted.</span>{" "}<Link href="/dashboard/billing" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Upgrade now</Link> to continue using the API.</>}
              </p>
            </>
          )}
        </div>

        {/* New Key Alert */}
        {newKey && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 mb-8">
            <h3 className="font-semibold text-green-400 mb-2">
              New API Key Created
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Copy this key now — you won&apos;t be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-gray-800 px-4 py-2 text-sm text-green-300 font-mono">
                {newKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newKey);
                }}
                className="rounded bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600 transition"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setNewKey(null)}
              className="mt-3 text-sm text-gray-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Key */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create API Key</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., Production, Testing)"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && createKey()}
            />
            <button
              onClick={createKey}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-500 transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Keys List */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Your API Keys</h2>
          {keys.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No API keys yet. Create one above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-white">{k.name}</div>
                    <code className="text-sm text-gray-400">{k.key}</code>
                  </div>
                  <button
                    onClick={() => deleteKey(k.id)}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <pre className="rounded-lg bg-gray-800 p-4 text-sm text-gray-300 overflow-x-auto">
            <code>{`# Generate a QR code
curl "${typeof window !== "undefined" ? window.location.origin : ""}/api/qr?data=https://example.com" \\
  -H "Authorization: Bearer YOUR_API_KEY" -o qr.png

# Generate a placeholder image
curl "${typeof window !== "undefined" ? window.location.origin : ""}/api/placeholder?w=600&h=400&text=Hello" \\
  -H "Authorization: Bearer YOUR_API_KEY" -o placeholder.svg

# Take a screenshot
curl "${typeof window !== "undefined" ? window.location.origin : ""}/api/screenshot?url=https://example.com" \\
  -H "Authorization: Bearer YOUR_API_KEY" -o screenshot.svg`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
