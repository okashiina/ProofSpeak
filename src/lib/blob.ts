import "server-only";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB images
const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15MB booklet PDFs
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export type UploadKind = "image" | "pdf";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image (or, with kind="pdf", a booklet PDF) to Vercel Blob and return
 * its public URL. This is what makes uploads actually persist (the old version
 * crammed base64 into localStorage and silently blew the ~5MB quota on refresh).
 */
export async function uploadImage(
  file: File,
  prefix = "uploads",
  kind: UploadKind = "image",
): Promise<UploadResult> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "Penyimpanan belum dikonfigurasi (BLOB_READ_WRITE_TOKEN)." };
  }
  if (!file || file.size === 0) return { ok: false, error: "File kosong." };

  if (kind === "pdf") {
    if (file.size > MAX_PDF_BYTES) return { ok: false, error: "PDF terlalu besar (maks 15MB)." };
    if (file.type !== "application/pdf") return { ok: false, error: "File harus berformat PDF." };
  } else {
    if (file.size > MAX_BYTES) return { ok: false, error: "Gambar terlalu besar (maks 5MB)." };
    if (!ALLOWED.includes(file.type)) return { ok: false, error: "Format gambar tidak didukung." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
  const safePrefix = prefix.replace(/[^a-z0-9/_-]/gi, "");
  try {
    const blob = await put(`${safePrefix}/${Date.now()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { ok: true, url: blob.url };
  } catch (err) {
    console.error("[blob] upload failed:", err);
    return { ok: false, error: "Gagal mengunggah gambar." };
  }
}
