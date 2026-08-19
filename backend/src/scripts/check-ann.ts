import 'dotenv/config';
import { adminSupabase } from '../lib/supabase.js';

async function check() {
  const { data: adminData, error: adminError } = await adminSupabase
    .from('announcements')
    .select('*');
  
  if (adminError) {
    console.error("Admin query error:", adminError);
  } else {
    console.log("Admin query results (all rows):", adminData);
  }

  // Also test with public anonymous client to see if RLS works
  const { data: pubData, error: pubError } = await adminSupabase
    .from('announcements')
    .select('id, text, sort_order')
    .eq('is_active', true);
  
  if (pubError) {
    console.error("Public query error:", pubError);
  } else {
    console.log("Public query results (active rows):", pubData);
  }
}

check();
