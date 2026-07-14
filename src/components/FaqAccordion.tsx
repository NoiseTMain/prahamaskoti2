'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/types/database'

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display font-bold text-ink">{item.question}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-teal-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <p className="px-6 pb-5 text-sm text-ink/70">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
