'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import type { SiteContact } from '@/types/database'

export default function AdminKontaktyPage() {
  const [contact, setContact] = useState<SiteContact | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/contact')
      .then((r) => r.json())
      .then((json) => setContact(json.data))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!contact) return
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !contact) return <Loader2 className="h-6 w-6 animate-spin text-teal-500" />

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-extrabold text-ink">Kontaktní údaje</h1>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <Field label="Telefon">
          <input value={contact.phone ?? ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="input-field" />
        </Field>
        <Field label="E-mail">
          <input value={contact.email ?? ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="input-field" />
        </Field>
        <Field label="Adresa">
          <input value={contact.address ?? ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} className="input-field" />
        </Field>
        <Field label="Bankovní účet">
          <input value={contact.bank_account ?? ''} onChange={(e) => setContact({ ...contact, bank_account: e.target.value })} className="input-field" />
        </Field>
        <Field label="Facebook URL">
          <input value={contact.facebook_url ?? ''} onChange={(e) => setContact({ ...contact, facebook_url: e.target.value })} className="input-field" />
        </Field>
        <Field label="Instagram URL">
          <input value={contact.instagram_url ?? ''} onChange={(e) => setContact({ ...contact, instagram_url: e.target.value })} className="input-field" />
        </Field>
        <Field label="Vložená mapa (embed URL)">
          <input value={contact.map_embed_url ?? ''} onChange={(e) => setContact({ ...contact, map_embed_url: e.target.value })} className="input-field" />
        </Field>

        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? 'Uloženo!' : 'Uložit změny'}
        </button>
      </div>

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.85rem; border: 2px solid #cceff1; padding: 0.6rem 0.9rem; font-size: 0.9rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  )
}
