import type { Metadata } from 'next'
import { getStaticPage } from '@/lib/queries'
import { StaticPageContent } from '@/components/StaticPageContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage('podminky')
  return { title: page?.seo_title ?? 'Obchodní podmínky', description: page?.seo_description ?? undefined }
}

export default function PodminkyPage() {
  return <StaticPageContent slug="podminky" />
}
