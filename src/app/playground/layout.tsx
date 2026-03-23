import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

export const metadata: Metadata = {
  title: "API Playground — Try Every Endpoint Live",
  description:
    "Test all 13+ SnapAPI endpoints live in your browser. Generate QR codes, resize images, hash strings, create UUIDs, and more — no signup required to explore.",
  keywords: [
    "API playground",
    "try API online",
    "QR code API demo",
    "developer API test",
    "REST API playground",
  ],
  openGraph: {
    title: "SnapAPI Playground — Test APIs in Your Browser",
    description:
      "Try all 13+ developer utility APIs live. No signup required to explore.",
    url: `${baseUrl}/playground`,
  },
  alternates: { canonical: `${baseUrl}/playground` },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
