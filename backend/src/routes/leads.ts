/**
 * POST /api/leads — Newsletter subscribe
 * Stores email in the leads table for the Mezcla Circle
 * Rate limited to prevent spam.
 */
import { Router } from 'express';
import { adminSupabase } from '../lib/supabase.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Strict rate limit for subscribe endpoint: 3 per 15 minutes per IP
const subscribeRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 3 });

/** POST /api/leads — Subscribe to newsletter */
router.post('/', subscribeRateLimiter, async (req, res, next) => {
  try {
    const { email, name, source = 'newsletter' } = req.body as {
      email?: string;
      name?: string;
      source?: string;
    };

    // Basic validation
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Honeypot check — if 'company' field is filled, silently succeed (bot)
    if ((req.body as any).company) {
      return res.json({ success: true, message: 'Welcome to the Mezcla Circle!' });
    }

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim().slice(0, 255);
    const sanitizedName = name ? String(name).trim().slice(0, 100) : null;
    const allowedSources = ['newsletter', 'website', 'whatsapp', 'instagram', 'referral'];
    const sanitizedSource = allowedSources.includes(source) ? source : 'newsletter';

    // Upsert — ignore duplicate emails gracefully
    const { error } = await adminSupabase
      .from('leads')
      .upsert(
        {
          email: sanitizedEmail,
          name: sanitizedName,
          source: sanitizedSource,
        },
        { onConflict: 'email', ignoreDuplicates: true }
      );

    if (error && error.code !== '23505') {
      // 23505 = unique violation (already subscribed) — handle gracefully
      throw error;
    }

    res.json({ success: true, message: 'Welcome to the Mezcla Circle!' });
  } catch (err) {
    next(err);
  }
});

export default router;
