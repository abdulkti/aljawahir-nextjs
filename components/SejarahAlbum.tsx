'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import AlbumGallery from '@/components/AlbumGallery'
import { supabase } from '@/lib/supabase'
import { AlbumFoto } from '@/types'
import { Images, ArrowRight } from 'lucide-react'

export default function SejarahAlbum() {
  const [photos, setPhotos] = useState<AlbumFoto[]>([])
  const [loading, setLoading] = useState(true)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('album_foto')
      .select('*')
      .eq('unit', 'sejarah')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setPhotos(data ?? [])
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const preview = photos.slice(0, 4)
  const open = () => setGalleryOpen(true)

  return (
    <>
      <Reveal from="left">
        <div className="mt-14 rounded-2xl bg-gray-50 border border-gray-200/70 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-5 md:px-6 py-4 bg-white border-b border-gray-100">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-0.5">Album Foto</p>
              <h3 className="font-bold text-gray-800 text-lg tracking-tight" style={{ fontFamily: 'Lora, serif' }}>
                Album Sejarah & Pencapaian
              </h3>
            </div>
            <button onClick={open}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors no-underline">
              <Images size={15} />
              Lihat Album ({photos.length})
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm">⏳ Memuat album...</div>
            ) : photos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="font-bold text-gray-600 text-sm mb-1">Album sejarah belum berisi foto</p>
                <p className="text-xs text-gray-400">Foto-foto perjalanan yayasan akan tampil di sini setelah ditambahkan melalui panel admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {preview.map(p => (
                  <button key={p.id} onClick={open}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-emerald-400 transition-colors cursor-pointer">
                    <Image src={p.url} alt={p.caption ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                    {p.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                        <p className="text-white text-[11px] leading-snug line-clamp-1">{p.caption}</p>
                      </div>
                    )}
                  </button>
                ))}
                {photos.length > 4 && (
                  <button onClick={open}
                    className="relative aspect-square rounded-xl overflow-hidden bg-emerald-950 text-white flex flex-col items-center justify-center gap-1 hover:bg-emerald-900 transition-colors cursor-pointer">
                    <span className="text-2xl font-bold" style={{ fontFamily: 'Lora, serif' }}>+{photos.length - 4}</span>
                    <span className="text-[11px] text-white/70">Foto lainnya</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <AlbumGallery open={galleryOpen} unit={galleryOpen ? 'sejarah' : null} onClose={() => setGalleryOpen(false)} />
    </>
  )
}
