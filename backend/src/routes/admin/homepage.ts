import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, UpdateSettingsSchema } from '../../lib/schemas.js';

const router = Router();
router.use(requireAdmin);

/** GET /api/admin/homepage — All content blocks */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase.from('homepage_content').select('*').order('key');
    if (error) throw error;
    // Convert to key-value map for easy consumption
    const map = Object.fromEntries((data ?? []).map(r => [r.key, r]));
    res.json({ data: map });
  } catch (err) { next(err); }
});

/** PUT /api/admin/homepage/:key — Update single content block */
router.put('/:key', async (req, res, next) => {
  try {
    const { value } = validate(UpdateSettingsSchema, { key: req.params.key, ...req.body });
    const { data, error } = await adminSupabase
      .from('homepage_content')
      .upsert({ key: req.params.key, value }, { onConflict: 'key' })
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

export default router;
