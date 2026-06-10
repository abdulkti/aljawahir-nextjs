import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white/60 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-green-900 font-bold" style={{ fontFamily: 'Amiri, serif' }}>
                الج
              </div>
              <span className="text-white font-bold text-sm">Al Jawahir At Tarbawi</span>
            </div>
            <p className="text-sm leading-7 mb-3">
              Al Jawahir Islamic School — Islamic educational institution yang berkomitmen membangun generasi Qurani di Deli Serdang, Sumatera Utara.
            </p>
            <p className="arabic text-yellow-300 text-base">"الجواهر التربية"</p>
          </div>

          {/* Program */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Program</h4>
            <ul className="space-y-2 list-none p-0">
              {['Raudhatul Athfal (RA)', 'SMP IT Al Jawahir', 'Tahfizh Al-Quran', 'Program Sosial'].map(i => (
                <li key={i}><Link href="/#program" className="text-sm text-white/55 hover:text-yellow-300 transition-colors no-underline">{i}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Informasi</h4>
            <ul className="space-y-2 list-none p-0">
              {[['Tentang Kami', '/#tentang'], ['Berita & Artikel', '/berita'], ['Kontak', '/#kontak']].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-sm text-white/55 hover:text-yellow-300 transition-colors no-underline">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs">© {new Date().getFullYear()} <strong className="text-yellow-300">Yayasan Al Jawahir At Tarbawi</strong>. Semua hak dilindungi.</p>
          <p className="arabic text-yellow-300 text-base">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      </div>
    </footer>
  )
}
