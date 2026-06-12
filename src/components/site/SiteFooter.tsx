"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

export default function SiteFooter() {
  const { t, c } = useLang();
  const email = c("ci.email");
  const hotline = c("ci.hotline");
  const logo = c("img.logo");
  const year = 2025;

  return (
    <footer>
      <div className="ft-grid">
        <div>
          <div className="ft-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="ProofSpeak" />
          </div>
          <p className="ft-tag">{t("footer.madeWith")}</p>
        </div>
        <div className="ft-col">
          <h4>{t("footer.nav")}</h4>
          <Link href="/">{t("nav.home")}</Link>
          <Link href="/about">{t("nav.about")}</Link>
        </div>
        <div className="ft-col">
          <h4>{t("footer.platform")}</h4>
          <Link href="/stories">{t("nav.stories")}</Link>
          <Link href="/necklace">{t("nav.necklace")}</Link>
        </div>
        <div className="ft-col">
          <h4>{t("footer.help")}</h4>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${hotline.replace(/\D/g, "")}`}>SAPA {hotline}</a>
          <Link href="/contact">{t("nav.contact")}</Link>
        </div>
      </div>
      <div className="ft-bot">
        <span>© {year} ProofSpeak. {t("footer.rights")}</span>
        <span>ProofSpeak</span>
      </div>
    </footer>
  );
}
