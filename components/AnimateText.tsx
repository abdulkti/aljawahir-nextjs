'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom'

const hidden: Record<Direction, string> = {
  up: 'opacity-0 translate-y-8',
  down: 'opacity-0 -translate-y-8',
  left: 'opacity-0 -translate-x-10',
  right: 'opacity-0 translate-x-10',
  zoom: 'opacity-0 scale-90',
}

const baseClass = 'transition-all ease-out will-change-transform'

export default function AnimateText({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
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

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stateClass = visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : hidden[direction]
  const style = { transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }

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
