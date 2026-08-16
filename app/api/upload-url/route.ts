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
  const bucket: string = body?.bucket ?? 'berita-images'
  const folder: string | null = body?.folder ?? null

  const isVideo = type.startsWith('video/')
  const isImage = type.startsWith('image/')
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: 'File harus berupa gambar atau video' }, { status: 400 })
  }

  const ALLOWED_BUCKETS = ['berita-images', 'berita-videos', 'album-images']
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: 'Bucket tidak valid' }, { status: 400 })
  }
  if (isVideo && bucket !== 'berita-videos') {
    return NextResponse.json({ error: 'Video hanya untuk berita' }, { status: 400 })
  }
  if (isImage && !['berita-images', 'album-images'].includes(bucket)) {
    return NextResponse.json({ error: 'Bucket gambar tidak valid' }, { status: 400 })
  }

  const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX
  if (size > maxSize) {
    return NextResponse.json(
      { error: isVideo ? 'Ukuran video maks 50MB!' : 'Ukuran gambar maks 10MB!' },
      { status: 400 }
    )
  }

  const ext = (body?.filename?.split('.')?.pop() ?? (isVideo ? 'mp4' : 'jpg')).replace(/[^a-z0-9]/gi, '')
  const rand = Math.random().toString(36).slice(2, 8)

  let fileName: string
  if (bucket === 'berita-images') {
    fileName = `berita_${Date.now()}.${ext}`
  } else if (bucket === 'berita-videos') {
    fileName = `videos/video_${Date.now()}.${ext}`
  } else {
    const ALBUM_FOLDERS = ['ra', 'sd', 'smp', 'tpa', 'sejarah']
    if (!folder || !ALBUM_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: 'Folder tidak valid' }, { status: 400 })
    }
    fileName = `${folder}/album_${Date.now()}_${rand}.${ext}`
  }

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
