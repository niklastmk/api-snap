import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapQR — Free QR Code Generator with Scan Analytics",
  description:
    "Generate free QR codes instantly. Track every scan with real-time analytics — device, browser, location, and more.",
};

export default function SnapQRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
