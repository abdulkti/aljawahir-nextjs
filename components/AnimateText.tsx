'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { subscribeVelocity } from '@/lib/scrollVelocity'

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom'

const hidden: Record<Direction, string> = {
  up: 'opacity-0 translate-y-6 blur-[3px]',
  down: 'opacity-0 -translate-y-6 blur-[3px]',
  left: 'opacity-0 -translate-x-6 blur-[3px]',
  right: 'opacity-0 translate-x-6 blur-[3px]',
  zoom: 'opacity-0 scale-95 blur-[3px]',
}

const baseClass = 'transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform'

export default function AnimateText({
  children,
  direction = 'up',
  delay = 0,
  duration = 1000,
  as = 'div',
  className = '',
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  as?: 'div' | 'span'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [dur, setDur] = useState(duration)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(
    () =>
      subscribeVelocity((v) => {
        setDur(Math.round(Math.max(duration / (1 + v * 0.6), 400)))
      }),
    [duration]
  )

  const stateClass = visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0' : hidden[direction]
  const style = { transitionDelay: `${delay}ms`, transitionDuration: `${dur}ms` }

  if (as === 'span') {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={`${baseClass} ${stateClass} ${className}`} style={style}>
        {children}
      </span>
    )
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`${baseClass} ${stateClass} ${className}`} style={style}>
      {children}
    </div>
  )
}
