"use client";

import { useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { apiPost } from "@/lib/client";
import type { Product } from "@/lib/db/schema";

const PAYMENTS = [
  "Transfer Bank (BCA / BNI / Mandiri)",
  "GoPay / OVO / Dana",
  "QRIS",
  "COD (Jabodetabek)",
];

export default function NecklaceView({ products }: { products: Product[] }) {
  const { c, t, lang } = useLang();
  const formRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    qty: "1",
    color: "",
    payment: PAYMENTS[0],
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function selectProduct(p: Product) {
    setSelected(p);
    setForm((f) => ({ ...f, color: p.colors[0] ?? "" }));
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  async function submit() {
    setErr("");
    if (!selected) {
      setErr(t("form.order.selectFirst"));
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setErr(t("err.required"));
      return;
    }
    setBusy(true);
    const res = await apiPost("/api/orders", {
      productId: selected.id,
      item: `${selected.name} — ${selected.price}`,
      price: selected.price,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      qty: Number(form.qty) || 1,
      color: form.color,
      payment: form.payment,
      message: form.message,
    });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__rate__" ? t("err.rate") : res.error === "__generic__" ? t("err.generic") : res.error);
      return;
    }
    setDone(true);
  }

  const colorOptions = selected?.colors.length ? selected.colors : ["Silver", "Rose Gold", "Gold"];

  return (
    <div className="fade-in">
      <section className="neck-hero">
        <div className="container">
          <div className="lbl" style={{ marginBottom: "1.25rem" }}>
            {lang === "id" ? "Kalung / Necklace" : "Necklace"}
          </div>
          <div className="neck-head">
            <div>
              <h1 className="disp-lg">{c("neck.title")}</h1>
              <p className="muted" style={{ marginTop: ".75rem", maxWidth: 460, fontSize: ".9rem" }}>
                {c("neck.sub")}
              </p>
            </div>
          </div>

          <div className="neck-grid">
            {products.length === 0 ? (
              <div style={{ padding: "3rem 1.25rem", color: "rgba(224,224,224,.3)" }}>
                {lang === "id" ? "Belum ada produk aktif." : "No active products."}
              </div>
            ) : (
              products.map((p) => (
                <button
                  key={p.id}
                  className={`nc ${selected?.id === p.id ? "sel" : ""}`}
                  onClick={() => selectProduct(p)}
                  aria-pressed={selected?.id === p.id}
                >
                  <div className="nc-img">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} />
                    ) : (
                      <span className="nc-sym">{p.symbol}</span>
                    )}
                  </div>
                  <div className="nc-body">
                    <div className="nc-name">{p.name}</div>
                    <div className="nc-desc">{lang === "id" ? p.descId : p.descEn}</div>
                    <div className="nc-price">{p.price}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="fcard" ref={formRef} style={{ marginTop: "2.5rem", maxWidth: "100%" }}>
            {done ? (
              <div className="ok-msg">
                <h3>{t("form.order.okTitle")}</h3>
                <p>{t("form.order.okBody")}</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "1.75rem" }}>{t("form.order.title")}</h2>
                {err && <div className="err-msg">{err}</div>}
                <div className="fg">
                  <label>{t("form.order.item")}</label>
                  <input
                    type="text"
                    readOnly
                    value={selected ? `${selected.name} — ${selected.price}` : ""}
                    placeholder={t("form.order.itemPh")}
                    style={{ color: "var(--lime)", cursor: "default" }}
                  />
                </div>
                <div className="frow">
                  <div className="fg">
                    <label>{t("form.order.name")} *</label>
                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>{t("form.order.phone")} *</label>
                    <input type="tel" placeholder="+62…" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                </div>
                <div className="fg">
                  <label>{t("form.order.email")}</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="fg">
                  <label>{t("form.order.address")} *</label>
                  <textarea
                    placeholder={t("form.order.addressPh")}
                    style={{ minHeight: 75 }}
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>
                <div className="frow">
                  <div className="fg">
                    <label>{t("form.order.qty")}</label>
                    <input type="number" min={1} max={20} value={form.qty} onChange={(e) => set("qty", e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>{t("form.order.color")}</label>
                    <select value={form.color} onChange={(e) => set("color", e.target.value)}>
                      {colorOptions.map((co) => (
                        <option key={co}>{co}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="fg">
                  <label>{t("form.order.payment")}</label>
                  <select value={form.payment} onChange={(e) => set("payment", e.target.value)}>
                    {PAYMENTS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label>{t("form.order.message")}</label>
                  <input
                    type="text"
                    placeholder={t("form.order.messagePh")}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-full" onClick={submit} disabled={busy}>
                  {busy ? t("cta.sending") : t("form.order.submit")}
                </button>
                <p className="muted" style={{ fontSize: ".72rem", textAlign: "center", marginTop: ".6rem" }}>
                  {t("form.order.note")}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
