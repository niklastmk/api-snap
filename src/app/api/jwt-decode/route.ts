import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

function base64UrlDecode(str: string): string {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded, "base64url").toString("utf-8");
}

export const POST = createApiHandler("jwt-decode", async (req) => {
  const body = await req.json().catch(() => null);
  if (!body?.token) {
    return NextResponse.json({ error: "Missing required field: token" }, { status: 400 });
  }

  const parts = body.token.split(".");
  if (parts.length !== 3) {
    return NextResponse.json(
      { error: "Invalid JWT format. Expected 3 dot-separated parts." },
      { status: 400 }
    );
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    const result: Record<string, unknown> = { header, payload };

    // Add human-readable expiry info if present
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      result.expired = expDate < new Date();
      result.expiresAt = expDate.toISOString();
    }

    if (payload.iat) {
      result.issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to decode JWT. Invalid base64url encoding or JSON." },
      { status: 400 }
    );
  }
});
