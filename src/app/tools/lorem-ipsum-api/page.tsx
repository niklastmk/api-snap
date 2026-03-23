import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Lorem Ipsum API — Generate Placeholder Text via REST",
  description:
    "Generate lorem ipsum placeholder text with a simple GET request. Paragraphs, sentences, plain text or HTML. Free tier with 100 calls/month.",
  keywords: [
    "lorem ipsum API", "placeholder text API", "generate lorem ipsum API",
    "dummy text API", "lorem ipsum generator API", "text placeholder API",
  ],
  openGraph: {
    title: "Lorem Ipsum API — Placeholder Text via REST",
    description: "Generate placeholder text with one GET request. Start free.",
  },
  alternates: { canonical: "/tools/lorem-ipsum-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://api-snap.com/api/lorem?paragraphs=3&sentences=5" \\
  -H "Authorization: Bearer snp_your_key"`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://api-snap.com/api/lorem?paragraphs=2&format=html",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const { text } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://api-snap.com/api/lorem",
    params={"paragraphs": 5, "sentences": 4},
    headers={"Authorization": "Bearer snp_your_key"},
)
print(r.json()["text"])`,
  },
];

export default function LoremIpsumApiPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          Placeholder text on demand
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Lorem Ipsum API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Generate placeholder text with a single GET request. Control the number of
          paragraphs and sentences. Output as plain text or HTML.
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
                { name: "paragraphs", req: false, desc: "Number of paragraphs (default 3)" },
                { name: "sentences", req: false, desc: "Sentences per paragraph (default 5)" },
                { name: "format", req: false, desc: '"text" or "html" (default "text")' },
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
            { title: "UI prototyping", desc: "Fill mockups and prototypes with realistic-looking text content" },
            { title: "Database seeding", desc: "Generate test data for development and staging environments" },
            { title: "CMS previews", desc: "Show placeholder content in empty CMS pages and templates" },
            { title: "Design systems", desc: "Test typography and layout with varying text lengths" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Generate Placeholder Text</h2>
        <p className="text-gray-400 mb-8">Paragraphs, sentences, text or HTML. One GET request.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <Footer />
    </div>
  );
}
