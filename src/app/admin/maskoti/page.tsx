'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import type { Mascot } from '@/types/database'
import { formatPrice } from '@/lib/utils'

export default function AdminMaskotiPage() {
  const [mascots, setMascots] = useState<Mascot[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/mascots')
    const json = await res.json()
    setMascots(json.data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Opravdu smazat maskota „${name}“? Tato akce je nevratná.`)) return
    setDeletingId(id)
    const res = await fetch(`/api/admin/mascots/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMascots((prev) => prev.filter((m) => m.id !== id))
    } else {
      alert('Smazání se nezdařilo.')
    }
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Maskoti</h1>
        <Link href="/admin/maskoti/novy" className="btn-primary !px-4 !py-2 text-sm">
          <Plus className="h-4 w-4" /> Přidat maskota
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-teal-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-teal-100 text-ink/50">
                <th className="px-5 py-3 font-semibold">Foto</th>
                <th className="px-5 py-3 font-semibold">Název</th>
                <th className="px-5 py-3 font-semibold">Kategorie</th>
                <th className="px-5 py-3 font-semibold">Cena (půjčení)</th>
                <th className="px-5 py-3 font-semibold">Stav</th>
                <th className="px-5 py-3 font-semibold">Akce</th>
              </tr>
            </thead>
            <tbody>
              {mascots.map((m) => {
                const mainPhoto = m.photos?.find((p) => p.is_main) ?? m.photos?.[0]
                return (
                  <tr key={m.id} className="border-b border-teal-50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-teal-50">
                        {mainPhoto && <Image src={mainPhoto.url} alt={m.name} fill sizes="48px" className="object-cover" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        {m.name}
                        {m.is_top_offer && <Star className="h-3.5 w-3.5 fill-sunshine-500 text-sunshine-500" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink/60">{m.category?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-ink/60">{formatPrice(m.price_rental)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          m.status === 'active'
                            ? 'bg-leaf-50 text-leaf-700'
                            : m.status === 'draft'
                              ? 'bg-sunshine-50 text-sunshine-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {m.status === 'active' ? 'Aktivní' : m.status === 'draft' ? 'Koncept' : 'Neaktivní'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/maskoti/${m.id}`} className="rounded-lg p-2 text-teal-600 hover:bg-teal-50" aria-label="Upravit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          disabled={deletingId === m.id}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          aria-label="Smazat"
                        >
                          {deletingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {mascots.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-ink/40">Zatím žádní maskoti. Přidejte prvního!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
