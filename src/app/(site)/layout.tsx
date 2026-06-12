import { cookies } from "next/headers";
import { getContentMap } from "@/lib/content";
import { LanguageProvider } from "@/components/LanguageProvider";
import CrisisBar from "@/components/site/CrisisBar";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Onboarding from "@/components/site/Onboarding";
import type { Lang } from "@/lib/types";

// Content is owner-editable and should reflect immediately, so render per request.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const lang = (jar.get("ps_lang")?.value === "en" ? "en" : "id") as Lang;
  const content = await getContentMap();

  return (
    <LanguageProvider initialLang={lang} content={content}>
      <Onboarding />
      <CrisisBar />
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </LanguageProvider>
  );
}
