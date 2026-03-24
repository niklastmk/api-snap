#!/usr/bin/env node
/**
 * One-off fix: update the sPaleBlu1 demo QR code to point to https://api-snap.com/snapqr
 * instead of the old Wikipedia URL.
 *
 * Usage:
 *   node scripts/fix-demo-url.mjs
 *
 * Reads DATABASE_URL and DATABASE_AUTH_TOKEN from the environment (or .env if loaded externally).
 * Run with env vars set:
 *   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... node scripts/fix-demo-url.mjs
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./snapapi.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const SHORT_CODE = "sPaleBlu1";
const NEW_URL = "https://api-snap.com/snapqr";

const existing = await client.execute({
  sql: "SELECT id, target_url FROM links WHERE short_code = ?",
  args: [SHORT_CODE],
});

if (existing.rows.length === 0) {
  console.error("ERROR: No record found for short_code =", SHORT_CODE);
  process.exit(1);
}

const row = existing.rows[0];
console.log("Current record — id:", row.id, "| target_url:", row.target_url);

await client.execute({
  sql: "UPDATE links SET target_url = ? WHERE short_code = ?",
  args: [NEW_URL, SHORT_CODE],
});

const verify = await client.execute({
  sql: "SELECT id, target_url FROM links WHERE short_code = ?",
  args: [SHORT_CODE],
});

console.log("Updated  record — id:", verify.rows[0].id, "| target_url:", verify.rows[0].target_url);
console.log("Done. sPaleBlu1 now redirects to", NEW_URL);
