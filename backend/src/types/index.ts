/**
 * TypeScript types derived from database schema
 * Run: npm run db:types  to regenerate from live Supabase
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  image_url: string | null;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  tags: string[];
  meta_title: string | null;
  meta_desc: string | null;
  schema_data: object | null;
  created_at: string;
  updated_at: string;
  // Joined
  categories?: Pick<Category, 'name' | 'slug'> | null;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  items: OrderItem[];
  subtotal: number | null;
  discount: number;
  delivery_charge: number;
  cgst_pct: number;
  sgst_pct: number;
  cgst_amount: number | null;
  sgst_amount: number | null;
  total: number | null;
  status: 'pending' | 'paid' | 'partially_paid' | 'cancelled';
  payment_method: string | null;
  notes: string | null;
  invoice_pdf_url: string | null;
  whatsapp_sent: boolean;
  whatsapp_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppLog {
  id: string;
  type: 'invoice' | 'promotion' | 'reminder';
  recipient: string;
  message: string | null;
  status: 'pending' | 'sent' | 'failed' | 'partial';
  order_id: string | null;
  sent_at: string | null;
  error: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string; url: string; caption: string | null; category: string | null; sort_order: number; created_at: string;
}
export interface HomepageContent {
  id: string; key: string; value: string | null; type: string;
}
export interface ContactInfo {
  id: string; key: string; value: string;
}
export interface Announcement {
  id: string; text: string; is_active: boolean; sort_order: number; created_at: string;
}
export interface Testimonial {
  id: string; name: string; location: string | null; rating: number; text: string; is_active: boolean; created_at: string;
}
export interface FAQ {
  id: string; question: string; answer: string; category: string | null; sort_order: number; is_active: boolean;
}

// Supabase Database type (used for typed clients)
export interface Database {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category>; Relationships: any[] };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product>; Relationships: any[] };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order>; Relationships: any[] };
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer>; Relationships: any[] };
      whatsapp_logs: { Row: WhatsAppLog; Insert: Partial<WhatsAppLog>; Update: Partial<WhatsAppLog>; Relationships: any[] };
      gallery: { Row: GalleryItem; Insert: Partial<GalleryItem>; Update: Partial<GalleryItem>; Relationships: any[] };
      homepage_content: { Row: HomepageContent; Insert: Partial<HomepageContent>; Update: Partial<HomepageContent>; Relationships: any[] };
      contact_info: { Row: ContactInfo; Insert: Partial<ContactInfo>; Update: Partial<ContactInfo>; Relationships: any[] };
      announcements: { Row: Announcement; Insert: Partial<Announcement>; Update: Partial<Announcement>; Relationships: any[] };
      testimonials: { Row: Testimonial; Insert: Partial<Testimonial>; Update: Partial<Testimonial>; Relationships: any[] };
      faqs: { Row: FAQ; Insert: Partial<FAQ>; Update: Partial<FAQ>; Relationships: any[] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
