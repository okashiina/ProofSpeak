"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client";
import { STORY_STATUSES, type StoryStatus } from "@/lib/types";
import type { Story } from "@/lib/db/schema";

export default function StoriesPanel({
  stories,
  setStories,
}: {
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [view, setView] = useState<Story | null>(null);

  async function setStatus(id: number, status: StoryStatus) {
    const res = await apiSend(`/api/seller/stories/${id}`, "PATCH", { status });
    if (res.ok) setStories((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  async function remove(s: Story) {
    if (!confirm("Hapus cerita ini?")) return;
    const res = await apiSend(`/api/seller/stories/${s.id}`, "DELETE");
    if (res.ok) setStories((prev) => prev.filter((x) => x.id !== s.id));
  }

  return (
    <div>
      <div className="adm-title">Moderasi Cerita</div>
      <div className="adm-sub">
        Cerita baru masuk dengan status “pending”. Setujui agar tampil di halaman Cerita publik.
      </div>

      {stories.length === 0 ? (
        <p className="adm-sub" style={{ margin: 0 }}>Belum ada cerita masuk.</p>
      ) : (
        <div className="tbl-w">
          <table className="tbl">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id}>
                  <td style={{ maxWidth: 260 }}>{s.title}</td>
                  <td>{s.name || "Anonim"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(s.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <select value={s.status} onChange={(e) => setStatus(s.id, e.target.value as StoryStatus)}>
                      {STORY_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st === "pending" ? "Menunggu" : st === "approved" ? "Disetujui" : "Ditolak"}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      <button className="ab ab-view" onClick={() => setView(s)}>
                        Lihat
                      </button>
                      <button className="ab ab-rej" onClick={() => remove(s)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && (
        <div className="modal-bd" onClick={(e) => e.target === e.currentTarget && setView(null)}>
          <div className="modal">
            <button className="modal-x" onClick={() => setView(null)} aria-label="Tutup">
              ✕
            </button>
            <div className="modal-tag">{view.trigger ? `TW: ${view.trigger}` : "Kisah Penyintas"}</div>
            <div className="modal-title">{view.title}</div>
            <div className="modal-meta">
              {(view.name || "Anonim")} · {new Date(view.createdAt).toLocaleDateString("id-ID")} ·{" "}
              {view.lang.toUpperCase()}
            </div>
            <div className="modal-body">{view.body}</div>
          </div>
        </div>
      )}
    </div>
  );
}
