import type { ContentMap, Lang } from "./types";

export type FieldType = "text" | "textarea" | "image";

export interface ContentField {
  key: string;
  /** Section heading in the admin editor (Indonesian — owner-facing). */
  section: string;
  /** Field label in the admin editor. */
  label: string;
  type: FieldType;
  /** If false, only the `id` value is used (image URLs, contact info, etc.). */
  bilingual: boolean;
  id: string; // default Indonesian value (or single value / image URL)
  en: string; // default English value
}

/**
 * Single source of truth for editable content. Drives:
 *  - DEFAULT_CONTENT (fallback values shown before/without DB edits)
 *  - the seed script
 *  - the admin "Editor Konten" form (grouped by `section`)
 */
export const CONTENT_FIELDS: ContentField[] = [
  // ---- Gambar / Images ----
  { key: "img.logo", section: "Gambar", label: "Logo", type: "image", bilingual: false, id: "/images/logo.jpg", en: "" },
  { key: "img.hero", section: "Gambar", label: "Background Beranda (Hero)", type: "image", bilingual: false, id: "/images/hero.jpg", en: "" },
  { key: "img.onboarding", section: "Gambar", label: "Background Layar Pembuka", type: "image", bilingual: false, id: "/images/onboarding.jpg", en: "" },

  // ---- Umum / Crisis + Kontak ----
  { key: "crisis.bar", section: "Umum & Kontak", label: "Teks Crisis Bar (atas)", type: "text", bilingual: true,
    id: "Jika kamu dalam bahaya — 119 (Indonesia) | SAPA 1800-111-120 (Gratis, 24/7)",
    en: "If you are in danger — call 119 or SAPA 1800-111-120" },
  { key: "ci.email", section: "Umum & Kontak", label: "Email", type: "text", bilingual: false, id: "halo@proofspeak.id", en: "" },
  { key: "ci.wa", section: "Umum & Kontak", label: "WhatsApp", type: "text", bilingual: false, id: "+62 812-0000-0000", en: "" },
  { key: "ci.ig", section: "Umum & Kontak", label: "Instagram", type: "text", bilingual: false, id: "@proofspeak.id", en: "" },
  { key: "ci.domain", section: "Umum & Kontak", label: "Domain", type: "text", bilingual: false, id: "proofspeak.id", en: "" },
  { key: "ci.hotline", section: "Umum & Kontak", label: "Hotline / SAPA", type: "text", bilingual: false, id: "1800-111-120", en: "" },
  { key: "ci.emergency", section: "Umum & Kontak", label: "Nomor Darurat", type: "text", bilingual: false, id: "119", en: "" },

  // ---- Beranda / Home ----
  { key: "hero.label", section: "Beranda", label: "Hero — Label kecil", type: "text", bilingual: true,
    id: "Kampanye Kesadaran Kekerasan Seksual", en: "Sexual Assault Awareness Campaign" },
  { key: "hero.l1", section: "Beranda", label: "Hero — Judul baris 1", type: "text", bilingual: true, id: "Suara", en: "Voice" },
  { key: "hero.l2", section: "Beranda", label: "Hero — Judul baris 2 (italic)", type: "text", bilingual: true, id: "adalah", en: "is" },
  { key: "hero.l3", section: "Beranda", label: "Hero — Judul baris 3 (aksen)", type: "text", bilingual: true, id: "Bukti.", en: "Proof." },
  { key: "hero.desc", section: "Beranda", label: "Hero — Deskripsi", type: "textarea", bilingual: true,
    id: "Untuk semua penyintas yang lama diam. Proofspeak adalah ruang untuk bersuara, bersaksi, dan bergerak bersama.",
    en: "For every survivor who has long stayed silent. ProofSpeak is a space to speak, witness, and act together." },
  { key: "why.title", section: "Beranda", label: "Mengapa — Judul", type: "textarea", bilingual: true,
    id: "Diam bukan berarti setuju. Setiap suara adalah keberanian.",
    en: "Silence does not mean consent. Every voice is courage." },
  { key: "why.c1.title", section: "Beranda", label: "Mengapa — Kartu 1 judul", type: "text", bilingual: true, id: "1 dari 3 Perempuan", en: "1 in 3 Women" },
  { key: "why.c1.body", section: "Beranda", label: "Mengapa — Kartu 1 isi", type: "textarea", bilingual: true,
    id: "mengalami kekerasan seksual dalam hidupnya. Data KPAI & Komnas Perempuan 2023 menunjukkan peningkatan 40% kasus yang dilaporkan.",
    en: "experience sexual violence in their lifetime. KPAI & Komnas Perempuan 2023 data shows a 40% rise in reported cases." },
  { key: "why.c2.title", section: "Beranda", label: "Mengapa — Kartu 2 judul", type: "text", bilingual: true, id: "Banyak Tak Berani Melapor", en: "Many Are Afraid to Report" },
  { key: "why.c2.body", section: "Beranda", label: "Mengapa — Kartu 2 isi", type: "textarea", bilingual: true,
    id: "Stigma, ketidakpercayaan, dan sistem yang tidak aman membuat mayoritas penyintas memilih diam. Kita perlu mengubah itu.",
    en: "Stigma, disbelief, and unsafe systems push most survivors into silence. We need to change that." },
  { key: "why.c3.title", section: "Beranda", label: "Mengapa — Kartu 3 judul", type: "text", bilingual: true, id: "Kamu Bisa Bergerak", en: "You Can Act" },
  { key: "why.c3.body", section: "Beranda", label: "Mengapa — Kartu 3 isi", type: "textarea", bilingual: true,
    id: "Dengan berbagi cerita atau mengenakan kalung solidaritas — setiap tindakan kecil membangun perubahan besar.",
    en: "By sharing a story or wearing a solidarity necklace — every small act builds a bigger change." },
  { key: "feat.text", section: "Beranda", label: "Kalimat Sorotan", type: "textarea", bilingual: true,
    id: "Setiap penyintas berhak didengar, dipercaya, dan didampingi tanpa syarat.",
    en: "Every survivor deserves to be heard, believed, and supported unconditionally." },
  { key: "prod.title", section: "Beranda", label: "Bagian Kalung — Judul", type: "text", bilingual: true, id: "Kenakan. Nyatakan. Dukung.", en: "Wear. Declare. Support." },
  { key: "prod.sub", section: "Beranda", label: "Bagian Kalung — Sub", type: "textarea", bilingual: true,
    id: "10% dari setiap pembelian mendukung layanan pendampingan penyintas.",
    en: "10% of every purchase supports survivor accompaniment services." },

  // ---- Tentang / About ----
  { key: "about.label", section: "Tentang", label: "Label", type: "text", bilingual: true, id: "Tentang Kami", en: "About Us" },
  { key: "about.title", section: "Tentang", label: "Judul", type: "textarea", bilingual: true,
    id: "ProofSpeak berdiri untuk mereka yang lama diam.",
    en: "ProofSpeak stands for those who have long stayed silent." },
  { key: "about.mission", section: "Tentang", label: "Misi", type: "textarea", bilingual: true,
    id: "Kami percaya bahwa setiap kesaksian adalah kebenaran. Bahwa diam bukan pilihan — melainkan ketidakberdayaan yang harus kita ubah bersama.",
    en: "We believe every testimony is truth. Silence is not a choice — it is a powerlessness we must change together." },
  { key: "about.body", section: "Tentang", label: "Paragraf", type: "textarea", bilingual: true,
    id: "ProofSpeak adalah platform kampanye kesadaran kekerasan seksual yang memadukan narasi penyintas dan produk solidaritas sebagai satu gerakan yang kohesif dan bermartabat.",
    en: "ProofSpeak is a sexual assault awareness platform combining survivor narratives and solidarity products into one cohesive and dignified movement." },
  { key: "about.v1t", section: "Tentang", label: "Nilai 1 — judul", type: "text", bilingual: true, id: "Keselamatan / Safety", en: "Safety" },
  { key: "about.v1d", section: "Tentang", label: "Nilai 1 — isi", type: "textarea", bilingual: true,
    id: "Setiap cerita dimoderasi sebelum ditayangkan. Anonimitas selalu menjadi pilihan.",
    en: "Every story is moderated before publishing. Anonymity is always an option." },
  { key: "about.v2t", section: "Tentang", label: "Nilai 2 — judul", type: "text", bilingual: true, id: "Kepercayaan / Belief", en: "Belief" },
  { key: "about.v2d", section: "Tentang", label: "Nilai 2 — isi", type: "textarea", bilingual: true,
    id: 'Kami percaya penyintas tanpa syarat. "Aku percaya kamu" adalah fondasi dari semua yang kami lakukan.',
    en: 'We believe survivors unconditionally. "I believe you" is the foundation of everything we do.' },
  { key: "about.v3t", section: "Tentang", label: "Nilai 3 — judul", type: "text", bilingual: true, id: "Keberanian / Courage", en: "Courage" },
  { key: "about.v3d", section: "Tentang", label: "Nilai 3 — isi", type: "textarea", bilingual: true,
    id: "Bersuara butuh keberanian luar biasa. Kami di sini untuk menemanimu, bukan menghakimi.",
    en: "Speaking up takes extraordinary courage. We are here to accompany you, not judge." },
  { key: "about.v4t", section: "Tentang", label: "Nilai 4 — judul", type: "text", bilingual: true, id: "Aksi Nyata / Real Action", en: "Real Action" },
  { key: "about.v4d", section: "Tentang", label: "Nilai 4 — isi", type: "textarea", bilingual: true,
    id: "Kampanye ini terhubung langsung ke pendampingan dan produk yang mendanai gerakan.",
    en: "This campaign connects directly to support services and products that fund the movement." },

  // ---- Kampanye / Campaign ----
  { key: "camp.label", section: "Kampanye", label: "Label", type: "text", bilingual: true, id: "Apa yang Kami Perjuangkan", en: "What We Fight For" },
  { key: "camp.title", section: "Kampanye", label: "Judul", type: "text", bilingual: true, id: "Apa yang Kami Perjuangkan", en: "What We Fight For" },
  { key: "camp.sub", section: "Kampanye", label: "Sub", type: "textarea", bilingual: true,
    id: "Tiga pilar utama gerakan ProofSpeak untuk mengubah sistem dan budaya.",
    en: "Three core pillars of the ProofSpeak movement to transform systems and culture." },
  { key: "camp.c1.title", section: "Kampanye", label: "Pilar 1 — judul", type: "text", bilingual: true, id: "Reforma Hukum", en: "Legal Reform" },
  { key: "camp.c1.body", section: "Kampanye", label: "Pilar 1 — isi", type: "textarea", bilingual: true,
    id: "Mendorong revisi UU TPKS agar mencakup semua bentuk kekerasan seksual digital, verbal, dan berbasis gender.",
    en: "Pushing to revise the UU TPKS to cover all forms of digital, verbal, and gender-based sexual violence." },
  { key: "camp.c2.title", section: "Kampanye", label: "Pilar 2 — judul", type: "text", bilingual: true, id: "Pendidikan Seksual", en: "Sexual Education" },
  { key: "camp.c2.body", section: "Kampanye", label: "Pilar 2 — isi", type: "textarea", bilingual: true,
    id: "Mendorong kurikulum pendidikan seksual berbasis hak dan persetujuan di semua jenjang sekolah. Pencegahan dimulai dari pemahaman.",
    en: "Advocating for rights-based and consent-centered sex education at all school levels. Prevention starts with understanding." },
  { key: "camp.c3.title", section: "Kampanye", label: "Pilar 3 — judul", type: "text", bilingual: true, id: "Ruang Aman Penyintas", en: "Safe Spaces for Survivors" },
  { key: "camp.c3.body", section: "Kampanye", label: "Pilar 3 — isi", type: "textarea", bilingual: true,
    id: "Mendorong pemerintah menyediakan layanan krisis, shelter, dan pendampingan psikologis gratis yang mudah diakses di seluruh Indonesia.",
    en: "Urging government to provide free, accessible crisis services, shelters, and psychological support across Indonesia." },

  // ---- Cerita / Stories ----
  { key: "stories.label", section: "Cerita", label: "Label", type: "text", bilingual: true, id: "Cerita / Stories", en: "Stories" },
  { key: "stories.title", section: "Cerita", label: "Judul", type: "textarea", bilingual: true,
    id: "Kesaksian yang nyata, keberanian yang luar biasa.",
    en: "Real testimonies, extraordinary courage." },

  // ---- Kirim Cerita / Submit ----
  { key: "sub.title", section: "Kirim Cerita", label: "Judul", type: "text", bilingual: true, id: "Kamu Tidak Harus Menceritakan Semuanya.", en: "You Don't Have to Tell Everything." },
  { key: "sub.sub", section: "Kirim Cerita", label: "Sub", type: "textarea", bilingual: true,
    id: "Bagikan sebanyak yang kamu mau. Ruang ini aman, termoderasi, dan selalu menghormatimu.",
    en: "Share as much as you want. This space is safe, moderated, and always respects you." },
  { key: "trauma.text", section: "Kirim Cerita", label: "Catatan keamanan", type: "textarea", bilingual: true,
    id: "Catatan keamanan: Ceritamu akan ditinjau oleh tim kami sebelum dipublikasikan. Kamu bisa tetap anonim. Tidak ada informasi identitasmu yang akan dibagikan tanpa izin. Jika kamu sedang dalam krisis, hubungi SAPA 1800-111-120.",
    en: "Safety note: Your story will be reviewed by our team before publishing. You can stay anonymous. None of your identifying information will be shared without consent. If you are in crisis, contact SAPA 1800-111-120." },

  // ---- Kalung / Necklace ----
  { key: "neck.title", section: "Kalung", label: "Judul", type: "text", bilingual: true, id: "Kenakan Solidaritas.", en: "Wear Solidarity." },
  { key: "neck.sub", section: "Kalung", label: "Sub", type: "textarea", bilingual: true,
    id: "Setiap kalung dibuat tangan. 10% hasil penjualan mendanai layanan pendampingan penyintas.",
    en: "Every necklace is handcrafted. 10% of sales fund survivor support services." },

  // ---- Kontak / Contact ----
  { key: "cont.title", section: "Kontak", label: "Judul", type: "text", bilingual: true, id: "Mari Bergerak Bersama.", en: "Let's Move Together." },
  { key: "cont.body", section: "Kontak", label: "Paragraf", type: "textarea", bilingual: true,
    id: "Untuk kolaborasi, media, pendampingan, atau sekadar ingin bicara — kami di sini. Tidak ada pertanyaan yang terlalu kecil.",
    en: "For collaboration, media, support, or just to talk — we are here. No question is too small." },
];

