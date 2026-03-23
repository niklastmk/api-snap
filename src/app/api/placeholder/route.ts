import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

export const GET = createApiHandler("placeholder", async (req) => {
  const width = Math.min(Math.max(Number(req.nextUrl.searchParams.get("w") || 300), 1), 2000);
  const height = Math.min(Math.max(Number(req.nextUrl.searchParams.get("h") || 200), 1), 2000);
  const bg = req.nextUrl.searchParams.get("bg") || "cccccc";
  const fg = req.nextUrl.searchParams.get("fg") || "666666";
  const text = req.nextUrl.searchParams.get("text") || `${width}×${height}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#${bg}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}"
          fill="#${fg}">${escapeXml(text)}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" };
    return map[c] || c;
  });
}
