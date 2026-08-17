import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return secret
}

export interface AdminPayload {
  sub: string
  iat: number
  exp: number
}

export function signToken(): string {
  return jwt.sign({ sub: 'admin' }, getSecret(), { expiresIn: '8h' })
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AdminPayload
  } catch {
    return null
  }
}

export function verifyAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false
  const token = auth.slice(7)
  if (!token) return false
  return verifyToken(token) !== null
}

export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7) || null
}
