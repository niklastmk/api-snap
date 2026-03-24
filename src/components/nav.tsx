import Link from "next/link";

const navLinks = [
  { href: "/qr", label: "QR Generator" },
  { href: "/snapqr", label: "SnapQR" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export default function Nav({ current }: { current?: string }) {
  return (
    <nav className="border-b border-gray-800 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          API Snap
        </Link>
        <div className="flex gap-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                current === link.href
                  ? "text-white font-medium transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="text-gray-400 hover:text-white transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
          >
            Get API Key
          </Link>
        </div>
      </div>
    </nav>
  );
}
