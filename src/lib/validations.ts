import { z } from 'zod'

export const inquirySchema = z.object({
  mascot_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(2, 'Zadejte prosím celé jméno').max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(\+420)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, 'Zadejte platné telefonní číslo'),
  email: z.string().trim().email('Zadejte platný e-mail').max(200),
  event_date: z.string().optional().nullable(),
  event_location: z.string().trim().max(200).optional().nullable(),
  event_type: z.string().trim().max(100).optional().nullable(),
  hours_count: z.coerce.number().int().min(1).max(24).optional().nullable(),
  guests_count: z.coerce.number().int().min(1).max(2000).optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
  service_type: z.enum(['pujceni_bez_animatora', 'maskot_s_animatorem', 'koupe_maskota']),
  gdpr_consent: z.literal(true, {
    errorMap: () => ({ message: 'Je nutné souhlasit se zpracováním osobních údajů' }),
  }),
  website: z.string().max(0).optional(), // honeypot proti botům
})

export type InquiryFormValues = z.infer<typeof inquirySchema>

export const mascotSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug smí obsahovat pouze malá písmena, čísla a pomlčky'),
  category_id: z.string().uuid().nullable().optional(),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
  price_rental: z.coerce.number().min(0).optional().nullable(),
  price_sale: z.coerce.number().min(0).optional().nullable(),
  deposit: z.coerce.number().min(0).default(0),
  shipping_price: z.coerce.number().min(0).default(0),
  has_animator: z.boolean().default(false),
  available_for_rental: z.boolean().default(true),
  available_for_sale: z.boolean().default(false),
  is_available: z.boolean().default(true),
  is_new: z.boolean().default(false),
  is_top_offer: z.boolean().default(false),
  is_recommended: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  seo_title: z.string().max(160).optional().nullable(),
  seo_description: z.string().max(320).optional().nullable(),
  seo_keywords: z.string().max(300).optional().nullable(),
})

export type MascotFormValues = z.infer<typeof mascotSchema>

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
})
