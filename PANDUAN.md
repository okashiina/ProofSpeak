# Panduan ProofSpeak — Pengguna & Admin

Panduan ini untuk **memakai dan mengetes situs**, bukan soal kode/deploy.
Ada dua peran: **Pengunjung** (siapa saja yang buka situs) dan **Admin** (kamu, pemilik).

> Catatan: di mana pun tertulis `alamat-situs-kamu`, ganti dengan alamat web situsmu,
> misalnya `proofspeak.vercel.app`.

---

## Bagian 1 — Sebagai Pengunjung

Ini yang dilihat dan bisa dilakukan orang yang membuka situs.

### Buka situs
- Saat pertama buka, muncul **layar pembuka** (foto + logo). Klik **“Pelajari di sini”**
  untuk masuk. Layar ini cuma muncul sekali per kunjungan.
- Pojok kanan atas ada tombol **ID / EN** untuk ganti bahasa Indonesia ↔ Inggris.
  Semua teks langsung berubah.
- Baris paling atas (warna teal) adalah **info darurat** (nomor 119 & SAPA). Selalu tampil.

### Menu / navigasi
- Di **laptop**: menu ada di atas (Beranda, Tentang, Cerita, Kalung, Kontak).
- Di **HP**: ketuk ikon **tiga garis (☰)** di kanan atas → menu layar penuh terbuka.
  Ketuk salah satu untuk pindah halaman. Tombol bahasa juga ada di bawah menu ini.

### Halaman yang bisa dibuka pengunjung
- **Beranda** — sambutan, alasan kampanye, dan cuplikan kalung.
- **Tentang** — profil & yang diperjuangkan.
- **Cerita** — kumpulan cerita penyintas. Ketuk satu kartu untuk baca lengkap.
- **Kalung** — produk kalung solidaritas.
- **Kontak** — info kontak + form pesan.

### Kirim cerita (penyintas)
1. Buka **Cerita → “+ Bagikan Ceritamu”** (atau tombol Bagikan di Beranda).
2. **Nama boleh dikosongkan** → cerita jadi “Anonim”.
3. Isi **Judul** dan **Cerita** (wajib). Boleh tambah peringatan konten & pilih bahasa.
4. Centang persetujuan, klik **Kirim Cerita**.
5. Muncul ucapan terima kasih. **Cerita belum langsung tampil** — masuk dulu ke kamu
   (admin) untuk ditinjau. Setelah kamu setujui, baru muncul di halaman Cerita.

### Pesan kalung
1. Buka **Kalung**, **ketuk salah satu kalung** (yang dipilih bertanda garis kuning).
2. Form pemesanan otomatis terisi item terpilih.
3. Isi nama, WhatsApp, alamat (wajib), jumlah, warna, metode bayar.
4. Klik **Pesan Sekarang** → muncul konfirmasi. Pesanan langsung masuk ke kamu (admin).
   *Tidak perlu daftar/login untuk memesan.*

### Kirim pesan kontak
- Buka **Kontak**, isi email + pesan, klik **Kirim Pesan**.

---

## Bagian 2 — Sebagai Admin (Pemilik)

Di sinilah kamu mengatur isi situs, dan menerima cerita/pesanan/pesan.

### Cara masuk ke panel admin
1. Halaman admin **sengaja disembunyikan** — tidak ada tombol/link ke sana di situs publik,
   dan tidak muncul di Google.
2. Untuk membukanya, ketik **`/seller`** di belakang alamat situs:
   `alamat-situs-kamu/seller` (contoh: `proofspeak.vercel.app/seller`).
3. Masukkan **email & password admin** (yang diset saat menyiapkan situs), lalu **Masuk**.

> **Penting:** begitu pertama kali masuk, buka **Pengaturan → Ubah Password** dan ganti
> ke password baru milikmu sendiri.

### Isi panel admin (menu kiri)

**Dashboard** — ringkasan: berapa cerita menunggu, cerita tayang, total pesanan, pesan baru.
Cerita yang menunggu bisa langsung **Setujui / Tolak** di sini.

**Editor Teks** — ubah **semua teks situs** dalam 2 bahasa (Indonesia & Inggris).
Edit kolom yang mau diubah, lalu klik **Simpan Semua**. Perubahan **langsung tampil**
ke semua pengunjung.

