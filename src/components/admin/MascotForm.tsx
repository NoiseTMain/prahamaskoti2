'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import slugify from 'slugify'
import Image from 'next/image'
import { Loader2, UploadCloud, Star, Trash2, GripVertical } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { mascotSchema, type MascotFormValues } from '@/lib/validations'
import type { Category, Mascot, MascotPhoto } from '@/types/database'

export function MascotForm({ mascot, categories }: { mascot?: Mascot; categories: Category[] }) {
  const router = useRouter()
  const isEdit = Boolean(mascot)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<MascotPhoto[]>(mascot?.photos?.sort((a, b) => a.sort_order - b.sort_order) ?? [])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MascotFormValues>({
    resolver: zodResolver(mascotSchema),
    defaultValues: mascot
      ? {
          name: mascot.name,
          slug: mascot.slug,
          category_id: mascot.category_id,
          short_description: mascot.short_description,
          description: mascot.description,
          price_rental: mascot.price_rental,
          price_sale: mascot.price_sale,
          deposit: mascot.deposit,
          shipping_price: mascot.shipping_price,
          has_animator: mascot.has_animator,
          available_for_rental: mascot.available_for_rental,
          available_for_sale: mascot.available_for_sale,
          is_available: mascot.is_available,
          is_new: mascot.is_new,
          is_top_offer: mascot.is_top_offer,
          is_recommended: mascot.is_recommended,
          status: mascot.status,
          seo_title: mascot.seo_title,
          seo_description: mascot.seo_description,
          seo_keywords: mascot.seo_keywords,
        }
      : {
          deposit: 0,
          shipping_price: 0,
          has_animator: false,
          available_for_rental: true,
          available_for_sale: false,
          is_available: true,
          is_new: false,
          is_top_offer: false,
          is_recommended: false,
          status: 'active',
        },
  })

  const nameValue = watch('name')
  useEffect(() => {
    if (!isEdit && nameValue) {
      setValue('slug', slugify(nameValue, { lower: true, locale: 'cs', strict: true }))
    }
  }, [nameValue, isEdit, setValue])

  async function onSubmit(values: MascotFormValues) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/admin/mascots/${mascot!.id}` : '/api/admin/mascots', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Uložení se nezdařilo.')

      if (!isEdit) {
        router.push(`/admin/maskoti/${json.data.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba.')
    } finally {
      setSaving(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!mascot) return
      setUploading(true)
      for (const file of acceptedFiles) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('scope', 'mascot')
          formData.append('entityId', mascot.id)

          const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData })
          const uploadJson = await uploadRes.json()
          if (!uploadRes.ok) throw new Error(uploadJson.error)

          const photoRes = await fetch(`/api/admin/mascots/${mascot.id}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              storagePath: uploadJson.storagePath,
              url: uploadJson.url,
              altText: mascot.name,
              width: uploadJson.width,
              height: uploadJson.height,
            }),
          })
          const photoJson = await photoRes.json()
          if (photoRes.ok) setPhotos((prev) => [...prev, photoJson.data])
        } catch (err) {
          console.error(err)
        }
      }
      setUploading(false)
    },
    [mascot]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    disabled: !isEdit || uploading,
  })

  async function deletePhoto(photoId: string) {
    if (!confirm('Smazat tuto fotku?')) return
    const res = await fetch(`/api/admin/photos/${photoId}`, { method: 'DELETE' })
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

  async function setMainPhoto(photoId: string) {
    const res = await fetch(`/api/admin/photos/${photoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setMain: true }),
    })
    if (res.ok) setPhotos((prev) => prev.map((p) => ({ ...p, is_main: p.id === photoId })))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Section title="Základní údaje">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Název" error={errors.name?.message}>
              <input {...register('name')} className="input-field" />
            </Field>
            <Field label="Slug (URL)" error={errors.slug?.message}>
              <input {...register('slug')} className="input-field" />
            </Field>
          </div>
          <Field label="Kategorie">
            <select {...register('category_id')} className="input-field">
              <option value="">Bez kategorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Krátký popis" error={errors.short_description?.message}>
            <input {...register('short_description')} className="input-field" />
          </Field>
          <Field label="Popis" error={errors.description?.message}>
            <textarea {...register('description')} rows={6} className="input-field" />
          </Field>
        </Section>

        <Section title="Ceny">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cena zapůjčení (Kč)"><input type="number" step="1" {...register('price_rental')} className="input-field" /></Field>
            <Field label="Cena koupě (Kč)"><input type="number" step="1" {...register('price_sale')} className="input-field" /></Field>
            <Field label="Kauce (Kč)"><input type="number" step="1" {...register('deposit')} className="input-field" /></Field>
            <Field label="Poštovné (Kč)"><input type="number" step="1" {...register('shipping_price')} className="input-field" /></Field>
          </div>
        </Section>

        <Section title="SEO">
          <Field label="SEO titulek"><input {...register('seo_title')} className="input-field" /></Field>
          <Field label="SEO popis"><textarea rows={2} {...register('seo_description')} className="input-field" /></Field>
          <Field label="Klíčová slova"><input {...register('seo_keywords')} className="input-field" /></Field>
        </Section>

        {isEdit && (
          <Section title="Fotografie">
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-200'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? <Loader2 className="h-8 w-8 animate-spin text-teal-500" /> : <UploadCloud className="h-8 w-8 text-teal-400" />}
              <p className="mt-2 text-sm font-semibold text-ink/70">
                {isDragActive ? 'Pusťte fotky zde…' : 'Přetáhněte fotky sem, nebo klikněte pro výběr'}
              </p>
              <p className="mt-1 text-xs text-ink/40">JPG, PNG, WEBP · max 8 MB · automaticky optimalizováno</p>
            </div>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-teal-50">
                    <Image src={photo.url} alt={photo.alt_text || ''} fill sizes="150px" className="object-cover" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => setMainPhoto(photo.id)} className="rounded-full bg-white p-1.5" aria-label="Nastavit jako hlavní">
                        <Star className={`h-3.5 w-3.5 ${photo.is_main ? 'fill-sunshine-500 text-sunshine-500' : 'text-ink'}`} />
                      </button>
                      <button type="button" onClick={() => deletePhoto(photo.id)} className="rounded-full bg-white p-1.5" aria-label="Smazat fotku">
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                    {photo.is_main && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-sunshine-500 px-2 py-0.5 text-[10px] font-bold text-white">Hlavní</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}
      </div>

      <div className="space-y-6">
        <Section title="Stav a viditelnost">
          <Field label="Stav">
            <select {...register('status')} className="input-field">
              <option value="active">Aktivní</option>
              <option value="draft">Koncept</option>
              <option value="inactive">Neaktivní</option>
            </select>
          </Field>
          <Checkbox label="Dostupný (není obsazeno)" {...register('is_available')} />
          <Checkbox label="Nabízeno k zapůjčení" {...register('available_for_rental')} />
          <Checkbox label="Nabízeno k prodeji" {...register('available_for_sale')} />
          <Checkbox label="Možnost animátora" {...register('has_animator')} />
        </Section>

        <Section title="Štítky">
          <Checkbox label="Novinka" {...register('is_new')} />
          <Checkbox label="TOP nabídka" {...register('is_top_offer')} />
          <Checkbox label="Doporučeno" {...register('is_recommended')} />
        </Section>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? 'Uložit změny' : 'Vytvořit maskota'}
        </button>
      </div>

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.85rem; border: 2px solid #cceff1; padding: 0.6rem 0.9rem; font-size: 0.9rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-teal-600">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string }>(
  function CheckboxInner({ label, ...rest }, ref) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold text-ink">
      <input type="checkbox" ref={ref} {...rest} className="h-5 w-5 rounded border-teal-300 text-teal-600" />
      {label}
    </label>
  )
}
)
