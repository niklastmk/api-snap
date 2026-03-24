import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }

  const linkRows = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .limit(1);

  if (linkRows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(scanEvents)
    .where(eq(scanEvents.linkId, linkRows[0].id));

  return NextResponse.json({ code, total });
}
