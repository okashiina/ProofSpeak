"use client";

import { apiSend } from "@/lib/client";
import type { Story, Order, Contact, Product } from "@/lib/db/schema";
import type { StoryStatus } from "@/lib/types";

export default function DashboardPanel({
  stories,
  orders,
  contacts,
  products,
  setStories,
  onGoto,
}: {
  stories: Story[];
  orders: Order[];
  contacts: Contact[];
  products: Product[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  onGoto: (tab: string) => void;
}) {
  const pending = stories.filter((s) => s.status === "pending");
  const approved = stories.filter((s) => s.status === "approved").length;
  const newMsgs = contacts.filter((c) => c.status === "new").length;
  const activeProducts = products.filter((p) => p.status === "active").length;

  async function moderate(id: number, status: StoryStatus) {
    const res = await apiSend(`/api/seller/stories/${id}`, "PATCH", { status });
    if (res.ok) setStories((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  const metrics = [
    { v: pending.length, l: "Cerita Menunggu" },
    { v: approved, l: "Cerita Tayang" },
    { v: orders.length, l: "Total Pesanan" },
    { v: newMsgs, l: "Pesan Baru" },
  ];

  return (
    <div>
      <div className="adm-title">Dashboard</div>
      <div className="adm-sub">Ringkasan aktivitas ProofSpeak.</div>

      <div className="a-metrics">
        {metrics.map((m) => (
          <div className="a-met" key={m.l}>
            <div className="a-met-v">{m.v}</div>
            <div className="a-met-l">{m.l}</div>
          </div>
        ))}
      </div>

      <div className="lbl" style={{ marginBottom: ".75rem" }}>
        Cerita Menunggu Tinjauan
      </div>
      {pending.length === 0 ? (
        <p className="adm-sub" style={{ margin: 0 }}>
          Tidak ada cerita yang menunggu. {activeProducts} produk aktif.{" "}
          <button className="ab ab-view" onClick={() => onGoto("stories")}>
            Lihat semua cerita
          </button>
        </p>
      ) : (
        pending.map((s) => (
          <div className="pend-item" key={s.id}>
            <div style={{ minWidth: 0 }}>
              <div className="pend-t">{s.title}</div>
              <div className="pend-m">
                {(s.name || "Anonim")} · {new Date(s.createdAt).toLocaleDateString("id-ID")}
              </div>
            </div>
            <div className="pend-actions">
              <button className="ab ab-app" onClick={() => moderate(s.id, "approved")}>
                Setujui
              </button>
              <button className="ab ab-rej" onClick={() => moderate(s.id, "rejected")}>
                Tolak
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
