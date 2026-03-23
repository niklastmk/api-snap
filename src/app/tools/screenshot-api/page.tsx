import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Screenshot API — Capture Website Screenshots via REST API",
  description:
    "Capture full-page website screenshots with a simple GET request. Custom viewport sizes, SVG output. Free tier with 100 calls/month. No browser dependencies needed.",
  keywords: [
    "screenshot API", "website screenshot API", "capture screenshot API", "URL to image API",
    "website thumbnail API", "page screenshot service", "free screenshot API",
  ],
  openGraph: {
    title: "Screenshot API — Capture Any Website Instantly",
    description: "One GET request to capture any webpage. Custom viewport sizes. Start free.",
  },
  alternates: { canonical: "/tools/screenshot-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://api-snap.com/api/screenshot?url=https://example.com&width=1280" \\
  -H "Authorization: Bearer snp_your_key" -o screenshot.svg`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://api-snap.com/api/screenshot?url=https://github.com&width=1440",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const svg = await res.text();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://api-snap.com/api/screenshot",
    params={"url": "https://example.com", "width": 1280},
    headers={"Authorization": "Bearer snp_your_key"},
)
with open("screenshot.svg", "w") as f:
    f.write(r.text)`,
  },
];

export default function ScreenshotApiPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          No browser dependencies needed
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Website Screenshot API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Capture screenshots of any website with a single GET request. Custom viewport sizes,
          no headless browser setup — just pass a URL and get an image back.
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
                { name: "url", req: true, desc: "The URL to capture (must be a valid http/https URL)" },
                { name: "width", req: false, desc: "Viewport width in pixels (default 1280)" },
                { name: "height", req: false, desc: "Viewport height in pixels (default 720)" },
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
            { title: "Link previews", desc: "Generate visual previews for links shared in your app, CMS, or chat" },
            { title: "Competitor monitoring", desc: "Track visual changes on competitor websites over time" },
            { title: "Social sharing cards", desc: "Create rich thumbnails for blog posts and landing pages" },
            { title: "Testing & QA", desc: "Automated visual regression testing for your web applications" },
            { title: "Portfolio builders", desc: "Show live previews of websites in portfolio or directory listings" },
            { title: "Documentation", desc: "Capture screenshots of UI states for docs and changelogs" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Capturing Screenshots</h2>
        <p className="text-gray-400 mb-8">No headless browsers to manage. Just an API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <Footer />
    </div>
  );
}
