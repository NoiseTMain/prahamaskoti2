'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { MascotPhoto } from '@/types/database'

export function MascotGallery({ photos, mascotName }: { photos: MascotPhoto[]; mascotName: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!photos.length) {
    return <div className="aspect-square rounded-3xl bg-teal-50" />
  }

  const active = photos[activeIndex]!

  function next() {
    setActiveIndex((i) => (i + 1) % photos.length)
  }
  function prev() {
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-3xl bg-teal-50"
      >
        <Image
          src={active.url}
          alt={active.alt_text || mascotName}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 90vw"
          className="object-cover"
        />
      </button>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition ${
                i === activeIndex ? 'ring-teal-500' : 'ring-transparent'
              }`}
            >
              <Image src={p.url} alt={p.alt_text || mascotName} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Galerie fotek — ${mascotName}`}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Zavřít galerii"
            >
              <X className="h-6 w-6" />
            </button>
            {photos.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Předchozí fotka">
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button onClick={next} className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Další fotka">
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}
            <div className="relative h-[80vh] w-full max-w-3xl">
              <Image src={active.url} alt={active.alt_text || mascotName} fill sizes="90vw" className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
