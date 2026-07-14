import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'
import { randomUUID } from 'crypto'

async function requireAdmin() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('admin_profiles').select('*').eq('id', user.id).single()
  if (!profile?.is_active) return null
  return supabase
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 8 * 1024 * 1024 // 8 MB
const BUCKET_MAP: Record<string, string> = {
  mascot: 'mascot-photos',
  gallery: 'gallery-photos',
  site: 'site-assets',
}

export async function POST(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const scope = (formData.get('scope') as string) || 'mascot'
  const entityId = formData.get('entityId') as string | null

  if (!file) return NextResponse.json({ error: 'Chybí soubor.' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Nepodporovaný formát souboru. Použijte JPG, PNG nebo WEBP.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Soubor je příliš velký (max 8 MB).' }, { status: 400 })
  }

  const bucket = BUCKET_MAP[scope] ?? 'site-assets'
  const buffer = Buffer.from(await file.arrayBuffer())

  // Optimalizace: konverze na WebP, omezení maximální šířky, komprese
  const optimized = await sharp(buffer)
    .rotate() // respektuje EXIF orientaci
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()

  const metadata = await sharp(optimized).metadata()
  const fileName = `${entityId ?? 'misc'}/${randomUUID()}.webp`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, optimized, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return NextResponse.json({
    storagePath: fileName,
    url: publicUrl.publicUrl,
    width: metadata.width,
    height: metadata.height,
  })
}
