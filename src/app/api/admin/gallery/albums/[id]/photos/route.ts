import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('admin_profiles').select('*').eq('id', user.id).single()
  if (!profile?.is_active) return null
  return supabase
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { storagePath, url, caption } = await request.json()
  const { count } = await supabase.from('gallery_photos').select('id', { count: 'exact', head: true }).eq('album_id', params.id)

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({ album_id: params.id, storage_path: storagePath, url, caption: caption ?? null, sort_order: count ?? 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Pokud album ještě nemá cover fotku, nastavit tuto
  const { data: album } = await supabase.from('gallery_albums').select('cover_photo_url').eq('id', params.id).single()
  if (album && !album.cover_photo_url) {
    await supabase.from('gallery_albums').update({ cover_photo_url: url }).eq('id', params.id)
  }

  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { photoId } = await request.json()
  const { data: photo } = await supabase.from('gallery_photos').select('storage_path').eq('id', photoId).single()
  if (photo) await supabase.storage.from('gallery-photos').remove([photo.storage_path])

  const { error } = await supabase.from('gallery_photos').delete().eq('id', photoId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
