import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

// Screenshot endpoint - requires Chromium in production
// For now, returns a styled HTML-to-SVG preview
export const GET = createApiHandler("screenshot", async (req) => {
  const url = req.nextUrl.searchParams.get("url");
  const width = Number(req.nextUrl.searchParams.get("width") || 1280);
  const height = Number(req.nextUrl.searchParams.get("height") || 720);

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' parameter" },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  // In production, you'd use Puppeteer/Playwright with a headless browser
  // For the MVP, we generate a placeholder that shows the concept works
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f8f9fa"/>
    <rect x="0" y="0" width="100%" height="40" fill="#dee2e6"/>
    <circle cx="20" cy="20" r="6" fill="#ff5f57"/>
    <circle cx="40" cy="20" r="6" fill="#febc2e"/>
    <circle cx="60" cy="20" r="6" fill="#28c840"/>
    <rect x="100" y="12" width="${width - 200}" height="16" rx="4" fill="#fff"/>
    <text x="110" y="24" font-size="10" fill="#666" font-family="monospace">${escapeXml(url).slice(0, 80)}</text>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#999" font-family="Arial">
      Screenshot of ${escapeXml(new URL(url).hostname)}
    </text>
    <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#bbb" font-family="Arial">
      Configure BROWSER_WS_ENDPOINT for live screenshots
    </text>
  </svg>`;

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
});

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" };
    return map[c] || c;
  });
}
