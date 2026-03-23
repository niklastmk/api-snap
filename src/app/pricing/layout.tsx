const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "API Snap",
  description:
    "Developer utility APIs — QR codes, image resizing, hashing, UUID generation, screenshots, PDF generation, and more.",
  url: `${baseUrl}/pricing`,
  brand: { "@type": "Brand", name: "API Snap" },
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
