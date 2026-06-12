import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { admins } from "./db/schema";

const COOKIE = "ps_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET is missing or too short (need 16+ chars).");
  }
  return new TextEncoder().encode(s);
}

export interface SessionPayload {
  adminId: number;
  email: string;
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.adminId === "number" && typeof payload.email === "string") {
      return { adminId: payload.adminId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export async function isAuthed(): Promise<boolean> {
  return (await getSession()) !== null;
}

/**
 * Ensure at least one admin exists. On first run, seeds from ADMIN_EMAIL /
 * ADMIN_PASSWORD env so the owner can log in immediately.
 */
export async function ensureAdminSeeded(): Promise<void> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(admins);
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return; // nothing to seed yet
  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(admins).values({ email, passwordHash }).onConflictDoNothing();
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<SessionPayload | null> {
  await ensureAdminSeeded();
  const normalized = email.trim().toLowerCase();
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, normalized))
    .limit(1);
  if (!admin) {
    // Constant-ish time: still run a hash compare to reduce user-enumeration.
    await bcrypt.compare(password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv");
    return null;
  }
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { adminId: admin.id, email: admin.email };
}

export async function updateAdminPassword(
  adminId: number,
  newPassword: string,
): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(admins).set({ passwordHash }).where(eq(admins.id, adminId));
}
