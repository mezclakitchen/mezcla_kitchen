import 'dotenv/config';
import { adminSupabase } from './lib/supabase.js';

async function run() {
  console.log('Seeding products...');
  
  // Clean up old products first (optional, maybe better to just let it upsert if they conflict)
  // Let's just upsert all the new genuine ones.
  
  const products = [
    {
      name: 'Sourdough Multigrain Boule',
      slug: 'sourdough-multigrain-boule',
      description: 'Our signature 72-hour cold-fermented multigrain sourdough with sunflower seeds, oats and sesame. Crisp crust, open crumb.',
      price: 480.00,
      price_label: '₹480',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['vegan', 'sourdough', 'multigrain'],
      meta_title: 'Sourdough Multigrain Boule — Mezcla Artisan Bakery Bangalore',
      meta_desc: 'Handcrafted 72-hour cold-fermented multigrain sourdough boule baked fresh in small batches. Order online in Bangalore.',
      cat_slug: 'breads'
    },
    {
      name: 'Rosemary Focaccia',
      slug: 'rosemary-focaccia',
      description: 'Light and airy focaccia generously drizzled with extra-virgin olive oil and fresh rosemary. Vegan-friendly.',
      price: 360.00,
      price_label: '₹360',
      is_available: true,
      is_featured: false,
      sort_order: 2,
      tags: ['vegan', 'focaccia'],
      meta_title: 'Rosemary Focaccia — Mezcla Artisan Breads',
      meta_desc: 'Fluffy rosemary focaccia baked fresh. Order in Bangalore from Mezcla.',
      cat_slug: 'breads'
    },
    {
      name: 'Korean Cream Cheese Buns',
      slug: 'korean-buns',
      description: 'Soft and pillowy Korean-style buns, drenched in garlic butter and stuffed with sweetened cream cheese.',
      price: 350.00,
      price_label: '₹350',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['buns', 'cream-cheese', 'garlic'],
      meta_title: 'Korean Cream Cheese Buns — Mezcla',
      meta_desc: 'Indulgent Korean cream cheese buns baked fresh in Bangalore.',
      cat_slug: 'breads'
    },
    {
      name: 'Artisan Cheese Berliner',
      slug: 'cheese-berliner',
      description: 'A savoury twist on the classic berliner, filled with rich artisan cheese.',
      price: 280.00,
      price_label: '₹280',
      is_available: true,
      is_featured: false,
      sort_order: 4,
      tags: ['berliner', 'cheese'],
      meta_title: 'Artisan Cheese Berliner — Mezcla',
      meta_desc: 'Freshly baked cheese berlinres in Bangalore.',
      cat_slug: 'breads'
    },
    {
      name: 'Chocolate Berliner',
      slug: 'chocolate-berliner',
      description: 'Decadent chocolate-filled berliner doughnuts, dusted with fine sugar.',
      price: 290.00,
      price_label: '₹290',
      is_available: true,
      is_featured: true,
      sort_order: 5,
      tags: ['berliner', 'chocolate', 'sweet'],
      meta_title: 'Chocolate Berliner — Mezcla',
      meta_desc: 'Rich chocolate berlinres made fresh to order.',
      cat_slug: 'breads'
    },
    {
      name: 'Seasonal Mango Berliner',
      slug: 'mango-berliner',
      description: 'A summer special — soft berliner filled with fresh, tangy mango cream.',
      price: 320.00,
      price_label: '₹320',
      is_available: true,
      is_featured: false,
      sort_order: 6,
      tags: ['berliner', 'mango', 'seasonal'],
      meta_title: 'Seasonal Mango Berliner — Mezcla',
      meta_desc: 'Fresh mango berlinres available for a limited time.',
      cat_slug: 'breads'
    },
    {
      name: 'Farmhouse Quiche',
      slug: 'farmhouse-quiche',
      description: 'Classic savoury tart with a buttery, flaky crust and a rich, creamy filling.',
      price: 850.00,
      price_label: '₹850',
      is_available: true,
      is_featured: false,
      sort_order: 7,
      tags: ['quiche', 'savoury'],
      meta_title: 'Farmhouse Quiche — Mezcla',
      meta_desc: 'Freshly baked savoury quiche in Bangalore.',
      cat_slug: 'breads'
    },
    {
      name: 'Classic Hummus',
      slug: 'classic-hummus',
      description: 'Silky smooth hummus made from slow-cooked chickpeas, tahini, lemon and garlic. Served with olive oil and paprika.',
      price: 380.00,
      price_label: '₹380',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['vegan', 'gluten-free', 'hummus'],
      meta_title: 'Classic Hummus — Mezcla Artisan Kitchen',
      meta_desc: 'Smooth artisan hummus made fresh in Bangalore. Order now from Mezcla.',
      cat_slug: 'dips'
    },
    {
      name: 'Basil Pesto',
      slug: 'basil-pesto',
      description: 'Fresh Genovese basil, pine nuts, parmesan and extra-virgin olive oil blended to perfection.',
      price: 460.00,
      price_label: '₹460',
      is_available: true,
      is_featured: false,
      sort_order: 2,
      tags: ['vegetarian', 'pesto'],
      meta_title: 'Basil Pesto — Mezcla Artisan Spreads',
      meta_desc: 'Freshly made basil pesto, perfect with bread and pasta. Order in Bangalore.',
      cat_slug: 'dips'
    },
    {
      name: 'Roasted Muhammara',
      slug: 'roasted-muhammara',
      description: 'A rich, smoky Levantine dip made of roasted red peppers, walnuts, and pomegranate molasses.',
      price: 450.00,
      price_label: '₹450',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['vegan', 'muhammara', 'spicy'],
      meta_title: 'Roasted Muhammara — Mezcla',
      meta_desc: 'Authentic muhammara dip available for delivery in Bangalore.',
      cat_slug: 'dips'
    },
    {
      name: 'Artisan Biscuits',
      slug: 'artisan-biscuits',
      description: 'Crisp, buttery artisan biscuits, perfect for your evening tea or coffee.',
      price: 450.00,
      price_label: '₹450',
      is_available: true,
      is_featured: false,
      sort_order: 1,
      tags: ['biscuits', 'sweet', 'tea-time'],
      meta_title: 'Artisan Biscuits — Mezcla',
      meta_desc: 'Handcrafted artisan biscuits.',
      cat_slug: 'snack-boxes'
    },
    {
      name: 'Fresh Mango Jar Cake',
      slug: 'mango-jar-cake',
      description: 'Layers of soft sponge, fresh mango compote, and light cream, served in a convenient glass jar.',
      price: 420.00,
      price_label: '₹420',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['cake', 'mango', 'sweet'],
      meta_title: 'Mango Jar Cake — Mezcla',
      meta_desc: 'Fresh mango jar cakes.',
      cat_slug: 'snack-boxes'
    }
  ];

  for (const p of products) {
    const catSlug = p.cat_slug;
    delete (p as any).cat_slug;
    
    // get category_id
    const { data: category } = await adminSupabase
      .from('categories')
      .select('id')
      .eq('slug', catSlug)
      .single();

    if (category) {
      await adminSupabase.from('products').upsert({
        ...p,
        category_id: category.id
      }, { onConflict: 'slug' });
    }
  }

  // Hide the old fake products
  const fakeSlugs = ['classic-white-sourdough', 'seeded-rye-loaf', 'jalapeno-cheddar-pull-apart', 'beetroot-hummus', 'sundried-tomato-spread', 'classic-snack-box', 'office-party-box', 'kids-snack-box'];
  
  for (const slug of fakeSlugs) {
    await adminSupabase.from('products').update({ is_available: false, is_featured: false }).eq('slug', slug);
  }

  console.log('Successfully seeded genuine products!');
}

run().catch(console.error);
