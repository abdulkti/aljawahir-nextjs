'use client'
import { MouseEvent, ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  target?: string
}

const HEADER_OFFSET = 88

export default function ScrollLink({ href, children, className, onClick, target }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    const hash = href.includes('#') ? href.split('#')[1] : null
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    e.preventDefault()
    onClick?.()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' })
      })
    })
    history.replaceState(null, '', `#${hash}`)
  }

  return (
    <a href={href} onClick={handle} className={className} target={target}>
      {children}
    </a>
  )
}
