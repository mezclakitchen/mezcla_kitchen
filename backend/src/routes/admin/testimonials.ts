import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminSupabase } from '../../lib/supabase.js';

const router = Router();
router.use(requireAdmin);

/** GET /api/admin/testimonials */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/testimonials */
router.post('/', async (req, res, next) => {
  try {
    const { name, location, rating, text, is_active } = req.body as {
      name: string; location?: string; rating: number; text: string; is_active?: boolean;
    };
    const { data, error } = await adminSupabase
      .from('testimonials')
      .insert({ name, location, rating, text, is_active: is_active ?? true })
      .select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

/** PUT /api/admin/testimonials/:id */
router.put('/:id', async (req, res, next) => {
  try {
    const { name, location, rating, text, is_active } = req.body as {
      name?: string; location?: string; rating?: number; text?: string; is_active?: boolean;
    };
    const { data, error } = await adminSupabase
      .from('testimonials')
      .update({ name, location, rating, text, is_active })
      .eq('id', req.params.id)
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** DELETE /api/admin/testimonials/:id */
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('testimonials').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
