import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (min 8 chars) required" },
      { status: 400 }
    );
  }

  const existing = db.select().from(users).where(eq(users.email, email)).get();

  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const id = nanoid();
  const passwordHash = await bcrypt.hash(password, 12);

  db.insert(users).values({ id, email, passwordHash }).run();

  const token = await createToken(id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
