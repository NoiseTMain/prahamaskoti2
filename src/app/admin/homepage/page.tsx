'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import type { HomepageContent, Benefit, Stat, Testimonial } from '@/types/database'

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((r) => r.json())
      .then((json) => setContent(json.data))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!content) return
    setSaving(true)
    await fetch('/api/admin/homepage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !content) return <Loader2 className="h-6 w-6 animate-spin text-teal-500" />

  const benefits = content.benefits ?? []
  const stats = content.stats ?? []
  const testimonials = content.testimonials ?? []

  function updateBenefit(index: number, updates: Partial<Benefit>) {
    const next = [...benefits]
    next[index] = { ...next[index], ...updates } as Benefit
    setContent({ ...content!, benefits: next })
  }
  function updateStat(index: number, updates: Partial<Stat>) {
    const next = [...stats]
    next[index] = { ...next[index], ...updates } as Stat
    setContent({ ...content!, stats: next })
  }
  function updateTestimonial(index: number, updates: Partial<Testimonial>) {
    const next = [...testimonials]
    next[index] = { ...next[index], ...updates } as Testimonial
    setContent({ ...content!, testimonials: next })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">Domovská stránka</h1>
        <button onClick={save} disabled={saving} className="btn-primary !px-4 !py-2 text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? 'Uloženo!' : 'Uložit vše'}
        </button>
      </div>

      <Section title="Hero sekce">
        <Field label="Hlavní nadpis">
          <input value={content.hero_title ?? ''} onChange={(e) => setContent({ ...content, hero_title: e.target.value })} className="input-field" />
        </Field>
        <Field label="Podnadpis">
          <textarea value={content.hero_subtitle ?? ''} onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })} rows={2} className="input-field" />
        </Field>
        <Field label="URL hero obrázku">
          <input value={content.hero_image_url ?? ''} onChange={(e) => setContent({ ...content, hero_image_url: e.target.value })} className="input-field" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primární tlačítko — text">
            <input value={content.cta_primary_label ?? ''} onChange={(e) => setContent({ ...content, cta_primary_label: e.target.value })} className="input-field" />
          </Field>
          <Field label="Primární tlačítko — odkaz">
            <input value={content.cta_primary_link ?? ''} onChange={(e) => setContent({ ...content, cta_primary_link: e.target.value })} className="input-field" />
          </Field>
          <Field label="Sekundární tlačítko — text">
            <input value={content.cta_secondary_label ?? ''} onChange={(e) => setContent({ ...content, cta_secondary_label: e.target.value })} className="input-field" />
          </Field>
          <Field label="Sekundární tlačítko — odkaz">
            <input value={content.cta_secondary_link ?? ''} onChange={(e) => setContent({ ...content, cta_secondary_link: e.target.value })} className="input-field" />
          </Field>
        </div>
      </Section>

      <Section title="Banner">
        <Field label="Text banneru">
          <input value={content.banner_text ?? ''} onChange={(e) => setContent({ ...content, banner_text: e.target.value })} className="input-field" />
        </Field>
        <Field label="Odkaz banneru">
          <input value={content.banner_link ?? ''} onChange={(e) => setContent({ ...content, banner_link: e.target.value })} className="input-field" />
        </Field>
      </Section>

      <Section title="Výhody (benefity)">
        {benefits.map((b, i) => (
          <div key={i} className="grid grid-cols-[1fr,1fr,auto] gap-2 rounded-xl bg-teal-50/50 p-3">
            <input value={b.title} onChange={(e) => updateBenefit(i, { title: e.target.value })} placeholder="Titulek" className="input-field" />
            <input value={b.text} onChange={(e) => updateBenefit(i, { text: e.target.value })} placeholder="Text" className="input-field" />
            <button onClick={() => setContent({ ...content, benefits: benefits.filter((_, idx) => idx !== i) })} className="rounded-lg p-2 text-red-500 hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setContent({ ...content, benefits: [...benefits, { icon: 'heart', title: '', text: '' }] })}
          className="btn-outline !px-4 !py-2 text-sm"
        >
          <Plus className="h-4 w-4" /> Přidat výhodu
        </button>
      </Section>

      <Section title="Statistiky">
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr,1fr,auto] gap-2 rounded-xl bg-teal-50/50 p-3">
            <input value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="Hodnota (např. 500+)" className="input-field" />
            <input value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="Popisek" className="input-field" />
            <button onClick={() => setContent({ ...content, stats: stats.filter((_, idx) => idx !== i) })} className="rounded-lg p-2 text-red-500 hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={() => setContent({ ...content, stats: [...stats, { value: '', label: '' }] })} className="btn-outline !px-4 !py-2 text-sm">
          <Plus className="h-4 w-4" /> Přidat statistiku
        </button>
      </Section>

      <Section title="Reference">
        {testimonials.map((t, i) => (
          <div key={i} className="space-y-2 rounded-xl bg-teal-50/50 p-3">
            <div className="grid grid-cols-[1fr,auto,auto] gap-2">
              <input value={t.name} onChange={(e) => updateTestimonial(i, { name: e.target.value })} placeholder="Jméno" className="input-field" />
              <input type="number" min={1} max={5} value={t.rating} onChange={(e) => updateTestimonial(i, { rating: Number(e.target.value) })} className="input-field w-20" />
              <button onClick={() => setContent({ ...content, testimonials: testimonials.filter((_, idx) => idx !== i) })} className="rounded-lg p-2 text-red-500 hover:bg-red-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea value={t.text} onChange={(e) => updateTestimonial(i, { text: e.target.value })} placeholder="Text reference" rows={2} className="input-field" />
          </div>
        ))}
        <button
          onClick={() => setContent({ ...content, testimonials: [...testimonials, { name: '', text: '', rating: 5 }] })}
          className="btn-outline !px-4 !py-2 text-sm"
        >
          <Plus className="h-4 w-4" /> Přidat referenci
        </button>
      </Section>

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.7rem; border: 2px solid #cceff1; padding: 0.5rem 0.8rem; font-size: 0.85rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-teal-600">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
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
