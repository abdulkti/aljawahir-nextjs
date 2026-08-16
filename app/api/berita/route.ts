import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkAuth(req: NextRequest): boolean {
  if (!verifyAuth(req)) return false
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  return rateLimit(`berita:${ip}`, 60, 60000)
}

let videoColumnChecked = 0
let videoColumnAvailable = false

// Cek (sekali per menit) apakah kolom video_url sudah ada di tabel berita.
// Sebelum migrasi dijalankan, kolom ini belum ada — jadi kita lewati agar
// simpan berita tetap jalan. Setelah migrasi, video otomatis aktif.
async function hasVideoColumn(supabase: ReturnType<typeof adminClient>): Promise<boolean> {
  if (Date.now() - videoColumnChecked > 60000) {
    const { error } = await supabase.from('berita').select('video_url').limit(1)
    videoColumnAvailable = !error
    videoColumnChecked = Date.now()
  }
  return videoColumnAvailable
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const supabase = adminClient()
  let query = supabase.from('berita').select('*').order('created_at', { ascending: false })

  if (id) {
    query = supabase.from('berita').select('*').eq('id', id).order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(id ? data[0] ?? null : data)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || !body.judul?.trim() || !body.isi?.trim()) {
    return NextResponse.json({ error: 'Judul dan isi berita wajib diisi' }, { status: 400 })
  }

  const supabase = adminClient()
  const row: Record<string, string | boolean | null> = {
    judul: body.judul.trim(),
    slug: body.slug?.trim() || null,
    ringkasan: body.ringkasan?.trim() || null,
    isi: body.isi.trim(),
    kategori: body.kategori?.trim() || 'RA',
    penulis: body.penulis?.trim() || null,
    cover_url: body.cover_url || null,
    published: Boolean(body.published),
  }
  if (await hasVideoColumn(supabase)) row.video_url = body.video_url || null

  const { data, error } = await supabase
    .from('berita')
    .insert([row])
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = body?.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const patch: Record<string, string | boolean | null> = { updated_at: new Date().toISOString() }

  if (body.judul !== undefined) patch.judul = String(body.judul).trim()
  if (body.slug !== undefined) patch.slug = String(body.slug).trim()
  if (body.ringkasan !== undefined) patch.ringkasan = body.ringkasan ? String(body.ringkasan).trim() : null
  if (body.isi !== undefined) patch.isi = String(body.isi).trim()
  if (body.kategori !== undefined) patch.kategori = String(body.kategori).trim()
  if (body.penulis !== undefined) patch.penulis = body.penulis ? String(body.penulis).trim() : null
  if (body.cover_url !== undefined) patch.cover_url = body.cover_url || null

  const supabase = adminClient()
  if (body.video_url !== undefined && await hasVideoColumn(supabase)) patch.video_url = body.video_url || null
  if (body.published !== undefined) patch.published = Boolean(body.published)

  const { data, error } = await supabase
    .from('berita')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = adminClient()
  const { error } = await supabase.from('berita').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
