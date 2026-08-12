-- ============================================================
-- SETUP LENGKAP YAYASAN AL JAWAHIR AT TARBAWI
-- Jalankan SELURUH script ini di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============ 1. TABEL BERITA ============
CREATE TABLE IF NOT EXISTS berita (
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

-- Publik bisa baca berita yang sudah dipublikasi
CREATE POLICY "Publik bisa baca berita" ON berita
  FOR SELECT USING (published = true);

-- Admin (service role) kelola berita
CREATE POLICY "Admin kelola berita" ON berita
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============ 2. TABEL ALBUM FOTO ============
CREATE TABLE IF NOT EXISTS album_foto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit TEXT NOT NULL CHECK (unit IN ('ra', 'sd', 'smp', 'tpa')),
  url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE album_foto ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa lihat foto (galeri di website)
CREATE POLICY "Publik bisa baca album foto" ON album_foto
  FOR SELECT USING (true);

-- Admin (service role) kelola foto
CREATE POLICY "Admin kelola album foto" ON album_foto
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============ 3. STORAGE BUCKET ============
-- (Setelah jalankan SQL di atas, buat 2 bucket di menu Storage > New bucket)
--
-- Bucket 1: berita-images   → Public: AKTIF
-- Bucket 2: album-images    → Public: AKTIF
--   (File size limit: 10MB, Allowed MIME: image/jpeg, image/png, image/webp, image/gif)

-- ============ 4. TABEL SEJARAH (Perjalanan Kami) ============
CREATE TABLE IF NOT EXISTS sejarah (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tahun TEXT NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  foto_url TEXT,
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sejarah ENABLE ROW LEVEL SECURITY;

-- Publik bisa baca timeline sejarah
CREATE POLICY "Publik bisa baca sejarah" ON sejarah
  FOR SELECT USING (true);

-- Admin (service role) kelola timeline sejarah
CREATE POLICY "Admin kelola sejarah" ON sejarah
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
