-- =====================================================================
-- SEED DATA — výchozí obsah pro Prodej a půjčovnu maskotů Praha
-- =====================================================================

-- Kategorie
insert into categories (name, slug, description, sort_order) values
  ('Pohádkové postavy', 'pohadkove-postavy', 'Princezny, víly a hrdinové z pohádek', 1),
  ('Zvířátka', 'zviratka', 'Oblíbená zvířecí maskoti pro nejmenší', 2),
  ('Superhrdinové', 'superhrdinove', 'Akční maskoti pro odvážné oslavy', 3),
  ('Sezónní a tematičtí', 'sezonni-a-tematicti', 'Vánoční, halloweenští a další tematičtí maskoti', 4);

-- Ceník (globální položky)
insert into pricing_items (label, price, unit, description, sort_order) values
  ('Poštovné po ČR', 150, 'Kč / zásilka', 'Doručení maskota kamkoli po České republice', 1),
  ('Osobní odběr Praha', 0, 'Kč', 'Vyzvednutí na naší provozovně v Praze zdarma', 2),
  ('Standardní kauce', 2000, 'Kč', 'Vratná kauce při zapůjčení, vrací se po vrácení maskota v pořádku', 3),
  ('Příplatek za animátora', 990, 'Kč / hodina', 'Profesionální animátor v kostýmu maskota přímo na vaší akci', 4);

-- Kontaktní údaje
insert into site_contact (id, phone, email, address, bank_account, facebook_url, instagram_url, map_embed_url)
values (
  1,
  '+420 777 123 456',
  'info@maskotipraha.cz',
  'Praha, Česká republika',
  '123456789/0800',
  'https://www.facebook.com/groups/maskoti.prodej.pronajem',
  'https://www.instagram.com/maskotipraha',
  null
);

-- Homepage obsah
insert into homepage_content (
  id, hero_title, hero_subtitle, cta_primary_label, cta_primary_link,
  cta_secondary_label, cta_secondary_link, benefits, testimonials, stats, banner_text
) values (
  1,
  'Prodej a půjčovna maskotů Praha',
  'Maskoty zasíláme po celé ČR. Rozpohybujeme každou vaši oslavu!',
  'Vytvořit poptávku',
  '/poptavka',
  'Prohlédnout maskoty',
  '/maskoti',
  '[
    {"icon":"truck","title":"Doprava po celé ČR","text":"Maskota vám zašleme kamkoli po České republice"},
    {"icon":"shield","title":"Ověřená kvalita","text":"Všichni maskoti prochází pravidelnou kontrolou a čištěním"},
    {"icon":"users","title":"Animátoři na akci","text":"Maskota si můžete objednat i s profesionálním animátorem"},
    {"icon":"heart","title":"Stovky spokojených akcí","text":"Rozdáváme radost na dětských oslavách po celé republice"}
  ]'::jsonb,
  '[]'::jsonb,
  '[
    {"label":"Maskotů v nabídce","value":"40+"},
    {"label":"Spokojených akcí","value":"500+"},
    {"label":"Let zkušeností","value":"8"}
  ]'::jsonb,
  'Maskoty zasíláme po celé ČR 🎉'
);

-- FAQ
insert into faq_items (question, answer, sort_order) values
  ('Jak probíhá zapůjčení maskota?', 'Vyberete si maskota, odešlete poptávkový formulář a my se vám ozveme s potvrzením dostupnosti a domluvíme předání nebo zaslání.', 1),
  ('Zasíláte maskoty po celé ČR?', 'Ano, maskoty zasíláme přepravní službou po celé České republice. Cena poštovného je uvedena v ceníku.', 2),
  ('Je nutné platit kauci?', 'Ano, u zapůjčení se platí vratná kauce, která se vrací po bezproblémovém vrácení maskota.', 3),
  ('Můžu si objednat maskota i s animátorem?', 'Ano, u vybraných maskotů nabízíme možnost objednat profesionálního animátora přímo na vaši akci.', 4),
  ('Je možné maskota i koupit?', 'Ano, vybrané maskoty nabízíme i k trvalému prodeji. Informaci o dostupnosti najdete u konkrétního maskota.', 5);

-- Statické stránky
insert into static_pages (slug, title, content, seo_title, seo_description) values
  ('o-nas', 'O nás', '<p>Jsme Prodej a půjčovna maskotů Praha — pomáháme rozzářit dětské oslavy, firemní akce i veřejné události po celé České republice.</p>', 'O nás | Maskoti Praha', 'Poznejte tým Prodej a půjčovny maskotů Praha.'),
  ('podminky', 'Obchodní podmínky', '<p>Obchodní podmínky pro zapůjčení a koupi maskotů.</p>', 'Obchodní podmínky | Maskoti Praha', 'Obchodní podmínky služby Maskoti Praha.'),
  ('gdpr', 'Ochrana osobních údajů (GDPR)', '<p>Informace o zpracování osobních údajů dle GDPR.</p>', 'GDPR | Maskoti Praha', 'Zásady ochrany osobních údajů.'),
  ('cookies', 'Zásady cookies', '<p>Informace o používání souborů cookies na tomto webu.</p>', 'Cookies | Maskoti Praha', 'Zásady používání cookies.');

-- SEO nastavení
insert into seo_settings (page_path, meta_title, meta_description, keywords) values
  ('/', 'Prodej a půjčovna maskotů Praha | Maskoti na oslavy a akce', 'Půjčovna a prodej kostýmových maskotů v Praze. Zasíláme po celé ČR. Maskoti s animátorem i bez, na dětské oslavy i firemní akce.', 'půjčovna maskotů, maskoti praha, kostýmy maskotů, pronájem maskota'),
  ('/maskoti', 'Nabídka maskotů | Maskoti Praha', 'Kompletní nabídka maskotů k zapůjčení i koupi.', 'maskoti nabídka, kostýmy k půjčení');
