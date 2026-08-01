'use client'
import { useRef, useEffect } from 'react'

export default function Text3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, drag: false })
  const last = useRef({ x: 0, y: 0 })
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let id = 0
    function tick() {
      const s = state.current
      s.x += s.vx
      s.y += s.vy
      s.vx *= 0.9
      s.vy *= 0.9
      if (el.current) {
        el.current.style.transform = `rotateX(${s.x}deg) rotateY(${s.y}deg)`
      }
      if (Math.abs(s.vx) > 0.01 || Math.abs(s.vy) > 0.01 || s.drag) {
        id = requestAnimationFrame(tick)
      }
    }
    function down(e: PointerEvent) {
      state.current.drag = true
      state.current.vx = 0
      state.current.vy = 0
      last.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      id = requestAnimationFrame(tick)
    }
    function move(e: PointerEvent) {
      if (!state.current.drag) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      state.current.vx = dy * 0.6
      state.current.vy = -dx * 0.6
      last.current = { x: e.clientX, y: e.clientY }
    }
    function up() {
      state.current.drag = false
    }

    const div = el.current
    if (!div) return
    div.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(id)
      div.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div className="w-full text-center" style={{ perspective: '1000px' }}>
      <div
        ref={el}
        className={`select-none inline-block ${className ?? ''}`}
        style={{ transformStyle: 'preserve-3d', cursor: 'grab' }}
      >
        {children}
      </div>
    </div>
  )
}
