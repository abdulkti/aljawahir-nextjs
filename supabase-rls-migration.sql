-- =============================================
-- Row Level Security (RLS) Migration
-- =============================================

-- 1. Aktifkan RLS di semua tabel
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE sejarah ENABLE ROW LEVEL SECURITY;

-- 2. BERITA: anon hanya bisa baca yang published
CREATE POLICY "berita_public_read"
  ON berita FOR SELECT
  TO anon
  USING (published = true);

-- 3. ALBUM_FOTO & SEJARAH: tidak ada SELECT policy untuk anon
-- INSERT/UPDATE/DELETE hanya dilakukan oleh service_role
-- (service_role bypasses RLS secara otomatis)

-- Catatan: service_role key SELALU bypass RLS, jadi semua operasi
-- admin yang pakai service_role tetap berjalan normal.
-- RLS hanya melindungi akses via anon key (browser/client-side).
