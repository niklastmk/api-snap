import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapAPI — Developer APIs Made Simple",
  description:
    "QR codes, screenshots, PDFs, and more. One API key, simple pricing, instant access.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
