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
    name: "Hash Generation",
    method: "GET",
    path: "/api/hash",
    desc: "SHA-256, SHA-512, MD5, and more. Hex or base64 output",
    example: '/api/hash?text=hello&algorithm=sha256',
  },
  {
    name: "UUID / ID Generation",
    method: "GET",
    path: "/api/uuid",
    desc: "UUIDs, nanoids, hex tokens, timestamps, and more",
    example: "/api/uuid?format=nanoid&count=5&prefix=usr_",
  },
  {
    name: "Image Resize & Convert",
    method: "POST",
    path: "/api/resize",
    desc: "Resize, crop, convert images to PNG, WebP, JPEG, or AVIF",
    example: 'POST /api/resize { "url": "...", "width": 400, "format": "webp" }',
  },
  {
    name: "Base64 Encode/Decode",
    method: "POST",
    path: "/api/base64",
    desc: "Encode or decode Base64 and Base64URL strings",
    example: 'POST /api/base64 { "input": "Hello", "action": "encode" }',
  },
  {
    name: "URL Metadata / OG Tags",
    method: "GET",
    path: "/api/meta",
    desc: "Extract Open Graph, title, description, favicon from any URL",
    example: '/api/meta?url=https://github.com',
  },
  {
    name: "JWT Decode",
    method: "POST",
    path: "/api/jwt-decode",
    desc: "Decode JWT tokens — inspect header, payload, and expiry",
    example: 'POST /api/jwt-decode { "token": "eyJhbGci..." }',
  },
  {
    name: "Color Conversion",
    method: "GET",
    path: "/api/color",
    desc: "Convert between hex, RGB, HSL with brightness detection",
    example: "/api/color?color=6366f1",
  },
  {
    name: "Placeholder Images",
    method: "GET",
    path: "/api/placeholder",
    desc: "SVG placeholder images with custom dimensions and colors",
    example: "/api/placeholder?w=400&h=300&bg=4f46e5&text=Hero",
  },
  {
    name: "Lorem Ipsum",
    method: "GET",
    path: "/api/lorem",
    desc: "Generate placeholder text — paragraphs, sentences, text or HTML",
    example: "/api/lorem?paragraphs=3&sentences=5",
  },
  {
    name: "Markdown to HTML",
    method: "POST",
    path: "/api/markdown",
    desc: "Convert Markdown to styled HTML — perfect for rendering content",
    example: 'POST /api/markdown { "markdown": "# Hello" }',
  },
  {
    name: "HTML to PDF",
    method: "POST",
    path: "/api/pdf",
    desc: "Convert HTML content to downloadable PDF documents",
    example: 'POST /api/pdf { "html": "<h1>Invoice</h1>", "title": "Invoice" }',
  },
  {
    name: "Screenshot Capture",
    method: "GET",
    path: "/api/screenshot",
    desc: "Capture full-page screenshots of any URL",
    example: "/api/screenshot?url=https://example.com&width=1280",
  },
];

const useCases = [
  { title: "Generate QR codes", desc: "For receipts, tickets, and mobile deep links", icon: "grid" },
  { title: "Resize user uploads", desc: "Create thumbnails and optimized images on the fly", icon: "image" },
  { title: "Extract link previews", desc: "Build rich social cards for your app or CMS", icon: "link" },
  { title: "Generate unique IDs", desc: "Prefixed nanoids and UUIDs for database records", icon: "key" },
  { title: "Hash sensitive data", desc: "SHA-256 checksums for integrity verification", icon: "lock" },
  { title: "Render Markdown", desc: "Convert user content to HTML for display", icon: "doc" },
];

