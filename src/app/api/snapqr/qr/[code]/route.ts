import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import sharp from "sharp";
import { db } from "@/lib/db";
import { links, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://api-snap.com";
  const redirectUrl = `${appUrl}/r/${code}`;

  const pngBuffer = await QRCode.toBuffer(redirectUrl, {
    type: "png",
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // Determine if this is a paid user
  let isPaid = false;

  try {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, code))
      .limit(1);

    if (link?.creatorUserId) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, link.creatorUserId))
        .limit(1);

      if (user && user.plan && user.plan !== "free") {
        isPaid = true;
      }
    }
  } catch (err) {
    console.error("[snapqr] paid-user lookup failed for code", code, err);
  }

  if (isPaid) {
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Free user (or demo/unknown code): add branding label below the QR code
  const brandingSvg = Buffer.from(
    `<svg width="400" height="436">
  <rect x="0" y="400" width="400" height="36" fill="white"/>
  <text x="200" y="424"
    font-family="DejaVu Sans, Liberation Sans, sans-serif"
    font-size="14"
    fill="#4b5563"
    text-anchor="middle"
  ><tspan font-weight="700">SnapQR</tspan> — free scan analytics</text>
</svg>`
  );

  const brandedBuffer = await sharp(pngBuffer)
    .extend({ bottom: 36, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .composite([{ input: brandingSvg, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return new NextResponse(new Uint8Array(brandedBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
