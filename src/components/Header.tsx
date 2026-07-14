'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, PawPrint, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SiteContact } from '@/types/database'

const NAV_LINKS = [
  { href: '/', label: 'Domů' },
  { href: '/maskoti', label: 'Maskoti' },
  { href: '/pujcovna', label: 'Půjčovna' },
  { href: '/prodej', label: 'Prodej' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function Header({ contact }: { contact: { phone: string | null } | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/95 backdrop-blur">
      <div className="container-app flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-teal-600 sm:text-2xl">
          <PawPrint className="h-7 w-7 shrink-0 text-bubblegum-500" aria-hidden />
          <span>
            MASKOTI <span className="text-bubblegum-500">PRAHA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hlavní navigace">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 font-display text-sm font-bold transition-colors',
                  active ? 'bg-teal-500 text-white' : 'text-ink hover:bg-teal-50'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {contact?.phone && (
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-display text-sm font-bold text-teal-700">
              <Phone className="h-4 w-4" aria-hidden />
              {contact.phone}
            </a>
          )}
          <Link href="/poptavka" className="btn-primary !px-5 !py-2.5 text-sm">
            Vytvořit poptávku
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-teal-700 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-teal-100 bg-white lg:hidden">
          <nav className="container-app flex flex-col gap-1 py-4" aria-label="Mobilní navigace">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-display text-base font-bold text-ink hover:bg-teal-50"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/poptavka" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Vytvořit poptávku
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
