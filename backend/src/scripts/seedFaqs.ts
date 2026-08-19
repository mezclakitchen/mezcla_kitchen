/**
 * Seed FAQs Script
 * Run: npx tsx src/scripts/seedFaqs.ts
 *
 * Seeds the 12 FAQs from the public site's data/faq.ts into the Supabase
 * database with proper category mappings so they can be managed from admin panel.
 */
import 'dotenv/config';
import { adminSupabase } from '../lib/supabase.js';

const faqs = [
  // ─── General / cross-page FAQs ─────────────────────────────────
  {
    question: 'Where are you based and where do you deliver?',
    answer:
      "We're a home kitchen in Bangalore. We currently deliver across South and Central Bangalore. For other parts of the city or outstation, please WhatsApp us — we'll find a way.",
    category: 'general',
    sort_order: 1,
    is_active: true,
  },
  {
    question: 'How much notice do you need for an order?',
    answer:
      'Most products need 2–3 days\' notice. Custom cakes, snack boxes and grazing tables are best confirmed 5–7 days prior. Festive hampers and large corporate orders need 3–4 weeks.',
    category: 'general',
    sort_order: 2,
    is_active: true,
  },
  {
    question: 'Do you take custom orders?',
    answer:
      'Yes — cakes, hampers, snack boxes and grazing tables are designed around your occasion, palate and budget. WhatsApp us with a few details and we\'ll respond personally.',
    category: 'general',
    sort_order: 3,
    is_active: true,
  },
  {
    question: 'Do you have vegetarian, eggless or vegan options?',
    answer:
      'Yes. Most of our menu is vegetarian; many items are eggless and several are vegan. Each product page lists its dietary tags.',
    category: 'general',
    sort_order: 4,
    is_active: true,
  },
  {
    question: 'How do I confirm an order?',
    answer:
      'Drop us a message on WhatsApp. We\'ll share a quote and details. Orders are confirmed only after an advance payment, especially for custom and event orders.',
    category: 'general',
    sort_order: 5,
    is_active: true,
  },
  {
    question: 'What is your refund / cancellation policy?',
    answer:
      'Because everything is made fresh to order, cancellations are accepted up to 48 hours before delivery for standard items, and 7 days before for events and bulk hampers. Full policy on our Refunds page.',
    category: 'general',
    sort_order: 6,
    is_active: true,
  },
  {
    question: 'Are you FSSAI licensed?',
    answer:
      'Yes — Mezcla operates as an FSSAI licensed home kitchen. We follow strict hygiene, sourcing and packaging standards.',
    category: 'general',
    sort_order: 7,
    is_active: true,
  },

  // ─── Grazing table FAQs ─────────────────────────────────────────
  {
    question: 'What is the minimum order for grazing tables?',
    answer:
      'Grazing tables start at 15 guests. We can comfortably serve up to about 100 guests at a single table.',
    category: 'grazing',
    sort_order: 1,
    is_active: true,
  },
  {
    question: 'How are grazing tables set up at my venue?',
    answer:
      'We deliver, style and set up the table at your venue. Set-up typically takes 60–90 minutes before the event. Props (boards, stands, linen) can be arranged at cost.',
    category: 'grazing',
    sort_order: 2,
    is_active: true,
  },
  {
    question: 'Do you provide serving staff?',
    answer:
      'Not at the moment. Our grazing tables are designed as self-serve spreads. If you need staff, we\'re happy to recommend trusted partners.',
    category: 'grazing',
    sort_order: 3,
    is_active: true,
  },

  // ─── Hamper FAQs ────────────────────────────────────────────────
  {
    question: 'What is the minimum for corporate / bulk hampers?',
    answer:
      'Minimum order quantity for corporate hampers is 50. Lead time is 3–4 weeks for fully branded, considered packaging.',
    category: 'hampers',
    sort_order: 1,
    is_active: true,
  },
  {
    question: "What's the price range for hampers?",
    answer:
      'Personal hampers start at around ₹800. Festive and luxury editions go up from there. We always work backwards from your budget.',
    category: 'hampers',
    sort_order: 2,
    is_active: true,
  },
];

async function seed() {
  console.log('🌱 Seeding FAQs into Supabase...');

  for (const faq of faqs) {
    // Use upsert based on question text to avoid duplicates
    const { error } = await adminSupabase
      .from('faqs')
      .upsert(faq, { onConflict: 'question' });

    if (error) {
      // If there's no unique constraint on question, try insert
      if (error.code === '42P10' || error.message.includes('constraint')) {
        const { error: insertError } = await adminSupabase.from('faqs').insert(faq);
        if (insertError && !insertError.message.includes('duplicate')) {
          console.error(`❌ Failed to insert FAQ: "${faq.question}"`, insertError.message);
        } else {
          console.log(`✅ Inserted: "${faq.question.slice(0, 50)}..."`);
        }
      } else {
        console.error(`❌ Error for "${faq.question.slice(0, 50)}":`, error.message);
      }
    } else {
      console.log(`✅ Upserted [${faq.category}]: "${faq.question.slice(0, 50)}..."`);
    }
  }

  console.log('\n🎉 FAQ seeding complete!');
  console.log(`   Total FAQs processed: ${faqs.length}`);
  console.log(`   Categories: general (${faqs.filter(f => f.category === 'general').length}), grazing (${faqs.filter(f => f.category === 'grazing').length}), hampers (${faqs.filter(f => f.category === 'hampers').length})`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
