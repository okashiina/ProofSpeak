"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Story } from "@/lib/db/schema";

function fmtDate(d: Date | string, lang: string): string {
  try {
    return new Date(d).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function StoriesView({ stories }: { stories: Story[] }) {
  const { c, t, lang } = useLang();
  const [open, setOpen] = useState<Story | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fade-in">
      <section className="stories-hero">
        <div className="container">
          <div className="lbl" style={{ marginBottom: "1.25rem" }}>
            {c("stories.label")}
          </div>
          <div className="stories-head">
            <h1 className="disp-lg" style={{ maxWidth: 620 }}>
              {c("stories.title")}
            </h1>
            <Link className="btn btn-outline" href="/stories/submit">
              + {t("cta.share")}
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {stories.length === 0 ? (
        <div style={{ padding: "4rem 1.25rem", textAlign: "center", color: "rgba(224,224,224,.3)", fontSize: ".9rem" }}>
          {t("stories.empty")}
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((s) => (
            <button className="sc" key={s.id} onClick={() => setOpen(s)}>
              <span className={`tag-s ${s.trigger ? "tag-t" : "tag-l"}`}>
                {s.trigger ? `TW: ${s.trigger}` : t("stories.tag")}
              </span>
              <div className="sc-title">{s.title}</div>
              <div className="sc-exc">{s.body.slice(0, 180).replace(/\n/g, " ")}…</div>
              <div className="sc-meta">
                <span className="sc-auth">{s.name || (lang === "id" ? "Anonim" : "Anonymous")}</span>
                <span className="sc-date">{fmtDate(s.createdAt, lang)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "3rem 1.25rem", textAlign: "center" }}>
        <Link className="btn btn-ghost" href="/stories/submit">
          {t("stories.shareCta")}
        </Link>
      </div>

      {open && (
        <div className="modal-bd" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={open.title}>
            <button className="modal-x" onClick={() => setOpen(null)} aria-label={t("nav.close")}>
              ✕
            </button>
            <div className="modal-tag">
              {open.trigger ? `TW: ${open.trigger}` : t("stories.tag")}
            </div>
            <div className="modal-title">{open.title}</div>
            <div className="modal-meta">
              {(open.name || (lang === "id" ? "Anonim" : "Anonymous"))} · {fmtDate(open.createdAt, lang)}
            </div>
            <div className="modal-body">{open.body}</div>
          </div>
        </div>
      )}
    </div>
  );
}
