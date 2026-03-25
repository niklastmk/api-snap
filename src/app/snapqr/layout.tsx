import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapQR — Free QR Code Generator with Scan Analytics",
  description:
    "Generate free QR codes instantly. Track every scan with real-time analytics — device, browser, location, and more.",
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

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
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "Unlimited QR codes, basic analytics" },
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
