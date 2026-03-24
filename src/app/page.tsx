import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need a credit card to start?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The free tier gives you 100 API calls per month with no credit card required. Just sign up and get your API key instantly.",
      },
    },
    {
      "@type": "Question",
      name: "What are the rate limits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free: 100/mo, Hobby ($9): 5,000/mo, Pro ($29): 50,000/mo, Business ($99): 500,000/mo. All plans include access to every endpoint.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this in production?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Our Pro and Business plans are designed for production workloads with higher rate limits and priority support.",
      },
    },
    {
      "@type": "Question",
      name: "How does authentication work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sign up, create an API key, and include it as a Bearer token in the Authorization header. That's it — one key for all endpoints.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I exceed my limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll get a 429 response with your current usage. Upgrade anytime — changes take effect immediately with no downtime.",
      },
    },
    {
      "@type": "Question",
      name: "Do you support CORS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All API endpoints return proper CORS headers, so you can call them from browser-side JavaScript in any web app.",
      },
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white text-center text-sm py-2 px-4">
        Free tier: 100 calls/month — no credit card required{" "}
        <Link href="/signup" className="underline font-semibold hover:text-indigo-100 ml-1">
          Sign up free &rarr;
        </Link>
      </div>

      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-block rounded-full bg-green-600/10 border border-green-500/20 px-4 py-1.5 text-sm text-green-400 mb-6">
          Start free, no credit card
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Stop Rebuilding
          <br />
          <span className="text-indigo-400">Commodity APIs</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          QR codes, image resizing, hashing, screenshots, PDFs — you&apos;ve built these before.
          Get them all with one API key and one line of code, so you can ship what actually matters.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-6 py-3.5 text-lg font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/snapqr"
            className="rounded-lg border border-gray-700 px-6 py-3.5 text-lg font-medium text-gray-300 hover:border-gray-500 hover:text-white transition"
          >
            Free QR Generator
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          100 API calls/month free forever. Upgrade from $9/mo.
        </p>

        {/* Code example: request + response side by side */}
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-2">Request</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`curl "https://api-snap.com/api/uuid\\
  ?format=nanoid\\
  &count=3\\
  &prefix=usr_" \\
  -H "Authorization: Bearer snp_your_key"`}</code>
            </pre>
          </div>
          <div className="rounded-xl border border-green-800/40 bg-gray-900 p-5 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="ml-1 text-green-400">200 OK</span>
              <span className="ml-auto text-xs text-gray-600">~45ms</span>
            </div>
            <pre className="text-sm text-green-300/90 overflow-x-auto">
              <code>{`{
  "ids": [
    "usr_V1StGXR8_Z5jdHi6B",
    "usr_xkCD2wEzJ9h4Qn3bN",
    "usr_mTv7LRkYp1sNfWc8A"
  ],
  "format": "nanoid",
  "count": 3,
  "prefix": "usr_"
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white">13+</p>
            <p className="text-sm text-gray-400 mt-1">API endpoints</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">100</p>
            <p className="text-sm text-gray-400 mt-1">Free calls/month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3+</p>
            <p className="text-sm text-gray-400 mt-1">API directories listed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">&lt;50ms</p>
            <p className="text-sm text-gray-400 mt-1">Avg response time</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Three Steps to Ship</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Get Your Key", desc: "Sign up in 30 seconds. Free tier, no credit card. Your API key is ready instantly." },
            { step: "2", title: "Call Any Endpoint", desc: "One HTTP request. Bearer token auth. Works from any language, framework, or curl." },
            { step: "3", title: "Ship Your Product", desc: "Focus on your core features. Let API Snap handle the utility functions." },
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

      {/* Language compatibility */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Works With Everything</h2>
        <p className="text-gray-400 mb-10">If it can make HTTP requests, it works with API Snap. One REST API, any language.</p>
        <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm font-medium">
          {["Node.js", "Python", "Go", "Ruby", "PHP", "Rust", "Java", "Swift", "cURL", "Any HTTP Client"].map((lang) => (
            <span key={lang} className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2">
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Open & Transparent</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-lg font-semibold text-white">Public API Directories</p>
            <p className="mt-2 text-sm text-gray-400">Listed on public-apis, APIs.guru, and Apilist.fun — vetted by the community.</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-lg font-semibold text-white">OpenAPI Spec</p>
            <p className="mt-2 text-sm text-gray-400">Full OpenAPI 3.0 spec at <code className="text-indigo-400">/openapi.json</code> — import into Postman, Insomnia, or your SDK generator.</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-lg font-semibold text-white">No Vendor Lock-in</p>
            <p className="mt-2 text-sm text-gray-400">Standard REST. Bearer token auth. JSON responses. Switch away anytime — no proprietary SDKs required.</p>
          </div>
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
        <h2 className="text-3xl font-bold mb-4">Your Next Feature is One API Call Away</h2>
        <p className="text-gray-400 mb-8">
          Sign up, grab your key, and make your first API call — all in under a minute.
          No credit card. No setup. No meetings.
        </p>
        <Link
          href="/signup"
          className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25"
        >
          Create Free Account
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
