'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScrollLink from '@/components/ScrollLink'
import { Menu, X, ChevronDown } from 'lucide-react'

const groups = [
  {
    label: 'Tentang',
    items: [
      { label: 'Tentang Kami', href: '/#tentang' },
      { label: 'Sejarah', href: '/#sejarah' },
      { label: 'Struktur Organisasi', href: '/#struktur' },
    ],
  },
  {
    label: 'Keunggulan',
    items: [
      { label: 'Mengapa Memilih Kami', href: '/#mengapa' },
      { label: 'Layanan', href: '/#layanan' },
      { label: 'Program Pendidikan', href: '/#program' },
    ],
  },
]

const directLinks = [
  { label: 'Berita', href: '/berita' },
  { label: 'Kontak', href: '/#kontak' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(label)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [])

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" width={40} height={40} className="w-10 h-10 object-contain" />
          <div>
            <p className="text-gray-900 font-bold text-sm leading-tight">Al Jawahir At Tarbawi</p>
            <p className="text-gray-500 text-xs">Al Jawahir Islamic School</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-6 list-none">
          {groups.map(g => (
            <li key={g.label} className="relative"
              onMouseEnter={() => openDropdown(g.label)}
              onMouseLeave={scheduleClose}>
              <button className="flex items-center gap-1 text-gray-600 text-[13px] font-semibold uppercase tracking-wide hover:text-emerald-700 transition-colors whitespace-nowrap">
                {g.label}
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === g.label ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === g.label && (
                <ul className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] list-none z-50">
                  {g.items.map(item => (
                    <li key={item.href}>
                      {item.href.startsWith('/#') ? (
                        <ScrollLink href={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors no-underline"
                          onClick={() => setActiveDropdown(null)}>
                          {item.label}
                        </ScrollLink>
                      ) : (
                        <Link href={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors no-underline"
                          onClick={() => setActiveDropdown(null)}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {directLinks.map(l => (
            <li key={l.href}>
              {l.href.startsWith('/#') ? (
                <ScrollLink href={l.href} className="text-gray-600 text-[13px] font-semibold uppercase tracking-wide hover:text-emerald-700 transition-colors no-underline whitespace-nowrap">
                  {l.label}
                </ScrollLink>
              ) : (
                <Link href={l.href} className="text-gray-600 text-[13px] font-semibold uppercase tracking-wide hover:text-emerald-700 transition-colors no-underline whitespace-nowrap">
                  {l.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <ScrollLink href="/#kontak" className="bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-800 transition-colors no-underline whitespace-nowrap">
              Daftar Sekarang
            </ScrollLink>
          </li>
        </ul>

        {/* Hamburger */}
        <button className="lg:hidden text-gray-700 p-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white px-6 pb-6 flex flex-col gap-1">
          {groups.map(g => (
            <div key={g.label}>
              <button onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)}
                className="w-full flex items-center justify-between text-gray-600 text-sm font-semibold uppercase py-3 border-b border-gray-100 hover:text-emerald-700 transition-colors">
                {g.label}
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileGroup === g.label ? 'rotate-180' : ''}`} />
              </button>
              {mobileGroup === g.label && (
                <div className="pl-4 pb-2">
                  {g.items.map(item => (
                    item.href.startsWith('/#') ? (
                      <ScrollLink key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                        className="block text-gray-500 text-sm py-2.5 border-b border-gray-50 no-underline hover:text-emerald-700 transition-colors">
                        {item.label}
                      </ScrollLink>
                    ) : (
                      <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                        className="block text-gray-500 text-sm py-2.5 border-b border-gray-50 no-underline hover:text-emerald-700 transition-colors">
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
          {directLinks.map(l => (
            l.href.startsWith('/#') ? (
              <ScrollLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-gray-600 text-sm font-semibold uppercase py-3 border-b border-gray-100 no-underline hover:text-emerald-700 transition-colors">
                {l.label}
              </ScrollLink>
            ) : (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-gray-600 text-sm font-semibold uppercase py-3 border-b border-gray-100 no-underline hover:text-emerald-700 transition-colors">
                {l.label}
              </Link>
            )
          ))}
          <ScrollLink href="/#kontak" onClick={() => setMobileOpen(false)}
            className="mt-2 text-emerald-700 text-sm font-bold uppercase py-2 no-underline">
            Daftar Sekarang →
          </ScrollLink>
        </div>
      )}
    </nav>
  )
}
