import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Placeholder Image API — Generate SVG Placeholders via REST",
  description:
    "Generate SVG placeholder images with custom dimensions, colors, and text with a simple GET request. Free tier with 100 calls/month.",
  keywords: [
    "placeholder image API", "placeholder API", "dummy image API",
    "SVG placeholder API", "image placeholder generator", "placeholder as a service",
  ],
  openGraph: {
    title: "Placeholder Image API — SVG Placeholders via REST",
    description: "Generate placeholder images with custom size, color, and text. Start free.",
  },
  alternates: { canonical: "/tools/placeholder-image-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://api-snap.com/api/placeholder?w=600&h=400&bg=4f46e5&color=fff&text=Hero+Image" \\
  -H "Authorization: Bearer snp_your_key" -o placeholder.svg`,
  },
  {
    lang: "JavaScript",
    code: `// Use directly in an img tag (server-side rendering)
const url = "https://api-snap.com/api/placeholder?w=300&h=200&text=Loading...";

// Or fetch the SVG content
const res = await fetch(
  "https://api-snap.com/api/placeholder?w=800&h=600&bg=1e293b&color=94a3b8",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const svg = await res.text();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://api-snap.com/api/placeholder",
    params={"w": 400, "h": 300, "bg": "f59e0b", "text": "Thumbnail"},
    headers={"Authorization": "Bearer snp_your_key"},
)
with open("placeholder.svg", "w") as f:
    f.write(r.text)`,
  },
];

export default function PlaceholderImageApiPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          SVG Placeholders
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Placeholder Image API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Generate SVG placeholder images with custom dimensions, background colors,
          and text labels — all with a single GET request.
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
                { name: "w", req: false, desc: "Width in pixels (default 300)" },
                { name: "h", req: false, desc: "Height in pixels (default 200)" },
                { name: "bg", req: false, desc: "Background color hex (default cccccc)" },
                { name: "color", req: false, desc: "Text color hex (default 333333)" },
                { name: "text", req: false, desc: 'Label text (default "WxH")' },
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
            { title: "UI wireframing", desc: "Fill image slots in wireframes and mockups with correctly-sized placeholders" },
            { title: "Loading states", desc: "Show placeholder images while real content is loading" },
            { title: "Email templates", desc: "Use placeholder images during email template development" },
            { title: "Documentation", desc: "Illustrate image dimensions and layouts in design documentation" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Creating Placeholders</h2>
        <p className="text-gray-400 mb-8">Custom size, color, and text. One GET request.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <Footer />
    </div>
  );
}
