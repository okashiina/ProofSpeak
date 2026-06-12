import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { productSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;

  const parsed = productSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Data produk tidak valid." },
      { status: 400 },
    );
  }
  try {
    const [row] = await db.insert(products).values(parsed.data).returning();
    return NextResponse.json({ ok: true, data: row });
  } catch (err) {
    console.error("[products] create failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menyimpan produk." }, { status: 500 });
  }
}
