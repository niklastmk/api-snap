import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapQR — QR codes that track every scan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          SnapQR
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          QR codes that track every scan — real-time analytics with location,
          device & browser data
        </div>
        <div style={{ fontSize: 22, color: "#38bdf8", marginTop: 32 }}>
          Free tier · No signup · $7/mo Pro
        </div>
      </div>
    ),
    { ...size },
  );
}
