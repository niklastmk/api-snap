import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to PDF API — Convert HTML to PDF via REST",
  description:
    "Convert HTML content to downloadable PDF documents with a simple POST request. Custom titles, clean output. Free tier with 100 calls/month.",
  keywords: [
    "HTML to PDF API", "convert HTML to PDF API", "PDF generation API",
    "generate PDF API", "PDF as a service", "HTML PDF converter API",
  ],
  openGraph: {
    title: "HTML to PDF API — Generate PDFs via REST",
    description: "Convert HTML to PDF documents with one API call. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/html-to-pdf-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl -X POST "https://snapapi.dev/api/pdf" \\
  -H "Authorization: Bearer snp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Invoice #1234</h1><p>Total: $99.00</p>", "title": "Invoice"}' \\
  -o invoice.pdf`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch("https://snapapi.dev/api/pdf", {
  method: "POST",
  headers: {
    Authorization: "Bearer snp_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    html: "<h1>Report</h1><table>...</table>",
    title: "Monthly Report",
  }),
});
const blob = await res.blob();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.post(
    "https://snapapi.dev/api/pdf",
    json={"html": "<h1>Contract</h1><p>Terms...</p>", "title": "Contract"},
    headers={"Authorization": "Bearer snp_your_key"},
)
with open("contract.pdf", "wb") as f:
    f.write(r.content)`,
  },
];

export default function HtmlToPdfApiPage() {
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
          HTML to PDF
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          HTML to PDF API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Convert HTML content to downloadable PDF documents with a single POST request.
          Invoices, reports, contracts — generate PDFs from any HTML.
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
                { name: "html", req: true, desc: "HTML content to convert to PDF" },
                { name: "title", req: false, desc: "PDF document title (default: \"Document\")" },
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
            { title: "Invoices & receipts", desc: "Generate PDF invoices from HTML templates with dynamic data" },
            { title: "Reports", desc: "Convert dashboard data and charts into downloadable PDF reports" },
            { title: "Contracts", desc: "Create PDF contracts from HTML forms for e-signature workflows" },
            { title: "Certificates", desc: "Generate personalized certificates and diplomas as PDF downloads" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Generating PDFs</h2>
        <p className="text-gray-400 mb-8">HTML in, PDF out. One API call, zero headless browser setup.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/markdown-to-html-api" className="hover:text-gray-300 transition">Markdown API</Link>
            <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
