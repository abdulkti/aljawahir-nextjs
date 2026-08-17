'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { adminHeaders } from '@/lib/admin-headers'
import TulisPage from '@/app/admin/tulis/page'

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem('admin_token')) { router.push('/admin'); return }
    async function load() {
      const res = await fetch(`/api/berita?id=${params.id}`, { headers: adminHeaders() })
      if (!res.ok) { router.push('/admin'); return }
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    load()
  }, [params.id, router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
      ⏳ Memuat data berita...
    </div>
  )

  return <TulisPage editData={data} />
}
