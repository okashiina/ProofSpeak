import "server-only";
import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./auth";

/**
 * Guard for /api/seller/* routes. Usage:
 *   const g = await requireAdmin();
 *   if ("response" in g) return g.response;
 *   // g.session is the authenticated admin
 */
export async function requireAdmin(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ ok: false, error: "Tidak diizinkan." }, { status: 401 }) };
  }
  return { session };
}
