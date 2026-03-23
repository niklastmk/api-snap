import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./snapapi.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function init() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      stripe_customer_id TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      last_used_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS usage_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key_id TEXT NOT NULL REFERENCES api_keys(id),
      endpoint TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
    CREATE INDEX IF NOT EXISTS idx_usage_logs_key_date ON usage_logs(api_key_id, created_at);
  `);

  console.log("Database initialized successfully");
}

init().catch(console.error);
