import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";
import { uploadImage } from "@/lib/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Unggahan tidak valid." }, { status: 400 });
  }
  const file = form.get("file");
  const prefix = (form.get("prefix") as string) || "uploads";
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File tidak ditemukan." }, { status: 400 });
  }

  const result = await uploadImage(file, prefix);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, data: { url: result.url } });
}
