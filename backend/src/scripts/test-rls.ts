import 'dotenv/config';
import { supabase } from '../lib/supabase.js';

async function test() {
  const { data, error } = await supabase
    .from('announcements')
    .select('id, text, sort_order')
    .eq('is_active', true);
  
  if (error) {
    console.error("Public supabase client query error:", error);
  } else {
    console.log("Public supabase client query returned data:", data);
  }
}

test();
