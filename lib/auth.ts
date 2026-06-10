import { NextRequest } from 'next/server'

export function verifyAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false

  const token = auth.slice(7)
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [prefix, timestamp] = decoded.split(':')
    if (prefix !== 'admin') return false

    const issued = parseInt(timestamp, 10)
    if (Date.now() - issued > 86400000) return false

    return true
  } catch {
    return false
  }
}
