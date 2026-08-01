-- Jalankan SQL ini di Supabase Dashboard > SQL Editor

-- 1. Aktifkan RLS di tabel berita
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Semua orang bisa baca berita yang sudah dipublikasi
CREATE POLICY "Publik bisa baca berita published" ON berita
  FOR SELECT
  USING (published = true);

-- 3. Policy: Hanya admin (service role) yang bisa baca semua berita (termasuk draft)
CREATE POLICY "Admin bisa baca semua berita" ON berita
  FOR SELECT
  USING (auth.role() = 'service_role');

-- 4. Policy: Hanya admin yang bisa insert berita
CREATE POLICY "Admin bisa insert berita" ON berita
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 5. Policy: Hanya admin yang bisa update berita
CREATE POLICY "Admin bisa update berita" ON berita
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. Policy: Hanya admin yang bisa hapus berita
CREATE POLICY "Admin bisa hapus berita" ON berita
  FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================
-- ALBUM FOTO UNIT PENDIDIKAN (RA / SD IT / SMP IT / TPA)
-- ============================================================

-- Tabel album_foto
CREATE TABLE IF NOT EXISTS album_foto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit TEXT NOT NULL CHECK (unit IN ('ra', 'sd', 'smp', 'tpa')),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE album_foto ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa lihat foto (untuk galeri di website)
CREATE POLICY "Publik bisa baca album foto" ON album_foto
  FOR SELECT
  USING (true);

-- Hanya admin (service role) yang bisa tulis/edit/hapus
CREATE POLICY "Admin bisa insert album foto" ON album_foto
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin bisa update album foto" ON album_foto
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin bisa hapus album foto" ON album_foto
  FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================
-- STORAGE: Buat bucket "album-images" (set PUBLIC)
-- ============================================================
-- Di Dashboard Supabase > Storage > New bucket:
--   Nama: album-images
--   Public: AKTIF
--   File size limit: 10MB
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
