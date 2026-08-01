import type { MetadataRoute } from 'next'
import { supabaseServer } from '@/lib/supabase'
import { Berita } from '@/types'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aljawahirattarbawi.com'

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  let beritaUrls: MetadataRoute.Sitemap = []
  try {
    const sb = supabaseServer()
    const { data } = await sb
      .from('berita')
      .select('slug, updated_at')
      .eq('published', true)

    beritaUrls = (data ?? []).map((b: Pick<Berita, 'slug' | 'updated_at'>) => ({
      url: `${baseUrl}/berita/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    beritaUrls = []
  }

  return [...staticUrls, ...beritaUrls]
}
