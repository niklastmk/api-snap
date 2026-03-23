import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decode API — Decode JSON Web Tokens via REST",
  description:
    "Decode JWT tokens and inspect header, payload, and expiry with a simple API call. Free tier with 100 calls/month. No libraries needed.",
  keywords: [
    "JWT decode API", "decode JWT API", "JSON Web Token API", "JWT inspector API",
    "JWT parser API", "decode JWT online API", "JWT as a service",
  ],
  openGraph: {
    title: "JWT Decode API — Inspect Tokens via REST",
    description: "Decode JWTs and inspect header, payload, claims. One API call. Start free.",
  },
  alternates: { canonical: "/tools/jwt-decode-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl -X POST "https://api-snap.com/api/jwt-decode" \\
  -H "Authorization: Bearer snp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch("https://api-snap.com/api/jwt-decode", {
  method: "POST",
  headers: {
    Authorization: "Bearer snp_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token: jwtString }),
});
const { header, payload, expiresAt } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.post(
    "https://api-snap.com/api/jwt-decode",
    json={"token": jwt_string},
    headers={"Authorization": "Bearer snp_your_key"},
)
data = r.json()
print(f"Algorithm: {data['header']['alg']}")
print(f"Expires: {data['expiresAt']}")`,
  },
];

export default function JwtDecodeApiPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">API Snap</Link>
          <div className="flex gap-4 items-center">
            <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
            <Link href="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition">
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          Decode & Inspect
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          JWT Decode API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Decode JSON Web Tokens and inspect the header, payload, and expiration — all
          with a single POST request. No JWT libraries required.
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
        <h2 className="text-2xl font-bold mb-6">What You Get Back</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Header", desc: "Algorithm (alg), token type (typ), and key ID (kid)" },
            { title: "Payload", desc: "All claims — sub, iss, aud, iat, exp, and custom claims" },
            { title: "Expiry Info", desc: "Parsed expiresAt timestamp and isExpired boolean" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="font-semibold text-indigo-400">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
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

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Debugging auth flows", desc: "Inspect JWT contents during development without installing jwt-decode" },
            { title: "Token monitoring", desc: "Check expiration times in monitoring dashboards and alerting systems" },
            { title: "Admin panels", desc: "Display decoded token info in admin tools for support and debugging" },
            { title: "Webhook verification", desc: "Decode incoming JWT-signed webhooks to inspect claims before verification" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Decoding JWTs</h2>
        <p className="text-gray-400 mb-8">Inspect any JWT — header, payload, and expiry. One API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} API Snap</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/base64-api" className="hover:text-gray-300 transition">Base64 API</Link>
            <Link href="/tools/hash-api" className="hover:text-gray-300 transition">Hash API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
