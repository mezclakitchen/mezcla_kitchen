import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, UpsertCustomerSchema } from '../../lib/schemas.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const { search, tags, page = '1', limit = '50' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = adminSupabase.from('customers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    if (tags) query = query.overlaps('tags', (tags as string).split(','));

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ data, count });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = validate(UpsertCustomerSchema, req.body);
    const { data, error } = await adminSupabase.from('customers').insert(body).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.post('/bulk', async (req, res, next) => {
  try {
    const { customers } = req.body;
    if (!Array.isArray(customers) || customers.length === 0) {
      return res.status(400).json({ error: "Invalid customers array" });
    }
    
    // We use upsert with onConflict on 'phone' so duplicates are updated
    const { data, error } = await adminSupabase
      .from('customers')
      .upsert(customers, { onConflict: 'phone' })
      .select();
      
    if (error) throw error;
    res.json({ data, count: data.length });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = validate(UpsertCustomerSchema, req.body);
    const { data, error } = await adminSupabase.from('customers').update(body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('customers').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
