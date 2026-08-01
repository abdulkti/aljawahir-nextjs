'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Program', href: '/#program' },
  { label: 'Berita', href: '/berita' },
  { label: 'Kontak', href: '/#kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-green-900 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Al Jawahir At Tarbawi</p>
            <p className="text-white/60 text-xs">Al Jawahir Islamic School</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-white/85 text-sm font-semibold uppercase tracking-wide hover:text-yellow-300 transition-colors no-underline">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#kontak" className="bg-yellow-400 text-green-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors no-underline">
              Daftar Sekarang
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-green-900 px-6 pb-6 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-white/85 text-sm font-semibold uppercase py-3 border-b border-white/10 no-underline hover:text-yellow-300 transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/#kontak" onClick={() => setOpen(false)}
            className="mt-2 text-yellow-300 text-sm font-bold uppercase py-2 no-underline">
            Daftar Sekarang →
          </Link>
        </div>
      )}
    </nav>
  )
}
