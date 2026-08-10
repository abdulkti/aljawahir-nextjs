import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToHash from '@/components/ScrollToHash'

import BeritaCard from '@/components/BeritaCard'
import KontakForm from '@/components/KontakForm'
import AnimatedCounter from '@/components/AnimatedCounter'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import UnitPrograms from '@/components/UnitPrograms'
import ScrollLink from '@/components/ScrollLink'
import { supabaseServer } from '@/lib/supabase'
import { Berita } from '@/types'
import {
  BookOpen,
  Award,
  Sun,
  Target,
  Star,
  CalendarDays,
  HeartHandshake,
  Users,
  ArrowRight,
  MapPin,
  Mail,
  Clock,
  Quote,
} from 'lucide-react'

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
    icon: BookOpen,
    tag: 'Pendidikan',
    title: 'Pendidikan Islam Terpadu',
    desc: 'Menyelenggarakan pendidikan formal dari RA, SD IT, hingga SMP IT dengan kurikulum nasional dan nilai-nilai Al-Quran yang terintegrasi dalam setiap aspek pembelajaran.',
  },
  {
    icon: HeartHandshake,
    tag: 'Sosial & Dakwah',
    title: 'Pemberdayaan Masyarakat',
    desc: 'Aktif dalam kegiatan sosial dan dakwah melalui program pemberdayaan masyarakat, pengajian, serta pembinaan karakter Islami untuk sekitar.',
  },
  {
    icon: Sun,
    tag: 'Pembinaan',
    title: 'Generasi Qurani',
    desc: 'Program tahfizh dan tahsin Al-Quran yang terstruktur untuk membentuk generasi penghafal Al-Quran yang berakhlak mulia dan berkarakter pemimpin.',
  },
]

const mengapaCards = [
  {
    icon: BookOpen,
    title: 'Kurikulum Holistik Islami',
    desc: 'Perpaduan antara tahfizh Al-Qur\u2019an, akademik nasional, dan pembinaan akhlak dalam satu sistem pendidikan terpadu.',
  },
  {
    icon: Award,
    title: 'Berpengalaman & Terpercaya',
    desc: 'Hampir dua dekade dipercaya masyarakat, berkembang dari RA hingga SMP IT, dengan tenaga pendidik profesional dan tersertifikasi.',
  },
  {
    icon: Users,
    title: 'Lingkungan Kondusif',
    desc: 'Suasana belajar yang Islami, aman, dan mendukung tumbuh kembang siswa secara optimal dengan pengawasan intensif dari guru.',
  },
]

