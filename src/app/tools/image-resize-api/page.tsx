import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resize API — Resize & Convert Images via REST API",
  description:
    "Resize, crop, and convert images with a single API call. Supports PNG, JPEG, WebP, AVIF. Upload or pass a URL. Free tier with 100 calls/month.",
  keywords: [
    "image resize API", "image conversion API", "resize image API", "image processing API",
    "convert image API", "webp API", "thumbnail API", "free image resize API",
  ],
  openGraph: {
    title: "Image Resize API — Process Images on the Fly",
    description: "Resize, crop, convert images via REST. PNG, JPEG, WebP, AVIF. Start free.",
  },
  alternates: { canonical: "https://snapapi.dev/tools/image-resize-api" },
};

const codeExamples = [
  {
    lang: "cURL (URL input)",
    code: `curl -X POST "https://snapapi.dev/api/resize" \\
  -H "Authorization: Bearer snp_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/photo.jpg","width":400,"format":"webp"}' \\
  -o resized.webp`,
  },
  {
    lang: "JavaScript",
    code: `const res = await fetch("https://snapapi.dev/api/resize", {
  method: "POST",
  headers: {
    Authorization: "Bearer snp_your_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com/photo.jpg",
    width: 800,
    height: 600,
    format: "webp",
    quality: 85,
  }),
});
const blob = await res.blob();`,
  },
  {
    lang: "Python",
    code: `import requests

r = requests.post(
    "https://snapapi.dev/api/resize",
    headers={"Authorization": "Bearer snp_your_key"},
    json={"url": "https://example.com/photo.jpg", "width": 400, "format": "avif"},
)
with open("thumb.avif", "wb") as f:
    f.write(r.content)`,
  },
];

export default function ImageResizeApiPage() {
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
          PNG, JPEG, WebP, AVIF
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Image Resize &amp; Convert API
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Resize, crop, and convert images between formats with a single POST request.
          Pass an image URL or upload directly. No image processing libraries to install.
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
                { name: "url / image", req: true, desc: "URL of the image or base64 string (or multipart file upload)" },
                { name: "width", req: false, desc: "Target width in pixels (max 4096)" },
                { name: "height", req: false, desc: "Target height in pixels (max 4096)" },
                { name: "format", req: false, desc: "Output format: png, jpeg, webp, avif (default png)" },
                { name: "quality", req: false, desc: "Quality 1-100 for jpeg/webp/avif (default 80)" },
                { name: "fit", req: false, desc: "Resize fit: cover, contain, fill, inside, outside (default cover)" },
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
            { title: "Thumbnail generation", desc: "Create consistent thumbnails from user uploads for galleries and profiles" },
            { title: "Format conversion", desc: "Convert PNG/JPEG to WebP or AVIF for faster page loads and bandwidth savings" },
            { title: "Responsive images", desc: "Generate multiple sizes from a single upload for srcset and responsive layouts" },
            { title: "Social media assets", desc: "Resize images to platform-specific dimensions for Open Graph, Twitter cards, etc." },
            { title: "E-commerce catalogs", desc: "Process product images into uniform sizes across your storefront" },
            { title: "Content pipelines", desc: "Automate image processing in CI/CD or CMS workflows without local dependencies" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-white">{uc.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Processing Images</h2>
        <p className="text-gray-400 mb-8">No Sharp, no ImageMagick, no dependencies. Just an API call.</p>
        <Link href="/signup" className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white hover:bg-indigo-500 transition">
          Get Your Free API Key
        </Link>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} SnapAPI</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
            <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
