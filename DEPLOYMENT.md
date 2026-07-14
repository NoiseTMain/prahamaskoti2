# Nasazení — Maskoti Praha

## Varianta A: Vercel (doporučeno)

1. Nahrajte projekt do Git repozitáře (GitHub/GitLab/Bitbucket).
2. Na [vercel.com](https://vercel.com) → **Add New Project** → vyberte repozitář.
3. Framework Preset se detekuje automaticky jako **Next.js**.
4. V **Environment Variables** vložte všechny proměnné z `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(označte jako Sensitive)*
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ADMIN`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` *(volitelné)*
   - `NEXT_PUBLIC_SITE_URL` (finální doména, např. `https://www.maskotipraha.cz`)
5. Klikněte **Deploy**.
6. Po nasazení nastavte vlastní doménu v **Project Settings → Domains**.
7. V Supabase **Authentication → URL Configuration** doplňte produkční URL do „Site URL“ a „Redirect URLs“.

Vercel automaticky zajišťuje CDN, HTTPS, image optimalizaci a edge caching.

## Varianta B: Vlastní VPS (Ubuntu 22.04+)

### 1. Příprava serveru
```bash
sudo apt update && sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Nahrání projektu a instalace
```bash
git clone <repo-url> /var/www/maskoti-praha
cd /var/www/maskoti-praha
npm install
cp .env.example .env.local   # vyplnit produkční hodnoty
npm run build
```

### 3. Spuštění přes PM2
```bash
pm2 start npm --name "maskoti-praha" -- start
pm2 save
pm2 startup
```

### 4. Reverzní proxy (Nginx)
```nginx
server {
    listen 80;
    server_name www.maskotipraha.cz maskotipraha.cz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. HTTPS
```bash
sudo certbot --nginx -d maskotipraha.cz -d www.maskotipraha.cz
```

### 6. Aktualizace při nové verzi
```bash
cd /var/www/maskoti-praha
git pull
npm install
npm run build
pm2 restart maskoti-praha
```

---

## Kontrolní seznam po nasazení
- [ ] `database/schema.sql` a `database/seed.sql` spuštěny v Supabase
- [ ] První administrátor vytvořen a napojen na `admin_profiles`
- [ ] Doména ověřena v Resend, testovací e-mail úspěšně odeslán
- [ ] `NEXT_PUBLIC_SITE_URL` odpovídá skutečné produkční doméně (ovlivňuje sitemap, OG tagy)
- [ ] V Supabase Storage zkontrolovány buckety `mascot-photos`, `gallery-photos`, `site-assets` (musí být `public`)
- [ ] Otestován poptávkový formulář (uložení do DB + doručení obou e-mailů)
- [ ] Otestováno přihlášení do administrace a úprava obsahu
- [ ] `https://vase-domena.cz/sitemap.xml` a `/robots.txt` se generují správně
- [ ] Prohnáno přes Lighthouse / PageSpeed Insights

---

## Seznam všech funkcí

### Veřejný web
- Domovská stránka: hero, výhody, doporučení maskoti, statistiky, reference, CTA banner
- Výpis maskotů s filtrováním podle kategorie a typu (půjčení/prodej)
- Detail maskota: galerie s lightboxem, ceny, kauce, poštovné, specifikace, související maskoti, poptávkový formulář
- Samostatné stránky Půjčovna a Prodej
- Galerie z akcí: alba s fotkami, filtrování podle kategorie
- FAQ s rozbalovacími otázkami + Schema.org FAQPage
- Kontaktní stránka s mapou a formulářem
- Poptávkový formulář (samostatný i u každého maskota) s validací, honeypotem a GDPR souhlasem
- Statické stránky: O nás, Obchodní podmínky, GDPR, Cookies
- 404 stránka
- Plná responzivita, animace (Framer Motion), lazy loading obrázků
- SEO: dynamické meta tagy, Open Graph, Twitter Cards, Schema.org (Product, FAQPage), sitemap.xml, robots.txt
- PWA: manifest.json, instalovatelnost na mobilu

### Administrace (`/admin`)
- Přihlášení přes Supabase Auth, ochrana middlewarem, role (superadmin/editor/viewer)
- Dashboard: počty maskotů, poptávek, fotek, přehled posledních poptávek
- Správa maskotů: CRUD, kategorie, ceny, kauce, poštovné, dostupnost, animátor, štítky (novinka/TOP/doporučeno), SEO pole, slug
- Správa fotek maskotů: drag & drop upload, automatická optimalizace a komprese (WebP, Sharp), nastavení hlavní fotky, mazání
- Galerie z akcí: správa alb a fotek s uploadem
- Správa FAQ: přidání/úprava/mazání/pořadí/publikace
- Správa ceníku: libovolné položky s cenou a jednotkou
- Správa kontaktů: telefon, e-mail, adresa, účet, sociální sítě, mapa
- Správa domovské stránky: hero, CTA, výhody, statistiky, reference, banner
- Správa SEO: meta title/description, klíčová slova, OG obrázek pro libovolnou cestu
- Správa poptávek: přehled, filtrování podle stavu, změna stavu

### Backend / infrastruktura
- Kompletní PostgreSQL schéma s indexy, triggery a Row Level Security
- Supabase Storage se třemi buckety a politikami přístupu
- API pro poptávky s rate limitingem, honeypotem a odesíláním e-mailů (zákazník + admin)
- Architektura připravená na rozšíření o kalendář rezervací (tabulka `reservations` s ochranou proti překryvu termínů)
