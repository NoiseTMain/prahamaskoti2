import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Truck, Users } from 'lucide-react'
import { getMascotBySlug, getRelatedMascots, getMascots } from '@/lib/queries'
import { MascotGallery } from '@/components/MascotGallery'
import { MascotCard } from '@/components/MascotCard'
import { InquiryForm } from '@/components/InquiryForm'
import { formatPrice } from '@/lib/utils'

export async function generateStaticParams() {
  const mascots = await getMascots()
  return mascots.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const mascot = await getMascotBySlug(params.slug)
  if (!mascot) return {}
  return {
    title: mascot.seo_title ?? mascot.name,
    description: mascot.seo_description ?? mascot.short_description ?? undefined,
    keywords: mascot.seo_keywords ?? undefined,
    openGraph: {
      images: mascot.og_image_url ? [mascot.og_image_url] : mascot.photos?.[0] ? [mascot.photos[0].url] : [],
    },
  }
}

export default async function MascotDetailPage({ params }: { params: { slug: string } }) {
  const mascot = await getMascotBySlug(params.slug)
  if (!mascot) notFound()

  const related = await getRelatedMascots(mascot.id, mascot.category_id)
  const specs = Object.entries(mascot.specifications || {}).filter(([, v]) => v)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: mascot.name,
    description: mascot.short_description ?? mascot.description ?? undefined,
    image: mascot.photos?.map((p) => p.url) ?? [],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      price: mascot.price_rental ?? mascot.price_sale ?? undefined,
      availability: mascot.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div className="container-app py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink/50" aria-label="Drobečková navigace">
        <Link href="/" className="hover:text-teal-600">Domů</Link> /{' '}
        <Link href="/maskoti" className="hover:text-teal-600">Maskoti</Link> /{' '}
        <span className="text-ink">{mascot.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <MascotGallery photos={mascot.photos ?? []} mascotName={mascot.name} />

        <div>
          {mascot.category && (
            <p className="font-display text-sm font-bold uppercase tracking-wide text-teal-500">{mascot.category.name}</p>
          )}
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">{mascot.name}</h1>
          {mascot.short_description && <p className="mt-3 text-ink/70">{mascot.short_description}</p>}

          <div className="mt-6 flex flex-wrap gap-4">
            {mascot.available_for_rental && (
              <div className="rounded-2xl bg-teal-50 px-5 py-3">
                <p className="text-xs font-semibold text-teal-600">Zapůjčení</p>
                <p className="font-display text-xl font-extrabold text-ink">{formatPrice(mascot.price_rental)}<span className="text-sm font-medium text-ink/50"> /den</span></p>
              </div>
            )}
            {mascot.available_for_sale && (
              <div className="rounded-2xl bg-coral-50 px-5 py-3">
                <p className="text-xs font-semibold text-coral-600">Koupě</p>
                <p className="font-display text-xl font-extrabold text-ink">{formatPrice(mascot.price_sale)}</p>
              </div>
            )}
            {mascot.deposit > 0 && (
              <div className="rounded-2xl bg-sunshine-50 px-5 py-3">
                <p className="text-xs font-semibold text-sunshine-700">Kauce</p>
                <p className="font-display text-xl font-extrabold text-ink">{formatPrice(mascot.deposit)}</p>
              </div>
            )}
          </div>

          <ul className="mt-6 space-y-2 text-sm text-ink/80">
            {mascot.has_animator && (
              <li className="flex items-center gap-2"><Users className="h-4 w-4 text-teal-600" /> Možnost objednat s profesionálním animátorem</li>
            )}
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-teal-600" /> Poštovné: {formatPrice(mascot.shipping_price)}</li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${mascot.is_available ? 'text-leaf-600' : 'text-red-500'}`} />
              {mascot.is_available ? 'Aktuálně dostupný' : 'Aktuálně obsazeno — kontaktujte nás pro nejbližší volný termín'}
            </li>
          </ul>

          {specs.length > 0 && (
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
              <h2 className="font-display text-sm font-bold text-ink">Specifikace</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                {specs.map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-ink/50 capitalize">{key.replace(/_/g, ' ')}</dt>
                    <dd className="font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <a href="#poptavka" className="btn-primary mt-8 w-full sm:w-auto">
            Poptat tohoto maskota
          </a>
        </div>
      </div>

      {mascot.description && (
        <div className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-ink">Popis</h2>
          <div className="prose prose-teal mt-3 max-w-none text-ink/80" dangerouslySetInnerHTML={{ __html: mascot.description }} />
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-extrabold text-ink">Související maskoti</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((m, i) => (
              <MascotCard key={m.id} mascot={m} index={i} />
            ))}
          </div>
        </div>
      )}

      <div id="poptavka" className="mx-auto mt-16 max-w-2xl scroll-mt-24 rounded-3xl bg-white p-6 shadow-card sm:p-10">
        <h2 className="text-center font-display text-2xl font-extrabold text-ink">Poptat tohoto maskota</h2>
        <div className="mt-6">
          <InquiryForm mascotId={mascot.id} mascotName={mascot.name} />
        </div>
      </div>
    </div>
  )
}
