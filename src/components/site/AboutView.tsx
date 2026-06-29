"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { getAboutBlocks, getBystander, pick } from "@/lib/dynamic";

export default function AboutView() {
  const { c, t, lang, content } = useLang();
  const values = [
    { t: c("about.v1t"), d: c("about.v1d") },
    { t: c("about.v2t"), d: c("about.v2d") },
    { t: c("about.v3t"), d: c("about.v3d") },
    { t: c("about.v4t"), d: c("about.v4d") },
  ];
  const pillars = [
    { n: "01", color: "var(--lime)", t: c("camp.c1.title"), b: c("camp.c1.body") },
    { n: "02", color: "var(--pink)", t: c("camp.c2.title"), b: c("camp.c2.body") },
    { n: "03", color: "var(--teal)", t: c("camp.c3.title"), b: c("camp.c3.body") },
  ];
  const blocks = getAboutBlocks(content);
  const bystander = getBystander(content);
  const igUrl = c("ci.ig.url");
  const igHandle = c("ci.ig");

  return (
    <div className="fade-in">
      <section style={{ padding: "7rem 0 4rem" }}>
        <div className="container">
          <div className="lbl" style={{ marginBottom: "1.25rem" }}>
            {c("about.label")}
          </div>
          <h1 className="disp-lg" style={{ marginBottom: "3rem", maxWidth: 800 }}>
            {c("about.title")}
          </h1>
          <div className="about-grid">
            <div>
              <p className="ab-mission">{c("about.mission")}</p>
              <p className="muted" style={{ marginTop: "2rem", lineHeight: 1.8, fontSize: ".9rem" }}>
                {c("about.body")}
              </p>
            </div>
            <div className="ab-values">
              {values.map((v, i) => (
                <div className="ab-val" key={i}>
                  <h4>{v.t}</h4>
                  <p>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR TOPIC COLUMNS — deeper context, each with optional photo */}
      {blocks.length > 0 && (
        <section style={{ padding: "1rem 0 5rem" }}>
          <div className="container">
            <div className="lbl" style={{ marginBottom: "1.25rem" }}>
              {c("about.topics.label")}
            </div>
            <h2 className="disp-md" style={{ marginBottom: "3rem", maxWidth: 620 }}>
              {c("about.topics.title")}
            </h2>
            <div className="topic-list">
              {blocks.map((b, i) => {
                const title = pick(b.titleId, b.titleEn, lang);
                const body = pick(b.bodyId, b.bodyEn, lang);
                return (
                  <article className={`topic-row ${b.image ? "has-img" : ""}`} key={i}>
                    {b.image && (
                      <div className="topic-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.image} alt={title} loading="lazy" />
                      </div>
                    )}
                    <div className="topic-text">
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BYSTANDER GUIDE */}
      {(bystander.titleId || bystander.titleEn || bystander.bodyId || bystander.bodyEn) && (
        <section className="bystander">
          <div className="container">
            <div className="bys-card">
              <div className="bys-text">
                <div className="lbl" style={{ marginBottom: "1rem", color: "var(--black)" }}>
                  ProofSpeak
                </div>
                <h2>{pick(bystander.titleId, bystander.titleEn, lang)}</h2>
                <p>{pick(bystander.bodyId, bystander.bodyEn, lang)}</p>
                {bystander.link && (
                  <a
                    className="btn btn-primary"
                    href={bystander.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: "1.75rem" }}
                  >
                    {pick(bystander.ctaId, bystander.ctaEn, lang) ||
                      (lang === "id" ? "Buka Booklet" : "Open the Booklet")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      <section style={{ padding: "6rem 0 5rem" }}>
        <div className="container">
          <div className="lbl" style={{ marginBottom: "1.25rem" }}>
            {c("camp.label")}
          </div>
          <h2 className="disp-lg" style={{ marginBottom: "1rem" }}>
            {c("camp.title")}
          </h2>
          <p
            className="muted"
            style={{ maxWidth: 540, marginBottom: "3.5rem", lineHeight: 1.7, fontSize: ".9rem" }}
          >
            {c("camp.sub")}
          </p>
          <div className="camp-grid">
            {pillars.map((p) => (
              <div className="camp-card" key={p.n}>
                <div className="camp-num" style={{ color: p.color }}>
                  {p.n}
                </div>
                <h3>{p.t}</h3>
                <p>{p.b}</p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "2.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link className="btn btn-primary" href="/necklace">
              {t("cta.seeNecklace")}
            </Link>
            <Link className="btn btn-outline" href="/stories/submit">
              {t("cta.share")}
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM REDIRECT — very bottom of About */}
      {igUrl && (
        <section className="ig-strip">
          <div className="container">
            <div className="ig-inner">
              <div>
                <div className="lbl" style={{ marginBottom: ".6rem" }}>
                  {lang === "id" ? "Ikuti gerakannya" : "Follow the movement"}
                </div>
                <h2 className="disp-md">{igHandle}</h2>
              </div>
              <a className="btn btn-outline" href={igUrl} target="_blank" rel="noopener noreferrer">
                {lang === "id" ? "Buka Instagram" : "Open Instagram"}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
