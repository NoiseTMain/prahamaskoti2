/**
 * Spustí seed.sql proti nakonfigurované Supabase databázi.
 * Použití: npm run db:seed
 *
 * Vyžaduje NEXT_PUBLIC_SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY v .env
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import 'dotenv/config'

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v prostředí.')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  const seedSql = readFileSync(join(__dirname, 'seed.sql'), 'utf-8')

  console.log('Spouštím seed.sql přes Supabase RPC (exec_sql)...')
  console.log('POZNÁMKA: Doporučeno spustit seed.sql přímo v Supabase SQL editoru pro spolehlivější výsledek.')

  const { error } = await supabase.rpc('exec_sql', { sql: seedSql })
  if (error) {
    console.error('Seed selhal:', error.message)
    console.error('Zkopírujte prosím obsah database/seed.sql a spusťte jej ručně v Supabase SQL editoru.')
    process.exit(1)
  }

  console.log('Seed dokončen úspěšně.')
}

main()
