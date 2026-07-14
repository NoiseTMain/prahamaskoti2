-- =====================================================================
-- PRODEJ A PŮJČOVNA MASKOTŮ PRAHA — DATABÁZOVÉ SCHÉMA
-- PostgreSQL 15+ / Supabase
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------
-- ENUM TYPY
-- ---------------------------------------------------------------------
create type mascot_status as enum ('active', 'inactive', 'draft');
create type service_type as enum ('pujceni_bez_animatora', 'maskot_s_animatorem', 'koupe_maskota');
create type inquiry_status as enum ('new', 'contacted', 'confirmed', 'closed', 'cancelled');
create type admin_role as enum ('superadmin', 'editor', 'viewer');

-- ---------------------------------------------------------------------
-- 1) ADMIN UŽIVATELÉ (rozšiřuje auth.users ze Supabase Auth)
-- ---------------------------------------------------------------------
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role admin_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) KATEGORIE MASKOTŮ
-- ---------------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3) MASKOTI (hlavní entita)
-- ---------------------------------------------------------------------
create table mascots (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,

  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  specifications jsonb not null default '{}'::jsonb,  -- výška, materiál, váha, věk. omezení...

  price_rental numeric(10,2),          -- cena půjčení
  price_sale numeric(10,2),            -- cena koupě
  deposit numeric(10,2) not null default 0,   -- kauce
  shipping_price numeric(10,2) not null default 0, -- poštovné

  has_animator boolean not null default false,
  available_for_rental boolean not null default true,
  available_for_sale boolean not null default false,
  is_available boolean not null default true,   -- aktuální dostupnost (obsazenost)

  is_new boolean not null default false,
  is_top_offer boolean not null default false,
  is_recommended boolean not null default false,

  status mascot_status not null default 'active',
  sort_order integer not null default 0,

  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mascots_slug on mascots(slug);
create index idx_mascots_category on mascots(category_id);
create index idx_mascots_status on mascots(status) where status = 'active';
create index idx_mascots_flags on mascots(is_top_offer, is_recommended, is_new);
create index idx_mascots_name_trgm on mascots using gin (name gin_trgm_ops);

-- ---------------------------------------------------------------------
-- 4) FOTKY MASKOTŮ
-- ---------------------------------------------------------------------
create table mascot_photos (
  id uuid primary key default uuid_generate_v4(),
  mascot_id uuid not null references mascots(id) on delete cascade,
  storage_path text not null,        -- cesta v Supabase Storage
  url text not null,
  alt_text text,
  is_main boolean not null default false,
  sort_order integer not null default 0,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index idx_mascot_photos_mascot on mascot_photos(mascot_id, sort_order);
create unique index idx_mascot_photos_one_main
  on mascot_photos(mascot_id) where is_main = true;

-- ---------------------------------------------------------------------
-- 5) GALERIE Z AKCÍ — alba
-- ---------------------------------------------------------------------
create table gallery_albums (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  category text,                     -- např. "Narozeniny", "Firemní akce"
  event_date date,
  cover_photo_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gallery_photos (
  id uuid primary key default uuid_generate_v4(),
  album_id uuid not null references gallery_albums(id) on delete cascade,
  storage_path text not null,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_gallery_photos_album on gallery_photos(album_id, sort_order);
create index idx_gallery_albums_published on gallery_albums(is_published);

-- ---------------------------------------------------------------------
-- 6) FAQ
-- ---------------------------------------------------------------------
create table faq_items (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7) CENÍK (globální položky, mimo cen jednotlivých maskotů)
-- ---------------------------------------------------------------------
create table pricing_items (
  id uuid primary key default uuid_generate_v4(),
  label text not null,               -- např. "Poštovné po ČR", "Kauce standard"
  price numeric(10,2) not null,
  unit text,                         -- "Kč / den", "Kč / akce"...
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8) KONTAKTNÍ ÚDAJE (jediný řádek, key-value přístup přes singleton)
-- ---------------------------------------------------------------------
create table site_contact (
  id integer primary key default 1,
  phone text,
  email text,
  address text,
  bank_account text,
  facebook_url text,
  instagram_url text,
  map_embed_url text,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

-- ---------------------------------------------------------------------
-- 9) OBSAH DOMOVSKÉ STRÁNKY (singleton, flexibilní přes JSONB)
-- ---------------------------------------------------------------------
create table homepage_content (
  id integer primary key default 1,
  hero_image_url text,
  hero_title text,
  hero_subtitle text,
  cta_primary_label text,
  cta_primary_link text,
  cta_secondary_label text,
  cta_secondary_link text,
  benefits jsonb not null default '[]'::jsonb,       -- [{icon, title, text}]
  testimonials jsonb not null default '[]'::jsonb,   -- [{name, text, rating, avatar_url}]
  stats jsonb not null default '[]'::jsonb,          -- [{label, value}]
  banner_text text,
  banner_link text,
  updated_at timestamptz not null default now(),
  constraint singleton_home check (id = 1)
);

-- ---------------------------------------------------------------------
-- 10) SEO NASTAVENÍ (globální + per-page override)
-- ---------------------------------------------------------------------
create table seo_settings (
  id uuid primary key default uuid_generate_v4(),
  page_path text not null unique,     -- '/', '/maskoti', '/kontakt' ...
  meta_title text,
  meta_description text,
  og_image_url text,
  keywords text,
  schema_org jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 11) POPTÁVKY
