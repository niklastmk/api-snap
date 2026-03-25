import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { authenticateApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FREE_LIFETIME_LIMIT = 3; // QR codes lifetime per IP

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  let body: { url?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let { url, email } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Auto-prepend https:// for bare domains; reject non-http(s) schemes
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Only http and https URLs are supported" }, { status: 400 });
    }
  } else {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Check for API key auth (paid users)
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "") || request.nextUrl.searchParams.get("api_key");
  let userId: string | null = null;
  let isPaid = false;

  if (apiKey) {
    const auth = await authenticateApiKey(apiKey);
    if (auth) {
      userId = auth.user.id;
      isPaid = auth.user.plan !== "free";
    }
  }

  // Enforce free-tier limit: 3 QR codes lifetime per IP
  if (!isPaid) {
    const ipLinks = await db
      .select()
      .from(links)
      .where(eq(links.creatorIp, ip));

    if (ipLinks.length >= FREE_LIFETIME_LIMIT) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";
      return NextResponse.json(
        {
          error: "Free tier limit reached (3 QR codes lifetime). Upgrade for unlimited QR codes.",
          upgrade: true,
          upgrade_url: `${appUrl}/snapqr/upgrade`,
        },
        { status: 429 }
      );
    }
  }

  const shortCode = generateShortCode();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://api-snap.com";

  // Basic email validation — only store if it looks valid
  const cleanEmail = email?.trim().toLowerCase();
  const validEmail = cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ? cleanEmail : null;

  await db.insert(links).values({
    shortCode,
    targetUrl: url,
    creatorIp: ip,
    creatorUserId: userId,
    creatorEmail: validEmail,
  });

  return NextResponse.json({
    shortCode,
    qrUrl: `${appUrl}/api/snapqr/qr/${shortCode}`,
    redirectUrl: `${appUrl}/r/${shortCode}`,
    statsUrl: `${appUrl}/s/${shortCode}`,
  });
}
