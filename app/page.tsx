import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

const layananCards = [
  {
    icon: '📚',
    tag: 'Pendidikan',
    title: 'Pendidikan Islam Terpadu',
    desc: 'Menyelenggarakan pendidikan formal dari RA, SD IT, hingga SMP IT dengan kurikulum nasional dan nilai-nilai Al-Quran yang terintegrasi dalam setiap aspek pembelajaran.',
  },
  {
    icon: '🤝',
    tag: 'Sosial & Dakwah',
    title: 'Pemberdayaan Masyarakat',
    desc: 'Aktif dalam kegiatan sosial dan dakwah melalui program pemberdayaan masyarakat, pengajian, serta pembinaan karakter Islami untuk sekitar.',
  },
  {
    icon: '🌿',
    tag: 'Pembinaan',
    title: 'Generasi Qurani',
    desc: 'Program tahfizh dan tahsin Al-Quran yang terstruktur untuk membentuk generasi penghafal Al-Quran yang berakhlak mulia dan berkarakter pemimpin.',
  },
]

const strukturOrganisasi = [
  { label: 'Pembina', orang: [
    { nama: 'H. Syafril Usman, SPd.I', inisial: 'SU' },
    { nama: 'Hj. Jawahir', inisial: 'HJ' },
    { nama: 'Muhammad Ihsan', inisial: 'MI' },
  ]},
  { label: 'Pengawas', orang: [
    { nama: 'Muhammad Sulfan Irvan, SE', inisial: 'SI' },
    { nama: 'Ir. Anda Zulfan, MM', inisial: 'AZ' },
  ]},
  { label: 'Ketua Yayasan', orang: [
    { nama: 'Dr. Zulheddi, MA', inisial: 'ZH' },
  ], single: true },
  { label: 'Sekretaris', orang: [
    { nama: 'Khairati Sawitri', inisial: 'KS' },
  ], single: true },
  { label: 'Bendahara', orang: [
    { nama: 'Khairunnisah, SE', inisial: 'KN' },
  ], single: true },
]

const testimonials = [
  {
    quote: 'Al Jawahir mampu menyeimbangkan pendidikan agama dan ilmu pengetahuan. Saya melihat anak-anak dididik dengan penuh cinta dan tanggung jawab, menghasilkan generasi yang berakhlak dan berprestasi.',
    author: 'Dr. H. Syamsul Maarif, Lc., M.A.',
    role: 'Tokoh Pendidikan Sumatera Utara',
  },
  {
    quote: 'Sekolah ini luar biasa dalam membentuk karakter siswa. Kurikulum yang memadukan IMTAQ dan IPTEK menghasilkan lulusan yang siap menghadapi tantangan zaman dengan bekal iman yang kuat.',
    author: 'H. Muhammad Isa, S.Sos., M.Si.',
    role: 'Tokoh Masyarakat Deli Serdang',
  },
  {
    quote: 'Kami percaya Al Jawahir adalah tempat yang tepat untuk putra-putri kami. Metode pengajaran yang Islami, lingkungan yang kondusif, dan tenaga pendidik yang profesional menjadi nilai lebih.',
    author: 'Prof. Dr. Halimah Tusyadiyah, M.Pd.',
    role: 'Wali Murid SMP IT Al Jawahir',
  },
  {
    quote: 'Saya bangga dengan perkembangan Al Jawahir. Dari RA hingga SMP, konsistensi dalam mendidik dengan nilai-nilai Qurani sangat terlihat. Semoga terus menjadi lembaga pendidikan yang membanggakan.',
    author: 'Drs. H. Zulkifli Nasution, M.M.',
    role: 'Wakil Ketua MUI Deli Serdang',
  },
]

