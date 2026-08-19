// Run DDL via Supabase REST API (pg-proxy endpoint) using service role key
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

// Try using Supabase's pg_advisory approach by calling an RPC
// Supabase allows running arbitrary SQL via the postgres REST endpoint
const sql = `ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'`;

const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
  },
  body: JSON.stringify({ sql }),
});

if (res.ok) {
  console.log('✅ exec_sql rpc worked!');
} else {
  const body = await res.text();
  console.log('⚠️  exec_sql rpc not available:', res.status, body.slice(0, 200));
  
  // Fallback: try inserting via select to test if column exists
  const { data, error } = await supabase.from('products').select('id, variants').limit(1);
  if (error && error.code === '42703') {
    console.log('\n❌ Column "variants" does not exist.');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Please run this SQL in Supabase Dashboard → SQL Editor:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]';\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } else if (!error) {
    console.log('✅ Column "variants" already exists! Migration already applied.');
    console.log(`Sample row: ${JSON.stringify(data?.[0])}`);
  } else {
    console.log('❌ Other error:', error);
  }
}
