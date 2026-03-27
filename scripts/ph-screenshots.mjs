#!/usr/bin/env node
/**
 * Capture 5 Product Hunt gallery screenshots for SnapQR.
 *
 * Output: ./ph-screenshots/ at 2540×1520 (1270×760 @2x retina)
 *
 * Screenshots:
 *   1. hero.png          – Homepage with URL input + feature pills + demo card
 *   2. analytics-top.png – Stats dashboard top: summary cards + timeline chart
 *   3. analytics-bot.png – Stats dashboard bottom: countries/devices/browsers + recent scans
 *   4. upgrade.png       – Pricing / upgrade page (Free vs Pro comparison)
 *   5. qr-closeup.png    – Branded QR code close-up on the stats page
 */

import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "ph-screenshots");
mkdirSync(OUT, { recursive: true });

const BASE = "https://api-snap.com";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const WIDTH = 1270;
const HEIGHT = 760;
const DPR = 2;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "shell",
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      "--disable-gpu",
      "--no-sandbox",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: DPR });

  // Disable smooth-scroll so scrollTo is instant
  await page.evaluateOnNewDocument(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = "*, *::before, *::after { scroll-behavior: auto !important; }";
      document.head.appendChild(s);
    });
  });

  // ── 1. Hero — homepage ──────────────────────────────────────────────
  console.log("1/5  Hero…");
  await page.goto(`${BASE}/snapqr`, { waitUntil: "networkidle2", timeout: 30000 });
  // Wait for demo scan count to appear (client-side fetch)
  await page.waitForFunction(
    () => document.body.innerText.includes("scans"),
    { timeout: 10000 }
  ).catch(() => {});
  await sleep(1000);
  await page.screenshot({ path: `${OUT}/hero.png`, type: "png" });
  console.log("  → hero.png ✓");

  // ── 2. Analytics top — stats cards + timeline ───────────────────────
  console.log("2/5  Analytics top…");
  await page.goto(`${BASE}/s/sPaleBlu1`, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1500);
  // Hide banners, CTAs, and QR preview card so stats cards + timeline chart fit
  await page.evaluate(() => {
    // Blue banner at top
    document.querySelectorAll(".bg-blue-600.text-white").forEach(el => el.style.display = "none");
    // Green "Create your own" CTA
    document.querySelectorAll(".bg-gradient-to-r.from-emerald-50").forEach(el => el.style.display = "none");
    // Blue "Are you the owner" inline CTA
    document.querySelectorAll(".bg-blue-50.border-blue-200").forEach(el => {
      if (el.classList.contains("rounded-xl")) el.style.display = "none";
    });
    // QR preview card (the flex card with the QR image)
    const qrImg = document.querySelector('img[alt="QR code"]');
    if (qrImg) {
      const card = qrImg.closest(".rounded-xl");
      if (card) card.style.display = "none";
    }
  });
  await sleep(300);
  await page.screenshot({ path: `${OUT}/analytics-top.png`, type: "png" });
  console.log("  → analytics-top.png ✓");

  // ── 3. Analytics bottom — countries, devices, browsers, recent scans
  console.log("3/5  Analytics bottom…");
  // Scroll down to show the analytics grid + recent scans table
  await page.evaluate(() => {
    // Find the "Top Countries" heading as anchor
    const headings = [...document.querySelectorAll("h3")];
    const target = headings.find(h => h.textContent?.includes("Top Countries"));
    if (target) {
      // Scroll so the countries section is near the top with some padding
      const rect = target.getBoundingClientRect();
      window.scrollBy(0, rect.top - 80);
    } else {
      // Fallback: scroll to roughly 60% of page
      window.scrollTo(0, document.body.scrollHeight * 0.45);
    }
  });
  await sleep(800);
  await page.screenshot({ path: `${OUT}/analytics-bot.png`, type: "png" });
  console.log("  → analytics-bot.png ✓");

  // ── 4. Upgrade / pricing page ───────────────────────────────────────
  console.log("4/5  Upgrade page…");
  await page.goto(`${BASE}/snapqr/upgrade`, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(800);
  await page.screenshot({ path: `${OUT}/upgrade.png`, type: "png" });
  console.log("  → upgrade.png ✓");

  // ── 5. QR close-up — QR code preview card on the stats page ─────────
  console.log("5/5  QR close-up…");
  await page.goto(`${BASE}/s/sPaleBlu1`, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1000);

  // Hide banners, then scroll so the QR card + Scan Timeline header are centered
  await page.evaluate(() => {
    // Hide blue banner + green CTA + blue inline CTA
    document.querySelectorAll(".bg-blue-600.text-white").forEach(el => el.style.display = "none");
    document.querySelectorAll(".bg-gradient-to-r.from-emerald-50").forEach(el => el.style.display = "none");
    document.querySelectorAll(".bg-blue-50.border-blue-200").forEach(el => {
      if (el.classList.contains("rounded-xl")) el.style.display = "none";
    });

    // Find the QR card (the div with the QR image)
    const img = document.querySelector('img[alt="QR code"]');
    if (img) {
      const card = img.closest(".rounded-xl") || img.parentElement;
      const rect = card.getBoundingClientRect();
      // Position QR card in the upper third of viewport
      window.scrollBy(0, rect.top - 40);
    }
  });
  await sleep(500);
  await page.screenshot({ path: `${OUT}/qr-closeup.png`, type: "png" });
  console.log("  → qr-closeup.png ✓");

  await browser.close();
  console.log(`\nDone — 5 screenshots saved to ${OUT}/`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});
