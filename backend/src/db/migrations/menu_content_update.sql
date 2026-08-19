-- =====================================================================
-- MEZCLA MENU UPDATE — Full Menu Content Seed
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- =====================================================================
-- This script upserts the 5 menu categories and all products.
-- Safe to re-run (uses ON CONFLICT DO UPDATE).
-- =====================================================================


-- ─── STEP 1: Upsert the 5 Menu Categories ─────────────────────────

INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES
  (
    'Sourdough Bread',
    'sourdough-breads',
    'Long-fermented sourdough loaves available every Wednesday. Orders to be placed by Monday. Choose from Maida or Whole Wheat.',
    1,
    true
  ),
  (
    'Speciality Bread',
    'specialty-breads',
    'Soft sandwich loaves, focaccia, pita, kulcha, baguette, ciabatta and more — freshly baked to order.',
    2,
    true
  ),
  (
    'Other Bakes & Desserts',
    'other-bakes',
    'Korean cream cheese buns, Berliners, quiches, cinnamon rolls, blueberry rolls, brownies, jar cakes, cupcakes and more.',
    3,
    true
  ),
  (
    'Handcrafted Dips & Mezze',
    'dips',
    'Freshly prepared in small batches using only Extra Virgin Olive Oil. Perfect for grazing boards, sandwiches, pastas or with warm bread.',
    4,
    true
  ),
  (
    'Cakes',
    'cakes',
    'Handcrafted eggless celebration cakes using premium ingredients. Custom flavours, natural colours — no artificial additives.',
    5,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order  = EXCLUDED.sort_order,
  is_active   = EXCLUDED.is_active;


-- ─── STEP 2: Sourdough Breads (8 products) ────────────────────────

INSERT INTO products (
  name, slug, description, price, price_label,
  is_available, is_featured, sort_order, tags,
  meta_title, meta_desc, category_id
)
SELECT
  p.name, p.slug, p.description, p.price, p.price_label,
  p.is_available, p.is_featured, p.sort_order, p.tags,
  p.meta_title, p.meta_desc,
  c.id
FROM (VALUES
  (
    'Classic Sourdough (Maida)',
    'classic-sourdough-maida',
    'Our signature classic sourdough made with Maida flour. Long-fermented for a beautifully open crumb and deeply flavoured crust. Available every Wednesday — order by Monday.',
    200.00, '₹200', true, true, 1,
    ARRAY['sourdough','maida','wednesday-bake','pre-order'],
    'Classic Sourdough (Maida) — Mezcla Artisan Bakery Bangalore',
    'Long-fermented classic sourdough made with Maida. Order by Monday for Wednesday bake. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Classic Sourdough (Whole Wheat)',
    'classic-sourdough-whole-wheat',
    'Our classic sourdough crafted with 100% whole wheat flour. Nutty, wholesome and naturally leavened. Available every Wednesday — order by Monday.',
    200.00, '₹200', true, true, 2,
    ARRAY['sourdough','whole-wheat','wednesday-bake','pre-order'],
    'Classic Sourdough (Whole Wheat) — Mezcla Bangalore',
    'Wholesome classic sourdough in 100% whole wheat. Order by Monday for Wednesday bake. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Olive, Rosemary & Garlic Sourdough (Maida)',
    'olive-rosemary-garlic-sourdough-maida',
    'Classic sourdough infused with briny olives, fragrant rosemary and roasted garlic. Made with Maida flour. Available every Wednesday — order by Monday.',
    250.00, '₹250', true, true, 3,
    ARRAY['sourdough','maida','olive','rosemary','garlic','wednesday-bake'],
    'Olive Rosemary Garlic Sourdough (Maida) — Mezcla Bangalore',
    'Fragrant olive, rosemary and garlic sourdough on Maida. Wednesday bake. Order by Monday from Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Olive, Rosemary & Garlic Sourdough (Whole Wheat)',
    'olive-rosemary-garlic-sourdough-whole-wheat',
    'Classic sourdough infused with briny olives, fragrant rosemary and roasted garlic. Made with whole wheat flour. Available every Wednesday — order by Monday.',
    250.00, '₹250', true, false, 4,
    ARRAY['sourdough','whole-wheat','olive','rosemary','garlic','wednesday-bake'],
    'Olive Rosemary Garlic Sourdough (Whole Wheat) — Mezcla Bangalore',
    'Fragrant olive, rosemary and garlic sourdough on whole wheat. Wednesday bake. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Cheddar & Jalapeño Sourdough (Maida)',
    'cheddar-jalapeno-sourdough-maida',
    'A bold sourdough packed with sharp cheddar and fiery jalapeños, made with Maida flour. The perfect cheesy, spicy loaf. Available every Wednesday — order by Monday.',
    250.00, '₹250', true, true, 5,
    ARRAY['sourdough','maida','cheddar','jalapeno','wednesday-bake'],
    'Cheddar Jalapeño Sourdough (Maida) — Mezcla Bangalore',
    'Cheesy, spicy cheddar jalapeño sourdough on Maida. Wednesday bake. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Cheddar & Jalapeño Sourdough (Whole Wheat)',
    'cheddar-jalapeno-sourdough-whole-wheat',
    'A bold sourdough packed with sharp cheddar and fiery jalapeños, made with whole wheat flour. Available every Wednesday — order by Monday.',
    250.00, '₹250', true, false, 6,
    ARRAY['sourdough','whole-wheat','cheddar','jalapeno','wednesday-bake'],
    'Cheddar Jalapeño Sourdough (Whole Wheat) — Mezcla Bangalore',
    'Cheesy, spicy cheddar jalapeño sourdough on whole wheat. Wednesday bake. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Turmeric, Walnut & Pumpkin Seeds Sourdough (Maida)',
    'turmeric-walnut-pumpkin-sourdough-maida',
    'A vibrant sourdough enriched with golden turmeric, crunchy walnuts and pumpkin seeds. Made with Maida flour. Available every Wednesday — order by Monday.',
    275.00, '₹275', true, false, 7,
    ARRAY['sourdough','maida','turmeric','walnut','pumpkin-seeds','wednesday-bake'],
    'Turmeric Walnut Pumpkin Seeds Sourdough (Maida) — Mezcla Bangalore',
    'Golden turmeric sourdough with walnuts and pumpkin seeds. Wednesday bake on Maida. Mezcla Bangalore.',
    'sourdough-breads'
  ),
  (
    'Turmeric, Walnut & Pumpkin Seeds Sourdough (Whole Wheat)',
    'turmeric-walnut-pumpkin-sourdough-whole-wheat',
    'A vibrant sourdough enriched with golden turmeric, crunchy walnuts and pumpkin seeds. Made with whole wheat flour. Available every Wednesday — order by Monday.',
    275.00, '₹275', true, false, 8,
    ARRAY['sourdough','whole-wheat','turmeric','walnut','pumpkin-seeds','wednesday-bake'],
    'Turmeric Walnut Pumpkin Seeds Sourdough (Whole Wheat) — Mezcla Bangalore',
    'Golden turmeric sourdough with walnuts and pumpkin seeds. Wednesday bake on whole wheat. Mezcla Bangalore.',
    'sourdough-breads'
  )
) AS p(name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_available= EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order  = EXCLUDED.sort_order,
  tags        = EXCLUDED.tags,
  meta_title  = EXCLUDED.meta_title,
  meta_desc   = EXCLUDED.meta_desc,
  category_id = EXCLUDED.category_id;


-- ─── STEP 3: Speciality Breads (9 products) ───────────────────────

INSERT INTO products (
  name, slug, description, price, price_label,
  is_available, is_featured, sort_order, tags,
  meta_title, meta_desc, category_id
)
SELECT
  p.name, p.slug, p.description, p.price, p.price_label,
  p.is_available, p.is_featured, p.sort_order, p.tags,
  p.meta_title, p.meta_desc,
  c.id
FROM (VALUES
  (
    '100% Whole Wheat Sandwich Bread',
    'whole-wheat-sandwich-bread',
    '100% whole wheat, zero maida. Soft, fluffy and perfect for everyday sandwiches & toast. Approx 500 gms.',
    140.00, '₹140', true, true, 1,
    ARRAY['whole-wheat','sandwich-bread','everyday'],
    'Whole Wheat Sandwich Bread — Mezcla Bangalore',
    '100% whole wheat sandwich bread, zero maida. Soft, fluffy and fresh. Order from Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Japanese Milk Bread',
    'japanese-milk-bread',
    'Made using the traditional tangzhong method for an incredibly soft, cloud-like texture that stays fresh for longer. Perfect for toast, sandwiches and comforting everyday meals. Approx 530 gms.',
    140.00, '₹140', true, true, 2,
    ARRAY['milk-bread','tangzhong','japanese','soft'],
    'Japanese Milk Bread — Mezcla Bangalore',
    'Soft, cloud-like Japanese milk bread made with the tangzhong method. Fresh from Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Mumbai Style Ladi Pav (6 pcs)',
    'ladi-pav-6pcs',
    'Classic Mumbai-style ladi pav made fresh in our kitchen. Soft, fluffy and lightly sweet — perfect with bhaji, vada pav, misal, keema-style fillings, or simply with butter and chai.',
    100.00, '₹100', true, false, 3,
    ARRAY['ladi-pav','mumbai','pav','indian'],
    'Mumbai Style Ladi Pav — Mezcla Bangalore',
    'Freshly baked soft Mumbai ladi pav. Perfect with bhaji, vada pav and more. Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Italian Focaccia',
    'italian-focaccia',
    'A classic Italian flatbread with a crisp, golden crust and a soft, airy interior. Finished with extra virgin olive oil and herbs — perfect for tearing and sharing, building sandwiches, or enjoying alongside soups and pasta. Approx 350 gms.',
    250.00, '₹250', true, true, 4,
    ARRAY['focaccia','italian','olive-oil','herbs'],
    'Italian Focaccia — Mezcla Artisan Breads Bangalore',
    'Classic Italian focaccia with crisp crust and soft airy interior. Fresh from Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Pita Bread (6 pcs)',
    'pita-bread-6pcs',
    'Freshly rolled and oven-baked until soft, fluffy and lightly chewy. Perfect for scooping up hummus, stuffing with your favourite fillings, or enjoying warm straight from the oven.',
    130.00, '₹130', true, false, 5,
    ARRAY['pita','middle-eastern','flatbread'],
    'Pita Bread — Mezcla Bangalore',
    'Freshly baked soft pita bread. Perfect with hummus and dips. Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Delhi Style Bread Kulcha (6 pcs)',
    'bread-kulcha-6pcs',
    'Hand-rolled and freshly baked until irresistibly soft, fluffy and pillowy. Classic Delhi-style kulchas perfect for scooping up chole, rich curries or enjoyed warm with a generous dollop of butter.',
    140.00, '₹140', true, false, 6,
    ARRAY['kulcha','delhi','indian','flatbread'],
    'Delhi Style Bread Kulcha — Mezcla Bangalore',
    'Soft, fluffy Delhi-style bread kulcha. Perfect with chole and curries. Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Classic French Baguette',
    'french-baguette',
    'A timeless French classic with a beautifully crisp, golden crust and a light, airy crumb. Perfect for sandwiches, cheese boards, dipping into soups, or simply enjoyed warm with butter. Makes great bruschetta and garlic cheese breads.',
    150.00, '₹150', true, false, 7,
    ARRAY['baguette','french','crisp-crust'],
    'Classic French Baguette — Mezcla Bangalore',
    'Timeless crisp French baguette. Perfect for sandwiches and cheese boards. Mezcla Bangalore.',
    'specialty-breads'
  ),
  (
    'Ciabatta (2 pcs)',
    'ciabatta-2pcs',
    'A rustic Italian bread with a crisp golden crust and a light, airy interior. Made for hearty sandwiches, grazing boards or simply enjoyed warm with olive oil and butter.',
    100.00, '₹100', true, false, 8,
    ARRAY['ciabatta','italian','rustic'],
    'Ciabatta — Mezcla Bangalore',
    'Rustic Italian ciabatta with crisp crust. Perfect for sandwiches and grazing boards. Mezcla.',
    'specialty-breads'
  ),
  (
    'Pesto Babka',
    'pesto-babka',
    'Soft, fluffy and beautifully layered with fragrant basil pesto and generous shavings of Parmesan. Savoury, aromatic and indulgent — perfect for everyday sandwiches, toast, or simply enjoyed warm on its own.',
    350.00, '₹350', true, true, 9,
    ARRAY['babka','pesto','parmesan','savory'],
    'Pesto Babka — Mezcla Bangalore',
    'Soft, layered pesto babka with basil pesto and Parmesan. A savoury indulgence from Mezcla Bangalore.',
    'specialty-breads'
  )
) AS p(name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_available= EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order  = EXCLUDED.sort_order,
  tags        = EXCLUDED.tags,
  meta_title  = EXCLUDED.meta_title,
  meta_desc   = EXCLUDED.meta_desc,
  category_id = EXCLUDED.category_id;


-- ─── STEP 4: Other Bakes & Desserts (13 products) ─────────────────

INSERT INTO products (
  name, slug, description, price, price_label,
  is_available, is_featured, sort_order, tags,
  meta_title, meta_desc, category_id
)
SELECT
  p.name, p.slug, p.description, p.price, p.price_label,
  p.is_available, p.is_featured, p.sort_order, p.tags,
  p.meta_title, p.meta_desc,
  c.id
FROM (VALUES
  (
    'Korean Cream Cheese Buns (2 pcs)',
    'korean-cream-cheese-buns-2pcs',
    'Freshly baked soft buns generously filled with a luscious cream cheese filling and finished with herbed butter. Soft, creamy, buttery and utterly addictive — a Mezcla favourite and crowd pleaser since 2022.',
    360.00, '₹360', true, true, 1,
    ARRAY['korean','cream-cheese','buns','bestseller'],
    'Korean Cream Cheese Buns — Mezcla Bangalore',
    'Freshly baked Korean cream cheese buns. A Mezcla bestseller since 2022. Order from Bangalore.',
    'other-bakes'
  ),
  (
    'Mini Korean Cream Cheese Buns (6 pcs)',
    'mini-korean-cream-cheese-buns-6pcs',
    'Our much-loved Korean Cream Cheese Buns in a bite-sized version — fluffy buns filled with creamy cheese filling and finished with herbed butter. Perfect for sharing, parties and indulgent snacking.',
    660.00, '₹660', true, true, 2,
    ARRAY['korean','cream-cheese','mini','party','snacking'],
    'Mini Korean Cream Cheese Buns (6 pcs) — Mezcla Bangalore',
    'Bite-sized Korean cream cheese buns. Perfect for sharing and parties. Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Cheese Fondue Berliner (2 pcs)',
    'cheese-fondue-berliner-2pcs',
    'A soft savoury doughnut filled with creamy cheese fondue and jalapeños, topped with crispy fried onions for the perfect cheesy, spicy bite.',
    280.00, '₹280', true, true, 3,
    ARRAY['berliner','cheese','jalapeno','savory','doughnut'],
    'Cheese Fondue Berliner — Mezcla Bangalore',
    'Savoury doughnut filled with cheese fondue and jalapeños. A Mezcla specialty. Bangalore.',
    'other-bakes'
  ),
  (
    'Duo of Mushroom Quiche (2 pcs)',
    'mushroom-quiche-2pcs',
    'A buttery shortcrust pastry filled with a rich mushroom and leek filling featuring shiitake and button mushrooms. A classic savoury bake with layers of flavour.',
    300.00, '₹300', true, false, 4,
    ARRAY['quiche','mushroom','leek','savoury','pastry'],
    'Mushroom Quiche — Mezcla Bangalore',
    'Buttery shortcrust quiche with shiitake and button mushrooms. Order from Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Classic Chocolate Donuts (4 pcs)',
    'chocolate-donuts-4pcs',
    'Soft, fluffy donuts coated generously with chocolate — a nostalgic favourite made the Mezcla way.',
    300.00, '₹300', true, false, 5,
    ARRAY['donuts','chocolate','sweet'],
    'Classic Chocolate Donuts — Mezcla Bangalore',
    'Soft, fluffy chocolate donuts. A nostalgic Mezcla favourite. Order from Bangalore.',
    'other-bakes'
  ),
  (
    'Cherry Tomato & Basil Quiche (2 pcs)',
    'cherry-tomato-basil-quiche-2pcs',
    'Buttery shortcrust pastry filled with juicy cherry tomatoes and our homemade basil pesto. A delightful savoury bake bursting with fresh flavours.',
    300.00, '₹300', true, false, 6,
    ARRAY['quiche','cherry-tomato','basil','pesto','savoury'],
    'Cherry Tomato & Basil Quiche — Mezcla Bangalore',
    'Buttery shortcrust quiche with cherry tomatoes and basil pesto. Fresh from Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Caramelised Onion Quiche (2 pcs)',
    'caramelised-onion-quiche-2pcs',
    'Buttery shortcrust pastry filled with slow-cooked caramelised onions, creating a rich, sweet and savoury flavour profile.',
    300.00, '₹300', true, false, 7,
    ARRAY['quiche','caramelised-onion','savoury','pastry'],
    'Caramelised Onion Quiche — Mezcla Bangalore',
    'Rich caramelised onion quiche in buttery shortcrust pastry. Order from Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Chocolate & Orange Berliners (2 pcs)',
    'chocolate-orange-berliners-2pcs',
    'Soft and fluffy Berliners filled with silky 46% couverture chocolate ganache and homemade orange marmalade — a beautiful balance of rich chocolate and bright citrus notes.',
    370.00, '₹370', true, true, 8,
    ARRAY['berliner','chocolate','orange','ganache','marmalade'],
    'Chocolate & Orange Berliners — Mezcla Bangalore',
    'Soft Berliners with couverture chocolate ganache and orange marmalade. Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Cinnamon Rolls (6 pcs)',
    'cinnamon-rolls-6pcs',
    'Soft, fluffy rolls layered with aromatic cinnamon, brown sugar and juicy raisins. Baked to perfection and finished with a delicate milk glaze for a comforting, melt-in-your-mouth treat.',
    650.00, '₹650', true, true, 9,
    ARRAY['cinnamon-rolls','sweet','glazed','raisins'],
    'Cinnamon Rolls — Mezcla Bangalore',
    'Soft, fluffy cinnamon rolls with brown sugar and milk glaze. A Mezcla favourite. Bangalore.',
    'other-bakes'
  ),
  (
    'Blueberry Rolls (6 pcs)',
    'blueberry-rolls-6pcs',
    'Soft, fluffy rolls layered with our homemade blueberry compote, bursting with deep, rich berry flavours. Finished with a delicate milk glaze for a beautiful balance of sweetness and creaminess.',
    750.00, '₹750', true, false, 10,
    ARRAY['blueberry-rolls','sweet','glazed','berry'],
    'Blueberry Rolls — Mezcla Bangalore',
    'Soft blueberry rolls with homemade compote and milk glaze. Fresh from Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Mango Jar Cake (~300 gms)',
    'mango-jar-cake',
    'A melt-in-your-mouth mango delight layered with vanilla bean sponge, luscious couverture white chocolate ganache and fresh Alphonso mango compote. Finished with juicy fresh mango pieces. Seasonal — available for a limited time.',
    385.00, '₹385', true, true, 11,
    ARRAY['jar-cake','mango','alphonso','seasonal','white-chocolate'],
    'Mango Jar Cake — Mezcla Bangalore (Seasonal)',
    'Seasonal Alphonso mango jar cake with white chocolate ganache. Available for a limited time. Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Brownie Slab (~200 gms)',
    'brownie-slab',
    'A rich, fudgy, indulgent brownie made with premium chocolate and finished with a silky 46% dark couverture chocolate ganache and fresh berries. A decadent treat for every chocolate lover.',
    325.00, '₹325', true, true, 12,
    ARRAY['brownie','chocolate','fudgy','ganache','berries'],
    'Brownie Slab — Mezcla Bangalore',
    'Rich, fudgy brownie with 46% dark couverture ganache and fresh berries. Mezcla Bangalore.',
    'other-bakes'
  ),
  (
    'Lemon & Blueberry Cupcakes (6 pcs)',
    'lemon-blueberry-cupcakes-6pcs',
    'Moist vanilla cupcakes bursting with blueberries, topped with a luscious lemon cream cheese frosting and finished with fresh blueberries. A refreshing balance of citrus, berry and creamy sweetness.',
    660.00, '₹660', true, false, 13,
    ARRAY['cupcakes','blueberry','lemon','cream-cheese','frosting'],
    'Lemon & Blueberry Cupcakes — Mezcla Bangalore',
    'Moist vanilla cupcakes with lemon cream cheese frosting and fresh blueberries. Mezcla Bangalore.',
    'other-bakes'
  )
) AS p(name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_available= EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order  = EXCLUDED.sort_order,
  tags        = EXCLUDED.tags,
  meta_title  = EXCLUDED.meta_title,
  meta_desc   = EXCLUDED.meta_desc,
  category_id = EXCLUDED.category_id;


-- ─── STEP 5: Handcrafted Dips & Mezze (6 products) ────────────────

INSERT INTO products (
  name, slug, description, price, price_label,
  is_available, is_featured, sort_order, tags,
  meta_title, meta_desc, category_id
)
SELECT
  p.name, p.slug, p.description, p.price, p.price_label,
  p.is_available, p.is_featured, p.sort_order, p.tags,
  p.meta_title, p.meta_desc,
  c.id
FROM (VALUES
  (
    'Classic Hummus',
    'classic-hummus',
    'Our classic Middle Eastern dip made with chickpeas, tahini, extra virgin olive oil, fresh lemon and garlic. Silky smooth, wholesome and full of flavour — perfect with warm pita, sourdough or fresh vegetables. 150g Jar.',
    225.00, '₹225', true, true, 1,
    ARRAY['hummus','vegan','gluten-free','middle-eastern','chickpeas'],
    'Classic Hummus (150g) — Mezcla Bangalore',
    'Silky smooth classic hummus with tahini and extra virgin olive oil. 150g jar. Mezcla Bangalore.',
    'dips'
  ),
  (
    'Muhammara',
    'muhammara',
    'A bold Middle Eastern dip made with roasted red peppers, walnuts, extra virgin olive oil, sumac and pomegranate molasses. Smoky, sweet, tangy and gently spiced — delicious with bread, grilled vegetables or as part of a mezze spread. 150g Jar.',
    300.00, '₹300', true, true, 2,
    ARRAY['muhammara','vegan','roasted-peppers','walnut','pomegranate'],
    'Muhammara (150g) — Mezcla Bangalore',
    'Bold roasted red pepper and walnut muhammara dip. 150g jar. Mezcla Bangalore.',
    'dips'
  ),
  (
    'Italian Basil Pesto',
    'italian-basil-pesto',
    'Fresh Italian basil blended with extra virgin olive oil, Parmesan, roasted cashews and garlic. Rich, vibrant and bursting with flavour — perfect tossed through pasta, spread on sandwiches or served alongside fresh bread. 150g Jar.',
    350.00, '₹350', true, true, 3,
    ARRAY['pesto','basil','parmesan','italian','cashews'],
    'Italian Basil Pesto (150g) — Mezcla Bangalore',
    'Fresh Italian basil pesto with Parmesan and roasted cashews. 150g jar. Mezcla Bangalore.',
    'dips'
  ),
  (
    'Tzatziki',
    'tzatziki',
    'A refreshing Greek yogurt dip made with hung curd, cucumber, fresh dill, garlic and extra virgin olive oil. Creamy, light and the perfect accompaniment to pita, grilled vegetables and Mediterranean meals. 150g Jar.',
    200.00, '₹200', true, false, 4,
    ARRAY['tzatziki','greek','yogurt','cucumber','dill'],
    'Tzatziki (150g) — Mezcla Bangalore',
    'Creamy Greek tzatziki with hung curd, cucumber and dill. 150g jar. Mezcla Bangalore.',
    'dips'
  ),
  (
    'Labneh',
    'labneh',
    'A creamy Middle Eastern strained yoghurt finished with extra virgin olive oil. Tangy, rich and delicious served with warm bread, roasted vegetables or as part of a mezze platter. 150g Jar.',
    230.00, '₹230', true, false, 5,
    ARRAY['labneh','middle-eastern','yogurt','strained'],
    'Labneh (150g) — Mezcla Bangalore',
    'Creamy Middle Eastern strained yoghurt labneh with olive oil. 150g jar. Mezcla Bangalore.',
    'dips'
  ),
  (
    'Onion Balsamic Jam',
    'onion-balsamic-jam',
    'Slow-cooked onions caramelised to perfection with balsamic vinegar and aromatic herbs. Sweet, savoury and deeply flavourful — perfect with cheeses, sandwiches, burgers or on a grazing board or cheese board. 150g Jar.',
    175.00, '₹175', true, false, 6,
    ARRAY['onion-jam','balsamic','caramelised','sweet-savoury'],
    'Onion Balsamic Jam (150g) — Mezcla Bangalore',
    'Sweet and savoury caramelised onion balsamic jam. 150g jar. Perfect for cheese boards. Mezcla Bangalore.',
    'dips'
  )
) AS p(name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_available= EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order  = EXCLUDED.sort_order,
  tags        = EXCLUDED.tags,
  meta_title  = EXCLUDED.meta_title,
  meta_desc   = EXCLUDED.meta_desc,
  category_id = EXCLUDED.category_id;


-- ─── STEP 6: Cakes (1 product — custom enquiry) ───────────────────

INSERT INTO products (
  name, slug, description, price, price_label,
  is_available, is_featured, sort_order, tags,
  meta_title, meta_desc, category_id
)
SELECT
  'Custom Celebration Cake',
  'custom-celebration-cake',
  'Looking for something special? From elegant minimal cakes to fully customised celebration cakes, we create handcrafted eggless cakes using premium ingredients. Made with real ingredients and natural flavours — no artificial colours or flavouring. Homemade fruit compotes, couverture chocolate and fresh seasonal produce. Share your vision with us and we''ll bring it to life. Flavour comes first, always.',
  NULL,
  'Price on request',
  true,
  true,
  1,
  ARRAY['celebration-cake','custom','eggless','couverture-chocolate'],
  'Custom Celebration Cakes — Mezcla Bangalore',
  'Handcrafted eggless celebration cakes with premium ingredients and natural flavours. Custom orders. Mezcla Bangalore.',
  c.id
FROM categories c
WHERE c.slug = 'cakes'
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_available= EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order  = EXCLUDED.sort_order,
  tags        = EXCLUDED.tags,
  meta_title  = EXCLUDED.meta_title,
  meta_desc   = EXCLUDED.meta_desc,
  category_id = EXCLUDED.category_id;


-- ─── Verify results ───────────────────────────────────────────────

SELECT
  c.name AS "Category",
  c.slug AS "Slug",
  COUNT(p.id) AS "Products",
  c.sort_order AS "Order"
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.is_available = true AND p.deleted_at IS NULL
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug, c.sort_order
ORDER BY c.sort_order;
