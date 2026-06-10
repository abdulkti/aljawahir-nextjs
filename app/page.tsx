import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WAFloat from '@/components/WAFloat'
import BeritaCard from '@/components/BeritaCard'
import KontakForm from '@/components/KontakForm'
import AnimatedCounter from '@/components/AnimatedCounter'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { supabaseServer } from '@/lib/supabase'
import { Berita } from '@/types'

export const dynamic = 'force-dynamic'

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
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-800 animate-gradient" />
        <div className="absolute inset-0 pattern-islamic opacity-60" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-400/5 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-emerald-400/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="arabic text-[16rem] md:text-[24rem] font-bold text-white/[0.03] leading-none tracking-tight">
            الجواهر
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-soft" />
            Al Jawahir Islamic School
          </div>

          <p className="arabic text-yellow-300/90 text-2xl md:text-3xl leading-loose mb-2 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            اُدْعُ اِلٰى سَبِيْلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
          </p>
          <p className="text-white/40 text-sm italic mb-10 animate-fade-in" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            Q.S. An-Nahl: 125
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in-up" style={{ fontFamily: 'Lora, serif', animationDelay: '0.35s', animationFillMode: 'both' }}>
            Yayasan<br />
            <span className="text-gradient">Al Jawahir At Tarbawi</span>
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-[0.2em] mb-2 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            Deli Serdang, Sumatera Utara
          </p>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up" style={{ animationDelay: '0.75s', animationFillMode: 'both' }}>
            <Link href="#program" className="group relative bg-gradient-to-r from-yellow-400 to-amber-400 text-green-950 px-8 py-3.5 rounded-xl font-bold text-base hover:from-yellow-300 hover:to-amber-300 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-400/20 no-underline overflow-hidden">
              <span className="relative z-10">Lihat Program Kami</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
            <Link href="#tentang" className="glass-dark text-white/90 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5 no-underline">
              Tentang Yayasan
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-white/30 text-xs tracking-widest uppercase text-[10px]">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-yellow-400/60 to-transparent" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <div className="relative -mt-12 z-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/10 backdrop-blur-xl border border-white/10">
            <div className="bg-green-900/80 backdrop-blur-sm text-center py-6 px-2">
              <AnimatedCounter value={20} suffix="+" />
              <div className="text-white/50 text-sm mt-1">Tahun Berdiri</div>
            </div>
            <div className="bg-green-900/80 backdrop-blur-sm text-center py-6 px-2">
              <AnimatedCounter value={4} />
              <div className="text-white/50 text-sm mt-1">Unit Pendidikan</div>
            </div>
            <div className="bg-green-900/80 backdrop-blur-sm text-center py-6 px-2">
              <AnimatedCounter value={500} suffix="+" />
              <div className="text-white/50 text-sm mt-1">Siswa</div>
            </div>
            <div className="bg-green-900/80 backdrop-blur-sm text-center py-6 px-2">
              <AnimatedCounter value={60} suffix="+" />
              <div className="text-white/50 text-sm mt-1">Tenaga Pendidik</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TENTANG ===== */}
      <section id="tentang" className="pt-28 pb-20 px-6 bg-amber-50/80">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimateOnScroll>
            <div className="relative">
              <div className="w-full aspect-[4/5] rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center overflow-hidden shadow-2xl shadow-green-900/20">
                <div className="absolute inset-0 pattern-geometric opacity-40" />
                <span className="arabic text-[8rem] md:text-[10rem] font-bold text-white/[0.06] select-none leading-none">التربية</span>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl px-8 py-5 text-center shadow-2xl hover:-translate-y-1 transition-transform">
                <div className="text-3xl font-bold text-green-950" style={{ fontFamily: 'Lora, serif' }}>2006</div>
                <div className="text-xs font-bold text-green-900/70 mt-1">17 Oktober 2006</div>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={1}>
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-green-700" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Tentang Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                Mendidik dengan Ilmu,<br />
                <span className="text-green-700">Membina dengan Akhlak</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Yayasan Aljawahir Attarbawi merupakan lembaga nirlaba yang bergerak di bidang pendidikan, sosial, dan dakwah Islam. Yayasan didirikan atas kepedulian terhadap pentingnya pendidikan berkualitas yang mampu membentuk generasi berilmu, berakhlak, mandiri dan memiliki kepedulian sosial.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Yayasan hadir sebagai pusat pembinaan pendidikan yang mengintegrasikan ilmu pengetahuan, teknologi, dan nilai-nilai Islam dalam proses pembelajaran. Dengan semangat <strong>"Mendidik dengan Ilmu dan Membina dengan Akhlak,"</strong> yayasan terus berupaya memberikan kontribusi nyata bagi masyarakat dan pembangunan bangsa.
              </p>
              <div className="border-l-4 border-green-600 pl-4 bg-white rounded-r-xl py-3 pr-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
                <strong className="block text-green-800 font-bold text-sm mb-1">Visi</strong>
                <p className="text-gray-600 text-sm leading-relaxed">Lembaga Terdepan dalam Membangun, Membina, dan Melayani Masyarakat melalui Pendidikan, Dakwah, dan Sosial.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 bg-white rounded-r-xl py-3 pr-4 shadow-sm hover:shadow-md transition-shadow">
                <strong className="block text-green-800 font-bold text-sm mb-1">Misi</strong>
                <ul className="text-gray-600 text-sm leading-relaxed list-disc pl-4 space-y-2 mt-1">
                  <li><strong>Pendidikan Unggul:</strong> Menyelenggarakan dan mengembangkan lembaga pendidikan unggul yang berfokus pada karakter Qur&rsquo;ani, unggul, mandiri dan memiliki jiwa kepemimpinan.</li>
                  <li><strong>Dakwah Berkelanjutan:</strong> Mengembangkan model dakwah rahmatan lil &lsquo;aalamiin yang berkelanjutan, inklusif, dan mempersatukan masyarakat.</li>
                  <li><strong>Sosial Kemasyarakatan:</strong> Menyelenggarakan aktivitas sosial yang berdampak nyata serta memberikan kesempatan berkarya bagi masyarakat sekitar.</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <AnimateOnScroll>
        <div className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-900 to-green-950" />
          <div className="absolute inset-0 pattern-islamic opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-yellow-400/5 rounded-full blur-[100px]" />
          <div className="relative max-w-2xl mx-auto text-center">
            <p className="arabic text-yellow-200/90 text-2xl md:text-3xl leading-loose mb-4">
              "وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ"
            </p>
            <div className="w-12 h-px bg-yellow-400/30 mx-auto mb-4" />
            <p className="italic text-white/50 text-base max-w-xl mx-auto mb-2" style={{ fontFamily: 'Lora, serif' }}>
              "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."
            </p>
            <span className="text-sm font-bold text-yellow-300/70 tracking-wide">— HR. Muslim</span>
          </div>
        </div>
      </AnimateOnScroll>

      {/* ===== PROGRAM ===== */}
      <section id="program" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-green-700" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Program Pendidikan</span>
                <span className="h-px w-8 bg-green-700" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Lora, serif' }}>
                Unit <span className="text-green-700">Pendidikan Kami</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">Empat unit pendidikan Islam terpadu untuk membangun generasi Qurani dan berkarakter.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { ar: 'روضة', icon: '🌙', tag: 'TK / RA', title: 'RA Al Jawahir', desc: 'Pendidikan anak usia dini berbasis Islam yang menanamkan nilai tauhid dan kecintaan Al-Quran sejak dini.', meta: ['🎓 Usia 4–6 Tahun', '📍 Sunggal'] },
              { ar: 'اقرأ', icon: '📖', tag: 'SD IT', title: 'SD IT Al Jawahir', desc: 'Sekolah Dasar Islam Terpadu yang mengintegrasikan kurikulum nasional dengan pendidikan Al-Quran dan akhlak Islami.', meta: ['📚 Kurikulum Merdeka', '📍 Sunggal'] },
              { ar: 'مدرسة', icon: '🎓', tag: 'SMP IT', title: 'SMP IT Al Jawahir', desc: 'Sekolah Menengah Pertama Islam Terpadu, Sekolah Penggerak Angkatan I dengan Kurikulum Merdeka sejak 2021.', meta: ['🏅 Sekolah Penggerak', '📚 Kurikulum Merdeka'] },
              { ar: 'تحفيظ', icon: '🕌', tag: 'TPA', title: 'Taman Pendidikan Al-Quran', desc: 'Program hafalan dan pembelajaran Al-Quran yang terstruktur untuk membentuk generasi Qurani yang berkarakter.', meta: ['🌙 Semua Jenjang', '⏰ Full Day'] },
            ].map((p, i) => (
              <AnimateOnScroll key={i} delay={(i + 1) as 0 | 1 | 2 | 3 | 4}>
                <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200/50 hover-lift shadow-sm hover:shadow-xl">
                  <div className="h-48 bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 pattern-geometric opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col items-center gap-3 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-5xl filter drop-shadow-lg">{p.icon}</span>
                      <span className="arabic text-3xl text-white/[0.15]">{p.ar}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-full group-hover:bg-green-100 transition-colors">{p.tag}</span>
                    <h3 className="font-bold text-gray-800 text-lg mt-4 mb-2 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.meta.map(m => (
                        <span key={m} className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full group-hover:bg-green-50 group-hover:text-green-600 transition-colors">{m}</span>
                      ))}
                    </div>
                    <Link href="#kontak" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 no-underline group/link hover:gap-3 transition-all">
                      Informasi Pendaftaran
                      <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEJARAH ===== */}
      <section id="sejarah" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-900 to-green-950" />
        <div className="absolute inset-0 pattern-islamic opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto relative">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-yellow-400/50" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-yellow-300">Perjalanan Kami</span>
                <span className="h-px w-8 bg-yellow-400/50" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
                Sejarah & <span className="text-yellow-400">Pencapaian</span>
              </h2>
              <p className="text-white/40 max-w-lg mx-auto">Dari mimpi kecil menjadi lembaga yang terus berkembang dan berdampak nyata.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <AnimateOnScroll delay={1}>
              <div className="space-y-10">
                {[
                  { year: '2006', title: 'Pendirian Yayasan', desc: 'Yayasan Al Jawahir At Tarbawi resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang.' },
                  { year: '2021', title: 'Sekolah Penggerak', desc: 'Ditunjuk sebagai Sekolah Penggerak dan mulai mengimplementasikan Kurikulum Merdeka secara penuh.' },
                ].map((t, i) => (
                  <div key={i} className="relative pl-8 group">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-yellow-400 border-[3px] border-green-900 shadow-[0_0_0_3px_rgba(250,204,21,0.3)] group-hover:scale-125 transition-transform" />
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-300/70 mb-1">{t.year}</p>
                    <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Lora, serif' }}>{t.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={2}>
              <div className="space-y-10 pt-0 md:pt-14">
                {[
                  { year: '2022', title: 'Angkatan Pertama', desc: 'Dengan bangga menamatkan angkatan pertama lulusan SMP IT Al Jawahir.' },
                  { year: '2023–Kini', title: 'Berkembang & Berinovasi', desc: 'Yayasan terus memperluas layanan dan memperkuat kualitas sumber daya manusia.' },
                ].map((t, i) => (
                  <div key={i} className="relative pl-8 group">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-yellow-400 border-[3px] border-green-900 shadow-[0_0_0_3px_rgba(250,204,21,0.3)] group-hover:scale-125 transition-transform" />
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-300/70 mb-1">{t.year}</p>
                    <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Lora, serif' }}>{t.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ===== BERITA ===== */}
      <section id="berita" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="flex justify-between items-end flex-wrap gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-green-700" />
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Berita & Artikel</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Lora, serif' }}>
                  Kabar Terkini dari <span className="text-green-700">Yayasan</span>
                </h2>
              </div>
              <Link href="/berita" className="group inline-flex items-center gap-2 text-sm font-bold text-green-700 no-underline hover:gap-3 transition-all">
                Lihat Semua
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </AnimateOnScroll>
          {beritaList.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl text-gray-400 border border-gray-100">
              <p className="text-5xl mb-4">📰</p>
              <p className="font-bold mb-1">Belum ada berita</p>
              <p className="text-sm">Masuk ke <Link href="/admin" className="text-green-700 font-bold">panel admin</Link> untuk menambah berita pertama.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {beritaList.map((b, i) => (
                <AnimateOnScroll key={b.id} delay={(i + 1) as 0 | 1 | 2 | 3 | 4}>
                  <BeritaCard berita={b} />
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== KONTAK ===== */}
      <section id="kontak" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-white" />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-900/5 to-transparent" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/5 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 relative">
          <AnimateOnScroll>
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-green-700" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Hubungi Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                Bergabunglah Bersama <span className="text-green-700">Kami</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-10">Kami siap membantu Anda mendapatkan informasi lebih lanjut mengenai program pendidikan dan kegiatan yayasan.</p>
              <div className="space-y-5">
                {[
                  { icon: '📍', title: 'Alamat', val: 'Jl. Aman, Sunggal, Kecamatan Sunggal, Kabupaten Deli Serdang, Sumatera Utara' },
                  { icon: '📷', title: 'Instagram', val: '@aljawahir_islamic_school', href: 'https://instagram.com/aljawahir_islamic_school' },
                  { icon: '📧', title: 'Email', val: 'info@aljawahirattarbawi.sch.id', href: 'mailto:info@aljawahirattarbawi.sch.id' },
                  { icon: '⏰', title: 'Jam Operasional', val: 'Senin–Jumat: 07.30–15.30 WIB' },
                ].map((c) => (
                  <div key={c.title} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-green-900 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-green-800 group-hover:scale-105 transition-all shadow-lg shadow-green-900/10">
                      {c.icon}
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-green-700 mb-0.5">{c.title}</p>
                      {'href' in c && c.href ? (
                        <a href={c.href!} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm leading-relaxed hover:text-green-700 transition-colors">
                          {c.val}
                        </a>
                      ) : (
                        <p className="text-gray-600 text-sm leading-relaxed">{c.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={2}>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-900/5 flex flex-col justify-center relative overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#166534">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-800 text-xl" style={{ fontFamily: 'Lora, serif' }}>Chat WhatsApp</h3>
                </div>
                <KontakForm />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <Footer />
      <WAFloat />
    </>
  )
}
