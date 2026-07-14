import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { BenefitsSection } from '@/components/BenefitsSection'
import { StatsBar, TestimonialsSection, CtaBanner } from '@/components/HomepageSections'
import { MascotCard } from '@/components/MascotCard'
import { WaveDivider } from '@/components/WaveDivider'
import { getHomepageContent, getMascots, getSeoForPath } from '@/lib/queries'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoForPath('/')
  if (!seo) return {}
  return {
    title: seo.meta_title ?? undefined,
    description: seo.meta_description ?? undefined,
    keywords: seo.keywords ?? undefined,
  }
}

export default async function HomePage() {
  const [content, topMascots] = await Promise.all([
    getHomepageContent(),
    getMascots({ topOffersOnly: true }),
  ])

  const recommended = topMascots.length > 0 ? topMascots : await getMascots({ recommendedOnly: true })

  return (
    <>
      <Hero
        title={content?.hero_title ?? 'Prodej a půjčovna maskotů Praha'}
        subtitle={content?.hero_subtitle ?? 'Maskoty zasíláme po celé ČR. Rozpohybujeme každou vaši oslavu!'}
        ctaPrimaryLabel={content?.cta_primary_label ?? 'Vytvořit poptávku'}
        ctaPrimaryLink={content?.cta_primary_link ?? '/poptavka'}
        ctaSecondaryLabel={content?.cta_secondary_label ?? 'Prohlédnout maskoty'}
        ctaSecondaryLink={content?.cta_secondary_link ?? '/maskoti'}
        heroImage={content?.hero_image_url}
      />

      <BenefitsSection benefits={content?.benefits ?? []} />

      {recommended.length > 0 && (
        <section className="bg-teal-50/60 py-16">
          <div className="container-app">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Naši oblíbení maskoti</h2>
              <Link href="/maskoti" className="hidden font-display text-sm font-bold text-teal-600 sm:block">
                Zobrazit vše →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.slice(0, 8).map((m, i) => (
                <MascotCard key={m.id} mascot={m} index={i} />
              ))}
            </div>
            <Link href="/maskoti" className="btn-outline mt-8 flex w-fit sm:hidden">
              Zobrazit vše
            </Link>
          </div>
        </section>
      )}

      <StatsBar stats={content?.stats ?? []} />
      <TestimonialsSection testimonials={content?.testimonials ?? []} />
      <CtaBanner text={content?.banner_text} link={content?.banner_link} />
    </>
  )
}
