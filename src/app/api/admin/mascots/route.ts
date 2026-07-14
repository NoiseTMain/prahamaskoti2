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

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { data, error } = await auth.supabase
    .from('mascots')
    .select('*, category:categories(*), photos:mascot_photos(*)')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  if (auth.profile.role === 'viewer') return NextResponse.json({ error: 'Nedostatečná oprávnění' }, { status: 403 })

  const json = await request.json()
  const parsed = mascotSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná data.', details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: existing } = await auth.supabase.from('mascots').select('id').eq('slug', parsed.data.slug).maybeSingle()
  if (existing) {
    return NextResponse.json({ error: 'Maskot s tímto slugem již existuje.' }, { status: 409 })
  }

  const { data, error } = await auth.supabase.from('mascots').insert(parsed.data).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
