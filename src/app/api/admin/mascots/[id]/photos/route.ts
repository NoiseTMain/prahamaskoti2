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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const body = await request.json()
  const { storagePath, url, altText, width, height } = body

  const { count } = await supabase
    .from('mascot_photos')
    .select('id', { count: 'exact', head: true })
    .eq('mascot_id', params.id)

  const isFirst = (count ?? 0) === 0

  const { data, error } = await supabase
    .from('mascot_photos')
    .insert({
      mascot_id: params.id,
      storage_path: storagePath,
      url,
      alt_text: altText ?? null,
      is_main: isFirst,
      sort_order: count ?? 0,
      width: width ?? null,
      height: height ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Hromadná aktualizace pořadí fotek: [{ id, sort_order }]
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })

  const { photos } = (await request.json()) as { photos: { id: string; sort_order: number }[] }

  const results = await Promise.all(
    photos.map((p) => supabase.from('mascot_photos').update({ sort_order: p.sort_order }).eq('id', p.id).eq('mascot_id', params.id))
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
