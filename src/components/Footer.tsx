import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, Phone, PawPrint } from 'lucide-react'
import type { SiteContact } from '@/types/database'

export function Footer({ contact }: { contact: SiteContact | null }) {
  return (
    <footer className="mt-24 bg-teal-800 text-teal-50">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
            <PawPrint className="h-6 w-6 text-bubblegum-300" aria-hidden />
            MASKOTI PRAHA
          </div>
          <p className="mt-3 text-sm text-teal-100">
            Prodej a půjčovna maskotů Praha. Maskoty zasíláme po celé ČR.
          </p>
          <div className="mt-4 flex gap-3">
            {contact?.facebook_url && (
              <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-teal-700 p-2 hover:bg-teal-600">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {contact?.instagram_url && (
              <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-teal-700 p-2 hover:bg-teal-600">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-teal-200">Navigace</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/maskoti" className="hover:text-white">Maskoti</Link></li>
            <li><Link href="/pujcovna" className="hover:text-white">Půjčovna</Link></li>
            <li><Link href="/prodej" className="hover:text-white">Prodej</Link></li>
            <li><Link href="/galerie" className="hover:text-white">Galerie z akcí</Link></li>
            <li><Link href="/faq" className="hover:text-white">Časté dotazy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-teal-200">Informace</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/o-nas" className="hover:text-white">O nás</Link></li>
            <li><Link href="/podminky" className="hover:text-white">Obchodní podmínky</Link></li>
            <li><Link href="/gdpr" className="hover:text-white">Ochrana osobních údajů</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-teal-200">Kontakt</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {contact?.phone && (
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white">{contact.phone}</a></li>
            )}
            {contact?.email && (
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
            )}
            {contact?.address && (
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span>{contact.address}</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-teal-700 py-5">
        <div className="container-app flex flex-col items-center justify-between gap-2 text-xs text-teal-300 sm:flex-row">
          <p>© {new Date().getFullYear()} Prodej a půjčovna maskotů Praha. Všechna práva vyhrazena.</p>
          <p className="opacity-70">Design by Adam Horváth</p>
        </div>
      </div>
    </footer>
  )
}