const strukturOrganisasi = [
  { label: 'Pembina', orang: [
    { nama: 'H. Syafril Usman, SPd.I', inisial: 'SU' },
    { nama: 'Hj. Jawahir', inisial: 'HJ' },
    { nama: 'Muhammad Ikhsan, SKM', inisial: 'MI' },
  ]},
  { label: 'Pengawas', orang: [
    { nama: 'Muhammad Sulfan Irvan, SE', inisial: 'SI' },
    { nama: 'Ir. Anda Zulfan, MM', inisial: 'AZ' },
  ]},
  { label: 'Ketua Yayasan', orang: [
    { nama: 'Dr. Zulheddi, Lc, MA', inisial: 'ZH' },
  ], single: true },
  { label: 'Sekretaris', orang: [
    { nama: 'Khairiati Sawitri, S.Psi', inisial: 'KS' },
  ], single: true },
  { label: 'Bendahara', orang: [
    { nama: 'Khairunnisa, SE, SPd.I', inisial: 'KN' },
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

function InstagramIcon({ size = 18, strokeWidth = 1.75, className = '' }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const kontakItems = [
  { icon: MapPin, title: 'Alamat', val: 'Jl. Aman, Sunggal, Kecamatan Sunggal, Kabupaten Deli Serdang, Sumatera Utara' },
  { icon: InstagramIcon, title: 'Instagram', val: '@aljawahir_islamic_school', href: 'https://instagram.com/aljawahir_islamic_school' },
  { icon: Mail, title: 'Email', val: 'info@aljawahirattarbawi.sch.id', href: 'mailto:info@aljawahirattarbawi.sch.id' },
  { icon: Clock, title: 'Jam Operasional', val: 'Senin\u2013Jumat: 07.30\u201315.30 WIB' },
]

function SectionHeading({ tag, title, desc, titleAccent }: { tag: string; title: string; desc?: string; titleAccent: string }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full mb-5">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4" style={{ fontFamily: 'Lora, serif' }}>
        {title} <span className="text-emerald-700">{titleAccent}</span>
      </h2>
      {desc && <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{desc}</p>}
    </div>
  )
}

export default async function HomePage() {
  const beritaList = await getBeritaTerbaru()

  return (
    <>
      <Navbar />
      <ScrollToHash />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pb-16 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.10),transparent_55%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="animate-in animate-in-delay-1 inline-flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Al Jawahir Islamic School
          </span>
          <p className="animate-in animate-in-delay-2 arabic text-emerald-800/80 text-xl md:text-2xl leading-loose mb-2">
            اُدْعُ اِلٰى سَبِيْلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ
          </p>
          <p className="animate-in animate-in-delay-2 text-gray-400 text-sm italic mb-6">Q.S. An-Nahl: 125</p>
          <h1 className="animate-in animate-in-delay-3 text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Yayasan<br />
            <span className="text-emerald-700">Al Jawahir At Tarbawi</span>
          </h1>
          <p className="animate-in animate-in-delay-4 text-gray-400 text-sm uppercase tracking-[0.15em] mb-2">Deli Serdang, Sumatera Utara</p>
          <p className="animate-in animate-in-delay-4 text-gray-500 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak.
          </p>
          <div className="animate-in animate-in-delay-5 flex gap-4 justify-center flex-wrap">
            <ScrollLink href="#program" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-emerald-800 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-700/20 no-underline">
              Lihat Program Kami <ArrowRight size={18} />
            </ScrollLink>
            <ScrollLink href="#tentang" className="inline-flex items-center bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-bold text-base hover:border-emerald-300 hover:text-emerald-700 transition-all no-underline">
              Tentang Yayasan
            </ScrollLink>
          </div>
        </div>
      </section>

      {/* ===== MENGAPA MEMILIH KAMI ===== */}
      <AnimateOnScroll>
      <section id="mengapa" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Mengapa Memilih Kami"
            title="Mencetak Generasi Qurani yang"
            titleAccent="Berilmu, Berkarakter, dan Berdaya Saing"
            desc="Berdiri sejak 2006, Al Jawahir At Tarbawi terus berkembang menjadi lembaga pendidikan Islam terpadu yang dipercaya oleh masyarakat Deli Serdang dan sekitarnya, mengintegrasikan nilai-nilai Qurani, akademik unggul, serta pembinaan karakter."
          />

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {mengapaCards.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-5">
                  <c.icon size={24} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950 rounded-3xl py-12 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={20} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Tahun Berdiri</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={4} />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Unit Pendidikan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Siswa</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400" style={{ fontFamily: 'Lora, serif' }}>
                  <AnimatedCounter value={60} suffix="+" />
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-1.5">Tenaga Pendidik</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== TENTANG ===== */}
      <AnimateOnScroll delay={100}>
      <section id="tentang" className="py-20 md:py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Tentang Kami"
            title="Mendidik dengan Ilmu,"
            titleAccent="Membina dengan Akhlak"
            desc="Didirikan pada tahun 2006, Yayasan Al Jawahir At Tarbawi adalah lembaga sosial yang fokus pada tiga pilar utama: pendidikan, dakwah, dan pemberdayaan masyarakat. Kami percaya bahwa melahirkan generasi yang cerdas, berkarakter, dan peduli sesama adalah kunci membangun peradaban yang lebih baik."
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-amber-400 mb-4">
                <Target size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Visi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Lembaga Terdepan dalam Membangun, Membina, dan Melayani Masyarakat melalui Pendidikan, Dakwah, dan Sosial.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Star size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Misi</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                <li>• Pendidikan unggul berfokus karakter Qur\u2019ani</li>
                <li>• Dakwah berkelanjutan, inklusif, dan mempersatukan</li>
                <li>• Aktivitas sosial yang berdampak nyata</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <CalendarDays size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Lora, serif' }}>Berdiri</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Yayasan resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang, Sumatera Utara.</p>
              <div className="mt-4 text-2xl font-bold text-emerald-700" style={{ fontFamily: 'Lora, serif' }}>2006</div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== LAYANAN KAMI ===== */}
      <AnimateOnScroll delay={100}>
      <section id="layanan" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Layanan Kami"
            title="Membangun Umat melalui"
            titleAccent="Pendidikan, Dakwah, dan Sosial"
            desc="Yayasan Al Jawahir At Tarbawi hadir sebagai lembaga yang menyatukan kekuatan pendidikan, dakwah, dan sosial dalam satu visi besar: membangun generasi Islam yang berilmu, berakhlak, dan berdampak."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {layananCards.map((c, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <c.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full mb-3">{c.tag}</span>
                <h3 className="font-bold text-gray-800 text-xl mb-3 leading-snug" style={{ fontFamily: 'Lora, serif' }}>{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== PROGRAM PENDIDIKAN ===== */}
      <AnimateOnScroll delay={100}>
      <section id="program" className="py-20 md:py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Program Pendidikan"
            title="Unit"
            titleAccent="Pendidikan Kami"
            desc="Empat unit pendidikan Islam terpadu untuk membangun generasi Qurani dan berkarakter."
          />
          <UnitPrograms />
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== SEJARAH ===== */}
      <AnimateOnScroll delay={100}>
      <section id="sejarah" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            tag="Perjalanan Kami"
            title="Sejarah &"
            titleAccent="Pencapaian"
            desc="Dari mimpi kecil menjadi lembaga yang terus berkembang dan berdampak nyata."
          />
          <div className="space-y-6">
            {[
              { year: '2006', title: 'Pendirian Yayasan', desc: 'Yayasan Al Jawahir At Tarbawi resmi berdiri pada 17 Oktober 2006 di Sunggal, Deli Serdang.' },
              { year: '2021', title: 'Sekolah Penggerak Angkatan I', desc: 'Ditunjuk sebagai Sekolah Penggerak dan mulai mengimplementasikan Kurikulum Merdeka secara penuh.' },
              { year: '2022', title: 'Menamatkan Angkatan Pertama', desc: 'Dengan bangga menamatkan angkatan pertama lulusan SMP IT Al Jawahir.' },
              { year: '2023\u2013Kini', title: 'Terus Berkembang & Berinovasi', desc: 'Yayasan terus memperluas layanan dan memperkuat kualitas sumber daya manusia.' },
            ].map((t, i) => (
              <div key={i} className="flex gap-5 md:gap-7">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  {i < 3 && <div className="w-px flex-1 bg-emerald-100" />}
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-all flex-1 mb-1">
                  <span className="inline-block text-xs font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">{t.year}</span>
                  <h3 className="font-bold text-gray-800 text-lg mb-1" style={{ fontFamily: 'Lora, serif' }}>{t.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== STRUKTUR ORGANISASI ===== */}
      <AnimateOnScroll delay={100}>
      <section id="struktur" className="py-20 md:py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Struktur Organisasi"
            title="Struktur"
            titleAccent="Yayasan"
            desc="Badan pengurus yang menjalankan roda organisasi Yayasan Al Jawahir At Tarbawi."
          />

          {/* Level 1 - Pembina */}
          <div className="mb-10">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Pembina</h3>
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {strukturOrganisasi[0].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level 2 - Pengawas */}
          <div className="mb-10">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Pengawas</h3>
            <div className="grid md:grid-cols-2 gap-5 max-w-lg mx-auto">
              {strukturOrganisasi[1].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level 3 - Ketua Yayasan */}
          <div className="mb-10">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Ketua Yayasan</h3>
            <div className="max-w-xs mx-auto">
              {strukturOrganisasi[2].orang.map((t, i) => (
                <div key={i} className="bg-emerald-950 rounded-2xl p-5 border border-emerald-900 shadow-sm text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold text-lg mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-white text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level 4 - Sekretaris & Bendahara */}
          <div className="grid md:grid-cols-2 gap-5 max-w-lg mx-auto">
            <div>
              <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sekretaris</h3>
              {strukturOrganisasi[3].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {t.inisial}
                  </div>
                  <p className="font-bold text-gray-800 text-sm leading-snug" style={{ fontFamily: 'Lora, serif' }}>{t.nama}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Bendahara</h3>
              {strukturOrganisasi[4].orang.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg mb-3" style={{ fontFamily: 'Lora, serif' }}>
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

      {/* ===== TESTIMONIAL ===== */}
      <AnimateOnScroll delay={100}>
      <section id="testimonial" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Apa Kata Mereka"
            title="Testimoni"
            titleAccent="Al Jawahir"
            desc="Kepercayaan dan apresiasi dari tokoh masyarakat, pendidik, dan wali murid."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all">
                <Quote size={28} className="text-emerald-200 mb-4" fill="currentColor" strokeWidth={0} />
                <p className="text-gray-600 text-sm leading-relaxed italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Lora, serif' }}>{t.author}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-emerald-950 rounded-3xl p-8 md:p-12 text-center">
            <p className="arabic text-amber-200/90 text-xl md:text-2xl leading-loose max-w-3xl mx-auto mb-5">
              &quot;وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ&quot;
            </p>
            <div className="w-12 h-px bg-amber-400/30 mx-auto mb-5" />
            <p className="italic text-white/60 text-sm max-w-xl mx-auto mb-2" style={{ fontFamily: 'Lora, serif' }}>
              &quot;Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.&quot;
            </p>
            <span className="text-xs font-bold text-amber-300/70 tracking-wide">— HR. Muslim</span>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== BERITA ===== */}
      <AnimateOnScroll delay={100}>
      <section id="berita" className="py-20 md:py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Berita & Artikel"
            title="Kabar Terkini dari"
            titleAccent="Yayasan"
            desc="Ikuti perkembangan dan informasi terbaru dari Yayasan Al Jawahir At Tarbawi."
          />
          {beritaList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl text-gray-400 border border-gray-100">
              <p className="text-4xl mb-3">📰</p>
              <p className="font-bold mb-1">Belum ada berita</p>
              <p className="text-sm">Masuk ke <Link href="/admin" className="text-emerald-700 font-bold">panel admin</Link> untuk menambah berita pertama.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {beritaList.map(b => <BeritaCard key={b.id} berita={b} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 no-underline hover:gap-3 transition-all">
              Lihat Semua Berita <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* ===== KONTAK ===== */}
      <AnimateOnScroll delay={100}>
      <section id="kontak" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tag="Hubungi Kami"
            title="Bergabunglah Bersama"
            titleAccent="Kami"
            desc="Kami siap membantu Anda mendapatkan informasi lebih lanjut mengenai program pendidikan dan kegiatan yayasan."
          />
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-3xl mx-auto">
            <div className="space-y-4 md:space-y-5">
              {kontakItems.map(c => (
                <div key={c.title} className="flex gap-3 md:gap-4 items-start group">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                    <c.icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{c.title}</p>
                    {'href' in c && c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm leading-relaxed hover:text-emerald-700 transition-colors">{c.val}</a>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">{c.val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Lora, serif' }}>Chat WhatsApp</h3>
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
