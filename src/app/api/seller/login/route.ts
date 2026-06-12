import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { verifyCredentials, createSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = await rateLimit(`${ip}:login`, 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak percobaan masuk. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Email dan password wajib diisi." }, { status: 400 });
  }

  try {
    const session = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!session) {
      return NextResponse.json({ ok: false, error: "Email atau password salah." }, { status: 401 });
    }
    await createSession(session);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[login] failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal masuk. Periksa konfigurasi server." }, { status: 500 });
  }
}
