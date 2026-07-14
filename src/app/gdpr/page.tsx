import type { Metadata } from 'next'
import { getStaticPage } from '@/lib/queries'
import { StaticPageContent } from '@/components/StaticPageContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage('gdpr')
  return { title: page?.seo_title ?? 'Ochrana osobních údajů', description: page?.seo_description ?? undefined }
}

export default function GdprPage() {
  return <StaticPageContent slug="gdpr" />
}
