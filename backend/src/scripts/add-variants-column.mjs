// Migration: Add variants column to products table
// Run with: node src/scripts/add-variants-column.mjs

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from backend root
dotenv.config({ path: resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('🔄 Running migration: add variants column to products...');

  // Use the rpc function to run raw SQL via supabase
  // We'll use a workaround via the JS client — insert a test product with variants
  // and catch the error to know if migration is needed, OR use pg directly.
  
  // Since we can't run raw DDL via the JS client easily, we'll try an upsert
  // with variants and see if it succeeds. If not, we need Supabase Dashboard.

  // Attempt: try to select variants column
  const { data, error } = await supabase
    .from('products')
    .select('id, variants')
    .limit(1);

  if (error && error.code === '42703') {
    console.log('⚠️  Column "variants" does not exist yet.');
    console.log('');
    console.log('Please run this SQL in your Supabase SQL Editor:');
    console.log('');
    console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT \'[]\';');
    console.log('');
    console.log('Then re-run this script to verify.');
    process.exit(0);
  } else if (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Column "variants" already exists on products table.');
    console.log(`   Found ${data?.length ?? 0} product(s).`);
    process.exit(0);
  }
}

migrate();
