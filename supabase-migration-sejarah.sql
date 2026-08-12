-- ============================================================
-- MIGRASI: Timeline Sejarah dengan Foto (bagian "Perjalanan Kami")
-- Jalankan SQL ini di: Supabase Dashboard > SQL Editor
-- ============================================================
-- Tabel baru untuk mengelola perjalanan yayasan (tahun, judul,
-- deskripsi, foto). Foto disimpan di bucket "album-images"
-- (folder sejarah/). Setelah ini, buka /admin > tab "Sejarah"
-- untuk menambah foto per milestone.

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

-- Hanya admin (service role) yang bisa tulis/edit/hapus
CREATE POLICY "Admin kelola sejarah" ON sejarah
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
