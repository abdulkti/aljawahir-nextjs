import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BeritaCard from '@/components/BeritaCard'
import { supabaseServer } from '@/lib/supabase'
import { Berita } from '@/types'

export const metadata: Metadata = {
  title: 'Berita & Artikel',
  description:
    'Berita dan artikel terbaru dari Yayasan Al Jawahir At Tarbawi: kegiatan, prestasi, pengumuman, dan perkembangan pendidikan Islam di Deli Serdang.',
  alternates: { canonical: '/berita' },
}

async function getAllBerita(): Promise<Berita[]> {
  const sb = supabaseServer()
  const { data } = await sb
    .from('berita')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

const KATEGORI = ['Semua', 'RA', 'SD', 'SMP', 'TPA', 'Yayasan']

export default async function BeritaPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const params = await searchParams
  const aktif = params.kategori ?? 'Semua'
  const semua = await getAllBerita()
  const filtered = aktif === 'Semua' ? semua : semua.filter(b => b.kategori === aktif)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="py-16 px-6 text-center bg-gradient-to-b from-emerald-50/70 via-white to-white">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 inline-block bg-emerald-50 px-4 py-1.5 rounded-full mb-3">Berita & Artikel</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Kabar Terkini dari Yayasan
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">Ikuti perkembangan dan informasi terbaru dari Yayasan Al Jawahir At Tarbawi.</p>
        </div>

        {/* Filter Kategori */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {KATEGORI.map(k => (
              <a key={k} href={k === 'Semua' ? '/berita' : `/berita?kategori=${k}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-colors no-underline ${
                  aktif === k
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}>
                {k}
              </a>
            ))}
          </div>
        </div>

        {/* Grid Berita */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📰</p>
              <p className="text-lg font-bold mb-2">Belum ada berita</p>
              <p className="text-sm">Kategori ini belum memiliki berita yang dipublikasikan.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">{filtered.length} berita ditemukan</p>
              <div className="grid md:grid-cols-3 gap-6">
                {filtered.map(b => <BeritaCard key={b.id} berita={b} />)}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
