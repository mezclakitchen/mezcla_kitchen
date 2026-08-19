import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** GET /api/announcements — Returns active announcements ordered by sort_order */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, text, sort_order')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

export default router;
