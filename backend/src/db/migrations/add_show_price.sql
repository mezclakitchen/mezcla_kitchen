-- =====================================================================
-- MIGRATION: Add show_price column to products
-- Run this in: Supabase Dashboard ? SQL Editor
-- =====================================================================

-- Add show_price column (defaults to true so existing products stay visible)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS show_price boolean NOT NULL DEFAULT true;

-- Verify it was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'show_price';
