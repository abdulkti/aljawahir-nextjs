'use client'

import { getVelocity } from '@/lib/scrollVelocity'

let els: HTMLElement[] = []
let raf = 0
let reduced = false

if (typeof window !== 'undefined') {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function frame() {
  raf = 0
  if (reduced) return
  const vh = window.innerHeight
  const vel = getVelocity()
  const velNorm = Math.min(vel / 2.5, 1)
  const overlap = Math.min(vh * 0.2, 120)
  if (velNorm <= 0.01) {
    for (const el of els) el.style.transform = ''
    return
  }
  for (const el of els) {
    const r = el.getBoundingClientRect()
    const p = Math.min(Math.max((vh - r.top) / (vh * 0.9), 0), 1)
    const shift = (1 - p) * velNorm * overlap
    el.style.transform = shift > 1 ? `translateY(${-Math.round(shift)}px)` : ''
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(frame)
}

export function registerSection(el: HTMLElement): () => void {
  els.push(el)
  if (els.length === 1) window.addEventListener('scroll', schedule, { passive: true })
  schedule()
  return () => {
    els = els.filter((e) => e !== el)
    if (els.length === 0) window.removeEventListener('scroll', schedule)
  }
}
