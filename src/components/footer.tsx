import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start justify-between gap-8 text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} API Snap. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/snapqr" className="hover:text-gray-300 transition">SnapQR</Link>
          <Link href="/snapqr/upgrade" className="hover:text-gray-300 transition">Pricing</Link>
          <Link href="/docs" className="hover:text-gray-300 transition">API Docs</Link>
          <Link href="/blog" className="hover:text-gray-300 transition">Blog</Link>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/tools/qr-code-api" className="hover:text-gray-300 transition">QR Code API</Link>
          <Link href="/tools/screenshot-api" className="hover:text-gray-300 transition">Screenshot API</Link>
          <Link href="/tools/image-resize-api" className="hover:text-gray-300 transition">Image Resize API</Link>
          <Link href="/tools/uuid-generator-api" className="hover:text-gray-300 transition">UUID API</Link>
          <Link href="/tools/hash-api" className="hover:text-gray-300 transition">Hash API</Link>
          <Link href="/tools/base64-api" className="hover:text-gray-300 transition">Base64 API</Link>
          <Link href="/tools/url-metadata-api" className="hover:text-gray-300 transition">Metadata API</Link>
          <Link href="/tools/html-to-pdf-api" className="hover:text-gray-300 transition">PDF API</Link>
          <Link href="/tools/markdown-to-html-api" className="hover:text-gray-300 transition">Markdown API</Link>
        </div>
      </div>
    </footer>
  );
}
