import type { Metadata } from "next";
import PricingClient from "./pricing-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

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

export default function PricingPage() {
  return <PricingClient />;
}
