#!/usr/bin/env node
/**
 * Automated Stripe setup for API Snap
 * Creates the product and all pricing tiers, then outputs the env vars you need.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe.mjs
 *
 * Or if you already have a .env file with STRIPE_SECRET_KEY:
 *   node --env-file=.env scripts/setup-stripe.mjs
 */

import Stripe from "stripe";
import { readFileSync, writeFileSync, existsSync } from "fs";

const key = process.env.STRIPE_SECRET_KEY;
if (!key || key.startsWith("sk_test_...")) {
  console.error(
    "Error: Set STRIPE_SECRET_KEY first.\n" +
      "  1. Create a Stripe account at https://dashboard.stripe.com/register\n" +
      "  2. Copy your Secret key from https://dashboard.stripe.com/test/apikeys\n" +
      "  3. Run: STRIPE_SECRET_KEY=sk_test_YOUR_KEY node scripts/setup-stripe.mjs"
  );
  process.exit(1);
}

const stripe = new Stripe(key);

async function main() {
  console.log("Creating API Snap product and prices in Stripe...\n");

  // Create the product
  const product = await stripe.products.create({
    name: "API Snap",
    description: "Developer utility APIs — QR codes, image processing, screenshots, and more.",
  });
  console.log(`Product created: ${product.id}`);

  // Create prices for each tier
  const hobbyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 900, // $9.00
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "snapapi_hobby",
  });

  const proPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 2900, // $29.00
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "snapapi_pro",
  });

  const businessPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 9900, // $99.00
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "snapapi_business",
  });

  console.log(`Hobby price:    ${hobbyPrice.id} ($9/mo)`);
  console.log(`Pro price:      ${proPrice.id} ($29/mo)`);
  console.log(`Business price: ${businessPrice.id} ($99/mo)`);

  // Also create a webhook endpoint if deploying to a known URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.includes("localhost")) {
    try {
      const webhook = await stripe.webhookEndpoints.create({
        url: `${appUrl}/api/webhooks/stripe`,
        enabled_events: [
          "checkout.session.completed",
          "customer.subscription.updated",
          "customer.subscription.deleted",
        ],
      });
      console.log(`\nWebhook created: ${webhook.id}`);
      console.log(`Webhook secret:  ${webhook.secret}`);
      console.log(`  (Listening at ${appUrl}/api/webhooks/stripe)`);
    } catch (e) {
      console.log("\nSkipped webhook creation (set NEXT_PUBLIC_APP_URL to your production URL to auto-create)");
    }
  } else {
    console.log("\nSkipped webhook creation — set NEXT_PUBLIC_APP_URL to your production URL and re-run, or create manually.");
    console.log("For local dev, use: npm run stripe:listen");
  }

  // Get publishable key info
  console.log("\n--- Add these to your .env file ---\n");

  const envLines = [
    `STRIPE_PRICE_HOBBY=${hobbyPrice.id}`,
    `STRIPE_PRICE_PRO=${proPrice.id}`,
    `STRIPE_PRICE_BUSINESS=${businessPrice.id}`,
  ];
  console.log(envLines.join("\n"));

  // Auto-update .env if it exists
  const envPath = new URL("../.env", import.meta.url).pathname;
  if (existsSync(envPath)) {
    let env = readFileSync(envPath, "utf-8");
    for (const line of envLines) {
      const [varName, value] = line.split("=");
      const regex = new RegExp(`^${varName}=.*$`, "m");
      if (regex.test(env)) {
        env = env.replace(regex, `${varName}=${value}`);
      } else {
        env += `\n${line}`;
      }
    }
    writeFileSync(envPath, env);
    console.log("\n.env file updated automatically!");
  } else {
    console.log("\nNo .env file found — create one from .env.example and paste these values.");
  }

  console.log("\nDone! Your Stripe products are ready.");
  console.log("Next: Get your publishable key from https://dashboard.stripe.com/test/apikeys");
  console.log("      and add it as STRIPE_PUBLISHABLE_KEY in your .env");
}

main().catch((err) => {
  console.error("Stripe setup failed:", err.message);
  process.exit(1);
});
