import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .all();

  return NextResponse.json({
    keys: keys.map((k) => ({
      id: k.id,
      name: k.name,
      key: k.key.slice(0, 12) + "..." + k.key.slice(-4),
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let name: string | undefined;
  try {
    ({ name } = await req.json());
  } catch {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const id = nanoid();
  const key = `snp_${nanoid(32)}`;

  await db.insert(apiKeys).values({ id, userId: user.id, key, name }).run();

  // Return full key only on creation
  return NextResponse.json({ id, key, name });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let id: string | undefined;
  try {
    ({ id } = await req.json());
  } catch {
    return NextResponse.json({ error: "Key ID required" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Key ID required" }, { status: 400 });
  }
  const existing = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).get();

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(apiKeys).where(eq(apiKeys.id, id)).run();
  return NextResponse.json({ ok: true });
}
