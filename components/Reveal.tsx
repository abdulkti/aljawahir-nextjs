'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [fromTop, setFromTop] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const id = requestAnimationFrame(() => {
        setReduced(true)
        setVisible(true)
      })
      return () => cancelAnimationFrame(id)
    }
    let prevTop: number | null = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        const top = entry.boundingClientRect.top
        if (prevTop !== null && Math.abs(top - prevTop) > 2) {
          setFromTop(top > prevTop)
        }
        prevTop = top
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const show = visible || reduced
  const transition = reduced ? '' : 'transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  const offset = fromTop ? '-translate-y-6' : 'translate-y-6'

  return (
    <div
      ref={ref}
      className={`${transition} ${show ? 'opacity-100 translate-y-0' : `opacity-0 ${offset}`} ${className}`}
      style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
