import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import crypto from "crypto";

export const GET = createApiHandler("hash", async (req) => {
  const text = req.nextUrl.searchParams.get("text");
  const algorithm = req.nextUrl.searchParams.get("algorithm") || "sha256";
  const encoding = (req.nextUrl.searchParams.get("encoding") || "hex") as crypto.BinaryToTextEncoding;

  if (!text) {
    return NextResponse.json({ error: "Missing required parameter: text" }, { status: 400 });
  }

  const supported = ["md5", "sha1", "sha256", "sha512", "sha384", "sha3-256", "sha3-512"];
  if (!supported.includes(algorithm)) {
    return NextResponse.json(
      { error: `Invalid algorithm. Supported: ${supported.join(", ")}` },
      { status: 400 }
    );
  }

  const validEncodings = ["hex", "base64", "base64url"];
  if (!validEncodings.includes(encoding)) {
    return NextResponse.json(
      { error: `Invalid encoding. Supported: ${validEncodings.join(", ")}` },
      { status: 400 }
    );
  }

  const hash = crypto.createHash(algorithm).update(text).digest(encoding);

  return NextResponse.json({ hash, algorithm, encoding });
});

export const POST = createApiHandler("hash", async (req) => {
  const body = await req.json().catch(() => null);
  if (!body?.text) {
    return NextResponse.json({ error: "Missing required field: text" }, { status: 400 });
  }

  const algorithm = body.algorithm || "sha256";
  const encoding = body.encoding || "hex";

  const supported = ["md5", "sha1", "sha256", "sha512", "sha384", "sha3-256", "sha3-512"];
  if (!supported.includes(algorithm)) {
    return NextResponse.json(
      { error: `Invalid algorithm. Supported: ${supported.join(", ")}` },
      { status: 400 }
    );
  }

  const hash = crypto.createHash(algorithm).update(body.text).digest(encoding);

  return NextResponse.json({ hash, algorithm, encoding });
});
