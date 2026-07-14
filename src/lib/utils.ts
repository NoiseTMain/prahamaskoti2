import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Na dotaz'
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(
    value
  )
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(value)
  )
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  pujceni_bez_animatora: 'Zapůjčení bez animátora',
  maskot_s_animatorem: 'Maskot s animátorem',
  koupe_maskota: 'Koupě maskota',
}
export function serviceTypeLabel(type: string): string {
  return SERVICE_TYPE_LABELS[type] ?? type
}
