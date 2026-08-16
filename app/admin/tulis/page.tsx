'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { makeSlug } from '@/lib/utils'
import { adminHeaders } from '@/lib/admin-headers'
import { uploadDirect, isHeic, convertHeic } from '@/lib/photo-upload'
import { ArrowLeft, Save, Send, Film } from 'lucide-react'

const KATEGORI = ['RA', 'SD', 'SMP', 'TPA', 'Yayasan']

export default function TulisPage({ editData }: { editData?: any }) {
  const router = useRouter()
  const [judul, setJudul] = useState(editData?.judul ?? '')
  const [kategori, setKategori] = useState(editData?.kategori ?? 'RA')
  const [penulis, setPenulis] = useState(editData?.penulis ?? '')
  const [ringkasan, setRingkasan] = useState(editData?.ringkasan ?? '')
  const [isi, setIsi] = useState(editData?.isi ?? '')
  const [coverUrl, setCoverUrl] = useState(editData?.cover_url ?? '')
  const [videoUrl, setVideoUrl] = useState(editData?.video_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [toastErr, setToastErr] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('admin_token')) router.push('/admin')
  }, [router])

  function showToast(msg: string, err = false) {
    setToast(msg); setToastErr(err)
    setTimeout(() => setToast(''), 3500)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { showToast('Ukuran gambar maks 5MB!', true); return }
    setUploading(true)
    setUploadProgress(0)
    try {
      if (isHeic(file)) {
        showToast('⏳ Foto HEIC dikonversi ke JPEG...')
        file = await convertHeic(file)
        if (file.size > 5 * 1024 * 1024) { showToast('Hasil konversi melebihi 5MB!', true); return }
      }
      const url = await uploadDirect(file, 'berita-images', null, setUploadProgress)
      setCoverUrl(url)
      showToast('✅ Gambar berhasil diupload!')
    } catch (err) {
      showToast('Gagal upload: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'), true)
    } finally {
      setUploading(false)
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { showToast('Ukuran video maks 50MB!', true); return }
    if (!file.type.startsWith('video/')) { showToast('File harus berupa video!', true); return }
    setUploadingVideo(true)
    setUploadProgress(0)
    try {
      const url = await uploadDirect(file, 'berita-videos', null, setUploadProgress)
      setVideoUrl(url)
      showToast('✅ Video berhasil diupload!')
    } catch (err) {
      showToast('Gagal upload video: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'), true)
    } finally {
      setUploadingVideo(false)
    }
  }

  async function save(publish: boolean) {
    if (!judul.trim()) { showToast('Judul wajib diisi!', true); return }
    if (!isi.trim()) { showToast('Isi berita wajib diisi!', true); return }
    setSaving(true)
    const payload = {
      id: editData?.id,
      judul: judul.trim(),
      slug: editData?.slug ?? (makeSlug(judul.trim()) + '-' + Date.now().toString().slice(-4)),
      ringkasan: ringkasan.trim() || null,
      isi: isi.trim(),
      kategori,
      penulis: penulis.trim() || null,
      cover_url: coverUrl || null,
      video_url: videoUrl || null,
      published: publish,
    }
    const res = await fetch('/api/berita', {
      method: editData ? 'PATCH' : 'POST',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.status === 401) {
      showToast('Sesi berakhir. Silakan login kembali.', true)
      setTimeout(() => router.push('/admin'), 1200)
      return
    }
    const json = await res.json().catch(() => null)
    if (!res.ok) { showToast('Gagal menyimpan: ' + (json?.error ?? 'Terjadi kesalahan'), true); return }
    showToast(publish ? '✅ Berhasil dipublikasikan!' : '💾 Draft disimpan!')
    setTimeout(() => router.push('/admin'), 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-emerald-950 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/admin" className="text-white/70 hover:text-white no-underline transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-white font-bold text-xs md:text-sm">{editData ? 'Edit Berita' : 'Tulis Berita Baru'}</p>
            <p className="text-white/50 text-[10px] md:text-xs">Al Jawahir At Tarbawi</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => save(false)} disabled={saving}
            className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-white/20 disabled:opacity-50">
            <Save size={14} />
            {saving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button onClick={() => save(true)} disabled={saving}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors disabled:opacity-50">
            <Send size={14} />
            {saving ? 'Memproses...' : 'Publikasi'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Judul */}
        <input value={judul} onChange={e => setJudul(e.target.value)} maxLength={200}
          className="w-full text-xl md:text-3xl font-bold text-gray-800 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-transparent pb-3 mb-6 md:mb-8 placeholder-gray-300 transition-colors"
          style={{ fontFamily: 'Lora, serif' }}
          placeholder="Tulis judul berita yang menarik..." />

        {/* Meta row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8 p-4 md:p-5 bg-white rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategori</label>
            <select value={kategori} onChange={e => setKategori(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white">
              {KATEGORI.map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Penulis</label>
            <input value={penulis} onChange={e => setPenulis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Nama penulis (opsional)" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Gambar Cover</label>
          {coverUrl ? (
            <div className="relative">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100">
                <Image src={coverUrl} alt="Cover" fill className="object-contain" sizes="(max-width: 768px) 100vw, 768px" />
              </div>
              <button onClick={() => setCoverUrl('')}
                className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                Hapus Gambar
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
              <div className="text-4xl mb-3">{uploading ? '⏳' : '🖼️'}</div>
              <p className="text-gray-500 text-sm mb-1">
                {uploading ? <>Mengupload gambar... {uploadProgress}%</> : <><strong className="text-emerald-700">Klik untuk upload gambar</strong></>}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP, HEIC — maksimal 5MB</p>
              {uploading && (
                <div className="mt-4 max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
              <input type="file" accept="image/*,.heic,.heif" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Video (opsional) */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Film size={14} /> Video <span className="normal-case font-normal">(opsional)</span>
          </label>
          {videoUrl ? (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              </div>
              <button onClick={() => setVideoUrl('')}
                className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                Hapus Video
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
              <div className="text-4xl mb-3">{uploadingVideo ? '⏳' : '🎬'}</div>
              <p className="text-gray-500 text-sm mb-1">
                {uploadingVideo ? <>Mengupload video... {uploadProgress}%</> : <><strong className="text-emerald-700">Klik untuk upload video</strong></>}
              </p>
              <p className="text-xs text-gray-400">MP4, WebM, MOV — maksimal 50MB (semakin besar file, semakin lama)</p>
              {uploadingVideo && (
                <div className="mt-4 max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
            </label>
          )}
        </div>

        {/* Ringkasan */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Ringkasan <span className="normal-case font-normal">(tampil di kartu berita)</span></label>
          <textarea value={ringkasan} onChange={e => setRingkasan(e.target.value)} maxLength={300}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            rows={3} placeholder="Tuliskan ringkasan singkat berita ini..." />
          <p className="text-xs text-gray-400 text-right mt-1">{ringkasan.length}/300</p>
        </div>

        {/* Isi */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Isi Berita *</label>
          <textarea value={isi} onChange={e => setIsi(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-y leading-relaxed min-h-64"
            placeholder={'Tuliskan isi berita lengkap di sini...\n\nTekan Enter dua kali untuk membuat paragraf baru.\n\nKonten ini akan tampil saat pembaca membuka berita.'} />
          <p className="text-xs text-gray-400 mt-1">{isi.length} karakter</p>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
          <Link href="/admin" className="order-first sm:order-none text-center px-4 sm:px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors no-underline">
            Batal
          </Link>
          <div className="flex gap-2 sm:gap-3 flex-1 sm:flex-none">
            <button onClick={() => save(false)} disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
              <Save size={14} /> Draft
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
              <Send size={14} /> {saving ? 'Proses...' : 'Publikasi'}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl text-white text-sm font-semibold shadow-xl ${toastErr ? 'bg-red-600' : 'bg-emerald-800'}`}>
          {toast}
        </div>
      )}
    </div>
  )
}
