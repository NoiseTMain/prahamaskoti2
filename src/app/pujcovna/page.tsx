import type { Metadata } from 'next'
import { MascotCard } from '@/components/MascotCard'
import { getMascots, getPricingItems } from '@/lib/queries'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Půjčovna maskotů',
  description: 'Zapůjčení maskotů na dětské oslavy i firemní akce, s animátorem i bez. Zasíláme po celé ČR.',
}

export default async function PujcovnaPage() {
  const [mascots, pricing] = await Promise.all([
    getMascots({ forRental: true }),
    getPricingItems(),
  ])

  return (
    <div className="container-app py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">Půjčovna maskotů</h1>
        <p className="mt-3 text-ink/70">
          Zapůjčíme vám maskota na oslavu, firemní akci nebo veřejné vystoupení — s animátorem i bez.
          Doručujeme po celé České republice.
        </p>
      </header>

      {pricing.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {pricing.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white p-5 shadow-card">
              <p className="font-display font-bold text-ink">{p.label}</p>
              <p className="mt-1 font-display text-lg font-extrabold text-teal-600">
                {formatPrice(p.price)} <span className="text-xs font-medium text-ink/50">{p.unit}</span>
              </p>
              {p.description && <p className="mt-1 text-xs text-ink/60">{p.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mascots.map((m, i) => (
          <MascotCard key={m.id} mascot={m} index={i} />
        ))}
      </div>
    </div>
  )
}
