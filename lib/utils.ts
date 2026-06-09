// Format tanggal ke Bahasa Indonesia
export function formatTanggal(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}

// Buat slug dari judul
export function makeSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
}

// Potong teks panjang
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.substring(0, max).trim() + '...'
}

// Warna badge kategori
export function kategoriColor(kategori: string): string {
  const map: Record<string, string> = {
    Berita: 'bg-green-50 text-green-700',
    Pendidikan: 'bg-blue-50 text-blue-700',
    Prestasi: 'bg-yellow-50 text-yellow-700',
    Kegiatan: 'bg-purple-50 text-purple-700',
    Pengumuman: 'bg-red-50 text-red-700',
    Artikel: 'bg-gray-50 text-gray-700',
  }
  return map[kategori] ?? 'bg-green-50 text-green-700'
}
