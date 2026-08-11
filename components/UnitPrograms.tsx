'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AlbumGallery from '@/components/AlbumGallery'
import AnimateText from '@/components/AnimateText'
import { supabase } from '@/lib/supabase'
import { UnitKey } from '@/types'
import { Images, ArrowRight, GraduationCap } from 'lucide-react'

const units: {
  unit: UnitKey
  ar: string
  tag: string
  title: string
  desc: string
  meta: string[]
  cover: string
}[] = [
  {
    unit: 'ra',
    ar: 'روضة',
    tag: 'RA',
    title: 'RA Al Jawahir',
    desc: 'Pendidikan anak usia dini berbasis Islam yang menanamkan nilai tauhid dan kecintaan Al-Quran sejak dini.',
    meta: ['🎓 Usia 4–6 Tahun', '📍 Sunggal'],
    cover: '/covers/ra.svg',
  },
  {
    unit: 'sd',
    ar: 'اقرأ',
    tag: 'SD IT',
    title: 'SD IT Al Jawahir',
    desc: 'Sekolah Dasar Islam Terpadu yang mengintegrasikan kurikulum nasional dengan pendidikan Al-Quran dan akhlak Islami.',
    meta: ['📚 Kurikulum Merdeka', '📍 Sunggal'],
    cover: '/covers/sd.svg',
  },
  {
    unit: 'smp',
    ar: 'مدرسة',
    tag: 'SMP IT',
    title: 'SMP IT Al Jawahir',
    desc: 'Sekolah Menengah Pertama Islam Terpadu, Sekolah Penggerak Angkatan I dengan Kurikulum Merdeka sejak 2021.',
    meta: ['🏅 Sekolah Penggerak', '📚 Kurikulum Merdeka'],
    cover: '/covers/smp.svg',
  },
  {
    unit: 'tpa',
    ar: 'تحفيظ',
    tag: 'TPA',
    title: 'Taman Pendidikan Al-Quran',
    desc: 'Program hafalan dan pembelajaran Al-Quran yang terstruktur untuk membentuk generasi Qurani yang berkarakter.',
    meta: ['🌙 Semua Jenjang', '⏰ Full Day'],
    cover: '/covers/tpa.svg',
  },
]

export default function UnitPrograms() {
  const [gallery, setGallery] = useState<UnitKey | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [covers, setCovers] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    supabase
      .from('album_foto')
      .select('unit, url, is_cover, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        const c: Record<string, number> = {}
        const cv: Record<string, string> = {}
        for (const row of data ?? []) {
          c[row.unit] = (c[row.unit] ?? 0) + 1
          if (!cv[row.unit]) cv[row.unit] = row.url
          if (row.is_cover) cv[row.unit] = row.url
        }
        setCounts(c)
        setCovers(cv)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {units.map((p, i) => (
          <AnimateText key={p.unit} direction="up" delay={i * 90} className="h-full">
          <div
            className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">

            {/* HEADER — foto asli bila ada, ilustrasi bila kosong */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={covers[p.unit] ?? p.cover}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

              {/* badge tag */}
              <span className="absolute top-3 left-3 inline-block text-[11px] font-bold uppercase tracking-wider text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {p.tag}
              </span>

              {/* badge jumlah foto */}
              <button onClick={() => setGallery(p.unit)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/30 hover:bg-black/55 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm transition-all no-underline"
                aria-label={`Lihat album foto ${p.title}`}>
                <Images size={12} />
                {counts[p.unit] ?? 0} Foto
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">{p.tag}</span>
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{p.ar}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-xl leading-snug group-hover:text-emerald-800 transition-colors" style={{ fontFamily: 'Lora, serif' }}>
                {p.title}
              </h3>
              <div className="w-10 h-0.5 bg-emerald-600 rounded-full mt-2.5 mb-3" />
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {p.meta.map(m => <span key={m} className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full">{m}</span>)}
              </div>

              <div className="mt-auto flex flex-col gap-2.5">
                <button onClick={() => setGallery(p.unit)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-700/20 no-underline group/foto"
                  aria-label={`Lihat album foto ${p.title}`}>
                  <Images size={15} />
                  Lihat Galeri Foto
                  <ArrowRight size={14} className="transition-transform group-hover/foto:translate-x-1" />
                </button>
                <Link href="#kontak" className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-700 border border-gray-100 hover:border-emerald-200 py-2.5 rounded-xl no-underline transition-all group/daftar">
                  <GraduationCap size={15} />
                  Informasi Pendaftaran
                  <span className="inline-block transition-transform group-hover/daftar:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
          </AnimateText>
        ))}
      </div>

      <AlbumGallery key={gallery ?? 'none'} open={gallery !== null} unit={gallery} onClose={() => setGallery(null)} />
    </>
  )
}
