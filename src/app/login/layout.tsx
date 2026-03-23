import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snapapi.dev";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your SnapAPI account to manage API keys, view usage, and access your developer dashboard.",
  openGraph: {
    title: "Log In to SnapAPI",
    description: "Access your SnapAPI dashboard and manage your API keys.",
    url: `${baseUrl}/login`,
  },
  robots: { index: false, follow: true },
  alternates: { canonical: `${baseUrl}/login` },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
