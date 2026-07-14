# Prodej a půjčovna maskotů Praha

Kompletní produkční webová aplikace pro prodej a půjčovnu maskotů — veřejný web + plnohodnotný admin panel napojený na Supabase.

## Použité technologie

| Vrstva | Technologie |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Jazyk | TypeScript |
| Styling | Tailwind CSS |
| Animace | Framer Motion |
| Databáze | PostgreSQL (Supabase) |
| Autentizace | Supabase Auth |
| Souborové úložiště | Supabase Storage |
| E-maily | Resend |
| Validace | Zod + React Hook Form |
| Rate limiting | Upstash Redis (volitelné) |
| Obrázky | next/image + Sharp (server-side optimalizace) |
| Ikony | lucide-react |

## Struktura projektu

```
maskoti-praha/
├── database/
│   ├── schema.sql          # Kompletní DB schéma, RLS politiky, storage buckety
│   ├── seed.sql             # Výchozí obsah (ceník, FAQ, kontakty...)
│   ├── ER_DIAGRAM.md        # ER diagram (Mermaid)
│   └── run-seed.ts
├── src/
│   ├── app/
│   │   ├── (veřejné stránky).../page.tsx
│   │   ├── admin/            # Admin panel (chráněno middlewarem)
│   │   ├── api/
│   │   │   ├── poptavka/     # Veřejné API pro formulář
│   │   │   └── admin/        # Admin CRUD API
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx
│   ├── components/           # Sdílené UI komponenty
│   │   └── admin/            # Komponenty administrace
│   ├── lib/
│   │   ├── supabase/         # client.ts, server.ts
│   │   ├── queries.ts        # Datová vrstva pro veřejný web
│   │   ├── validations.ts    # Zod schémata
│   │   ├── email.ts          # Odesílání e-mailů (Resend)
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   └── types/database.ts     # TypeScript typy odpovídající DB schématu
├── middleware.ts              # Ochrana /admin, refresh Supabase session
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

## Instalace — lokální vývoj

### 1. Klonování a instalace závislostí
```bash
npm install
```

### 2. Založení Supabase projektu
1. Vytvořte projekt na [supabase.com](https://supabase.com)
2. V **SQL Editoru** postupně spusťte:
   - obsah `database/schema.sql` (tabulky, RLS, storage buckety)
   - obsah `database/seed.sql` (výchozí obsah webu)
3. V **Authentication → Users** vytvořte prvního administrátora (e-mail + heslo)
4. V **SQL Editoru** spusťte (nahraďte `<USER_UUID>` skutečným ID nově vytvořeného uživatele z kroku 3):
   ```sql
   insert into admin_profiles (id, full_name, role, is_active)
   values ('<USER_UUID>', 'Administrátor', 'superadmin', true);
   ```

### 3. Proměnné prostředí
```bash
cp .env.example .env.local
```
Vyplňte `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` a `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard → Project Settings → API).

Pro e-maily založte účet na [resend.com](https://resend.com), ověřte doménu a doplňte `RESEND_API_KEY`.

### 4. Spuštění
```bash
npm run dev
```
Web poběží na `http://localhost:3000`, administrace na `http://localhost:3000/admin/login`.

## Přidání obsahu
Po přihlášení do administrace (`/admin/login`) lze bez zásahu do kódu:
- přidávat/upravovat/mazat maskoty včetně fotek (drag & drop upload, výběr hlavní fotky)
- spravovat kategorie, ceník, FAQ, kontakty
- spravovat galerii z akcí (alba + fotky)
- upravovat texty a obsah domovské stránky (hero, výhody, reference, statistiky, banner)
- spravovat SEO (meta title/description, OG obrázky, klíčová slova) pro jednotlivé stránky
- spravovat příchozí poptávky a jejich stav

Veškeré změny v administraci se ihned projeví na veřejném webu (data se čtou přímo z databáze při každém požadavku / revalidaci).

## Bezpečnost
- Row Level Security na všech tabulkách — veřejnost čte pouze publikovaný obsah, zápis pouze přes ověřené administrátory
- Middleware chránící `/admin/*`
- Rate limiting poptávkového formuláře (5 požadavků / 10 minut / IP)
- Honeypot pole proti botům
- Validace vstupů přes Zod na klientu i serveru
- Bezpečnostní HTTP hlavičky (CSP, X-Frame-Options, atd.) v `next.config.js`
- Sanitizovaný HTML výstup u popisů (doporučeno dále doplnit DOMPurify při zavádění rich-textového editoru v adminu)

## Nasazení
Viz [`DEPLOYMENT.md`](./DEPLOYMENT.md) pro podrobný postup nasazení na Vercel nebo vlastní VPS.

## Seznam hlavních funkcí
Viz sekce **Seznam funkcí** v [`DEPLOYMENT.md`](./DEPLOYMENT.md).
