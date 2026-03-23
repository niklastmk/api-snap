import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 API — Encode & Decode Base64 via REST API",
  description:
    "Encode and decode Base64 and Base64URL strings with a simple API call. Free tier with 100 calls/month. No libraries needed — just HTTP.",
  keywords: [
    "Base64 API", "Base64 encode API", "Base64 decode API", "Base64URL API",
    "encode Base64 REST", "decode Base64 online", "Base64 as a service",
  ],
  openGraph: {
    title: "Base64 API — Encode & Decode via REST",
    description: "Base64 and Base64URL encoding/decoding. One API call. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/base64-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl -X POST "https://snapapi.dev/api/base64" \\
  -H "Authorization: Bearer snp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Hello World", "action": "encode"}'`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch("https://snapapi.dev/api/base64", {
  method: "POST",
  headers: {
    Authorization: "Bearer snp_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ input: "SGVsbG8gV29ybGQ=", action: "decode" }),
});
const { output } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.post(
    "https://snapapi.dev/api/base64",
    json={"input": "Hello World", "action": "encode", "urlSafe": True},
    headers={"Authorization": "Bearer snp_your_key"},
)
print(r.json()["output"])`,
  },
];

export default function Base64ApiPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">SnapAPI</Link>
          <div className="flex gap-4 items-center">
            <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition">
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          Encode & Decode
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Base64 API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Encode and decode Base64 and Base64URL strings with a single POST request.
          No crypto libraries to install — works from any language.
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
        <h2 className="text-2xl font-bold mb-6">Parameters</h2>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Param</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Required</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                { name: "input", req: true, desc: "The string to encode or decode" },
                { name: "action", req: true, desc: '"encode" or "decode"' },
                { name: "urlSafe", req: false, desc: "Use Base64URL variant (default false)" },
              ].map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-3"><code className="text-indigo-400">{p.name}</code></td>
                  <td className="px-4 py-3">{p.req ? <span className="text-yellow-400 text-xs font-semibold">Required</span> : <span className="text-gray-500 text-xs">Optional</span>}</td>
                  <td className="px-4 py-3 text-gray-400">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            { title: "Data URIs", desc: "Encode images and fonts as Base64 data URIs for embedding in HTML and CSS" },
            { title: "API payloads", desc: "Encode binary data for safe transport in JSON API payloads" },
            { title: "JWT handling", desc: "Decode Base64URL-encoded JWT segments for inspection" },
            { title: "Email attachments", desc: "Encode file attachments for MIME email protocols" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Encoding</h2>
        <p className="text-gray-400 mb-8">Base64 and Base64URL. Encode or decode. One API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/hash-api" className="hover:text-gray-300 transition">Hash API</Link>
            <Link href="/tools/jwt-decode-api" className="hover:text-gray-300 transition">JWT Decode API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
