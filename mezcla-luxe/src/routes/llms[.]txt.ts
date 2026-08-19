import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://mezclakitchen.in';
        
        const llmsTxt = `# Mezcla — The Artisanal Kitchen
> A premium home kitchen in Bangalore specializing in sourdough breads, fresh mezze, snack boxes, gourmet hampers, and grazing tables. Handmade in small batches with honest ingredients.

## Main sections
- \`Menu & Products -> ${SITE_URL}/products\`: Browse our full selection of sourdough, specialty breads, cakes, and dips.
- \`Grazing Tables -> ${SITE_URL}/grazing-tables\`: Curated cheese and charcuterie boards for events and parties in Bangalore.
- \`Gourmet Hampers -> ${SITE_URL}/food-hampers\`: Handcrafted gift boxes and festive hampers for corporate and personal gifting.
- \`Sourdough Breads -> ${SITE_URL}/sourdough-breads\`: Classic, olive & rosemary, and jalapeño cheddar sourdough baked fresh every Wednesday.
- \`About Us -> ${SITE_URL}/about\`: Our story and commitment to honest, artisanal ingredients.
- \`Contact -> ${SITE_URL}/contact\`: Get in touch for custom orders, catering, and event planning.

## Key facts
- Location: 153A, 10th Main Rd, Vikram Nagar, Kumaraswamy Layout, Bengaluru, Karnataka 560078.
- Service Area: Delivery available across Bangalore including Koramangala, Indiranagar, HSR Layout, and Whitefield.
- Specialty: 100% whole wheat sourdough breads, zero maida options, and traditional tangzhong Japanese Milk Bread.
- Ordering: Orders are pre-booked. Sourdough orders must be placed by Monday for Wednesday baking.
- Contact: Phone: +91-98922-90606 | Email: hello@mezclakitchen.in
`;
        return new Response(llmsTxt, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
