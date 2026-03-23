import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

export const GET = createApiHandler("meta", async (req) => {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' parameter" },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "SnapAPI Meta Bot/1.0 (+https://snapapi.dev)",
        Accept: "text/html",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const meta = extractMeta(html, url);

    return NextResponse.json(meta, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch URL" },
      { status: 502 }
    );
  }
});

function extractMeta(html: string, url: string) {
  const get = (pattern: RegExp): string | null => {
    const match = html.match(pattern);
    return match ? decodeEntities(match[1]) : null;
  };

  return {
    url,
    title:
      get(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/) ??
      get(/<meta[^>]+name="twitter:title"[^>]+content="([^"]*)"/) ??
      get(/<title[^>]*>([^<]*)<\/title>/) ??
      null,
    description:
      get(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/) ??
      get(/<meta[^>]+name="description"[^>]+content="([^"]*)"/) ??
      get(/<meta[^>]+name="twitter:description"[^>]+content="([^"]*)"/) ??
      null,
    image:
      get(/<meta[^>]+property="og:image"[^>]+content="([^"]*)"/) ??
      get(/<meta[^>]+name="twitter:image"[^>]+content="([^"]*)"/) ??
      null,
    siteName:
      get(/<meta[^>]+property="og:site_name"[^>]+content="([^"]*)"/) ?? null,
    type: get(/<meta[^>]+property="og:type"[^>]+content="([^"]*)"/) ?? null,
    favicon: resolveFavicon(html, url),
    themeColor:
      get(/<meta[^>]+name="theme-color"[^>]+content="([^"]*)"/) ?? null,
    author: get(/<meta[^>]+name="author"[^>]+content="([^"]*)"/) ?? null,
    published:
      get(/<meta[^>]+property="article:published_time"[^>]+content="([^"]*)"/) ?? null,
  };
}

function resolveFavicon(html: string, url: string): string | null {
  const match = html.match(
    /<link[^>]+rel="(?:icon|shortcut icon)"[^>]+href="([^"]*)"/
  );
  if (!match) return null;
  try {
    return new URL(match[1], url).href;
  } catch {
    return match[1];
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}
