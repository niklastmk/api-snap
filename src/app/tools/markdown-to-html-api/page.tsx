import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Markdown to HTML API — Convert Markdown via REST",
  description:
    "Convert Markdown to clean, styled HTML with a simple POST request. Supports headings, lists, code blocks, and more. Free tier with 100 calls/month.",
  keywords: [
    "Markdown to HTML API", "convert Markdown API", "Markdown renderer API",
    "Markdown parser API", "Markdown as a service", "render Markdown API",
  ],
  openGraph: {
    title: "Markdown to HTML API — Convert via REST",
    description: "Convert Markdown to styled HTML with one API call. Start free.",
  },
  alternates: { canonical: "/tools/markdown-to-html-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl -X POST "https://api-snap.com/api/markdown" \\
  -H "Authorization: Bearer snp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"markdown": "# Hello\\n\\nThis is **bold** and *italic*."}'`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch("https://api-snap.com/api/markdown", {
  method: "POST",
  headers: {
    Authorization: "Bearer snp_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ markdown: "# My Doc\\n\\n- Item 1\\n- Item 2" }),
});
const { html } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.post(
    "https://api-snap.com/api/markdown",
    json={"markdown": "# Report\\n\\n| Col | Val |\\n|-----|-----|\\n| A | 1 |"},
    headers={"Authorization": "Bearer snp_your_key"},
)
print(r.json()["html"])`,
  },
];

export default function MarkdownToHtmlApiPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-block rounded-full bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-400 mb-6">
          Markdown to HTML
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Markdown to HTML API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Convert Markdown to clean, sanitized HTML with a single POST request. Supports
          headings, lists, tables, code blocks, and inline formatting.
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
            { title: "Blog rendering", desc: "Render Markdown blog posts as HTML for your CMS or static site" },
            { title: "Documentation", desc: "Convert Markdown docs to HTML for knowledge bases and help centers" },
            { title: "Email templates", desc: "Write email content in Markdown and convert to HTML for sending" },
            { title: "User-generated content", desc: "Let users write in Markdown and safely render as sanitized HTML" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Rendering Markdown</h2>
        <p className="text-gray-400 mb-8">Markdown in, HTML out. One API call, zero dependencies.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <Footer />
    </div>
  );
}
