"use client";

import { useLang } from "@/components/LanguageProvider";

export default function CrisisBar() {
  const { c } = useLang();
  return (
    <div className="crisis-bar" role="note">
      {c("crisis.bar")}
    </div>
  );
}
