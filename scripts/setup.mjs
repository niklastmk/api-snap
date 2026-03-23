#!/usr/bin/env node
/**
 * API Snap — Full setup guide
 * Run: node scripts/setup.mjs
 *
 * Walks you through everything needed to go live.
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync } from "fs";
import { execSync } from "child_process";
import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: "pipe" }).trim();
  } catch {
    return null;
  }
}

async function main() {
  console.log("\n=== API Snap Setup ===\n");

  // Step 1: .env file
  const envPath = ".env";
  if (!existsSync(envPath)) {
    copyFileSync(".env.example", envPath);
    console.log("Created .env from .env.example");
  }

  let env = readFileSync(envPath, "utf-8");

  function setEnv(key, value) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(env)) {
      env = env.replace(regex, `${key}=${value}`);
    } else {
      env += `\n${key}=${value}`;
    }
  }

  // Step 2: JWT Secret
  if (env.includes("JWT_SECRET=change-me")) {
    const secret = Array.from({ length: 48 }, () =>
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
        Math.floor(Math.random() * 62)
      ]
    ).join("");
    setEnv("JWT_SECRET", secret);
    console.log("Generated random JWT_SECRET");
  }

  // Step 3: Turso
  console.log("\n--- Database (Turso) ---");
  console.log("Turso gives you a free hosted SQLite database.\n");

  const hasTurso = run("which turso");
  if (!hasTurso) {
    console.log("Install Turso CLI:");
    console.log("  curl -sSfL https://get.tur.so/install.sh | bash");
    console.log("  turso auth login");
    console.log("  turso db create snapapi");
    console.log("  turso db show snapapi --url    # DATABASE_URL");
    console.log("  turso db tokens create snapapi  # DATABASE_AUTH_TOKEN");
  } else {
    const dbUrl = run("turso db show snapapi --url 2>/dev/null");
    if (dbUrl) {
      setEnv("DATABASE_URL", dbUrl);
      console.log(`Found existing Turso db: ${dbUrl}`);
      const token = run("turso db tokens create snapapi 2>/dev/null");
      if (token) {
        setEnv("DATABASE_AUTH_TOKEN", token);
        console.log("Generated new auth token");
      }
    } else {
      const create = await ask("Create Turso database 'snapapi'? (y/n) ");
      if (create.toLowerCase() === "y") {
        console.log("Creating database...");
        run("turso db create snapapi");
        const url = run("turso db show snapapi --url");
        const token = run("turso db tokens create snapapi");
        if (url) setEnv("DATABASE_URL", url);
        if (token) setEnv("DATABASE_AUTH_TOKEN", token);
        console.log(`Database ready: ${url}`);
      }
    }
  }

  // Step 4: Stripe
  console.log("\n--- Stripe ---");
  const currentStripeKey = env.match(/STRIPE_SECRET_KEY=(sk_\w+)/)?.[1];
  if (!currentStripeKey || currentStripeKey === "sk_test_...") {
    console.log("1. Create account: https://dashboard.stripe.com/register");
    console.log("2. Get API keys:   https://dashboard.stripe.com/test/apikeys");
    const sk = await ask("\nPaste your Stripe Secret Key (sk_test_...): ");
    if (sk.startsWith("sk_")) {
      setEnv("STRIPE_SECRET_KEY", sk);
      const pk = await ask("Paste your Publishable Key (pk_test_...): ");
      if (pk.startsWith("pk_")) {
        setEnv("STRIPE_PUBLISHABLE_KEY", pk);
      }
    }
  } else {
    console.log("Stripe key already configured.");
  }

  // Save .env
  writeFileSync(envPath, env);
  console.log("\n.env saved!");

  // Step 5: Create Stripe products
  const hasStripeKey = env.match(/STRIPE_SECRET_KEY=(sk_\w+)/)?.[1];
  const hasPrices = env.includes("STRIPE_PRICE_HOBBY=price_");
  if (hasStripeKey && !hasPrices) {
    const setupStripe = await ask("\nCreate Stripe products/prices automatically? (y/n) ");
    if (setupStripe.toLowerCase() === "y") {
      console.log("Running Stripe setup...");
      try {
        execSync("node scripts/setup-stripe.mjs", {
          stdio: "inherit",
          env: { ...process.env, ...parseEnv(env) },
        });
      } catch {
        console.log("Stripe setup had an issue — you can re-run: node scripts/setup-stripe.mjs");
      }
    }
  }

  // Step 6: Install deps + push schema
  console.log("\n--- Final Steps ---");
  const installDeps = await ask("Install dependencies? (y/n) ");
  if (installDeps.toLowerCase() === "y") {
    console.log("Installing...");
    execSync("npm install", { stdio: "inherit" });
  }

  const pushDb = await ask("Push database schema? (y/n) ");
  if (pushDb.toLowerCase() === "y") {
    execSync("npx drizzle-kit push", {
      stdio: "inherit",
      env: { ...process.env, ...parseEnv(env) },
    });
    console.log("Schema pushed!");
  }

  console.log("\n=== Setup Complete ===");
  console.log("Run locally:  npm run dev");
  console.log("Deploy:       npx vercel  (or push to GitHub + connect Vercel)");
  console.log("");

  rl.close();
}

function parseEnv(envStr) {
  const result = {};
  for (const line of envStr.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

main().catch((err) => {
  console.error(err);
  rl.close();
});
