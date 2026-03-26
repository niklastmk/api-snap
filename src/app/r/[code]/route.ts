import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { links, scanEvents, users } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { UAParser } from "ua-parser-js";
import { sendFirstScanEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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

  // Check if the QR code creator is a paid user — skip interstitial for paid plans
  let isPaidCreator = false;
  if (link.creatorUserId) {
    const creator = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, link.creatorUserId))
      .limit(1);
    isPaidCreator = creator.length > 0 && creator[0].plan !== "free";
  }

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

  // Paid creators get instant redirect — no interstitial
  if (isPaidCreator) {
    // Validate URL scheme before redirecting
    let parsed: URL;
    try {
      parsed = new URL(link.targetUrl);
    } catch {
      return new NextResponse("Invalid target URL", { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new NextResponse("Invalid URL scheme", { status: 400 });
    }
    return NextResponse.redirect(link.targetUrl, 302);
  }

  // Query scan count for display on interstitial
  const [{ total }] = await db
    .select({ total: count() })
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id));

  const scanCount = Number(total);
  const targetUrl = link.targetUrl;

  // Validate URL scheme to prevent javascript: URIs
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return new NextResponse("Invalid target URL", { status: 400 });
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return new NextResponse("Invalid URL scheme", { status: 400 });
  }

  const targetDomain = parsedUrl.hostname;
  const safeUrl = escapeHtml(targetUrl);
  const safeDomain = escapeHtml(targetDomain);

  const safeCode = escapeHtml(code);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="3;url=${safeUrl}">
  <title>Redirecting — API Snap</title>
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
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      padding: 32px 28px;
      max-width: 380px;
      width: 100%;
      animation: fadeUp 0.35s ease-out;
    }
    .brand {
      margin-bottom: 24px;
    }
    .powered-by {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #6d28d9;
    }
    .logo span { color: #1e293b; }
    .stats {
      background: #f8fafc;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .scan-count {
      font-size: 36px;
      font-weight: 800;
      color: #6d28d9;
      line-height: 1;
    }
    .scan-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .stats-link a {
      font-size: 12px;
      color: #6d28d9;
      text-decoration: none;
      font-weight: 500;
    }
    .stats-link a:hover { text-decoration: underline; }
    .destination {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 14px;
      word-break: break-all;
    }
    .continue-btn {
      display: inline-block;
      background: #6d28d9;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 12px 32px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(109,40,217,0.25);
      transition: background 0.15s, box-shadow 0.15s;
      cursor: pointer;
    }
    .continue-btn:hover {
      background: #5b21b6;
      box-shadow: 0 2px 12px rgba(109,40,217,0.35);
    }
    .progress-track {
      width: 120px;
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      margin: 12px auto 0;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: #6d28d9;
      border-radius: 2px;
      width: 100%;
      animation: shrink 3s linear forwards;
    }
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
    .countdown {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 6px;
      margin-bottom: 20px;
    }
    .divider {
      border: none;
      border-top: 1px solid #f1f5f9;
      margin: 0 0 16px;
    }
    .cta {
      font-size: 12px;
      color: #94a3b8;
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
    <div class="brand">
      <div class="powered-by">Powered by</div>
      <div class="logo">API <span>Snap</span></div>
    </div>

    <div class="stats">
      <div class="scan-count">${scanCount.toLocaleString()}</div>
      <div class="scan-label">total scans</div>
      <div class="stats-link"><a href="https://api-snap.com/s/${safeCode}">View analytics</a></div>
    </div>

    <div class="destination">${safeDomain}</div>
    <a class="continue-btn" href="${safeUrl}">Continue</a>
    <div class="progress-track"><div class="progress-bar"></div></div>
    <div class="countdown" id="countdown">Redirecting in 3s</div>

    <hr class="divider">
    <div class="cta">Free QR codes with analytics &middot; <a href="https://api-snap.com/snapqr">Create yours</a></div>
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
        el.textContent = 'Redirecting in ' + t + 's';
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
