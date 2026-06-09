import Link from 'next/link'
import Image from 'next/image'
import { Berita } from '@/types'
import { formatTanggal, kategoriColor } from '@/lib/utils'

export default function BeritaCard({ berita }: { berita: Berita }) {
  return (
    <Link href={`/berita/${berita.slug}`} className="group block no-underline">
      <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
          {berita.cover_url ? (
            <Image src={berita.cover_url} alt={berita.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-900 to-green-700">
              <span className="arabic text-6xl text-white/20">الجواهر</span>
            </div>
          )}
          {/* Kategori badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${kategoriColor(berita.kategori)}`}>
            {berita.kategori}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2" style={{ fontFamily: 'Lora, serif' }}>
            {berita.judul}
          </h3>
          {berita.ringkasan && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">{berita.ringkasan}</p>
          )}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">📅 {formatTanggal(berita.created_at)}</span>
            <span className="text-xs font-bold text-green-700 group-hover:gap-2 transition-all">Baca →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
