'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'maskoti-praha-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage nedostupné (např. v privátním režimu) — banner se nezobrazí
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-teal-100 sm:p-6">
      <div className="flex items-start gap-3">
        <Cookie className="h-6 w-6 shrink-0 text-coral-500" />
        <div className="flex-1">
          <p className="text-sm text-ink/80">
            Používáme cookies pro zajištění správného fungování webu. Více informací najdete v{' '}
            <Link href="/cookies" className="font-semibold text-teal-600 underline">zásadách cookies</Link>.
          </p>
          <button onClick={accept} className="btn-primary mt-3 !px-5 !py-2 text-sm">
            Rozumím
          </button>
        </div>
      </div>
    </div>
  )
}
