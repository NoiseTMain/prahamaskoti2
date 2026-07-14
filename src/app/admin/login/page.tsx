'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { PawPrint, Loader2 } from 'lucide-react'
import { signIn } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Přihlásit se
    </button>
  )
}

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-800 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <PawPrint className="h-10 w-10 text-teal-600" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-ink">Administrace</h1>
          <p className="mt-1 text-sm text-ink/60">Maskoti Praha</p>
        </div>

        <form action={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">E-mail</label>
            <input id="email" name="email" type="email" required className="input-field" placeholder="admin@maskotipraha.cz" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">Heslo</label>
            <input id="password" name="password" type="password" required className="input-field" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
          <SubmitButton />
        </form>
      </div>
      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 2px solid #cceff1;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
        }
        .input-field:focus { border-color: #0fa3ad; outline: none; }
      `}</style>
    </div>
  )
}
