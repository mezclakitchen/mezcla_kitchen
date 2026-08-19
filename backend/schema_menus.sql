-- =====================================================================
-- MULTIPLE MENUS SCHEMA
-- =====================================================================

CREATE TABLE IF NOT EXISTS menus (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  tagline     text,
  theme       text        NOT NULL DEFAULT 'light',
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_active_menus" ON menus
  FOR SELECT USING (is_active = true);

-- =====================================================================
-- MENU ITEMS
-- =====================================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id            uuid        NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  product_id         uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  custom_price       numeric(10,2),
  custom_price_label text,
  sort_order         int         NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE(menu_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu ON menu_items(menu_id, sort_order);

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT USING (true);

-- Add theme column if it doesn't exist (in case the table was already created)
ALTER TABLE menus ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'light';

-- Add diet flags to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_vegan boolean NOT NULL DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_gf boolean NOT NULL DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS has_nuts boolean NOT NULL DEFAULT false;
