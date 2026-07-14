import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { getSiteContact } from '@/lib/queries'
import { InquiryForm } from '@/components/InquiryForm'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktní údaje na Prodej a půjčovnu maskotů Praha.',
}

export default async function KontaktPage() {
  const contact = await getSiteContact()

  return (
    <div className="container-app py-14">
      <h1 className="text-center font-display text-4xl font-extrabold text-ink">Kontakt</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <ul className="space-y-4 text-sm">
              {contact?.phone && (
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-teal-50 p-2 text-teal-600"><Phone className="h-5 w-5" /></span>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="font-semibold text-ink hover:text-teal-600">{contact.phone}</a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-teal-50 p-2 text-teal-600"><Mail className="h-5 w-5" /></span>
                  <a href={`mailto:${contact.email}`} className="font-semibold text-ink hover:text-teal-600">{contact.email}</a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-teal-50 p-2 text-teal-600"><MapPin className="h-5 w-5" /></span>
                  <span className="font-semibold text-ink">{contact.address}</span>
                </li>
              )}
            </ul>
            <div className="mt-5 flex gap-3">
              {contact?.facebook_url && (
                <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-teal-50 p-2.5 text-teal-600 hover:bg-teal-100">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {contact?.instagram_url && (
                <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-teal-50 p-2.5 text-teal-600 hover:bg-teal-100">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {contact?.map_embed_url && (
            <div className="aspect-video overflow-hidden rounded-3xl shadow-card">
              <iframe src={contact.map_embed_url} className="h-full w-full" loading="lazy" title="Mapa umístění" />
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-ink">Napište nám</h2>
          <div className="mt-5">
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  )
}
