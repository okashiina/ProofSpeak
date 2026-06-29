"use client";

import { useRef, useState } from "react";

export default function ImageUploader({
  label,
  value,
  prefix,
  onChange,
  variant,
  kind = "image",
}: {
  label: string;
  value: string;
  prefix: string;
  onChange: (url: string) => void;
  variant?: "logo";
  kind?: "image" | "pdf";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isPdf = kind === "pdf";

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prefix", prefix);
    fd.append("kind", kind);
    try {
      const res = await fetch("/api/seller/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setErr(json?.error || "Gagal mengunggah.");
      } else {
        onChange(json.data.url);
      }
    } catch {
      setErr("Gagal mengunggah.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="fg">
      <label>{label}</label>
      <div
        className="img-ubox"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      >
        <div className="img-ubox-hint">
          {busy
            ? "Mengunggah…"
            : isPdf
              ? "Klik untuk unggah PDF (maks 15MB)"
              : "Klik untuk unggah gambar (maks 5MB)"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={isPdf ? "application/pdf" : "image/*"}
          onChange={handleFile}
          style={{ display: "none" }}
        />
        {value && !isPdf ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className={`img-prev ${variant === "logo" ? "logo" : ""}`} />
        ) : null}
        {value && isPdf ? (
          <div className="img-ubox-hint" style={{ marginTop: ".4rem", color: "var(--lime, #f0fc2f)" }}>
            ✓ PDF terunggah
          </div>
        ) : null}
      </div>
      {err && <div className="fld-err">{err}</div>}
      {value && (
        <button
          type="button"
          className="ab ab-rej"
          style={{ marginTop: ".5rem" }}
          onClick={() => onChange("")}
        >
          {isPdf ? "Hapus PDF" : "Hapus gambar"}
        </button>
      )}
    </div>
  );
}
