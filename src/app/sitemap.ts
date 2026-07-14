import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maskotipraha.cz'

const STATIC_ROUTES = [
  '', 'maskoti', 'pujcovna', 'prodej', 'galerie', 'faq', 'kontakt', 'o-nas', 'poptavka', 'podminky', 'gdpr', 'cookies',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  const [{ data: mascots }, { data: albums }] = await Promise.all([
    supabase.from('mascots').select('slug, updated_at').eq('status', 'active'),
    supabase.from('gallery_albums').select('slug, updated_at').eq('is_published', true),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))

  const mascotEntries: MetadataRoute.Sitemap = (mascots ?? []).map((m) => ({
    url: `${BASE_URL}/maskoti/${m.slug}`,
    lastModified: new Date(m.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const albumEntries: MetadataRoute.Sitemap = (albums ?? []).map((a) => ({
    url: `${BASE_URL}/galerie/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...mascotEntries, ...albumEntries]
}
