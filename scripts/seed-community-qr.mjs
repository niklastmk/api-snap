#!/usr/bin/env node
/**
 * Seed trackable QR codes for community seeding.
 * Each code points to a genuinely useful resource for a specific community.
 * Safe to re-run — skips existing codes.
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./snapapi.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const codes = [
  { code: "qrAbout1", url: "https://www.qrcode.com/en/about/", community: "r/qrcode", desc: "Official QR code history & spec" },
  { code: "strAtlas1", url: "https://stripe.com/atlas/guides", community: "r/entrepreneur", desc: "Stripe Atlas startup guides" },
  { code: "indieHkr", url: "https://www.indiehackers.com/", community: "r/SideProject", desc: "Indie Hackers community" },
  { code: "ycLib001", url: "https://www.ycombinator.com/library", community: "r/startups", desc: "YC startup library" },
  { code: "mdnDocs1", url: "https://developer.mozilla.org/en-US/", community: "r/webdev", desc: "MDN Web Docs" },
  { code: "bizTools", url: "https://github.com/cjbarber/ToolsOfTheTrade", community: "r/smallbusiness", desc: "Free tools for business" },
  { code: "promLnch", url: "https://github.com/trekhleb/promote-your-next-startup", community: "r/indiehackers", desc: "Startup promotion checklist" },
];

const now = Math.floor(Date.now() / 1000);

for (const { code, url, community, desc } of codes) {
  const existing = await client.execute({
    sql: "SELECT id FROM links WHERE short_code = ?",
    args: [code],
  });

  if (existing.rows.length > 0) {
    console.log(`✓ ${code} already exists (id: ${existing.rows[0].id})`);
    continue;
  }

  await client.execute({
    sql: "INSERT INTO links (short_code, target_url, creator_ip, created_at) VALUES (?, ?, ?, ?)",
    args: [code, url, "seed-community", now],
  });

  console.log(`✓ Seeded ${code} → ${url} (${community}: ${desc})`);
}

console.log("\n--- Verification ---");
for (const { code } of codes) {
  console.log(`QR image:  https://api-snap.com/api/snapqr/qr/${code}`);
  console.log(`Redirect:  https://api-snap.com/r/${code}`);
  console.log(`Stats:     https://api-snap.com/s/${code}`);
  console.log();
}
