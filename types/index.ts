export type Berita = {
  id: string
  judul: string
  slug: string
  ringkasan: string | null
  isi: string | null
  kategori: string
  penulis: string | null
  cover_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type BeritaInsert = Omit<Berita, 'id' | 'created_at' | 'updated_at'>
