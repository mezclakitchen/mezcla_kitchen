import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter, sendRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, CreateOrderSchema, UpdateOrderStatusSchema } from '../../lib/schemas.js';
import { generateInvoicePDF } from '../../lib/invoicePdf.js';
import { sendFileMessage, sendTextMessage, waTemplates } from '../../lib/waha.js';
import type { Order } from '../../types/index.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

/** Generate unique invoice number: MZ-2026-001 */
async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await adminSupabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${year}-01-01T00:00:00Z`);
  const seq = String((count ?? 0) + 1).padStart(3, '0');
  return `MZ-${year}-${seq}`;
}

/** Calculate order totals */
function calcTotals(
  items: Array<{ price: number; qty: number; total: number }>,
  discount: number,
  deliveryCharge: number,
  cgstPct: number,
  sgstPct: number
) {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxable = subtotal - discount + deliveryCharge;
  const cgst = parseFloat(((taxable * cgstPct) / 100).toFixed(2));
  const sgst = parseFloat(((taxable * sgstPct) / 100).toFixed(2));
  const total = parseFloat((taxable + cgst + sgst).toFixed(2));
  return { subtotal, cgst_amount: cgst, sgst_amount: sgst, total };
}

// ─── GET /api/admin/orders ─────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = adminSupabase
      .from('orders')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status && status !== 'all') query = query.eq('status', status as string);
    if (search) query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,invoice_number.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
});

// ─── GET /api/admin/orders/:id ────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('orders').select('*').eq('id', req.params.id).single();
    if (error || !data) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json({ data });
  } catch (err) { next(err); }
});

// ─── POST /api/admin/orders — Create order + generate invoice ──
router.post('/', async (req, res, next) => {
  try {
    const body = validate(CreateOrderSchema, req.body);
    const invoiceNumber = await getNextInvoiceNumber();
    const { subtotal, cgst_amount, sgst_amount, total } = calcTotals(
      body.items,
      body.discount ?? 0,
      body.delivery_charge ?? 0,
      body.cgst_pct ?? 2.5,
      body.sgst_pct ?? 2.5
    );

    const { data, error } = await adminSupabase
      .from('orders')
      .insert({
        ...body,
        invoice_number: invoiceNumber,
        subtotal,
        cgst_amount,
        sgst_amount,
        total,
      })
      .select()
      .single();

    if (error) throw error;

    // Upsert customer record for CRM
    await adminSupabase.from('customers').upsert({
      name: body.customer_name,
      phone: body.customer_phone,
      email: body.customer_email,
    }, { onConflict: 'phone', ignoreDuplicates: false });

    // Automatically add to newsletter leads if email is provided
    if (body.customer_email) {
      await adminSupabase.from('leads').upsert({
        email: body.customer_email.toLowerCase().trim(),
        name: body.customer_name,
        source: 'customer',
      }, { onConflict: 'email', ignoreDuplicates: true });
    }

    res.status(201).json({ data, invoiceNumber });
  } catch (err) { next(err); }
});

// ─── PATCH /api/admin/orders/:id/status ───────────────────────
router.patch('/:id/status', async (req, res, next) => {
  try {
    const body = validate(UpdateOrderStatusSchema, req.body);
    const { data, error } = await adminSupabase
      .from('orders')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

// ─── POST /api/admin/orders/:id/invoice — Generate PDF ────────
router.post('/:id/invoice', async (req, res, next) => {
  try {
    const { data: order, error } = await adminSupabase
      .from('orders').select('*').eq('id', req.params.id).single();
    if (error || !order) { res.status(404).json({ error: 'Order not found' }); return; }

    const pdfUrl = await generateInvoicePDF(order as Order);

    await adminSupabase.from('orders')
      .update({ invoice_pdf_url: pdfUrl })
      .eq('id', req.params.id);

    res.json({ invoicePdfUrl: pdfUrl });
  } catch (err) { next(err); }
});

// ─── POST /api/admin/orders/:id/send-invoice ──────────────────
router.post('/:id/send-invoice', sendRateLimiter, async (req, res, next) => {
  try {
    const { data: order, error } = await adminSupabase
      .from('orders').select('*').eq('id', req.params.id).single();
    if (error || !order) { res.status(404).json({ error: 'Order not found' }); return; }

    // Generate PDF if not already done
    let pdfUrl = order.invoice_pdf_url;
    if (!pdfUrl) {
      pdfUrl = await generateInvoicePDF(order as Order);
      await adminSupabase.from('orders').update({ invoice_pdf_url: pdfUrl }).eq('id', order.id);
    }

    // Send text notification first
    const textMsg = waTemplates.invoiceReady(
      order.customer_name,
      order.invoice_number,
      `₹${order.total?.toLocaleString('en-IN')}`
    );
    await sendTextMessage(order.customer_phone, textMsg);

    // Send PDF
    await sendFileMessage(
      order.customer_phone,
      pdfUrl,
      `Invoice ${order.invoice_number} — Mezcla`,
      'application/pdf'
    );

    // Update DB
    await adminSupabase.from('orders').update({
      whatsapp_sent: true,
      whatsapp_sent_at: new Date().toISOString(),
    }).eq('id', order.id);

    // Log
    await adminSupabase.from('whatsapp_logs').insert({
      type: 'invoice',
      recipient: order.customer_phone,
      message: textMsg,
      status: 'sent',
      order_id: order.id,
      sent_at: new Date().toISOString(),
    });

    res.json({ success: true, message: `Invoice sent to ${order.customer_phone}` });
  } catch (err) {
    // Log failure
    try {

      await adminSupabase.from('whatsapp_logs').insert({
        type: 'invoice',
        recipient: 'unknown',
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown',
      });
    } catch { /* ignore log failure */ }
    next(err);
  }
});

// ─── DELETE /api/admin/orders/:id ─────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase.from('orders').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
