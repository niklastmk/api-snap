#!/usr/bin/env node
/**
 * Seed realistic scan data for the sPaleBlu1 demo QR code.
 * Clears existing scans for this link and inserts fresh, realistic data.
 *
 * Run: node scripts/seed-demo-scans.mjs
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./snapapi.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const SHORT_CODE = "sPaleBlu1";

// Get link ID
const linkResult = await client.execute({
  sql: "SELECT id FROM links WHERE short_code = ?",
  args: [SHORT_CODE],
});

if (linkResult.rows.length === 0) {
  console.error("❌ Link sPaleBlu1 not found. Run seed-demo-qr.mjs first.");
  process.exit(1);
}

const linkId = linkResult.rows[0].id;
console.log(`Found sPaleBlu1 (link_id: ${linkId})`);

// Delete existing scan events for this link only
const deleted = await client.execute({
  sql: "DELETE FROM scan_events WHERE link_id = ?",
  args: [linkId],
});
console.log(`Cleared ${deleted.rowsAffected} existing scan events`);

// --- Data design ---

// Realistic scan profiles: [country, device, browser, os, city]
const profiles = [
  // US — heavy Chrome + Safari, mix of mobile/desktop
  ["US", "mobile", "Safari", "iOS", "San Francisco"],
  ["US", "mobile", "Safari", "iOS", "New York"],
  ["US", "desktop", "Chrome", "Windows", "Austin"],
  ["US", "mobile", "Chrome", "Android", "Chicago"],
  ["US", "desktop", "Chrome", "macOS", "Seattle"],
  ["US", "desktop", "Firefox", "Windows", "Portland"],
  ["US", "mobile", "Safari", "iOS", "Los Angeles"],
  ["US", "desktop", "Chrome", "macOS", "Boston"],
  ["US", "mobile", "Chrome", "Android", "Denver"],
  ["US", "desktop", "Edge", "Windows", "Miami"],
  ["US", "mobile", "Safari", "iOS", "Atlanta"],
  ["US", "desktop", "Chrome", "Windows", "Dallas"],
  // DE — good presence
  ["DE", "desktop", "Chrome", "Windows", "Berlin"],
  ["DE", "mobile", "Safari", "iOS", "Munich"],
  ["DE", "desktop", "Firefox", "Linux", "Hamburg"],
  ["DE", "mobile", "Chrome", "Android", "Frankfurt"],
  ["DE", "desktop", "Chrome", "macOS", "Cologne"],
  ["DE", "mobile", "Samsung Internet", "Android", "Stuttgart"],
  // GB
  ["GB", "mobile", "Safari", "iOS", "London"],
  ["GB", "desktop", "Chrome", "Windows", "Manchester"],
  ["GB", "mobile", "Chrome", "Android", "Birmingham"],
  ["GB", "desktop", "Firefox", "macOS", "Edinburgh"],
  ["GB", "mobile", "Safari", "iOS", "Bristol"],
  // JP
  ["JP", "mobile", "Safari", "iOS", "Tokyo"],
  ["JP", "mobile", "Chrome", "Android", "Osaka"],
  ["JP", "desktop", "Chrome", "Windows", "Yokohama"],
  ["JP", "mobile", "Safari", "iOS", "Kyoto"],
  // BR
  ["BR", "mobile", "Chrome", "Android", "São Paulo"],
  ["BR", "mobile", "Chrome", "Android", "Rio de Janeiro"],
  ["BR", "desktop", "Chrome", "Windows", "Brasilia"],
  ["BR", "mobile", "Samsung Internet", "Android", "Belo Horizonte"],
  // IN
  ["IN", "mobile", "Chrome", "Android", "Mumbai"],
  ["IN", "mobile", "Chrome", "Android", "Bangalore"],
  ["IN", "desktop", "Chrome", "Windows", "Delhi"],
  // FR
  ["FR", "desktop", "Firefox", "Windows", "Paris"],
  ["FR", "mobile", "Safari", "iOS", "Lyon"],
  ["FR", "desktop", "Chrome", "macOS", "Marseille"],
  // CA
  ["CA", "desktop", "Chrome", "macOS", "Toronto"],
  ["CA", "mobile", "Safari", "iOS", "Vancouver"],
  // AU
  ["AU", "mobile", "Safari", "iOS", "Sydney"],
  ["AU", "desktop", "Chrome", "Windows", "Melbourne"],
  // KR
  ["KR", "mobile", "Samsung Internet", "Android", "Seoul"],
  // NL
  ["NL", "desktop", "Firefox", "Linux", "Amsterdam"],
  // SE
  ["SE", "desktop", "Chrome", "macOS", "Stockholm"],
  // MX
  ["MX", "mobile", "Chrome", "Android", "Mexico City"],
  // SG
  ["SG", "mobile", "Safari", "iOS", "Singapore"],
  // IT
  ["IT", "desktop", "Chrome", "Windows", "Rome"],
  // ES
  ["ES", "mobile", "Chrome", "Android", "Barcelona"],
  // PL
  ["PL", "desktop", "Firefox", "Linux", "Warsaw"],
];

// User agents by browser/os combo (realistic substrings)
function fakeUA(browser, os) {
  const base = {
    "Safari-iOS": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1",
    "Chrome-Android": "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36",
    "Chrome-Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36",
    "Chrome-macOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36",
    "Firefox-Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Firefox-macOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Firefox-Linux": "Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Edge-Windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36 Edg/122.0.2365.80",
    "Samsung Internet-Android": "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/122.0.6261.105 Mobile Safari/537.36",
    "Safari-macOS": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
  };
  return base[`${browser}-${os}`] || base["Chrome-Windows"];
}

// Generate timestamps spread across a period
function randomTimestamp(daysAgo, spreadHours = 16) {
  const now = Date.now();
  if (daysAgo === 0) {
    // For today: random time 1–6 hours ago (always in the past)
    const offsetMs = (1 + Math.random() * 5) * 3600 * 1000;
    return Math.floor((now - offsetMs) / 1000);
  }
  const day = new Date(now);
  day.setDate(day.getDate() - daysAgo);
  // Random time between 6am and 10pm (realistic scan hours)
  day.setHours(6 + Math.floor(Math.random() * spreadHours), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);
  return Math.floor(day.getTime() / 1000);
}

// --- Generate scan events ---

const events = [];

// RECENT SCANS: Last 7 days — these show in charts and table
// Day distribution: natural curve with growth trend
const recentDistribution = [
  { daysAgo: 6, count: 4 },
  { daysAgo: 5, count: 6 },
  { daysAgo: 4, count: 5 },
  { daysAgo: 3, count: 8 },
  { daysAgo: 2, count: 7 },
  { daysAgo: 1, count: 12 },
  { daysAgo: 0, count: 8 },
];

let profileIdx = 0;
for (const { daysAgo, count } of recentDistribution) {
  for (let i = 0; i < count; i++) {
    const p = profiles[profileIdx % profiles.length];
    profileIdx++;
    events.push({
      linkId,
      scannedAt: randomTimestamp(daysAgo),
      userAgent: fakeUA(p[2], p[3]),
      ip: `${100 + Math.floor(Math.random() * 155)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`,
      country: p[0],
      city: p[4],
      device: p[1],
      browser: p[2],
      os: p[3],
      referer: null,
    });
  }
}

// OLDER SCANS: 8–30 days ago — pad the total count to ~300+
// These don't show in charts but inflate "Total scans" number
const olderDistribution = [
  { daysAgo: 7, count: 8 },
  { daysAgo: 8, count: 6 },
  { daysAgo: 9, count: 7 },
  { daysAgo: 10, count: 9 },
  { daysAgo: 11, count: 10 },
  { daysAgo: 12, count: 8 },
  { daysAgo: 13, count: 11 },
  { daysAgo: 14, count: 12 },
  { daysAgo: 15, count: 9 },
  { daysAgo: 16, count: 7 },
  { daysAgo: 17, count: 8 },
  { daysAgo: 18, count: 10 },
  { daysAgo: 19, count: 11 },
  { daysAgo: 20, count: 9 },
  { daysAgo: 21, count: 6 },
  { daysAgo: 22, count: 7 },
  { daysAgo: 23, count: 8 },
  { daysAgo: 24, count: 10 },
  { daysAgo: 25, count: 12 },
  { daysAgo: 26, count: 8 },
  { daysAgo: 27, count: 6 },
  { daysAgo: 28, count: 5 },
  { daysAgo: 29, count: 4 },
  { daysAgo: 30, count: 3 },
];

for (const { daysAgo, count } of olderDistribution) {
  for (let i = 0; i < count; i++) {
    const p = profiles[profileIdx % profiles.length];
    profileIdx++;
    events.push({
      linkId,
      scannedAt: randomTimestamp(daysAgo),
      userAgent: fakeUA(p[2], p[3]),
      ip: `${100 + Math.floor(Math.random() * 155)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`,
      country: p[0],
      city: p[4],
      device: p[1],
      browser: p[2],
      os: p[3],
      referer: null,
    });
  }
}

console.log(`Inserting ${events.length} scan events…`);

// Insert in batches of 50
const BATCH = 50;
for (let i = 0; i < events.length; i += BATCH) {
  const batch = events.slice(i, i + BATCH);
  const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
  const args = batch.flatMap((e) => [
    e.linkId,
    e.scannedAt,
    e.userAgent,
    e.ip,
    e.country,
    e.city,
    e.device,
    e.browser,
    e.os,
    e.referer,
  ]);

  await client.execute({
    sql: `INSERT INTO scan_events (link_id, scanned_at, user_agent, ip, country, city, device, browser, os, referer) VALUES ${placeholders}`,
    args,
  });
}

// Verify
const [{ total }] = (await client.execute({
  sql: "SELECT COUNT(*) as total FROM scan_events WHERE link_id = ?",
  args: [linkId],
})).rows;

const [{ recent }] = (await client.execute({
  sql: "SELECT COUNT(*) as recent FROM scan_events WHERE link_id = ? AND scanned_at > ?",
  args: [linkId, Math.floor(Date.now() / 1000) - 7 * 86400],
})).rows;

console.log(`✓ Done! ${total} total scans (${recent} in last 7 days)`);

// Quick stats
const countries = (await client.execute({
  sql: "SELECT country, COUNT(*) as cnt FROM scan_events WHERE link_id = ? GROUP BY country ORDER BY cnt DESC LIMIT 8",
  args: [linkId],
})).rows;
console.log("\nTop countries:", countries.map(r => `${r.country}: ${r.cnt}`).join(", "));

const devices = (await client.execute({
  sql: "SELECT device, COUNT(*) as cnt FROM scan_events WHERE link_id = ? GROUP BY device ORDER BY cnt DESC",
  args: [linkId],
})).rows;
console.log("Devices:", devices.map(r => `${r.device}: ${r.cnt}`).join(", "));

const browsers = (await client.execute({
  sql: "SELECT browser, COUNT(*) as cnt FROM scan_events WHERE link_id = ? GROUP BY browser ORDER BY cnt DESC LIMIT 6",
  args: [linkId],
})).rows;
console.log("Browsers:", browsers.map(r => `${r.browser}: ${r.cnt}`).join(", "));
