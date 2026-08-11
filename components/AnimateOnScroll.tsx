'use client'

import { useEffect, useRef, useState } from 'react'

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[2px]'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
