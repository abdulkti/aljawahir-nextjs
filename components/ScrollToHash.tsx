'use client'
import { useEffect } from 'react'

const HEADER_OFFSET = 88

export default function ScrollToHash() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const el = document.getElementById(hash.slice(1))
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' })
    }

    scrollToHash()
    if (document.readyState !== 'complete') {
      window.addEventListener('load', scrollToHash)
    }
    const t = setTimeout(scrollToHash, 800)

    return () => {
      window.removeEventListener('load', scrollToHash)
      clearTimeout(t)
    }
  }, [])

  return null
}
