import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Nepřihlášený uživatel vidí pouze přihlašovací formulář (bez administračního rozhraní)
  if (!user) {
    return <>{children}</>
  }

  const { data: profile } = await supabase.from('admin_profiles').select('*').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen bg-teal-50/40">
      <AdminSidebar adminName={profile?.full_name ?? user.email ?? 'Administrátor'} role={profile?.role ?? 'editor'} />
      <div className="flex-1 lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
