import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { links, scanEvents, users } from "@/lib/schema";
import { eq, desc, count } from "drizzle-orm";
import Link from "next/link";
import { ScanTimeline } from "./scan-timeline";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
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

  // Real total scan count
  const [{ total }] = await db
    .select({ total: count() })
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id));

  // Time window: 7 days free, 30 days paid
  const windowDays = isPaid ? 30 : 7;
  const windowStart = daysAgo(windowDays);

  // Fetch scans (200 for paid, 50 for free)
  const scanLimit = isPaid ? 200 : 50;
  const scans = await db
    .select()
    .from(scanEvents)
    .where(eq(scanEvents.linkId, link.id))
    .orderBy(desc(scanEvents.scannedAt))
    .limit(scanLimit);

  // Free users only see last 7 days
  const windowedScans = isPaid
    ? scans
    : scans.filter((s) => s.scannedAt >= windowStart);

  const lastScan = scans[0]?.scannedAt ?? null;

  // --- Aggregations ---

  // Timeline: daily scan counts
  const timelineDays = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const dayStart = daysAgo(i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayCount = windowedScans.filter(
      (s) => s.scannedAt >= dayStart && s.scannedAt < dayEnd
    ).length;
    timelineDays.push({
      date: dayStart.toISOString().slice(0, 10),
      label: formatDate(dayStart),
      count: dayCount,
    });
  }

  // Top countries
  const countryCounts: Record<string, number> = {};
  for (const s of windowedScans) {
    const c = s.country || "Unknown";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  for (const s of windowedScans) {
    deviceCounts[s.device || "desktop"] = (deviceCounts[s.device || "desktop"] || 0) + 1;
  }
  const deviceBreakdown = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]);

  // Browser breakdown
  const browserCounts: Record<string, number> = {};
  for (const s of windowedScans) {
    browserCounts[s.browser || "Unknown"] = (browserCounts[s.browser || "Unknown"] || 0) + 1;
  }
  const topBrowsers = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const windowedTotal = windowedScans.length;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Banner — hidden for paid users */}
      {!isPaid && (
        <Link href="/snapqr" className="block bg-blue-600 text-white text-center py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
          Track who scans your codes &mdash; free &rarr;
        </Link>
      )}

      <main className="max-w-4xl mx-auto px-4 py-10">
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

        {/* Stats summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="text-3xl font-bold text-black">{total}</div>
            <div className="text-sm text-zinc-500 mt-1">Total scans</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
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
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="text-3xl font-bold text-black">
              {Object.keys(countryCounts).filter((c) => c !== "Unknown").length}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Countries</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="text-3xl font-bold text-black">
              {windowedScans.filter((s) => (s.device || "desktop") === "mobile").length}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Mobile scans</div>
          </div>
        </div>

        {/* QR code preview */}
        <div className="flex items-start gap-6 mb-8 p-5 bg-white border border-zinc-200 rounded-xl">
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
            <div className="flex gap-2 flex-wrap">
              <a
                href={`/api/snapqr/qr/${code}`}
                download={`snapqr-${code}.png`}
                className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Download PNG
              </a>
              {isPaid ? (
                <a
                  href={`/api/snapqr/export/${code}`}
                  className="inline-flex items-center gap-2 text-sm border border-zinc-300 text-zinc-700 px-4 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  Export CSV
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2 text-sm border border-zinc-200 text-zinc-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  title="CSV export requires QR Pro"
                >
                  Export CSV
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    PRO
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scan timeline chart */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Scan Timeline</h2>
            <span className="text-xs text-zinc-400">
              Last {windowDays} days
              {!isPaid && (
                <> &middot; <Link href="/snapqr/upgrade" className="text-blue-600 hover:underline">Unlock 30 days</Link></>
              )}
            </span>
          </div>
          {windowedTotal === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-sm">
              No scans yet. Share your QR code to get started.
            </div>
          ) : (
            <ScanTimeline days={timelineDays} />
          )}
        </div>

        {/* Analytics grid: Countries + Devices + Browsers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Top Countries */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-black mb-3">Top Countries</h3>
            {topCountries.length === 0 ? (
              <p className="text-sm text-zinc-400">No data yet</p>
            ) : (
              <div className="space-y-2">
                {topCountries.map(([country, cnt]) => {
                  const pct = windowedTotal > 0 ? Math.round((cnt / windowedTotal) * 100) : 0;
                  return (
                    <div key={country} className="flex items-center gap-2">
                      <span className="text-sm text-zinc-700 w-14 font-mono">{country}</span>
                      <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-8 text-right">{cnt}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Devices */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-black mb-3">Devices</h3>
            {deviceBreakdown.length === 0 ? (
              <p className="text-sm text-zinc-400">No data yet</p>
            ) : (
              <div className="space-y-2">
                {deviceBreakdown.map(([device, cnt]) => {
                  const pct = windowedTotal > 0 ? Math.round((cnt / windowedTotal) * 100) : 0;
                  return (
                    <div key={device} className="flex items-center gap-2">
                      <span className="text-sm text-zinc-700 w-16 capitalize">{device}</span>
                      <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Browsers */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-black mb-3">Browsers</h3>
            {topBrowsers.length === 0 ? (
              <p className="text-sm text-zinc-400">No data yet</p>
            ) : (
              <div className="space-y-2">
                {topBrowsers.map(([browser, cnt]) => {
                  const pct = windowedTotal > 0 ? Math.round((cnt / windowedTotal) * 100) : 0;
                  return (
                    <div key={browser} className="flex items-center gap-2">
                      <span className="text-sm text-zinc-700 w-16 truncate">{browser}</span>
                      <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent scans table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <h2 className="text-lg font-semibold text-black">Recent Scans</h2>
            {!isPaid && total > windowedScans.length && (
              <Link href="/snapqr/upgrade" className="text-xs text-blue-600 hover:underline">
                Unlock full history ({total} total)
              </Link>
            )}
          </div>
          {windowedScans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-sm">No scans yet. Share your QR code to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {windowedScans.map((scan, idx) => (
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
        </div>

        {/* Free tier: gated content teaser */}
        {!isPaid && total > windowedScans.length && (
          <div className="mb-8 rounded-xl border border-dashed border-zinc-300 p-6 text-center bg-white">
            <p className="text-zinc-500 text-sm mb-2">
              Showing last 7 days ({windowedScans.length} of {total} scans).
            </p>
            <p className="text-zinc-400 text-xs mb-4">
              Upgrade to QR Pro ($7/mo) to unlock full scan history and CSV export.
            </p>
            <Link
              href="/snapqr/upgrade"
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Upgrade to QR Pro &mdash; $7/mo
            </Link>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="rounded-xl border-2 border-blue-600 p-6 bg-blue-50">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              {isPaid ? (
                <h3 className="text-lg font-bold text-black mb-1">
                  Create your own smart QR &mdash; free at api-snap.com
                </h3>
              ) : (
                <h3 className="text-lg font-bold text-black mb-1">
                  Unlock full analytics &amp; CSV export
                </h3>
              )}
              <p className="text-sm text-zinc-600 mb-3">
                {isPaid
                  ? "Generate trackable QR codes with real-time analytics."
                  : "QR Pro ($7/mo) — 30-day scan history, CSV export, no branding on stats pages."}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[160px]">
              {!isPaid ? (
                <>
                  <Link
                    href="/snapqr/upgrade"
                    className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                  >
                    Upgrade to QR Pro &mdash; $7/mo
                  </Link>
                  <Link
                    href="/snapqr"
                    className="inline-flex items-center justify-center border border-blue-600 text-blue-600 font-medium px-5 py-2.5 rounded-lg hover:bg-blue-100 transition-colors text-sm whitespace-nowrap"
                  >
                    Create Free QR Code
                  </Link>
                </>
              ) : (
                <Link
                  href="/snapqr"
                  className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                >
                  Create QR Code
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
