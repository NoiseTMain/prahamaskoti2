import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import type { GalleryAlbum } from '@/types/database'

async function getAlbum(slug: string): Promise<GalleryAlbum | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('gallery_albums')
    .select('*, photos:gallery_photos(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as GalleryAlbum | null
}

export default async function AlbumPage({ params }: { params: { slug: string } }) {
  const album = await getAlbum(params.slug)
  if (!album) notFound()

  return (
    <div className="container-app py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">{album.title}</h1>
        {album.event_date && <p className="mt-2 text-ink/60">{formatDate(album.event_date)}</p>}
        {album.description && <p className="mt-3 text-ink/70">{album.description}</p>}
      </header>

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {(album.photos ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((photo) => (
            <div key={photo.id} className="relative overflow-hidden rounded-2xl bg-teal-50 break-inside-avoid">
              <Image
                src={photo.url}
                alt={photo.caption || album.title}
                width={photo.caption ? 600 : 500}
                height={500}
                sizes="(min-width:1024px) 25vw, 45vw"
                className="w-full object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  )
}
