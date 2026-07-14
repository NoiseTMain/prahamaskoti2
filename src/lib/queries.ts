import { createClient } from '@/lib/supabase/server'
import type { Mascot, GalleryAlbum, FaqItem, PricingItem, SiteContact, HomepageContent, Category, StaticPage, SeoSettings } from '@/types/database'

export async function getHomepageContent(): Promise<HomepageContent | null> {
  const supabase = createClient()
  const { data } = await supabase.from('homepage_content').select('*').eq('id', 1).single()
  return data
}

export async function getSiteContact(): Promise<SiteContact | null> {
  const supabase = createClient()
  const { data } = await supabase.from('site_contact').select('*').eq('id', 1).single()
  return data
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order')
  return data ?? []
}

export async function getMascots(filters?: {
  categorySlug?: string
  forRental?: boolean
  forSale?: boolean
  topOffersOnly?: boolean
  recommendedOnly?: boolean
  search?: string
}): Promise<Mascot[]> {
  const supabase = createClient()
  let query = supabase
    .from('mascots')
    .select('*, category:categories(*), photos:mascot_photos(*)')
    .eq('status', 'active')
    .order('sort_order')

  if (filters?.forRental) query = query.eq('available_for_rental', true)
  if (filters?.forSale) query = query.eq('available_for_sale', true)
  if (filters?.topOffersOnly) query = query.eq('is_top_offer', true)
  if (filters?.recommendedOnly) query = query.eq('is_recommended', true)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)

  const { data, error } = await query
  if (error) {
    console.error('getMascots error', error)
    return []
  }

  let results = data ?? []
  if (filters?.categorySlug) {
    results = results.filter((m: any) => m.category?.slug === filters.categorySlug)
  }
  return results as Mascot[]
}

export async function getMascotBySlug(slug: string): Promise<Mascot | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('mascots')
    .select('*, category:categories(*), photos:mascot_photos(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data as Mascot | null
}

export async function getRelatedMascots(mascotId: string, categoryId: string | null): Promise<Mascot[]> {
  const supabase = createClient()
  let query = supabase
    .from('mascots')
    .select('*, photos:mascot_photos(*)')
    .eq('status', 'active')
    .neq('id', mascotId)
    .limit(4)
  if (categoryId) query = query.eq('category_id', categoryId)
  const { data } = await query
  return (data as Mascot[]) ?? []
}

export async function getGalleryAlbums(categoryFilter?: string): Promise<GalleryAlbum[]> {
  const supabase = createClient()
  let query = supabase
    .from('gallery_albums')
    .select('*, photos:gallery_photos(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: false })
  if (categoryFilter) query = query.eq('category', categoryFilter)
  const { data } = await query
  return (data as GalleryAlbum[]) ?? []
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = createClient()
  const { data } = await supabase.from('faq_items').select('*').eq('is_published', true).order('sort_order')
  return data ?? []
}

export async function getPricingItems(): Promise<PricingItem[]> {
  const supabase = createClient()
  const { data } = await supabase.from('pricing_items').select('*').eq('is_active', true).order('sort_order')
  return data ?? []
}

export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  const supabase = createClient()
  const { data } = await supabase.from('static_pages').select('*').eq('slug', slug).single()
  return data
}

export async function getSeoForPath(path: string): Promise<SeoSettings | null> {
  const supabase = createClient()
  const { data } = await supabase.from('seo_settings').select('*').eq('page_path', path).single()
  return data
}
