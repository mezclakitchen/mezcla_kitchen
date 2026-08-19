import rateLimit from 'express-rate-limit';

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too Many Requests',
      message: options.message ?? 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) + ' minutes',
    },
  });
}

/** Stricter limiter for admin endpoints */
export const adminRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: 'Admin rate limit exceeded',
});

/** Strict limiter for invoice/WhatsApp sending */
export const sendRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Send rate limit exceeded. Maximum 10 sends per minute.',
});
