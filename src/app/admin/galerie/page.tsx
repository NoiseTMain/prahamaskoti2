'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import slugify from 'slugify'
import { Plus, Trash2, Loader2, UploadCloud, X } from 'lucide-react'
import type { GalleryAlbum } from '@/types/database'

export default function AdminGaleriePage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/gallery/albums')
    const json = await res.json()
    setAlbums(json.data ?? [])
    setLoading(false)
  }

  async function createAlbum() {
    if (!newAlbumTitle.trim()) return
    const res = await fetch('/api/admin/gallery/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newAlbumTitle,
        slug: slugify(newAlbumTitle, { lower: true, locale: 'cs', strict: true }),
        is_published: true,
        sort_order: albums.length,
      }),
    })
    if (res.ok) {
      const json = await res.json()
      setAlbums((prev) => [{ ...json.data, photos: [] }, ...prev])
      setNewAlbumTitle('')
    }
  }

  async function deleteAlbum(id: string) {
    if (!confirm('Smazat celé album včetně fotek?')) return
    await fetch('/api/admin/gallery/albums', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setAlbums((prev) => prev.filter((a) => a.id !== id))
    if (activeAlbum?.id === id) setActiveAlbum(null)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Galerie z akcí</h1>

      <div className="mt-6 flex gap-2 rounded-2xl bg-white p-5 shadow-card">
        <input value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} placeholder="Název alba (např. Narozeniny Adélky)" className="input-field" />
        <button onClick={createAlbum} className="btn-primary !px-4 !py-2 text-sm shrink-0">
          <Plus className="h-4 w-4" /> Nové album
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
        ) : (
          albums.map((album) => (
            <div key={album.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <button onClick={() => setActiveAlbum(album)} className="relative block aspect-video w-full bg-teal-50">
                {album.cover_photo_url && <Image src={album.cover_photo_url} alt={album.title} fill sizes="300px" className="object-cover" />}
              </button>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-display text-sm font-bold text-ink">{album.title}</p>
                  <p className="text-xs text-ink/50">{album.photos?.length ?? 0} fotek</p>
                </div>
                <button onClick={() => deleteAlbum(album.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {activeAlbum && (
        <AlbumPhotosModal
          album={activeAlbum}
          onClose={() => setActiveAlbum(null)}
          onUpdate={(updated) => {
            setActiveAlbum(updated)
            setAlbums((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
          }}
        />
      )}

      <style jsx global>{`
        .input-field { width: 100%; border-radius: 0.85rem; border: 2px solid #cceff1; padding: 0.6rem 0.9rem; font-size: 0.9rem; }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}

function AlbumPhotosModal({
  album,
  onClose,
  onUpdate,
}: {
  album: GalleryAlbum
  onClose: () => void
  onUpdate: (album: GalleryAlbum) => void
}) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (files: File[]) => {
      setUploading(true)
      let photos = [...(album.photos ?? [])]
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('scope', 'gallery')
        formData.append('entityId', album.id)

        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const uploadJson = await uploadRes.json()
        if (!uploadRes.ok) continue

        const photoRes = await fetch(`/api/admin/gallery/albums/${album.id}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storagePath: uploadJson.storagePath, url: uploadJson.url }),
        })
        const photoJson = await photoRes.json()
        if (photoRes.ok) photos = [...photos, photoJson.data]
      }
      onUpdate({ ...album, photos, cover_photo_url: album.cover_photo_url || photos[0]?.url })
      setUploading(false)
    },
    [album, onUpdate]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    disabled: uploading,
  })

  async function deletePhoto(photoId: string) {
    await fetch(`/api/admin/gallery/albums/${album.id}/photos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId }),
    })
    onUpdate({ ...album, photos: (album.photos ?? []).filter((p) => p.id !== photoId) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{album.title}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-teal-50"><X className="h-5 w-5" /></button>
        </div>

        <div {...getRootProps()} className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-200'}`}>
          <input {...getInputProps()} />
          {uploading ? <Loader2 className="h-7 w-7 animate-spin text-teal-500" /> : <UploadCloud className="h-7 w-7 text-teal-400" />}
          <p className="mt-2 text-sm font-semibold text-ink/70">Přetáhněte fotky sem, nebo klikněte pro výběr</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {(album.photos ?? []).map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-teal-50">
              <Image src={photo.url} alt={photo.caption || ''} fill sizes="150px" className="object-cover" />
              <button onClick={() => deletePhoto(photo.id)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
