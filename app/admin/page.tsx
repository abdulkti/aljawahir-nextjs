'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatTanggal } from '@/lib/utils'
import { adminHeaders } from '@/lib/admin-headers'
import { uploadPhoto } from '@/lib/photo-upload'
import { Berita, AlbumFoto, Sejarah, UNIT_KEYS, UNIT_LABELS, UnitKey } from '@/types'
import { LayoutDashboard, Newspaper, PenSquare, LogOut, Plus, Pencil, Trash2, Eye, EyeOff, Menu, X, Images, Upload, Star, Globe, PenLine, CalendarDays, History, Save } from 'lucide-react'

type Tab = 'dashboard' | 'berita' | 'album' | 'sejarah'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [uname, setUname] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastErr, setToastErr] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logging, setLogging] = useState(false)
  const [albumUnit, setAlbumUnit] = useState<UnitKey>('ra')
  const [albumPhotos, setAlbumPhotos] = useState<AlbumFoto[]>([])
  const [albumLoading, setAlbumLoading] = useState(false)
  const [albumUploading, setAlbumUploading] = useState(false)
  const [albumProgress, setAlbumProgress] = useState(0)
  const [albumCaption, setAlbumCaption] = useState('')
  const [sejarahList, setSejarahList] = useState<Sejarah[]>([])
  const [sejarahLoading, setSejarahLoading] = useState(false)
  const [sejarahFormOpen, setSejarahFormOpen] = useState(false)
  const [sejarahSaving, setSejarahSaving] = useState(false)
  const [sejarahEditId, setSejarahEditId] = useState<string | null>(null)
  const [sejarahTahun, setSejarahTahun] = useState('')
  const [sejarahJudul, setSejarahJudul] = useState('')
  const [sejarahDeskripsi, setSejarahDeskripsi] = useState('')
  const [sejarahUrutan, setSejarahUrutan] = useState(0)
  const [sejarahFoto, setSejarahFoto] = useState<File | null>(null)
  const [sejarahFotoPreview, setSejarahFotoPreview] = useState('')
  const [sejarahRemoveFoto, setSejarahRemoveFoto] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('admin_token')) {
      setAuthed(true)
      loadBerita()
    }
  }, [])

  async function loadAlbum(unit: UnitKey = albumUnit) {
    setAlbumLoading(true)
    const res = await fetch(`/api/album?unit=${unit}`, { headers: adminHeaders() })
    const data = await res.json().catch(() => null)
    setAlbumPhotos(Array.isArray(data) ? data : [])
    setAlbumLoading(false)
  }

  async function handleAlbumUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { showToast('Ukuran gambar maks 10MB!', true); return }
    setAlbumUploading(true)
    setAlbumProgress(0)
    try {
      const url = await uploadPhoto(file, 'album-images', albumUnit, 10 * 1024 * 1024, setAlbumProgress)
      const res = await fetch('/api/album', {
        method: 'POST',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ unit: albumUnit, caption: albumCaption, url }),
      })
      const json = await res.json()
      if (!res.ok) { showToast('Gagal upload: ' + json.error, true); return }
      setAlbumCaption('')
      showToast('✅ Foto berhasil ditambahkan!')
      loadAlbum()
    } catch (err) {
      showToast('Gagal upload: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'), true)
    } finally {
      setAlbumUploading(false)
    }
  }

  async function hapusFoto(id: string) {
    if (!confirm('Hapus foto ini? Tidak bisa dibatalkan.')) return
    const res = await fetch(`/api/album?id=${id}`, { method: 'DELETE', headers: adminHeaders() })
    if (!res.ok) { showToast('Gagal menghapus foto.', true); return }
    showToast('🗑️ Foto dihapus.')
    loadAlbum()
  }

  async function setSampul(id: string) {
    const res = await fetch('/api/album', { method: 'PATCH', headers: adminHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ id }) })
    if (!res.ok) { showToast('Gagal set sampul.', true); return }
    showToast('⭐ Foto ditetapkan sebagai sampul unit.')
    loadAlbum()
  }

  async function loadSejarah() {
    setSejarahLoading(true)
    const res = await fetch('/api/sejarah', { headers: adminHeaders() })
    const data = await res.json().catch(() => null)
    setSejarahList(Array.isArray(data) ? data : [])
    setSejarahLoading(false)
  }

  function openSejarahForm(entry?: Sejarah) {
    if (entry) {
      setSejarahEditId(entry.id)
      setSejarahTahun(entry.tahun)
      setSejarahJudul(entry.judul)
      setSejarahDeskripsi(entry.deskripsi)
      setSejarahUrutan(entry.urutan)
      setSejarahFotoPreview(entry.foto_url ?? '')
    } else {
      setSejarahEditId(null)
      setSejarahTahun('')
      setSejarahJudul('')
      setSejarahDeskripsi('')
      setSejarahUrutan(sejarahList.length + 1)
      setSejarahFotoPreview('')
    }
    setSejarahFoto(null)
    setSejarahRemoveFoto(false)
    setSejarahFormOpen(true)
  }

  function onSejarahFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { showToast('Ukuran gambar maks 10MB!', true); return }
    setSejarahFoto(f)
    setSejarahFotoPreview(URL.createObjectURL(f))
    setSejarahRemoveFoto(false)
  }

  async function simpanSejarah(e: React.FormEvent) {
    e.preventDefault()
    if (!sejarahTahun.trim() || !sejarahJudul.trim() || !sejarahDeskripsi.trim()) {
      showToast('Tahun, judul, dan deskripsi wajib diisi!', true)
      return
    }
    setSejarahSaving(true)
    try {
      const payload: Record<string, string | number | boolean | null> = {
        tahun: sejarahTahun.trim(),
        judul: sejarahJudul.trim(),
        deskripsi: sejarahDeskripsi.trim(),
        urutan: sejarahUrutan,
      }
      if (sejarahEditId) payload.id = sejarahEditId
      if (sejarahFoto) {
        payload.foto_url = await uploadPhoto(sejarahFoto, 'album-images', 'sejarah', 10 * 1024 * 1024)
      } else if (sejarahRemoveFoto) {
        payload.remove_photo = true
      }
      const res = await fetch('/api/sejarah', {
        method: sejarahEditId ? 'PATCH' : 'POST',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { showToast('Gagal simpan: ' + json.error, true); return }
      showToast(sejarahEditId ? '✅ Peristiwa diperbarui!' : '✅ Peristiwa ditambahkan!')
      setSejarahFormOpen(false)
      loadSejarah()
    } catch (err) {
      showToast('Gagal simpan: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'), true)
    } finally {
      setSejarahSaving(false)
    }
  }

  async function hapusSejarah(entry: Sejarah) {
    if (!confirm(`Hapus peristiwa "${entry.judul}"? Tidak bisa dibatalkan.`)) return
    const res = await fetch(`/api/sejarah?id=${entry.id}`, { method: 'DELETE', headers: adminHeaders() })
    if (!res.ok) { showToast('Gagal menghapus.', true); return }
    showToast('🗑️ Peristiwa dihapus.')
    loadSejarah()
  }

  async function doLogin() {
    setLogging(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: uname, password: pw }),
    })
    setLogging(false)
    if (res.ok) {
      const { token } = await res.json()
      sessionStorage.setItem('admin_token', token)
      setAuthed(true)
      loadBerita()
    } else {
      setPwErr(true)
      setPw('')
    }
  }

  function doLogout() {
    sessionStorage.removeItem('admin_token')
    setAuthed(false)
  }

  async function loadBerita() {
    setLoading(true)
    const res = await fetch('/api/berita', { headers: adminHeaders() })
    const json = await res.json().catch(() => null)
    setBeritaList(Array.isArray(json) ? json : [])
    setLoading(false)
  }

  function showToast(msg: string, err = false) {
    setToast(msg); setToastErr(err)
    setTimeout(() => setToast(''), 3500)
  }

  async function togglePublish(id: string, current: boolean) {
    const res = await fetch('/api/berita', {
      method: 'PATCH',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id, published: !current }),
    })
    if (res.status === 401) { showToast('Sesi berakhir. Silakan login kembali.', true); return }
    if (!res.ok) { showToast('Gagal mengubah status.', true); return }
    showToast(current ? '📝 Disimpan sebagai draft.' : '✅ Berhasil dipublikasikan!')
    loadBerita()
  }

  async function hapus(id: string, judul: string) {
    if (!confirm(`Hapus berita "${judul}"? Tidak bisa dibatalkan.`)) return
    const res = await fetch(`/api/berita?id=${id}`, { method: 'DELETE', headers: adminHeaders() })
    if (res.status === 401) { showToast('Sesi berakhir. Silakan login kembali.', true); return }
    if (!res.ok) { showToast('Gagal menghapus.', true); return }
    showToast('🗑️ Berita dihapus.')
    loadBerita()
  }

  const published = beritaList.filter(b => b.published)
  const drafts = beritaList.filter(b => !b.published)

  // ===== LOGIN SCREEN =====
  if (!authed) return (
    <div className="min-h-screen bg-emerald-50/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg border border-emerald-100">
        <div className="text-center mb-8">
          <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-16 h-16 object-contain mx-auto mb-3" />
          <h1 className="font-bold text-gray-800 text-xl" style={{ fontFamily: 'Lora, serif' }}>Panel Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Al Jawahir At Tarbawi</p>
        </div>
        {pwErr && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">Username atau password salah. Silakan coba lagi.</div>}
        <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
        <input value={uname} onChange={e => { setUname(e.target.value); setPwErr(false) }}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 mb-4"
          placeholder="Masukkan username" autoFocus />
        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwErr(false) }}
          onKeyDown={e => e.key === 'Enter' && doLogin()}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 mb-4"
          placeholder="Masukkan password" />
        <button onClick={doLogin} disabled={logging} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
          {logging ? 'Memproses...' : 'Masuk ke Admin →'}
        </button>
        <Link href="/" className="block text-center text-xs text-gray-400 mt-4 no-underline hover:text-emerald-700">← Kembali ke Website</Link>
      </div>
    </div>
  )

  // ===== ADMIN PANEL =====
  return (
    <div className="min-h-screen bg-emerald-50/40">

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-emerald-950 px-4 h-12 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-6 h-6 object-contain" />
          <div className="leading-tight">
            <p className="text-white text-xs font-bold">Al Jawahir At Tarbawi</p>
            <p className="text-amber-300 text-[10px]">Admin Panel</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/80 hover:text-white p-1">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop mobile */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-56 bg-gradient-to-b from-emerald-950 to-emerald-900 flex-col transition-transform duration-200 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-4 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-7 h-7 object-contain" />
            <div className="leading-tight">
              <p className="text-white text-xs font-bold">Al Jawahir At Tarbawi</p>
              <p className="text-amber-300 text-[10px]">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2.5 py-2">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'berita', label: 'Daftar Berita', icon: Newspaper },
            { id: 'album', label: 'Album Foto', icon: Images },
            { id: 'sejarah', label: 'Sejarah', icon: History },
          ] as const).map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setMobileOpen(false); if (item.id === 'album') loadAlbum(); if (item.id === 'sejarah') loadSejarah() }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold mb-0.5 transition-colors ${tab === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
          <Link href="/admin/tulis" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold mb-0.5 text-white/60 hover:text-white hover:bg-white/8 no-underline transition-colors">
            <PenSquare size={15} />
            Tulis Berita
          </Link>
        </nav>
        <div className="px-2.5 py-2 border-t border-white/10">
          <Link href="/" target="_blank" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-white hover:bg-white/8 no-underline transition-colors mb-0.5">
            <Eye size={15} />
            Lihat Website
          </Link>
          <button onClick={doLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pt-12 md:pt-0 md:ml-56 flex-1 p-4 md:p-6 lg:p-8">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="flex-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Dashboard</h1>
                <p className="text-gray-400 text-xs mt-0.5">Selamat datang di panel admin yayasan</p>
              </div>
              <Link href="/admin/tulis" className="self-start flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold no-underline transition-colors">
                <Plus size={14} /> Tulis Berita Baru
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
              {[
                { label: 'Total Berita', value: beritaList.length, icon: Newspaper, chip: 'bg-emerald-100 text-emerald-700' },
                { label: 'Dipublikasikan', value: published.length, icon: Globe, chip: 'bg-sky-100 text-sky-600' },
                { label: 'Draft', value: drafts.length, icon: PenLine, chip: 'bg-amber-100 text-amber-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${s.chip} flex items-center justify-center shrink-0`}>
                    <s.icon size={17} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800 leading-none" style={{ fontFamily: 'Lora, serif' }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Terbaru */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Lora, serif' }}>Berita Terbaru</h2>
                <button onClick={() => setTab('berita')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                  Lihat semua →
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {beritaList.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/50 transition-colors">
                    <div className="w-10 h-8 rounded-md bg-emerald-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={40} height={32} className="object-cover w-full h-full" /> : <span className="text-sm">📰</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{b.judul}</p>
                      <p className="text-xs text-gray-400">{b.kategori} · {formatTanggal(b.created_at)}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1 h-1 rounded-full ${b.published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {b.published ? 'Publik' : 'Draft'}
                    </span>
                  </div>
                ))}
                {beritaList.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">Belum ada berita.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DAFTAR BERITA */}
        {tab === 'berita' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h1 className="flex-1 text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Daftar Berita</h1>
              <Link href="/admin/tulis" className="self-start flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold no-underline transition-colors">
                <Plus size={14} /> Tulis Berita Baru
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">⏳ Memuat...</div>
            ) : beritaList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-4xl mb-3">📰</p>
                <p className="font-bold text-gray-600 mb-1">Belum ada berita</p>
                <Link href="/admin/tulis" className="text-sm text-emerald-700 no-underline hover:underline">Tulis berita pertama →</Link>
              </div>
            ) : (<>
              <div className="hidden sm:block bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-emerald-50/60 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Berita</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Kategori</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beritaList.map(b => (
                      <tr key={b.id} className="border-b border-gray-100 hover:bg-emerald-50/40 transition-colors last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 rounded-md bg-emerald-50 flex-shrink-0 overflow-hidden">
                              {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={40} height={32} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-sm">📰</div>}
                            </div>
                            <p className="font-medium text-gray-800 text-sm line-clamp-1 max-w-xs">{b.judul}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{b.kategori}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${b.published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {b.published ? 'Publik' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-sm text-gray-400">
                            <CalendarDays size={14} />
                            {formatTanggal(b.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => togglePublish(b.id, b.published)} title={b.published ? 'Jadikan Draft' : 'Publikasikan'}
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                              {b.published ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <Link href={`/admin/edit/${b.id}`} className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors no-underline">
                              <Pencil size={14} />
                            </Link>
                            <button onClick={() => hapus(b.id, b.judul)}
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden flex flex-col gap-3">
                {beritaList.map(b => (
                  <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-8 rounded-md bg-emerald-50 flex-shrink-0 overflow-hidden mt-0.5">
                        {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={40} height={32} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-sm">📰</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm leading-snug line-clamp-2">{b.judul}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{b.kategori}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            <span className={`w-1 h-1 rounded-full ${b.published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {b.published ? 'Publik' : 'Draft'}
                          </span>
                        </div>
                        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <CalendarDays size={12} /> {formatTanggal(b.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button onClick={() => togglePublish(b.id, b.published)} title={b.published ? 'Jadikan Draft' : 'Publikasikan'}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        {b.published ? <EyeOff size={13} /> : <Eye size={13} />} {b.published ? 'Draft' : 'Publikasi'}
                      </button>
                      <Link href={`/admin/edit/${b.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors no-underline">
                        <Pencil size={13} /> Edit
                      </Link>
                      <button onClick={() => hapus(b.id, b.judul)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        )}

        {/* ALBUM FOTO */}
        {tab === 'album' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="flex-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Album Foto</h1>
                <p className="text-gray-400 text-xs mt-0.5">Upload dan kelola foto album setiap unit pendidikan</p>
              </div>
            </div>

            {/* Pilih unit + upload */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 mb-5">
              <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Unit Pendidikan</label>
                  <div className="flex flex-wrap gap-1.5">
                    {UNIT_KEYS.map(k => (
                      <button key={k} onClick={() => { setAlbumUnit(k); loadAlbum(k) }}
                        className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${albumUnit === k ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                        {UNIT_LABELS[k]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Keterangan (opsional)</label>
                  <input value={albumCaption} onChange={e => setAlbumCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: Kegiatan wisuda 2026" />
                </div>
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${albumUploading ? 'bg-gray-300 text-gray-500' : 'bg-emerald-700 hover:bg-emerald-800 text-white'}`}>
                  <Upload size={15} />
                  {albumUploading ? `Mengupload... ${albumProgress}%` : 'Upload Foto'}
                  <input type="file" accept="image/*,.heic,.heif" className="hidden" disabled={albumUploading} onChange={handleAlbumUpload} />
                </label>
              </div>
            </div>

            {/* Daftar foto */}
            {albumLoading ? (
              <div className="text-center py-16 text-gray-400">⏳ Memuat foto...</div>
            ) : albumPhotos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="font-bold text-gray-600 mb-1">Belum ada foto untuk {UNIT_LABELS[albumUnit]}</p>
                <p className="text-sm text-gray-400">Klik &quot;Upload Foto&quot; untuk menambahkan foto pertama.</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-3">{albumPhotos.length} foto di album <strong className="text-emerald-700">{UNIT_LABELS[albumUnit]}</strong></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {albumPhotos.map(p => (
                    <div key={p.id} className={`bg-white rounded-xl overflow-hidden group ${p.is_cover ? 'ring-2 ring-amber-400' : 'border border-gray-100'}`}>
                      <div className="relative aspect-square bg-gray-100">
                        <Image src={p.url} alt={p.caption ?? 'Foto album'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                        {p.is_cover && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-white text-[10px] font-bold flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Sampul
                          </span>
                        )}
                        <button onClick={() => setSampul(p.id)}
                          className={`absolute bottom-1.5 left-1.5 p-1.5 rounded-md transition-colors ${p.is_cover ? 'bg-white/20 text-white' : 'bg-black/50 hover:bg-amber-400 text-white opacity-0 group-hover:opacity-100'}`}
                          title={p.is_cover ? 'Sampul unit ini' : 'Jadikan sampul unit'}>
                          <Star size={13} fill={p.is_cover ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => hapusFoto(p.id)}
                          className="absolute bottom-1.5 right-1.5 p-1.5 rounded-md bg-red-500/90 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus foto">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs text-gray-500 line-clamp-1">{p.caption || <span className="text-gray-300">Tanpa keterangan</span>}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatTanggal(p.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEJARAH */}
        {tab === 'sejarah' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="flex-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Sejarah & Pencapaian</h1>
                <p className="text-gray-400 text-xs mt-0.5">Kelola timeline perjalanan yayasan beserta fotonya</p>
              </div>
              <button onClick={() => openSejarahForm()} className="self-start flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold no-underline transition-colors">
                <Plus size={14} /> Tambah Peristiwa
              </button>
            </div>

            {/* Form tambah/edit */}
            {sejarahFormOpen && (
              <form onSubmit={simpanSejarah} className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 mb-5">
                <h2 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Lora, serif' }}>
                  {sejarahEditId ? 'Edit Peristiwa' : 'Tambah Peristiwa Baru'}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tahun</label>
                    <input value={sejarahTahun} onChange={e => setSejarahTahun(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: 2006 atau 2023–Kini" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Urutan Tampil</label>
                    <input type="number" min={0} value={sejarahUrutan} onChange={e => setSejarahUrutan(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Contoh: 1, 2, 3..." />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Judul</label>
                  <input value={sejarahJudul} onChange={e => setSejarahJudul(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: Pendirian Yayasan" />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Deskripsi</label>
                  <textarea value={sejarahDeskripsi} onChange={e => setSejarahDeskripsi(e.target.value)} rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-y"
                    placeholder="Cerita singkat peristiwa ini..." />
                </div>

                {/* Foto */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Foto (opsional)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    {sejarahFotoPreview && !sejarahRemoveFoto ? (
                      <div className="flex items-center gap-3">
                        <img src={sejarahFotoPreview} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
                        {sejarahEditId && (
                          <button type="button" onClick={() => setSejarahRemoveFoto(true)}
                            className="text-xs font-semibold text-red-600 hover:underline">
                            Hapus foto
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-xs">
                        {sejarahRemoveFoto ? 'Foto dihapus' : 'Belum ada foto'}
                      </div>
                    )}
                    <label className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${sejarahFoto ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                      <Upload size={14} />
                      {sejarahFoto ? 'Ganti Foto' : 'Pilih Foto'}
                      <input type="file" accept="image/*,.heic,.heif" className="hidden" onChange={onSejarahFotoChange} />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">Format JPG/PNG/WebP/HEIC, maks 10MB. Foto HEIC dikonversi otomatis.</p>
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={sejarahSaving}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors">
                    <Save size={14} />
                    {sejarahSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button type="button" onClick={() => setSejarahFormOpen(false)}
                    className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* Daftar peristiwa */}
            {sejarahLoading ? (
              <div className="text-center py-16 text-gray-400">⏳ Memuat...</div>
            ) : sejarahList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <p className="text-4xl mb-3">🏛️</p>
                <p className="font-bold text-gray-600 mb-1">Belum ada catatan perjalanan</p>
                <p className="text-sm text-gray-400">Klik &quot;Tambah Peristiwa&quot; untuk mulai mengisi sejarah yayasan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sejarahList.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {s.foto_url ? (
                        <Image src={s.foto_url} alt={s.judul} width={80} height={56} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700">
                          <History size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{s.tahun}</span>
                        <span className="text-[10px] text-gray-300">Urutan {s.urutan}</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm mt-1 leading-snug">{s.judul}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{s.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => openSejarahForm(s)}
                        className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                        title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => hapusSejarah(s)}
                        className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                        title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl text-white text-sm font-semibold shadow-xl transition-all ${toastErr ? 'bg-red-600' : 'bg-emerald-800'}`}>
          {toast}
        </div>
      )}
    </div>
  )
}
