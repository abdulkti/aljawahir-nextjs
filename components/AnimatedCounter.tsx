'use client'
import { useEffect, useState, useRef } from 'react'

export default function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          const duration = 1500
          const steps = 30
          const increment = value / steps
          let current = 0
          const interval = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(interval)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-lora)' }}>
      {count}{suffix}
    </div>
  )
}
