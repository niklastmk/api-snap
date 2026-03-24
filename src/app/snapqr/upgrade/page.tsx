import Link from "next/link";

export default function SnapQRUpgradePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/snapqr" className="text-2xl font-bold text-black">
            API Snap QR
          </Link>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Unlock Unlimited QR Codes</h1>
            <p className="text-sm text-zinc-500">
              Sign up for any paid plan to unlock unlimited trackable QR codes with full analytics.
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Remove branding from stats pages",
              "Unlimited QR codes",
              "Full scan analytics (device, browser, OS, country)",
              "Access to all 13+ API Snap utility APIs",
              "Priority support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-zinc-700">
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className="block w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base text-center"
          >
            View Plans
          </Link>

          <p className="text-center text-xs text-zinc-400 mt-4">
            Plans start at $9/mo. Secure payment via Stripe.
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Just want the free tier?{" "}
          <Link href="/snapqr" className="text-blue-600 hover:underline font-medium">
            Generate a free QR code
          </Link>
        </p>
      </div>
    </div>
  );
}
