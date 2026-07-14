'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Mascot } from '@/types/database'
import { formatPrice } from '@/lib/utils'

export function MascotCard({ mascot, index = 0 }: { mascot: Mascot; index?: number }) {
  const mainPhoto = mascot.photos?.find((p) => p.is_main) ?? mascot.photos?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05 }}
    >
      <Link
        href={`/maskoti/${mascot.slug}`}
        className="group block overflow-hidden rounded-3xl bg-white shadow-card transition-transform hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-teal-50">
          {mainPhoto ? (
            <Image
              src={mainPhoto.url}
              alt={mainPhoto.alt_text || mascot.name}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-teal-300">Bez fotky</div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {mascot.is_new && (
              <span className="rounded-full bg-bubblegum-500 px-2.5 py-1 font-display text-xs font-bold text-white">Novinka</span>
            )}
            {mascot.is_top_offer && (
              <span className="rounded-full bg-coral-500 px-2.5 py-1 font-display text-xs font-bold text-white">TOP nabídka</span>
            )}
          </div>
          {!mascot.is_available && (
            <div className="absolute inset-x-0 bottom-0 bg-ink/70 py-1.5 text-center font-display text-xs font-bold text-white">
              Aktuálně obsazeno
            </div>
          )}
        </div>

        <div className="p-5">
          {mascot.category && (
            <p className="font-display text-xs font-bold uppercase tracking-wide text-teal-500">{mascot.category.name}</p>
          )}
          <h3 className="mt-1 font-display text-lg font-bold text-ink">{mascot.name}</h3>
          {mascot.short_description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink/70">{mascot.short_description}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sunshine-700">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs font-bold text-ink/60">Oblíbený maskot</span>
            </div>
            <p className="font-display text-base font-extrabold text-teal-700">
              {formatPrice(mascot.price_rental)}
              {mascot.price_rental && <span className="text-xs font-medium text-ink/50"> /den</span>}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
