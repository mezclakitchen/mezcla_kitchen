import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

// ─── GET /api/admin/leads ──────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { search, page = '1', limit = '50' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = adminSupabase
      .from('leads')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/admin/leads/:id ──────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('leads').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
