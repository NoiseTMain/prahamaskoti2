import type { Metadata } from 'next'
import { getFaqItems } from '@/lib/queries'
import { FaqAccordion } from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Časté dotazy',
  description: 'Odpovědi na nejčastější dotazy k zapůjčení a koupi maskotů.',
}

export default async function FaqPage() {
  const items = await getFaqItems()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <div className="container-app py-14">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center font-display text-4xl font-extrabold text-ink">Časté dotazy</h1>
        <div className="mt-10">
          <FaqAccordion items={items} />
        </div>
      </div>
    </div>
  )
}
