import { createClient } from '@/lib/supabase/server'
import { MascotForm } from '@/components/admin/MascotForm'

export default async function NewMascotPage() {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Přidat maskota</h1>
      <p className="mt-1 text-sm text-ink/60">Fotky bude možné nahrát po uložení základních údajů.</p>
      <div className="mt-6">
        <MascotForm categories={categories ?? []} />
      </div>
    </div>
  )
}
