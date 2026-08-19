/**
 * WAHA (WhatsApp HTTP API) client library
 *
 * Connects to your self-hosted WAHA Docker instance.
 * All WhatsApp message sending goes through here.
 *
 * Docs: https://waha.devlike.pro/docs/how-to/
 */

const WAHA_BASE = process.env.WAHA_BASE_URL ?? 'http://localhost:3000';
const WAHA_KEY = process.env.WAHA_API_KEY ?? '';
const WAHA_SESSION = process.env.WAHA_SESSION ?? 'default';

/** Convert an Indian phone number to WhatsApp chat ID format */
export function toChatId(phone: string): string {
  // Strip non-digits, ensure 91 prefix for India
  const digits = phone.replace(/\D/g, '');
  const number = digits.startsWith('91') ? digits : `91${digits}`;
  return `${number}@c.us`;
}

interface WAHARequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: object;
}

async function wahaFetch<T>(path: string, options: WAHARequestOptions = {}): Promise<T> {
  const response = await fetch(`${WAHA_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': WAHA_KEY,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`WAHA API error ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}

// ─── Session ──────────────────────────────────────────────────

/** Check if WAHA session is connected */
export async function checkWAHASession(): Promise<{ status: string }> {
  return wahaFetch(`/api/sessions/${WAHA_SESSION}`);
}

// ─── Messaging ────────────────────────────────────────────────

/**
 * Send a plain text WhatsApp message
 * @param phone - Phone number (with or without country code)
 * @param text - Message text
 */
export async function sendTextMessage(phone: string, text: string): Promise<void> {
  await wahaFetch('/api/sendText', {
    method: 'POST',
    body: {
      chatId: toChatId(phone),
      text,
      session: WAHA_SESSION,
    },
  });
}

/**
 * Send a file (PDF invoice, image) via WhatsApp
 * @param phone - Phone number
 * @param fileUrl - Publicly accessible URL (Supabase Storage CDN URL)
 * @param caption - Optional caption below the file
 * @param mimetype - MIME type of the file
 */
export async function sendFileMessage(
  phone: string,
  fileUrl: string,
  caption: string,
  mimetype: string = 'application/pdf'
): Promise<void> {
  await wahaFetch('/api/sendFile', {
    method: 'POST',
    body: {
      chatId: toChatId(phone),
      mediaUrl: fileUrl,
      caption,
      mimetype,
      session: WAHA_SESSION,
    },
  });
}

/**
 * Send a WhatsApp message with an image
 */
export async function sendImageMessage(
  phone: string,
  imageUrl: string,
  caption?: string
): Promise<void> {
  await wahaFetch('/api/sendImage', {
    method: 'POST',
    body: {
      chatId: toChatId(phone),
      mediaUrl: imageUrl,
      caption: caption ?? '',
      session: WAHA_SESSION,
    },
  });
}

/**
 * Send bulk messages — iterates with a delay to avoid rate limits
 * @param recipients - Array of {phone, message} objects
 * @param delayMs - Delay between messages (default 1500ms)
 */
export async function sendBulkMessages(
  recipients: Array<{ phone: string; message: string }>,
  delayMs: number = 1500
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const { phone, message } of recipients) {
    try {
      await sendTextMessage(phone, message);
      success++;
    } catch (err) {
      failed++;
      errors.push(`${phone}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    // Polite delay between messages
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return { success, failed, errors };
}

// ─── Message Templates ────────────────────────────────────────

export const waTemplates = {
  invoiceReady: (customerName: string, invoiceNumber: string, total: string) =>
    `Hello ${customerName}! 🎉\n\n` +
    `Your Mezcla order is confirmed.\n` +
    `📋 Invoice: *${invoiceNumber}*\n` +
    `💰 Total: *${total}*\n\n` +
    `Your invoice is attached. Thank you for choosing Mezcla! 🥨\n\n` +
    `— Team Mezcla`,

  orderConfirmation: (customerName: string, items: string, deliveryDate: string) =>
    `Hello ${customerName}! 🧺\n\n` +
    `We've received your order:\n${items}\n\n` +
    `📅 Expected: *${deliveryDate}*\n\n` +
    `We'll reach out closer to delivery. Thank you! 🫶\n\n` +
    `— Team Mezcla`,

  paymentReminder: (customerName: string, invoiceNumber: string, amount: string) =>
    `Hello ${customerName},\n\n` +
    `This is a gentle reminder for invoice *${invoiceNumber}*.\n` +
    `💰 Amount due: *${amount}*\n\n` +
    `Please feel free to reply here if you have any questions.\n\n` +
    `— Team Mezcla`,
};
