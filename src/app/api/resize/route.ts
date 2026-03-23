import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import sharp from "sharp";

export const POST = createApiHandler("resize", async (req) => {
  const contentType = req.headers.get("content-type") || "";
  let imageBuffer: Buffer;
  let width = 0;
  let height = 0;
  let format = "png";
  let quality = 80;
  let fit: "cover" | "contain" | "fill" | "inside" | "outside" = "cover";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing 'image' in form data" },
        { status: 400 }
      );
    }

    imageBuffer = Buffer.from(await file.arrayBuffer());
    width = Number(formData.get("width") || 0);
    height = Number(formData.get("height") || 0);
    format = (formData.get("format") as string) || "png";
    quality = Number(formData.get("quality") || 80);
    fit = (formData.get("fit") as typeof fit) || "cover";
  } else {
    // JSON body with base64 image or URL
    const body = await req.json();

    if (body.url) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(body.url, { signal: controller.signal });
      clearTimeout(timeout);
      imageBuffer = Buffer.from(await res.arrayBuffer());
    } else if (body.image) {
      imageBuffer = Buffer.from(body.image, "base64");
    } else {
      return NextResponse.json(
        { error: "Provide 'image' (base64) or 'url' in request body" },
        { status: 400 }
      );
    }

    width = Number(body.width || 0);
    height = Number(body.height || 0);
    format = body.format || "png";
    quality = Number(body.quality || 80);
    fit = body.fit || "cover";
  }

  if (!width && !height) {
    return NextResponse.json(
      { error: "Provide at least 'width' or 'height'" },
      { status: 400 }
    );
  }

  // Clamp dimensions
  width = Math.min(width || 0, 4096);
  height = Math.min(height || 0, 4096);
  quality = Math.min(Math.max(quality, 1), 100);

  try {
    let pipeline = sharp(imageBuffer).resize({
      width: width || undefined,
      height: height || undefined,
      fit,
    });

    let contentTypeOut: string;

    switch (format) {
      case "webp":
        pipeline = pipeline.webp({ quality });
        contentTypeOut = "image/webp";
        break;
      case "jpeg":
      case "jpg":
        pipeline = pipeline.jpeg({ quality });
        contentTypeOut = "image/jpeg";
        break;
      case "avif":
        pipeline = pipeline.avif({ quality });
        contentTypeOut = "image/avif";
        break;
      default:
        pipeline = pipeline.png();
        contentTypeOut = "image/png";
    }

    const output = await pipeline.toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: { "Content-Type": contentTypeOut },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process image. Ensure the input is a valid image." },
      { status: 400 }
    );
  }
});
