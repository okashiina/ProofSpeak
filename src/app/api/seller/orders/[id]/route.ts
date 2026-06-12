import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/guard";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, error: "Status tidak valid." }, { status: 400 });
  }
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[orders] update failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal memperbarui pesanan." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
  try {
    await db.delete(orders).where(eq(orders.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[orders] delete failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menghapus pesanan." }, { status: 500 });
  }
}
