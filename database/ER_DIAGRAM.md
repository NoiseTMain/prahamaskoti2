# ER diagram databáze — Maskoti Praha

```mermaid
erDiagram
    CATEGORIES ||--o{ MASCOTS : "zařazuje"
    MASCOTS ||--o{ MASCOT_PHOTOS : "má fotky"
    MASCOTS ||--o{ INQUIRIES : "je poptáván"
    MASCOTS ||--o{ RESERVATIONS : "má rezervace"
    INQUIRIES ||--o| RESERVATIONS : "generuje"
    GALLERY_ALBUMS ||--o{ GALLERY_PHOTOS : "obsahuje"
    ADMIN_PROFILES ||--o{ MASCOTS : "spravuje (RLS)"

    CATEGORIES {
        uuid id PK
        text name
        text slug UK
        int sort_order
        bool is_active
    }

    MASCOTS {
        uuid id PK
        uuid category_id FK
        text name
        text slug UK
        text description
        jsonb specifications
        numeric price_rental
        numeric price_sale
        numeric deposit
        numeric shipping_price
        bool has_animator
        bool available_for_rental
        bool available_for_sale
        bool is_available
        bool is_new
        bool is_top_offer
        bool is_recommended
        enum status
        text seo_title
        text seo_description
    }

    MASCOT_PHOTOS {
        uuid id PK
        uuid mascot_id FK
        text storage_path
        text url
        bool is_main
        int sort_order
    }

    GALLERY_ALBUMS {
        uuid id PK
        text title
        text slug UK
        text category
        date event_date
        bool is_published
    }

    GALLERY_PHOTOS {
        uuid id PK
        uuid album_id FK
        text storage_path
        text url
        text caption
    }

    FAQ_ITEMS {
        uuid id PK
        text question
        text answer
        int sort_order
        bool is_published
    }

    PRICING_ITEMS {
        uuid id PK
        text label
        numeric price
        text unit
    }

    SITE_CONTACT {
        int id PK "singleton = 1"
        text phone
        text email
        text address
        text bank_account
    }

    HOMEPAGE_CONTENT {
        int id PK "singleton = 1"
        text hero_title
        text hero_subtitle
        jsonb benefits
        jsonb testimonials
        jsonb stats
    }

    SEO_SETTINGS {
        uuid id PK
        text page_path UK
        text meta_title
        text meta_description
        jsonb schema_org
    }

    INQUIRIES {
        uuid id PK
        uuid mascot_id FK
        text name
        text phone
        text email
        date event_date
        enum service_type
        bool gdpr_consent
        enum status
    }

    RESERVATIONS {
        uuid id PK
        uuid mascot_id FK
        uuid inquiry_id FK
        timestamptz date_from
        timestamptz date_to
        text status
    }

    STATIC_PAGES {
        uuid id PK
        text slug UK
        text title
        text content
    }

    ADMIN_PROFILES {
        uuid id PK "= auth.users.id"
        text full_name
        enum role
        bool is_active
    }
```

## Poznámky k návrhu

- **`mascots`** je centrální entita; `specifications` je JSONB pro flexibilní klíč–hodnota údaje (výška, materiál…), aby šlo přidávat nové vlastnosti bez migrace schématu.
- **`mascot_photos`** má unikátní partial index zajišťující, že každý maskot má maximálně jednu `is_main = true` fotku.
- **`site_contact`** a **`homepage_content`** jsou tabulky typu *singleton* (vždy jeden řádek s `id = 1`) — zjednodušuje to čtení i editaci globálního obsahu.
- **`reservations`** obsahuje `EXCLUDE USING gist` omezení, které na úrovni databáze zabraňuje překryvu dvou rezervací pro stejného maskota — připraveno pro budoucí kalendář obsazenosti.
- Row Level Security (RLS) je zapnuté na všech tabulkách: veřejnost čte pouze publikovaný/aktivní obsah a smí vkládat poptávky; plný CRUD přístup mají pouze uživatelé v `admin_profiles` s `is_active = true`.
