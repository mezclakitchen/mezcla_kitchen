import 'dotenv/config';
import { adminSupabase } from '../lib/supabase.js';

async function upsertProduct(product: any) {
  const { error } = await adminSupabase
    .from('products')
    .upsert(product, { onConflict: 'slug' });
  if (error) {
    console.error(`  ❌ Failed to upsert product ${product.slug}:`, error.message);
  } else {
    console.log(`  ✓ ${product.name}`);
  }
}

async function run() {
  console.log('\n🧹 Clearing existing products to replace with clean variants...\n');
  const { error: deleteError } = await adminSupabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Failed to clear products:', deleteError);
    return;
  }
  console.log('✅ Products cleared.');

  // Fetch categories to map IDs
  const { data: categories } = await adminSupabase.from('categories').select('*');
  const catMap = (categories || []).reduce((acc: any, c: any) => {
    acc[c.slug] = c.id;
    return acc;
  }, {});

  if (!catMap['sourdough-breads']) {
    console.error('Categories not found! Please run seedMenuContent.ts first.');
    return;
  }

  // 1. Sourdough Breads with Variants
  console.log('\n🍞 Seeding Sourdough Breads with variants...');
  const sourdoughProducts = [
    {
      name: 'Classic Sourdough',
      slug: 'classic-sourdough',
      description: 'Wholesome classic sourdough. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['sourdough', 'wednesday-bake', 'pre-order'],
      meta_title: 'Classic Sourdough — Mezcla Bangalore',
      meta_desc: 'Wholesome classic sourdough. Order by Monday for Wednesday. Mezcla Bangalore.',
      category_id: catMap['sourdough-breads'],
      variants: [
        { name: 'Maida', price: 250, price_label: '₹250' },
        { name: 'Whole Wheat', price: 250, price_label: '₹250' }
      ]
    },
    {
      name: 'Olive, Rosemary & Garlic Sourdough',
      slug: 'olive-rosemary-garlic-sourdough',
      description: 'Classic sourdough infused with briny olives, fragrant rosemary and roasted garlic. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['sourdough', 'olive', 'rosemary', 'garlic', 'wednesday-bake'],
      meta_title: 'Olive Rosemary Garlic Sourdough — Mezcla Bangalore',
      meta_desc: 'Fragrant olive, rosemary and garlic sourdough. Wednesday bake. Mezcla Bangalore.',
      category_id: catMap['sourdough-breads'],
      variants: [
        { name: 'Maida', price: 250, price_label: '₹250' },
        { name: 'Whole Wheat', price: 250, price_label: '₹250' }
      ]
    },
    {
      name: 'Cheddar & Jalapeño Sourdough',
      slug: 'cheddar-jalapeno-sourdough',
      description: 'A bold sourdough packed with sharp cheddar and fiery jalapeños. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['sourdough', 'cheddar', 'jalapeno', 'wednesday-bake'],
      meta_title: 'Cheddar Jalapeño Sourdough — Mezcla Bangalore',
      meta_desc: 'Cheesy, spicy cheddar jalapeño sourdough. Wednesday bake. Mezcla Bangalore.',
      category_id: catMap['sourdough-breads'],
      variants: [
        { name: 'Maida', price: 250, price_label: '₹250' },
        { name: 'Whole Wheat', price: 250, price_label: '₹250' }
      ]
    },
    {
      name: 'Turmeric, Walnut & Pumpkin Seeds Sourdough',
      slug: 'turmeric-walnut-pumpkin-sourdough',
      description: 'A vibrant sourdough enriched with golden turmeric, crunchy walnuts and pumpkin seeds. Available every Wednesday — order by Monday.',
      price: 275,
      price_label: '₹275',
      is_available: true,
      is_featured: false,
      sort_order: 4,
      tags: ['sourdough', 'turmeric', 'walnut', 'pumpkin-seeds', 'wednesday-bake'],
      meta_title: 'Turmeric Walnut Pumpkin Seeds Sourdough — Mezcla Bangalore',
      meta_desc: 'Golden turmeric sourdough with walnuts and pumpkin seeds. Wednesday bake. Mezcla Bangalore.',
      category_id: catMap['sourdough-breads'],
      variants: [
        { name: 'Maida', price: 275, price_label: '₹275' },
        { name: 'Whole Wheat', price: 275, price_label: '₹275' }
      ]
    }
  ];
  for (const p of sourdoughProducts) await upsertProduct(p);

  // 2. Speciality Bread
  console.log('\n🥖 Seeding Speciality Breads...');
  const specProducts = [
    {
      name: '100% Whole Wheat Sandwich Bread',
      slug: 'whole-wheat-sandwich-bread',
      description: '100% whole wheat, zero maida. Soft, fluffy and perfect for everyday sandwiches & toast. Approx 500 gms.',
      price: 140,
      price_label: '₹140',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['whole-wheat', 'sandwich-bread', 'everyday'],
      meta_title: 'Whole Wheat Sandwich Bread — Mezcla Bangalore',
      meta_desc: '100% whole wheat sandwich bread, zero maida. Soft, fluffy and fresh.',
      category_id: catMap['specialty-breads'],
      variants: []
    }
    // Just keeping it simple for the script; other products can be added via UI.
  ];
  for (const p of specProducts) await upsertProduct(p);

  // 3. Handcrafted Dips & Mezze
  console.log('\n🫙 Seeding Handcrafted Dips & Mezze with variants...');
  const dipsProducts = [
    {
      name: 'Classic Hummus',
      slug: 'classic-hummus',
      description: 'Our classic Middle Eastern dip made with chickpeas, tahini, extra virgin olive oil, fresh lemon and garlic.',
      price: 225,
      price_label: '₹225',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['hummus', 'vegan', 'gluten-free', 'middle-eastern'],
      meta_title: 'Classic Hummus — Mezcla Bangalore',
      meta_desc: 'Silky smooth classic hummus with tahini and extra virgin olive oil.',
      category_id: catMap['dips'],
      variants: [
        { name: '2 Mini Cups', price: 225, price_label: '₹225' },
        { name: '6 Mini Cups', price: 650, price_label: '₹650' }
      ]
    },
    {
      name: 'Muhammara',
      slug: 'muhammara',
      description: 'A bold Middle Eastern dip made with roasted red peppers, walnuts, extra virgin olive oil, sumac and pomegranate molasses. 150g Jar.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['muhammara', 'vegan', 'roasted-peppers'],
      meta_title: 'Muhammara (150g) — Mezcla Bangalore',
      meta_desc: 'Bold roasted red pepper and walnut muhammara dip. 150g jar.',
      category_id: catMap['dips'],
      variants: []
    }
  ];
  for (const p of dipsProducts) await upsertProduct(p);
  
  console.log('\n✅ Products have been fully cleaned and recreated with proper variants.');
}

run().catch(console.error);
