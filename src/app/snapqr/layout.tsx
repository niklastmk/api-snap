import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

export const metadata: Metadata = {
  title: "SnapQR — QR codes that track every scan",
  description:
    "Create a free QR code and see who scans it — real-time analytics with location, device, and browser data. Free tier, no signup. $7/mo Pro.",
  keywords: [
    "QR code generator",
    "QR code analytics",
    "QR code tracker",
    "scan analytics",
    "free QR code",
    "dynamic QR code",
    "QR code statistics",
  ],
  alternates: { canonical: `${baseUrl}/snapqr` },
  openGraph: {
    title: "SnapQR — QR codes that track every scan",
    description:
      "Create a free QR code and see who scans it — real-time analytics with location, device, and browser data. Free tier, no signup. $7/mo Pro.",
    url: `${baseUrl}/snapqr`,
    siteName: "SnapQR",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapQR — QR codes that track every scan",
    description:
      "Create a free QR code and see who scans it — real-time analytics with location, device, and browser data. Free tier, no signup. $7/mo Pro.",
  },
};

const snapQrJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SnapQR",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  description:
    "Free QR code generator with real-time scan analytics — device, browser, location, and more.",
  url: `${baseUrl}/snapqr`,
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "3 QR codes per month, basic analytics" },
    { "@type": "Offer", name: "Pro", price: "7", priceCurrency: "USD", description: "Advanced analytics, custom branding" },
  ],
};

export default function SnapQRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(snapQrJsonLd) }}
      />
      {children}
    </>
  );
}
