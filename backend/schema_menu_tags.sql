ALTER TABLE menu_items 
  ADD COLUMN IF NOT EXISTS is_vegan boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_gf boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_nuts boolean NOT NULL DEFAULT false;
