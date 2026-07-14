'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { PricingItem } from '@/types/database'

export default function AdminCenikPage() {
  const [items, setItems] = useState<PricingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/pricing')
    const json = await res.json()
    setItems(json.data ?? [])
    setLoading(false)
  }

  async function addItem() {
    const res = await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: 'Nová položka', price: 0, unit: 'Kč', sort_order: items.length, is_active: true }),
    })
    if (res.ok) {
      const json = await res.json()
      setItems((prev) => [...prev, json.data])
    }
  }

  async function updateItem(id: string, updates: Partial<PricingItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))
    await fetch('/api/admin/pricing', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async function deleteItem(id: string) {
    if (!confirm('Smazat tuto položku ceníku?')) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    await fetch('/api/admin/pricing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Ceník</h1>
        <button onClick={addItem} className="btn-primary !px-4 !py-2 text-sm">
          <Plus className="h-4 w-4" /> Přidat položku
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card">
        {loading ? (
          <Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-teal-500" />
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-teal-100 text-ink/50">
                <th className="px-5 py-3 font-semibold">Popisek</th>
                <th className="px-5 py-3 font-semibold">Cena</th>
                <th className="px-5 py-3 font-semibold">Jednotka</th>
                <th className="px-5 py-3 font-semibold">Aktivní</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-teal-50 last:border-0">
                  <td className="px-5 py-2">
                    <input defaultValue={item.label} onBlur={(e) => updateItem(item.id, { label: e.target.value })} className="input-field" />
                  </td>
                  <td className="px-5 py-2">
                    <input type="number" defaultValue={item.price} onBlur={(e) => updateItem(item.id, { price: Number(e.target.value) })} className="input-field w-28" />
                  </td>
                  <td className="px-5 py-2">
                    <input defaultValue={item.unit ?? ''} onBlur={(e) => updateItem(item.id, { unit: e.target.value })} className="input-field w-32" />
                  </td>
                  <td className="px-5 py-2">
                    <input type="checkbox" checked={item.is_active} onChange={(e) => updateItem(item.id, { is_active: e.target.checked })} />
                  </td>
                  <td className="px-5 py-2">
                    <button onClick={() => deleteItem(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx global>{`
        .input-field { border-radius: 0.7rem; border: 2px solid #cceff1; padding: 0.4rem 0.7rem; font-size: 0.85rem; width: 100%; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}
