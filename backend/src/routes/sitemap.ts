import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

const SITE_URL = 'https://mezclakitchen.in';

const staticPages = [
  // Core
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  { url: '/gallery', priority: '0.7', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  // Menu (5 categories)
  { url: '/sourdough-breads', priority: '0.9', changefreq: 'weekly' },
  { url: '/specialty-breads', priority: '0.85', changefreq: 'weekly' },
  { url: '/other-bakes', priority: '0.85', changefreq: 'weekly' },
  { url: '/dips', priority: '0.85', changefreq: 'weekly' },
  { url: '/cakes', priority: '0.8', changefreq: 'weekly' },
  // Legacy bread route (kept for backcompat)
  { url: '/breads', priority: '0.75', changefreq: 'weekly' },
  // Experiences
  { url: '/grazing-tables', priority: '0.9', changefreq: 'weekly' },
  { url: '/snack-boxes', priority: '0.85', changefreq: 'weekly' },
  { url: '/food-hampers', priority: '0.85', changefreq: 'weekly' },
  { url: '/workshops', priority: '0.8', changefreq: 'weekly' },
  { url: '/catering', priority: '0.8', changefreq: 'weekly' },
  { url: '/plan-event', priority: '0.75', changefreq: 'monthly' },
];

function urlTag(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/** GET /sitemap.xml — Dynamic XML sitemap pulling from Supabase */
router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_available', true);

    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true);

    const staticEntries = staticPages
      .map(p => urlTag(p.url, today, p.changefreq, p.priority))
      .join('\n');

    const productEntries = (products ?? [])
      .map(p => urlTag(
        `/products/${p.slug}`,
        p.updated_at?.split('T')[0] ?? today,
        'weekly',
        '0.8'
      )).join('\n');

    const categoryEntries = (categories ?? [])
      .map(c => urlTag(
        `/${c.slug}`,
        c.updated_at?.split('T')[0] ?? today,
        'weekly',
        '0.85'
      )).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${categoryEntries}
${productEntries}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    res.send(xml);
  } catch (err) {
    res.status(500).send('Failed to generate sitemap');
  }
});

/** GET /robots.txt */
router.get('/robots.txt', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/webhooks/

Sitemap: ${SITE_URL}/sitemap.xml
`);
});

export default router;
