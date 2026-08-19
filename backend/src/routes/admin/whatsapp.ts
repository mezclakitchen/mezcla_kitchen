import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter, sendRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, SendPromotionSchema } from '../../lib/schemas.js';
import { sendBulkMessages, checkWAHASession } from '../../lib/waha.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

/** GET /api/admin/whatsapp/status — WAHA session health */
router.get('/status', async (_req, res, next) => {
  try {
    const status = await checkWAHASession();
    res.json({ data: status });
  } catch (err) { next(err); }
});

/** GET /api/admin/whatsapp/logs */
router.get('/logs', async (req, res, next) => {
  try {
    const { type, status, page = '1', limit = '50' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = adminSupabase
      .from('whatsapp_logs')
      .select('*, orders(invoice_number, customer_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (type) query = query.eq('type', type as string);
    if (status) query = query.eq('status', status as string);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ data, count });
  } catch (err) { next(err); }
});

/** POST /api/admin/whatsapp/send-promotion — Bulk WhatsApp send */
router.post('/send-promotion', sendRateLimiter, async (req, res, next) => {
  try {
    const body = validate(SendPromotionSchema, req.body);

    // Get recipients
    let customerQuery = adminSupabase.from('customers').select('phone, name');
    if (body.customerIds?.length) {
      customerQuery = customerQuery.in('id', body.customerIds);
    } else if (body.tags?.length) {
      customerQuery = customerQuery.overlaps('tags', body.tags);
    } else if (!body.allCustomers) {
      res.status(400).json({ error: 'Specify customerIds, tags, or allCustomers=true' });
      return;
    }

    const { data: customers, error } = await customerQuery;
    if (error) throw error;

    const recipients = (customers ?? []).map(c => ({
      phone: c.phone,
      message: body.message,
    }));

    const result = await sendBulkMessages(recipients);

    // Log results
    await adminSupabase.from('whatsapp_logs').insert({
      type: 'promotion',
      recipient: `${result.success}/${recipients.length} recipients`,
      message: body.message,
      status: result.failed === 0 ? 'sent' : 'partial',
      sent_at: new Date().toISOString(),
      error: result.errors.slice(0, 5).join('; ') || null,
    });

    res.json({ ...result, total: recipients.length });
  } catch (err) { next(err); }
});

export default router;
