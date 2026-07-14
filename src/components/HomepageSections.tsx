'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Link from 'next/link'
import type { Stat, Testimonial } from '@/types/database'

export function StatsBar({ stats }: { stats: Stat[] }) {
  if (!stats?.length) return null
  return (
    <section className="bg-teal-600 py-12">
      <div className="container-app grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-teal-100">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null
  return (
    <section className="container-app py-16">
      <h2 className="text-center font-display text-3xl font-extrabold text-ink sm:text-4xl">Reference</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-3xl bg-white p-6 shadow-card"
          >
            <div className="flex gap-0.5 text-sunshine-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`h-4 w-4 ${idx < t.rating ? 'fill-current' : 'text-teal-100'}`} />
              ))}
            </div>
            <p className="mt-3 text-sm text-ink/80">{t.text}</p>
            <p className="mt-4 font-display text-sm font-bold text-ink">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function CtaBanner({ text, link }: { text?: string | null; link?: string | null }) {
  if (!text) return null
  return (
    <section className="container-app pb-16">
      <div className="flex flex-col items-center justify-between gap-5 rounded-blob bg-gradient-to-r from-bubblegum-500 to-coral-500 p-8 text-center sm:flex-row sm:text-left sm:p-10">
        <p className="font-display text-xl font-extrabold text-white sm:text-2xl">{text}</p>
        <Link href={link || '/poptavka'} className="shrink-0 rounded-full bg-white px-6 py-3 font-display text-sm font-bold text-coral-600 shadow-button transition-transform hover:-translate-y-0.5">
          Vytvořit poptávku
        </Link>
      </div>
    </section>
  )
}
