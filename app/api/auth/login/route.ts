import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'aljawahir2024'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`login:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  const { password } = await req.json()

  if (!password || password !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = Buffer.from(`admin:${Date.now()}`).toString('base64')

  return NextResponse.json({ token })
}
