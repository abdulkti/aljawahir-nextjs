'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { AlbumFoto, UNIT_LABELS, UnitKey } from '@/types'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  open: boolean
  unit: UnitKey | null
  onClose: () => void
}

export default function AlbumGallery({ open, unit, onClose }: Props) {
  const [photos, setPhotos] = useState<AlbumFoto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (!open || !unit) return

    let cancelled = false

    supabase
      .from('album_foto')
      .select('*')
      .eq('unit', unit)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setPhotos(data ?? [])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, unit])

  const close = useCallback(() => {
    setLightbox(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (lightbox !== null) {
        if (e.key === 'ArrowRight') setLightbox(i => (i === null ? i : (i + 1) % photos.length))
        if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? i : (i - 1 + photos.length) % photos.length))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, lightbox, photos.length])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || !unit) return null

  const label = UNIT_LABELS[unit]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100 bg-white">
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              📸 Album Foto — {label}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{photos.length} foto</p>
          </div>
          <button onClick={close} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="text-center py-16 text-gray-400">⏳ Memuat foto...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🖼️</p>
              <p className="font-bold text-gray-600 mb-1">Belum ada foto</p>
              <p className="text-sm">Foto album unit ini belum ditambahkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((p, i) => (
                <button key={p.id} onClick={() => setLightbox(i)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-green-400 transition-all cursor-zoom-in">
                  <Image src={p.url} alt="" aria-hidden fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                  {p.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
                      <p className="text-white text-[11px] leading-snug line-clamp-2">{p.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox (panel, bukan full screen) */}
      {lightbox !== null && photos[lightbox] && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

          <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
              <button onClick={() => setLightbox(null)} className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors no-underline" aria-label="Kembali ke galeri">
                <ChevronLeft size={18} />
                Kembali
              </button>
              <span className="text-sm font-bold text-gray-500">{lightbox + 1} / {photos.length}</span>
              <button onClick={close} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Tutup">
                <X size={20} />
              </button>
            </div>

            {/* Photo area */}
            <div className="relative flex-1 min-h-0 bg-gray-900 flex items-center justify-center h-64 md:h-[55vh]">
              <button onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length) }}
                className="absolute left-2 md:left-3 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors" aria-label="Sebelumnya">
                <ChevronLeft size={24} />
              </button>
              <div className="relative w-full h-full">
                <Image src={photos[lightbox].url} alt="" aria-hidden fill className="object-contain" sizes="80vw" priority />
              </div>
              <button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length) }}
                className="absolute right-2 md:right-3 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors" aria-label="Berikutnya">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Caption bar */}
            <div className="px-5 py-3 border-t border-gray-100 bg-white shrink-0">
              <p className="text-sm text-gray-600 text-center truncate">
                {photos[lightbox].caption ?? 'Tanpa keterangan'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
