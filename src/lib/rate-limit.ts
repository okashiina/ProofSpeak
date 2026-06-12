import "server-only";
import { sql } from "drizzle-orm";
import { db } from "./db";

export interface RateResult {
  allowed: boolean;
  retryAfterSec: number;
}

/**
 * Fixed-window per-key rate limit, backed by Postgres so it works across
 * serverless invocations (in-memory counters reset every cold start). One atomic
 * upsert per check. Used on public POST endpoints to deter spam/abuse (Rule 8).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateResult> {
  const now = new Date();
  const reset = new Date(now.getTime() + windowMs);
  try {
    const out = await db.execute(sql`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, ${reset.toISOString()})
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.reset_at < ${now.toISOString()} THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at < ${now.toISOString()} THEN ${reset.toISOString()} ELSE rate_limits.reset_at END
      RETURNING count, reset_at
    `);
    const rows = (Array.isArray(out) ? out : (out as { rows?: unknown[] }).rows) as
      | { count: number; reset_at: string }[]
      | undefined;
    const row = rows?.[0];
    if (!row) return { allowed: true, retryAfterSec: 0 };
    const count = Number(row.count);
    const resetAt = new Date(row.reset_at).getTime();
    if (count > limit) {
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000)) };
    }
    return { allowed: true, retryAfterSec: 0 };
  } catch {
    // Fail open: never block a survivor's submission because the limiter errored.
    return { allowed: true, retryAfterSec: 0 };
  }
}

/** Extract a best-effort client IP from request headers (Vercel sets these). */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}
