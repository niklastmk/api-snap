import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

export const metadata: Metadata = {
  title: "SnapQR Pro — Upgrade for advanced scan analytics",
  description:
    "Unlock custom domains, detailed scan analytics, and unlimited QR codes with SnapQR Pro for $7/mo.",
  openGraph: {
    title: "SnapQR Pro — Upgrade for advanced scan analytics",
    description:
      "Unlock custom domains, detailed scan analytics, and unlimited QR codes with SnapQR Pro for $7/mo.",
    url: `${baseUrl}/snapqr/upgrade`,
    siteName: "SnapQR",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapQR Pro — Upgrade for advanced scan analytics",
    description:
      "Unlock custom domains, detailed scan analytics, and unlimited QR codes with SnapQR Pro for $7/mo.",
  },
};

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
