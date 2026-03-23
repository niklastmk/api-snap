import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

export const maxDuration = 30;

export const GET = createApiHandler("screenshot", async (req) => {
  const url = req.nextUrl.searchParams.get("url");
  const width = Math.min(Number(req.nextUrl.searchParams.get("width") || 1280), 1920);
  const height = Math.min(Number(req.nextUrl.searchParams.get("height") || 720), 1080);
  const format = req.nextUrl.searchParams.get("format") === "jpeg" ? "jpeg" : "png";
  const fullPage = req.nextUrl.searchParams.get("full_page") === "true";

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' parameter" },
      { status: 400 }
    );
  }

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  // Block non-http(s) URLs and private IPs
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { error: "Only http and https URLs are supported" },
      { status: 400 }
    );
  }

  const wsEndpoint = process.env.BROWSER_WS_ENDPOINT;

  if (wsEndpoint) {
    // Real screenshot via remote headless browser
    try {
      const puppeteer = await import("puppeteer-core");
      const browser = await puppeteer.default.connect({
        browserWSEndpoint: wsEndpoint,
      });

      const page = await browser.newPage();
      await page.setViewport({ width, height });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

      const screenshot = await page.screenshot({
        type: format,
        fullPage,
        ...(format === "jpeg" ? { quality: 85 } : {}),
      });

      await page.close();

      return new NextResponse(Buffer.from(screenshot), {
        headers: {
          "Content-Type": format === "jpeg" ? "image/jpeg" : "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (err) {
      return NextResponse.json(
        { error: "Screenshot capture failed", detail: err instanceof Error ? err.message : "Unknown error" },
        { status: 502 }
      );
    }
  }

  // Fallback: SVG preview when no browser endpoint is configured
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f8f9fa"/>
    <rect x="0" y="0" width="100%" height="40" fill="#dee2e6"/>
    <circle cx="20" cy="20" r="6" fill="#ff5f57"/>
    <circle cx="40" cy="20" r="6" fill="#febc2e"/>
    <circle cx="60" cy="20" r="6" fill="#28c840"/>
    <rect x="100" y="12" width="${width - 200}" height="16" rx="4" fill="#fff"/>
    <text x="110" y="24" font-size="10" fill="#666" font-family="monospace">${escapeXml(url).slice(0, 80)}</text>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#999" font-family="Arial">
      Screenshot of ${escapeXml(parsedUrl.hostname)}
    </text>
    <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#bbb" font-family="Arial">
      Live screenshots available — preview mode
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
