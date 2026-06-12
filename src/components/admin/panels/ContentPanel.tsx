"use client";

import { useMemo, useState } from "react";
import { apiSend } from "@/lib/client";
import { CONTENT_FIELDS } from "@/lib/content-defaults";
import type { ContentMap } from "@/lib/types";

export default function ContentPanel({
  content,
  setContent,
}: {
  content: ContentMap;
  setContent: React.Dispatch<React.SetStateAction<ContentMap>>;
}) {
  const fields = useMemo(() => CONTENT_FIELDS.filter((f) => f.type !== "image"), []);

  const [vals, setVals] = useState<Record<string, { id: string; en: string }>>(() => {
    const v: Record<string, { id: string; en: string }> = {};
    for (const f of fields) {
      const cur = content[f.key];
      v[f.key] = { id: cur?.id ?? f.id, en: cur?.en ?? f.en };
    }
    return v;
  });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  function update(key: string, lang: "id" | "en", value: string) {
    setVals((v) => ({ ...v, [key]: { ...v[key], [lang]: value } }));
  }

  async function save() {
    setErr("");
    setNote("");
    setBusy(true);
    const entries = fields.map((f) => ({
      key: f.key,
      id: vals[f.key].id,
      en: f.bilingual ? vals[f.key].en : vals[f.key].id,
    }));
    const res = await apiSend("/api/seller/content", "PUT", { entries });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__generic__" ? "Gagal menyimpan." : res.error);
      return;
    }
    setContent((prev) => {
      const next = { ...prev };
      for (const e of entries) next[e.key] = { id: e.id, en: e.en };
      return next;
    });
    setNote("✓ Konten tersimpan & langsung tampil di situs.");
    setTimeout(() => setNote(""), 4000);
  }

  // Group consecutive fields by section.
  const groups: { section: string; items: typeof fields }[] = [];
  for (const f of fields) {
    const last = groups[groups.length - 1];
    if (last && last.section === f.section) last.items.push(f);
    else groups.push({ section: f.section, items: [f] });
  }

  return (
    <div>
      <div className="adm-title">Editor Teks</div>
      <div className="adm-sub">
        Edit semua teks situs dalam dua bahasa. Klik Simpan untuk menerapkan — perubahan langsung
        tampil ke semua pengunjung.
      </div>

      {err && <div className="err-msg">{err}</div>}

      {groups.map((g) => (
        <div key={g.section}>
          <div className="ce-section">{g.section}</div>
          {g.items.map((f) => (
            <div key={f.key} className={`ce-row ${f.bilingual ? "" : "single"}`}>
              <div className="fg" style={{ margin: 0 }}>
                <label>
                  {f.label}
                  {f.bilingual ? " — ID" : ""}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    style={{ minHeight: 64 }}
                    value={vals[f.key].id}
                    onChange={(e) => update(f.key, "id", e.target.value)}
                  />
                ) : (
                  <input value={vals[f.key].id} onChange={(e) => update(f.key, "id", e.target.value)} />
                )}
              </div>
              {f.bilingual && (
                <div className="fg" style={{ margin: 0 }}>
                  <label>{f.label} — EN</label>
                  {f.type === "textarea" ? (
                    <textarea
                      style={{ minHeight: 64 }}
                      value={vals[f.key].en}
                      onChange={(e) => update(f.key, "en", e.target.value)}
                    />
                  ) : (
                    <input value={vals[f.key].en} onChange={(e) => update(f.key, "en", e.target.value)} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <button className="btn btn-primary" onClick={save} disabled={busy} style={{ marginTop: "1.5rem" }}>
        {busy ? "Menyimpan…" : "Simpan Semua"}
      </button>
      {note && <div className="save-note">{note}</div>}
    </div>
  );
}
