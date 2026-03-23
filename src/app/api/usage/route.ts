import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys, usageLogs } from "@/lib/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getMonthlyLimit } from "@/lib/rate-limit";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const keys = db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .all();

  let totalUsage = 0;
  for (const key of keys) {
    const result = db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.apiKeyId, key.id),
          gte(usageLogs.createdAt, startOfMonth)
        )
      )
      .get();
    totalUsage += result?.count ?? 0;
  }

  return NextResponse.json({
    plan: user.plan,
    usage: totalUsage,
    limit: getMonthlyLimit(user.plan),
  });
}
