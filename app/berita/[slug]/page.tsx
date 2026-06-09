import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabaseServer } from '@/lib/supabase'
import { formatTanggal, kategoriColor } from '@/lib/utils'
import { Berita } from '@/types'

async function getBerita(slug: string): Promise<Berita | null> {
  const sb = supabaseServer()
  const { data } = await sb
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
}

async function getBeritaLain(id: string, kategori: string): Promise<Berita[]> {
  const sb = supabaseServer()
  const { data } = await sb
    .from('berita')
    .select('*')
    .eq('published', true)
    .eq('kategori', kategori)
    .neq('id', id)
    .limit(3)
  return data ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const berita = await getBerita(slug)
  if (!berita) return { title: 'Berita Tidak Ditemukan' }
  return {
    title: `${berita.judul} — Al Jawahir At Tarbawi`,
    description: berita.ringkasan ?? berita.judul,
  }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const berita = await getBerita(slug)
  if (!berita) notFound()

  const beritaLain = await getBeritaLain(berita.id, berita.kategori)
  const paragraphs = (berita.isi ?? '').split('\n\n').filter(Boolean)

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-white">
        {/* Cover */}
        <div className="relative h-72 md:h-96 bg-gradient-to-br from-green-900 to-green-700 overflow-hidden">
          {berita.cover_url && (
            <Image src={berita.cover_url} alt={berita.judul} fill className="object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl mx-auto">
            <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${kategoriColor(berita.kategori)}`}>
              {berita.kategori}
            </span>
            <h1 className="text-white text-2xl md:text-4xl font-bold leading-snug" style={{ fontFamily: 'Lora, serif' }}>
              {berita.judul}
            </h1>
          </div>
        </div>

        {/* Konten */}
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
            <span>📅 {formatTanggal(berita.created_at, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {berita.penulis && <span>✍️ {berita.penulis}</span>}
          </div>

          {/* Ringkasan */}
          {berita.ringkasan && (
            <p className="text-gray-500 text-lg leading-relaxed italic border-l-4 border-green-500 pl-5 mb-8 bg-green-50 py-4 pr-4 rounded-r-xl">
              {berita.ringkasan}
            </p>
          )}

          {/* Isi */}
          <div className="prose-berita">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <Link href="/berita" className="inline-flex items-center gap-2 text-green-700 font-bold text-sm no-underline hover:underline">
              ← Kembali ke Berita
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Bagikan:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(berita.judul)}`} target="_blank" rel="noopener noreferrer"
                className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg no-underline hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://aljawahir.com/berita/${berita.slug}`)}`} target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg no-underline hover:bg-blue-700 transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Berita Lainnya */}
        {beritaLain.length > 0 && (
          <div className="bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <h3 className="font-bold text-gray-800 text-xl mb-6" style={{ fontFamily: 'Lora, serif' }}>
                Berita Lainnya
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {beritaLain.map(b => (
                  <Link key={b.id} href={`/berita/${b.slug}`} className="no-underline group">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gradient-to-br from-green-900 to-green-700 relative overflow-hidden">
                        {b.cover_url && <Image src={b.cover_url} alt={b.judul} fill className="object-cover opacity-80" />}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-green-700 font-bold mb-1">{b.kategori}</p>
                        <p className="text-gray-800 font-bold text-sm line-clamp-2 group-hover:text-green-700 transition-colors" style={{ fontFamily: 'Lora, serif' }}>{b.judul}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatTanggal(b.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
