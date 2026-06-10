'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ScrollPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      if (visible) return
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled > 0.25) setVisible(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [visible, dismissed])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl border border-green-100 rounded-2xl shadow-2xl shadow-green-900/10 p-5 md:p-6 flex items-center gap-4 md:gap-6 max-w-md mx-4 pointer-events-auto animate-slide-up">
        <div className="hidden md:flex w-12 h-12 rounded-xl bg-gradient-to-br from-green-700 to-green-900 items-center justify-center text-white font-bold shrink-0" style={{ fontFamily: 'Amiri, serif' }}>
          الج
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Lora, serif' }}>Informasi Pendaftaran</p>
          <p className="text-gray-500 text-xs mt-0.5">Hubungi kami untuk info lengkap program pendidikan.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="#kontak" onClick={() => setDismissed(true)} className="bg-gradient-to-r from-yellow-400 to-amber-400 text-green-950 text-xs font-bold px-4 py-2.5 rounded-xl hover:from-yellow-300 hover:to-amber-300 transition-all no-underline whitespace-nowrap shadow-lg shadow-yellow-400/20">
            Hubungi
          </Link>
          <button onClick={() => { setVisible(false); setDismissed(true) }} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all cursor-pointer shrink-0">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
