import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminSupabase } from '../../lib/supabase.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { z } from 'zod';
import { validate } from '../../lib/schemas.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter); // Added rate limiting to all settings routes

// ─── Zod Schemas ────────────────────────────────────────────────
const ContactValueSchema = z.object({ value: z.string().trim() });
const BulkContactSchema = z.array(z.object({ key: z.string().trim(), value: z.string().trim() }));

const HomepageValueSchema = z.object({ value: z.string().trim(), type: z.string().optional() });
const BulkHomepageSchema = z.array(z.object({ key: z.string().trim(), value: z.string().trim(), type: z.string().optional() }));

const AnnouncementSchema = z.object({
  text: z.string().trim().min(1, "Text is required"),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional()
});
const UpdateAnnouncementSchema = AnnouncementSchema.partial();

const FaqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional()
});
const UpdateFaqSchema = FaqSchema.partial();

// ─── Contact Info ───────────────────────────────────────────────

/** GET /api/admin/settings/contact */
router.get('/contact', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase.from('contact_info').select('*');
    if (error) throw error;
    const map = Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
    res.json({ data: map });
  } catch (err) { next(err); }
});

/** PUT /api/admin/settings/contact/:key */
router.put('/contact/:key', async (req, res, next) => {
  try {
    const { value } = validate(ContactValueSchema, req.body);
    const { data, error } = await adminSupabase
      .from('contact_info')
      .upsert({ key: req.params.key, value }, { onConflict: 'key' })
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/settings/contact/bulk — Save multiple contact fields at once */
router.post('/contact/bulk', async (req, res, next) => {
  try {
    const entries = validate(BulkContactSchema, req.body);
    const { data, error } = await adminSupabase
      .from('contact_info')
      .upsert(entries, { onConflict: 'key' })
      .select();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

// ─── Homepage Content ───────────────────────────────────────────

/** GET /api/admin/settings/homepage */
router.get('/homepage', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase.from('homepage_content').select('*');
    if (error) throw error;
    const map = Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
    res.json({ data: map });
  } catch (err) { next(err); }
});

/** PUT /api/admin/settings/homepage/:key */
router.put('/homepage/:key', async (req, res, next) => {
  try {
    const { value, type } = validate(HomepageValueSchema, req.body);
    const { data, error } = await adminSupabase
      .from('homepage_content')
      .upsert({ key: req.params.key, value, type: type ?? 'text' }, { onConflict: 'key' })
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/settings/homepage/bulk */
router.post('/homepage/bulk', async (req, res, next) => {
  try {
    const entries = validate(BulkHomepageSchema, req.body);
    const rows = entries.map(e => ({ ...e, type: e.type ?? 'text' }));
    const { data, error } = await adminSupabase
      .from('homepage_content')
      .upsert(rows, { onConflict: 'key' })
      .select();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

// ─── Announcements ──────────────────────────────────────────────

/** GET /api/admin/settings/announcements */
router.get('/announcements', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('announcements')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/settings/announcements */
router.post('/announcements', async (req, res, next) => {
  try {
    const validated = validate(AnnouncementSchema, req.body);
    const { data, error } = await adminSupabase
      .from('announcements')
      .insert({ ...validated, sort_order: validated.sort_order ?? 0, is_active: validated.is_active ?? true })
      .select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

/** PUT /api/admin/settings/announcements/:id */
router.put('/announcements/:id', async (req, res, next) => {
  try {
    const validated = validate(UpdateAnnouncementSchema, req.body);
    const { data, error } = await adminSupabase
      .from('announcements')
      .update(validated)
      .eq('id', req.params.id)
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** DELETE /api/admin/settings/announcements/:id */
router.delete('/announcements/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('announcements').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { next(err); }
});

// ─── FAQs ───────────────────────────────────────────────────────

/** GET /api/admin/settings/faqs */
router.get('/faqs', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('faqs')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** POST /api/admin/settings/faqs */
router.post('/faqs', async (req, res, next) => {
  try {
    const validated = validate(FaqSchema, req.body);
    const { data, error } = await adminSupabase
      .from('faqs')
      .insert({ ...validated, sort_order: validated.sort_order ?? 0, is_active: validated.is_active ?? true })
      .select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

/** PUT /api/admin/settings/faqs/:id */
router.put('/faqs/:id', async (req, res, next) => {
  try {
    const validated = validate(UpdateFaqSchema, req.body);
    const { data, error } = await adminSupabase
      .from('faqs')
      .update(validated)
      .eq('id', req.params.id)
      .select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** DELETE /api/admin/settings/faqs/:id */
router.delete('/faqs/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('faqs').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
