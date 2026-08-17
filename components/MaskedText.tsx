'use client'
import { useEffect, useRef, useState } from 'react'

export default function MaskedText({
  text,
  className = '',
  delay = 0,
  step = 50,
}: {
  text: string
  className?: string
  delay?: number
  step?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const id = requestAnimationFrame(() => setPlay(true))
      return () => cancelAnimationFrame(id)
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPlay(true) },
      { threshold: 0.3, rootMargin: '50px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <span
            className={`inline-block transition-transform duration-700 ease-out ${play ? 'translate-y-0' : 'translate-y-[115%]'}`}
            style={{ transitionDelay: play ? `${delay + i * step}ms` : '0ms' }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
