# ProofSpeak

Kampanye kesadaran kekerasan seksual — situs publik (ID/EN) + panel admin di `/seller`.
Rebuild dari satu file `index.html` lama menjadi aplikasi **Next.js + TypeScript** yang rapi,
mobile-first, dengan penyimpanan **permanen** (bukan lagi localStorage yang hilang saat refresh).

## Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Database | **Neon** (Postgres) + Drizzle ORM |
| Penyimpanan gambar | **Vercel Blob** |
| Email notifikasi | **Resend** |
| Deploy | Vercel |

## Yang sudah diperbaiki (semua keluhan owner)

- **Teks & gambar kesimpen permanen** dan tampil ke *semua* pengunjung (dulu cuma di
  localStorage browser sendiri → hilang saat refresh / tak terlihat orang lain).
- **Upload gambar** masuk ke Vercel Blob — tidak ada lagi batas kuota 5MB localStorage.
- **Mobile-first** penuh: nav punya menu hamburger, semua halaman + panel admin nyaman di HP.
- **Cerita & pesanan terkumpul** di database, bisa dimoderasi/dilacak di `/seller`.
- **Admin disembunyikan**: hanya bisa diakses dengan mengetik `/seller` (tidak ada link publik,
  `noindex` untuk mesin pencari).
- **Email otomatis** tiap ada cerita / pesanan / pesan kontak baru (via Resend).
- Submit cerita & pesan kalung **tanpa perlu login** (ramah penyintas); rate-limit per-IP anti spam.

## Setup lokal

```bash
npm install
cp .env.example .env.local   # isi nilainya (lihat di bawah)
npm run db:push              # buat tabel di Neon
npm run db:seed              # isi produk default + admin
npm run dev                  # http://localhost:3000
```

Admin: buka `http://localhost:3000/seller`, login pakai `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
**Ganti password** setelah login pertama (menu Pengaturan).

## Environment variables

Lihat `.env.example`. Yang wajib untuk produksi:

| Variabel | Dari mana | Wajib |
|---|---|---|
| `DATABASE_URL` | Neon → Connection string (pooled) | ✅ |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob store | ✅ (untuk upload gambar) |
| `SESSION_SECRET` | acak 32+ karakter (`openssl rand -base64 32`) | ✅ |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | login admin awal | ✅ |
| `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO` | Resend (notifikasi email) | opsional* |
| `NEXT_PUBLIC_SITE_URL` | URL situs (untuk link di email) | disarankan |

\*Tanpa Resend, data tetap tersimpan & terlihat di `/seller` — hanya emailnya yang tidak terkirim.

## Deploy ke Vercel

1. Push repo ke GitHub, import ke Vercel.
2. Buat **Neon** Postgres → salin `DATABASE_URL`.
3. Di Vercel → **Storage → Create Blob store** (otomatis menambah `BLOB_READ_WRITE_TOKEN`).
4. Buat akun **Resend** → API key + verifikasi domain pengirim.
5. Set semua env var di Vercel (Production + Preview).
6. Jalankan migrasi sekali: `npm run db:push` (dari lokal dengan `DATABASE_URL` produksi) lalu
   `npm run db:seed`. *(Migrasi bersifat additive — aman.)*
7. Deploy.

## Struktur

```
src/
  app/
    (site)/            # situs publik (shell: nav, crisis bar, onboarding, footer)
      page.tsx         # beranda
      about, stories, stories/submit, necklace, contact
    seller/            # panel admin (di luar shell publik, noindex)
    api/               # route handlers (publik: stories/orders/contact; admin: /api/seller/*)
  components/
    site/              # komponen halaman publik
    admin/             # panel admin + uploader
    LanguageProvider   # konteks bahasa ID/EN
  lib/
    db/                # schema Drizzle, koneksi Neon, seed
    auth, guard        # sesi admin (JWT httpOnly) + penjaga route
    rate-limit, email, blob, content, validation, i18n, content-defaults
public/
  fonts/               # Exposure (taruh file berlisensi di sini)
  images/              # gambar default (logo, hero, onboarding)
```

## Font

Brand memakai **Exposure** (display) + **Helvetica Neue** (body). File Exposure ada di
`public/fonts/Exposure-Var.woff2`. **Catatan:** file saat ini versi *Trial* — untuk situs live,
ganti dengan file berlisensi (nama file sama) di `public/fonts/`. Tidak perlu ubah kode.

## Perintah

```bash
npm run dev          # development
npm run build        # build produksi
npm run db:push      # sinkronkan schema ke Neon
npm run db:seed      # isi data awal (produk + admin)
npm run db:generate  # buat file migrasi SQL (opsional, alternatif db:push)
```

> File lama tersimpan di `_legacy/index.original.html` sebagai referensi.
