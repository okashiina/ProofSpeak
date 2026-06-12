import type { Lang } from "./types";

/**
 * Static UI strings (structural — navigation, buttons, form labels, system
 * messages). These are NOT owner-editable; editable marketing copy lives in the
 * content map (see content-defaults.ts).
 */
export const UI = {
  id: {
    "nav.home": "Beranda",
    "nav.about": "Tentang",
    "nav.stories": "Cerita",
    "nav.necklace": "Kalung",
    "nav.contact": "Kontak",
    "nav.menu": "Menu",
    "nav.close": "Tutup",

    "ob.learn": "Pelajari di sini",
    "ob.crisis": "Dalam bahaya? Hubungi 119 atau SAPA 1800-111-120",

    "cta.share": "Bagikan Ceritamu",
    "cta.readStories": "Baca Cerita",
    "cta.fullCollection": "Koleksi Lengkap →",
    "cta.seeAll": "Lihat Semua",
    "cta.seeNecklace": "Lihat Kalung Solidaritas",
    "cta.send": "Kirim",
    "cta.sending": "Mengirim…",

    "stat.stories": "Cerita Dipublikasikan",
    "stat.orders": "Kalung Dipesan",

    "stories.empty": "Belum ada cerita yang dipublikasikan.",
    "stories.readMore": "Baca selengkapnya",
    "stories.tag": "Kisah Penyintas",
    "stories.shareCta": "Ceritamu penting. Bagikan di sini →",

    "form.story.name": "Namamu (opsional — kosongkan untuk anonim)",
    "form.story.namePh": "Atau biarkan kosong untuk anonim",
    "form.story.title": "Judul Cerita",
    "form.story.titlePh": "Beri judul yang mewakili ceritamu",
    "form.story.body": "Ceritamu",
    "form.story.bodyPh": "Kamu bisa mulai dari mana saja…",
    "form.story.tw": "Peringatan Konten (jika ada)",
    "form.story.twPh": "contoh: kekerasan, trauma (opsional)",
    "form.story.lang": "Bahasa Cerita",
    "form.story.consent":
      "Saya menyetujui cerita ini ditayangkan di ProofSpeak setelah melalui proses moderasi, dengan pemahaman penuh bahwa identitas saya dilindungi.",
    "form.story.submit": "Kirim Cerita",
    "form.story.okTitle": "Terima kasih telah berbagi.",
    "form.story.okBody": "Ceritamu sedang ditinjau dan akan dipublikasikan setelah disetujui.",

    "form.order.title": "Formulir Pemesanan",
    "form.order.item": "Item yang Dipilih",
    "form.order.itemPh": "Klik kalung di atas untuk memilih",
    "form.order.name": "Nama Lengkap",
    "form.order.phone": "WhatsApp",
    "form.order.email": "Email",
    "form.order.address": "Alamat Pengiriman",
    "form.order.addressPh": "Alamat lengkap termasuk kota dan kode pos",
    "form.order.qty": "Jumlah",
    "form.order.color": "Warna",
    "form.order.payment": "Metode Pembayaran",
    "form.order.message": "Pesan untuk Packaging (opsional)",
    "form.order.messagePh": "contoh: Untuk kakakku, dengan cinta",
    "form.order.submit": "Pesan Sekarang",
    "form.order.note": "10% dari setiap pembelian mendukung layanan pendampingan penyintas.",
    "form.order.okTitle": "Pesananmu diterima.",
    "form.order.okBody": "Kami akan mengonfirmasi via WhatsApp atau email dalam 1–2 hari kerja.",
    "form.order.selectFirst": "Pilih kalung dulu di atas.",

    "form.contact.name": "Nama",
    "form.contact.namePh": "Namamu",
    "form.contact.email": "Email",
    "form.contact.subject": "Subjek",
    "form.contact.message": "Pesan",
    "form.contact.messagePh": "Ceritakan apa yang ingin kamu sampaikan…",
    "form.contact.submit": "Kirim Pesan",
    "form.contact.okTitle": "Pesan terkirim.",
    "form.contact.okBody": "Kami akan menghubungimu dalam 1–3 hari kerja.",

    "contact.detail.email": "Email",
    "contact.detail.wa": "WhatsApp",
    "contact.detail.ig": "Instagram",
    "contact.detail.crisis": "Krisis / Crisis",

    "err.required": "Mohon lengkapi kolom wajib.",
    "err.consent": "Mohon berikan persetujuan.",
    "err.email": "Masukkan email yang valid.",
    "err.generic": "Terjadi kesalahan. Coba lagi sebentar.",
    "err.rate": "Terlalu banyak percobaan. Coba lagi nanti.",

    "footer.nav": "Navigasi",
    "footer.platform": "Platform",
    "footer.help": "Bantuan",
    "footer.rights": "Hak cipta dilindungi.",
    "footer.madeWith": "Dibuat dengan keberanian, untuk para penyintas.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.stories": "Stories",
    "nav.necklace": "Necklace",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",

    "ob.learn": "Learn here",
    "ob.crisis": "In danger? Call 119 or SAPA 1800-111-120",

    "cta.share": "Share Your Story",
    "cta.readStories": "Read Stories",
    "cta.fullCollection": "Full Collection →",
    "cta.seeAll": "See All",
    "cta.seeNecklace": "See Solidarity Necklaces",
    "cta.send": "Send",
    "cta.sending": "Sending…",

    "stat.stories": "Stories Published",
    "stat.orders": "Necklaces Ordered",

    "stories.empty": "No stories published yet.",
    "stories.readMore": "Read more",
    "stories.tag": "Survivor Story",
    "stories.shareCta": "Your story matters. Share it here →",

    "form.story.name": "Your name (optional — leave blank for anonymous)",
    "form.story.namePh": "Or leave blank to stay anonymous",
    "form.story.title": "Story Title",
    "form.story.titlePh": "Give a title that represents your story",
    "form.story.body": "Your Story",
    "form.story.bodyPh": "You can start anywhere…",
    "form.story.tw": "Content Warning (if any)",
    "form.story.twPh": "e.g. violence, trauma (optional)",
    "form.story.lang": "Story Language",
    "form.story.consent":
      "I agree for this story to be published on ProofSpeak after moderation, fully understanding that my identity is protected.",
    "form.story.submit": "Submit Story",
    "form.story.okTitle": "Thank you for sharing.",
    "form.story.okBody": "Your story is being reviewed and will be published once approved.",

    "form.order.title": "Order Form",
    "form.order.item": "Selected Item",
    "form.order.itemPh": "Click a necklace above to select",
    "form.order.name": "Full Name",
    "form.order.phone": "WhatsApp",
    "form.order.email": "Email",
    "form.order.address": "Shipping Address",
    "form.order.addressPh": "Full address including city and postal code",
    "form.order.qty": "Quantity",
    "form.order.color": "Color",
    "form.order.payment": "Payment Method",
    "form.order.message": "Packaging Note (optional)",
    "form.order.messagePh": "e.g. For my sister, with love",
    "form.order.submit": "Order Now",
    "form.order.note": "10% of every purchase supports survivor accompaniment services.",
    "form.order.okTitle": "Your order is received.",
    "form.order.okBody": "We will confirm via WhatsApp or email within 1–2 business days.",
    "form.order.selectFirst": "Please select a necklace above first.",

    "form.contact.name": "Name",
    "form.contact.namePh": "Your name",
    "form.contact.email": "Email",
    "form.contact.subject": "Subject",
    "form.contact.message": "Message",
    "form.contact.messagePh": "Tell us what's on your mind…",
    "form.contact.submit": "Send Message",
    "form.contact.okTitle": "Message sent.",
    "form.contact.okBody": "We will get back to you within 1–3 business days.",

    "contact.detail.email": "Email",
    "contact.detail.wa": "WhatsApp",
    "contact.detail.ig": "Instagram",
    "contact.detail.crisis": "Crisis",

    "err.required": "Please complete the required fields.",
    "err.consent": "Please give your consent.",
    "err.email": "Please enter a valid email.",
    "err.generic": "Something went wrong. Please try again shortly.",
    "err.rate": "Too many attempts. Please try again later.",

    "footer.nav": "Navigation",
    "footer.platform": "Platform",
    "footer.help": "Help",
    "footer.rights": "All rights reserved.",
    "footer.madeWith": "Made with courage, for survivors.",
  },
} as const;

export type UIKey = keyof (typeof UI)["id"];

export function uiText(lang: Lang, key: UIKey): string {
  return UI[lang][key] ?? UI.id[key] ?? key;
}