export const DEFAULT_CONTENT: ContentMap = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, { id: f.id, en: f.bilingual ? f.en : f.id }]),
);

/** Read a value from a content map with id->en->key fallback. */
export function cval(map: ContentMap, key: string, lang: Lang = "id"): string {
  const entry = map[key] ?? DEFAULT_CONTENT[key];
  if (!entry) return "";
  if (lang === "en") return entry.en || entry.id || "";
  return entry.id || entry.en || "";
}

export const DEFAULT_PRODUCTS = [
  { name: "Hope Circle", price: "Rp 185.000", descId: "Lingkaran harapan — simbol keutuhan jiwa yang diperjuangkan.", descEn: "Circle of hope — symbol of a soul fighting for wholeness.", symbol: "○", colors: ["Silver", "Rose Gold", "Gold"], status: "active", sortOrder: 1 },
  { name: "Brave Heart", price: "Rp 220.000", descId: 'Hati pemberani — "I Believe You" terukir di baliknya.', descEn: 'Brave heart — "I Believe You" engraved on the back.', symbol: "◇", colors: ["Silver", "Rose Gold", "Gold"], status: "active", sortOrder: 2 },
  { name: "Survivor Lotus", price: "Rp 250.000", descId: "Teratai penyintas — tumbuh dari lumpur menjadi cahaya.", descEn: "Survivor lotus — growing from mud into light.", symbol: "✦", colors: ["Silver", "Rose Gold", "Gold"], status: "active", sortOrder: 3 },
  { name: "Together Band", price: "Rp 310.000", descId: "Sepasang gelang — satu untukmu, satu untuk seseorang yang kamu sayangi.", descEn: "A pair of bracelets — one for you, one for someone you love.", symbol: "◯◯", colors: ["Silver", "Gold"], status: "active", sortOrder: 4 },
];
