import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter API — Hex, RGB & HSL Conversion via REST",
  description:
    "Convert between hex, RGB, and HSL color formats with a simple GET request. Includes brightness detection. Free tier with 100 calls/month.",
  keywords: [
    "color converter API", "hex to RGB API", "RGB to HSL API", "color conversion API",
    "hex to HSL", "color format API", "free color API",
  ],
  openGraph: {
    title: "Color Converter API — Hex, RGB & HSL via REST",
    description: "Convert colors between formats with one API call. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/color-converter-api" },
};

const codeExamples = [
  {
    lang: "cURL",
    code: `curl "https://snapapi.dev/api/color?color=6366f1" \\
  -H "Authorization: Bearer snp_your_key"
# {"hex":"#6366f1","rgb":{"r":99,"g":102,"b":241},"hsl":{"h":239,"s":84,"l":67},"isLight":false}`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch(
  "https://snapapi.dev/api/color?color=rgb(255,107,107)",
  { headers: { Authorization: "Bearer snp_your_key" } }
);
const { hex, hsl, isLight } = await res.json();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.get(
    "https://snapapi.dev/api/color",
    params={"color": "#22c55e"},
    headers={"Authorization": "Bearer snp_your_key"},
)
data = r.json()
print(f"RGB: {data['rgb']}, Light: {data['isLight']}")`,
  },
];

export default function ColorConverterApiPage() {
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
          Hex, RGB, HSL
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Color Converter API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Convert between hex, RGB, and HSL color formats with a single GET request.
          Includes automatic brightness detection for text contrast decisions.
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
            { title: "Hex", desc: "Standard #RRGGBB hex notation" },
            { title: "RGB", desc: "Individual R, G, B values (0-255)" },
            { title: "HSL", desc: "Hue, saturation, lightness values" },
            { title: "Brightness", desc: "isLight boolean for contrast decisions" },
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
            { title: "Dynamic theming", desc: "Convert user-selected colors between formats for CSS custom properties" },
            { title: "Accessible contrast", desc: "Use isLight to automatically choose black or white text on colored backgrounds" },
            { title: "Design tools", desc: "Show hex, RGB, and HSL representations in color pickers and design apps" },
            { title: "Data visualization", desc: "Convert between color spaces for chart libraries and gradient generation" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Converting Colors</h2>
        <p className="text-gray-400 mb-8">Hex, RGB, HSL — all formats, one API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/placeholder-image-api" className="hover:text-gray-300 transition">Placeholder API</Link>
            <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
