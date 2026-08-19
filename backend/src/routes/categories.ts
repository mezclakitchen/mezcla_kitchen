import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(*)')
      .is('deleted_at', null)
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();
    if (error || !data) { res.status(404).json({ error: 'Category not found' }); return; }
    res.json({ data });
  } catch (err) { next(err); }
});

export default router;
