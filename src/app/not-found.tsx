import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <PawPrint className="h-16 w-16 text-bubblegum-300" />
      <h1 className="mt-6 font-display text-5xl font-extrabold text-ink">404</h1>
      <p className="mt-3 text-lg text-ink/70">Tuto stránku se nepodařilo najít.</p>
      <Link href="/" className="btn-primary mt-8">
        Zpět na domovskou stránku
      </Link>
    </div>
  )
}
