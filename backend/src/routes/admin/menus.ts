import { Router } from 'express';
import crypto from 'crypto';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';
import { adminSupabase } from '../../lib/supabase.js';
import { validate, CreateMenuSchema, UpdateMenuSchema, UpdateMenuItemsSchema } from '../../lib/schemas.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

/** GET /api/admin/menus — List all menus */
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await adminSupabase
      .from('menus')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** GET /api/admin/menus/:id — Get single menu with its items */
router.get('/:id', async (req, res, next) => {
  try {
    const { data: menu, error: menuError } = await adminSupabase
      .from('menus')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (menuError) throw menuError;

    const { data: items, error: itemsError } = await adminSupabase
      .from('menu_items')
      .select('*, products(*, categories(name, slug))')
      .eq('menu_id', req.params.id)
      .order('sort_order', { ascending: true });
      
    if (itemsError) throw itemsError;

    res.json({ data: { ...menu, items } });
  } catch (err) { next(err); }
});

/** POST /api/admin/menus — Create new menu */
router.post('/', async (req, res, next) => {
  try {
    const body = validate(CreateMenuSchema, req.body);
    const { data, error } = await adminSupabase
      .from('menus')
      .insert(body)
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
});

/** PUT /api/admin/menus/:id — Update menu metadata */
router.put('/:id', async (req, res, next) => {
  try {
    const body = validate(UpdateMenuSchema, req.body);
    const { data, error } = await adminSupabase
      .from('menus')
      .update(body)
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

/** DELETE /api/admin/menus/:id — Delete menu (cascades items) */
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await adminSupabase
      .from('menus')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.status(204).send();
  } catch (err) { next(err); }
});

/** PUT /api/admin/menus/:id/items — Update all items for a menu */
router.put('/:id/items', async (req, res, next) => {
  try {
    const body = validate(UpdateMenuItemsSchema, req.body);
    const menuId = req.params.id;

    // First delete all existing items for this menu
    const { error: deleteError } = await adminSupabase
      .from('menu_items')
      .delete()
      .eq('menu_id', menuId);
      
    if (deleteError) throw deleteError;

    // Then insert the new items with updated sort_order
    if (body.items.length > 0) {
      const itemsToInsert = [];
      const CUSTOM_CATEGORY_ID = '3acc6666-ed8f-4637-9167-4c744c07ae94';
      
      for (let i = 0; i < body.items.length; i++) {
        const item = body.items[i];
        let productId = item.product_id;
        
        // If it's a custom item (no product_id), create a dummy product first
        if (!productId) {
          const { data: newProd, error: prodErr } = await adminSupabase
            .from('products')
            .insert({
              category_id: CUSTOM_CATEGORY_ID,
              name: item.custom_name ?? 'Custom Item',
              slug: `custom-${crypto.randomUUID()}`,
              price: item.custom_price ?? 0,
              is_available: true,
              is_featured: false,
              show_price: false
            })
            .select()
            .single();
            
          if (prodErr) throw prodErr;
          productId = newProd.id;
        }

        itemsToInsert.push({
          menu_id: menuId,
          product_id: productId,
          custom_price: item.custom_price ?? null,
          custom_price_label: item.custom_price_label ?? null,
          is_vegan: item.is_vegan ?? false,
          is_gf: item.is_gf ?? false,
          has_nuts: item.has_nuts ?? false,
          sort_order: i,
        });
      }

      const { error: insertError } = await adminSupabase
        .from('menu_items')
        .insert(itemsToInsert);
        
      if (insertError) throw insertError;
    }

    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
