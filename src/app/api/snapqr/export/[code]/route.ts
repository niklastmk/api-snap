import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Look up the link
  const linkRows = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .limit(1);

  if (linkRows.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const link = linkRows[0];

  // Check if the requester is a paid user who owns this link
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.plan === "free") {
    return NextResponse.json(
      { error: "CSV export requires a Hobby plan or higher.", upgrade_url: "/pricing" },
      { status: 403 }
    );
  }

  // Verify ownership
  if (link.creatorUserId !== currentUser.id) {
    return NextResponse.json({ error: "You can only export your own links." }, { status: 403 });
  }

  // Fetch all scans
  const scans = await db
    .select()
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id))
    .orderBy(desc(scanEvents.scannedAt));

  // Build CSV
  const header = "Date,Device,Browser,OS,Country,City,IP,Referer";
  const rows = scans.map((s) =>
    [
      s.scannedAt ? new Date(s.scannedAt).toISOString() : "",
      s.device ?? "",
      s.browser ?? "",
      s.os ?? "",
      s.country ?? "",
      s.city ?? "",
      s.ip ?? "",
      s.referer ?? "",
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="snapqr-${code}-scans.csv"`,
    },
  });
}
