import type { Metadata } from 'next'
import { InquiryForm } from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Poptávka',
  description: 'Odešlete nám poptávku na zapůjčení nebo koupi maskota. Ozveme se vám co nejdříve.',
}

export default function PoptavkaPage() {
  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center font-display text-4xl font-extrabold text-ink">Vytvořit poptávku</h1>
        <p className="mt-3 text-center text-ink/70">
          Vyplňte formulář a my se vám ozveme s potvrzením dostupnosti a dalšími detaily.
        </p>
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-card sm:p-10">
          <InquiryForm />
        </div>
      </div>
    </div>
  )
}