export default async function HomePage() {
  const beritaList = await getBeritaTerbaru()

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-4 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-800 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(5,150,105,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="animate-in animate-in-delay-1 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Al Jawahir Islamic School
          </span>
          <p className="animate-in animate-in-delay-2 arabic text-yellow-300/80 text-xl md:text-2xl leading-loose mb-2">
            اُدْعُ اِلٰى سَبِيْلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
          </p>
          <p className="animate-in animate-in-delay-2 text-white/40 text-sm italic mb-6">Q.S. An-Nahl: 125</p>
          <h1 className="animate-in animate-in-delay-3 text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Yayasan<br />
            <span className="text-gradient">Al Jawahir At Tarbawi</span>
          </h1>
          <p className="animate-in animate-in-delay-4 text-white/50 text-sm uppercase tracking-[0.15em] mb-2">Deli Serdang, Sumatera Utara</p>
          <p className="animate-in animate-in-delay-4 text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak.
          </p>
          <div className="animate-in animate-in-delay-5 flex gap-4 justify-center flex-wrap">
            <Link href="#mengapa" className="bg-gradient-to-r from-yellow-400 to-amber-400 text-green-950 px-8 py-3.5 rounded-xl font-bold text-base hover:from-yellow-300 hover:to-amber-300 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-400/20 no-underline">
              Lihat Program Kami
            </Link>
            <Link href="#tentang" className="bg-white/5 border border-white/20 text-white/90 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 hover:text-white transition-all no-underline backdrop-blur-sm">
              Tentang Yayasan
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== MENGAPA MEMILIH KAMI ===== */}
      <AnimateOnScroll>
      <section id="mengapa" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Mengapa Memilih Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Mencetak Generasi Qurani yang <span className="text-green-700">Berilmu, Berkarakter, dan Berdaya Saing</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Berdiri sejak 2006, Al Jawahir At Tarbawi terus berkembang menjadi lembaga pendidikan Islam terpadu yang dipercaya oleh masyarakat Deli Serdang dan sekitarnya, mengintegrasikan nilai-nilai Qurani, akademik unggul, serta pembinaan karakter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-5">📖</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Kurikulum Holistik Islami</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Perpaduan antara tahfizh Al-Qur&rsquo;an, akademik nasional, dan pembinaan akhlak dalam satu sistem pendidikan terpadu.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-5">🏆</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Berpengalaman &amp; Terpercaya</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Hampir dua dekade dipercaya masyarakat, berkembang dari RA hingga SMP IT, dengan tenaga pendidik profesional dan tersertifikasi.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-5">🌟</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Lingkungan Kondusif</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Suasana belajar yang Islami, aman, dan mendukung tumbuh kembang siswa secara optimal dengan pengawasan intensif dari guru.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-2xl py-10 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={20} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Tahun Berdiri</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={4} />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Unit Pendidikan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Siswa</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={60} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Tenaga Pendidik</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== TENTANG ===== */}
      <AnimateOnScroll delay={100}>
      <section id="tentang" className="py-20 px-6 bg-amber-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Tentang Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Mendidik dengan Ilmu, <span className="text-green-700">Membina dengan Akhlak</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Didirikan pada tahun 2006, Yayasan Al Jawahir At Tarbawi adalah lembaga sosial yang fokus pada tiga pilar utama: pendidikan, dakwah, dan pemberdayaan masyarakat. Kami percaya bahwa melahirkan generasi yang cerdas, berkarakter, dan peduli sesama adalah kunci membangun peradaban yang lebih baik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            <div className="bg-white rounded-2xl p-7 border border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-900 flex items-center justify-center text-2xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Visi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Lembaga Terdepan dalam Membangun, Membina, dan Melayani Masyarakat melalui Pendidikan, Dakwah, dan Sosial.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-2xl mb-4">⭐</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Misi</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                <li>• Pendidikan unggul berfokus karakter Qur&rsquo;ani</li>
                <li>• Dakwah berkelanjutan, inklusif, dan mempersatukan</li>
                <li>• Aktivitas sosial yang berdampak nyata</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-2xl mb-4">📅</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Berdiri</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Yayasan resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang, Sumatera Utara.</p>
              <div className="mt-4 text-2xl font-bold text-green-700" style={{ fontFamily: 'Lora, serif' }}>2006</div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== LAYANAN KAMI ===== */}
      <AnimateOnScroll delay={100}>
      <section id="layanan" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Layanan Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Membangun Umat melalui <span className="text-green-700">Pendidikan, Dakwah, dan Sosial</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Yayasan Al Jawahir At Tarbawi hadir sebagai lembaga yang menyatukan kekuatan pendidikan, dakwah, dan sosial dalam satu visi besar: membangun generasi Islam yang berilmu, berakhlak, dan berdampak.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {layananCards.map((c, i) => (
              <div key={i} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-700 to-green-500" />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{c.icon}</div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-3">{c.tag}</span>
                  <h3 className="font-bold text-gray-800 text-xl mb-3 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{c.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== PROGRAM PENDIDIKAN ===== */}
      <AnimateOnScroll delay={100}>
      <section id="program" className="py-20 px-6 bg-amber-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Program Pendidikan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
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
              <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="h-44 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")" }} />
                  <div className="relative flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl">{p.icon}</span>
                    <span className="arabic text-2xl text-white/20">{p.ar}</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-full">{p.tag}</span>
                  <h3 className="font-bold text-gray-800 text-lg mt-3 mb-2 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.meta.map(m => <span key={m} className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full">{m}</span>)}
                  </div>
                  <Link href="#kontak" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 no-underline group/link hover:gap-3 transition-all">
                    Informasi Pendaftaran
                    <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== SEJARAH ===== */}
      <AnimateOnScroll delay={100}>
      <section id="sejarah" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Perjalanan Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Sejarah & <span className="text-green-700">Pencapaian</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Dari mimpi kecil menjadi lembaga yang terus berkembang dan berdampak nyata.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { year: '2006', title: 'Pendirian Yayasan', desc: 'Yayasan Al Jawahir At Tarbawi resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang.' },
              { year: '2021', title: 'Sekolah Penggerak Angkatan I', desc: 'Ditunjuk sebagai Sekolah Penggerak dan mulai mengimplementasikan Kurikulum Merdeka secara penuh.' },
              { year: '2022', title: 'Menamatkan Angkatan Pertama', desc: 'Dengan bangga menamatkan angkatan pertama lulusan SMP IT Al Jawahir.' },
              { year: '2023–Kini', title: 'Terus Berkembang & Berinovasi', desc: 'Yayasan terus memperluas layanan dan memperkuat kualitas sumber daya manusia.' },
            ].map((t, i) => (
              <div key={i} className="bg-amber-50/60 rounded-xl p-6 border border-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="inline-block text-xs font-bold tracking-wider text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full mb-3">{t.year}</span>
                <h3 className="font-bold text-gray-800 text-lg mb-1" style={{ fontFamily: 'Lora, serif' }}>{t.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== STRUKTUR ORGANISASI ===== */}
      <AnimateOnScroll delay={100}>
      <section id="struktur" className="py-20 px-6 bg-amber-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Struktur Organisasi</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Struktur <span className="text-green-700">Yayasan</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Badan pengurus yang menjalankan roda organisasi Yayasan Al Jawahir At Tarbawi.</p>
          </div>

          {/* Level 1 - Pembina */}
          <div className="mb-12">
            <h3 className="text-center text-sm font-bold uppercase tracking-widest text-green-700 mb-6">Pembina</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {strukturOrganisasi[0].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-8 bg-gradient-to-b from-amber-300 to-green-300" />
          </div>

          {/* Level 2 - Pengawas */}
          <div className="mb-12">
            <h3 className="text-center text-sm font-bold uppercase tracking-widest text-green-700 mb-6">Pengawas</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
              {strukturOrganisasi[1].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-8 bg-gradient-to-b from-green-300 to-green-600" />
          </div>

          {/* Level 3 - Ketua Yayasan */}
          <div className="mb-12">
            <h3 className="text-center text-sm font-bold uppercase tracking-widest text-green-700 mb-6">Ketua Yayasan</h3>
            <div className="max-w-xs mx-auto">
              {strukturOrganisasi[2].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border-2 border-green-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Forking lines */}
          <div className="relative flex justify-center mb-12">
            <div className="flex items-center justify-center w-full max-w-sm">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />
            </div>
          </div>

          {/* Level 4 - Sekretaris & Bendahara */}
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div>
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-green-700 mb-4">Sekretaris</h3>
              {strukturOrganisasi[3].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-green-700 mb-4">Bendahara</h3>
              {strukturOrganisasi[4].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== TESTIMONIAL ===== */}
      <AnimateOnScroll delay={100}>
      <section id="testimonial" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Apa Kata Mereka</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Testimoni <span className="text-green-700">Al Jawahir</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Kepercayaan dan apresiasi dari tokoh masyarakat, pendidik, dan wali murid.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-green-50/60 rounded-2xl p-8 border border-green-100 hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} viewBox="0 0 20 20" width="16" height="16" className="text-yellow-400" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Lora, serif' }}>{t.author}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-8 md:p-10 text-center shadow-xl">
            <p className="arabic text-yellow-200/90 text-xl md:text-2xl leading-loose max-w-3xl mx-auto mb-4">
              &quot;وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ&quot;
            </p>
            <div className="w-12 h-px bg-yellow-400/30 mx-auto mb-4" />
            <p className="italic text-white/50 text-sm max-w-xl mx-auto mb-2" style={{ fontFamily: 'Lora, serif' }}>
              &quot;Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.&quot;
            </p>
            <span className="text-xs font-bold text-yellow-300/60 tracking-wide">— HR. Muslim</span>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== BERITA ===== */}
      <AnimateOnScroll delay={100}>
      <section id="berita" className="py-20 px-6 bg-amber-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Berita & Artikel</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Kabar Terkini dari <span className="text-green-700">Yayasan</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Ikuti perkembangan dan informasi terbaru dari Yayasan Al Jawahir At Tarbawi.</p>
          </div>
          {beritaList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl text-gray-400 border border-gray-100">
              <p className="text-4xl mb-3">📰</p>
              <p className="font-bold mb-1">Belum ada berita</p>
              <p className="text-sm">Masuk ke <Link href="/admin" className="text-green-700 font-bold">panel admin</Link> untuk menambah berita pertama.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {beritaList.map(b => <BeritaCard key={b.id} berita={b} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 no-underline hover:gap-3 transition-all">
              Lihat Semua Berita <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="section-ornament">
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-diamond" />
        <div className="section-ornament-dot" />
        <div className="section-ornament-dot" />
      </div>

      {/* ===== KONTAK ===== */}
      <AnimateOnScroll delay={100}>
      <section id="kontak" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-green-700">Hubungi Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Bergabunglah Bersama <span className="text-green-700">Kami</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Kami siap membantu Anda mendapatkan informasi lebih lanjut mengenai program pendidikan dan kegiatan yayasan.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-3xl mx-auto">
            <div className="space-y-4 md:space-y-5">
              {[
                { icon: '📍', title: 'Alamat', val: 'Jl. Aman, Sunggal, Kecamatan Sunggal, Kabupaten Deli Serdang, Sumatera Utara' },
                { icon: '📷', title: 'Instagram', val: '@aljawahir_islamic_school', href: 'https://instagram.com/aljawahir_islamic_school' },
                { icon: '📧', title: 'Email', val: 'info@aljawahirattarbawi.sch.id', href: 'mailto:info@aljawahirattarbawi.sch.id' },
                { icon: '⏰', title: 'Jam Operasional', val: 'Senin–Jumat: 07.30–15.30 WIB' },
              ].map(c => (
                <div key={c.title} className="flex gap-3 md:gap-4 items-start group">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-green-900 flex items-center justify-center text-base md:text-lg flex-shrink-0 group-hover:bg-green-800 transition-colors">{c.icon}</div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-green-700 mb-0.5">{c.title}</p>
                    {'href' in c && c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm leading-relaxed hover:text-green-700 transition-colors">{c.val}</a>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">{c.val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 md:p-8 border border-green-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="md:w-5 md:h-5" fill="#166534">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-lg" style={{ fontFamily: 'Lora, serif' }}>Chat WhatsApp</h3>
              </div>
              <KontakForm />
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </>
  )
}
