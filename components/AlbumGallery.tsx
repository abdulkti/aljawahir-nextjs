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

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-black/95">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <button onClick={close} className="flex items-center gap-2 text-white/90 hover:text-white px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors no-underline text-sm font-bold" aria-label="Kembali ke galeri">
              <ChevronLeft size={20} />
              Kembali
            </button>
            <span className="text-white/60 text-sm font-bold">{lightbox + 1} / {photos.length}</span>
            <button onClick={close} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Tutup">
              <X size={20} />
            </button>
          </div>

          {/* Photo area */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 px-4">
            <button onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length) }}
              className="absolute left-2 md:left-6 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10" aria-label="Sebelumnya">
              <ChevronLeft size={24} />
            </button>
            <div className="max-h-full max-w-5xl w-full" onClick={close}>
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[68vh]">
                <Image src={photos[lightbox].url} alt="" aria-hidden fill className="object-contain" sizes="100vw" priority />
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length) }}
              className="absolute right-2 md:right-6 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10" aria-label="Berikutnya">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom caption bar */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 shrink-0">
            <p className="text-white/80 text-sm truncate">
              {photos[lightbox].caption ?? 'Tanpa keterangan'}
            </p>
            <button onClick={close} className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors no-underline">
              Tutup <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
