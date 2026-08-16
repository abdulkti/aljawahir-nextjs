export type Berita = {
  id: string
  judul: string
  slug: string
  ringkasan: string | null
  isi: string | null
  kategori: string
  penulis: string | null
  cover_url: string | null
  video_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type BeritaInsert = Omit<Berita, 'id' | 'created_at' | 'updated_at'>

export type AlbumFoto = {
  id: string
  unit: string
  url: string
  caption: string | null
  is_cover: boolean
  created_at: string
}

export const UNIT_KEYS = ['ra', 'sd', 'smp', 'tpa'] as const
export type UnitKey = (typeof UNIT_KEYS)[number]

export const UNIT_LABELS: Record<UnitKey, string> = {
  ra: 'RA Al Jawahir',
  sd: 'SD IT Al Jawahir',
  smp: 'SMP IT Al Jawahir',
  tpa: 'Taman Pendidikan Al-Quran',
}

export type Sejarah = {
  id: string
  tahun: string
  judul: string
  deskripsi: string
  foto_url: string | null
  urutan: number
  created_at: string
  updated_at: string
}
