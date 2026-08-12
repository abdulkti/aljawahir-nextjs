-- ============================================================
-- MIGRASI: Album Sejarah untuk bagian "Perjalanan Kami"
-- Jalankan SQL ini di: Supabase Dashboard > SQL Editor
-- ============================================================
-- Perluas kolom unit tabel album_foto agar mendukung album
-- sejarah yayasan (unit = 'sejarah').

ALTER TABLE album_foto DROP CONSTRAINT album_foto_unit_check;

ALTER TABLE album_foto
  ADD CONSTRAINT album_foto_unit_check
  CHECK (unit IN ('ra', 'sd', 'smp', 'tpa', 'sejarah'));
