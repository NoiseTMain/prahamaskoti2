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

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gallery_albums')
    .select('*, photos:gallery_photos(*)')
    .order('sort_order', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('gallery_albums').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  const { id, ...updates } = await request.json()
  const { data, error } = await supabase.from('gallery_albums').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  const { id } = await request.json()

  const { data: photos } = await supabase.from('gallery_photos').select('storage_path').eq('album_id', id)
  if (photos && photos.length > 0) {
    await supabase.storage.from('gallery-photos').remove(photos.map((p) => p.storage_path))
  }

  const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
