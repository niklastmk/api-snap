"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            ⚡ SnapAPI
          </Link>
          <div className="flex items-center gap-4">
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

        {/* Usage */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Usage</h2>
            {usage && usage.plan === "free" && (
              <Link
                href="/pricing"
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
