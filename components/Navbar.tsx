'use client'
import { useState } from 'react'
import Link from 'next/link'
import ScrollLink from '@/components/ScrollLink'
import { navLinks } from '@/lib/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo-aljawahir.png" alt="Al Jawahir At Tarbawi" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-gray-900 font-bold text-sm leading-tight">Al Jawahir At Tarbawi</p>
            <p className="text-gray-500 text-xs">Al Jawahir Islamic School</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-7 list-none">
          {navLinks.map(l => (
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
        <button className="lg:hidden text-gray-700 p-1" onClick={() => setOpen(!open)} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white px-6 pb-6 flex flex-col gap-1">
          {navLinks.map(l => (
            <ScrollLink key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-gray-600 text-sm font-semibold uppercase py-3 border-b border-gray-100 no-underline hover:text-emerald-700 transition-colors">
              {l.fullLabel ?? l.label}
            </ScrollLink>
          ))}
          <ScrollLink href="/#kontak" onClick={() => setOpen(false)}
            className="mt-2 text-emerald-700 text-sm font-bold uppercase py-2 no-underline">
            Daftar Sekarang →
          </ScrollLink>
        </div>
      )}
    </nav>
  )
}
