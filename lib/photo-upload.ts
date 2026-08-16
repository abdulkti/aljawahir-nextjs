import { adminHeaders } from '@/lib/admin-headers'

export function isHeic(file: File): boolean {
  return file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name)
}

// HEIC (foto iPhone) tidak bisa tampil di Chrome/Windows -> konversi ke JPEG.
export async function convertHeic(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })
  const blob = Array.isArray(result) ? result[0] : result
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
}

// Upload langsung browser -> Supabase (signed URL), tanpa lewat server Vercel
// agar file besar tidak terpotong oleh batas ukuran body Vercel.
export function uploadDirect(
  file: File,
  bucket: string,
  folder: string | null = null,
  onProgress?: (pct: number) => void
): Promise<string> {
  return fetch('/api/upload-url', {
    method: 'POST',
    headers: adminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ type: file.type, size: file.size, filename: file.name, bucket, folder }),
  })
    .then(async (res) => {
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error ?? 'Gagal menyiapkan upload')
      return json as { uploadUrl: string; path: string; bucket: string }
    })
    .then((data) => new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', data.uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.bucket}/${data.path}`)
        } else {
          reject(new Error('Gagal mengunggah file'))
        }
      }
      xhr.onerror = () => reject(new Error('Gagal mengunggah file'))
      xhr.send(file)
    }))
}

// Konversi HEIC bila perlu, cek ukuran, lalu unggah. Kembalikan URL publik.
export async function uploadPhoto(
  file: File,
  bucket: string,
  folder: string | null,
  maxSize: number,
  onProgress?: (pct: number) => void
): Promise<string> {
  let f = file
  if (isHeic(f)) f = await convertHeic(f)
  if (f.size > maxSize) {
    throw new Error(`Ukuran gambar melebihi ${Math.round(maxSize / 1024 / 1024)}MB!`)
  }
  return uploadDirect(f, bucket, folder, onProgress)
}
