/**
 * PDF Invoice Generator
 * Uses Puppeteer to generate pixel-perfect branded Mezcla invoices from HTML
 * Uploads to Supabase Storage and returns a public URL
 */
import puppeteer from 'puppeteer';
import { adminSupabase } from './supabase.js';
import { nanoid } from 'nanoid';
import type { Order } from '../types/index.js';
import { getInvoiceHTML } from './invoiceTemplate.js';

export async function generateInvoicePDF(order: Order): Promise<string> {
  const htmlContent = getInvoiceHTML(order);

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    
    // Set content and wait for web fonts to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      }
    });

    // Upload to Supabase Storage
    const path = `invoices/${order.invoice_number}-${nanoid(6)}.pdf`;

    const { error } = await adminSupabase.storage
      .from(process.env.STORAGE_BUCKET ?? 'mezcla')
      .upload(path, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '86400', // 1 day cache
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload invoice PDF to Supabase: ${error.message}`);
    }

    const { data: urlData } = adminSupabase.storage
      .from(process.env.STORAGE_BUCKET ?? 'mezcla')
      .getPublicUrl(path);

    return urlData.publicUrl;
  } finally {
    await browser.close();
  }
}
