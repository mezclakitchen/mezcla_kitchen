import { Router } from 'express';
import express from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, CreateProductSchema, UpdateProductSchema } from '../../lib/schemas.js';
import { uploadImage, deleteImageByUrl } from '../../lib/imageUpload.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

/** GET /api/admin/products */
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = '1', limit = '50' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = adminSupabase
      .from('products')
      .select('*, category:categories(name), variants', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (category) query = query.eq('category_id', category as string);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error, count } = await query;
    // If variants column doesn't exist yet, fall back without it
    if (error && error.code === '42703') {
      let q2 = adminSupabase
        .from('products')
        .select('*, category:categories(name)', { count: 'exact' })
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);
      if (category) q2 = q2.eq('category_id', category as string);
      if (search) q2 = q2.ilike('name', `%${search}%`);
      const { data: d2, error: e2, count: c2 } = await q2;
      if (e2) throw e2;
      return res.json({ data: d2, count: c2 });
    }
    if (error) throw error;
    res.json({ data, count });
  } catch (err) { next(err); }
});

/** POST /api/admin/products */
router.post('/', async (req, res, next) => {
  try {
    const body = validate(CreateProductSchema, req.body);
    const { data, error } = await adminSupabase
      .from('products').insert(body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/products/:id/image — Upload/replace product image */
router.post('/:id/image', express.raw({ type: '*/*', limit: '5mb' }), async (req, res, next) => {
  try {
    // Get old image URL
    const { data: existing } = await adminSupabase
      .from('products').select('image_url').eq('id', req.params.id).single();

    // Expect raw buffer in body (set Content-Type: image/* on upload)
    const buffer = req.body as Buffer;
    const { url } = await uploadImage(buffer, 'products', existing?.image_url, 1200);

    const { data, error } = await adminSupabase
      .from('products')
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single();

    if (error) throw error;
    res.json({ data, imageUrl: url });
  } catch (err) { next(err); }
});

/** PUT /api/admin/products/:id */
router.put('/:id', async (req, res, next) => {
  try {
    const body = validate(UpdateProductSchema, req.body);
    const { show_price, variants, ...coreFields } = body as any;

    // Build the update payload — always include core fields
    const updatePayload: any = { ...coreFields, updated_at: new Date().toISOString() };

    // Add optional columns, gracefully ignoring if they don't exist yet
    if (show_price !== undefined) updatePayload.show_price = show_price;
    if (variants !== undefined) updatePayload.variants = variants;

    const { data, error } = await adminSupabase
      .from('products')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select().single();

    // Graceful fallback: if show_price or variants column missing, retry without them
    if (error && error.code === '42703') {
      const { show_price: _sp, variants: _v, ...safePayload } = updatePayload;
      const { data: d2, error: e2 } = await adminSupabase
        .from('products')
        .update(safePayload)
        .eq('id', req.params.id)
        .select().single();
      if (e2) throw e2;
      return res.json({ data: d2 });
    }
    if (error) throw error;
    return res.json({ data });
  } catch (err) { next(err); }
});


/** DELETE /api/admin/products/:id — also deletes image from storage */
router.delete('/:id', async (req, res, next) => {
  try {
    const { data: prod } = await adminSupabase.from('products').select('image_url, images').eq('id', req.params.id).single();
    const { error } = await adminSupabase.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
    if (error) throw error;

    // Delete images from storage
    if (prod?.image_url) await deleteImageByUrl(prod.image_url);
    if (prod?.images) {
      for (const img of prod.images as string[]) await deleteImageByUrl(img);
    }

    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
