import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";

export const POST = createApiHandler("base64", async (req) => {
  const body = await req.json().catch(() => null);
  if (!body?.input && body?.input !== "") {
    return NextResponse.json({ error: "Missing required field: input" }, { status: 400 });
  }

  const action = body.action || "encode";
  const urlSafe = body.urlSafe ?? false;

  if (action === "encode") {
    const encoded = urlSafe
      ? Buffer.from(body.input, "utf-8").toString("base64url")
      : Buffer.from(body.input, "utf-8").toString("base64");
    return NextResponse.json({ result: encoded, action: "encode" });
  }

  if (action === "decode") {
    try {
      const decoded = Buffer.from(body.input, urlSafe ? "base64url" : "base64").toString("utf-8");
      return NextResponse.json({ result: decoded, action: "decode" });
    } catch {
      return NextResponse.json({ error: "Invalid base64 input" }, { status: 400 });
    }
  }

  return NextResponse.json(
    { error: 'Invalid action. Supported: "encode", "decode"' },
    { status: 400 }
  );
});
