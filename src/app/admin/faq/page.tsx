'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, GripVertical } from 'lucide-react'
import type { FaqItem } from '@/types/database'

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/faq')
    const json = await res.json()
    setItems(json.data ?? [])
    setLoading(false)
  }

  async function addItem() {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer, sort_order: items.length, is_published: true }),
    })
    if (res.ok) {
      const json = await res.json()
      setItems((prev) => [...prev, json.data])
      setNewQuestion('')
      setNewAnswer('')
    }
    setSaving(false)
  }

  async function updateItem(id: string, updates: Partial<FaqItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))
    await fetch('/api/admin/faq', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async function deleteItem(id: string) {
    if (!confirm('Smazat tuto otázku?')) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    await fetch('/api/admin/faq', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Časté dotazy (FAQ)</h1>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-display text-sm font-bold uppercase text-teal-600">Přidat novou otázku</h2>
        <div className="mt-3 space-y-3">
          <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Otázka" className="input-field" />
          <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Odpověď" rows={3} className="input-field" />
          <button onClick={addItem} disabled={saving} className="btn-primary !px-4 !py-2 text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Přidat otázku
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-teal-500" />
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <GripVertical className="mt-2 h-4 w-4 shrink-0 text-ink/30" />
                <div className="flex-1 space-y-2">
                  <input
                    defaultValue={item.question}
                    onBlur={(e) => updateItem(item.id, { question: e.target.value })}
                    className="input-field font-semibold"
                  />
                  <textarea
                    defaultValue={item.answer}
                    onBlur={(e) => updateItem(item.id, { answer: e.target.value })}
                    rows={2}
                    className="input-field"
                  />
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink/60">
                    <input
                      type="checkbox"
                      checked={item.is_published}
                      onChange={(e) => updateItem(item.id, { is_published: e.target.checked })}
                    />
                    Zveřejněno
                  </label>
                </div>
                <button onClick={() => deleteItem(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.85rem; border: 2px solid #cceff1; padding: 0.6rem 0.9rem; font-size: 0.9rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}
