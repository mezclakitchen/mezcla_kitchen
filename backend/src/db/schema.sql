-- =====================================================================
-- MEZCLA DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor (Settings → SQL Editor)
-- or via: supabase db push
-- =====================================================================

-- ─── Enable UUID extension ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Helper: auto-update updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- CATEGORIES
-- =====================================================================
CREATE TABLE IF NOT EXISTS categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  description text,
  image_url   text,
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, sort_order);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- Public: read active categories
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (is_active = true);
-- Admin: full access via service role (bypasses RLS — no policy needed)

-- =====================================================================
-- PRODUCTS
-- =====================================================================
CREATE TABLE IF NOT EXISTS products (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid        REFERENCES categories(id) ON DELETE SET NULL,
  name          text        NOT NULL,
  slug          text        UNIQUE NOT NULL,
  description   text,
  price         numeric(10,2),
  price_label   text,                    -- e.g. "From ₹800"
  show_price    boolean     NOT NULL DEFAULT true,  -- hide price on storefront
  image_url     text,
  images        text[]      DEFAULT '{}', -- additional gallery images
  is_available  boolean     NOT NULL DEFAULT true,
  is_featured   boolean     NOT NULL DEFAULT false,
  sort_order    int         NOT NULL DEFAULT 0,
  tags          text[]      DEFAULT '{}',
  variants      jsonb       NOT NULL DEFAULT '[]', -- [{name, price, price_label}]
  meta_title    text,
  meta_desc     text,
  schema_data   jsonb,                   -- JSON-LD structured data overrides
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Run this if you already have the products table:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS show_price boolean NOT NULL DEFAULT true;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, is_available, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_available_products" ON products
  FOR SELECT USING (is_available = true);

-- =====================================================================
-- GALLERY
-- =====================================================================
CREATE TABLE IF NOT EXISTS gallery (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text        NOT NULL,
  caption     text,
  category    text,        -- 'grazing' | 'hampers' | 'breads' | 'dips' | 'snack-boxes' | 'general'
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category, sort_order);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT USING (true);

-- =====================================================================
-- TESTIMONIALS
-- =====================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  location    text,
  rating      int         NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text        text        NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT USING (is_active = true);

-- =====================================================================
-- FAQs
-- =====================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  question    text        NOT NULL,
  answer      text        NOT NULL,
  category    text,        -- 'general' | 'grazing' | 'hampers' | 'ordering'
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_faqs" ON faqs
  FOR SELECT USING (is_active = true);

-- =====================================================================
-- HOMEPAGE CONTENT (CMS-lite)
-- =====================================================================
CREATE TABLE IF NOT EXISTS homepage_content (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key     text UNIQUE NOT NULL,   -- 'hero_title', 'hero_subtitle', 'announcement_text', ...
  value   text,
  type    text NOT NULL DEFAULT 'text'   -- 'text' | 'image' | 'json'
);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_homepage" ON homepage_content FOR SELECT USING (true);

-- =====================================================================
-- ANNOUNCEMENTS (ticker)
-- =====================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  text        text        NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_announcements" ON announcements
  FOR SELECT USING (is_active = true);

-- =====================================================================
-- CONTACT INFO
-- =====================================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key   text UNIQUE NOT NULL,  -- 'phone', 'whatsapp', 'email', 'address', 'hours', 'instagram', 'facebook', 'fssai', 'gstin'
  value text NOT NULL
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_contact" ON contact_info FOR SELECT USING (true);

-- =====================================================================
-- CUSTOMERS (CRM)
-- =====================================================================
CREATE TABLE IF NOT EXISTS customers (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  phone       text        UNIQUE NOT NULL,
  email       text,
  tags        text[]      DEFAULT '{}',  -- 'corporate', 'regular', 'vip', 'bulk'
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_tags ON customers USING GIN(tags);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Customers: no public access (admin only via service role)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- CUSTOMER EVENTS (CRM)
-- =====================================================================
CREATE TABLE IF NOT EXISTS customer_events (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    uuid        REFERENCES customers(id) ON DELETE CASCADE,
  event_type     text        NOT NULL,  -- 'birthday', 'anniversary', 'corporate'
  event_date     date        NOT NULL,  -- YYYY-MM-DD
  previous_order jsonb,                 -- What they ordered last year
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_events_date ON customer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_customer_events_cust ON customer_events(customer_id);

CREATE TRIGGER customer_events_updated_at
  BEFORE UPDATE ON customer_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Events: no public access
ALTER TABLE customer_events ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- ORDERS & BILLING
-- =====================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number    text        UNIQUE NOT NULL,  -- MZ-2026-001
  customer_name     text        NOT NULL,
  customer_phone    text        NOT NULL,
  customer_email    text,
  customer_address  text,
  items             jsonb       NOT NULL,          -- [{name, qty, price, total}]
  subtotal          numeric(10,2),
  discount          numeric(10,2) NOT NULL DEFAULT 0,
  delivery_charge   numeric(10,2) NOT NULL DEFAULT 0,
  cgst_pct          numeric(5,2) NOT NULL DEFAULT 2.5,
  sgst_pct          numeric(5,2) NOT NULL DEFAULT 2.5,
  cgst_amount       numeric(10,2),
  sgst_amount       numeric(10,2),
  total             numeric(10,2),
  status            text        NOT NULL DEFAULT 'pending',
                    -- pending | paid | partially_paid | cancelled
  payment_method    text,       -- 'upi' | 'cash' | 'bank_transfer'
  notes             text,
  invoice_pdf_url   text,       -- Supabase Storage public URL
  whatsapp_sent     boolean     NOT NULL DEFAULT false,
  whatsapp_sent_at  timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_invoice ON orders(invoice_number);
CREATE INDEX IF NOT EXISTS idx_orders_wa_sent ON orders(whatsapp_sent, status);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Orders: no public access
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- WHATSAPP LOGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text        NOT NULL,  -- 'invoice' | 'promotion' | 'reminder'
  recipient   text        NOT NULL,  -- phone number or "N/N recipients"
  message     text,
  status      text        NOT NULL DEFAULT 'pending',  -- pending | sent | failed | partial
  order_id    uuid        REFERENCES orders(id) ON DELETE SET NULL,
  sent_at     timestamptz,
  error       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_logs_type ON whatsapp_logs(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_logs_status ON whatsapp_logs(status);
CREATE INDEX IF NOT EXISTS idx_wa_logs_order ON whatsapp_logs(order_id);

-- Logs: no public access
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Sourdough & Breads', 'breads', 'Small-batch sourdough, multigrain and specialty breads baked fresh.', 1),
  ('Dips & Spreads', 'dips', 'Fresh hummus, mezze, pestos and artisan spreads.', 2),
  ('Snack Boxes', 'snack-boxes', 'Curated snack boxes for offices, parties and gifting.', 3),
  ('Grazing Tables', 'grazing-tables', 'Styled edible centrepieces for events and parties in Bangalore.', 4),
  ('Hampers & Gifting', 'hampers', 'Thoughtfully curated artisan hampers from ₹800.', 5)
ON CONFLICT (slug) DO NOTHING;

-- Default contact info (update with real values)
INSERT INTO contact_info (key, value) VALUES
  ('phone', '919999999999'),
  ('whatsapp', '919999999999'),
  ('email', 'hello@mezclakitchen.in'),
  ('address', 'Studio Kitchen, Bangalore, Karnataka'),
  ('hours', 'Monday – Saturday · 10:00 AM – 7:00 PM'),
  ('instagram', 'https://instagram.com/mezclakitchen'),
  ('facebook', 'https://facebook.com/mezclakitchen'),
  ('fssai', 'FSSAI License: XXXXXXXXXXXX'),
  ('gstin', '29AAAAA0000A1Z5'),
  ('service_area', 'South & Central Bangalore')
ON CONFLICT (key) DO NOTHING;

-- Default announcements
INSERT INTO announcements (text, sort_order) VALUES
  ('Handcrafted in small batches · Order 2–3 days in advance · Delivering across South & Central Bangalore', 0)
ON CONFLICT DO NOTHING;

-- Default FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('How far in advance should I order?', 'Most items need 2–3 days notice. Grazing tables and large hamper orders need 5–7 days. For festive/corporate orders please reach out 3–4 weeks in advance.', 'ordering', 1),
  ('Do you deliver outside Bangalore?', 'Currently we deliver within South & Central Bangalore. For outstation requests for grazing tables, please WhatsApp us.', 'ordering', 2),
  ('Are your products suitable for vegetarians?', 'Yes! Most of our products are vegetarian. We clearly mark eggless and vegan options. Please mention any allergies when ordering.', 'general', 3),
  ('Do you do custom orders?', 'Absolutely! Custom flavours, dietary accommodations, branding for corporate — just WhatsApp us and we will sort it out.', 'general', 4),
  ('What is your minimum order for corporate hampers?', 'Corporate gifting has a minimum order of 50 hampers and requires 3–4 weeks lead time for branding and coordination.', 'hampers', 5)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- SUPABASE STORAGE BUCKET
-- Run this separately or via Supabase dashboard:
-- =====================================================================
-- In Supabase dashboard → Storage → New bucket:
--   Name: mezcla
--   Public: YES (for CDN delivery)
--   File size limit: 5MB
--   Allowed MIME types: image/jpeg,image/png,image/webp,image/avif,application/pdf
