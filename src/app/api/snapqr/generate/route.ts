import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, users } from "@/lib/schema";
import { eq, and, gte } from "drizzle-orm";
import { authenticateApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FREE_TIER_LIMIT = 5; // QR codes per IP per 24h

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL. Must start with http:// or https://" }, { status: 400 });
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

  // Enforce free-tier limit for unauthenticated or free users
  if (!isPaid) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLinks = await db
      .select()
      .from(links)
      .where(and(eq(links.creatorIp, ip), gte(links.createdAt, oneDayAgo)));

    if (recentLinks.length >= FREE_TIER_LIMIT) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";
      return NextResponse.json(
        {
          error: `Free tier limit reached (${FREE_TIER_LIMIT}/day). Upgrade for unlimited QR codes.`,
          upgrade: true,
          upgrade_url: `${appUrl}/pricing`,
        },
        { status: 429 }
      );
    }
  }

  const shortCode = generateShortCode();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://api-snap.com";

  await db.insert(links).values({
    shortCode,
    targetUrl: url,
    creatorIp: ip,
    creatorUserId: userId,
  });

  return NextResponse.json({
    shortCode,
    qrUrl: `${appUrl}/api/snapqr/qr/${shortCode}`,
    redirectUrl: `${appUrl}/r/${shortCode}`,
    statsUrl: `${appUrl}/s/${shortCode}`,
  });
}
