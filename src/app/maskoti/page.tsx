import type { Metadata } from 'next'
import { MascotCard } from '@/components/MascotCard'
import { getCategories, getMascots, getSeoForPath } from '@/lib/queries'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoForPath('/maskoti')
  return {
    title: seo?.meta_title ?? 'Nabídka maskotů',
    description: seo?.meta_description ?? 'Kompletní nabídka maskotů k zapůjčení i koupi. Zasíláme po celé ČR.',
  }
}

export default async function MaskotiPage({
  searchParams,
}: {
  searchParams: { kategorie?: string; typ?: string }
}) {
  const [categories, mascots] = await Promise.all([
    getCategories(),
    getMascots({
      categorySlug: searchParams.kategorie,
      forRental: searchParams.typ === 'pujceni' ? true : undefined,
      forSale: searchParams.typ === 'prodej' ? true : undefined,
    }),
  ])

  return (
    <div className="container-app py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">Nabídka maskotů</h1>
        <p className="mt-3 text-ink/70">Vyberte si maskota na vaši oslavu — k zapůjčení i ke koupi, po celé ČR.</p>
      </header>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <FilterLink href="/maskoti" active={!searchParams.kategorie && !searchParams.typ} label="Vše" />
        <FilterLink href="/maskoti?typ=pujceni" active={searchParams.typ === 'pujceni'} label="K zapůjčení" />
        <FilterLink href="/maskoti?typ=prodej" active={searchParams.typ === 'prodej'} label="Ke koupi" />
        {categories.map((c) => (
          <FilterLink key={c.id} href={`/maskoti?kategorie=${c.slug}`} active={searchParams.kategorie === c.slug} label={c.name} />
        ))}
      </div>

      {mascots.length === 0 ? (
        <p className="mt-16 text-center text-ink/60">V této kategorii aktuálně nemáme žádné maskoty.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mascots.map((m, i) => (
            <MascotCard key={m.id} mascot={m} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-4 py-2 font-display text-sm font-bold transition-colors',
        active ? 'bg-teal-500 text-white' : 'bg-white text-ink hover:bg-teal-50'
      )}
    >
      {label}
    </Link>
  )
}
