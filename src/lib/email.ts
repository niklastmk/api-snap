import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendGenerationEmail({
  to,
  shortCode,
  targetUrl,
}: {
  to: string;
  shortCode: string;
  targetUrl: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[snapqr] RESEND_API_KEY not set — skipping generation email for", shortCode);
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";
  const statsUrl = `${appUrl}/s/${shortCode}`;
  const qrImageUrl = `${appUrl}/api/snapqr/qr/${shortCode}`;

  await resend.emails.send({
    from: "SnapQR <notifications@api-snap.com>",
    to,
    subject: "Your QR code is ready — track every scan here",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 22px; color: #111; margin-bottom: 8px;">Your QR code is ready</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.5;">
          Here's the QR code for <strong>${escapeHtml(targetUrl)}</strong>:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${qrImageUrl}" alt="Your QR code" width="180" height="180" style="border-radius: 8px;" />
        </div>
        <p style="font-size: 15px; color: #555; line-height: 1.5; margin-bottom: 4px;">
          <strong>Bookmark your stats link:</strong>
        </p>
        <p style="font-size: 17px; margin: 0 0 16px 0;">
          <a href="${statsUrl}" style="color: #2563eb; font-weight: 600; word-break: break-all;">${statsUrl}</a>
        </p>
        <a href="${statsUrl}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; margin: 4px 0 16px 0;">
          View your stats &rarr;
        </a>
        <p style="font-size: 13px; color: #888; line-height: 1.5; margin-top: 16px;">
          This is the only way to find your QR code stats later. Save this email or bookmark the link above.
        </p>
        <p style="font-size: 13px; color: #999; margin-top: 24px;">
          You're receiving this because you provided your email when creating this QR code on SnapQR.
        </p>
      </div>
    `,
  });

  return true;
}

export async function sendFirstScanEmail({
  to,
  shortCode,
}: {
  to: string;
  shortCode: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[snapqr] RESEND_API_KEY not set — skipping first-scan email for", shortCode);
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";
  const statsUrl = `${appUrl}/s/${shortCode}`;
  const upgradeUrl = `${appUrl}/snapqr/upgrade?code=${shortCode}`;

  await resend.emails.send({
    from: "SnapQR <notifications@api-snap.com>",
    to,
    subject: "Your QR code stats link",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 22px; color: #111; margin-bottom: 8px;">Here's your QR code stats link</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.5;">
          Your QR code <strong>${shortCode}</strong> just got its first scan! Here's your link to track scans:
        </p>
        <a href="${statsUrl}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; margin: 16px 0;">
          View your stats &rarr;
        </a>
        <p style="font-size: 15px; color: #555; line-height: 1.5; margin-top: 16px;">
          Want deeper insights — location, device, time of day, and more?
          <a href="${upgradeUrl}" style="color: #2563eb; text-decoration: underline;">Upgrade to QR Pro for $7/mo</a>
        </p>
        <p style="font-size: 13px; color: #999; margin-top: 24px;">
          You're receiving this because you opted in when creating this QR code.
        </p>
      </div>
    `,
  });

  return true;
}
