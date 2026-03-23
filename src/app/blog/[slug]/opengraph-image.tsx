import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

export const alt = "API Snap Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "API Snap Blog";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <span style={{ fontSize: "36px" }}>⚡</span>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#a5b4fc",
              letterSpacing: "-1px",
            }}
          >
            API Snap Blog
          </span>
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "20px",
            color: "#94a3b8",
          }}
        >
          api-snap.com/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
