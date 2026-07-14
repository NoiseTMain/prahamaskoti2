'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { inquirySchema, type InquiryFormValues } from '@/lib/validations'

export function InquiryForm({ mascotId, mascotName }: { mascotId?: string; mascotName?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      mascot_id: mascotId ?? null,
      service_type: 'pujceni_bez_animatora',
    },
  })

  async function onSubmit(values: InquiryFormValues) {
    setServerError(null)
    try {
      const res = await fetch('/api/poptavka', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Odeslání se nezdařilo, zkuste to prosím znovu.')
      }
      setSubmitted(true)
      reset()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Nastala neočekávaná chyba.')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-leaf-50 p-8 text-center"
        role="status"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-leaf-600" />
        <h3 className="mt-4 font-display text-xl font-extrabold text-ink">Poptávka byla odeslána!</h3>
        <p className="mt-2 text-sm text-ink/70">
          Děkujeme, potvrzení jsme zaslali na váš e-mail. Ozveme se vám co nejdříve.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          Odeslat další poptávku
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {mascotName && (
        <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
          Poptávka na maskota: {mascotName}
        </p>
      )}

      {/* Honeypot proti botům — pro uživatele skryté pole */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Jméno a příjmení" error={errors.name?.message}>
          <input {...register('name')} className="input-field" placeholder="Jan Novák" />
        </Field>
        <Field label="Telefon" error={errors.phone?.message}>
          <input {...register('phone')} className="input-field" placeholder="+420 777 123 456" />
        </Field>
      </div>

      <Field label="E-mail" error={errors.email?.message}>
        <input type="email" {...register('email')} className="input-field" placeholder="jan.novak@email.cz" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Datum akce" error={errors.event_date?.message}>
          <input type="date" {...register('event_date')} className="input-field" />
        </Field>
        <Field label="Místo konání" error={errors.event_location?.message}>
          <input {...register('event_location')} className="input-field" placeholder="Praha" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Typ akce" error={errors.event_type?.message}>
          <input {...register('event_type')} className="input-field" placeholder="Narozeniny" />
        </Field>
        <Field label="Počet hodin" error={errors.hours_count?.message}>
          <input type="number" min={1} max={24} {...register('hours_count')} className="input-field" />
        </Field>
        <Field label="Počet návštěvníků" error={errors.guests_count?.message}>
          <input type="number" min={1} max={2000} {...register('guests_count')} className="input-field" />
        </Field>
      </div>

      <Field label="Typ služby" error={errors.service_type?.message}>
        <select {...register('service_type')} className="input-field">
          <option value="pujceni_bez_animatora">Zapůjčení bez animátora</option>
          <option value="maskot_s_animatorem">Maskot s animátorem</option>
          <option value="koupe_maskota">Koupě maskota</option>
        </select>
      </Field>

      <Field label="Poznámka" error={errors.note?.message}>
        <textarea {...register('note')} rows={4} className="input-field resize-none" placeholder="Napište nám více o vaší akci…" />
      </Field>

      <label className="flex items-start gap-3 text-sm text-ink/80">
        <input type="checkbox" {...register('gdpr_consent')} className="mt-0.5 h-5 w-5 shrink-0 rounded border-teal-300 text-teal-600" />
        <span>
          Souhlasím se zpracováním osobních údajů dle{' '}
          <a href="/gdpr" className="font-semibold text-teal-600 underline">
            zásad ochrany osobních údajů
          </a>
          .
        </span>
      </label>
      {errors.gdpr_consent?.message && <p className="text-sm text-red-600">{errors.gdpr_consent.message}</p>}

      {serverError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Odeslat poptávku
      </button>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 2px solid #cceff1;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          background: white;
        }
        .input-field:focus {
          border-color: #0fa3ad;
          outline: none;
        }
      `}</style>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm font-bold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}
