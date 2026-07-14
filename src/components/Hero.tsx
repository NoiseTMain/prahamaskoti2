'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PartyPopper, Sparkles } from 'lucide-react'
import { WaveDivider } from './WaveDivider'

export function Hero({
  title,
  subtitle,
  ctaPrimaryLabel,
  ctaPrimaryLink,
  ctaSecondaryLabel,
  ctaSecondaryLink,
  heroImage,
}: {
  title: string
  subtitle: string
  ctaPrimaryLabel: string
  ctaPrimaryLink: string
  ctaSecondaryLabel: string
  ctaSecondaryLink: string
  heroImage?: string | null
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sunshine-100 via-sunshine-50 to-cream pt-14 pb-0 sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-bubblegum-300/40 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -right-10 top-32 h-56 w-56 rounded-full bg-teal-300/30 blur-3xl" />

      <div className="container-app relative grid items-center gap-10 pb-16 lg:grid-cols-2 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 font-display text-sm font-bold text-coral-600 shadow-sm">
            <Sparkles className="h-4 w-4" /> Maskoty zasíláme po celé ČR
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ctaPrimaryLink} className="btn-primary">
              <PartyPopper className="h-5 w-5" /> {ctaPrimaryLabel}
            </Link>
            <Link href={ctaSecondaryLink} className="btn-secondary">
              {ctaSecondaryLabel}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto aspect-[4/3] w-full max-w-xl animate-float"
        >
          <div className="relative h-full w-full overflow-hidden rounded-blob shadow-2xl">
            <Image
              src={heroImage || '/images/hero-placeholder.jpg'}
              alt="Veselí maskoti na dětské oslavě"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>

      <WaveDivider />
    </section>
  )
}
