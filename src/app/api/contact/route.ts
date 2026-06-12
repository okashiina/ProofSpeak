import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { notifyNewContact } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = await rateLimit(`${ip}:contact`, 6, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const parsed = contactSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Data tidak valid." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const [row] = await db
      .insert(contacts)
      .values({ name: d.name, email: d.email, subject: d.subject, message: d.message, status: "new" })
      .returning();
    await notifyNewContact(row);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] insert failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal mengirim pesan." }, { status: 500 });
  }
}
