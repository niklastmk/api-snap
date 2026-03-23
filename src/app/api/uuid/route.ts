import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import { nanoid } from "nanoid";
import crypto from "crypto";

export const GET = createApiHandler("uuid", async (req) => {
  const format = req.nextUrl.searchParams.get("format") || "uuid";
  const count = Math.min(Math.max(Number(req.nextUrl.searchParams.get("count") || 1), 1), 100);
  const prefix = req.nextUrl.searchParams.get("prefix") || "";

  const ids: string[] = [];

  for (let i = 0; i < count; i++) {
    let id: string;

    switch (format) {
      case "uuid":
      case "v4":
        id = crypto.randomUUID();
        break;
      case "nanoid":
        id = nanoid();
        break;
      case "nanoid-short":
        id = nanoid(10);
        break;
      case "hex":
        id = crypto.randomBytes(16).toString("hex");
        break;
      case "base64":
        id = crypto.randomBytes(16).toString("base64url");
        break;
      case "numeric":
        id = Array.from(crypto.randomBytes(16))
          .map((b) => b % 10)
          .join("");
        break;
      case "timestamp": {
        const ts = Date.now().toString(36);
        const rand = crypto.randomBytes(8).toString("base64url");
        id = `${ts}_${rand}`;
        break;
      }
      default:
        return NextResponse.json(
          {
            error: `Invalid format. Supported: uuid, v4, nanoid, nanoid-short, hex, base64, numeric, timestamp`,
          },
          { status: 400 }
        );
    }

    ids.push(prefix ? `${prefix}${id}` : id);
  }

  return NextResponse.json(
    count === 1 ? { id: ids[0] } : { ids },
    { headers: { "Cache-Control": "no-store" } }
  );
});
