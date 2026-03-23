import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

export const metadata: Metadata = {
  title: {
    default: "SnapAPI — Developer Utility APIs | QR Codes, Hashing, Image Resize & More",
    template: "%s | SnapAPI",
  },
  description:
    "Ship faster with ready-made APIs. QR codes, image resizing, hashing, UUID generation, metadata extraction, and 13+ developer utilities. One API key, simple pricing, instant access.",
  keywords: [
    "developer API", "QR code API", "image resize API", "UUID generator API",
    "hash API", "base64 API", "placeholder image API", "JWT decode API",
    "screenshot API", "PDF generation API", "developer tools", "REST API",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "SnapAPI — Every Developer API You Need",
    description: "QR codes, image resizing, hashing, UUIDs, and 13+ utility APIs. One key. One line of code. Start free.",
    url: baseUrl,
    siteName: "SnapAPI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapAPI — Developer Utility APIs",
    description: "13+ ready-made APIs for QR codes, image processing, hashing, and more. Start free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SnapAPI",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: "Developer utility APIs — QR codes, image resizing, hashing, UUID generation, and more.",
  url: baseUrl,
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "100 API calls/month" },
    { "@type": "Offer", name: "Hobby", price: "9", priceCurrency: "USD", description: "5,000 API calls/month" },
    { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD", description: "50,000 API calls/month" },
    { "@type": "Offer", name: "Business", price: "99", priceCurrency: "USD", description: "500,000 API calls/month" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
