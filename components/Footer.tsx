import Link from 'next/link'
import { navLinks } from '@/lib/navigation'

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white/60 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-10 h-10 object-contain rounded-full" />
              <span className="text-white font-bold text-sm">Al Jawahir At Tarbawi</span>
            </div>
            <p className="text-sm leading-7 mb-3">
              Al Jawahir Islamic School — Islamic educational institution yang berkomitmen membangun generasi Qurani di Deli Serdang, Sumatera Utara.
            </p>
            <p className="arabic text-amber-300 text-base mb-4">&quot;الجواهر التربوي&quot;</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/aljawahir_islamic_school" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-amber-400/20 hover:text-amber-300 transition-all" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Program</h4>
            <ul className="space-y-2.5 list-none p-0">
              {[
                ['Raudhatul Athfal (RA)', '/#program'],
                ['SD IT Al Jawahir', '/#program'],
                ['SMP IT Al Jawahir', '/#program'],
                ['Taman Pendidikan Al-Quran', '/#program'],
              ].map(([l, h], i) => (
                <li key={i}><Link href={h} className="text-sm text-white/55 hover:text-amber-300 transition-colors no-underline">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Tautan</h4>
            <ul className="space-y-2.5 list-none p-0">
              {navLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="text-sm text-white/55 hover:text-amber-300 transition-colors no-underline">{l.fullLabel ?? l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Kontak</h4>
            <ul className="space-y-3 list-none p-0">
              <li className="flex gap-3 text-sm">
                <span className="text-amber-300/70 mt-0.5 shrink-0">📍</span>
                <span className="text-white/55">Jl. Aman, Sunggal, Deli Serdang, Sumatera Utara</span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-amber-300/70 mt-0.5 shrink-0">📷</span>
                <a href="https://instagram.com/aljawahir_islamic_school" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-amber-300 transition-colors no-underline">@aljawahir_islamic_school</a>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-amber-300/70 mt-0.5 shrink-0">📧</span>
                <a href="mailto:info@aljawahirattarbawi.sch.id" className="text-white/55 hover:text-amber-300 transition-colors no-underline">info@aljawahirattarbawi.sch.id</a>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-amber-300/70 mt-0.5 shrink-0">⏰</span>
                <span className="text-white/55">Sen–Jum 07:30–15:30 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs">© {new Date().getFullYear()} <strong className="text-amber-300">Yayasan Al Jawahir At Tarbawi</strong>. All rights reserved.</p>
          <p className="arabic text-amber-300 text-base">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      </div>
    </footer>
  )
}
