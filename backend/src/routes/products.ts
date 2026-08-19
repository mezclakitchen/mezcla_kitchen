import { Router } from 'express';
import { adminSupabase } from '../lib/supabase.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/** GET /api/products — All available products, optionally filtered by category slug */
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, limit, tag } = req.query;

    const selectCols = `*, categories${category ? '!inner' : ''}(name, slug), variants`;

    let query = adminSupabase
      .from('products')
      .select(selectCols)
      .is('deleted_at', null)
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('categories.slug', category as string);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (tag) {
      query = query.contains('tags', [tag as string]);
    }
    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    // Graceful fallback if variants column doesn't exist yet in DB
    if (error && error.code === '42703') {
      const selectColsFallback = `*, categories${category ? '!inner' : ''}(name, slug)`;
      let q2 = adminSupabase
        .from('products')
        .select(selectColsFallback)
        .is('deleted_at', null)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });
      if (category) q2 = q2.eq('categories.slug', category as string);
      if (featured === 'true') q2 = q2.eq('is_featured', true);
      if (tag) q2 = q2.contains('tags', [tag as string]);
      if (limit) q2 = q2.limit(Number(limit));
      const { data: d2, error: e2 } = await q2;
      if (e2) throw e2;
      return res.json({ data: d2, count: d2?.length ?? 0 });
    }
    if (error) throw error;

    res.json({ data, count: data?.length ?? 0 });
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/:slug — Single product by slug */
router.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('products')
      .select('*, categories(name, slug), variants')
      .is('deleted_at', null)
      .eq('slug', req.params.slug)
      .eq('is_available', true)
      .single();

    // Graceful fallback if variants column doesn't exist yet
    if (error && error.code === '42703') {
      const { data: d2, error: e2 } = await adminSupabase
        .from('products')
        .select('*, categories(name, slug)')
        .is('deleted_at', null)
        .eq('slug', req.params.slug)
        .eq('is_available', true)
        .single();
      if (e2 || !d2) { res.status(404).json({ error: 'Product not found' }); return; }
      return res.json({ data: d2 });
    }

    if (error || !data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

const enquireLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many enquiries, please try again later',
});

/** POST /api/products/:id/enquire — Increment enquiry count */
router.post('/:id/enquire', enquireLimiter, async (req, res, next) => {
  try {
    const { data: product, error: fetchError } = await adminSupabase
      .from('products')
      .select('enquiries_count')
      .eq('id', req.params.id)
      .single();

    if (fetchError && fetchError.code !== '42703') { // Ignore missing column error in case migration not run
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product && product.enquiries_count !== undefined) {
      const { error: updateError } = await adminSupabase
        .from('products')
        .update({ enquiries_count: (product.enquiries_count || 0) + 1 })
        .eq('id', req.params.id);
      
      if (updateError && updateError.code !== '42703') throw updateError;
    }
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
