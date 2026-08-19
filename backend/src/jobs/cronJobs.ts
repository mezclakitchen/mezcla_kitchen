/**
 * Background cron jobs
 * - WhatsApp invoice retry (every 30 min)
 * - Daily cleanup of old logs
 */
import { schedule } from 'node-cron';
import { adminSupabase } from '../lib/supabase.js';
import { sendFileMessage, sendTextMessage, waTemplates } from '../lib/waha.js';

export function startCronJobs(): void {
  // ─── Invoice retry job ─────────────────────────────────────
  // Retry failed WhatsApp invoice deliveries every 30 minutes
  schedule(process.env.CRON_WA_RETRY ?? '*/30 * * * *', async () => {
    console.log('[CRON] Running WhatsApp invoice retry job...');
    try {
      const { data: failedOrders } = await adminSupabase
        .from('orders')
        .select('*')
        .eq('whatsapp_sent', false)
        .eq('status', 'paid')
        .not('invoice_pdf_url', 'is', null)
        .limit(10);

      if (!failedOrders?.length) return;
      console.log(`[CRON] Retrying ${failedOrders.length} failed invoice deliveries`);

      for (const order of failedOrders) {
        try {
          const msg = waTemplates.invoiceReady(
            order.customer_name,
            order.invoice_number,
            `₹${order.total?.toLocaleString('en-IN')}`
          );
          await sendTextMessage(order.customer_phone, msg);
          await sendFileMessage(order.customer_phone, order.invoice_pdf_url, `Invoice ${order.invoice_number}`, 'application/pdf');
          await adminSupabase.from('orders').update({
            whatsapp_sent: true,
            whatsapp_sent_at: new Date().toISOString(),
          }).eq('id', order.id);
          console.log(`[CRON] Invoice retry success for order ${order.invoice_number}`);
        } catch (err) {
          console.error(`[CRON] Invoice retry failed for ${order.invoice_number}:`, err);
        }
        await new Promise(r => setTimeout(r, 2000)); // 2s between retries
      }
    } catch (err) {
      console.error('[CRON] Invoice retry job error:', err);
    }
  });

  // ─── Log cleanup job (daily at 3 AM IST) ─────────────────
  schedule('30 21 * * *', async () => { // 21:30 UTC = 3:00 AM IST
    console.log('[CRON] Cleaning old WhatsApp logs and old PDFs...');
    try {
      // 1. Cleanup old WhatsApp logs
      const logCutoff = new Date();
      logCutoff.setDate(logCutoff.getDate() - 90); // Keep logs for 90 days
      await adminSupabase.from('whatsapp_logs').delete().lt('created_at', logCutoff.toISOString());

      // 2. Prune old Invoice PDFs to save storage space (Keep for 30 days)
      const pdfCutoff = new Date();
      pdfCutoff.setDate(pdfCutoff.getDate() - 30);
      
      const { data: oldOrders } = await adminSupabase
        .from('orders')
        .select('id, invoice_pdf_url')
        .not('invoice_pdf_url', 'is', null)
        .lt('created_at', pdfCutoff.toISOString());

      if (oldOrders && oldOrders.length > 0) {
        // We must import deleteImageByUrl dynamically or at the top of the file
        const { deleteImageByUrl } = await import('../lib/imageUpload.js');
        
        console.log(`[CRON] Found ${oldOrders.length} old invoice PDFs to prune.`);
        for (const order of oldOrders) {
          if (order.invoice_pdf_url) {
            await deleteImageByUrl(order.invoice_pdf_url);
            await adminSupabase.from('orders').update({ invoice_pdf_url: null }).eq('id', order.id);
          }
        }
      }
    } catch (err) {
      console.error('[CRON] Cleanup job error:', err);
    }
  });

  console.log('✅ Cron jobs initialized (invoice retry + log cleanup)');
}
