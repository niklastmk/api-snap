import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { users, apiKeys } from "./schema";
import { eq } from "drizzle-orm";

function getJwtSecret(): Uint8Array {
  const s = process.env.JWT_SECRET || "dev-secret-change-me-in-production";
  return new TextEncoder().encode(s);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return { userId: payload.sub as string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  if (!result) return null;
  const user = db.select().from(users).where(eq(users.id, result.userId)).get();
  return user || null;
}

export async function authenticateApiKey(key: string) {
  const apiKey = db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.key, key))
    .get();
  if (!apiKey) return null;

  const user = db
    .select()
    .from(users)
    .where(eq(users.id, apiKey.userId))
    .get();
  if (!user) return null;

  // Update last used
  db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, apiKey.id))
    .run();

  return { user, apiKey };
}
