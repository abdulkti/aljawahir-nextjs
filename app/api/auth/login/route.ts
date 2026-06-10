import { NextRequest, NextResponse } from 'next/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin'
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'aljawahir2024'

function hashPassword(password: string): Buffer {
  return scryptSync(password, ADMIN_USERNAME, 64)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`login:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  if (username !== ADMIN_USERNAME) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const inputHash = hashPassword(password)
  const storedHash = hashPassword(ADMIN_SECRET)

  if (inputHash.length !== storedHash.length || !timingSafeEqual(inputHash, storedHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = Buffer.from(`admin:${Date.now()}`).toString('base64')

  return NextResponse.json({ token })
}
