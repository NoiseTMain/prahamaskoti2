import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MascotForm } from '@/components/admin/MascotForm'
import type { Mascot } from '@/types/database'

export default async function EditMascotPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: mascot }, { data: categories }] = await Promise.all([
    supabase.from('mascots').select('*, category:categories(*), photos:mascot_photos(*)').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  if (!mascot) notFound()

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Upravit maskota</h1>
      <p className="mt-1 text-sm text-ink/60">{mascot.name}</p>
      <div className="mt-6">
        <MascotForm mascot={mascot as Mascot} categories={categories ?? []} />
      </div>
    </div>
  )
}
