import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { links, scanEvents, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function StatsPage({ params }: Props) {
  const { code } = await params;

  const linkRows = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .limit(1);

  if (linkRows.length === 0) {
    notFound();
  }

  const link = linkRows[0];

  const scans = await db
    .select()
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id))
    .orderBy(desc(scanEvents.scannedAt))
    .limit(50);

  const totalScans = scans.length;
  const lastScan = scans[0]?.scannedAt ?? null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://api-snap.com";

  // Check if link creator is a paid subscriber
  let isPaid = false;
  if (link.creatorUserId) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, link.creatorUserId))
      .limit(1);
    isPaid = user.length > 0 && user[0].plan !== "free";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Powered by banner — hidden for paid users */}
      {!isPaid && (
        <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
          Powered by{" "}
          <Link href="/snapqr" className="underline font-bold">
            SnapQR
          </Link>{" "}
          &mdash; Free QR codes with real-time scan analytics
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/snapqr" className="text-blue-600 text-sm font-medium hover:underline">
            &larr; Back to SnapQR
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-black mb-1">Scan Analytics</h1>
        <p className="text-zinc-500 text-sm mb-8 break-all">
          QR code for:{" "}
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {link.targetUrl}
          </a>
        </p>

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-xl p-5">
            <div className="text-3xl font-bold text-black">{totalScans}</div>
            <div className="text-sm text-zinc-500 mt-1">Total scans</div>
          </div>
          <div className="border border-zinc-200 rounded-xl p-5">
            <div className="text-sm font-semibold text-black truncate">
              {lastScan
                ? new Date(lastScan).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "\u2014"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Last scan</div>
          </div>
        </div>

        {/* QR code preview */}
        <div className="flex items-start gap-6 mb-8 p-5 border border-zinc-200 rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/snapqr/qr/${code}`}
            alt="QR code"
            width={100}
            height={100}
            className="rounded"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-700 mb-1">Redirect URL</div>
            <div className="text-sm text-zinc-500 break-all mb-3">
              {appUrl}/r/{code}
            </div>
            <a
              href={`/api/snapqr/qr/${code}`}
              download={`snapqr-${code}.png`}
              className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Download PNG
            </a>
          </div>
        </div>

        {/* Recent scans table */}
        <h2 className="text-lg font-semibold text-black mb-4">Recent Scans</h2>
        {scans.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl">
            <p className="text-zinc-400 text-sm">No scans yet. Share your QR code to get started.</p>
          </div>
        ) : (
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Device</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Browser</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">OS</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">Country</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan, idx) => (
                  <tr
                    key={scan.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-zinc-50"}
                  >
                    <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                      {new Date(scan.scannedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 capitalize">
                      {scan.device ?? "desktop"}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{scan.browser ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-zinc-700">{scan.os ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-zinc-700">{scan.country ?? "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="mt-10 rounded-xl border-2 border-blue-600 p-6 bg-blue-50">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">
                Want analytics for YOUR QR codes?
              </h3>
              <p className="text-sm text-zinc-600 mb-3">
                Create free QR codes at{" "}
                <Link href="/snapqr" className="text-blue-600 font-medium hover:underline">
                  SnapQR
                </Link>{" "}
                &mdash; no account required.
              </p>
              <p className="text-sm text-zinc-600">
                Upgrade your plan to remove branding, get unlimited QR codes, and unlock full analytics.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[160px]">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
              >
                View Plans
              </Link>
              <Link
                href="/snapqr"
                className="inline-flex items-center justify-center border border-zinc-300 text-zinc-700 font-medium px-5 py-2.5 rounded-lg hover:bg-white transition-colors text-sm whitespace-nowrap"
              >
                Create free QR code
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
