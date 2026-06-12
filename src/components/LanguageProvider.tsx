"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ContentMap, Lang } from "@/lib/types";
import { DEFAULT_CONTENT } from "@/lib/content-defaults";
import { UI, type UIKey } from "@/lib/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** editable content by key (owner-managed copy) */
  c: (key: string) => string;
  /** static UI string by key */
  t: (key: UIKey) => string;
  content: ContentMap;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({
  initialLang,
  content,
  children,
}: {
  initialLang: Lang;
  content: ContentMap;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `ps_lang=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => setLang(lang === "id" ? "en" : "id"), [lang, setLang]);

  const c = useCallback(
    (key: string) => {
      const entry = content[key] ?? DEFAULT_CONTENT[key];
      if (!entry) return "";
      return lang === "en" ? entry.en || entry.id : entry.id || entry.en;
    },
    [content, lang],
  );

  const t = useCallback((key: UIKey) => UI[lang][key] ?? UI.id[key] ?? key, [lang]);

  const value = useMemo<LangCtx>(
    () => ({ lang, setLang, toggle, c, t, content }),
    [lang, setLang, toggle, c, t, content],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
