import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Fetch dynamic sitemap from backend
          const apiUrl = import.meta.env.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:4000';
          const res = await fetch(`${apiUrl}/sitemap.xml`);
          if (!res.ok) throw new Error('Failed to fetch backend sitemap');
          const xml = await res.text();
          
          return new Response(xml, {
            headers: { 
              "Content-Type": "application/xml", 
              "Cache-Control": "public, max-age=3600" 
            },
          });
        } catch (error) {
          console.error("Sitemap generation error:", error);
          // Fallback static sitemap if backend is down
          const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://mezclakitchen.in';
          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq></url>
</urlset>`;
          return new Response(xml, {
            headers: { "Content-Type": "application/xml" },
          });
        }
      },
    },
  },
});
