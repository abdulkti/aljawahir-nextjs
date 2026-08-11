'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

export type RevealFrom = 'auto' | 'top' | 'bottom' | 'left' | 'right'

const offsets: Record<Exclude<RevealFrom, 'auto'>, string> = {
  top: 'translate-x-0 -translate-y-8',
  bottom: 'translate-x-0 translate-y-8',
  left: '-translate-x-8 translate-y-0',
  right: 'translate-x-8 translate-y-0',
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  from = 'auto',
}: {
  children: ReactNode
  delay?: number
  className?: string
  from?: RevealFrom
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [dir, setDir] = useState<Exclude<RevealFrom, 'auto'>>('bottom')

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
          setDir(top > prevTop ? 'top' : 'bottom')
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
  const fixed = from !== 'auto'
  const activeDir = fixed ? from : dir
  const transition = reduced ? '' : 'transition-[opacity,transform,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform'
  const transform = show ? 'translate-x-0 translate-y-0' : offsets[activeDir]

  return (
    <div
      ref={ref}
      className={`${transition} ${show ? 'opacity-100' : 'opacity-0'} ${transform} ${className}`}
      style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
