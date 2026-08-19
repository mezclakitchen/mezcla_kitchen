import { Router } from 'express';
import express from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, CreateCategorySchema, UpdateCategorySchema } from '../../lib/schemas.js';
import { uploadImage, deleteImageByUrl } from '../../lib/imageUpload.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase.from('categories').select('*, products(count)').is('deleted_at', null).order('sort_order');
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = validate(CreateCategorySchema, req.body);
    const { data, error } = await adminSupabase.from('categories').insert(body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

router.post('/:id/image', express.raw({ type: '*/*', limit: '5mb' }), async (req, res, next) => {
  try {
    const { data: existing } = await adminSupabase.from('categories').select('image_url').eq('id', req.params.id).single();
    const { url } = await uploadImage(req.body as Buffer, 'categories', existing?.image_url, 800);
    const { data, error } = await adminSupabase.from('categories').update({ image_url: url }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ data, imageUrl: url });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = validate(UpdateCategorySchema, req.body);
    const { data, error } = await adminSupabase.from('categories').update(body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { data: cat } = await adminSupabase.from('categories').select('image_url').eq('id', req.params.id).single();
    const { error } = await adminSupabase.from('categories').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
    if (error) throw error;
    if (cat?.image_url) await deleteImageByUrl(cat.image_url);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
