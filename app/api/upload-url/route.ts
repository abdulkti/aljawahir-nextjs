import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const IMAGE_MAX = 10 * 1024 * 1024
const VIDEO_MAX = 50 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`upload-url:${ip}`, 20, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const type: string = body?.type ?? ''
  const size: number = Number(body?.size) || 0

  const isVideo = type.startsWith('video/')
  const isImage = type.startsWith('image/')
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: 'File harus berupa gambar atau video' }, { status: 400 })
  }

  const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX
  if (size > maxSize) {
    return NextResponse.json(
      { error: isVideo ? 'Ukuran video maks 50MB!' : 'Ukuran gambar maks 10MB!' },
      { status: 400 }
    )
  }

  const ext = (body?.filename?.split('.')?.pop() ?? (isVideo ? 'mp4' : 'jpg')).replace(/[^a-z0-9]/gi, '')
  const bucket = isVideo ? 'berita-videos' : 'berita-images'
  const fileName = `${isVideo ? 'videos/' : ''}${isVideo ? 'video' : 'berita'}_${Date.now()}.${ext}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(fileName)

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Gagal membuat URL upload' }, { status: 500 })
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    path: data.path,
    token: data.token,
    bucket,
  })
}
