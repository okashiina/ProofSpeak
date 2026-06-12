import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { updateAdminPassword } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({ password: z.string().min(8, "Minimal 8 karakter.") });

export async function POST(req: NextRequest) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Password tidak valid." },
      { status: 400 },
    );
  }
  try {
    await updateAdminPassword(g.session.adminId, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[password] update failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal mengubah password." }, { status: 500 });
  }
}
