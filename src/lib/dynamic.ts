import type { ContentMap, Lang } from "./types";

/**
 * Dynamic, repeatable content (editor can add/remove items) is stored as JSON
 * strings inside the existing site_content key/value store — no schema change.
 * Each key below holds one JSON document in its `id` value; the public site and
 * the admin read/write it through the helpers here.
 *
 * Keys:
 *  - about.blocks    -> AboutBlock[]   (extra topic columns on About, each with optional photo)
 *  - about.bystander -> BystanderGuide (the bystander guide section + booklet link)
 *  - home.videos     -> VideoItem[]    (campaign video gallery at the bottom of Home)
 */

/** An editor-added topic column on the About page (optional photo). */
export interface AboutBlock {
  titleId: string;
  titleEn: string;
  bodyId: string;
  bodyEn: string;
  image: string; // blob URL, optional
}

/** A campaign video + its description, shown gallery-style on Home. */
export interface VideoItem {
  url: string; // YouTube / Vimeo / embed link
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
}

/** The bystander guide section on About + a link to the PDF booklet. */
export interface BystanderGuide {
  titleId: string;
  titleEn: string;
  bodyId: string;
  bodyEn: string;
  ctaId: string;
  ctaEn: string;
  link: string; // booklet PDF URL (uploaded or pasted)
}

/** Pick the right language with id<->en fallback. */
export function pick(id: string, en: string, lang: Lang): string {
  if (lang === "en") return en || id || "";
  return id || en || "";
}

export const DEFAULT_ABOUT_BLOCKS: AboutBlock[] = [
  {
    titleId: "Pelindung diri yang merekam",
    titleEn: "Self-protection that records",
    bodyId:
      "ProofSpeak lahir dari satu kebutuhan sederhana: penyintas butuh bukti, bukan sekadar diingat. Kalung dan produk kami dirancang agar bisa merekam momen genting secara diskret, sehingga suara dan kesaksian punya pegangan yang nyata.",
    bodyEn:
      "ProofSpeak grew from one simple need: survivors need evidence, not just memory. Our necklace and products are built to discreetly record critical moments, so a voice and a testimony have something real to hold on to.",
    image: "",
  },
  {
    titleId: "Bukti yang menguatkan suara",
    titleEn: "Evidence that backs the voice",
    bodyId:
      "Rekaman bukan untuk menggantikan cerita, tapi untuk mendukungnya. Saat kata-kata diragukan, bukti yang tersimpan aman membantu penyintas dipercaya dan didampingi tanpa syarat.",
    bodyEn:
      "A recording does not replace the story, it supports it. When words are doubted, safely stored evidence helps a survivor be believed and accompanied without conditions.",
    image: "",
  },
];

export const DEFAULT_BYSTANDER: BystanderGuide = {
  titleId: "Panduan Bystander",
  titleEn: "Bystander Guide",
  bodyId:
    "Keluar dari zona penonton. Saat menyaksikan kekerasan, kamu bisa bertindak dengan aman lewat empat langkah: Tegur langsung, Alihkan perhatian, Delegasikan ke pihak berwenang, lalu Dokumentasikan. Pelajari langkah lengkapnya di booklet kami.",
  bodyEn:
    "Get out of the bystander zone. When you witness violence, you can act safely in four steps: address it directly, distract, delegate to an authority, then document. Learn the full steps in our booklet.",
  ctaId: "Buka Booklet Panduan",
  ctaEn: "Open the Guide Booklet",
  link: "",
};

export const DEFAULT_VIDEOS: VideoItem[] = [];

function parseJson<T>(raw: string, fallback: T): T {
  if (!raw || !raw.trim()) return fallback;
  try {
    const v = JSON.parse(raw);
    return v as T;
  } catch {
    return fallback;
  }
}

export function getAboutBlocks(map: ContentMap): AboutBlock[] {
  const raw = map["about.blocks"]?.id ?? "";
  const blocks = parseJson<AboutBlock[]>(raw, DEFAULT_ABOUT_BLOCKS);
  return Array.isArray(blocks) ? blocks : DEFAULT_ABOUT_BLOCKS;
}

export function getBystander(map: ContentMap): BystanderGuide {
  const raw = map["about.bystander"]?.id ?? "";
  const g = parseJson<BystanderGuide>(raw, DEFAULT_BYSTANDER);
  return g && typeof g === "object" && !Array.isArray(g)
    ? { ...DEFAULT_BYSTANDER, ...g }
    : DEFAULT_BYSTANDER;
}

export function getVideos(map: ContentMap): VideoItem[] {
  const raw = map["home.videos"]?.id ?? "";
  const v = parseJson<VideoItem[]>(raw, DEFAULT_VIDEOS);
  return Array.isArray(v) ? v : DEFAULT_VIDEOS;
}

/**
 * Turn a YouTube / Vimeo watch or share link into an embeddable URL. Returns the
 * input unchanged if it already looks like an embed, or "" when empty.
 */
export function toEmbedUrl(url: string): string {
  const u = (url || "").trim();
  if (!u) return "";

  // YouTube: watch?v=, youtu.be/, shorts/
  const yt =
    u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo: vimeo.com/123456
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  return u;
}
