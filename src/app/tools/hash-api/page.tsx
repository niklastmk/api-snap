import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash API — SHA-256, MD5 & Cryptographic Hashing via REST API",
  description:
    "Generate SHA-256, SHA-512, MD5, SHA-1, and SHA-3 hashes with a simple API call. Hex or base64 output. Free tier with 100 calls/month.",
  keywords: [
    "hash API", "SHA-256 API", "MD5 API", "hashing API", "cryptographic hash API",
    "SHA-512 API", "free hash API", "hash as a service",
  ],
  openGraph: {
    title: "Hash API — Cryptographic Hashing via REST",
    description: "SHA-256, SHA-512, MD5, SHA-3 and more. One API call. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/hash-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://snapapi.dev/api/hash?text=Hello+World&algorithm=sha256" \\
  -H "Authorization: Bearer snp_your_key"
# {"hash":"a591a6d40bf420...","algorithm":"sha256","encoding":"hex"}`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://snapapi.dev/api/hash?text=verify-me&algorithm=sha512",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const { hash } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://snapapi.dev/api/hash",
    params={"text": "Hello World", "algorithm": "sha3-256", "encoding": "base64"},
    headers={"Authorization": "Bearer snp_your_key"},
)
print(r.json()["hash"])`,
  },
];

export default function HashApiPage() {
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
          SHA-256, SHA-512, MD5, SHA-3
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Cryptographic Hash API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Generate cryptographic hashes with a single GET request. SHA-256, SHA-512, MD5, SHA-1,
          SHA-3 — output as hex or base64. No crypto libraries to install.
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
        <h2 className="text-2xl font-bold mb-6">Supported Algorithms</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {["sha256", "sha512", "sha384", "sha1", "sha3-256", "sha3-512", "md5"].map((alg) => (
            <div key={alg} className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
              <code className="text-indigo-400 font-semibold text-lg">{alg}</code>
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
            { title: "Data integrity", desc: "Verify file or payload integrity with SHA-256 checksums" },
            { title: "Cache busting", desc: "Generate content hashes for cache keys and ETags" },
            { title: "Webhook verification", desc: "Hash webhook payloads to verify authenticity" },
            { title: "Password migration", desc: "Generate hashes during database migrations (use bcrypt for storage)" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Hashing</h2>
        <p className="text-gray-400 mb-8">One API call. Seven algorithms. Zero dependencies.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
            <Link href="/tools/uuid-generator-api" className="hover:text-gray-300 transition">UUID API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
