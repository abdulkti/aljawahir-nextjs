'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

export type RevealFrom = 'auto' | 'top' | 'bottom' | 'left' | 'right'

const offsets: Record<Exclude<RevealFrom, 'auto'>, string> = {
  top: 'translate-x-0 -translate-y-6',
  bottom: 'translate-x-0 translate-y-6',
  left: '-translate-x-6 translate-y-0',
  right: 'translate-x-6 translate-y-0',
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  from = 'bottom',
}: {
  children: ReactNode
  delay?: number
  className?: string
  from?: RevealFrom
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const id = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(id)
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true) },
      { threshold: 0.1, rootMargin: '50px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const activeDir = from === 'auto' ? 'bottom' : from

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out ${show ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${offsets[activeDir]}`} ${className}`}
      style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
