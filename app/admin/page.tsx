'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { formatTanggal } from '@/lib/utils'
import { adminHeaders } from '@/lib/admin-headers'
import { Berita, AlbumFoto, UNIT_KEYS, UNIT_LABELS, UnitKey } from '@/types'
import { LayoutDashboard, Newspaper, PenSquare, Settings, LogOut, Plus, Pencil, Trash2, Eye, EyeOff, Menu, X, Images, Upload, Star } from 'lucide-react'

type Tab = 'dashboard' | 'berita' | 'album'

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
  const [albumCaption, setAlbumCaption] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('admin_token')) {
      setAuthed(true)
      loadBerita()
    }
  }, [])

  async function loadAlbum(unit: UnitKey = albumUnit) {
    setAlbumLoading(true)
    const { data } = await supabase.from('album_foto').select('*').eq('unit', unit).order('created_at', { ascending: false })
    setAlbumPhotos(data ?? [])
    setAlbumLoading(false)
  }

  async function handleAlbumUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { showToast('Ukuran gambar maks 10MB!', true); return }
    setAlbumUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('unit', albumUnit)
    form.append('caption', albumCaption)
    const res = await fetch('/api/album', { method: 'POST', headers: adminHeaders(), body: form })
    const json = await res.json()
    setAlbumUploading(false)
    if (!res.ok) { showToast('Gagal upload: ' + json.error, true); return }
    setAlbumCaption('')
    showToast('✅ Foto berhasil ditambahkan!')
    loadAlbum()
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
    const { data } = await supabase.from('berita').select('*').order('created_at', { ascending: false })
    setBeritaList(data ?? [])
    setLoading(false)
  }

  function showToast(msg: string, err = false) {
    setToast(msg); setToastErr(err)
    setTimeout(() => setToast(''), 3500)
  }

  async function togglePublish(id: string, current: boolean) {
    const { error } = await supabase.from('berita').update({ published: !current }).eq('id', id)
    if (error) { showToast('Gagal mengubah status.', true); return }
    showToast(current ? '📝 Disimpan sebagai draft.' : '✅ Berhasil dipublikasikan!')
    loadBerita()
  }

  async function hapus(id: string, judul: string) {
    if (!confirm(`Hapus berita "${judul}"? Tidak bisa dibatalkan.`)) return
    const { error } = await supabase.from('berita').delete().eq('id', id)
    if (error) { showToast('Gagal menghapus.', true); return }
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
    <div className="min-h-screen bg-gray-50">

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-emerald-950 px-4 h-14 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-white text-xs font-bold leading-tight">Al Jawahir At Tarbawi</p>
            <p className="text-amber-300 text-[10px]">Admin Panel</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/80 hover:text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Backdrop mobile */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-56 bg-emerald-950 flex-col transition-transform duration-200 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-9 h-9 object-contain" />
            <div>
              <p className="text-white text-xs font-bold leading-tight">Al Jawahir At Tarbawi</p>
              <p className="text-amber-300 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'berita', label: 'Daftar Berita', icon: Newspaper },
            { id: 'album', label: 'Album Foto', icon: Images },
          ] as const).map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setMobileOpen(false); if (item.id === 'album') loadAlbum() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-colors ${tab === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          <Link href="/admin/tulis" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 text-white/60 hover:text-white hover:bg-white/8 no-underline transition-colors">
            <PenSquare size={16} />
            Tulis Berita
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 no-underline transition-colors mb-1">
            <Eye size={16} />
            Lihat Website
          </Link>
          <button onClick={doLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pt-14 md:pt-0 md:ml-56 flex-1 p-4 md:p-8">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Selamat datang di panel admin yayasan</p>
              </div>
              <Link href="/admin/tulis" className="self-start flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-colors">
                <Plus size={16} /> <span className="hidden xs:inline">Tulis Berita Baru</span><span className="xs:hidden">Baru</span>
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8">
              {[
                { label: 'Total Berita', value: beritaList.length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                { label: 'Dipublikasikan', value: published.length, color: 'text-blue-700', bg: 'bg-blue-50' },
                { label: 'Draft', value: drafts.length, color: 'text-amber-700', bg: 'bg-amber-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 md:p-6 border border-white`}>
                  <div className={`text-2xl md:text-4xl font-bold ${s.color} mb-1`} style={{ fontFamily: 'Lora, serif' }}>{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Terbaru */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
              <h2 className="font-bold text-gray-800 text-base md:text-lg mb-4" style={{ fontFamily: 'Lora, serif' }}>Berita Terbaru</h2>
              {beritaList.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-12 h-10 rounded-lg bg-emerald-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={48} height={40} className="object-cover w-full h-full" /> : <span className="text-lg">📰</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{b.judul}</p>
                    <p className="text-xs text-gray-400">{b.kategori} · {formatTanggal(b.created_at)}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.published ? 'Publik' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAFTAR BERITA */}
        {tab === 'berita' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              <h1 className="flex-1 text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Daftar Berita</h1>
              <Link href="/admin/tulis" className="self-start flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-colors">
                <Plus size={16} /> <span className="hidden xs:inline">Tulis Berita Baru</span><span className="xs:hidden">Baru</span>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-20 text-gray-400">⏳ Memuat...</div>
            ) : beritaList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-4xl mb-3">📰</p>
                <p className="font-bold text-gray-600 mb-1">Belum ada berita</p>
                <Link href="/admin/tulis" className="text-sm text-emerald-700 no-underline hover:underline">Tulis berita pertama →</Link>
              </div>
            ) : (<>
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Berita</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Kategori</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beritaList.map(b => (
                      <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg bg-emerald-50 flex-shrink-0 overflow-hidden">
                              {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={48} height={40} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-lg">📰</div>}
                            </div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-xs">{b.judul}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{b.kategori}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {b.published ? '✅ Publik' : '📝 Draft'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-400">{formatTanggal(b.created_at)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => togglePublish(b.id, b.published)} title={b.published ? 'Jadikan Draft' : 'Publikasikan'}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-emerald-700 transition-colors">
                              {b.published ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <Link href={`/admin/edit/${b.id}`} className="p-2 rounded-lg hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 transition-colors no-underline">
                              <Pencil size={15} />
                            </Link>
                            <button onClick={() => hapus(b.id, b.judul)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                              <Trash2 size={15} />
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
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-10 rounded-lg bg-emerald-50 flex-shrink-0 overflow-hidden mt-0.5">
                        {b.cover_url ? <Image src={b.cover_url} alt={b.judul} width={48} height={40} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-lg">📰</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{b.judul}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{b.kategori}</span>
                          <span className="text-gray-300">·</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {b.published ? 'Publik' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{formatTanggal(b.created_at)}</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>Album Foto</h1>
                <p className="text-gray-400 text-sm mt-1">Upload dan kelola foto album setiap unit pendidikan</p>
              </div>
            </div>

            {/* Pilih unit + upload */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Unit Pendidikan</label>
                  <div className="flex flex-wrap gap-2">
                    {UNIT_KEYS.map(k => (
                      <button key={k} onClick={() => { setAlbumUnit(k); loadAlbum(k) }}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${albumUnit === k ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                        {UNIT_LABELS[k]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Keterangan (opsional)</label>
                  <input value={albumCaption} onChange={e => setAlbumCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: Kegiatan wisuda 2026" />
                </div>
                <label className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${albumUploading ? 'bg-gray-300 text-gray-500' : 'bg-emerald-700 hover:bg-emerald-800 text-white'}`}>
                  <Upload size={16} />
                  {albumUploading ? 'Mengupload...' : 'Upload Foto'}
                  <input type="file" accept="image/*" className="hidden" disabled={albumUploading} onChange={handleAlbumUpload} />
                </label>
              </div>
            </div>

            {/* Daftar foto */}
            {albumLoading ? (
              <div className="text-center py-16 text-gray-400">⏳ Memuat foto...</div>
            ) : albumPhotos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="font-bold text-gray-600 mb-1">Belum ada foto untuk {UNIT_LABELS[albumUnit]}</p>
                <p className="text-sm text-gray-400">Klik &quot;Upload Foto&quot; untuk menambahkan foto pertama.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">{albumPhotos.length} foto di album {UNIT_LABELS[albumUnit]}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albumPhotos.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group">
                      <div className="relative aspect-square bg-gray-100">
                        <Image src={p.url} alt={p.caption ?? 'Foto album'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                        <button onClick={() => setSampul(p.id)}
                          className={`absolute top-2 left-2 p-2 rounded-lg transition-colors ${p.is_cover ? 'bg-amber-400 text-white' : 'bg-black/50 hover:bg-amber-400 text-white'}`}
                          title={p.is_cover ? 'Sampul unit ini' : 'Jadikan sampul unit'}>
                          <Star size={14} fill={p.is_cover ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => hapusFoto(p.id)}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus foto">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-3">
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
