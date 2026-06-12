"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";

const SEEN_KEY = "ps_ob_seen";

export default function Onboarding() {
  const { c, t, lang, setLang } = useLang();
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function dismiss() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setExiting(true);
    setTimeout(() => setShow(false), 900);
  }

  if (!show) return null;
  const bg = c("img.onboarding");
  const logo = c("img.logo");

  return (
    <div className={`onboarding ${exiting ? "exit" : ""}`}>
      <div className="ob-bg" style={bg ? { backgroundImage: `url(${bg})` } : undefined} />
      <div className="ob-overlay" />
      <div className="ob-lang">
        <button className={lang === "id" ? "active" : ""} onClick={() => setLang("id")}>
          ID
        </button>
        <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
          EN
        </button>
      </div>
      <div className="ob-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ob-logo-img" src={logo} alt="ProofSpeak" />
        <button className="ob-learn" onClick={dismiss}>
          {t("ob.learn")}
        </button>
      </div>
      <div className="ob-crisis">{t("ob.crisis")}</div>
    </div>
  );
}
