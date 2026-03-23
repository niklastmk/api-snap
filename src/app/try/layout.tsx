import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

export const metadata: Metadata = {
  title: "Try the API — See It Work in Seconds",
  description:
    "Enter any URL and instantly get a QR code or metadata extract. No signup, no API key. See what API Snap can do in one click.",
  keywords: [
    "try API free",
    "QR code generator API",
    "URL metadata API",
    "API demo",
    "developer tools API",
  ],
  openGraph: {
    title: "Try API Snap — Live API in One Click",
    description:
      "Enter a URL, get a QR code or metadata extract instantly. No signup required.",
    url: `${baseUrl}/try`,
  },
  alternates: { canonical: `${baseUrl}/try` },
};

export default function TryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
