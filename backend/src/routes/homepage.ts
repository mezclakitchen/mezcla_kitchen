import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** GET /api/homepage — Returns all homepage_content entries as key→value map */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('homepage_content').select('key, value, type');
    if (error) throw error;
    const map = Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
    res.json({ data: map });
  } catch (err) { next(err); }
});

export default router;
