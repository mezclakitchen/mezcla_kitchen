/**
 * Supabase clients — backend only.
 * - supabase: public client (respects RLS)
 * - adminSupabase: service role client (bypasses RLS — server use only)
 *
 * CRITICAL: Never import adminSupabase in frontend or admin projects.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

/** Public client — respects Row Level Security */
export const supabase = createClient<any>(url, anonKey);

/** Admin client — bypasses RLS. Use only in server-side admin routes. */
export const adminSupabase = createClient<any>(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/** Verify a Supabase JWT from a request Authorization header */
export async function verifyToken(authHeader: string | undefined): Promise<string> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or malformed Authorization header');
  }
  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Invalid or expired token');

  // Enforce admin email whitelist
  const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS ?? '').split(',').map(e => e.trim());
  if (!allowedEmails.includes(user.email ?? '')) {
    throw new Error('Forbidden: not an admin account');
  }
  return user.id;
}
