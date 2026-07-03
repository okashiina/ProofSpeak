import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/guard";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { VIDEO_MAX_BYTES, VIDEO_TYPES } from "@/lib/dynamic";

export const runtime = "nodejs";

/**
 * Client-upload token endpoint for campaign videos. Videos go browser -> Blob
 * directly because serverless request bodies are capped at ~4.5MB — far too
 * small for video. This route only hands out a scoped upload token (admin
 * session required); the file itself never passes through the server.
 *
 * Note: Vercel Blob also calls this same POST endpoint (without the admin
 * cookie) to deliver the onUploadCompleted webhook, so auth lives inside
 * onBeforeGenerateToken rather than at the top of the handler.
 */
export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Penyimpanan belum dikonfigurasi (BLOB_READ_WRITE_TOKEN)." },
      { status: 500 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const g = await requireAdmin();
        if ("response" in g) throw new Error("Sesi berakhir — masuk ulang ke panel admin.");
        const rl = await rateLimit(`upload-video:${clientIp(req.headers)}`, 30, 60 * 60 * 1000);
        if (!rl.allowed) {
          throw new Error("Terlalu banyak unggahan. Coba lagi dalam beberapa saat.");
        }
        return {
          allowedContentTypes: VIDEO_TYPES,
          maximumSizeInBytes: VIDEO_MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to persist here — the admin saves the returned URL into
        // site_content via the Bagian Halaman panel.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengunggah video." },
      { status: 400 },
    );
  }
}

/**
 * Best-effort cleanup when the admin replaces or removes an uploaded video, so
 * 100MB blobs don't accumulate as unreachable storage cost.
 */
export async function DELETE(req: NextRequest) {
  const g = await requireAdmin();
  if ("response" in g) return g.response;

  let url = "";
  try {
    url = String(((await req.json()) as { url?: string }).url || "");
  } catch {
    // fall through to the validation below
  }
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    // invalid URL -> rejected below
  }
  if (!host.endsWith(".vercel-storage.com")) {
    return NextResponse.json({ ok: false, error: "URL tidak valid." }, { status: 400 });
  }

  try {
    await del(url);
  } catch (err) {
    console.error("[blob] delete failed:", err);
    // Best-effort: a stale/missing blob shouldn't block the admin's edit.
  }
  return NextResponse.json({ ok: true });
}
