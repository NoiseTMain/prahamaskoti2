import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mascotSchema } from '@/lib/validations'

async function requireAdmin() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('admin_profiles').select('*').eq('id', user.id).single()
  if (!profile?.is_active) return null
  return { supabase, profile }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { data, error } = await auth.supabase
    .from('mascots')
    .select('*, category:categories(*), photos:mascot_photos(*)')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  if (auth.profile.role === 'viewer') return NextResponse.json({ error: 'Nedostatečná oprávnění' }, { status: 403 })

  const json = await request.json()
  const parsed = mascotSchema.partial().safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná data.', details: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await auth.supabase.from('mascots').update(parsed.data).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  if (auth.profile.role !== 'superadmin' && auth.profile.role !== 'editor') {
    return NextResponse.json({ error: 'Nedostatečná oprávnění' }, { status: 403 })
  }

  // Smazat fotky ze storage před smazáním záznamu
  const { data: photos } = await auth.supabase.from('mascot_photos').select('storage_path').eq('mascot_id', params.id)
  if (photos && photos.length > 0) {
    await auth.supabase.storage.from('mascot-photos').remove(photos.map((p) => p.storage_path))
  }

  const { error } = await auth.supabase.from('mascots').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
