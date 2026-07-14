import { createClient } from '@/lib/supabase/server'
import { PawPrint, Mail, Image as ImageIcon, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatDate, serviceTypeLabel } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const [mascotsCount, inquiriesCount, photosCount, recentInquiries] = await Promise.all([
    supabase.from('mascots').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }),
    supabase.from('mascot_photos').select('id', { count: 'exact', head: true }),
    supabase
      .from('inquiries')
      .select('id, name, email, service_type, status, created_at, mascot:mascots(name)')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const stats = [
    { label: 'Maskoti', value: mascotsCount.count ?? 0, icon: PawPrint, color: 'bg-teal-500' },
    { label: 'Poptávky celkem', value: inquiriesCount.count ?? 0, icon: Mail, color: 'bg-coral-500' },
    { label: 'Fotky', value: photosCount.count ?? 0, icon: ImageIcon, color: 'bg-bubblegum-500' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
            <div className={`rounded-xl ${s.color} p-3 text-white`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">{s.value}</p>
              <p className="text-sm text-ink/60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <TrendingUp className="h-5 w-5 text-teal-600" /> Poslední poptávky
          </h2>
          <Link href="/admin/poptavky" className="text-sm font-semibold text-teal-600">Zobrazit vše →</Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-teal-100 text-ink/50">
                <th className="pb-2 font-semibold">Jméno</th>
                <th className="pb-2 font-semibold">Maskot</th>
                <th className="pb-2 font-semibold">Typ služby</th>
                <th className="pb-2 font-semibold">Stav</th>
                <th className="pb-2 font-semibold">Datum</th>
              </tr>
            </thead>
            <tbody>
              {(recentInquiries.data ?? []).map((inq: any) => (
                <tr key={inq.id} className="border-b border-teal-50 last:border-0">
                  <td className="py-2.5 font-semibold text-ink">{inq.name}</td>
                  <td className="py-2.5 text-ink/70">{inq.mascot?.name ?? '—'}</td>
                  <td className="py-2.5 text-ink/70">{serviceTypeLabel(inq.service_type)}</td>
                  <td className="py-2.5">
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">{inq.status}</span>
                  </td>
                  <td className="py-2.5 text-ink/50">{formatDate(inq.created_at)}</td>
                </tr>
              ))}
              {(recentInquiries.data ?? []).length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-ink/40">Zatím žádné poptávky.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
