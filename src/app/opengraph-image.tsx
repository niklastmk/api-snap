import { ImageResponse } from "next/og";

export const alt = "SnapAPI — Developer Utility APIs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "64px" }}>⚡</span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            SnapAPI
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#a5b4fc",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          Developer Utility APIs
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          {["QR Codes", "Image Resize", "Screenshots", "Hashing", "UUIDs", "PDF Gen", "Base64", "JWT Decode"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  color: "#c7d2fe",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
        <div
          style={{
            marginTop: "40px",
            fontSize: "22px",
            color: "#94a3b8",
          }}
        >
          One API key. 13+ endpoints. Start free.
        </div>
      </div>
    ),
    { ...size }
  );
}
