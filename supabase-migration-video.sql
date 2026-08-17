-- ============================================================
-- MIGRASI: Tambah kolom video_url ke tabel berita
-- Jalankan SQL ini di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE berita ADD COLUMN IF NOT EXISTS video_url TEXT;
