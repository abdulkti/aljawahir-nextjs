'use client'
import { useEffect, useRef, ReactNode } from 'react'
import { registerSection } from '@/lib/sectionStack'

export default function SectionStack({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerSection(el)
  }, [])

  return (
    <section ref={ref as React.RefObject<HTMLElement>} id={id} className={className} style={{ willChange: 'transform' }}>
      {children}
    </section>
  )
}
