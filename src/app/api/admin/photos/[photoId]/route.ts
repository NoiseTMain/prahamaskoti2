import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function DELETE(_request: NextRequest, { params }: { params: { photoId: string } }) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { data: photo } = await supabase.from('mascot_photos').select('*').eq('id', params.photoId).single()
  if (!photo) return NextResponse.json({ error: 'Fotka nenalezena' }, { status: 404 })

  await supabase.storage.from('mascot-photos').remove([photo.storage_path])
  const { error } = await supabase.from('mascot_photos').delete().eq('id', params.photoId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Pokud byla smazána hlavní fotka, nastavit jako hlavní další v pořadí
  if (photo.is_main) {
    const { data: next } = await supabase
      .from('mascot_photos')
      .select('id')
      .eq('mascot_id', photo.mascot_id)
      .order('sort_order')
      .limit(1)
      .maybeSingle()
    if (next) await supabase.from('mascot_photos').update({ is_main: true }).eq('id', next.id)
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: { photoId: string } }) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { setMain } = await request.json()
  const { data: photo } = await supabase.from('mascot_photos').select('mascot_id').eq('id', params.photoId).single()
  if (!photo) return NextResponse.json({ error: 'Fotka nenalezena' }, { status: 404 })

  if (setMain) {
    await supabase.from('mascot_photos').update({ is_main: false }).eq('mascot_id', photo.mascot_id)
    await supabase.from('mascot_photos').update({ is_main: true }).eq('id', params.photoId)
  }

  return NextResponse.json({ success: true })
}
