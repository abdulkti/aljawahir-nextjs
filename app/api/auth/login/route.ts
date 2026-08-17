import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_SECRET_HASH = process.env.ADMIN_SECRET_HASH

if (!ADMIN_USERNAME || !ADMIN_SECRET_HASH) {
  console.error('CRITICAL: ADMIN_USERNAME or ADMIN_SECRET_HASH environment variables are not set')
}

export async function POST(req: NextRequest) {
  if (!ADMIN_USERNAME || !ADMIN_SECRET_HASH) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`login:${ip}`, 5, 900000)) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' }, { status: 429 })
  }

  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  if (username !== ADMIN_USERNAME) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, ADMIN_SECRET_HASH)
  if (!valid) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const token = signToken()

  return NextResponse.json({ token })
}
