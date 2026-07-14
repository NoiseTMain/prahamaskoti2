import { NextResponse, type NextRequest } from 'next/server'
import { inquirySchema } from '@/lib/validations'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendInquiryEmails } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const { success: rateOk } = await checkRateLimit(ip)
    if (!rateOk) {
      return NextResponse.json(
        { error: 'Odeslali jste příliš mnoho poptávek. Zkuste to prosím za chvíli.' },
        { status: 429 }
      )
    }

    const json = await request.json()
    const parsed = inquirySchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Neplatná data formuláře.', details: parsed.error.flatten() }, { status: 400 })
    }

    // Honeypot — pokud je vyplněný, jde o bota; tváříme se, že vše proběhlo v pořádku
    if (parsed.data.website) {
      return NextResponse.json({ success: true })
    }

    const { website, ...inquiryData } = parsed.data
    const supabase = createServiceRoleClient()

    let mascotName: string | null = null
    if (inquiryData.mascot_id) {
      const { data: mascot } = await supabase.from('mascots').select('name').eq('id', inquiryData.mascot_id).single()
      mascotName = mascot?.name ?? null
    }

    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        mascot_id: inquiryData.mascot_id ?? null,
        name: inquiryData.name,
        phone: inquiryData.phone,
        email: inquiryData.email,
        event_date: inquiryData.event_date || null,
        event_location: inquiryData.event_location || null,
        event_type: inquiryData.event_type || null,
        hours_count: inquiryData.hours_count || null,
        guests_count: inquiryData.guests_count || null,
        note: inquiryData.note || null,
        service_type: inquiryData.service_type,
        gdpr_consent: inquiryData.gdpr_consent,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Chyba při ukládání poptávky:', error)
      return NextResponse.json({ error: 'Poptávku se nepodařilo uložit. Zkuste to prosím znovu.' }, { status: 500 })
    }

    await sendInquiryEmails(inquiry, mascotName)

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    console.error('Neočekávaná chyba API /poptavka:', err)
    return NextResponse.json({ error: 'Nastala neočekávaná chyba serveru.' }, { status: 500 })
  }
}
