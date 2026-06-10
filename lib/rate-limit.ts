const hits = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, max: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = hits.get(key)

  if (!record || now > record.reset) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return true
  }

  if (record.count >= max) return false

  record.count++
  return true
}
