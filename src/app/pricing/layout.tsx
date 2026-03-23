import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SnapAPI",
  description:
    "Developer utility APIs — QR codes, image resizing, hashing, UUID generation, screenshots, PDF generation, and more.",
  url: `${baseUrl}/pricing`,
  brand: { "@type": "Brand", name: "SnapAPI" },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "100 API calls/month, all endpoints, no credit card required",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Hobby",
      price: "9",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "9",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
      description: "5,000 API calls/month, email support",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "29",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "29",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
      description: "50,000 API calls/month, priority support, higher rate limits",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Business",
      price: "99",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "99",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
      description: "500,000 API calls/month, dedicated support, SLA guarantee",
      availability: "https://schema.org/InStock",
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing — Simple API Pricing from Free to Business",
  description:
    "Start free with 100 API calls/month. Scale to 500,000 calls with the Business plan. All plans include every endpoint — QR codes, image resize, hashing, and 13+ APIs. No hidden fees.",
  keywords: [
    "API pricing",
    "developer API cost",
    "QR code API pricing",
    "image resize API pricing",
    "utility API plans",
    "free API tier",
  ],
  openGraph: {
    title: "SnapAPI Pricing — Start Free, Scale as You Grow",
    description:
      "100 free API calls/month. Paid plans from $9/mo. All 13+ endpoints included in every plan.",
    url: `${baseUrl}/pricing`,
    type: "website",
  },
  alternates: { canonical: `${baseUrl}/pricing` },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {children}
    </>
  );
}
