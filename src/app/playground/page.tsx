"use client";

import Link from "next/link";
import { useState } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const endpoints = [
  {
    id: "uuid",
    name: "UUID / ID Generation",
    method: "GET",
    path: "/api/uuid",
    fields: [
      { name: "format", type: "select", options: ["uuid", "nanoid", "nanoid-short", "hex", "base64", "numeric", "timestamp"], default: "uuid" },
      { name: "count", type: "number", default: "1", placeholder: "1-100" },
      { name: "prefix", type: "text", default: "", placeholder: "e.g. usr_" },
    ],
  },
  {
    id: "hash",
    name: "Hash Generation",
    method: "GET",
    path: "/api/hash",
    fields: [
      { name: "text", type: "text", default: "Hello, World!", placeholder: "Text to hash", required: true },
      { name: "algorithm", type: "select", options: ["sha256", "sha512", "sha1", "md5"], default: "sha256" },
      { name: "encoding", type: "select", options: ["hex", "base64", "base64url"], default: "hex" },
    ],
  },
  {
    id: "base64",
    name: "Base64 Encode/Decode",
    method: "POST",
    path: "/api/base64",
    fields: [
      { name: "input", type: "textarea", default: "Hello, World!", placeholder: "Text to encode/decode", required: true },
      { name: "action", type: "select", options: ["encode", "decode"], default: "encode" },
    ],
  },
  {
    id: "jwt-decode",
    name: "JWT Decode",
    method: "POST",
    path: "/api/jwt-decode",
    fields: [
      { name: "token", type: "textarea", default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", placeholder: "Paste a JWT token", required: true },
    ],
  },
  {
    id: "color",
    name: "Color Conversion",
    method: "GET",
    path: "/api/color",
    fields: [
      { name: "color", type: "text", default: "#6366f1", placeholder: "e.g. #ff0000, ff0000", required: true },
    ],
  },
  {
    id: "lorem",
    name: "Lorem Ipsum Generator",
    method: "GET",
    path: "/api/lorem",
    fields: [
      { name: "paragraphs", type: "number", default: "2", placeholder: "1-20" },
      { name: "sentences", type: "number", default: "3", placeholder: "1-20" },
    ],
  },
  {
    id: "markdown",
    name: "Markdown to HTML",
    method: "POST",
    path: "/api/markdown",
    fields: [
      { name: "markdown", type: "textarea", default: "# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Fast\n- Simple\n- Reliable", placeholder: "Enter Markdown", required: true },
    ],
  },
  {
    id: "placeholder",
    name: "Placeholder Image",
    method: "GET",
    path: "/api/placeholder",
    fields: [
      { name: "w", type: "number", default: "400", placeholder: "Width" },
      { name: "h", type: "number", default: "300", placeholder: "Height" },
      { name: "bg", type: "text", default: "4f46e5", placeholder: "Background hex" },
      { name: "fg", type: "text", default: "ffffff", placeholder: "Text color hex" },
      { name: "text", type: "text", default: "API Snap", placeholder: "Custom text" },
    ],
  },
  {
    id: "qr",
    name: "QR Code",
    method: "GET",
    path: "/api/qr",
    fields: [
      { name: "data", type: "text", default: "https://api-snap.com", placeholder: "URL or text to encode", required: true },
      { name: "size", type: "number", default: "300", placeholder: "Size in pixels" },
      { name: "format", type: "select", options: ["png", "svg"], default: "png" },
    ],
  },
  {
    id: "meta",
    name: "URL Metadata / OG Tags",
    method: "GET",
    path: "/api/meta",
    fields: [
      { name: "url", type: "text", default: "https://github.com", placeholder: "URL to extract metadata from", required: true },
    ],
  },
];

type Field = (typeof endpoints)[number]["fields"][number];

export default function PlaygroundPage() {
  const [selected, setSelected] = useState(endpoints[0]);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    endpoints[0].fields.forEach((f) => { init[f.name] = f.default || ""; });
    return init;
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  function selectEndpoint(ep: (typeof endpoints)[number]) {
    setSelected(ep);
    const init: Record<string, string> = {};
    ep.fields.forEach((f) => { init[f.name] = f.default || ""; });
    setValues(init);
    setResult(null);
  }

  async function runTest() {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(values)) {
        if (v !== "") params[k] = v;
      }
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: selected.id, params }),
      });
      const rem = res.headers.get("X-Playground-Remaining");
      if (rem) setRemaining(parseInt(rem));
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(JSON.stringify({ error: "Request failed" }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  function getCurlCommand(): string {
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v !== "") params[k] = v;
    }
    if (selected.method === "GET") {
      const qs = new URLSearchParams(params).toString();
      return `curl "https://api-snap.com${selected.path}?${qs}" \\\n  -H "Authorization: Bearer snp_your_api_key"`;
    }
    return `curl -X POST "https://api-snap.com${selected.path}" \\\n  -H "Authorization: Bearer snp_your_api_key" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(params)}'`;
  }

  return (
    <div className="min-h-screen">
      <Nav current="/playground" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Playground</h1>
          <p className="text-gray-400 mt-2">
            Try any endpoint live — no sign-up required.
            {remaining !== null && (
              <span className="ml-2 text-sm text-gray-500">({remaining} playground calls remaining this hour)</span>
            )}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="space-y-1">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => selectEndpoint(ep)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center gap-2 ${
                  selected.id === ep.id
                    ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className={`rounded px-1.5 py-0.5 text-xs font-mono ${
                  selected.id === ep.id ? "bg-indigo-600/30 text-indigo-300" : "bg-gray-800 text-gray-500"
                }`}>
                  {ep.method}
                </span>
                {ep.name}
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div className="space-y-6">
            {/* Endpoint info */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded bg-indigo-600/20 px-2 py-1 text-xs font-mono text-indigo-400">
                  {selected.method}
                </span>
                <code className="text-gray-300">{selected.path}</code>
              </div>

              {/* Parameter form */}
              <div className="space-y-4">
                {selected.fields.map((field: Field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {field.name}
                      {"required" in field && field.required && <span className="text-yellow-400 ml-1">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={values[field.name] || ""}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                      >
                        {"options" in field && field.options?.map((o: string) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={values[field.name] || ""}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none font-mono"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.name] || ""}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={runTest}
                disabled={loading}
                className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                {loading ? "Running..." : "Try It"}
              </button>
            </div>

            {/* curl command */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">cURL Command</h3>
              <pre className="rounded-lg bg-gray-800 p-4 text-sm text-gray-300 overflow-x-auto">
                {getCurlCommand()}
              </pre>
            </div>

            {/* Result */}
            {result && (
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-400">Response</h3>
                  <Link
                    href="/signup"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Get your API key for free →
                  </Link>
                </div>
                <pre className="rounded-lg bg-gray-800 p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
