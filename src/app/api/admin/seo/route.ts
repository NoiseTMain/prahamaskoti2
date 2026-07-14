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
  const { data, error } = await supabase.from('seo_settings').select('*').order('page_path')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('seo_settings').upsert(body, { onConflict: 'page_path' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: 'Nepřihlášeno' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await supabase.from('seo_settings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
