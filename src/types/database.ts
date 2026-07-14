export type MascotStatus = 'active' | 'inactive' | 'draft'
export type ServiceType = 'pujceni_bez_animatora' | 'maskot_s_animatorem' | 'koupe_maskota'
export type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'closed' | 'cancelled'
export type AdminRole = 'superadmin' | 'editor' | 'viewer'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MascotSpecifications {
  vyska?: string
  material?: string
  vaha?: string
  vekove_omezeni?: string
  [key: string]: string | undefined
}

export interface Mascot {
  id: string
  category_id: string | null
  name: string
  slug: string
  short_description: string | null
  description: string | null
  specifications: MascotSpecifications
  price_rental: number | null
  price_sale: number | null
  deposit: number
  shipping_price: number
  has_animator: boolean
  available_for_rental: boolean
  available_for_sale: boolean
  is_available: boolean
  is_new: boolean
  is_top_offer: boolean
  is_recommended: boolean
  status: MascotStatus
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  category?: Category
  photos?: MascotPhoto[]
}

export interface MascotPhoto {
  id: string
  mascot_id: string
  storage_path: string
  url: string
  alt_text: string | null
  is_main: boolean
  sort_order: number
  width: number | null
  height: number | null
  created_at: string
}

export interface GalleryAlbum {
  id: string
  title: string
  slug: string
  description: string | null
  category: string | null
  event_date: string | null
  cover_photo_url: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  photos?: GalleryPhoto[]
}

export interface GalleryPhoto {
  id: string
  album_id: string
  storage_path: string
  url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface PricingItem {
  id: string
  label: string
  price: number
  unit: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  updated_at: string
}

export interface SiteContact {
  id: number
  phone: string | null
  email: string | null
  address: string | null
  bank_account: string | null
  facebook_url: string | null
  instagram_url: string | null
  map_embed_url: string | null
  updated_at: string
}

export interface Benefit {
  icon: string
  title: string
  text: string
}
export interface Testimonial {
  name: string
  text: string
  rating: number
  avatar_url?: string
}
export interface Stat {
  label: string
  value: string
}

export interface HomepageContent {
  id: number
  hero_image_url: string | null
  hero_title: string | null
  hero_subtitle: string | null
  cta_primary_label: string | null
  cta_primary_link: string | null
  cta_secondary_label: string | null
  cta_secondary_link: string | null
  benefits: Benefit[]
  testimonials: Testimonial[]
  stats: Stat[]
  banner_text: string | null
  banner_link: string | null
  updated_at: string
}

export interface SeoSettings {
  id: string
  page_path: string
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  keywords: string | null
  schema_org: Record<string, unknown> | null
  updated_at: string
}

export interface Inquiry {
  id: string
  mascot_id: string | null
  name: string
  phone: string
  email: string
  event_date: string | null
  event_location: string | null
  event_type: string | null
  hours_count: number | null
  guests_count: number | null
  note: string | null
  service_type: ServiceType
  gdpr_consent: boolean
  status: InquiryStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  mascot?: Pick<Mascot, 'id' | 'name' | 'slug'>
}

export interface StaticPage {
  id: string
  slug: string
  title: string
  content: string
  seo_title: string | null
  seo_description: string | null
  updated_at: string
}

export interface AdminProfile {
  id: string
  full_name: string
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

// Zjednodušený typ pro Supabase klienta (generický přístup bez plného generovaného schématu)
export interface Database {
  public: {
    Tables: {
      mascots: { Row: Mascot; Insert: Partial<Mascot>; Update: Partial<Mascot> }
      mascot_photos: { Row: MascotPhoto; Insert: Partial<MascotPhoto>; Update: Partial<MascotPhoto> }
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> }
      gallery_albums: { Row: GalleryAlbum; Insert: Partial<GalleryAlbum>; Update: Partial<GalleryAlbum> }
      gallery_photos: { Row: GalleryPhoto; Insert: Partial<GalleryPhoto>; Update: Partial<GalleryPhoto> }
      faq_items: { Row: FaqItem; Insert: Partial<FaqItem>; Update: Partial<FaqItem> }
      pricing_items: { Row: PricingItem; Insert: Partial<PricingItem>; Update: Partial<PricingItem> }
      site_contact: { Row: SiteContact; Insert: Partial<SiteContact>; Update: Partial<SiteContact> }
      homepage_content: { Row: HomepageContent; Insert: Partial<HomepageContent>; Update: Partial<HomepageContent> }
      seo_settings: { Row: SeoSettings; Insert: Partial<SeoSettings>; Update: Partial<SeoSettings> }
      inquiries: { Row: Inquiry; Insert: Partial<Inquiry>; Update: Partial<Inquiry> }
      static_pages: { Row: StaticPage; Insert: Partial<StaticPage>; Update: Partial<StaticPage> }
      admin_profiles: { Row: AdminProfile; Insert: Partial<AdminProfile>; Update: Partial<AdminProfile> }
    }
  }
}
