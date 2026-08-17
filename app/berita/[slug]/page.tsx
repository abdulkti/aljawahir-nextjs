import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const berita = await getBerita(slug)
  if (!berita) return { title: 'Berita Tidak Ditemukan' }
  return {
    title: berita.judul,
    description: berita.ringkasan ?? berita.judul,
    alternates: { canonical: `/berita/${berita.slug}` },
    openGraph: {
      type: 'article',
      title: berita.judul,
      description: berita.ringkasan ?? berita.judul,
      url: `https://aljawahirattarbawi.com/berita/${berita.slug}`,
      images: berita.cover_url
        ? [{ url: berita.cover_url, alt: berita.judul }]
        : ['/logo-aljawahir.png'],
      publishedTime: berita.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: berita.judul,
      description: berita.ringkasan ?? berita.judul,
      images: berita.cover_url ? [berita.cover_url] : ['/logo-aljawahir.png'],
    },
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
        <div className="relative bg-emerald-950/95">
          {berita.cover_url ? (
            <Image
              src={berita.cover_url}
              alt={berita.judul}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full max-h-[65vh] object-contain mx-auto"
              priority
            />
          ) : (
            <div className="h-72 md:h-96 bg-gradient-to-br from-emerald-900 to-emerald-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl mx-auto">
            <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${kategoriColor(berita.kategori)}`}>
              {berita.kategori}
            </span>
            <h1 className="text-white text-2xl md:text-4xl font-bold leading-snug" style={{ fontFamily: 'var(--font-lora)' }}>
              {berita.judul}
            </h1>
          </div>
        </div>

        {/* Video */}
        {berita.video_url && (
          <div className="max-w-3xl mx-auto px-6 pt-8">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg">
              <video
                src={berita.video_url}
                controls
                preload="metadata"
                poster={berita.cover_url ?? undefined}
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung pemutar video.
              </video>
            </div>
          </div>
        )}

        {/* Konten */}
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span>📅 {formatTanggal(berita.created_at, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {berita.penulis && <span>✍️ {berita.penulis}</span>}
          </div>

          {/* Ringkasan */}
          {berita.ringkasan && (
            <p className="text-gray-500 text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-5 mb-8 bg-emerald-50/60 py-4 pr-4 rounded-r-xl">
              {berita.ringkasan}
            </p>
          )}

          {/* Isi */}
          <div className="prose-berita">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Back */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <Link href="/berita" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm no-underline hover:underline">
              ← Kembali ke Berita
            </Link>
          </div>
        </div>

        {/* Berita Lainnya */}
        {beritaLain.length > 0 && (
          <div className="bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <h3 className="font-bold text-gray-800 text-xl mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
                Berita Lainnya
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {beritaLain.map(b => (
                  <Link key={b.id} href={`/berita/${b.slug}`} className="no-underline group">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-[16/10] bg-gradient-to-br from-emerald-900 to-emerald-700 relative overflow-hidden">
                        {b.cover_url && <Image src={b.cover_url} alt={b.judul} fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" />}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-emerald-700 font-bold mb-1">{b.kategori}</p>
                        <p className="text-gray-800 font-bold text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors" style={{ fontFamily: 'var(--font-lora)' }}>{b.judul}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTanggal(b.created_at)}</p>
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
