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
