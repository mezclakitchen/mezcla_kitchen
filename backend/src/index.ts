/**
 * Mezcla Backend API — Entry Point
 * Express 5 + Supabase + WAHA integration
 */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// ─── Public route imports ─────────────────────────────────────
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import galleryRouter from './routes/gallery.js';
import testimonialsRouter from './routes/testimonials.js';
import faqsRouter from './routes/faqs.js';
import sitemapRouter from './routes/sitemap.js';
import contactRouter from './routes/contact.js';
import announcementsRouter from './routes/announcements.js';
import homepageRouter from './routes/homepage.js';
import leadsRouter from './routes/leads.js';

// ─── Admin route imports ───────────────────────────────────────
import adminProductsRouter from './routes/admin/products.js';
import adminCategoriesRouter from './routes/admin/categories.js';
import adminOrdersRouter from './routes/admin/orders.js';
import adminCustomersRouter from './routes/admin/customers.js';
import adminGalleryRouter from './routes/admin/gallery.js';
import adminHomepageRouter from './routes/admin/homepage.js';
import adminDashboardRouter from './routes/admin/dashboard.js';
import adminWhatsAppRouter from './routes/admin/whatsapp.js';
import adminSettingsRouter from './routes/admin/settings.js';
import adminTestimonialsRouter from './routes/admin/testimonials.js';
import adminLeadsRouter from './routes/admin/leads.js';
import adminCrmRouter from './routes/admin/crm.js';
import adminMenusRouter from './routes/admin/menus.js';

// ─── Webhook route imports ────────────────────────────────────

import { startCronJobs } from './jobs/cronJobs.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// ─── Security middleware ───────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow Supabase storage embeds
}));

app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS ?? '').split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Raw buffer support for image uploads
app.use(requestLogger);

// ─── Global rate limiter ───────────────────────────────────────
app.use(createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900_000),
  max: Number(process.env.RATE_LIMIT_MAX ?? 100),
}));

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'mezcla-api' });
});

// ─── Public API routes ────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/leads', leadsRouter);
app.use('/', sitemapRouter); // serves /sitemap.xml and /robots.txt

// ─── Admin API routes (auth-protected) ───────────────────────
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/customers', adminCustomersRouter);
app.use('/api/admin/gallery', adminGalleryRouter);
app.use('/api/admin/homepage', adminHomepageRouter);
app.use('/api/admin/whatsapp', adminWhatsAppRouter);
app.use('/api/admin/settings', adminSettingsRouter);
app.use('/api/admin/testimonials', adminTestimonialsRouter);
app.use('/api/admin/leads', adminLeadsRouter);
app.use('/api/admin/crm', adminCrmRouter);
app.use('/api/admin/menus', adminMenusRouter);

// ─── Webhook routes ───────────────────────────────────────────


// ─── Error handler (must be last) ─────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Mezcla API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  startCronJobs();
});

export default app;
