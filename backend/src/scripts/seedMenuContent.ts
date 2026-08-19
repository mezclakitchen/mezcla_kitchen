import 'dotenv/config';
import { adminSupabase } from '../lib/supabase.js';

/**
 * seedMenuContent.ts
 * ==================
 * Seeds the full updated menu content into Supabase.
 * Categories:
 *   1. Sourdough Bread     (sourdough-breads)
 *   2. Speciality Bread    (specialty-breads)
 *   3. Other Bakes & Desserts (other-bakes)
 *   4. Handcrafted Dips & Mezze (dips)
 *   5. Cakes               (cakes)
 *
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/seedMenuContent.ts
 */

async function upsertCategory(cat: {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}) {
  const { data, error } = await adminSupabase
    .from('categories')
    .upsert({ ...cat, is_active: true }, { onConflict: 'slug' })
    .select('id, slug')
    .single();
  if (error) {
    console.error(`❌ Failed to upsert category ${cat.slug}:`, error.message);
    return null;
  }
  console.log(`✓ Category: ${cat.name}`);
  return data as { id: string; slug: string };
}

async function upsertProduct(product: {
  name: string;
  slug: string;
  description: string;
  price: number | null;
  price_label: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  tags: string[];
  meta_title: string;
  meta_desc: string;
  category_id: string;
}) {
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
  console.log('\n🌱 Seeding updated menu content...\n');

  // ─── 1. Categories ──────────────────────────────────────────────
  console.log('📂 Upserting categories...');

  const sourdoughCat = await upsertCategory({
    name: 'Sourdough Bread',
    slug: 'sourdough-breads',
    description:
      'Long-fermented sourdough loaves available every Wednesday. Orders to be placed by Monday. Choose from Maida or Whole Wheat.',
    sort_order: 1,
  });

  const specialtyCat = await upsertCategory({
    name: 'Speciality Bread',
    slug: 'specialty-breads',
    description:
      'Soft sandwich loaves, focaccia, pita, kulcha, baguette, ciabatta and more — freshly baked to order.',
    sort_order: 2,
  });

  const bakesCat = await upsertCategory({
    name: 'Other Bakes & Desserts',
    slug: 'other-bakes',
    description:
      'Korean cream cheese buns, Berliners, quiches, cinnamon rolls, blueberry rolls, brownies, cupcakes and more.',
    sort_order: 3,
  });

  const dipsCat = await upsertCategory({
    name: 'Handcrafted Dips & Mezze',
    slug: 'dips',
    description:
      'Freshly prepared in small batches using only Extra Virgin Olive Oil. Perfect for grazing boards, sandwiches, pastas or with warm bread.',
    sort_order: 4,
  });

  const cakesCat = await upsertCategory({
    name: 'Cakes',
    slug: 'cakes',
    description:
      'Handcrafted eggless celebration cakes using premium ingredients. Custom flavours, natural colours — no artificial additives.',
    sort_order: 5,
  });

  // Also keep the old breads slug active (for backward compat from existing pages)
  await upsertCategory({
    name: 'Breads',
    slug: 'breads',
    description: 'All our artisan breads — sourdough and speciality.',
    sort_order: 6,
  });

  if (!sourdoughCat || !specialtyCat || !bakesCat || !dipsCat || !cakesCat) {
    console.error('\n❌ Could not get all category IDs. Aborting product seed.');
    process.exit(1);
  }

  // ─── 2. Sourdough Breads ────────────────────────────────────────
  console.log('\n🍞 Seeding Sourdough Breads...');

  const sourdoughProducts = [
    {
      name: 'Classic Sourdough (Maida)',
      slug: 'classic-sourdough-maida',
      description:
        'Our signature classic sourdough made with Maida flour. Long-fermented for a beautifully open crumb and deeply flavoured crust. Available every Wednesday — order by Monday.',
      price: 200,
      price_label: '₹200',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['sourdough', 'maida', 'wednesday-bake', 'pre-order'],
      meta_title: 'Classic Sourdough (Maida) — Mezcla Artisan Bakery Bangalore',
      meta_desc:
        'Long-fermented classic sourdough made with Maida. Order by Monday for Wednesday pick-up. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Classic Sourdough (Whole Wheat)',
      slug: 'classic-sourdough-whole-wheat',
      description:
        'Our classic sourdough crafted with 100% whole wheat flour. Nutty, wholesome and naturally leavened. Available every Wednesday — order by Monday.',
      price: 200,
      price_label: '₹200',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['sourdough', 'whole-wheat', 'wednesday-bake', 'pre-order'],
      meta_title: 'Classic Sourdough (Whole Wheat) — Mezcla Bangalore',
      meta_desc:
        'Wholesome classic sourdough in 100% whole wheat. Order by Monday for Wednesday. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Olive, Rosemary & Garlic Sourdough (Maida)',
      slug: 'olive-rosemary-garlic-sourdough-maida',
      description:
        'Classic sourdough infused with briny olives, fragrant rosemary and roasted garlic. Made with Maida flour. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['sourdough', 'maida', 'olive', 'rosemary', 'garlic', 'wednesday-bake'],
      meta_title: 'Olive Rosemary Garlic Sourdough (Maida) — Mezcla Bangalore',
      meta_desc:
        'Fragrant olive, rosemary and garlic sourdough on Maida. Wednesday bake. Order by Monday from Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Olive, Rosemary & Garlic Sourdough (Whole Wheat)',
      slug: 'olive-rosemary-garlic-sourdough-whole-wheat',
      description:
        'Classic sourdough infused with briny olives, fragrant rosemary and roasted garlic. Made with whole wheat flour. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: false,
      sort_order: 4,
      tags: ['sourdough', 'whole-wheat', 'olive', 'rosemary', 'garlic', 'wednesday-bake'],
      meta_title: 'Olive Rosemary Garlic Sourdough (Whole Wheat) — Mezcla Bangalore',
      meta_desc:
        'Fragrant olive, rosemary and garlic sourdough on whole wheat. Wednesday bake. Order by Monday from Mezcla.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Cheddar & Jalapeño Sourdough (Maida)',
      slug: 'cheddar-jalapeno-sourdough-maida',
      description:
        'A bold sourdough packed with sharp cheddar and fiery jalapeños, made with Maida flour. The perfect cheesy, spicy loaf. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 5,
      tags: ['sourdough', 'maida', 'cheddar', 'jalapeno', 'wednesday-bake'],
      meta_title: 'Cheddar Jalapeño Sourdough (Maida) — Mezcla Bangalore',
      meta_desc:
        'Cheesy, spicy cheddar jalapeño sourdough on Maida. Wednesday bake. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Cheddar & Jalapeño Sourdough (Whole Wheat)',
      slug: 'cheddar-jalapeno-sourdough-whole-wheat',
      description:
        'A bold sourdough packed with sharp cheddar and fiery jalapeños, made with whole wheat flour. Available every Wednesday — order by Monday.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: false,
      sort_order: 6,
      tags: ['sourdough', 'whole-wheat', 'cheddar', 'jalapeno', 'wednesday-bake'],
      meta_title: 'Cheddar Jalapeño Sourdough (Whole Wheat) — Mezcla Bangalore',
      meta_desc:
        'Cheesy, spicy cheddar jalapeño sourdough on whole wheat. Wednesday bake. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Turmeric, Walnut & Pumpkin Seeds Sourdough (Maida)',
      slug: 'turmeric-walnut-pumpkin-sourdough-maida',
      description:
        'A vibrant sourdough enriched with golden turmeric, crunchy walnuts and pumpkin seeds. Made with Maida flour. Available every Wednesday — order by Monday.',
      price: 275,
      price_label: '₹275',
      is_available: true,
      is_featured: false,
      sort_order: 7,
      tags: ['sourdough', 'maida', 'turmeric', 'walnut', 'pumpkin-seeds', 'wednesday-bake'],
      meta_title: 'Turmeric Walnut Pumpkin Seeds Sourdough (Maida) — Mezcla Bangalore',
      meta_desc:
        'Golden turmeric sourdough with walnuts and pumpkin seeds. Wednesday bake on Maida. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
    {
      name: 'Turmeric, Walnut & Pumpkin Seeds Sourdough (Whole Wheat)',
      slug: 'turmeric-walnut-pumpkin-sourdough-whole-wheat',
      description:
        'A vibrant sourdough enriched with golden turmeric, crunchy walnuts and pumpkin seeds. Made with whole wheat flour. Available every Wednesday — order by Monday.',
      price: 275,
      price_label: '₹275',
      is_available: true,
      is_featured: false,
      sort_order: 8,
      tags: ['sourdough', 'whole-wheat', 'turmeric', 'walnut', 'pumpkin-seeds', 'wednesday-bake'],
      meta_title: 'Turmeric Walnut Pumpkin Seeds Sourdough (Whole Wheat) — Mezcla Bangalore',
      meta_desc:
        'Golden turmeric sourdough with walnuts and pumpkin seeds. Wednesday bake on whole wheat. Mezcla Bangalore.',
      category_id: sourdoughCat.id,
    },
  ];

  for (const p of sourdoughProducts) await upsertProduct(p);

  // ─── 3. Speciality Breads ───────────────────────────────────────
  console.log('\n🥖 Seeding Speciality Breads...');

  const specialtyProducts = [
    {
      name: '100% Whole Wheat Sandwich Bread',
      slug: 'whole-wheat-sandwich-bread',
      description:
        '100% whole wheat, zero maida. Soft, fluffy and perfect for everyday sandwiches & toast. Approx 500 gms.',
      price: 140,
      price_label: '₹140',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['whole-wheat', 'sandwich-bread', 'everyday'],
      meta_title: 'Whole Wheat Sandwich Bread — Mezcla Bangalore',
      meta_desc:
        '100% whole wheat sandwich bread, zero maida. Soft, fluffy and fresh. Order from Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Japanese Milk Bread',
      slug: 'japanese-milk-bread',
      description:
        'Made using the traditional tangzhong method for an incredibly soft, cloud-like texture that stays fresh for longer. Perfect for toast, sandwiches and comforting everyday meals. Approx 530 gms.',
      price: 140,
      price_label: '₹140',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['milk-bread', 'tangzhong', 'japanese', 'soft'],
      meta_title: 'Japanese Milk Bread — Mezcla Bangalore',
      meta_desc:
        'Soft, cloud-like Japanese milk bread made with the tangzhong method. Fresh from Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Mumbai Style Ladi Pav (6 pcs)',
      slug: 'ladi-pav-6pcs',
      description:
        'Classic Mumbai-style ladi pav made fresh in our kitchen. Soft, fluffy and lightly sweet — perfect with bhaji, vada pav, misal, keema-style fillings, or simply with butter and chai.',
      price: 100,
      price_label: '₹100',
      is_available: true,
      is_featured: false,
      sort_order: 3,
      tags: ['ladi-pav', 'mumbai', 'pav', 'indian'],
      meta_title: 'Mumbai Style Ladi Pav — Mezcla Bangalore',
      meta_desc:
        'Freshly baked soft Mumbai ladi pav. Perfect with bhaji, vada pav and more. Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Italian Focaccia',
      slug: 'italian-focaccia',
      description:
        'A classic Italian flatbread with a crisp, golden crust and a soft, airy interior. Finished with extra virgin olive oil and herbs — perfect for tearing and sharing, building sandwiches, or enjoying alongside soups and pasta. Approx 350 gms.',
      price: 250,
      price_label: '₹250',
      is_available: true,
      is_featured: true,
      sort_order: 4,
      tags: ['focaccia', 'italian', 'olive-oil', 'herbs'],
      meta_title: 'Italian Focaccia — Mezcla Artisan Breads Bangalore',
      meta_desc:
        'Classic Italian focaccia with crisp crust and soft airy interior. Fresh from Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Pita Bread (6 pcs)',
      slug: 'pita-bread-6pcs',
      description:
        'Freshly rolled and oven-baked until soft, fluffy and lightly chewy. Perfect for scooping up hummus, stuffing with your favourite fillings, or enjoying warm straight from the oven.',
      price: 130,
      price_label: '₹130',
      is_available: true,
      is_featured: false,
      sort_order: 5,
      tags: ['pita', 'middle-eastern', 'flatbread'],
      meta_title: 'Pita Bread — Mezcla Bangalore',
      meta_desc:
        'Freshly baked soft pita bread. Perfect with hummus and dips. Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Delhi Style Bread Kulcha (6 pcs)',
      slug: 'bread-kulcha-6pcs',
      description:
        'Hand-rolled and freshly baked until irresistibly soft, fluffy and pillowy. Classic Delhi-style kulchas perfect for scooping up chole, rich curries or enjoyed warm with a generous dollop of butter.',
      price: 140,
      price_label: '₹140',
      is_available: true,
      is_featured: false,
      sort_order: 6,
      tags: ['kulcha', 'delhi', 'indian', 'flatbread'],
      meta_title: 'Delhi Style Bread Kulcha — Mezcla Bangalore',
      meta_desc:
        'Soft, fluffy Delhi-style bread kulcha. Perfect with chole and curries. Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Classic French Baguette',
      slug: 'french-baguette',
      description:
        'A timeless French classic with a beautifully crisp, golden crust and a light, airy crumb. Perfect for sandwiches, cheese boards, dipping into soups, or simply enjoyed warm with butter. Makes great bruschetta and garlic cheese breads.',
      price: 150,
      price_label: '₹150',
      is_available: true,
      is_featured: false,
      sort_order: 7,
      tags: ['baguette', 'french', 'crisp-crust'],
      meta_title: 'Classic French Baguette — Mezcla Bangalore',
      meta_desc:
        'Timeless crisp French baguette. Perfect for sandwiches and cheese boards. Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Ciabatta (2 pcs)',
      slug: 'ciabatta-2pcs',
      description:
        'A rustic Italian bread with a crisp golden crust and a light, airy interior. Made for hearty sandwiches, grazing boards or simply enjoyed warm with olive oil and butter.',
      price: 100,
      price_label: '₹100',
      is_available: true,
      is_featured: false,
      sort_order: 8,
      tags: ['ciabatta', 'italian', 'rustic'],
      meta_title: 'Ciabatta — Mezcla Bangalore',
      meta_desc:
        'Rustic Italian ciabatta with crisp crust. Perfect for sandwiches and grazing boards. Mezcla.',
      category_id: specialtyCat.id,
    },
    {
      name: 'Pesto Babka',
      slug: 'pesto-babka',
      description:
        'Soft, fluffy and beautifully layered with fragrant basil pesto and generous shavings of Parmesan. Savoury, aromatic and indulgent — perfect for everyday sandwiches, toast, or simply enjoyed warm on its own.',
      price: 350,
      price_label: '₹350',
      is_available: true,
      is_featured: true,
      sort_order: 9,
      tags: ['babka', 'pesto', 'parmesan', 'savory'],
      meta_title: 'Pesto Babka — Mezcla Bangalore',
      meta_desc:
        'Soft, layered pesto babka with basil pesto and Parmesan. A savoury indulgence from Mezcla Bangalore.',
      category_id: specialtyCat.id,
    },
  ];

  for (const p of specialtyProducts) await upsertProduct(p);

  // ─── 4. Other Bakes & Desserts ──────────────────────────────────
  console.log('\n🥐 Seeding Other Bakes & Desserts...');

  const bakesProducts = [
    {
      name: 'Korean Cream Cheese Buns (2 pcs)',
      slug: 'korean-cream-cheese-buns-2pcs',
      description:
        'Freshly baked soft buns generously filled with a luscious cream cheese filling and finished with herbed butter. Soft, creamy, buttery and utterly addictive — a Mezcla favourite and crowd pleaser since 2022.',
      price: 360,
      price_label: '₹360',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['korean', 'cream-cheese', 'buns', 'bestseller'],
      meta_title: 'Korean Cream Cheese Buns — Mezcla Bangalore',
      meta_desc:
        'Freshly baked Korean cream cheese buns. A Mezcla bestseller since 2022. Order from Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Mini Korean Cream Cheese Buns (6 pcs)',
      slug: 'mini-korean-cream-cheese-buns-6pcs',
      description:
        'Our much-loved Korean Cream Cheese Buns in a bite-sized version — fluffy buns filled with creamy cheese filling and finished with herbed butter. Perfect for sharing, parties and indulgent snacking.',
      price: 660,
      price_label: '₹660',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['korean', 'cream-cheese', 'mini', 'party', 'snacking'],
      meta_title: 'Mini Korean Cream Cheese Buns (6 pcs) — Mezcla Bangalore',
      meta_desc:
        'Bite-sized Korean cream cheese buns. Perfect for sharing and parties. Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Cheese Fondue Berliner (2 pcs)',
      slug: 'cheese-fondue-berliner-2pcs',
      description:
        'A soft savoury doughnut filled with creamy cheese fondue and jalapeños, topped with crispy fried onions for the perfect cheesy, spicy bite.',
      price: 280,
      price_label: '₹280',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['berliner', 'cheese', 'jalapeno', 'savory', 'doughnut'],
      meta_title: 'Cheese Fondue Berliner — Mezcla Bangalore',
      meta_desc:
        'Savoury doughnut filled with cheese fondue and jalapeños. A Mezcla specialty. Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Duo of Mushroom Quiche (2 pcs)',
      slug: 'mushroom-quiche-2pcs',
      description:
        'A buttery shortcrust pastry filled with a rich mushroom and leek filling featuring shiitake and button mushrooms. A classic savoury bake with layers of flavour.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: false,
      sort_order: 4,
      tags: ['quiche', 'mushroom', 'leek', 'savoury', 'pastry'],
      meta_title: 'Mushroom Quiche — Mezcla Bangalore',
      meta_desc:
        'Buttery shortcrust quiche with shiitake and button mushrooms. Order from Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Classic Chocolate Donuts (4 pcs)',
      slug: 'chocolate-donuts-4pcs',
      description:
        'Soft, fluffy donuts coated generously with chocolate — a nostalgic favourite made the Mezcla way.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: false,
      sort_order: 5,
      tags: ['donuts', 'chocolate', 'sweet'],
      meta_title: 'Classic Chocolate Donuts — Mezcla Bangalore',
      meta_desc:
        'Soft, fluffy chocolate donuts. A nostalgic Mezcla favourite. Order from Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Cherry Tomato & Basil Quiche (2 pcs)',
      slug: 'cherry-tomato-basil-quiche-2pcs',
      description:
        'Buttery shortcrust pastry filled with juicy cherry tomatoes and our homemade basil pesto. A delightful savoury bake bursting with fresh flavours.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: false,
      sort_order: 6,
      tags: ['quiche', 'cherry-tomato', 'basil', 'pesto', 'savoury'],
      meta_title: 'Cherry Tomato & Basil Quiche — Mezcla Bangalore',
      meta_desc:
        'Buttery shortcrust quiche with cherry tomatoes and basil pesto. Fresh from Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Caramelised Onion Quiche (2 pcs)',
      slug: 'caramelised-onion-quiche-2pcs',
      description:
        'Buttery shortcrust pastry filled with slow-cooked caramelised onions, creating a rich, sweet and savoury flavour profile.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: false,
      sort_order: 7,
      tags: ['quiche', 'caramelised-onion', 'savoury', 'pastry'],
      meta_title: 'Caramelised Onion Quiche — Mezcla Bangalore',
      meta_desc:
        'Rich caramelised onion quiche in buttery shortcrust pastry. Order from Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Chocolate & Orange Berliners (2 pcs)',
      slug: 'chocolate-orange-berliners-2pcs',
      description:
        'Soft and fluffy Berliners filled with silky 46% couverture chocolate ganache and homemade orange marmalade — a beautiful balance of rich chocolate and bright citrus notes.',
      price: 370,
      price_label: '₹370',
      is_available: true,
      is_featured: true,
      sort_order: 8,
      tags: ['berliner', 'chocolate', 'orange', 'ganache', 'marmalade'],
      meta_title: 'Chocolate & Orange Berliners — Mezcla Bangalore',
      meta_desc:
        'Soft Berliners with couverture chocolate ganache and orange marmalade. Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Cinnamon Rolls (6 pcs)',
      slug: 'cinnamon-rolls-6pcs',
      description:
        'Soft, fluffy rolls layered with aromatic cinnamon, brown sugar and juicy raisins. Baked to perfection and finished with a delicate milk glaze for a comforting, melt-in-your-mouth treat.',
      price: 650,
      price_label: '₹650',
      is_available: true,
      is_featured: true,
      sort_order: 9,
      tags: ['cinnamon-rolls', 'sweet', 'glazed', 'raisins'],
      meta_title: 'Cinnamon Rolls — Mezcla Bangalore',
      meta_desc:
        'Soft, fluffy cinnamon rolls with brown sugar and milk glaze. A Mezcla favourite. Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Blueberry Rolls (6 pcs)',
      slug: 'blueberry-rolls-6pcs',
      description:
        'Soft, fluffy rolls layered with our homemade blueberry compote, bursting with deep, rich berry flavours. Finished with a delicate milk glaze for a beautiful balance of sweetness and creaminess.',
      price: 750,
      price_label: '₹750',
      is_available: true,
      is_featured: false,
      sort_order: 10,
      tags: ['blueberry-rolls', 'sweet', 'glazed', 'berry'],
      meta_title: 'Blueberry Rolls — Mezcla Bangalore',
      meta_desc:
        'Soft blueberry rolls with homemade compote and milk glaze. Fresh from Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    // Desserts under Other Bakes
    {
      name: 'Mango Jar Cake (~300 gms)',
      slug: 'mango-jar-cake',
      description:
        'A melt-in-your-mouth mango delight layered with vanilla bean sponge, luscious couverture white chocolate ganache and fresh Alphonso mango compote. Finished with juicy fresh mango pieces. Seasonal — available for a limited time.',
      price: 385,
      price_label: '₹385',
      is_available: true,
      is_featured: true,
      sort_order: 11,
      tags: ['jar-cake', 'mango', 'alphonso', 'seasonal', 'white-chocolate'],
      meta_title: 'Mango Jar Cake — Mezcla Bangalore (Seasonal)',
      meta_desc:
        'Seasonal Alphonso mango jar cake with white chocolate ganache. Available for a limited time. Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Brownie Slab (~200 gms)',
      slug: 'brownie-slab',
      description:
        'A rich, fudgy, indulgent brownie made with premium chocolate and finished with a silky 46% dark couverture chocolate ganache and fresh berries. A decadent treat for every chocolate lover.',
      price: 325,
      price_label: '₹325',
      is_available: true,
      is_featured: true,
      sort_order: 12,
      tags: ['brownie', 'chocolate', 'fudgy', 'ganache', 'berries'],
      meta_title: 'Brownie Slab — Mezcla Bangalore',
      meta_desc:
        'Rich, fudgy brownie with 46% dark couverture ganache and fresh berries. Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
    {
      name: 'Lemon & Blueberry Cupcakes (6 pcs)',
      slug: 'lemon-blueberry-cupcakes-6pcs',
      description:
        'Moist vanilla cupcakes bursting with blueberries, topped with a luscious lemon cream cheese frosting and finished with fresh blueberries. A refreshing balance of citrus, berry and creamy sweetness.',
      price: 660,
      price_label: '₹660',
      is_available: true,
      is_featured: false,
      sort_order: 13,
      tags: ['cupcakes', 'blueberry', 'lemon', 'cream-cheese', 'frosting'],
      meta_title: 'Lemon & Blueberry Cupcakes — Mezcla Bangalore',
      meta_desc:
        'Moist vanilla cupcakes with lemon cream cheese frosting and fresh blueberries. Mezcla Bangalore.',
      category_id: bakesCat.id,
    },
  ];

  for (const p of bakesProducts) await upsertProduct(p);

  // ─── 5. Handcrafted Dips & Mezze ────────────────────────────────
  console.log('\n🫙 Seeding Handcrafted Dips & Mezze...');

  const dipsProducts = [
    {
      name: 'Classic Hummus',
      slug: 'classic-hummus',
      description:
        'Our classic Middle Eastern dip made with chickpeas, tahini, extra virgin olive oil, fresh lemon and garlic. Silky smooth, wholesome and full of flavour — perfect with warm pita, sourdough or fresh vegetables. 150g Jar.',
      price: 225,
      price_label: '₹225',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['hummus', 'vegan', 'gluten-free', 'middle-eastern', 'chickpeas'],
      meta_title: 'Classic Hummus (150g) — Mezcla Bangalore',
      meta_desc:
        'Silky smooth classic hummus with tahini and extra virgin olive oil. 150g jar. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
    {
      name: 'Muhammara',
      slug: 'muhammara',
      description:
        'A bold Middle Eastern dip made with roasted red peppers, walnuts, extra virgin olive oil, sumac and pomegranate molasses. Smoky, sweet, tangy and gently spiced — delicious with bread, grilled vegetables or as part of a mezze spread. 150g Jar.',
      price: 300,
      price_label: '₹300',
      is_available: true,
      is_featured: true,
      sort_order: 2,
      tags: ['muhammara', 'vegan', 'roasted-peppers', 'walnut', 'pomegranate'],
      meta_title: 'Muhammara (150g) — Mezcla Bangalore',
      meta_desc:
        'Bold roasted red pepper and walnut muhammara dip. 150g jar. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
    {
      name: 'Italian Basil Pesto',
      slug: 'italian-basil-pesto',
      description:
        'Fresh Italian basil blended with extra virgin olive oil, Parmesan, roasted cashews and garlic. Rich, vibrant and bursting with flavour — perfect tossed through pasta, spread on sandwiches or served alongside fresh bread. 150g Jar.',
      price: 350,
      price_label: '₹350',
      is_available: true,
      is_featured: true,
      sort_order: 3,
      tags: ['pesto', 'basil', 'parmesan', 'italian', 'cashews'],
      meta_title: 'Italian Basil Pesto (150g) — Mezcla Bangalore',
      meta_desc:
        'Fresh Italian basil pesto with Parmesan and roasted cashews. 150g jar. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
    {
      name: 'Tzatziki',
      slug: 'tzatziki',
      description:
        'A refreshing Greek yogurt dip made with hung curd, cucumber, fresh dill, garlic and extra virgin olive oil. Creamy, light and the perfect accompaniment to pita, grilled vegetables and Mediterranean meals. 150g Jar.',
      price: 200,
      price_label: '₹200',
      is_available: true,
      is_featured: false,
      sort_order: 4,
      tags: ['tzatziki', 'greek', 'yogurt', 'cucumber', 'dill'],
      meta_title: 'Tzatziki (150g) — Mezcla Bangalore',
      meta_desc:
        'Creamy Greek tzatziki with hung curd, cucumber and dill. 150g jar. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
    {
      name: 'Labneh',
      slug: 'labneh',
      description:
        'A creamy Middle Eastern strained yoghurt finished with extra virgin olive oil. Tangy, rich and delicious served with warm bread, roasted vegetables or as part of a mezze platter. 150g Jar.',
      price: 230,
      price_label: '₹230',
      is_available: true,
      is_featured: false,
      sort_order: 5,
      tags: ['labneh', 'middle-eastern', 'yogurt', 'strained'],
      meta_title: 'Labneh (150g) — Mezcla Bangalore',
      meta_desc:
        'Creamy Middle Eastern strained yoghurt labneh with olive oil. 150g jar. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
    {
      name: 'Onion Balsamic Jam',
      slug: 'onion-balsamic-jam',
      description:
        'Slow-cooked onions caramelised to perfection with balsamic vinegar and aromatic herbs. Sweet, savoury and deeply flavourful — perfect with cheeses, sandwiches, burgers or on a grazing board or cheese board. 150g Jar.',
      price: 175,
      price_label: '₹175',
      is_available: true,
      is_featured: false,
      sort_order: 6,
      tags: ['onion-jam', 'balsamic', 'caramelised', 'sweet-savoury'],
      meta_title: 'Onion Balsamic Jam (150g) — Mezcla Bangalore',
      meta_desc:
        'Sweet and savoury caramelised onion balsamic jam. 150g jar. Perfect for cheese boards. Mezcla Bangalore.',
      category_id: dipsCat.id,
    },
  ];

  for (const p of dipsProducts) await upsertProduct(p);

  // ─── 6. Cakes ────────────────────────────────────────────────────
  console.log('\n🎂 Seeding Cakes...');

  const cakesProducts = [
    {
      name: 'Custom Celebration Cake',
      slug: 'custom-celebration-cake',
      description:
        'Looking for something special? From elegant minimal cakes to fully customised celebration cakes, we create handcrafted eggless cakes using premium ingredients. Made with real ingredients and natural flavours — no artificial colours or flavouring. Homemade fruit compotes, couverture chocolate and fresh seasonal produce. Share your vision with us and we\'ll bring it to life. Flavour comes first, always.',
      price: null,
      price_label: 'Price on request',
      is_available: true,
      is_featured: true,
      sort_order: 1,
      tags: ['celebration-cake', 'custom', 'eggless', 'couverture-chocolate'],
      meta_title: 'Custom Celebration Cakes — Mezcla Bangalore',
      meta_desc:
        'Handcrafted eggless celebration cakes with premium ingredients and natural flavours. Custom orders. Mezcla Bangalore.',
      category_id: cakesCat.id,
    },
  ];

  for (const p of cakesProducts) await upsertProduct(p);

  console.log('\n✅ Menu content seeded successfully!\n');
  console.log('Categories seeded:');
  console.log('  • Sourdough Bread        (sourdough-breads)  — 8 products');
  console.log('  • Speciality Bread       (specialty-breads)  — 9 products');
  console.log('  • Other Bakes & Desserts (other-bakes)       — 13 products');
  console.log('  • Handcrafted Dips & Mezze (dips)            — 6 products');
  console.log('  • Cakes                  (cakes)             — 1 placeholder');
}

run().catch(console.error);
