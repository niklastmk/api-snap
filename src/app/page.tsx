import Link from "next/link";

const endpoints = [
  {
    name: "QR Code Generation",
    method: "GET",
    path: "/api/qr",
    desc: "Generate QR codes in PNG or SVG with custom colors and sizes",
    example: '/api/qr?data=https://example.com&size=300&format=png',
  },
  {
    name: "Placeholder Images",
    method: "GET",
    path: "/api/placeholder",
    desc: "Generate placeholder images with custom dimensions and colors",
    example: "/api/placeholder?w=400&h=300&bg=4f46e5&fg=ffffff&text=Hero",
  },
  {
    name: "Screenshot Capture",
    method: "GET",
    path: "/api/screenshot",
    desc: "Capture full-page screenshots of any URL as SVG",
    example: "/api/screenshot?url=https://example.com&width=1280",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold text-white">
            ⚡ SnapAPI
          </span>
          <div className="flex gap-4 items-center">
            <Link
              href="/docs"
              className="text-gray-400 hover:text-white transition"
            >
              Docs
            </Link>
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-white transition"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Developer APIs
          <br />
          <span className="text-indigo-400">Made Simple</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          QR codes, placeholder images, screenshots, and more.
          One API key. Simple pricing. Instant access. No complex setup.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-500 transition"
          >
            Start Free — 100 calls/month
          </Link>
          <Link
            href="#endpoints"
            className="rounded-lg border border-gray-700 px-6 py-3 text-lg font-medium text-gray-300 hover:border-gray-500 transition"
          >
            View Endpoints
          </Link>
        </div>

        {/* Code example */}
        <div className="mt-16 rounded-xl border border-gray-800 bg-gray-900 p-6 text-left">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="ml-2">Quick Start</span>
          </div>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`# Generate a QR code
curl "https://snapapi.dev/api/qr?data=Hello+World&size=400" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -o qr.png

# Generate a placeholder image
curl "https://snapapi.dev/api/placeholder?w=600&h=400&text=Hero" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -o placeholder.svg`}</code>
          </pre>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">API Endpoints</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded bg-indigo-600/20 px-2 py-1 text-xs font-mono text-indigo-400">
                  {ep.method}
                </span>
                <code className="text-sm text-gray-300">{ep.path}</code>
              </div>
              <h3 className="text-lg font-semibold text-white">{ep.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{ep.desc}</p>
              <pre className="mt-3 rounded bg-gray-800 p-3 text-xs text-gray-400 overflow-x-auto">
                {ep.example}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Predictable Pricing</h2>
        <p className="text-gray-400 mb-8">
          Start free. Scale as you grow. No surprises.
        </p>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { name: "Free", price: "$0", calls: "100/mo" },
            { name: "Hobby", price: "$9/mo", calls: "5,000/mo" },
            { name: "Pro", price: "$29/mo", calls: "50,000/mo", popular: true },
            { name: "Business", price: "$99/mo", calls: "500,000/mo" },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-6 ${
                p.popular
                  ? "border-indigo-500 bg-indigo-600/10"
                  : "border-gray-800 bg-gray-900"
              }`}
            >
              {p.popular && (
                <span className="text-xs font-semibold text-indigo-400 mb-2 block">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-2xl font-bold mt-2">{p.price}</p>
              <p className="text-sm text-gray-400 mt-1">{p.calls}</p>
            </div>
          ))}
        </div>
        <Link
          href="/pricing"
          className="mt-8 inline-block text-indigo-400 hover:text-indigo-300"
        >
          View full pricing details →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SnapAPI. All rights reserved.
      </footer>
    </div>
  );
}
