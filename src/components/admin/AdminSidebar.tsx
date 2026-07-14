'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, PawPrint, Images, HelpCircle, Tag, Phone, Home, Search, Mail, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/admin/actions'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/maskoti', label: 'Maskoti', icon: PawPrint },
  { href: '/admin/galerie', label: 'Galerie z akcí', icon: Images },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/cenik', label: 'Ceník', icon: Tag },
  { href: '/admin/kontakty', label: 'Kontakty', icon: Phone },
  { href: '/admin/homepage', label: 'Domovská stránka', icon: Home },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/poptavky', label: 'Poptávky', icon: Mail },
]

export function AdminSidebar({ adminName, role }: { adminName: string; role: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const content = (
    <>
      <div className="px-5 py-6">
        <div className="flex items-center gap-2 font-display text-lg font-extrabold text-teal-700">
          <PawPrint className="h-6 w-6" /> Maskoti Praha
        </div>
        <p className="mt-1 truncate text-xs text-ink/50">{adminName} · {role}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                active ? 'bg-teal-500 text-white' : 'text-ink/70 hover:bg-teal-100'
              )}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <form action={signOut} className="p-3">
        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
          <LogOut className="h-[18px] w-[18px]" /> Odhlásit se
        </button>
      </form>
    </>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-teal-100 bg-white lg:flex">
        {content}
      </aside>

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-teal-100 bg-white px-4 py-3 lg:hidden">
        <span className="font-display font-extrabold text-teal-700">Maskoti Praha — Admin</span>
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <aside className="fixed inset-0 z-30 flex flex-col bg-white pt-14 lg:hidden">{content}</aside>
      )}
    </>
  )
}
