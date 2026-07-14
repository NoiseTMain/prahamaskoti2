import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getGalleryAlbums } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Galerie z akcí',
  description: 'Podívejte se na fotografie z akcí, kde jste mohli potkat naše maskoty.',
}

export default async function GaleriePage({ searchParams }: { searchParams: { kategorie?: string } }) {
  const albums = await getGalleryAlbums(searchParams.kategorie)
  const categories = Array.from(new Set(albums.map((a) => a.category).filter(Boolean))) as string[]

  return (
    <div className="container-app py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">Galerie z akcí</h1>
        <p className="mt-3 text-ink/70">Podívejte se, jak naši maskoti rozpohybovali oslavy po celé ČR.</p>
      </header>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/galerie" className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold text-ink hover:bg-teal-50">Vše</Link>
          {categories.map((c) => (
            <Link key={c} href={`/galerie?kategorie=${encodeURIComponent(c)}`} className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold text-ink hover:bg-teal-50">
              {c}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <Link key={album.id} href={`/galerie/${album.slug}`} className="group overflow-hidden rounded-3xl bg-white shadow-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-teal-50">
              {album.cover_photo_url && (
                <Image
                  src={album.cover_photo_url}
                  alt={album.title}
                  fill
                  sizes="(min-width:1024px) 380px, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-5">
              <h2 className="font-display text-lg font-bold text-ink">{album.title}</h2>
              {album.event_date && <p className="mt-1 text-sm text-ink/50">{formatDate(album.event_date)}</p>}
            </div>
          </Link>
        ))}
      </div>

      {albums.length === 0 && <p className="mt-16 text-center text-ink/60">Zatím zde nejsou žádná alba.</p>}
    </div>
  )
}
