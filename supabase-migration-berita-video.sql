-- ============================================================
-- MIGRASI: Kolom video di berita
-- Jalankan SQL ini di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE berita ADD COLUMN IF NOT EXISTS video_url TEXT;
