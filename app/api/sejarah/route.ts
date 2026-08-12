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
  return rateLimit(`sejarah:${ip}`, 30, 60000)
}

async function removeStorageFile(supabase: ReturnType<typeof adminClient>, url: string) {
  try {
    const parts = new URL(url).pathname.split('/')
    const storagePath = parts.slice(parts.indexOf('album-images') + 1).join('/')
    if (storagePath) {
      await supabase.storage.from('album-images').remove([storagePath])
    }
  } catch {
    // abaikan bila url bukan storage supabase
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const tahun = (formData.get('tahun') as string | null)?.trim() ?? ''
  const judul = (formData.get('judul') as string | null)?.trim() ?? ''
  const deskripsi = (formData.get('deskripsi') as string | null)?.trim() ?? ''
  const urutan = parseInt((formData.get('urutan') as string | null) || '0', 10) || 0

  if (!tahun || !judul || !deskripsi) {
    return NextResponse.json({ error: 'Tahun, judul, dan deskripsi wajib diisi' }, { status: 400 })
  }

  const supabase = adminClient()
  let fotoUrl: string | null = null

  if (file) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `sejarah_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('album-images')
      .upload(`sejarah/${fileName}`, file, { upsert: true, contentType: file.type })
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    const { data: { publicUrl } } = supabase.storage
      .from('album-images')
      .getPublicUrl(`sejarah/${fileName}`)
    fotoUrl = publicUrl
  }

  const { data, error } = await supabase
    .from('sejarah')
    .insert([{ tahun, judul, deskripsi, foto_url: fotoUrl, urutan }])
    .select('*')
    .single()

  if (error) {
    if (fotoUrl) await removeStorageFile(supabase, fotoUrl)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const id = (formData.get('id') as string | null)?.trim() ?? ''
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const file = formData.get('file') as File | null
  const removePhoto = formData.get('remove_photo') === '1'

  const tahun = (formData.get('tahun') as string | null)?.trim()
  const judul = (formData.get('judul') as string | null)?.trim()
  const deskripsi = (formData.get('deskripsi') as string | null)?.trim()
  const urutanRaw = formData.get('urutan') as string | null

  const supabase = adminClient()

  const { data: existing } = await supabase
    .from('sejarah')
    .select('foto_url')
    .eq('id', id)
    .single()
  if (!existing) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })

  const patch: Record<string, string | number | null> = { updated_at: new Date().toISOString() }
  if (tahun !== undefined) patch.tahun = tahun
  if (judul !== undefined) patch.judul = judul
  if (deskripsi !== undefined) patch.deskripsi = deskripsi
  if (urutanRaw !== null && urutanRaw !== '') patch.urutan = parseInt(urutanRaw, 10) || 0

  let newFotoUrl: string | null | undefined

  if (removePhoto) {
    newFotoUrl = null
    if (existing.foto_url) await removeStorageFile(supabase, existing.foto_url)
  } else if (file) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `sejarah_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('album-images')
      .upload(`sejarah/${fileName}`, file, { upsert: true, contentType: file.type })
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    const { data: { publicUrl } } = supabase.storage
      .from('album-images')
      .getPublicUrl(`sejarah/${fileName}`)
    newFotoUrl = publicUrl
    if (existing.foto_url) await removeStorageFile(supabase, existing.foto_url)
  }

  if (newFotoUrl !== undefined) patch.foto_url = newFotoUrl

  const { data, error } = await supabase
    .from('sejarah')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    if (newFotoUrl) await removeStorageFile(supabase, newFotoUrl)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

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

  const { data: row } = await supabase
    .from('sejarah')
    .select('foto_url')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('sejarah')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (row?.foto_url) await removeStorageFile(supabase, row.foto_url)

  return NextResponse.json({ ok: true })
}
