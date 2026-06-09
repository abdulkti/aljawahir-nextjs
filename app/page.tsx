import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WAFloat from '@/components/WAFloat'
import BeritaCard from '@/components/BeritaCard'
import KontakForm from '@/components/KontakForm'
import AnimatedCounter from '@/components/AnimatedCounter'
import { supabaseServer } from '@/lib/supabase'
import { Berita } from '@/types'

async function getBeritaTerbaru(): Promise<Berita[]> {
  try {
    const sb = supabaseServer()
    const { data } = await sb
      .from('berita')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const beritaList = await getBeritaTerbaru()

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-16 overflow-hidden bg-green-900">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-800" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            🌙 Yayasan Pendidikan Islam & Sosial
          </span>
          <p className="arabic text-yellow-300 text-2xl md:text-3xl leading-loose mb-2">
            اُدْعُ اِلٰى سَبِيْلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
          </p>
          <p className="text-white/50 text-sm italic mb-8">Q.S. An-Nahl: 125</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-2" style={{ fontFamily: 'Lora, serif' }}>
            Yayasan<br /><span className="text-yellow-400">Al Jawahir At Tarbawi</span>
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-widest mb-4">Deli Serdang, Sumatera Utara</p>
          <p className="text-white/65 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="#program" className="bg-yellow-400 text-green-900 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-yellow-300 transition-all hover:-translate-y-0.5 no-underline">
              Lihat Program Kami
            </Link>
            <Link href="#tentang" className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/5 transition-all no-underline">
              Tentang Yayasan
            </Link>
          </div>
        </div>

      </section>

      {/* ===== STATS ===== */}
      <div className="bg-green-800 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px">
          <div className="text-center py-4 px-2 border-r border-white/10">
            <AnimatedCounter value={20} suffix="+" />
            <div className="text-white/60 text-sm mt-1">Tahun Berdiri</div>
          </div>
          <div className="text-center py-4 px-2 border-r border-white/10">
            <AnimatedCounter value={4} />
            <div className="text-white/60 text-sm mt-1">Unit Pendidikan</div>
          </div>
          <div className="text-center py-4 px-2 border-r border-white/10">
            <AnimatedCounter value={500} suffix="+" />
            <div className="text-white/60 text-sm mt-1">Siswa</div>
          </div>
          <div className="text-center py-4 px-2">
            <AnimatedCounter value={60} suffix="+" />
            <div className="text-white/60 text-sm mt-1">Tenaga Pendidik</div>
          </div>
        </div>
      </div>

      {/* ===== TENTANG ===== */}
      <section id="tentang" className="py-20 px-6 bg-amber-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center overflow-hidden">
              <span className="arabic text-9xl text-white/10 select-none">التربية</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-2xl px-6 py-4 text-center shadow-xl">
              <div className="text-3xl font-bold text-green-900" style={{ fontFamily: 'Lora, serif' }}>2006</div>
              <div className="text-xs font-bold text-green-800 mt-1">17 Oktober 2006</div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-green-700 block mb-3">Tentang Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-snug" style={{ fontFamily: 'Lora, serif' }}>
              Mendidik dengan Ilmu, <span className="text-green-700">Membina dengan Akhlak</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Yayasan Aljawahir Attarbawi merupakan lembaga nirlaba yang bergerak di bidang pendidikan, sosial, dan dakwah Islam. Yayasan didirikan atas kepedulian terhadap pentingnya pendidikan berkualitas yang mampu membentuk generasi berilmu, berakhlak, mandiri dan memiliki kepedulian sosial.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              Yayasan hadir sebagai pusat pembinaan pendidikan yang mengintegrasikan ilmu pengetahuan, teknologi, dan nilai-nilai Islam dalam proses pembelajaran. Dengan semangat <strong>"Mendidik dengan Ilmu dan Membina dengan Akhlak,"</strong> yayasan terus berupaya memberikan kontribusi nyata bagi masyarakat dan pembangunan bangsa.
            </p>
            <div className="border-l-4 border-green-600 pl-4 bg-white rounded-r-xl py-3 pr-4 mb-4">
              <strong className="block text-green-800 font-bold text-sm mb-1">Visi</strong>
              <p className="text-gray-600 text-sm leading-relaxed">Lembaga Terdepan dalam Membangun, Membina, dan Melayani Masyarakat melalui Pendidikan, Dakwah, dan Sosial.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4 bg-white rounded-r-xl py-3 pr-4">
              <strong className="block text-green-800 font-bold text-sm mb-1">Misi</strong>
              <ul className="text-gray-600 text-sm leading-relaxed list-disc pl-4 space-y-2 mt-1">
                <li><strong>Pendidikan Unggul:</strong> Menyelenggarakan dan mengembangkan lembaga pendidikan unggul yang berfokus pada karakter Qur&rsquo;ani, unggul, mandiri dan memiliki jiwa kepemimpinan.</li>
                <li><strong>Dakwah Berkelanjutan:</strong> Mengembangkan model dakwah rahmatan lil &lsquo;aalamiin yang berkelanjutan, inklusif, dan mempersatukan masyarakat.</li>
                <li><strong>Sosial Kemasyarakatan:</strong> Menyelenggarakan aktivitas sosial yang berdampak nyata serta memberikan kesempatan berkarya bagi masyarakat sekitar.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <div className="bg-green-50 py-16 px-6 text-center">
        <p className="arabic text-green-800 text-2xl md:text-3xl leading-loose max-w-2xl mx-auto mb-3">
          "وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ"
        </p>
        <p className="italic text-gray-500 text-base max-w-xl mx-auto mb-2" style={{ fontFamily: 'Lora, serif' }}>
          "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."
        </p>
        <span className="text-sm font-bold text-green-700 tracking-wide">HR. Muslim</span>
      </div>

      {/* ===== PROGRAM ===== */}
      <section id="program" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-green-700 block mb-3">Program Pendidikan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Unit <span className="text-green-700">Pendidikan Kami</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Empat unit pendidikan Islam terpadu untuk membangun generasi Qurani dan berkarakter.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { ar: 'روضة', icon: '🌙', tag: 'TK / RA', title: 'RA Al Jawahir', desc: 'Pendidikan anak usia dini berbasis Islam yang menanamkan nilai tauhid dan kecintaan Al-Quran sejak dini.', meta: ['🎓 Usia 4–6 Tahun', '📍 Sunggal'] },
              { ar: 'اقرأ', icon: '📖', tag: 'SD IT', title: 'SD IT Al Jawahir', desc: 'Sekolah Dasar Islam Terpadu yang mengintegrasikan kurikulum nasional dengan pendidikan Al-Quran dan akhlak Islami.', meta: ['📚 Kurikulum Merdeka', '📍 Sunggal'] },
              { ar: 'مدرسة', icon: '🎓', tag: 'SMP IT', title: 'SMP IT Al Jawahir', desc: 'Sekolah Menengah Pertama Islam Terpadu, Sekolah Penggerak Angkatan I dengan Kurikulum Merdeka sejak 2021.', meta: ['🏅 Sekolah Penggerak', '📚 Kurikulum Merdeka'] },
              { ar: 'تحفيظ', icon: '🕌', tag: 'TPA', title: 'Taman Pendidikan Al-Quran', desc: 'Program hafalan dan pembelajaran Al-Quran yang terstruktur untuk membentuk generasi Qurani yang berkarakter.', meta: ['🌙 Semua Jenjang', '⏰ Full Day'] },
            ].map((p, i) => (
              <div key={i} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white">
                <div className="h-44 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")" }} />
                  <div className="relative flex flex-col items-center gap-2">
                    <span className="text-4xl">{p.icon}</span>
                    <span className="arabic text-3xl text-white/30">{p.ar}</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-green-700 bg-green-50 px-3 py-1 rounded-full">{p.tag}</span>
                  <h3 className="font-bold text-gray-800 text-lg mt-3 mb-2 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">{p.meta.map(m => <span key={m} className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full">{m}</span>)}</div>
                  <Link href="#kontak" className="text-sm font-bold text-green-700 no-underline inline-flex items-center gap-2 hover:gap-3 transition-all group/link">
                    Informasi Pendaftaran <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEJARAH ===== */}
      <section id="sejarah" className="py-20 px-6 bg-green-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-yellow-300 block mb-3">Perjalanan Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Sejarah & <span className="text-yellow-400">Pencapaian</span>
            </h2>
            <p className="text-white/60 leading-relaxed">Dari mimpi kecil menjadi lembaga yang terus berkembang dan berdampak nyata.</p>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 via-green-400 to-transparent" />
            {[
              { year: '2006', title: 'Pendirian Yayasan', desc: 'Yayasan Al Jawahir At Tarbawi resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang.' },
              { year: '2021', title: 'Sekolah Penggerak Angkatan I', desc: 'Ditunjuk sebagai Sekolah Penggerak dan mulai mengimplementasikan Kurikulum Merdeka secara penuh.' },
              { year: '2022', title: 'Menamatkan Angkatan Pertama', desc: 'Dengan bangga menamatkan angkatan pertama lulusan SMP IT Al Jawahir.' },
              { year: '2023–Kini', title: 'Terus Berkembang & Berinovasi', desc: 'Yayasan terus memperluas layanan dan memperkuat kualitas sumber daya manusia.' },
            ].map((t, i) => (
              <div key={i} className="relative pb-10 last:pb-0">
                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-yellow-400 border-4 border-green-900 shadow-[0_0_0_3px_#f59e0b]" />
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-1">{t.year}</p>
                <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Lora, serif' }}>{t.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BERITA ===== */}
      <section id="berita" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-green-700 block mb-3">Berita & Artikel</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800" style={{ fontFamily: 'Lora, serif' }}>
                Kabar Terkini dari <span className="text-green-700">Yayasan</span>
              </h2>
            </div>
            <Link href="/berita" className="text-sm font-bold text-green-700 no-underline hover:underline">Lihat Semua →</Link>
          </div>
          {beritaList.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl text-gray-400">
              <p className="text-4xl mb-3">📰</p>
              <p className="font-bold mb-1">Belum ada berita</p>
              <p className="text-sm">Masuk ke <Link href="/admin" className="text-green-700">panel admin</Link> untuk menambah berita pertama.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {beritaList.map(b => <BeritaCard key={b.id} berita={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== KONTAK ===== */}
      <section id="kontak" className="py-20 px-6 bg-amber-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-green-700 block mb-3">Hubungi Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Bergabunglah Bersama <span className="text-green-700">Kami</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">Kami siap membantu Anda mendapatkan informasi lebih lanjut mengenai program pendidikan dan kegiatan yayasan.</p>
            {[
              { icon: '📍', title: 'Alamat', val: 'Jl. Aman, Sunggal, Kecamatan Sunggal, Kabupaten Deli Serdang, Sumatera Utara' },
              { icon: '📞', title: 'RA Al Jawahir', val: '+62 812-XXXX-XXXX' },
              { icon: '📞', title: 'SD IT Al Jawahir', val: '+62 812-XXXX-XXXX' },
              { icon: '📞', title: 'SMP IT Al Jawahir', val: '+62 812-XXXX-XXXX' },
              { icon: '📞', title: 'TPA Al Jawahir', val: '+62 812-XXXX-XXXX' },
              { icon: '📧', title: 'Email', val: 'info@aljawahirattarbawi.sch.id' },
              { icon: '⏰', title: 'Jam Operasional', val: 'Senin–Jumat: 07.30–15.30 WIB' },
            ].map(c => (
              <div key={c.title} className="flex gap-4 items-start mb-5">
                <div className="w-11 h-11 rounded-xl bg-green-900 flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-1">{c.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 shadow-lg shadow-green-900/5 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#166534">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-xl" style={{ fontFamily: 'Lora, serif' }}>Chat WhatsApp</h3>
              </div>
              <KontakForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WAFloat />
    </>
  )
}
