import { NextRequest, NextResponse } from "next/server";
import { checkPlaygroundRateLimit } from "@/lib/playground-rate-limit";
import crypto from "crypto";
import { nanoid } from "nanoid";

// Lightweight playground proxy that runs a subset of endpoints without auth
// This lets visitors try the API before signing up

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkPlaygroundRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Playground rate limit exceeded. Sign up for free to get 100 calls/month.",
        signupUrl: "/signup",
      },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.endpoint) {
    return NextResponse.json({ error: "Missing endpoint field" }, { status: 400 });
  }

  const headers = { "X-Playground-Remaining": String(remaining) };

  try {
    const result = await executeEndpoint(body.endpoint, body.params || {});
    return NextResponse.json(result, { headers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400, headers });
  }
}

async function executeEndpoint(endpoint: string, params: Record<string, unknown>): Promise<unknown> {
  switch (endpoint) {
    case "qr": {
      // Return a demo response (actual QR generation requires the full endpoint)
      const data = (params.data as string) || "https://snapapi.dev";
      return {
        message: "QR code generated successfully",
        data,
        size: params.size || 300,
        format: params.format || "png",
        note: "In production, this returns the actual image binary. Sign up to get image responses.",
      };
    }

    case "uuid": {
      const format = (params.format as string) || "uuid";
      const count = Math.min(Math.max(Number(params.count || 1), 1), 10);
      const prefix = (params.prefix as string) || "";
      const ids: string[] = [];

      for (let i = 0; i < count; i++) {
        let id: string;
        switch (format) {
          case "uuid": case "v4": id = crypto.randomUUID(); break;
          case "nanoid": id = nanoid(); break;
          case "nanoid-short": id = nanoid(10); break;
          case "hex": id = crypto.randomBytes(16).toString("hex"); break;
          case "base64": id = crypto.randomBytes(16).toString("base64url"); break;
          case "numeric": id = Array.from(crypto.randomBytes(16)).map((b) => b % 10).join(""); break;
          case "timestamp": id = `${Date.now().toString(36)}_${crypto.randomBytes(8).toString("base64url")}`; break;
          default: throw new Error(`Invalid format. Supported: uuid, v4, nanoid, nanoid-short, hex, base64, numeric, timestamp`);
        }
        ids.push(prefix ? `${prefix}${id}` : id);
      }
      return count === 1 ? { id: ids[0] } : { ids };
    }

    case "hash": {
      const text = params.text as string;
      if (!text) throw new Error("Missing required parameter: text");
      const algorithm = (params.algorithm as string) || "sha256";
      const encoding = (params.encoding as string) || "hex";
      const supported = ["md5", "sha1", "sha256", "sha512"];
      if (!supported.includes(algorithm)) throw new Error(`Invalid algorithm. Supported: ${supported.join(", ")}`);
      const hash = crypto.createHash(algorithm).update(text).digest(encoding as crypto.BinaryToTextEncoding);
      return { hash, algorithm, encoding };
    }

    case "base64": {
      const input = params.input as string;
      if (input === undefined) throw new Error("Missing required field: input");
      const action = (params.action as string) || "encode";
      const urlSafe = params.urlSafe ?? false;
      if (action === "encode") {
        const result = urlSafe
          ? Buffer.from(input, "utf-8").toString("base64url")
          : Buffer.from(input, "utf-8").toString("base64");
        return { result, action: "encode" };
      }
      if (action === "decode") {
        const result = Buffer.from(input, (urlSafe ? "base64url" : "base64") as BufferEncoding).toString("utf-8");
        return { result, action: "decode" };
      }
      throw new Error('Invalid action. Supported: "encode", "decode"');
    }

    case "jwt-decode": {
      const token = params.token as string;
      if (!token) throw new Error("Missing required field: token");
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      const decode = (s: string) => JSON.parse(Buffer.from(s + "=".repeat((4 - (s.length % 4)) % 4), "base64url").toString("utf-8"));
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const result: Record<string, unknown> = { header, payload };
      if (payload.exp) {
        result.expired = new Date(payload.exp * 1000) < new Date();
        result.expiresAt = new Date(payload.exp * 1000).toISOString();
      }
      return result;
    }

    case "color": {
      const color = params.color as string;
      if (!color) throw new Error("Missing required parameter: color");
      const clean = color.replace(/^#/, "");
      let r: number, g: number, b: number;
      if (/^[0-9a-fA-F]{3,6}$/.test(clean)) {
        const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
        const num = parseInt(full, 16);
        r = (num >> 16) & 255; g = (num >> 8) & 255; b = num & 255;
      } else {
        throw new Error("Use hex format (e.g., ff0000 or #ff0000)");
      }
      const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
      const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
      const l = (max + min) / 2;
      return { hex, rgb: { r, g, b }, rgbString: `rgb(${r}, ${g}, ${b})`, brightness: Math.round((r * 299 + g * 587 + b * 114) / 1000), isDark: (r * 299 + g * 587 + b * 114) / 1000 < 128 };
    }

    case "lorem": {
      const WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
      const paragraphs = Math.min(Math.max(Number(params.paragraphs || 2), 1), 5);
      const sentences = Math.min(Math.max(Number(params.sentences || 3), 1), 10);
      const paras = Array.from({ length: paragraphs }, () =>
        Array.from({ length: sentences }, () => {
          const words = Array.from({ length: crypto.randomInt(5, 12) }, () => WORDS[crypto.randomInt(WORDS.length)]);
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
          return words.join(" ") + ".";
        }).join(" ")
      );
      return { text: paras.join("\n\n"), paragraphs: paras };
    }

    case "markdown": {
      const md = params.markdown as string;
      if (!md) throw new Error("Missing required field: markdown");
      // Simple markdown to HTML conversion
      let html = md
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>");
      html = `<p>${html}</p>`;
      return { html };
    }

    case "placeholder": {
      const w = Math.min(Math.max(Number(params.w || 300), 1), 2000);
      const h = Math.min(Math.max(Number(params.h || 200), 1), 2000);
      const bg = (params.bg as string) || "cccccc";
      const fg = (params.fg as string) || "666666";
      const text = (params.text as string) || `${w}x${h}`;
      return {
        message: "Placeholder image generated",
        width: w, height: h,
        note: "In production, returns an SVG image. Sign up for actual image responses.",
        preview: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="#${bg}" width="${w}" height="${h}"/><text fill="#${fg}" font-family="sans-serif" font-size="20" x="50%" y="50%" text-anchor="middle" dy=".3em">${text}</text></svg>`,
      };
    }

    default:
      throw new Error(`Unknown endpoint: ${endpoint}. Available: qr, uuid, hash, base64, jwt-decode, color, lorem, markdown, placeholder`);
  }
}
