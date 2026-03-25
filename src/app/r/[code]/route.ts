import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { UAParser } from "ua-parser-js";
import { sendFirstScanEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function getCountryFromHeaders(request: NextRequest): string | null {
  return (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("x-country-code") ??
    null
  );
}

async function lookupCountry(ip: string): Promise<string | null> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    return null;
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      return data.countryCode ?? null;
    }
  } catch (err) {
    console.error("[snapqr] geo lookup failed for", ip, err);
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const rows = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .limit(1);

  if (rows.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const link = rows[0];

  // Fire scan event async — don't block redirect
  const userAgentString = request.headers.get("user-agent") ?? "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const referer = request.headers.get("referer") ?? "";

  (async () => {
    try {
      const parser = new UAParser(userAgentString);
      const ua = parser.getResult();
      const device = ua.device.type ?? "desktop";
      const browser = ua.browser.name ?? "";
      const os = ua.os.name ?? "";
      const country = getCountryFromHeaders(request) ?? (await lookupCountry(ip));

      await db.insert(scanEvents).values({
        linkId: link.id,
        userAgent: userAgentString,
        ip,
        country,
        device,
        browser,
        os,
        referer,
      });

      // Send first-scan notification email if creator opted in
      if (link.creatorEmail && !link.firstScanEmailSent) {
        // Optimistic lock: mark as sent first to prevent duplicate emails from concurrent scans
        const updated = await db
          .update(links)
          .set({ firstScanEmailSent: true })
          .where(eq(links.id, link.id))
          .returning({ id: links.id });

        if (updated.length > 0) {
          try {
            const sent = await sendFirstScanEmail({
              to: link.creatorEmail,
              shortCode: link.shortCode,
            });
            if (sent) {
              console.log("[snapqr] first-scan email sent to", link.creatorEmail, "for", link.shortCode);
            }
          } catch (emailErr) {
            // Roll back the flag so it can be retried on the next scan
            await db
              .update(links)
              .set({ firstScanEmailSent: false })
              .where(eq(links.id, link.id));
            console.error("[snapqr] first-scan email failed for", link.shortCode, emailErr);
          }
        }
      }
    } catch (err) {
      console.error("[snapqr] scan event insert failed for link", link.id, err);
    }
  })();

  return NextResponse.redirect(link.targetUrl, { status: 302 });
}
