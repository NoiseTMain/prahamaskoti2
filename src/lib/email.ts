import { Resend } from 'resend'
import type { Inquiry } from '@/types/database'
import { formatDate, serviceTypeLabel } from './utils'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'Maskoti Praha <poptavky@maskotipraha.cz>'
const ADMIN_ADDRESS = process.env.EMAIL_ADMIN ?? 'info@maskotipraha.cz'

export async function sendInquiryEmails(inquiry: Inquiry, mascotName?: string | null) {
  const results = await Promise.allSettled([
    sendCustomerConfirmation(inquiry, mascotName),
    sendAdminNotification(inquiry, mascotName),
  ])

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    console.error('Chyba při odesílání e-mailů poptávky:', failed)
  }
  return { success: failed.length === 0 }
}

async function sendCustomerConfirmation(inquiry: Inquiry, mascotName?: string | null) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: inquiry.email,
    subject: 'Potvrzení přijetí poptávky — Maskoti Praha',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color:#0FA3AD;">Děkujeme za vaši poptávku!</h2>
        <p>Dobrý den ${escapeHtml(inquiry.name)},</p>
        <p>přijali jsme vaši poptávku${mascotName ? ` na maskota <strong>${escapeHtml(mascotName)}</strong>` : ''}
        a ozveme se vám co nejdříve s potvrzením dostupnosti.</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding:6px 0; color:#555;">Typ služby</td><td style="padding:6px 0;">${escapeHtml(serviceTypeLabel(inquiry.service_type))}</td></tr>
          ${inquiry.event_date ? `<tr><td style="padding:6px 0; color:#555;">Datum akce</td><td style="padding:6px 0;">${formatDate(inquiry.event_date)}</td></tr>` : ''}
          ${inquiry.event_location ? `<tr><td style="padding:6px 0; color:#555;">Místo konání</td><td style="padding:6px 0;">${escapeHtml(inquiry.event_location)}</td></tr>` : ''}
        </table>
        <p style="margin-top:24px;">S pozdravem,<br/>Tým Maskoti Praha</p>
      </div>
    `,
  })
}

async function sendAdminNotification(inquiry: Inquiry, mascotName?: string | null) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: ADMIN_ADDRESS,
    subject: `Nová poptávka: ${inquiry.name}${mascotName ? ` — ${mascotName}` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>Nová poptávka z webu</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding:6px 0; color:#555;">Jméno</td><td style="padding:6px 0;">${escapeHtml(inquiry.name)}</td></tr>
          <tr><td style="padding:6px 0; color:#555;">Telefon</td><td style="padding:6px 0;">${escapeHtml(inquiry.phone)}</td></tr>
          <tr><td style="padding:6px 0; color:#555;">E-mail</td><td style="padding:6px 0;">${escapeHtml(inquiry.email)}</td></tr>
          <tr><td style="padding:6px 0; color:#555;">Maskot</td><td style="padding:6px 0;">${escapeHtml(mascotName ?? 'neuvedeno')}</td></tr>
          <tr><td style="padding:6px 0; color:#555;">Typ služby</td><td style="padding:6px 0;">${escapeHtml(serviceTypeLabel(inquiry.service_type))}</td></tr>
          ${inquiry.event_date ? `<tr><td style="padding:6px 0; color:#555;">Datum akce</td><td style="padding:6px 0;">${formatDate(inquiry.event_date)}</td></tr>` : ''}
          ${inquiry.event_location ? `<tr><td style="padding:6px 0; color:#555;">Místo</td><td style="padding:6px 0;">${escapeHtml(inquiry.event_location)}</td></tr>` : ''}
          ${inquiry.hours_count ? `<tr><td style="padding:6px 0; color:#555;">Počet hodin</td><td style="padding:6px 0;">${inquiry.hours_count}</td></tr>` : ''}
          ${inquiry.guests_count ? `<tr><td style="padding:6px 0; color:#555;">Počet návštěvníků</td><td style="padding:6px 0;">${inquiry.guests_count}</td></tr>` : ''}
          ${inquiry.note ? `<tr><td style="padding:6px 0; color:#555;">Poznámka</td><td style="padding:6px 0;">${escapeHtml(inquiry.note)}</td></tr>` : ''}
        </table>
      </div>
    `,
  })
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
