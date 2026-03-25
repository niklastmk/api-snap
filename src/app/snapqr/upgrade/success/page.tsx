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
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 overflow-x-hidden">
      <div className="w-full max-w-md text-center">
        {status === "loading" ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-pulse">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Activating your account&hellip;</h1>
            <p className="text-zinc-500 text-sm">Just a moment while we set things up.</p>
          </>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-1">You&apos;re all set!</h1>
            <p className="text-lg text-zinc-600 mb-1">Welcome to SnapQR Pro.</p>
            {email && (
              <p className="text-zinc-400 mb-6 text-sm">Confirmed for <strong className="text-zinc-600">{email}</strong></p>
            )}
            {!email && <div className="mb-6" />}

            <div className="bg-zinc-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Now unlocked</p>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong>&nbsp;QR codes
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>30-day</strong>&nbsp;scan analytics
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  CSV export &amp; clean QR images
                </li>
              </ul>
            </div>

            <Link
              href="/snapqr"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors text-base"
            >
              Create a QR code &rarr;
            </Link>
            <p className="text-xs text-zinc-400 mt-4">
              Questions? <a href="mailto:hello@api-snap.com" className="text-blue-600 hover:underline">hello@api-snap.com</a>
            </p>
          </div>
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
