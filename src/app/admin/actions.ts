'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Zadejte prosím platný e-mail a heslo.' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Nesprávný e-mail nebo heslo.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
