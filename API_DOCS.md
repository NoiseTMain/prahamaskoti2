# API dokumentace — Maskoti Praha

Všechny admin API routy vyžadují platnou Supabase Auth session (cookie) a aktivní záznam v `admin_profiles`.
Veřejné API je pouze `/api/poptavka`.

---

## Veřejné API

### `POST /api/poptavka`
Odeslání poptávkového formuláře.

**Tělo požadavku:**
```json
{
  "mascot_id": "uuid | null",
  "name": "Jan Novák",
  "phone": "+420777123456",
  "email": "jan@example.com",
  "event_date": "2026-08-01",
  "event_location": "Praha",
  "event_type": "Narozeniny",
  "hours_count": 3,
  "guests_count": 20,
  "note": "Poznámka",
  "service_type": "pujceni_bez_animatora | maskot_s_animatorem | koupe_maskota",
  "gdpr_consent": true
}
```

**Odpovědi:**
- `200 { success: true, id }` — poptávka uložena, e-maily odeslány
- `400 { error, details }` — neplatná data
- `429 { error }` — překročen rate limit (5 poptávek / 10 min / IP)
- `500 { error }` — chyba serveru

Rate limiting využívá Upstash Redis (pokud je nakonfigurován); formulář navíc obsahuje honeypot pole `website`, které musí zůstat prázdné.

---

## Admin API (`/api/admin/*`)

Všechny routy vrací `401` pokud uživatel není přihlášen, `403` pokud nemá dostatečnou roli.

| Route | Metody | Popis |
|---|---|---|
| `/api/admin/mascots` | GET, POST | Výpis a vytvoření maskota |
| `/api/admin/mascots/[id]` | GET, PATCH, DELETE | Detail, úprava, smazání maskota |
| `/api/admin/mascots/[id]/photos` | POST, PATCH | Přidání fotky, hromadná změna pořadí |
| `/api/admin/photos/[photoId]` | PATCH, DELETE | Nastavení hlavní fotky, smazání |
| `/api/admin/upload` | POST | Upload + optimalizace obrázku (multipart/form-data: `file`, `scope`, `entityId`) |
| `/api/admin/categories` | GET, POST | Kategorie maskotů |
| `/api/admin/gallery/albums` | GET, POST, PATCH, DELETE | Alba galerie z akcí |
| `/api/admin/gallery/albums/[id]/photos` | POST, DELETE | Fotky v albu |
| `/api/admin/faq` | GET, POST, PATCH, DELETE | Otázky FAQ |
| `/api/admin/pricing` | GET, POST, PATCH, DELETE | Položky ceníku |
| `/api/admin/contact` | GET, PATCH | Kontaktní údaje (singleton) |
| `/api/admin/homepage` | GET, PATCH | Obsah domovské stránky (singleton) |
| `/api/admin/seo` | GET, POST (upsert), DELETE | SEO nastavení podle `page_path` |
| `/api/admin/inquiries` | GET, PATCH | Výpis poptávek, změna stavu |

### Role a oprávnění (`admin_profiles.role`)
- **`superadmin`** — plný přístup včetně správy ostatních administrátorů a mazání
- **`editor`** — CRUD nad veškerým obsahem
- **`viewer`** — pouze čtení (blokován na `POST`/`PATCH` u zápisových endpointů)

### Upload obrázků
`POST /api/admin/upload` přijímá `multipart/form-data`:
- `file` — obrázek (JPG/PNG/WEBP, max 8 MB)
- `scope` — `mascot` | `gallery` | `site` (určuje cílový Storage bucket)
- `entityId` — ID maskota/alba pro logické seskupení souborů ve Storage

Obrázek se automaticky převede na WebP, zmenší na max. šířku 1920 px a zkomprimuje (kvalita 82) pomocí knihovny `sharp`.

---

## Autentizace
Přihlášení probíhá přes Supabase Auth (`supabase.auth.signInWithPassword`) na `/admin/login`. Middleware (`middleware.ts`) chrání všechny cesty pod `/admin/*` kromě `/admin/login` a přesměruje nepřihlášené uživatele.
