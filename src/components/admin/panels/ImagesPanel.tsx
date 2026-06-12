"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client";
import { CONTENT_FIELDS } from "@/lib/content-defaults";
import ImageUploader from "../ImageUploader";
import type { ContentMap } from "@/lib/types";

export default function ImagesPanel({
  content,
  setContent,
}: {
  content: ContentMap;
  setContent: React.Dispatch<React.SetStateAction<ContentMap>>;
}) {
  const imageFields = CONTENT_FIELDS.filter((f) => f.type === "image");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  async function saveImage(key: string, url: string) {
    setErr("");
    setNote("");
    // Optimistic update so the preview reflects immediately.
    setContent((prev) => ({ ...prev, [key]: { id: url, en: url } }));
    const res = await apiSend("/api/seller/content", "PUT", {
      entries: [{ key, id: url, en: url }],
    });
    if (!res.ok) {
      setErr("Gagal menyimpan gambar. Coba lagi.");
      return;
    }
    setNote("✓ Gambar tersimpan & langsung tampil di situs.");
    setTimeout(() => setNote(""), 4000);
  }

  return (
    <div>
      <div className="adm-title">Gambar</div>
      <div className="adm-sub">
        Unggah logo dan gambar latar. Gambar disimpan permanen di penyimpanan cloud (Vercel Blob) —
        tidak akan hilang saat refresh, dan langsung tampil ke semua pengunjung.
      </div>

      {err && <div className="err-msg">{err}</div>}
      {note && <div className="save-note" style={{ marginTop: 0, marginBottom: "1rem" }}>{note}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem" }}>
        {imageFields.map((f) => (
          <ImageUploader
            key={f.key}
            label={f.label}
            value={content[f.key]?.id ?? f.id}
            prefix={f.key.replace(".", "-")}
            variant={f.key === "img.logo" ? "logo" : undefined}
            onChange={(url) => saveImage(f.key, url)}
          />
        ))}
      </div>
    </div>
  );
}
