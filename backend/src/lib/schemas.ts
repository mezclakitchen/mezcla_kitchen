import { z } from 'zod';

// ─── Product Variants ─────────────────────────────────────────
export const ProductVariantSchema = z.object({
  name: z.string().min(1).max(100),          // e.g. "2 Mini Cups", "Whole Wheat"
  price: z.number().min(0).optional().nullable(),
  price_label: z.string().max(50).optional().nullable(), // e.g. "From ₹480"
});

// ─── Products ────────────────────────────────────────────────
export const CreateProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.number().min(0).optional().nullable(),
  price_label: z.string().max(50).optional().or(z.literal('')).nullable(),
  show_price: z.boolean().optional(),   // optional — won't fail if column missing
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  tags: z.array(z.string()).default([]),
  meta_title: z.string().max(70).optional().or(z.literal('')),
  meta_desc: z.string().max(160).optional().or(z.literal('')),
  variants: z.array(ProductVariantSchema).default([]), // size/option variants
});

export const UpdateProductSchema = CreateProductSchema.partial();

// ─── Categories ───────────────────────────────────────────────
export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().or(z.literal('')),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// ─── Orders ──────────────────────────────────────────────────
export const OrderItemSchema = z.object({
  name: z.string().min(1).max(200),
  qty: z.number().int().positive(),
  price: z.number().positive(),
  total: z.number().positive(),
});

export const CreateOrderSchema = z.object({
  customer_name: z.string().min(2).max(100),
  customer_phone: z.string().min(10).max(15),
  customer_email: z.string().email({ message: 'Valid email is required' }),
  customer_address: z.string().max(500).optional(),
  items: z.array(OrderItemSchema).min(1),
  discount: z.number().min(0).default(0),
  delivery_charge: z.number().min(0).default(0),
  cgst_pct: z.number().min(0).max(100).default(2.5),
  sgst_pct: z.number().min(0).max(100).default(2.5),
  payment_method: z.string().optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['pending', 'paid', 'partially_paid', 'cancelled']).default('pending'),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'partially_paid', 'cancelled']),
  notes: z.string().max(500).optional(),
});

// ─── Customers ────────────────────────────────────────────────
export const UpsertCustomerSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),  // relaxed for international formats
  email: z.string().email().optional().or(z.literal('')).nullable(),
  tags: z.array(z.string()).default([]),
  notes: z.string().max(500).optional().nullable(),
});

// ─── Testimonials ─────────────────────────────────────────────
export const CreateTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string().max(100).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(10).max(1000),
  is_active: z.boolean().default(true),
});

// ─── FAQs ────────────────────────────────────────────────────
export const CreateFAQSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(5).max(2000),
  category: z.string().max(50).optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

// ─── WhatsApp Promotion ───────────────────────────────────────
export const SendPromotionSchema = z.object({
  message: z.string().min(5).max(1500),
  customerIds: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(), // filter by customer tags
  allCustomers: z.boolean().default(false),
});

export const SendInvoiceSchema = z.object({
  orderId: z.string().uuid(),
  customMessage: z.string().max(500).optional(),
});

// ─── Settings ─────────────────────────────────────────────────
export const UpdateSettingsSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
});

export const ContactInfoSchema = z.object({
  key: z.string().min(2),
  value: z.string().min(1),
});

// =====================================================================
// MENUS
// =====================================================================
export const CreateMenuSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().max(2000).optional().or(z.literal('')).nullable(),
  is_active: z.boolean().default(true),
  theme: z.enum(['classic', 'pearl', 'rose', 'sage']).default('classic'),
});

export const UpdateMenuSchema = CreateMenuSchema.partial();

export const UpdateMenuItemsSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid().optional().nullable(),
    custom_name: z.string().max(200).optional().nullable(),
    custom_price: z.number().min(0).optional().nullable(),
    custom_price_label: z.string().max(50).optional().or(z.literal('')).nullable(),
    is_vegan: z.boolean().default(false),
    is_gf: z.boolean().default(false),
    has_nuts: z.boolean().default(false),
  }))
});


// ─── Gallery ──────────────────────────────────────────────────
export const UpdateGalleryItemSchema = z.object({
  caption: z.string().max(300).optional(),
  category: z.string().max(50).optional(),
  sort_order: z.number().int().optional(),
});

// ─── Announcement ─────────────────────────────────────────────
export const CreateAnnouncementSchema = z.object({
  text: z.string().min(5).max(500),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ─── Validation helper ────────────────────────────────────────
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Validation failed: ${messages}`);
  }
  return result.data;
}
