import { notFound } from 'next/navigation'
import { getStaticPage } from '@/lib/queries'

export async function StaticPageContent({ slug }: { slug: string }) {
  const page = await getStaticPage(slug)
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
