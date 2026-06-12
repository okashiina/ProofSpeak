"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { UIKey } from "@/lib/i18n";

const LINKS: { href: string; key: UIKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/stories", key: "nav.stories" },
  { href: "/necklace", key: "nav.necklace" },
  { href: "/contact", key: "nav.contact" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteNav() {
  const { t, c, lang, setLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logo = c("img.logo");

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <div className="nav-wrap">
      <nav className="nav" aria-label="Utama">
        <Link href="/" className="nav-logo" aria-label="ProofSpeak — Beranda">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="ProofSpeak" />
        </Link>

        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(pathname, l.href) ? "active" : ""}>
              {t(l.key)}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Bahasa / Language">
            <button
              className={`lang-btn ${lang === "id" ? "active" : ""}`}
              onClick={() => setLang("id")}
              aria-pressed={lang === "id"}
            >
              ID
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>
          <button
            className={`nav-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("nav.close") : t("nav.menu")}
            aria-expanded={open}
          >
            <span />
          </button>
        </div>
      </nav>
    </div>

      {/* Mobile menu overlay — kept OUTSIDE .nav-wrap so its backdrop-filter
          doesn't make the blurred nav a containing block for this fixed overlay. */}
      <div className={`mobile-menu ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={t("nav.menu")}>
        <div className="mobile-menu-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="ProofSpeak" />
          <button className="mm-close" onClick={() => setOpen(false)} aria-label={t("nav.close")}>
            ✕
          </button>
        </div>
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(pathname, l.href) ? "active" : ""}>
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === "id" ? "active" : ""}`}
              onClick={() => setLang("id")}
              aria-pressed={lang === "id"}
            >
              ID
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