const faqs = [
  { q: "Do I need a credit card to start?", a: "No. The free tier gives you 100 API calls per month with no credit card required. Just sign up and get your API key instantly." },
  { q: "What are the rate limits?", a: "Free: 100/mo, Hobby ($9): 5,000/mo, Pro ($29): 50,000/mo, Business ($99): 500,000/mo. All plans include access to every endpoint." },
  { q: "Can I use this in production?", a: "Absolutely. Our Pro and Business plans are designed for production workloads with higher rate limits and priority support." },
  { q: "How does authentication work?", a: "Sign up, create an API key, and include it as a Bearer token in the Authorization header. That's it — one key for all endpoints." },
  { q: "What happens if I exceed my limit?", a: "You'll get a 429 response with your current usage. Upgrade anytime — changes take effect immediately with no downtime." },
  { q: "Do you support CORS?", a: "Yes. All API endpoints return proper CORS headers, so you can call them from browser-side JavaScript in any web app." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold text-white">SnapAPI</span>
          <div className="flex gap-4 items-center">
            <Link href="/playground" className="text-gray-400 hover:text-white transition">
              Playground
            </Link>
            <Link href="/docs" className="text-gray-400 hover:text-white transition">
              Docs
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white transition">
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
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          13+ utility APIs. One key. Zero infrastructure.
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Ship Faster with
          <br />
          <span className="text-indigo-400">Ready-Made APIs</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Stop building QR generators, image resizers, and hash functions from scratch.
          Integrate in 30 seconds. Focus on what makes your product unique.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-500 transition"
          >
            Start Free — 100 calls/month
          </Link>
          <Link
            href="/playground"
            className="rounded-lg border border-gray-700 px-6 py-3 text-lg font-medium text-gray-300 hover:border-gray-500 transition"
          >
            Try the Playground
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

# Hash a string
curl "https://snapapi.dev/api/hash?text=my-secret&algorithm=sha256" \\
  -H "Authorization: Bearer snp_your_api_key"

# Generate unique IDs
curl "https://snapapi.dev/api/uuid?format=nanoid&count=10&prefix=usr_" \\
  -H "Authorization: Bearer snp_your_api_key"`}</code>
          </pre>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Three Steps to Ship</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Get Your Key", desc: "Sign up in 30 seconds. Free tier, no credit card. Your API key is ready instantly." },
            { step: "2", title: "Call Any Endpoint", desc: "One HTTP request. Bearer token auth. Works from any language, framework, or curl." },
            { step: "3", title: "Ship Your Product", desc: "Focus on your core features. Let SnapAPI handle the utility functions." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-xl font-bold text-indigo-400">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">13+ API Endpoints</h2>
        <p className="text-center text-gray-400 mb-12">Every endpoint works with a single API key. No extra setup.</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition"
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
        <div className="text-center mt-8">
          <Link href="/playground" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
            Try them all in the Playground →
          </Link>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Built for Real Use Cases</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="text-lg font-semibold text-white">{uc.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Built for Developers Who Ship</h2>
        <p className="text-gray-400 mb-10">Works with every language and framework. If it can make HTTP requests, it works with SnapAPI.</p>
        <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm font-medium">
          {["Node.js", "Python", "Go", "Ruby", "PHP", "Rust", "Java", "Swift", "cURL", "Any HTTP Client"].map((lang) => (
            <span key={lang} className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2">
              {lang}
            </span>
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Ship Faster?</h2>
        <p className="text-gray-400 mb-8">
          Get your API key in 30 seconds. 100 free calls every month, forever.
        </p>
        <Link
          href="/signup"
          className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition"
        >
          Get Your Free API Key
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start justify-between gap-8 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/playground" className="hover:text-gray-300 transition">Playground</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
            <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
            <Link href="/tools/image-resize-api" className="hover:text-gray-300 transition">Image Resize API</Link>
            <Link href="/tools/uuid-generator-api" className="hover:text-gray-300 transition">UUID API</Link>
            <Link href="/tools/hash-api" className="hover:text-gray-300 transition">Hash API</Link>
            <Link href="/tools/base64-api" className="hover:text-gray-300 transition">Base64 API</Link>
            <Link href="/tools/url-metadata-api" className="hover:text-gray-300 transition">Metadata API</Link>
            <Link href="/tools/html-to-pdf-api" className="hover:text-gray-300 transition">PDF API</Link>
            <Link href="/tools/markdown-to-html-api" className="hover:text-gray-300 transition">Markdown API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
