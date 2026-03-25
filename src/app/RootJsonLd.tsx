"use client";

import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "API Snap",
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

export default function RootJsonLd() {
  const pathname = usePathname();

  if (pathname.startsWith("/snapqr")) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