-- ---------------------------------------------------------------------
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  mascot_id uuid references mascots(id) on delete set null,

  name text not null,
  phone text not null,
  email text not null,
  event_date date,
  event_location text,
  event_type text,
  hours_count integer,
  guests_count integer,
  note text,
  service_type service_type not null,

  gdpr_consent boolean not null default false,
  status inquiry_status not null default 'new',
  admin_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_inquiries_status on inquiries(status);
create index idx_inquiries_created on inquiries(created_at desc);
create index idx_inquiries_mascot on inquiries(mascot_id);

-- ---------------------------------------------------------------------
-- 12) REZERVACE (připraveno pro budoucí rozšíření — kalendář obsazenosti)
-- ---------------------------------------------------------------------
create table reservations (
  id uuid primary key default uuid_generate_v4(),
  mascot_id uuid not null references mascots(id) on delete cascade,
  inquiry_id uuid references inquiries(id) on delete set null,
  date_from timestamptz not null,
  date_to timestamptz not null,
  status text not null default 'tentative', -- tentative | confirmed | cancelled
  created_at timestamptz not null default now(),
  -- zabraňuje překryvu rezervací pro jednoho maskota
  exclude using gist (mascot_id with =, tstzrange(date_from, date_to) with &&)
    where (status <> 'cancelled')
);

create index idx_reservations_mascot on reservations(mascot_id);

-- ---------------------------------------------------------------------
-- 13) STATICKÉ STRÁNKY (Podmínky, GDPR, Cookies, O nás...)
-- ---------------------------------------------------------------------
create table static_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,     -- 'podminky', 'gdpr', 'cookies', 'o-nas'
  title text not null,
  content text not null,         -- HTML/Markdown obsah editovatelný v adminu
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- TRIGGERY: automaticky aktualizovat updated_at
-- =====================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_mascots_updated before update on mascots
  for each row execute function set_updated_at();
create trigger trg_categories_updated before update on categories
  for each row execute function set_updated_at();
create trigger trg_gallery_albums_updated before update on gallery_albums
  for each row execute function set_updated_at();
create trigger trg_faq_updated before update on faq_items
  for each row execute function set_updated_at();
create trigger trg_contact_updated before update on site_contact
  for each row execute function set_updated_at();
create trigger trg_homepage_updated before update on homepage_content
  for each row execute function set_updated_at();
create trigger trg_seo_updated before update on seo_settings
  for each row execute function set_updated_at();
create trigger trg_inquiries_updated before update on inquiries
  for each row execute function set_updated_at();
