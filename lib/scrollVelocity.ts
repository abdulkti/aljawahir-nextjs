'use client'

let current = 0
let lastY = 0
let lastT = 0
let ticking = false
const subscribers = new Set<(v: number) => void>()

function compute() {
  const y = window.scrollY
  const t = performance.now()
  const dt = Math.max(t - lastT, 1)
  const raw = Math.abs(y - lastY) / dt
  lastY = y
  lastT = t
  current = current + (raw - current) * 0.2
  subscribers.forEach((fn) => fn(current))
  ticking = false
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(compute)
  }
}

export function subscribeVelocity(fn: (v: number) => void): () => void {
  subscribers.add(fn)
  if (subscribers.size === 1) {
    lastY = window.scrollY
    lastT = performance.now()
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', onScroll)
    }
  }
}
