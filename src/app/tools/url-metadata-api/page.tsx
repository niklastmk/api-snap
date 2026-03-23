import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Metadata API — Extract Open Graph & Meta Tags via REST",
  description:
    "Extract Open Graph tags, title, description, favicon, and images from any URL with a simple GET request. Free tier with 100 calls/month.",
  keywords: [
    "URL metadata API", "Open Graph API", "OG tags API", "link preview API",
    "meta tags API", "URL scraper API", "extract metadata API",
  ],
  openGraph: {
    title: "URL Metadata API — Extract OG Tags via REST",
    description: "Extract Open Graph data, titles, and favicons from any URL. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/url-metadata-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://snapapi.dev/api/meta?url=https://github.com" \\
  -H "Authorization: Bearer snp_your_key"
# {"title":"GitHub","description":"...","og":{"title":"...","image":"..."},"favicon":"..."}`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://snapapi.dev/api/meta?url=https://example.com",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const { title, description, og, favicon } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://snapapi.dev/api/meta",
    params={"url": "https://github.com"},
    headers={"Authorization": "Bearer snp_your_key"},
)
meta = r.json()
print(f"Title: {meta['title']}")
print(f"OG Image: {meta['og']['image']}")`,
  },
];

export default function UrlMetadataApiPage() {
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
          Open Graph & Meta Tags
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          URL Metadata API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Extract Open Graph tags, title, description, favicon, and images from any URL
          with a single GET request. Build link previews in seconds.
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
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Title & Description", desc: "Page title and meta description" },
            { title: "Open Graph", desc: "og:title, og:description, og:image, og:type" },
            { title: "Favicon", desc: "Resolved favicon URL for the domain" },
            { title: "Twitter Cards", desc: "twitter:card, twitter:title, twitter:image" },
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
            { title: "Link previews", desc: "Build rich link preview cards like Slack, Twitter, and iMessage" },
            { title: "SEO auditing", desc: "Check Open Graph and meta tags across pages in your SEO toolkit" },
            { title: "Content aggregation", desc: "Extract titles and descriptions for RSS readers and news aggregators" },
            { title: "Social sharing", desc: "Preview how URLs will appear when shared on social media" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Extracting Metadata</h2>
        <p className="text-gray-400 mb-8">Open Graph, favicons, and more. One GET request per URL.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
            <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