create trigger trg_static_pages_updated before update on static_pages
  for each row execute function set_updated_at();
create trigger trg_admin_profiles_updated before update on admin_profiles
  for each row execute function set_updated_at();

-- =====================================================================
-- ŘÍZENÍ PŘÍSTUPU: ROW LEVEL SECURITY
-- =====================================================================
alter table mascots enable row level security;
alter table mascot_photos enable row level security;
alter table categories enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_photos enable row level security;
alter table faq_items enable row level security;
alter table pricing_items enable row level security;
alter table site_contact enable row level security;
alter table homepage_content enable row level security;
alter table seo_settings enable row level security;
alter table static_pages enable row level security;
alter table inquiries enable row level security;
alter table reservations enable row level security;
alter table admin_profiles enable row level security;

-- Veřejné čtení publikovaného obsahu
create policy "public_read_active_mascots" on mascots
  for select using (status = 'active');
create policy "public_read_mascot_photos" on mascot_photos
  for select using (
    exists (select 1 from mascots m where m.id = mascot_id and m.status = 'active')
  );
create policy "public_read_categories" on categories
  for select using (is_active = true);
create policy "public_read_gallery_albums" on gallery_albums
  for select using (is_published = true);
create policy "public_read_gallery_photos" on gallery_photos
  for select using (
    exists (select 1 from gallery_albums a where a.id = album_id and a.is_published = true)
  );
create policy "public_read_faq" on faq_items
  for select using (is_published = true);
create policy "public_read_pricing" on pricing_items
  for select using (is_active = true);
create policy "public_read_contact" on site_contact for select using (true);
create policy "public_read_homepage" on homepage_content for select using (true);
create policy "public_read_seo" on seo_settings for select using (true);
create policy "public_read_static_pages" on static_pages for select using (true);

-- Veřejnost smí VYTVÁŘET poptávky (formulář), ale ne číst cizí
create policy "public_insert_inquiries" on inquiries
  for insert with check (true);

-- Přihlášení administrátoři mají plný přístup ke všemu (CRUD)
create policy "admin_full_access_mascots" on mascots
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_mascot_photos" on mascot_photos
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_categories" on categories
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_gallery_albums" on gallery_albums
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_gallery_photos" on gallery_photos
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_faq" on faq_items
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_pricing" on pricing_items
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_contact" on site_contact
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_homepage" on homepage_content
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_seo" on seo_settings
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_static_pages" on static_pages
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_inquiries" on inquiries
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_full_access_reservations" on reservations
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active));
create policy "admin_read_own_profile" on admin_profiles
  for select using (auth.uid() = id or exists (
    select 1 from admin_profiles p where p.id = auth.uid() and p.role = 'superadmin'
  ));
create policy "superadmin_manage_profiles" on admin_profiles
  for all using (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.role = 'superadmin'))
  with check (exists (select 1 from admin_profiles p where p.id = auth.uid() and p.role = 'superadmin'));

-- =====================================================================
-- STORAGE BUCKETS (spouštět v Supabase SQL editoru, nebo přes dashboard)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('mascot-photos', 'mascot-photos', true, 8388608, array['image/jpeg','image/png','image/webp']),
  ('gallery-photos', 'gallery-photos', true, 8388608, array['image/jpeg','image/png','image/webp']),
  ('site-assets', 'site-assets', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "public_read_storage" on storage.objects
  for select using (bucket_id in ('mascot-photos','gallery-photos','site-assets'));

create policy "admin_write_storage" on storage.objects
  for insert with check (
    bucket_id in ('mascot-photos','gallery-photos','site-assets')
    and exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active)
  );
create policy "admin_update_storage" on storage.objects
  for update using (
    bucket_id in ('mascot-photos','gallery-photos','site-assets')
    and exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active)
  );
create policy "admin_delete_storage" on storage.objects
  for delete using (
    bucket_id in ('mascot-photos','gallery-photos','site-assets')
    and exists (select 1 from admin_profiles p where p.id = auth.uid() and p.is_active)
  );
