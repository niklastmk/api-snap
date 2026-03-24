import Link from "next/link";

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <svg
            className="w-8 h-8 text-green-600"
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
        </div>

        <h1 className="text-3xl font-bold text-black mb-3">
          You&apos;re upgraded!
        </h1>
        <p className="text-zinc-500 mb-8 text-base">
          Welcome to SnapQR Pro. Your subscription is active and all Pro features
          are now unlocked.
        </p>

        <Link
          href="/snapqr"
          className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base"
        >
          Start creating QR codes
        </Link>

        <p className="text-sm text-zinc-400 mt-6">
          Questions?{" "}
          <a
            href="mailto:hello@api-snap.com"
            className="text-blue-600 hover:underline"
          >
            hello@api-snap.com
          </a>
        </p>
      </div>
    </div>
  );
}
