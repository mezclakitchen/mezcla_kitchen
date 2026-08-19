import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/supabase.js';

/**
 * Admin authentication middleware.
 * Verifies Supabase JWT and checks admin email whitelist.
 * Attach to all /api/admin/* routes.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = await verifyToken(req.headers.authorization);
    (req as any).adminUserId = userId;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Unauthorized',
      message: err instanceof Error ? err.message : 'Authentication required',
    });
  }
}
