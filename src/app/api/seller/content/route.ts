import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { contentSaveSchema } from "@/lib/validation";
import { saveContentEntries } from "@/lib/content";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;

  const parsed = contentSaveSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Data konten tidak valid." }, { status: 400 });
  }
  try {
    await saveContentEntries(parsed.data.entries);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[content] save failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menyimpan konten." }, { status: 500 });
  }
}
