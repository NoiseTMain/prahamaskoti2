'use client'

import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Users, Heart, Sparkle } from 'lucide-react'
import type { Benefit } from '@/types/database'

const ICONS: Record<string, React.ElementType> = {
  truck: Truck,
  shield: ShieldCheck,
  users: Users,
  heart: Heart,
}

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  if (!benefits?.length) return null

  return (
    <section className="container-app py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-coral-600">
          <Sparkle className="h-4 w-4" /> Proč zvolit nás
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Vaše oslava na jedné doméně
        </h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => {
          const Icon = ICONS[b.icon] ?? Sparkle
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-3xl bg-white p-6 text-center shadow-card"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{b.text}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
