"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import type { Product } from "@/lib/db/schema";

const MARQUEE = {
  id: ["Suaramu Nyata", "Kamu Dipercaya", "Tidak Salahmu", "Kamu Tidak Sendiri", "Bersuara Itu Berani"],
  en: ["Your Voice Is Real", "You Are Believed", "Not Your Fault", "You Are Not Alone", "Speaking Is Brave"],
};

export default function HomeView({
  products,
  stats,
}: {
  products: Product[];
  stats: { stories: number; orders: number };
}) {
  const { c, t, lang } = useLang();
  const heroImg = c("img.hero");
  const phrases = MARQUEE[lang];

  return (
    <div className="fade-in">
      {/* HERO */}
      <section
        className="hero"
        style={heroImg ? { backgroundImage: `url(${heroImg})` } : undefined}
      >
        <div className="hero-ov" />
        <div className="hero-amb" />
        <div className="hero-in">
          <div className="hero-lbl">{c("hero.label")}</div>
          <h1 className="hero-h">
            <span>{c("hero.l1")}</span>
            <br />
            <em>{c("hero.l2")}</em>
            <br />
            <span className="acc">{c("hero.l3")}</span>
          </h1>
          <div className="hero-bot">
            <p className="hero-desc">{c("hero.desc")}</p>
            <div className="hero-acts">
              <Link className="btn btn-outline" href="/stories/submit">
                {t("cta.share")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-w" aria-hidden="true">
        <div className="marquee-t">
          {[...phrases, ...phrases].map((p, i) => (
            <span className="mq-item" key={i}>
              {p} <span>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stat-strip">
        <div className="stat-item">
          <div className="stat-n">{stats.stories}</div>
          <div className="stat-l">{t("stat.stories")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-n">{stats.orders}</div>
          <div className="stat-l">{t("stat.orders")}</div>
        </div>
      </div>

      {/* WHY */}
      <section className="secpad">
        <div className="container">
          <div className="sec-idx">01 / {lang === "id" ? "Mengapa" : "Why"}</div>
          <h2 className="disp-md" style={{ maxWidth: 580, marginBottom: "3rem" }}>
            {c("why.title")}
          </h2>
          <div className="why-grid">
            {[
              { n: "1", tag: "tag-t", t: c("why.c1.title"), b: c("why.c1.body") },
              { n: "2", tag: "tag-p", t: c("why.c2.title"), b: c("why.c2.body") },
              { n: "3", tag: "tag-l", t: c("why.c3.title"), b: c("why.c3.body") },
            ].map((card) => (
              <div className="why-card" key={card.n}>
                <div className="why-n">{card.n}</div>
                <span className={`tag-s ${card.tag}`}>
                  {card.n === "1" ? "Fakta" : card.n === "2" ? "Realita" : "Aksi"}
                </span>
                <h3>{card.t}</h3>
                <p>{card.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED STATEMENT */}
      <div className="feat-strip">
        <h2>{c("feat.text")}</h2>
        <Link className="btn btn-outline" href="/stories" style={{ borderColor: "rgba(255,255,255,.3)", color: "#fff" }}>
          {t("cta.readStories")}
        </Link>
      </div>

      {/* PRODUCTS PREVIEW */}
      <section className="secpad">
        <div className="container">
          <div className="sec-idx">02 / {lang === "id" ? "Kalung Solidaritas" : "Solidarity Necklace"}</div>
          <h2 className="disp-md" style={{ marginBottom: ".55rem" }}>
            {c("prod.title")}
          </h2>
          <p className="muted" style={{ marginBottom: "2.5rem", fontSize: ".9rem" }}>
            {c("prod.sub")}
          </p>
          <div className="home-prods">
            {products.slice(0, 3).map((p) => (
              <Link className="hp-card" href="/necklace" key={p.id}>
                <div className="hp-sym">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} />
                  ) : (
                    p.symbol
                  )}
                </div>
                <div className="hp-name">{p.name}</div>
                <div className="hp-desc">{lang === "id" ? p.descId : p.descEn}</div>
                <div className="hp-price">{p.price}</div>
              </Link>
            ))}
            <Link className="hp-all" href="/necklace">
              <div className="lbl">{t("cta.seeAll")}</div>
              <span className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,.32)", color: "#fff" }}>
                {t("cta.fullCollection")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
