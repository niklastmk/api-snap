"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("success"); // No session ID — just show success
      return;
    }

    let attempts = 0;
    const maxAttempts = 6;

    async function tryFetch() {
      attempts++;
      try {
        const res = await fetch(`/api/snapqr/session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.apiKey) {
          localStorage.setItem("snapqr_api_key", data.apiKey);
          setEmail(data.email || "");
          setStatus("success");
        } else if (data.retry && attempts < maxAttempts) {
          setTimeout(tryFetch, 2000);
        } else {
          setStatus("success"); // Don't block them — just show success
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(tryFetch, 2000);
        } else {
          setStatus("success");
        }
      }
    }

    tryFetch();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {status === "loading" ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Activating your account&hellip;</h1>
            <p className="text-zinc-500 text-sm">Just a moment while we set things up.</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black mb-3">You&apos;re upgraded!</h1>
            {email && (
              <p className="text-zinc-500 mb-2 text-sm">Confirmed for <strong>{email}</strong></p>
            )}
            <p className="text-zinc-500 mb-8 text-base">
              Welcome to SnapQR Pro. Unlimited QR codes are now unlocked in this browser.
            </p>
            <Link
              href="/snapqr"
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base"
            >
              Start creating QR codes &rarr;
            </Link>
            <p className="text-sm text-zinc-400 mt-6">
              Need help?{" "}
              <a href="mailto:hello@api-snap.com" className="text-blue-600 hover:underline">
                hello@api-snap.com
              </a>
            </p>
            <p className="text-sm text-zinc-400 mt-3">
              <Link href="/snapqr/account" className="text-blue-600 hover:underline">
                My Account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading&hellip;</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
