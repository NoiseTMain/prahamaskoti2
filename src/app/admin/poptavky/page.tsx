'use client'

import { useEffect, useState } from 'react'
import { Loader2, Phone, Mail } from 'lucide-react'
import type { Inquiry, InquiryStatus } from '@/types/database'
import { formatDate, serviceTypeLabel } from '@/lib/utils'

const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'Nová',
  contacted: 'Kontaktováno',
  confirmed: 'Potvrzeno',
  closed: 'Uzavřeno',
  cancelled: 'Zrušeno',
}

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-coral-50 text-coral-700',
  contacted: 'bg-sunshine-50 text-sunshine-700',
  confirmed: 'bg-leaf-50 text-leaf-700',
  closed: 'bg-teal-50 text-teal-700',
  cancelled: 'bg-red-50 text-red-700',
}

export default function AdminPoptavkyPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')

  useEffect(() => {
    fetch('/api/admin/inquiries')
      .then((r) => r.json())
      .then((json) => setInquiries(json.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Poptávky</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label={`Vše (${inquiries.length})`} />
        {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)} label={STATUS_LABELS[s]} />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
        ) : (
          filtered.map((inq) => (
            <div key={inq.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-ink">{inq.name}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/60">
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-teal-600"><Phone className="h-3.5 w-3.5" />{inq.phone}</a>
                    <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-teal-600"><Mail className="h-3.5 w-3.5" />{inq.email}</a>
                  </div>
                </div>
                <select
                  value={inq.status}
                  onChange={(e) => updateStatus(inq.id, e.target.value as InquiryStatus)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-bold ${STATUS_COLORS[inq.status]}`}
                >
                  {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink/70 sm:grid-cols-4">
                <p><span className="text-ink/40">Maskot:</span> {inq.mascot?.name ?? '—'}</p>
                <p><span className="text-ink/40">Služba:</span> {serviceTypeLabel(inq.service_type)}</p>
                <p><span className="text-ink/40">Datum akce:</span> {inq.event_date ? formatDate(inq.event_date) : '—'}</p>
                <p><span className="text-ink/40">Přijato:</span> {formatDate(inq.created_at)}</p>
              </div>
              {inq.note && <p className="mt-2 rounded-xl bg-teal-50/60 p-3 text-xs text-ink/70">{inq.note}</p>}
            </div>
          ))
        )}
        {!loading && filtered.length === 0 && <p className="py-10 text-center text-ink/40">Žádné poptávky v této kategorii.</p>}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
        active ? 'bg-teal-500 text-white' : 'bg-white text-ink/60 hover:bg-teal-50'
      }`}
    >
      {label}
    </button>
  )
}
