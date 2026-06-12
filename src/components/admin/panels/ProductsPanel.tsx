"use client";

import { useState } from "react";
import { apiPost, apiSend } from "@/lib/client";
import ImageUploader from "../ImageUploader";
import type { Product } from "@/lib/db/schema";

interface FormState {
  name: string;
  price: string;
  descId: string;
  descEn: string;
  symbol: string;
  colors: string;
  imageUrl: string;
  status: "active" | "inactive";
  sortOrder: number;
}

const EMPTY: FormState = {
  name: "",
  price: "",
  descId: "",
  descEn: "",
  symbol: "○",
  colors: "Silver, Rose Gold, Gold",
  imageUrl: "",
  status: "active",
  sortOrder: 0,
};

export default function ProductsPanel({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY, sortOrder: products.length + 1 });
    setShowForm(true);
    setErr("");
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      descId: p.descId,
      descEn: p.descEn,
      symbol: p.symbol,
      colors: p.colors.join(", "),
      imageUrl: p.imageUrl,
      status: p.status === "inactive" ? "inactive" : "active",
      sortOrder: p.sortOrder,
    });
    setShowForm(true);
    setErr("");
  }

  async function save() {
    setErr("");
    if (!form.name.trim() || !form.price.trim()) {
      setErr("Nama dan harga wajib diisi.");
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      price: form.price.trim(),
      descId: form.descId,
      descEn: form.descEn,
      symbol: form.symbol || "○",
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      imageUrl: form.imageUrl,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };
    const res =
      editId === null
        ? await apiPost<Product>("/api/seller/products", payload)
        : await apiSend<Product>(`/api/seller/products/${editId}`, "PUT", payload);
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__generic__" ? "Gagal menyimpan." : res.error);
      return;
    }
    const saved = res.data as Product;
    setProducts((prev) =>
      editId === null ? [...prev, saved] : prev.map((p) => (p.id === editId ? saved : p)),
    );
    setShowForm(false);
  }

  async function toggleStatus(p: Product) {
    const next = p.status === "active" ? "inactive" : "active";
    const res = await apiSend<Product>(`/api/seller/products/${p.id}`, "PUT", {
      name: p.name,
      price: p.price,
      descId: p.descId,
      descEn: p.descEn,
      symbol: p.symbol,
      colors: p.colors,
      imageUrl: p.imageUrl,
      status: next,
      sortOrder: p.sortOrder,
    });
    if (res.ok) setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
  }

  async function remove(p: Product) {
    if (!confirm(`Hapus produk "${p.name}"?`)) return;
    const res = await apiSend(`/api/seller/products/${p.id}`, "DELETE");
    if (res.ok) setProducts((prev) => prev.filter((x) => x.id !== p.id));
  }

  return (
    <div>
      <div className="adm-title">Produk Kalung</div>
      <div className="adm-sub">Kelola kalung solidaritas. Foto disimpan permanen di cloud.</div>

      {!showForm && (
        <button className="btn btn-teal btn-sm" onClick={openNew} style={{ marginBottom: "1.5rem" }}>
          + Tambah Produk
        </button>
      )}

      {showForm && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", marginBottom: "1.25rem" }}>
            {editId === null ? "Produk Baru" : "Edit Produk"}
          </div>
          {err && <div className="err-msg">{err}</div>}
          <div className="frow">
            <div className="fg">
              <label>Nama Produk</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Hope Circle" />
            </div>
            <div className="fg">
              <label>Harga</label>
              <input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Rp 185.000" />
            </div>
          </div>
          <div className="frow">
            <div className="fg">
              <label>Deskripsi — ID</label>
              <textarea style={{ minHeight: 70 }} value={form.descId} onChange={(e) => set("descId", e.target.value)} />
            </div>
            <div className="fg">
              <label>Deskripsi — EN</label>
              <textarea style={{ minHeight: 70 }} value={form.descEn} onChange={(e) => set("descEn", e.target.value)} />
            </div>
          </div>
          <div className="frow">
            <div className="fg">
              <label>Pilihan Warna (pisah koma)</label>
              <input value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Silver, Gold" />
            </div>
            <div className="fg">
              <label>Simbol / Emoji (jika tanpa foto)</label>
              <input value={form.symbol} onChange={(e) => set("symbol", e.target.value)} placeholder="○" />
            </div>
          </div>
          <div className="frow">
            <div className="fg">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as "active" | "inactive")}>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div className="fg">
              <label>Urutan</label>
              <input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
            </div>
          </div>
          <ImageUploader
            label="Foto Produk"
            value={form.imageUrl}
            prefix="products"
            onChange={(url) => set("imageUrl", url)}
          />
          <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Produk"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
              Batal
            </button>
          </div>
        </div>
      )}

      {products.map((p) => (
        <div className="pad-card" key={p.id}>
          <div className="pad-head">
            <div className="pad-thumb">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} />
              ) : (
                p.symbol
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: "1.05rem" }}>{p.name}</div>
                <span className={`badge badge-${p.status === "active" ? "approved" : "rejected"}`}>{p.status}</span>
              </div>
              <div style={{ fontSize: ".78rem", color: "rgba(224,224,224,.35)" }}>
                {p.price} · {p.colors.join(", ")}
              </div>
            </div>
          </div>
          <div className="pad-actions">
            <button className="ab ab-view" onClick={() => openEdit(p)}>
              Edit
            </button>
            <button className={`ab ${p.status === "active" ? "ab-rej" : "ab-app"}`} onClick={() => toggleStatus(p)}>
              {p.status === "active" ? "Nonaktifkan" : "Aktifkan"}
            </button>
            <button className="ab ab-rej" onClick={() => remove(p)}>
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
