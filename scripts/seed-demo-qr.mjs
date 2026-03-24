#!/usr/bin/env node
/**
 * Seed the "sPaleBlu1" demo QR code pointing to /snapqr.
 * Run once: node scripts/seed-demo-qr.mjs
 * Safe to re-run — skips if "sPaleBlu1" already exists.
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./snapapi.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const TARGET_URL = "https://api-snap.com/snapqr";
const SHORT_CODE = "sPaleBlu1";

const existing = await client.execute({
  sql: "SELECT id FROM links WHERE short_code = ?",
  args: [SHORT_CODE],
});

if (existing.rows.length > 0) {
  console.log("✓ sPaleBlu1 code already exists (id:", existing.rows[0].id, ")");
  process.exit(0);
}

await client.execute({
  sql: "INSERT INTO links (short_code, target_url, creator_ip, created_at) VALUES (?, ?, ?, ?)",
  args: [SHORT_CODE, TARGET_URL, "seed", Math.floor(Date.now() / 1000)],
});

console.log("✓ Seeded sPaleBlu1 QR code →", TARGET_URL);
