import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** GET /api/contact — Returns all contact_info as key→value map */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('contact_info').select('key, value');
    if (error) throw error;
    const map = Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
    res.json({ data: map });
  } catch (err) { next(err); }
});

export default router;
