import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
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

  // Query scan count for display on interstitial
  const [{ total }] = await db
    .select({ total: count() })
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id));

  const scanCount = Number(total);
  const targetUrl = link.targetUrl;
  const targetDomain = new URL(targetUrl).hostname;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="3;url=${targetUrl}">
  <title>Redirecting — SnapQR</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      color: #1e293b;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.06);
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #6d28d9;
      margin-bottom: 4px;
    }
    .logo span { color: #1e293b; }
    .subtitle {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 24px;
    }
    .scan-count {
      font-size: 36px;
      font-weight: 700;
      color: #6d28d9;
    }
    .scan-label {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 24px;
    }
    .destination {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 12px;
      word-break: break-all;
    }
    .continue-btn {
      display: inline-block;
      background: #6d28d9;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 28px;
      border-radius: 10px;
      margin-bottom: 8px;
      transition: background 0.15s;
    }
    .continue-btn:hover { background: #5b21b6; }
    .countdown {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .cta {
      font-size: 13px;
      color: #64748b;
    }
    .cta a {
      color: #6d28d9;
      font-weight: 600;
      text-decoration: none;
    }
    .cta a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Snap<span>QR</span></div>
    <div class="subtitle">This QR code is tracked by SnapQR</div>

    <div class="scan-count">${scanCount.toLocaleString()}</div>
    <div class="scan-label">total scans</div>

    <div class="destination">→ ${targetDomain}</div>
    <a class="continue-btn" href="${targetUrl}">Continue to ${targetDomain} →</a>
    <div class="countdown" id="countdown">Redirecting in <strong>3</strong>…</div>

    <hr class="divider">
    <div class="cta">Create your own free trackable QR code →<br><a href="https://api-snap.com/snapqr">api-snap.com/snapqr</a></div>
  </div>

  <script>
    let t = 3;
    const el = document.getElementById('countdown');
    const iv = setInterval(() => {
      t--;
      if (t <= 0) {
        clearInterval(iv);
        window.location.href = ${JSON.stringify(targetUrl)};
      } else {
        el.innerHTML = 'Redirecting in <strong>' + t + '</strong>…';
      }
    }, 1000);
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
