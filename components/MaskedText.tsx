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
  const [show, setShow] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const id = requestAnimationFrame(() => {
        setReduced(true)
        setShow(true)
      })
      return () => cancelAnimationFrame(id)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')
  const transition = reduced ? '' : 'transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform'

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <span
            className={`inline-block ${transition} ${show ? 'translate-y-0' : 'translate-y-[115%]'}`}
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
