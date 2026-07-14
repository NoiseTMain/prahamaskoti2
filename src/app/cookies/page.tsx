import type { Metadata } from 'next'
import { getStaticPage } from '@/lib/queries'
import { StaticPageContent } from '@/components/StaticPageContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage('cookies')
  return { title: page?.seo_title ?? 'Zásady cookies', description: page?.seo_description ?? undefined }
}

export default function CookiesPage() {
  return <StaticPageContent slug="cookies" />
}
