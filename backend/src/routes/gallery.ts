import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** GET /api/gallery */
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = supabase.from('gallery').select('*').order('sort_order');
    if (category) query = query.eq('category', category as string);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

export default router;
