import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStaticPage } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage('o-nas')
  return { title: page?.seo_title ?? 'O nás', description: page?.seo_description ?? undefined }
}

export default async function ONasPage() {
  const page = await getStaticPage('o-nas')
  if (!page) notFound()

  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold text-ink">{page.title}</h1>
        <div className="prose prose-teal mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  )
}
