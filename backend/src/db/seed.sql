-- =====================================================================
-- MEZCLA EXTENDED SEED DATA
-- Run this in Supabase SQL Editor AFTER running schema.sql
-- Populates all tables with realistic data for admin dashboard graphs
-- =====================================================================

-- ─── Categories (ensure exist) ────────────────────────────────
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
  ('Sourdough & Breads', 'breads', 'Small-batch sourdough, multigrain and specialty breads baked fresh.', 1, true),
  ('Dips & Spreads', 'dips', 'Fresh hummus, mezze, pestos and artisan spreads.', 2, true),
  ('Snack Boxes', 'snack-boxes', 'Curated snack boxes for offices, parties and gifting.', 3, true),
  ('Grazing Tables', 'grazing-tables', 'Styled edible centrepieces for events and parties in Bangalore.', 4, true),
  ('Hampers & Gifting', 'hampers', 'Thoughtfully curated artisan hampers from ₹800.', 5, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- ─── Products ─────────────────────────────────────────────────
INSERT INTO products (name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, category_id)
SELECT 
  p.name, p.slug, p.description, p.price, p.price_label, p.is_available, p.is_featured, p.sort_order, p.tags, p.meta_title, p.meta_desc,
  c.id
FROM (VALUES
  -- Sourdough & Breads
  ('Sourdough Multigrain Boule', 'sourdough-multigrain-boule', 'Our signature 72-hour cold-fermented multigrain sourdough with sunflower seeds, oats and sesame. Crisp crust, open crumb.', 480.00, '₹480', true, true, 1, ARRAY['vegan', 'sourdough', 'multigrain'], 'Sourdough Multigrain Boule — Mezcla Artisan Bakery Bangalore', 'Handcrafted 72-hour cold-fermented multigrain sourdough boule baked fresh in small batches. Order online in Bangalore.', 'breads'),
  ('Rosemary Focaccia', 'rosemary-focaccia', 'Light and airy focaccia generously drizzled with extra-virgin olive oil and fresh rosemary. Vegan-friendly.', 360.00, '₹360', true, false, 2, ARRAY['vegan', 'focaccia'], 'Rosemary Focaccia — Mezcla Artisan Breads', 'Fluffy rosemary focaccia baked fresh. Order in Bangalore from Mezcla.', 'breads'),
  ('Korean Cream Cheese Buns', 'korean-buns', 'Soft and pillowy Korean-style buns, drenched in garlic butter and stuffed with sweetened cream cheese.', 350.00, '₹350', true, true, 3, ARRAY['buns', 'cream-cheese', 'garlic'], 'Korean Cream Cheese Buns — Mezcla', 'Indulgent Korean cream cheese buns baked fresh in Bangalore.', 'breads'),
  ('Artisan Cheese Berliner', 'cheese-berliner', 'A savoury twist on the classic berliner, filled with rich artisan cheese.', 280.00, '₹280', true, false, 4, ARRAY['berliner', 'cheese'], 'Artisan Cheese Berliner — Mezcla', 'Freshly baked cheese berlinres in Bangalore.', 'breads'),
  ('Chocolate Berliner', 'chocolate-berliner', 'Decadent chocolate-filled berliner doughnuts, dusted with fine sugar.', 290.00, '₹290', true, true, 5, ARRAY['berliner', 'chocolate', 'sweet'], 'Chocolate Berliner — Mezcla', 'Rich chocolate berlinres made fresh to order.', 'breads'),
  ('Seasonal Mango Berliner', 'mango-berliner', 'A summer special — soft berliner filled with fresh, tangy mango cream.', 320.00, '₹320', true, false, 6, ARRAY['berliner', 'mango', 'seasonal'], 'Seasonal Mango Berliner — Mezcla', 'Fresh mango berlinres available for a limited time.', 'breads'),
  ('Farmhouse Quiche', 'farmhouse-quiche', 'Classic savoury tart with a buttery, flaky crust and a rich, creamy filling.', 850.00, '₹850', true, false, 7, ARRAY['quiche', 'savoury'], 'Farmhouse Quiche — Mezcla', 'Freshly baked savoury quiche in Bangalore.', 'breads'),

  -- Dips & Spreads
  ('Classic Hummus', 'classic-hummus', 'Silky smooth hummus made from slow-cooked chickpeas, tahini, lemon and garlic. Served with olive oil and paprika.', 380.00, '₹380', true, true, 1, ARRAY['vegan', 'gluten-free', 'hummus'], 'Classic Hummus — Mezcla Artisan Kitchen', 'Smooth artisan hummus made fresh in Bangalore. Order now from Mezcla.', 'dips'),
  ('Basil Pesto', 'basil-pesto', 'Fresh Genovese basil, pine nuts, parmesan and extra-virgin olive oil blended to perfection.', 460.00, '₹460', true, false, 2, ARRAY['vegetarian', 'pesto'], 'Basil Pesto — Mezcla Artisan Spreads', 'Freshly made basil pesto, perfect with bread and pasta. Order in Bangalore.', 'dips'),
  ('Roasted Muhammara', 'roasted-muhammara', 'A rich, smoky Levantine dip made of roasted red peppers, walnuts, and pomegranate molasses.', 450.00, '₹450', true, true, 3, ARRAY['vegan', 'muhammara', 'spicy'], 'Roasted Muhammara — Mezcla', 'Authentic muhammara dip available for delivery in Bangalore.', 'dips'),

  -- Snack Boxes & Sweet Treats
  ('Artisan Biscuits', 'artisan-biscuits', 'Crisp, buttery artisan biscuits, perfect for your evening tea or coffee.', 450.00, '₹450', true, false, 1, ARRAY['biscuits', 'sweet', 'tea-time'], 'Artisan Biscuits — Mezcla', 'Handcrafted artisan biscuits.', 'snack-boxes'),
  ('Fresh Mango Jar Cake', 'mango-jar-cake', 'Layers of soft sponge, fresh mango compote, and light cream, served in a convenient glass jar.', 420.00, '₹420', true, true, 2, ARRAY['cake', 'mango', 'sweet'], 'Mango Jar Cake — Mezcla', 'Fresh mango jar cakes.', 'snack-boxes'),

  -- Grazing Tables (Kept as requested)
  ('Grazing Table — Small (serves 10–15)', 'grazing-table-small', 'A stunning edible centrepiece for intimate gatherings. Includes breads, dips, cheese, charcuterie, fruits, nuts and florals. Setup included.', 4500.00, '₹4,500', true, true, 1, ARRAY['grazing', 'event', 'party'], 'Grazing Table Small — Mezcla Bangalore Events', 'Styled grazing tables for events in Bangalore from Mezcla. Serves 10–15 guests.', 'grazing-tables'),
  ('Grazing Table — Medium (serves 25–30)', 'grazing-table-medium', 'Our most popular grazing table for weddings, baby showers and corporate events. 3-hour setup window, florist coordination available.', 9500.00, '₹9,500', true, true, 2, ARRAY['grazing', 'event', 'wedding'], 'Grazing Table Medium — Mezcla Bangalore', 'Premium grazing table for 25–30 guests at events in Bangalore.', 'grazing-tables'),
  ('Mezze Dips Platter', 'mezze-dips-platter', 'A beautiful assortment of our finest dips, served with fresh breads and crackers for your gatherings.', 2200.00, '₹2,200', true, true, 3, ARRAY['platter', 'mezze', 'dips'], 'Mezze Dips Platter — Mezcla', 'Curated mezze dip platters for events.', 'grazing-tables'),

  -- Hampers & Gifting
  ('Artisan Bread & Dip Hamper', 'artisan-bread-dip-hamper', 'The perfect gift — our sourdough multigrain loaf, two artisan dips and a bag of sourdough crackers in a beautiful woven box.', 1200.00, '₹1,200', true, true, 1, ARRAY['hamper', 'gift', 'bread', 'dip'], 'Artisan Bread & Dip Hamper — Mezcla Gift Hampers Bangalore', 'Artisan gift hamper with sourdough and dips from Mezcla. Perfect for Bangalore gifting.', 'hampers'),
  ('Diwali Premium Hamper', 'diwali-premium-hamper', 'A festive celebration hamper with sourdough, three dips, artisan crackers, premium olive oil, handmade chocolates and a Diwali card.', 3200.00, '₹3,200', true, true, 2, ARRAY['hamper', 'diwali', 'festive', 'premium'], 'Diwali Premium Hamper — Mezcla Festive Gifting Bangalore', 'Premium Diwali hamper from Mezcla Bangalore. Corporate and personal gifting.', 'hampers')
) AS p(name, slug, description, price, price_label, is_available, is_featured, sort_order, tags, meta_title, meta_desc, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_label = EXCLUDED.price_label,
  is_featured = EXCLUDED.is_featured,
  tags = EXCLUDED.tags,
  meta_title = EXCLUDED.meta_title,
  meta_desc = EXCLUDED.meta_desc;

-- ─── Customers ─────────────────────────────────────────────────
INSERT INTO customers (name, phone, email, tags, notes, created_at, updated_at) VALUES
  ('Priya Sharma', '919876543201', 'priya.sharma@gmail.com', ARRAY['regular', 'vip'], 'Loves sourdough and hummus. Prefers morning delivery.', now() - interval '180 days', now() - interval '5 days'),
  ('Rahul Verma', '919876543202', 'rahul.verma@company.com', ARRAY['corporate'], 'Corporate orders for 20+ people. Contact 2 weeks in advance.', now() - interval '150 days', now() - interval '12 days'),
  ('Ananya Gupta', '919876543203', 'ananya.gupta@gmail.com', ARRAY['regular'], 'Prefers vegan options only. Allergic to nuts.', now() - interval '120 days', now() - interval '8 days'),
  ('Neha Iyer', '919876543204', 'neha.iyer@startup.in', ARRAY['regular', 'vip'], 'Orders grazing tables for team events. Quarterly orders.', now() - interval '90 days', now() - interval '20 days'),
  ('Vikram Singh', '919876543205', null, ARRAY['regular'], 'Cash payment preferred. Always orders Diwali hampers.', now() - interval '60 days', now() - interval '30 days'),
  ('Meera Nair', '919876543206', 'meera.nair@gmail.com', ARRAY['vip'], 'High-value customer. Corporate events 3–4x per year.', now() - interval '45 days', now() - interval '3 days'),
  ('Arjun Malhotra', '919876543207', 'arjun@techfirm.in', ARRAY['corporate', 'bulk'], 'Bulk orders for office. 50+ hampers during festive season.', now() - interval '30 days', now() - interval '7 days'),
  ('Divya Krishnan', '919876543208', 'divya.k@gmail.com', ARRAY['regular'], 'Weekly bread orders. Very punctual on payments.', now() - interval '15 days', now() - interval '2 days')
ON CONFLICT (phone) DO NOTHING;

-- ─── Orders (6 months of data for revenue charts) ──────────────
DO $$
DECLARE
  v_customer_names text[] := ARRAY['Priya Sharma', 'Rahul Verma', 'Ananya Gupta', 'Neha Iyer', 'Vikram Singh', 'Meera Nair', 'Arjun Malhotra', 'Divya Krishnan', 'Rohan Mehta', 'Sunita Patel'];
  v_customer_phones text[] := ARRAY['919876543201', '919876543202', '919876543203', '919876543204', '919876543205', '919876543206', '919876543207', '919876543208', '919876543209', '919876543210'];
  v_statuses text[] := ARRAY['paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'partially_paid', 'cancelled'];
  v_items jsonb[] := ARRAY[
    '[{"name":"Sourdough Multigrain Boule","qty":2,"price":480,"total":960}]'::jsonb,
    '[{"name":"Classic Hummus","qty":2,"price":380,"total":760},{"name":"Basil Pesto","qty":1,"price":460,"total":460}]'::jsonb,
    '[{"name":"Rosemary Focaccia","qty":1,"price":360,"total":360},{"name":"Classic Snack Box","qty":1,"price":850,"total":850}]'::jsonb,
    '[{"name":"Artisan Bread & Dip Hamper","qty":2,"price":1200,"total":2400}]'::jsonb,
    '[{"name":"Diwali Premium Hamper","qty":1,"price":3200,"total":3200}]'::jsonb,
    '[{"name":"Corporate Gift Hamper","qty":5,"price":1800,"total":9000}]'::jsonb,
    '[{"name":"Grazing Table — Small","qty":1,"price":4500,"total":4500}]'::jsonb,
    '[{"name":"Office Party Box","qty":3,"price":2400,"total":7200}]'::jsonb,
    '[{"name":"Classic White Sourdough","qty":2,"price":420,"total":840},{"name":"Beetroot Hummus","qty":1,"price":420,"total":420}]'::jsonb,
    '[{"name":"Gourmet Snacker Hamper","qty":2,"price":2200,"total":4400}]'::jsonb
  ];
  v_idx int;
  v_status text;
  v_items_val jsonb;
  v_subtotal numeric;
  v_discount numeric;
  v_delivery numeric;
  v_cgst numeric;
  v_sgst numeric;
  v_total numeric;
  v_created_at timestamptz;
  v_year int := extract(year from now());
  v_seq int := 1;
  v_order_date timestamptz;
BEGIN
  FOR i IN 1..60 LOOP
    v_idx := (i % 10) + 1;
    v_status := v_statuses[(i % array_length(v_statuses, 1)) + 1];
    v_items_val := v_items[(i % array_length(v_items, 1)) + 1];
    
    -- Calculate subtotal from items
    SELECT COALESCE(SUM((item->>'total')::numeric), 0)
    INTO v_subtotal
    FROM jsonb_array_elements(v_items_val) AS item;
    
    v_discount := CASE WHEN i % 5 = 0 THEN v_subtotal * 0.1 ELSE 0 END;
    v_delivery := CASE WHEN v_subtotal < 1000 THEN 80 ELSE 0 END;
    v_cgst := ROUND(((v_subtotal - v_discount + v_delivery) * 0.025)::numeric, 2);
    v_sgst := ROUND(((v_subtotal - v_discount + v_delivery) * 0.025)::numeric, 2);
    v_total := ROUND((v_subtotal - v_discount + v_delivery + v_cgst + v_sgst)::numeric, 2);
    
    -- Spread orders over last 6 months
    v_order_date := now() - (((180 - (i * 3)) || ' days')::interval) + ((random() * 86400)::int * '1 second'::interval);
    
    INSERT INTO orders (
      invoice_number, customer_name, customer_phone, customer_email,
      customer_address, items, subtotal, discount, delivery_charge,
      cgst_pct, sgst_pct, cgst_amount, sgst_amount, total,
      status, payment_method, notes, created_at, updated_at
    ) VALUES (
      'MZ-' || v_year || '-' || lpad(v_seq::text, 3, '0'),
      v_customer_names[v_idx],
      v_customer_phones[v_idx],
      null,
      'Bangalore, Karnataka',
      v_items_val,
      v_subtotal,
      v_discount,
      v_delivery,
      2.5, 2.5,
      v_cgst, v_sgst, v_total,
      v_status,
      CASE v_status WHEN 'paid' THEN 'upi' ELSE null END,
      null,
      v_order_date,
      v_order_date
    ) ON CONFLICT (invoice_number) DO NOTHING;
    
    v_seq := v_seq + 1;
  END LOOP;
END $$;

-- ─── Testimonials ─────────────────────────────────────────────
INSERT INTO testimonials (name, location, rating, text, is_active) VALUES
  ('Priya Sharma', 'Indiranagar, Bangalore', 5, 'Absolutely love Mezcla! The sourdough is out of this world — crispy crust, perfectly chewy inside. I order every week and they never disappoint. The hummus is the best I have had outside a restaurant!', true),
  ('Rahul Verma', 'Koramangala, Bangalore', 5, 'We ordered a grazing table for our team offsite and it was a showstopper. Every single person asked where it was from. Professional, beautiful and absolutely delicious. Will definitely order again!', true),
  ('Ananya Gupta', 'HSR Layout, Bangalore', 5, 'As someone who eats vegan, I am so happy I found Mezcla. The beetroot hummus, pesto and focaccia are all clearly labelled and absolutely divine. Delivery is always on time.', true),
  ('Neha Iyer', 'Whitefield, Bangalore', 4, 'Ordered the Diwali hamper for my family and the presentation was stunning. The quality of ingredients is clearly premium. My only wish is that they deliver to more areas of Bangalore!', true),
  ('Vikram Singh', 'JP Nagar, Bangalore', 5, 'The corporate hampers for our Diwali gifting were a massive hit. Personalized packaging, great quality, and the turnaround was fast despite our large order. Highly recommend for corporate gifting!', true),
  ('Meera Nair', 'Sadashivanagar, Bangalore', 5, 'Mezcla has become my go-to for any celebration. From the rosemary focaccia to the gourmet hampers — every product is made with so much care. You can really taste the love and craft!', true),
  ('Arjun Malhotra', 'MG Road, Bangalore', 5, 'Ordered their Office Party Box for a 10-person team lunch. Value for money and absolutely delicious. The jalapeño cheddar pull-apart was the highlight — gone in minutes!', true),
  ('Divya Krishnan', 'Banashankari, Bangalore', 4, 'Love the weekly bread subscription idea. The seeded rye loaf is my favourite — dense, hearty and pairs beautifully with their hummus. Freshness is always guaranteed.', true)
ON CONFLICT DO NOTHING;

-- ─── Gallery ─────────────────────────────────────────────────
INSERT INTO gallery (url, caption, category, sort_order) VALUES
  ('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', 'Freshly baked sourdough boule', 'breads', 1),
  ('https://images.unsplash.com/photo-1486887396153-fa416526c108?w=800&q=80', 'Rosemary focaccia with olive oil', 'breads', 2),
  ('https://images.unsplash.com/photo-1577859756666-d77a99e83f8e?w=800&q=80', 'Artisan hummus with paprika and olive oil', 'dips', 3),
  ('https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80', 'Fresh basil pesto', 'dips', 4),
  ('https://images.unsplash.com/photo-1608835291093-394b0c943a75?w=800&q=80', 'Grazing table with cheese and charcuterie', 'grazing', 5),
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Corporate event grazing table setup', 'grazing', 6),
  ('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80', 'Premium Diwali gift hamper', 'hampers', 7),
  ('https://images.unsplash.com/photo-1607920592519-bab2a80efd81?w=800&q=80', 'Artisan bread and dip hamper in woven box', 'hampers', 8),
  ('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80', 'Classic snack box assortment', 'snack-boxes', 9),
  ('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', 'Artisan kitchen - behind the scenes', 'general', 10),
  ('https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', 'Sourdough bread cross-section showing open crumb', 'breads', 11),
  ('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', 'Mezze platter with dips and breads', 'general', 12)
ON CONFLICT DO NOTHING;

-- ─── Homepage Content ─────────────────────────────────────────
INSERT INTO homepage_content (key, value, type) VALUES
  ('hero_title', 'Slow-fermented. Small-batch. Made with care.', 'text'),
  ('hero_subtitle', 'Artisan sourdough, handcrafted dips, gourmet hampers and stunning grazing tables — delivered across Bangalore.', 'text'),
  ('hero_cta_primary', 'Order on WhatsApp', 'text'),
  ('hero_cta_secondary', 'Browse Our Menu', 'text'),
  ('about_title', 'A Kitchen Born from Passion', 'text'),
  ('about_text', 'Mezcla began as a pandemic project and grew into Bangalore''s favourite artisanal kitchen. Every loaf, dip and hamper is made in small batches using the finest ingredients — no preservatives, no shortcuts, just craft.', 'text'),
  ('featured_section_title', 'Our Bestsellers', 'text'),
  ('featured_section_subtitle', 'The products our customers love most — made fresh, delivered with care.', 'text'),
  ('instagram_section_title', 'Follow Our Journey', 'text'),
  ('instagram_handle', '@mezclakitchen', 'text'),
  ('whatsapp_cta_text', 'Have a question? Place an order? Just say hi!', 'text'),
  ('whatsapp_number', '919999999999', 'text'),
  ('grazing_hero_title', 'Edible Art for Your Events', 'text'),
  ('grazing_hero_subtitle', 'Stunning grazing tables that become the centrepiece of any gathering in Bangalore.', 'text'),
  ('hampers_hero_title', 'Gifts They Will Actually Love', 'text'),
  ('hampers_hero_subtitle', 'Thoughtfully curated artisan hampers for every occasion — from ₹800.', 'text')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ─── Announcements ────────────────────────────────────────────
INSERT INTO announcements (text, sort_order, is_active) VALUES
  ('🥖 Handcrafted in small batches · Order 2–3 days in advance · Delivering across South & Central Bangalore', 0, true),
  ('🎁 Corporate gifting season is here! Bulk hamper orders open — minimum 20 units. WhatsApp us for pricing.', 1, true),
  ('✨ New product: Jalapeño Cheddar Pull-Apart Rolls — available now for weekend orders!', 2, true)
ON CONFLICT DO NOTHING;

-- ─── Contact Info (update defaults) ──────────────────────────
INSERT INTO contact_info (key, value) VALUES
  ('phone', '919999999999'),
  ('whatsapp', '919999999999'),
  ('email', 'hello@mezclakitchen.in'),
  ('address', 'Studio Kitchen, Bangalore, Karnataka'),
  ('hours', 'Monday – Saturday · 10:00 AM – 7:00 PM'),
  ('instagram', 'https://instagram.com/mezclakitchen'),
  ('facebook', 'https://facebook.com/mezclakitchen'),
  ('fssai', 'FSSAI License: XXXXXXXXXXXX'),
  ('gstin', '29AAAAA0000A1Z5'),
  ('service_area', 'South & Central Bangalore'),
  ('delivery_note', 'Free delivery on orders above ₹1,500 · Standard delivery ₹80')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ─── FAQs (add more) ─────────────────────────────────────────
INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
  ('How far in advance should I order?', 'Most items need 2–3 days notice. Grazing tables and large hamper orders need 5–7 days. For festive/corporate orders please reach out 3–4 weeks in advance.', 'ordering', 1, true),
  ('Do you deliver outside Bangalore?', 'Currently we deliver within South & Central Bangalore. For outstation requests for grazing tables, please WhatsApp us.', 'ordering', 2, true),
  ('Are your products suitable for vegetarians?', 'Yes! Most of our products are vegetarian. We clearly mark eggless and vegan options. Please mention any allergies when ordering.', 'general', 3, true),
  ('Do you do custom orders?', 'Absolutely! Custom flavours, dietary accommodations, branding for corporate — just WhatsApp us and we will sort it out.', 'general', 4, true),
  ('What is your minimum order for corporate hampers?', 'Corporate gifting has a minimum order of 20 hampers and requires 2–3 weeks lead time for branding and coordination.', 'hampers', 5, true),
  ('Can I visit your kitchen?', 'We are a home-based studio kitchen and do not have a walk-in store. All orders are placed via WhatsApp or our website.', 'general', 6, true),
  ('What is the shelf life of your products?', 'Our sourdough stays fresh for 3–4 days at room temperature or 7–10 days refrigerated. Dips are best consumed within 5–7 days refrigerated. Hampers include best-by dates on all items.', 'general', 7, true),
  ('Do you offer gluten-free options?', 'Our dips and spreads are naturally gluten-free. We do not currently offer gluten-free bread, but we are working on it! Please WhatsApp us for allergy-specific requirements.', 'general', 8, true),
  ('How do I set up a grazing table?', 'We handle everything — from setup to styling. We arrive 2 hours before your event to set up and style the table. We request a minimum floor space of 6 feet x 3 feet.', 'grazing', 9, true),
  ('Do you provide containers for the grazing table after the event?', 'Yes, we bring our own boards and vessels. We return to collect them or they can be handed to your event coordinator at the end.', 'grazing', 10, true)
ON CONFLICT DO NOTHING;
