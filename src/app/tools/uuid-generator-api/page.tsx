import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "UUID Generator API — Generate UUIDs, Nanoids & Unique IDs via REST",
  description:
    "Generate UUIDs, nanoids, hex tokens, and prefixed IDs with a simple GET request. Batch generation up to 100 IDs. Free tier with 100 calls/month.",
  keywords: [
    "UUID generator API", "UUID API", "nanoid API", "unique ID API", "generate UUID API",
    "random ID generator API", "free UUID API", "ID generation service",
  ],
  openGraph: {
    title: "UUID Generator API — UUIDs, Nanoids & More",
    description: "Generate unique IDs via REST API. UUIDs, nanoids, hex tokens, custom prefixes. Start free.",
  },
  alternates: { canonical: "/tools/uuid-generator-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `# Single UUID
curl "https://api-snap.com/api/uuid" -H "Authorization: Bearer snp_your_key"

# 10 prefixed nanoids
curl "https://api-snap.com/api/uuid?format=nanoid&count=10&prefix=usr_" \\
  -H "Authorization: Bearer snp_your_key"`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://api-snap.com/api/uuid?format=nanoid&count=5&prefix=txn_",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const { ids } = await res.json();
// ["txn_V1StGXR8_Z5jdHi6B-myT", ...]`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://api-snap.com/api/uuid",
    params={"format": "nanoid", "count": 5, "prefix": "order_"},
    headers={"Authorization": "Bearer snp_your_key"},
)
ids = r.json()["ids"]`,
  },
];

export default function UuidApiPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          UUIDs, Nanoids, Hex Tokens & more
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          UUID &amp; ID Generator API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Generate unique identifiers with a single GET request. UUIDs, nanoids, hex tokens,
          numeric IDs, timestamps — with optional prefixes and batch generation up to 100.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="rounded-lg bg-indigo-600 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-500 transition text-center">
            Start Free — 100 calls/month
          </Link>
          <Link href="/playground" className="rounded-lg border border-gray-700 px-6 py-3 text-lg font-medium text-gray-300 hover:border-gray-500 transition text-center">
            Try in Playground
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Supported Formats</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "uuid / v4", desc: "Standard UUID v4 — 36 character hex with dashes" },
            { name: "nanoid", desc: "21-character URL-safe random ID (A-Za-z0-9_-)" },
            { name: "nanoid-short", desc: "12-character compact nanoid for short URLs" },
            { name: "hex", desc: "32-character random hex string" },
            { name: "base64", desc: "22-character random base64url string" },
            { name: "numeric", desc: "18-digit random numeric string" },
            { name: "timestamp", desc: "Millisecond Unix timestamp as ID" },
          ].map((f) => (
            <div key={f.name} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <code className="text-indigo-400 font-semibold">{f.name}</code>
              <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
        <div className="space-y-6">
          {codeExamples.map((ex) => (
            <div key={ex.lang}>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">{ex.lang}</h3>
              <pre className="rounded-xl bg-gray-900 border border-gray-800 p-5 text-sm text-gray-300 overflow-x-auto">
                <code>{ex.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Generating IDs</h2>
        <p className="text-gray-400 mb-8">No crypto libraries needed. Just an API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <Footer />
    </div>
  );
}
