-- Jalankan ini di Supabase Dashboard → SQL Editor
-- Link: https://supabase.com/dashboard/project/mjbzpzfszoztoqtefxex/sql
-- Ini memperbolehkan publik membaca foto album (agar homepage bisa menampilkan cover & jumlah foto)

CREATE POLICY "album_public_read" ON album_foto FOR SELECT USING (true);

-- Verifikasi:
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'album_foto';
