import { db } from "./db";
import { usageLogs } from "./schema";
import { eq, and, gte, sql } from "drizzle-orm";

const PLAN_LIMITS: Record<string, number> = {
  free: 100,
  hobby: 5_000,
  pro: 50_000,
  business: 500_000,
};

export function getMonthlyLimit(plan: string): number {
  return PLAN_LIMITS[plan] || 100;
}

export async function getMonthlyUsage(apiKeyId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(usageLogs)
    .where(
      and(
        eq(usageLogs.apiKeyId, apiKeyId),
        gte(usageLogs.createdAt, startOfMonth)
      )
    )
    .get();

  return result?.count ?? 0;
}

export async function logUsage(apiKeyId: string, endpoint: string) {
  await db.insert(usageLogs)
    .values({ apiKeyId, endpoint })
    .run();
}

export async function checkRateLimit(
  apiKeyId: string,
  plan: string,
  endpoint: string
): Promise<{ allowed: boolean; usage: number; limit: number }> {
  const limit = getMonthlyLimit(plan);
  const usage = await getMonthlyUsage(apiKeyId);

  if (usage >= limit) {
    return { allowed: false, usage, limit };
  }

  await logUsage(apiKeyId, endpoint);
  return { allowed: true, usage: usage + 1, limit };
}
