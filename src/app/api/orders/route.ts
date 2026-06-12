import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { orderSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { notifyNewOrder } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = await rateLimit(`${ip}:order`, 6, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const parsed = orderSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Data tidak valid." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  try {
    const [row] = await db
      .insert(orders)
      .values({
        productId: d.productId ?? null,
        item: d.item,
        price: d.price,
        name: d.name,
        phone: d.phone,
        email: d.email,
        address: d.address,
        qty: d.qty,
        color: d.color,
        payment: d.payment,
        message: d.message,
        status: "pending",
      })
      .returning();
    await notifyNewOrder(row);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[orders] insert failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menyimpan pesanan." }, { status: 500 });
  }
}
