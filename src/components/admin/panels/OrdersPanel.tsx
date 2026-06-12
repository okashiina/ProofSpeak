"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import type { Order } from "@/lib/db/schema";

const LABELS: Record<OrderStatus, string> = {
  pending: "Menunggu",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Diterima",
  cancelled: "Dibatalkan",
};

export default function OrdersPanel({
  orders,
  setOrders,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const [view, setView] = useState<Order | null>(null);

  async function setStatus(id: number, status: OrderStatus) {
    const res = await apiSend(`/api/seller/orders/${id}`, "PATCH", { status });
    if (res.ok) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function remove(o: Order) {
    if (!confirm("Hapus pesanan ini?")) return;
    const res = await apiSend(`/api/seller/orders/${o.id}`, "DELETE");
    if (res.ok) setOrders((prev) => prev.filter((x) => x.id !== o.id));
  }

  return (
    <div>
      <div className="adm-title">Pesanan</div>
      <div className="adm-sub">Semua pesanan kalung. Ubah status untuk melacak pengiriman.</div>

      {orders.length === 0 ? (
        <p className="adm-sub" style={{ margin: 0 }}>Belum ada pesanan.</p>
      ) : (
        <div className="tbl-w">
          <table className="tbl">
            <thead>
              <tr>
                <th>Item</th>
                <th>Pelanggan</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ maxWidth: 220 }}>{o.item}</td>
                  <td>
                    {o.name}
                    <div style={{ fontSize: ".7rem", color: "rgba(224,224,224,.35)" }}>{o.phone}</div>
                  </td>
                  <td>{o.qty}</td>
                  <td>
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}>
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      <button className="ab ab-view" onClick={() => setView(o)}>
                        Lihat
                      </button>
                      <button className="ab ab-rej" onClick={() => remove(o)}>
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
            <div className="modal-title" style={{ fontSize: "1.4rem" }}>{view.item}</div>
            <div className="modal-meta">
              {new Date(view.createdAt).toLocaleString("id-ID")} · {LABELS[view.status as OrderStatus] ?? view.status}
            </div>
            <div style={{ display: "grid", gap: ".55rem", fontSize: ".85rem" }}>
              <Row k="Nama" v={view.name} />
              <Row k="WhatsApp" v={view.phone} />
              <Row k="Email" v={view.email} />
              <Row k="Alamat" v={view.address} />
              <Row k="Jumlah" v={String(view.qty)} />
              <Row k="Warna" v={view.color} />
              <Row k="Harga" v={view.price} />
              <Row k="Pembayaran" v={view.payment} />
              <Row k="Catatan" v={view.message} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <span style={{ minWidth: 96, color: "rgba(224,224,224,.4)" }}>{k}</span>
      <span style={{ color: "var(--gray)" }}>{v || "—"}</span>
    </div>
  );
}
