import { NextRequest, NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import { signToken } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_SECRET = process.env.ADMIN_SECRET

if (!ADMIN_USERNAME || !ADMIN_SECRET) {
  console.error('CRITICAL: ADMIN_USERNAME or ADMIN_SECRET environment variables are not set')
}

function hashPassword(password: string): Buffer {
  return scryptSync(password, 'admin-salt', 64)
}

export async function POST(req: NextRequest) {
  if (!ADMIN_USERNAME || !ADMIN_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`login:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' }, { status: 429 })
  }

  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  if (username !== ADMIN_USERNAME) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const inputHash = hashPassword(password)
  const storedHash = hashPassword(ADMIN_SECRET)

  if (inputHash.length !== storedHash.length || !timingSafeEqual(inputHash, storedHash)) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const token = signToken()

  return NextResponse.json({ token })
}
