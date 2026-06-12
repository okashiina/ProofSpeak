import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/guard";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { productSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });

  const parsed = productSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Data produk tidak valid." },
      { status: 400 },
    );
  }
  try {
    const [row] = await db.update(products).set(parsed.data).where(eq(products.id, id)).returning();
    if (!row) return NextResponse.json({ ok: false, error: "Produk tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ ok: true, data: row });
  } catch (err) {
    console.error("[products] update failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal memperbarui produk." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "ID tidak valid." }, { status: 400 });
  try {
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[products] delete failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menghapus produk." }, { status: 500 });
  }
}
