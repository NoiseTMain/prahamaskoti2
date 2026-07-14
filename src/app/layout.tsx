import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { getSiteContact } from '@/lib/queries'

const baloo = Baloo_2({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-baloo',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.maskotipraha.cz'),
  title: {
    default: 'Prodej a půjčovna maskotů Praha',
    template: '%s | Maskoti Praha',
  },
  description:
    'Prodej a půjčovna maskotů Praha. Maskoty zasíláme po celé ČR. Zapůjčení s animátorem i bez, prodej maskotů na dětské oslavy i firemní akce.',
  keywords: ['půjčovna maskotů', 'maskoti praha', 'pronájem maskota', 'kostýmy maskotů', 'prodej maskotů'],
  authors: [{ name: 'Prodej a půjčovna maskotů Praha' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Maskoti Praha',
    title: 'Prodej a půjčovna maskotů Praha',
    description: 'Maskoty zasíláme po celé ČR. Zapůjčení s animátorem i bez, prodej maskotů na akce všeho druhu.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prodej a půjčovna maskotů Praha',
    description: 'Maskoty zasíláme po celé ČR.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0FA3AD',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSiteContact()

  return (
    <html lang="cs" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Přeskočit na obsah
        </a>
        <Header contact={contact} />
        <main id="main-content">{children}</main>
        <Footer contact={contact} />
        <CookieConsent />
      </body>
    </html>
  )
}
