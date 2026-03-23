import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

export const metadata: Metadata = {
  title: "Sign Up — Get Your Free API Key",
  description:
    "Create a free SnapAPI account in 30 seconds. Get instant access to 13+ developer utility APIs — QR codes, image resize, hashing, and more. No credit card required.",
  keywords: [
    "free API key",
    "developer API signup",
    "QR code API free",
    "utility API registration",
  ],
  openGraph: {
    title: "Get Your Free SnapAPI Key",
    description:
      "Sign up in 30 seconds. 100 free API calls/month. No credit card required.",
    url: `${baseUrl}/signup`,
  },
  alternates: { canonical: `${baseUrl}/signup` },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
