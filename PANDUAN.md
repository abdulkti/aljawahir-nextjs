# 🕌 Yayasan Al Jawahir At Tarbawi — Next.js Website

## Stack Teknologi
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

---

## 📁 Struktur Folder

```
aljawahir-nextjs/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Global styles
│   ├── berita/
│   │   ├── page.tsx          ← Halaman daftar berita
│   │   └── [slug]/page.tsx   ← Halaman detail berita
│   └── admin/
│       ├── page.tsx          ← Dashboard admin + login
│       ├── tulis/page.tsx    ← Form tulis berita baru
│       └── edit/[id]/page.tsx← Form edit berita
├── components/
│   ├── Navbar.tsx            ← Navigasi atas
│   ├── Footer.tsx            ← Footer
│   ├── BeritaCard.tsx        ← Kartu berita
│   └── WAFloat.tsx           ← Tombol WhatsApp
├── lib/
│   ├── supabase.ts           ← Koneksi database
│   └── utils.ts              ← Helper functions
├── types/
│   └── index.ts              ← TypeScript types
├── .env.local.example        ← Template env (copy & isi)
└── PANDUAN.md                ← Panduan ini
```

---

## 🚀 Cara Setup (Langkah demi Langkah)

### LANGKAH 1 — Install Node.js
Download dari https://nodejs.org (pilih versi LTS)

### LANGKAH 2 — Setup Supabase
1. Buka https://supabase.com → daftar gratis
2. Buat project baru → region: Southeast Asia (Singapore)
3. Masuk ke SQL Editor → jalankan SQL ini:

```sql
CREATE TABLE berita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ringkasan TEXT,
  isi TEXT,
  kategori TEXT DEFAULT 'Berita',
  penulis TEXT,
  cover_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publik baca berita"
ON berita FOR SELECT USING (published = true);

CREATE POLICY "Admin tulis berita"
ON berita FOR ALL USING (true) WITH CHECK (true);
```

4. Buat Storage bucket: nama `berita-images`, set ke **Public**
5. Jalankan juga SQL untuk album foto (tabel `album_foto`) — lihat file `supabase-rls.sql` bagian "ALBUM FOTO"
6. Buat Storage bucket: nama `album-images`, set ke **Public** (untuk galeri foto unit pendidikan)

### LANGKAH 3 — Isi File .env.local
Copy file `.env.local.example` → rename jadi `.env.local`
Lalu isi dengan kredensial Supabase Anda:
- **NEXT_PUBLIC_SUPABASE_URL** → Project Settings > API > Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** → Project Settings > API > anon public
- **SUPABASE_SERVICE_ROLE_KEY** → Project Settings > API > service_role
- **NEXT_PUBLIC_ADMIN_PASSWORD** → password bebas untuk login admin

### LANGKAH 4 — Jalankan di Komputer Lokal
```bash
npm install
npm run dev
```
Buka http://localhost:3000

### LANGKAH 5 — Deploy ke Vercel
1. Upload project ke GitHub
2. Buka https://vercel.com → Import dari GitHub
3. Di bagian "Environment Variables", tambahkan semua isi .env.local
4. Klik Deploy → selesai! Website langsung online

---

## 🔗 URL Penting Setelah Deploy
| Halaman | URL |
|---|---|
| Website utama | https://website-anda.vercel.app/ |
| Daftar berita | https://website-anda.vercel.app/berita |
| Panel admin | https://website-anda.vercel.app/admin |

---

## ✍️ Cara Tambah Berita
1. Buka `/admin` → masukkan password
2. Klik "Tulis Berita Baru"
3. Isi judul, kategori, upload foto, isi konten
4. Klik **Publikasikan** → berita langsung tampil!

## 📸 Cara Kelola Album Foto Unit
1. Buka `/admin` → masukkan password
2. Klik menu **Album Foto** di sidebar
3. Pilih unit (RA / SD IT / SMP IT / TPA)
4. Isi keterangan (opsional), lalu klik **Upload Foto**
5. Foto muncul otomatis di galeri website saat orang klik "Lihat Foto" / "Album Foto" pada kartu unit di halaman beranda

> **Catatan**: Tombol upload memakai API `/api/album` (membutuhkan token admin & `SUPABASE_SERVICE_ROLE_KEY`).

