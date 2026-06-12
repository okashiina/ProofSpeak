import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import type { Lang } from "@/lib/types";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://proofspeak.vercel.app"),
  title: {
    default: "ProofSpeak — Suaramu, Buktimu",
    template: "%s — ProofSpeak",
  },
  description:
    "ProofSpeak — Kampanye kesadaran kekerasan seksual. Ruang aman untuk bersuara, bersaksi, dan bergerak bersama.",
  openGraph: {
    title: "ProofSpeak — Suaramu, Buktimu",
    description: "Kampanye kesadaran kekerasan seksual.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#171817",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const lang = (jar.get("ps_lang")?.value === "en" ? "en" : "id") as Lang;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
