"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { apiPost } from "@/lib/client";

export default function ContactView() {
  const { c, t, lang } = useLang();
  const subjects =
    lang === "id"
      ? ["Kolaborasi", "Media / Press", "Donasi", "Pertanyaan umum", "Lainnya"]
      : ["Collaboration", "Media / Press", "Donation", "General question", "Other"];

  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setErr("");
    if (!form.email.trim() || !form.message.trim()) {
      setErr(t("err.required"));
      return;
    }
    setBusy(true);
    const res = await apiPost("/api/contact", form);
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__rate__" ? t("err.rate") : res.error === "__generic__" ? t("err.generic") : res.error);
      return;
    }
    setDone(true);
  }

  const email = c("ci.email");
  const wa = c("ci.wa");
  const ig = c("ci.ig");
  const hotline = c("ci.hotline");

  return (
    <div className="fade-in">
      <div className="container">
        <div className="cont-grid">
          <div className="cont-info">
            <div className="lbl" style={{ marginBottom: "1.25rem" }}>
              {lang === "id" ? "Kontak / Contact" : "Contact"}
            </div>
            <h2>{c("cont.title")}</h2>
            <p>{c("cont.body")}</p>
            <div>
              <div className="cdi">
                <span>{t("contact.detail.email")}</span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div className="cdi">
                <span>{t("contact.detail.wa")}</span>
                <a href={`https://wa.me/${wa.replace(/\D/g, "")}`}>{wa}</a>
              </div>
              <div className="cdi">
                <span>{t("contact.detail.ig")}</span>
                <p>{ig}</p>
              </div>
              <div className="cdi">
                <span>{t("contact.detail.crisis")}</span>
                <a href={`tel:${hotline.replace(/\D/g, "")}`}>SAPA {hotline}</a>
              </div>
            </div>
          </div>

          <div>
            <div className="fcard" style={{ margin: 0 }}>
              {done ? (
                <div className="ok-msg">
                  <h3>{t("form.contact.okTitle")}</h3>
                  <p>{t("form.contact.okBody")}</p>
                </div>
              ) : (
                <>
                  {err && <div className="err-msg">{err}</div>}
                  <div className="fg">
                    <label>{t("form.contact.name")}</label>
                    <input
                      type="text"
                      placeholder={t("form.contact.namePh")}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </div>
                  <div className="fg">
                    <label>{t("form.contact.email")} *</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>{t("form.contact.subject")}</label>
                    <select value={form.subject} onChange={(e) => set("subject", e.target.value)}>
                      {subjects.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label>{t("form.contact.message")} *</label>
                    <textarea
                      placeholder={t("form.contact.messagePh")}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary btn-full" onClick={submit} disabled={busy}>
                    {busy ? t("cta.sending") : t("form.contact.submit")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
