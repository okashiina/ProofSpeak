"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Product } from "@/lib/db/schema";
import { getVideos, isFileVideo, pick, toEmbedUrl } from "@/lib/dynamic";

/**
 * Uploaded campaign video: loops muted, but only plays (and downloads) while
 * on screen. Playback starts from JS because React doesn't serialize `muted`
 * into server-rendered HTML, so a plain autoPlay attribute gets blocked by
 * browser autoplay policy — and autoPlay would also make every gallery video
 * download in full on page load.
 */
function LoopVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      controls
      preload="metadata"
      aria-label={label}
    />
  );
}

export default function HomeView({
  products,
  stats,
}: {
  products: Product[];
  stats: { stories: number; orders: number };
}) {
  const { c, t, lang, content } = useLang();
  const heroImg = c("img.hero");
  const videos = getVideos(content);

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

      {/* CAMPAIGN VIDEO GALLERY */}
      {videos.length > 0 && (
        <section className="secpad" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div className="sec-idx">03 / {c("home.vid.label")}</div>
            <h2 className="disp-md" style={{ marginBottom: "3rem", maxWidth: 620 }}>
              {c("home.vid.title")}
            </h2>
            <div className="vid-gallery">
              {videos.map((v, i) => {
                const file = isFileVideo(v.url);
                const embed = file ? "" : toEmbedUrl(v.url);
                const title = pick(v.titleId, v.titleEn, lang);
                const desc = pick(v.descId, v.descEn, lang);
                return (
                  <article className="vid-item" key={i}>
                    <div className="vid-embed">
                      {file ? (
                        <LoopVideo src={v.url} label={title || `Video ${i + 1}`} />
                      ) : embed ? (
                        <iframe
                          src={embed}
                          title={title || `Video ${i + 1}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="vid-empty">Video belum tersedia</div>
                      )}
                    </div>
                    <div className="vid-info">
                      <div className="lbl" style={{ marginBottom: ".75rem" }}>
                        {lang === "id" ? "Tentang Video Ini" : "About This Video"}
                      </div>
                      {title && <h3 className="vid-title">{title}</h3>}
                      {desc && <p className="vid-desc">{desc}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
