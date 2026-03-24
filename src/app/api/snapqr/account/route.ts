import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, apiKeys } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Look up user by email — only return API key if they're on a paid plan
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || user.plan === "free") {
    return NextResponse.json({ found: false });
  }

  const [key] = await db.select().from(apiKeys).where(eq(apiKeys.userId, user.id)).limit(1);
  if (!key) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ apiKey: key.key, plan: user.plan });
}
