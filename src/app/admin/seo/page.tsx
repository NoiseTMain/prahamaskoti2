'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import type { SeoSettings } from '@/types/database'

export default function AdminSeoPage() {
  const [items, setItems] = useState<SeoSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [newPath, setNewPath] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/seo')
    const json = await res.json()
    setItems(json.data ?? [])
    setLoading(false)
  }

  async function save(item: SeoSettings) {
    await fetch('/api/admin/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
  }

  async function addPath() {
    if (!newPath.trim()) return
    const res = await fetch('/api/admin/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_path: newPath.startsWith('/') ? newPath : `/${newPath}` }),
    })
    if (res.ok) {
      const json = await res.json()
      setItems((prev) => [...prev, json.data])
      setNewPath('')
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Smazat SEO nastavení pro tuto stránku?')) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    await fetch('/api/admin/seo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  function update(id: string, updates: Partial<SeoSettings>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold text-ink">SEO nastavení</h1>

      <div className="mt-6 flex gap-2 rounded-2xl bg-white p-5 shadow-card">
        <input value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="/nova-stranka" className="input-field" />
        <button onClick={addPath} className="btn-primary !px-4 !py-2 text-sm shrink-0">
          <Plus className="h-4 w-4" /> Přidat stránku
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-teal-600">{item.page_path}</p>
                <button onClick={() => deleteItem(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                <input
                  defaultValue={item.meta_title ?? ''}
                  onBlur={(e) => { update(item.id, { meta_title: e.target.value }); save({ ...item, meta_title: e.target.value }) }}
                  placeholder="Meta Title"
                  className="input-field"
                />
                <textarea
                  defaultValue={item.meta_description ?? ''}
                  onBlur={(e) => { update(item.id, { meta_description: e.target.value }); save({ ...item, meta_description: e.target.value }) }}
                  placeholder="Meta Description"
                  rows={2}
                  className="input-field"
                />
                <input
                  defaultValue={item.keywords ?? ''}
                  onBlur={(e) => { update(item.id, { keywords: e.target.value }); save({ ...item, keywords: e.target.value }) }}
                  placeholder="Klíčová slova (oddělená čárkou)"
                  className="input-field"
                />
                <input
                  defaultValue={item.og_image_url ?? ''}
                  onBlur={(e) => { update(item.id, { og_image_url: e.target.value }); save({ ...item, og_image_url: e.target.value }) }}
                  placeholder="OG Image URL"
                  className="input-field"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.7rem; border: 2px solid #cceff1; padding: 0.5rem 0.8rem; font-size: 0.85rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}
