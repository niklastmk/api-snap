import Link from "next/link";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete API reference for SnapAPI — 13+ developer utility endpoints for QR codes, hashing, image resize, UUID generation, and more.",
  openGraph: {
    title: "API Documentation — SnapAPI",
    description: "Complete API reference for 13+ developer utility endpoints. QR codes, hashing, image resize, UUID generation, and more.",
    url: `${baseUrl}/docs`,
  },
  alternates: { canonical: `${baseUrl}/docs` },
};

const endpoints = [
  {
    name: "QR Code Generation",
    method: "GET",
    path: "/api/qr",
    desc: "Generate QR codes in PNG or SVG format with customizable colors and sizes.",
    params: [
      { name: "data", required: true, desc: "The text or URL to encode" },
      { name: "size", required: false, desc: "Image width in pixels (max 1000, default 300)" },
      { name: "format", required: false, desc: '"png" or "svg" (default "png")' },
      { name: "dark", required: false, desc: "Dark color hex (default #000000)" },
      { name: "light", required: false, desc: "Light color hex (default #ffffff)" },
    ],
    example: `curl "https://snapapi.dev/api/qr?data=https://example.com&size=400&format=svg" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: "Returns image/png or image/svg+xml",
  },
  {
    name: "Hash Generation",
    method: "GET / POST",
    path: "/api/hash",
    desc: "Generate cryptographic hashes using SHA-256, SHA-512, MD5, and more.",
    params: [
      { name: "text", required: true, desc: "The text to hash (query param for GET, body field for POST)" },
      { name: "algorithm", required: false, desc: "Algorithm: md5, sha1, sha256, sha512, sha384, sha3-256, sha3-512 (default sha256)" },
      { name: "encoding", required: false, desc: "Output encoding: hex, base64, base64url (default hex)" },
    ],
    example: `curl "https://snapapi.dev/api/hash?text=Hello+World&algorithm=sha256" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: 'Returns JSON: {"hash": "...", "algorithm": "sha256", "encoding": "hex"}',
  },
  {
    name: "UUID / ID Generation",
    method: "GET",
    path: "/api/uuid",
    desc: "Generate unique identifiers in various formats. Great for database IDs, tokens, and more.",
    params: [
      { name: "format", required: false, desc: "Format: uuid, v4, nanoid, nanoid-short, hex, base64, numeric, timestamp (default uuid)" },
      { name: "count", required: false, desc: "Number of IDs to generate, 1-100 (default 1)" },
      { name: "prefix", required: false, desc: "Prefix to prepend to each ID (e.g., 'usr_', 'txn_')" },
    ],
    example: `curl "https://snapapi.dev/api/uuid?format=nanoid&count=5&prefix=usr_" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: 'Returns JSON: {"id": "..."} for count=1, {"ids": [...]} for count>1',
  },
  {
    name: "Base64 Encode/Decode",
    method: "POST",
    path: "/api/base64",
    desc: "Encode or decode strings using Base64 or Base64URL encoding.",
    params: [
      { name: "input", required: true, desc: "The string to encode or decode" },
      { name: "action", required: false, desc: '"encode" or "decode" (default "encode")' },
      { name: "urlSafe", required: false, desc: "Use base64url variant (default false)" },
    ],
    example: `curl -X POST "https://snapapi.dev/api/base64" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Hello, World!", "action": "encode"}'`,
    response: 'Returns JSON: {"result": "SGVsbG8sIFdvcmxkIQ==", "action": "encode"}',
  },
  {
    name: "JWT Decode",
    method: "POST",
    path: "/api/jwt-decode",
    desc: "Decode and inspect JWT tokens without verification. See header, payload, and expiry information.",
    params: [
      { name: "token", required: true, desc: "The JWT token to decode" },
    ],
    example: `curl -X POST "https://snapapi.dev/api/jwt-decode" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'`,
    response: 'Returns JSON: {"header": {...}, "payload": {...}, "expired": false, "expiresAt": "..."}',
  },
  {
    name: "Color Conversion",
    method: "GET",
    path: "/api/color",
    desc: "Convert colors between hex, RGB, and HSL. Includes brightness and dark/light detection.",
    params: [
      { name: "color", required: true, desc: "Color in hex (#ff0000 or ff0000), rgb(255,0,0), or hsl(0,100%,50%)" },
    ],
    example: `curl "https://snapapi.dev/api/color?color=6366f1" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: 'Returns JSON with hex, rgb, hsl, brightness, isDark fields',
  },
  {
    name: "Lorem Ipsum Generator",
    method: "GET",
    path: "/api/lorem",
    desc: "Generate placeholder text in paragraphs. Output as plain text or HTML.",
    params: [
      { name: "paragraphs", required: false, desc: "Number of paragraphs, 1-20 (default 3)" },
      { name: "sentences", required: false, desc: "Sentences per paragraph, 1-20 (default 5)" },
      { name: "format", required: false, desc: '"text" (JSON response) or "html" (HTML paragraphs) (default "text")' },
    ],
    example: `curl "https://snapapi.dev/api/lorem?paragraphs=3&sentences=4" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: 'Returns JSON: {"text": "...", "paragraphs": [...]}',
  },
  {
    name: "Placeholder Images",
    method: "GET",
    path: "/api/placeholder",
    desc: "Generate SVG placeholder images with custom dimensions, colors, and text.",
    params: [
      { name: "w", required: false, desc: "Width in pixels (1-2000, default 300)" },
      { name: "h", required: false, desc: "Height in pixels (1-2000, default 200)" },
      { name: "bg", required: false, desc: "Background color hex without # (default cccccc)" },
      { name: "fg", required: false, desc: "Text color hex without # (default 666666)" },
      { name: "text", required: false, desc: 'Custom text (default "WxH")' },
    ],
    example: `curl "https://snapapi.dev/api/placeholder?w=600&h=400&bg=4f46e5&fg=ffffff&text=Hero+Image" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: "Returns image/svg+xml with immutable cache headers",
  },
  {
    name: "URL Metadata / OG Tags",
    method: "GET",
    path: "/api/meta",
    desc: "Extract Open Graph metadata, title, description, favicon, and more from any URL.",
    params: [
      { name: "url", required: true, desc: "The URL to extract metadata from" },
    ],
    example: `curl "https://snapapi.dev/api/meta?url=https://github.com" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: "Returns JSON with title, description, image, siteName, favicon, author, etc.",
  },
  {
    name: "Image Resize & Convert",
    method: "POST",
    path: "/api/resize",
    desc: "Resize, crop, and convert images between formats. Supports multipart upload or JSON with base64/URL.",
    params: [
      { name: "image", required: true, desc: "Image file (multipart) or base64 string, or use 'url' field" },
      { name: "url", required: false, desc: "URL of image to resize (alternative to image upload)" },
      { name: "width", required: false, desc: "Target width in pixels (max 4096)" },
      { name: "height", required: false, desc: "Target height in pixels (max 4096)" },
      { name: "format", required: false, desc: "Output format: png, jpeg, webp, avif (default png)" },
      { name: "quality", required: false, desc: "Output quality 1-100 (default 80, for jpeg/webp/avif)" },
      { name: "fit", required: false, desc: "Resize fit: cover, contain, fill, inside, outside (default cover)" },
    ],
    example: `curl -X POST "https://snapapi.dev/api/resize" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/photo.jpg","width":400,"format":"webp"}'`,
    response: "Returns the resized image in the requested format",
  },
  {
    name: "Markdown to HTML",
    method: "POST",
    path: "/api/markdown",
    desc: "Convert Markdown to HTML. Returns either styled full HTML page or raw HTML fragment.",
    params: [
      { name: "markdown", required: true, desc: "Markdown content to convert" },
      { name: "styled", required: false, desc: "Return full styled HTML page (default true). Set false for raw HTML fragment." },
    ],
    example: `curl -X POST "https://snapapi.dev/api/markdown" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"markdown": "# Hello World\\n\\nThis is **bold** text."}'`,
    response: "Returns text/html (styled) or JSON with html field (unstyled)",
  },
  {
    name: "Screenshot Capture",
    method: "GET",
    path: "/api/screenshot",
    desc: "Capture a visual preview of any URL. Returns an SVG representation.",
    params: [
      { name: "url", required: true, desc: "The URL to capture (must be valid)" },
      { name: "width", required: false, desc: "Viewport width (default 1280)" },
      { name: "height", required: false, desc: "Viewport height (default 720)" },
    ],
    example: `curl "https://snapapi.dev/api/screenshot?url=https://example.com&width=1280" \\
  -H "Authorization: Bearer snp_your_api_key"`,
    response: "Returns image/svg+xml",
  },
  {
    name: "HTML to PDF",
    method: "POST",
    path: "/api/pdf",
    desc: "Convert HTML content to a downloadable PDF document.",
    params: [
      { name: "html", required: true, desc: "HTML content to convert to PDF" },
      { name: "title", required: false, desc: 'Document title and filename (default "document")' },
    ],
    example: `curl -X POST "https://snapapi.dev/api/pdf" \\
  -H "Authorization: Bearer snp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Invoice #123</h1><p>Amount: $99.00</p>", "title": "Invoice"}' \\
  -o invoice.pdf`,
    response: "Returns application/pdf",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            SnapAPI
          </Link>
          <div className="flex gap-4">
            <Link href="/playground" className="text-gray-400 hover:text-white transition">
              Playground
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              Dashboard
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

      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-gray-400 mb-4 max-w-2xl">
          All endpoints require authentication via an API key. Pass it as a Bearer token
          in the Authorization header or as an <code className="text-gray-300">api_key</code> query parameter.
        </p>
        <p className="text-sm text-gray-500 mb-12">
          Want to try before signing up?{" "}
          <Link href="/playground" className="text-indigo-400 hover:text-indigo-300">
            Use the interactive Playground →
          </Link>
        </p>

        {/* Auth section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <p className="text-sm text-gray-400 mb-4">
            Include your API key in every request using one of these methods:
          </p>
          <pre className="rounded-lg bg-gray-800 p-4 text-sm text-gray-300 overflow-x-auto mb-4">
{`# Option 1: Authorization header (recommended)
curl -H "Authorization: Bearer snp_your_api_key" ...

# Option 2: Query parameter
curl "https://snapapi.dev/api/qr?data=test&api_key=snp_your_api_key"`}
          </pre>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Rate Limit Headers</h3>
          <p className="text-sm text-gray-400">
            Every response includes <code className="text-gray-300">X-RateLimit-Limit</code> and{" "}
            <code className="text-gray-300">X-RateLimit-Remaining</code> headers so you can track usage.
          </p>
        </div>

        {/* TOC */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-12">
          <h2 className="text-lg font-semibold mb-4">Endpoints ({endpoints.length})</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {endpoints.map((ep) => (
              <a
                key={ep.path}
                href={`#${ep.path.replace("/api/", "")}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-gray-800"
              >
                <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-xs font-mono text-indigo-400">
                  {ep.method.split(" ")[0]}
                </span>
                <code className="text-gray-300">{ep.path}</code>
                <span className="text-gray-500 ml-auto text-xs">{ep.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-12">
          {endpoints.map((ep) => (
            <div key={ep.path} id={ep.path.replace("/api/", "")} className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded bg-indigo-600/20 px-2.5 py-1 text-xs font-mono font-semibold text-indigo-400">
                  {ep.method}
                </span>
                <code className="text-lg text-gray-200">{ep.path}</code>
              </div>
              <h2 className="text-xl font-semibold mb-2">{ep.name}</h2>
              <p className="text-gray-400 mb-4">{ep.desc}</p>

              <h3 className="text-sm font-semibold text-gray-300 mb-2">Parameters</h3>
              <div className="rounded-lg border border-gray-800 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900">
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Name</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Required</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map((p) => (
                      <tr key={p.name} className="border-b border-gray-800/50">
                        <td className="px-4 py-2">
                          <code className="text-indigo-400">{p.name}</code>
                        </td>
                        <td className="px-4 py-2">
                          {p.required ? (
                            <span className="text-yellow-400 text-xs font-semibold">Required</span>
                          ) : (
                            <span className="text-gray-500 text-xs">Optional</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-400">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-semibold text-gray-300 mb-2">Example</h3>
              <pre className="rounded-lg bg-gray-800 p-4 text-sm text-gray-300 overflow-x-auto mb-3">
                {ep.example}
              </pre>
              <p className="text-sm text-gray-500">{ep.response}</p>
            </div>
          ))}
        </div>

        {/* Error codes */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Error Responses</h2>
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900">
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "400", desc: "Bad request — missing or invalid parameters" },
                  { code: "401", desc: "Unauthorized — missing or invalid API key" },
                  { code: "429", desc: "Rate limit exceeded — upgrade your plan for more requests" },
                  { code: "502", desc: "Bad gateway — upstream URL could not be fetched" },
                  { code: "500", desc: "Internal server error" },
                ].map((e) => (
                  <tr key={e.code} className="border-b border-gray-800/50">
                    <td className="px-4 py-2">
                      <code className="text-red-400">{e.code}</code>
                    </td>
                    <td className="px-4 py-2 text-gray-400">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SnapAPI. All rights reserved.
      </footer>
    </div>
  );
}
