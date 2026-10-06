import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents } from "@/lib/schema";
import { eq, inArray, count, desc } from "drizzle-orm";
import { authenticateApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_CODES = 100;

export async function POST(request: NextRequest) {
  let body: { codes?: string[] };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // Check for API key auth (logged-in users)
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "");
  let userId: string | null = null;

  if (apiKey) {
    const auth = await authenticateApiKey(apiKey);
    if (auth) {
      userId = auth.user.id;
    }
  }

  // For logged-in users: fetch their codes from DB
  // For anonymous users: look up the codes they sent from localStorage
  let linkRows: { id: number; shortCode: string; targetUrl: string; createdAt: Date }[];

  if (userId) {
    linkRows = await db
      .select({
        id: links.id,
        shortCode: links.shortCode,
        targetUrl: links.targetUrl,
        createdAt: links.createdAt,
      })
      .from(links)
      .where(eq(links.creatorUserId, userId))
      .orderBy(desc(links.createdAt))
      .limit(MAX_CODES);
  } else {
    const codes = body.codes;
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Sanitize: only allow valid-looking short codes, cap at MAX_CODES
    const validCodes = codes
      .filter((c): c is string => typeof c === "string" && /^[a-zA-Z0-9]{1,20}$/.test(c))
      .slice(0, MAX_CODES);

    if (validCodes.length === 0) {
      return NextResponse.json({ items: [] });
    }

    linkRows = await db
      .select({
        id: links.id,
        shortCode: links.shortCode,
        targetUrl: links.targetUrl,
        createdAt: links.createdAt,
      })
      .from(links)
      .where(inArray(links.shortCode, validCodes))
      .orderBy(desc(links.createdAt));
  }

  if (linkRows.length === 0) {
    return NextResponse.json({ items: [] });
  }

  // Batch-fetch scan counts for all links
  const linkIds = linkRows.map((l) => l.id);
  const scanCounts = await db
    .select({
      linkId: scanEvents.linkId,
      total: count(),
    })
    .from(scanEvents)
    .where(inArray(scanEvents.linkId, linkIds))
    .groupBy(scanEvents.linkId);

  const countMap = new Map(scanCounts.map((s) => [s.linkId, s.total]));

  const items = linkRows.map((l) => ({
    shortCode: l.shortCode,
    targetUrl: l.targetUrl,
    scans: countMap.get(l.id) ?? 0,
    createdAt: l.createdAt.toISOString(),
  }));

  return NextResponse.json({ items });
}