**Gambar** — ganti **Logo**, **Background Beranda**, dan **Background Layar Pembuka**.
Klik kotak → pilih foto dari perangkat (maks 5MB). Foto **langsung tersimpan permanen**
(tidak hilang saat refresh) dan langsung tampil ke semua orang.

**Produk Kalung** — kelola kalung:
- **+ Tambah Produk**: isi nama, harga, deskripsi (2 bahasa), warna, foto, status.
- **Edit / Nonaktifkan / Hapus** tiap produk. Produk “Tidak Aktif” tidak tampil ke pengunjung.

**Moderasi Cerita** — semua cerita yang masuk. Ubah status jadi **Disetujui** agar tampil
di halaman Cerita publik, atau **Tolak/Hapus**. Klik **Lihat** untuk baca lengkap.

**Pesanan** — semua pesanan kalung. Klik **Lihat** untuk detail (alamat, WA, dll). Ubah
**status** (Menunggu → Diproses → Dikirim → Diterima) untuk melacak.

**Pesan Kontak** — pesan dari form Kontak. Klik **Lihat** untuk baca; tandai sudah dibaca/dibalas.

**Pengaturan** — ganti password admin.

**Keluar** — tombol di kanan atas untuk keluar dari panel.

### Notifikasi email
Tiap ada **cerita / pesanan / pesan kontak baru**, kamu otomatis dapat **email**
(kalau email sudah diaktifkan saat setup). Tapi semuanya tetap tersimpan & terlihat di
panel admin walau email belum aktif.

---

## Bagian 3 — Cara Mengetes (cek semuanya jalan)

Lakukan ini sekali setelah situs online, untuk memastikan semua beres. Idealnya pakai
**HP + laptop** bersamaan biar kelihatan datanya “nyambung” antar perangkat.

**1. Tes kirim cerita**
- [ ] Dari HP: kirim cerita uji (judul “tes”, isi bebas, nama dikosongkan).
- [ ] Buka `/seller` di laptop → **Moderasi Cerita** → cerita “tes” muncul (status Menunggu).
- [ ] Ubah ke **Disetujui** → buka halaman **Cerita** publik → cerita “tes” sekarang tampil.
- [ ] Hapus cerita “tes” setelah yakin.

**2. Tes edit teks (ini yang dulu tidak nyimpen)**
- [ ] Di admin **Editor Teks**, ubah satu teks (mis. deskripsi Beranda) → **Simpan**.
- [ ] **Refresh** halaman → teks tetap berubah. ✅
- [ ] Buka situs dari **HP lain / mode incognito** → perubahan ikut terlihat. ✅
  *(Dulu cuma kesimpen di browser sendiri — sekarang tersimpan untuk semua.)*

**3. Tes ganti gambar (ini juga yang dulu hilang)**
- [ ] Admin **Gambar** → ganti Background Beranda dengan foto lain.
- [ ] Buka Beranda → gambar berubah. **Refresh** → tetap ada. ✅

**4. Tes pesan kalung**
- [ ] Dari situs publik: pesan satu kalung dengan data uji.
- [ ] Admin **Pesanan** → pesanan muncul → klik **Lihat** → detail lengkap benar.
- [ ] Cek email kamu → notifikasi masuk (kalau email aktif).
- [ ] Hapus pesanan uji.

**5. Tes kontak**
- [ ] Kirim dari halaman **Kontak** → cek muncul di admin **Pesan Kontak** (+ email).

**6. Tes tampilan HP**
- [ ] Buka situs di HP → menu **☰** jalan, teks rapi, tidak tumpang-tindih dengan baris darurat.
- [ ] Buka `/seller` di HP → panel admin bisa dipakai dari HP.

**7. Tes keamanan admin**
- [ ] Jelajahi situs publik → pastikan **tidak ada link** ke halaman admin.
- [ ] Admin hanya terbuka kalau kamu ketik sendiri `/seller`.

Kalau ketujuh poin di atas ✅, situs siap dipakai.

---

## Tips
- **Anonimitas penyintas**: kalau pengirim mengosongkan nama, cerita tampil sebagai “Anonim”.
  Selalu tinjau dulu sebelum menyetujui.
- **Bahasa**: isi teks dalam dua bahasa (ID & EN) di Editor Teks supaya pengunjung Inggris
  tidak melihat teks Indonesia.
- **Lupa password admin?** Hubungi yang menyiapkan situs (deployment) untuk mereset.
- **Foto**: pakai gambar < 5MB. Logo paling bagus PNG latar transparan.
