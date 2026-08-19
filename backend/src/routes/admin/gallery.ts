import { Router } from 'express';
import express from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { uploadImage, deleteImageByUrl } from '../../lib/imageUpload.js';
import { validate, UpdateGalleryItemSchema } from '../../lib/schemas.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = adminSupabase.from('gallery').select('*').order('sort_order');
    if (category) query = query.eq('category', category as string);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.post('/upload', express.raw({ type: '*/*', limit: '10mb' }), async (req, res, next) => {
  try {
    const { category = 'general', caption, sort_order = 0 } = req.query;
    const { url } = await uploadImage(req.body as Buffer, 'gallery', null, 1920);
    const { data, error } = await adminSupabase.from('gallery').insert({
      url, caption: caption as string ?? '', category: category as string, sort_order: Number(sort_order),
    }).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const body = validate(UpdateGalleryItemSchema, req.body);
    const { data, error } = await adminSupabase.from('gallery').update(body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { data: item } = await adminSupabase.from('gallery').select('url').eq('id', req.params.id).single();
    const { error } = await adminSupabase.from('gallery').delete().eq('id', req.params.id);
    if (error) throw error;
    if (item?.url) await deleteImageByUrl(item.url);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
