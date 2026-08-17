import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_PATHS = [
  '/',
  '/berita',
  '/berita/',
  '/favicon.ico',
  '/logo-aljawahir.png',
  '/og-image.jpg',
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/berita/')) return true
  if (pathname.startsWith('/_next/')) return true
  if (pathname.startsWith('/api/auth/')) return true
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    if (pathname === '/api/upload-url') {
      const auth = request.headers.get('authorization')
      if (!auth || !auth.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const token = auth.slice(7)
      if (!token || !verifyToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.next()
    }

    if (pathname === '/api/upload') {
      const auth = request.headers.get('authorization')
      if (!auth || !auth.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const token = auth.slice(7)
      if (!token || !verifyToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.next()
    }

    if (request.method === 'GET') {
      return NextResponse.next()
    }

    const auth = request.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = auth.slice(7)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo-aljawahir.png|og-image.jpg).*)',
  ],
}
