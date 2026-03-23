import Link from "next/link";

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
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            ⚡ SnapAPI
          </Link>
          <div className="flex gap-4">
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
        <p className="text-gray-400 mb-12 max-w-2xl">
          All endpoints require authentication via an API key. Pass it as a Bearer token
          in the Authorization header or as an <code className="text-gray-300">api_key</code> query parameter.
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
        © {new Date().getFullYear()} SnapAPI. All rights reserved.
      </footer>
    </div>
  );
}
