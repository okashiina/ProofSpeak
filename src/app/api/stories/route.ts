import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories } from "@/lib/db/schema";
import { storySchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { notifyNewStory } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = await rateLimit(`${ip}:story`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const parsed = storySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Data tidak valid." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const [row] = await db
      .insert(stories)
      .values({
        name: d.name,
        title: d.title,
        body: d.body,
        trigger: d.trigger,
        lang: d.lang,
        status: "pending",
      })
      .returning();
    await notifyNewStory(row);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stories] insert failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menyimpan cerita." }, { status: 500 });
  }
}
