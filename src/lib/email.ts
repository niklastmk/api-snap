import { Resend } from "resend";

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
