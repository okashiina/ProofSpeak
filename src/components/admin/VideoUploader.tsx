"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { isFileVideo, VIDEO_MAX_BYTES, VIDEO_TYPES, VIDEO_TYPE_EXT } from "@/lib/dynamic";

export default function VideoUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const uploaded = isFileVideo(value);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    if (!VIDEO_TYPES.includes(file.type)) {
      setErr("Format tidak didukung — gunakan MP4, WebM, atau MOV.");
      return;
    }
    if (file.size > VIDEO_MAX_BYTES) {
      setErr("Video terlalu besar (maks 100MB). Kecilkan dulu, mis. ekspor ulang dengan kualitas lebih rendah.");
      return;
    }
    setPct(0);
    try {
      // Name from the MIME type, not file.name — extension-less files (common
      // from share sheets) would otherwise defeat isFileVideo() downstream.
      const blob = await upload(`videos/${Date.now()}.${VIDEO_TYPE_EXT[file.type]}`, file, {
        access: "public",
        handleUploadUrl: "/api/seller/upload/video",
        multipart: true,
        onUploadProgress: (p) => setPct(Math.round(p.percentage)),
      });
      onChange(blob.url);
    } catch (uploadErr) {
      const msg = uploadErr instanceof Error ? uploadErr.message : "";
      setErr(msg || "Gagal mengunggah video. Coba lagi.");
    } finally {
      setPct(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="fg">
      <label>{label}</label>
      <div
        className="img-ubox"
        onClick={() => pct === null && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (pct === null) inputRef.current?.click();
          }
        }}
      >
        <div className="img-ubox-hint">
          {pct !== null
            ? `Mengunggah… ${pct}%`
            : "Klik untuk unggah video (MP4/WebM/MOV, maks 100MB)"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={VIDEO_TYPES.join(",")}
          onChange={handleFile}
          style={{ display: "none" }}
        />
        {pct !== null && (
          <div className="vid-upload-bar">
            <div className="vid-upload-fill" style={{ width: `${pct}%` }} />
          </div>
        )}
        {uploaded && pct === null && (
          <video
            className="vid-upload-prev"
            src={value}
            controls
            muted
            playsInline
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
      {err && <div className="fld-err">{err}</div>}
      {uploaded && (
        <button
          type="button"
          className="ab ab-rej"
          style={{ marginTop: ".5rem" }}
          onClick={() => onChange("")}
        >
          Hapus video
        </button>
      )}
    </div>
  );
}
