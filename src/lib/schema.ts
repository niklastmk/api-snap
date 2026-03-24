import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // nanoid
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan", { enum: ["free", "hobby", "pro", "business", "qr_pro"] })
    .notNull()
    .default("free"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(), // nanoid
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  key: text("key").notNull().unique(), // snp_xxx
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
});

export const usageLogs = sqliteTable("usage_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  apiKeyId: text("api_key_id")
    .notNull()
    .references(() => apiKeys.id),
  endpoint: text("endpoint").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// SnapQR: trackable QR codes with scan analytics
export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shortCode: text("short_code").notNull().unique(),
  targetUrl: text("target_url").notNull(),
  creatorIp: text("creator_ip"),
  creatorUserId: text("creator_user_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const scanEvents = sqliteTable("scan_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  linkId: integer("link_id")
    .notNull()
    .references(() => links.id),
  scannedAt: integer("scanned_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  userAgent: text("user_agent"),
  ip: text("ip"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  referer: text("referer"),
});

export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UsageLog = typeof usageLogs.$inferSelect;
export type Link = typeof links.$inferSelect;
export type ScanEvent = typeof scanEvents.$inferSelect;
