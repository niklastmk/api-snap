import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code API — Generate QR Codes via REST API",
  description:
    "Generate QR codes with a simple GET request. PNG & SVG output, custom colors, sizes up to 1000px. Free tier with 100 calls/month. No SDK needed — works with curl, fetch, or any HTTP client.",
  keywords: [
    "QR code API", "free QR code API", "QR code generator API", "REST API QR code",
    "generate QR code programmatically", "QR code as a service", "QR API",
  ],
  openGraph: {
    title: "Free QR Code API — Generate QR Codes Instantly",
    description: "One GET request. PNG or SVG. Custom colors and sizes. Start free with 100 calls/month.",
  },
  alternates: {
    canonical: "/tools/qr-code-api",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebAPI",
  name: "API Snap QR Code Generator",
  description: "Generate QR codes via REST API — PNG & SVG, custom colors and sizes",
  url: `${baseUrl}/tools/qr-code-api`,
  provider: { "@type": "Organization", name: "API Snap" },
  documentation: `${baseUrl}/docs#qr`,
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://api-snap.com/api/qr?data=https://example.com&size=400" \\
  -H "Authorization: Bearer snp_your_key" -o qr.png`,
  },
  {
    lang: "JavaScript (fetch)",
    code: `const res = await fetch(
  "https://api-snap.com/api/qr?data=https://example.com&size=400&format=svg",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const blob = await res.blob();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://api-snap.com/api/qr",
    params={"data": "https://example.com", "size": 400},
    headers={"Authorization": "Bearer snp_your_key"},
)
with open("qr.png", "wb") as f:
    f.write(r.content)`,
  },
];

export default function QrCodeApiPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          Free tier available
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          QR Code API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Generate QR codes with a single GET request. PNG or SVG output, custom colors,
          sizes up to 1000px. No libraries, no SDKs — just an HTTP call.
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

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-8">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Make a GET request", desc: "Pass your data as a query parameter — a URL, text, or any string up to 4,296 characters." },
            { step: "2", title: "Customize output", desc: "Choose PNG or SVG, set a size (up to 1000px), and pick custom foreground/background colors." },
            { step: "3", title: "Get your QR code", desc: "The API returns the image directly. Save it, serve it, or embed it inline — no extra steps." },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-bold text-indigo-400">{s.step}</div>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parameters */}
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
                { name: "data", req: true, desc: "Text or URL to encode in the QR code" },
                { name: "size", req: false, desc: "Width in pixels, max 1000 (default 300)" },
                { name: "format", req: false, desc: '"png" or "svg" (default "png")' },
                { name: "dark", req: false, desc: "Foreground color hex, e.g. 6366f1 (default 000000)" },
                { name: "light", req: false, desc: "Background color hex (default ffffff)" },
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

      {/* Code examples */}
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

      {/* Use cases */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Payment & receipts", desc: "Embed QR codes in invoices and receipts for quick mobile payments" },
            { title: "Event tickets", desc: "Generate scannable ticket codes for events, boarding passes, or check-ins" },
            { title: "Marketing materials", desc: "Add QR codes to flyers, posters, and print ads linking to your site" },
            { title: "App deep links", desc: "Encode deep links or universal links for mobile app onboarding" },
            { title: "Wi-Fi sharing", desc: "Generate WIFI:T:WPA;S:MyNetwork;P:password;; QR codes for easy network sharing" },
            { title: "Product packaging", desc: "Link physical products to digital content, manuals, or warranty registration" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Pricing</h2>
        <p className="text-gray-400 mb-6">The QR Code API is included in every API Snap plan along with all other endpoints.</p>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { name: "Free", price: "$0", calls: "100/mo" },
            { name: "Hobby", price: "$9/mo", calls: "5,000/mo" },
            { name: "Pro", price: "$29/mo", calls: "50,000/mo", pop: true },
            { name: "Business", price: "$99/mo", calls: "500,000/mo" },
          ].map((p) => (
            <div key={p.name} className={`rounded-xl border p-5 ${p.pop ? "border-indigo-500 bg-indigo-600/10" : "border-gray-800 bg-gray-900"}`}>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-2xl font-bold mt-1">{p.price}</p>
              <p className="text-sm text-gray-400">{p.calls}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Generating QR Codes</h2>
        <p className="text-gray-400 mb-8">Get your API key in 30 seconds. 100 free calls every month.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} API Snap</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
            <Link href="/blog" className="hover:text-gray-300 transition">Blog</Link>
            <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
            <Link href="/tools/image-resize-api" className="hover:text-gray-300 transition">Image Resize API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
