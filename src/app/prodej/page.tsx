import type { Metadata } from 'next'
import { MascotCard } from '@/components/MascotCard'
import { getMascots } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Prodej maskotů',
  description: 'Trvalá koupě maskotů pro váš klub, školku, firmu nebo eventovou agenturu.',
}

export default async function ProdejPage() {
  const mascots = await getMascots({ forSale: true })

  return (
    <div className="container-app py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">Prodej maskotů</h1>
        <p className="mt-3 text-ink/70">
          Vybrané maskoty nabízíme i k trvalé koupi — ideální pro školky, kluby, eventové agentury i firmy.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mascots.map((m, i) => (
          <MascotCard key={m.id} mascot={m} index={i} />
        ))}
      </div>

      {mascots.length === 0 && <p className="mt-16 text-center text-ink/60">Aktuálně nemáme žádné maskoty k prodeji.</p>}
    </div>
  )
}
