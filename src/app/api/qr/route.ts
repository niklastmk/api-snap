import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import QRCode from "qrcode";

export const GET = createApiHandler("qr", async (req) => {
  const url = req.nextUrl.searchParams.get("data") || req.nextUrl.searchParams.get("url");
  const size = Math.min(Number(req.nextUrl.searchParams.get("size") || 300), 1000);
  const format = req.nextUrl.searchParams.get("format") || "png";
  const dark = req.nextUrl.searchParams.get("dark") || "#000000";
  const light = req.nextUrl.searchParams.get("light") || "#ffffff";

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'data' or 'url' parameter" },
      { status: 400 }
    );
  }

  if (format === "svg") {
    const svg = await QRCode.toString(url, {
      type: "svg",
      width: size,
      color: { dark, light },
    });
    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const buffer = await QRCode.toBuffer(url, {
    width: size,
    color: { dark, light },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
});
