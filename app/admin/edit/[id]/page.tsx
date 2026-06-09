'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TulisPage from '@/app/admin/tulis/page'

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== '1') { router.push('/admin'); return }
    async function load() {
      const { data, error } = await supabase.from('berita').select('*').eq('id', params.id).single()
      if (error) { router.push('/admin'); return }
      setData(data)
      setLoading(false)
    }
    load()
  }, [params.id, router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
      ⏳ Memuat data berita...
    </div>
  )

  return <TulisPage editData={data} />
}
