'use client'
import { useState } from 'react'
import Link from 'next/link'
import AlbumGallery from '@/components/AlbumGallery'
import { UnitKey } from '@/types'
import { Images } from 'lucide-react'

const units: {
  unit: UnitKey
  ar: string
  icon: string
  tag: string
  title: string
  desc: string
  meta: string[]
}[] = [
  {
    unit: 'ra',
    ar: 'روضة',
    icon: '🌙',
    tag: 'TK / RA',
    title: 'RA Al Jawahir',
    desc: 'Pendidikan anak usia dini berbasis Islam yang menanamkan nilai tauhid dan kecintaan Al-Quran sejak dini.',
    meta: ['🎓 Usia 4–6 Tahun', '📍 Sunggal'],
  },
  {
    unit: 'sd',
    ar: 'اقرأ',
    icon: '📖',
    tag: 'SD IT',
    title: 'SD IT Al Jawahir',
    desc: 'Sekolah Dasar Islam Terpadu yang mengintegrasikan kurikulum nasional dengan pendidikan Al-Quran dan akhlak Islami.',
    meta: ['📚 Kurikulum Merdeka', '📍 Sunggal'],
  },
  {
    unit: 'smp',
    ar: 'مدرسة',
    icon: '🎓',
    tag: 'SMP IT',
    title: 'SMP IT Al Jawahir',
    desc: 'Sekolah Menengah Pertama Islam Terpadu, Sekolah Penggerak Angkatan I dengan Kurikulum Merdeka sejak 2021.',
    meta: ['🏅 Sekolah Penggerak', '📚 Kurikulum Merdeka'],
  },
  {
    unit: 'tpa',
    ar: 'تحفيظ',
    icon: '🕌',
    tag: 'TPA',
    title: 'Taman Pendidikan Al-Quran',
    desc: 'Program hafalan dan pembelajaran Al-Quran yang terstruktur untuk membentuk generasi Qurani yang berkarakter.',
    meta: ['🌙 Semua Jenjang', '⏰ Full Day'],
  },
]

export default function UnitPrograms() {
  const [gallery, setGallery] = useState<UnitKey | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {units.map(p => (
          <div key={p.unit} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
            <div className="h-44 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")" }} />
              <div className="relative flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl">{p.icon}</span>
                <span className="arabic text-2xl text-white/20">{p.ar}</span>
              </div>
              <button onClick={() => setGallery(p.unit)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 hover:bg-white text-green-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all no-underline"
                aria-label={`Lihat album foto ${p.title}`}>
                <Images size={13} />
                Lihat Foto
              </button>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-full self-start">{p.tag}</span>
              <h3 className="font-bold text-gray-800 text-lg mt-3 mb-2 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.meta.map(m => <span key={m} className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full">{m}</span>)}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <Link href="#kontak" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 no-underline group/link hover:gap-3 transition-all">
                  Informasi Pendaftaran
                  <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                </Link>
                <button onClick={() => setGallery(p.unit)}
                  className="text-xs font-bold text-gray-400 hover:text-green-700 transition-colors no-underline"
                  aria-label={`Lihat album foto ${p.title}`}>
                  Album Foto →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlbumGallery key={gallery ?? 'none'} open={gallery !== null} unit={gallery} onClose={() => setGallery(null)} />
    </>
  )
}
