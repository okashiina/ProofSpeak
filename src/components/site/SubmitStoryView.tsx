"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { apiPost } from "@/lib/client";

export default function SubmitStoryView() {
  const { c, t } = useLang();
  const [form, setForm] = useState({ name: "", title: "", body: "", trigger: "", lang: "id" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setErr("");
    if (!form.title.trim() || !form.body.trim()) {
      setErr(t("err.required"));
      return;
    }
    if (!consent) {
      setErr(t("err.consent"));
      return;
    }
    setBusy(true);
    const res = await apiPost("/api/stories", { ...form, consent });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__rate__" ? t("err.rate") : res.error === "__generic__" ? t("err.generic") : res.error);
      return;
    }
    setDone(true);
  }

  return (
    <div className="fade-in">
      <section style={{ padding: "6rem 0 5rem" }}>
        <div className="container-n">
          <div className="lbl" style={{ marginBottom: "1.25rem" }}>
            {t("cta.share")}
          </div>
          <h1 className="disp-md" style={{ marginBottom: "1rem" }}>
            {c("sub.title")}
          </h1>
          <p className="muted" style={{ marginBottom: "2.5rem", maxWidth: 460, lineHeight: 1.75 }}>
            {c("sub.sub")}
          </p>

          <div className="trauma-n">
            <p>{c("trauma.text")}</p>
          </div>

          <div className="fcard" style={{ maxWidth: "100%" }}>
            {done ? (
              <div className="ok-msg">
                <h3>{t("form.story.okTitle")}</h3>
                <p>{t("form.story.okBody")}</p>
              </div>
            ) : (
              <>
                {err && <div className="err-msg">{err}</div>}
                <div className="fg">
                  <label htmlFor="st-name">{t("form.story.name")}</label>
                  <input
                    id="st-name"
                    type="text"
                    placeholder={t("form.story.namePh")}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label htmlFor="st-title">{t("form.story.title")} *</label>
                  <input
                    id="st-title"
                    type="text"
                    placeholder={t("form.story.titlePh")}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label htmlFor="st-body">{t("form.story.body")} *</label>
                  <textarea
                    id="st-body"
                    placeholder={t("form.story.bodyPh")}
                    style={{ minHeight: 200 }}
                    value={form.body}
                    onChange={(e) => set("body", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label htmlFor="st-tw">{t("form.story.tw")}</label>
                  <input
                    id="st-tw"
                    type="text"
                    placeholder={t("form.story.twPh")}
                    value={form.trigger}
                    onChange={(e) => set("trigger", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label htmlFor="st-lang">{t("form.story.lang")}</label>
                  <select id="st-lang" value={form.lang} onChange={(e) => set("lang", e.target.value)}>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="cbw">
                  <input
                    type="checkbox"
                    id="st-consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <label htmlFor="st-consent">{t("form.story.consent")}</label>
                </div>
                <button className="btn btn-primary btn-full" onClick={submit} disabled={busy}>
                  {busy ? t("cta.sending") : t("form.story.submit")}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
