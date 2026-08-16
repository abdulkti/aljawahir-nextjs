import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const UNITS = ['ra', 'sd', 'smp', 'tpa']

function extractAlbumPath(url: string): string {
  try {
    const parts = new URL(url).pathname.split('/')
    return parts.slice(parts.indexOf('album-images') + 1).join('/')
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`album:${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const contentType = req.headers.get('content-type') ?? ''

  // JSON: file sudah diupload langsung oleh browser -> tinggal catat URL-nya.
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => null)
    const unit = body?.unit as string | null
    const caption = (body?.caption as string | null)?.trim() || null
    const url = body?.url as string | null

    if (!unit || !UNITS.includes(unit)) {
      return NextResponse.json({ error: 'Unit tidak valid' }, { status: 400 })
    }
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Foto belum diupload' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('album_foto')
      .insert([{ unit, url, caption }])
      .select('id')
      .single()

    if (error) {
      await supabase.storage.from('album-images').remove([extractAlbumPath(url)])
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id, url })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const unit = formData.get('unit') as string | null
  const caption = (formData.get('caption') as string | null)?.trim() || null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!unit || !UNITS.includes(unit)) {
    return NextResponse.json({ error: 'Unit tidak valid' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${unit}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('album-images')
    .upload(`${unit}/${fileName}`, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('album-images')
    .getPublicUrl(`${unit}/${fileName}`)

  const { data, error } = await supabase
    .from('album_foto')
    .insert([{ unit, url: publicUrl, caption }])
    .select('id')
    .single()

  if (error) {
    await supabase.storage.from('album-images').remove([`${unit}/${fileName}`])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, url: publicUrl })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: row } = await supabase
    .from('album_foto')
    .select('unit')
    .eq('id', id)
    .single()
  if (!row) return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 })

  const { error: clearErr } = await supabase
    .from('album_foto')
    .update({ is_cover: false })
    .eq('unit', row.unit)
  if (clearErr) return NextResponse.json({ error: clearErr.message }, { status: 500 })

  const { error } = await supabase
    .from('album_foto')
    .update({ is_cover: true })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: row } = await supabase
    .from('album_foto')
    .select('url')
    .eq('id', id)
    .single()

  const { error: deleteError } = await supabase
    .from('album_foto')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (row?.url) {
    const storagePath = extractAlbumPath(row.url)
    if (storagePath) {
      await supabase.storage.from('album-images').remove([storagePath])
    }
  }

  return NextResponse.json({ ok: true })
}
