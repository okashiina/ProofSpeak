"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client";
import ImageUploader from "../ImageUploader";
import {
  getAboutBlocks,
  getBystander,
  getVideos,
  type AboutBlock,
  type BystanderGuide,
  type VideoItem,
} from "@/lib/dynamic";
import type { ContentMap } from "@/lib/types";

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="fg" style={{ margin: 0 }}>
      <label>{label}</label>
      {textarea ? (
        <textarea style={{ minHeight: 70 }} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function SectionsPanel({
  content,
  setContent,
}: {
  content: ContentMap;
  setContent: React.Dispatch<React.SetStateAction<ContentMap>>;
}) {
  const [blocks, setBlocks] = useState<AboutBlock[]>(() => getAboutBlocks(content));
  const [bystander, setBystander] = useState<BystanderGuide>(() => getBystander(content));
  const [videos, setVideos] = useState<VideoItem[]>(() => getVideos(content));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  function patchBlock(i: number, patch: Partial<AboutBlock>) {
    setBlocks((b) => b.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function patchVideo(i: number, patch: Partial<VideoItem>) {
    setVideos((v) => v.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }

  async function save() {
    setErr("");
    setNote("");
    setBusy(true);
    const entries = [
      { key: "about.blocks", id: JSON.stringify(blocks), en: "" },
      { key: "about.bystander", id: JSON.stringify(bystander), en: "" },
      { key: "home.videos", id: JSON.stringify(videos), en: "" },
    ];
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
    setNote("✓ Tersimpan & langsung tampil di situs.");
    setTimeout(() => setNote(""), 4000);
  }

  return (
    <div>
      <div className="adm-title">Bagian Halaman</div>
      <div className="adm-sub">
        Tambah topik di halaman Tentang (boleh dengan foto), atur Panduan Bystander &amp; booklet PDF,
        dan masukkan video kampanye ke galeri Beranda. Klik Simpan untuk menerapkan.
      </div>

      {err && <div className="err-msg">{err}</div>}

      {/* ABOUT TOPIC COLUMNS */}
      <div className="ce-section">Tentang — Topik / Kolom (boleh tambah sendiri)</div>
      {blocks.map((b, i) => (
        <div className="blk-card" key={i}>
          <div className="blk-head">
            <span>Topik {i + 1}</span>
            <div className="blk-actions">
              <button className="ab" onClick={() => setBlocks((x) => move(x, i, -1))} disabled={i === 0}>
                ↑
              </button>
              <button
                className="ab"
                onClick={() => setBlocks((x) => move(x, i, 1))}
                disabled={i === blocks.length - 1}
              >
                ↓
              </button>
              <button className="ab ab-rej" onClick={() => setBlocks((x) => x.filter((_, j) => j !== i))}>
                Hapus
              </button>
            </div>
          </div>
          <div className="ce-row">
            <Field label="Judul — ID" value={b.titleId} onChange={(v) => patchBlock(i, { titleId: v })} />
            <Field label="Judul — EN" value={b.titleEn} onChange={(v) => patchBlock(i, { titleEn: v })} />
          </div>
          <div className="ce-row">
            <Field label="Isi — ID" textarea value={b.bodyId} onChange={(v) => patchBlock(i, { bodyId: v })} />
            <Field label="Isi — EN" textarea value={b.bodyEn} onChange={(v) => patchBlock(i, { bodyEn: v })} />
          </div>
          <ImageUploader
            label="Foto (opsional)"
            value={b.image}
            prefix="about-topic"
            onChange={(url) => patchBlock(i, { image: url })}
          />
        </div>
      ))}
      <button
        className="btn btn-outline"
        onClick={() =>
          setBlocks((x) => [...x, { titleId: "", titleEn: "", bodyId: "", bodyEn: "", image: "" }])
        }
      >
        + Tambah Topik
      </button>

      {/* BYSTANDER GUIDE */}
      <div className="ce-section" style={{ marginTop: "2.5rem" }}>
        Tentang — Panduan Bystander
      </div>
      <div className="blk-card">
        <div className="ce-row">
          <Field label="Judul — ID" value={bystander.titleId} onChange={(v) => setBystander((s) => ({ ...s, titleId: v }))} />
          <Field label="Judul — EN" value={bystander.titleEn} onChange={(v) => setBystander((s) => ({ ...s, titleEn: v }))} />
        </div>
        <div className="ce-row">
          <Field label="Isi — ID" textarea value={bystander.bodyId} onChange={(v) => setBystander((s) => ({ ...s, bodyId: v }))} />
          <Field label="Isi — EN" textarea value={bystander.bodyEn} onChange={(v) => setBystander((s) => ({ ...s, bodyEn: v }))} />
        </div>
        <div className="ce-row">
          <Field label="Teks Tombol — ID" value={bystander.ctaId} onChange={(v) => setBystander((s) => ({ ...s, ctaId: v }))} />
          <Field label="Teks Tombol — EN" value={bystander.ctaEn} onChange={(v) => setBystander((s) => ({ ...s, ctaEn: v }))} />
        </div>
        <ImageUploader
          label="Booklet PDF (unggah)"
          value={bystander.link}
          prefix="bystander"
          kind="pdf"
          onChange={(url) => setBystander((s) => ({ ...s, link: url }))}
        />
        <Field
          label="…atau tempel link booklet (mis. Google Drive / Canva)"
          value={bystander.link}
          onChange={(v) => setBystander((s) => ({ ...s, link: v }))}
        />
      </div>

      {/* HOME VIDEO GALLERY */}
      <div className="ce-section" style={{ marginTop: "2.5rem" }}>
        Beranda — Galeri Video Kampanye
      </div>
      {videos.map((v, i) => (
        <div className="blk-card" key={i}>
          <div className="blk-head">
            <span>Video {i + 1}</span>
            <div className="blk-actions">
              <button className="ab" onClick={() => setVideos((x) => move(x, i, -1))} disabled={i === 0}>
                ↑
              </button>
              <button
                className="ab"
                onClick={() => setVideos((x) => move(x, i, 1))}
                disabled={i === videos.length - 1}
              >
                ↓
              </button>
              <button className="ab ab-rej" onClick={() => setVideos((x) => x.filter((_, j) => j !== i))}>
                Hapus
              </button>
            </div>
          </div>
          <Field
            label="Link Video (YouTube / Vimeo)"
            value={v.url}
            onChange={(val) => patchVideo(i, { url: val })}
          />
          <div className="ce-row">
            <Field label="Judul — ID" value={v.titleId} onChange={(val) => patchVideo(i, { titleId: val })} />
            <Field label="Judul — EN" value={v.titleEn} onChange={(val) => patchVideo(i, { titleEn: val })} />
          </div>
          <div className="ce-row">
            <Field label="Deskripsi — ID" textarea value={v.descId} onChange={(val) => patchVideo(i, { descId: val })} />
            <Field label="Deskripsi — EN" textarea value={v.descEn} onChange={(val) => patchVideo(i, { descEn: val })} />
          </div>
        </div>
      ))}
      <button
        className="btn btn-outline"
        onClick={() =>
          setVideos((x) => [...x, { url: "", titleId: "", titleEn: "", descId: "", descEn: "" }])
        }
      >
        + Tambah Video
      </button>

      <div style={{ marginTop: "2rem" }}>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan Semua"}
        </button>
        {note && <div className="save-note">{note}</div>}
      </div>
    </div>
  );
}
