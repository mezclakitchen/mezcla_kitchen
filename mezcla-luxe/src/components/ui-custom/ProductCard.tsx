import { Flame, Star, Clock, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import type { Product } from "@/data/products";
import { ImageCarousel } from "@/components/ui-custom/ImageCarousel";
import { useState } from "react";
import { publicProductsApi } from "@/lib/api";

// Variant shape returned from API
export interface ProductVariant {
  name: string;
  price?: number | null;
  price_label?: string | null;
}

// Flexible product type: accepts both the local Product shape and API response shape
export type ProductLike = Product | {
  id: string;
  name: string;
  category?: string;
  category_slug?: string;
  price?: number | string | null;
  price_label?: string | null;
  image?: string;
  image_url?: string | null;
  images?: string[];
  blurb?: string;
  description?: string | null;
  tag?: string;
  tags?: string[];
  prep?: string;
  diet?: string[];
  is_available?: boolean;
  available?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  variants?: ProductVariant[];
  enquiries_count?: number;
};

/** Normalize an API or local product to display-ready values */
function normalise(p: ProductLike) {
  // Price display: prefer price_label if set, otherwise format numeric price
  const rawPrice = (p as any).price;
  const priceLabel = (p as any).price_label;
  const showPrice = (p as any).show_price !== false; // default to showing price

  let displayPrice: string | null = null;
  if (showPrice) {
    if (priceLabel && String(priceLabel).trim()) {
      displayPrice = String(priceLabel).trim();
    } else if (rawPrice != null && rawPrice !== "") {
      displayPrice = `₹${Number(rawPrice).toLocaleString("en-IN")}`;
    }
  }

  const variants: ProductVariant[] = Array.isArray((p as any).variants) ? (p as any).variants : [];

  return {
    id: p.id,
    name: p.name,
    category: (p as any).category ?? (p as any).category_slug ?? "",
    displayPrice,
    showPrice,
    rawPrice,
    image: (p as any).image ?? (p as any).image_url ?? "",
    images: Array.isArray((p as any).images) ? (p as any).images : [],
    blurb: (p as any).blurb ?? (p as any).description ?? "",
    tag: (p as any).tag ?? undefined,
    prep: (p as any).prep ?? "Made fresh · Order 2–3 days prior",
    diet: (p as any).diet ?? (p as any).tags ?? [],
    isFeatured: (p as any).is_featured ?? false,
    sortOrder: (p as any).sort_order ?? 0,
    variants,
    enquiriesCount: (p as any).enquiries_count ?? 0,
  };
}

/**
 * Generates a deterministic but realistic-looking "orders this week" number
 * based on the product's sort order (lower = more popular = higher count).
 * This makes featured items look realistically popular without a real analytics DB.
 */
function getOrderCount(sortOrder: number, isFeatured: boolean): number {
  const base = isFeatured ? 20 : 8;
  const variation = ((sortOrder * 7 + 13) % 11); // deterministic pseudo-random
  return Math.max(3, base - variation);
}

/**
 * Returns how long ago (in a friendly format) this "order" was placed.
 * Creates social proof without a real orders table.
 */
const RECENT_MESSAGES = [
  "Ordered 2 hours ago",
  "3 people ordered today",
  "Last ordered 4 hours ago",
  "Ordered this morning",
  "2 people ordered yesterday",
  "Trending this week",
  "5 orders placed today",
];
function getRecentMessage(id: string): string {
  // Deterministic selection based on product id
  const idx = id.charCodeAt(0) % RECENT_MESSAGES.length;
  return RECENT_MESSAGES[idx];
}

const PRODUCT_CAROUSEL_IMAGES: Record<string, string[]> = {
  "biscuits": [
    "/product_photos/biscuits/biscuits1.jpg",
    "/product_photos/biscuits/biscuits2.jpg"
  ],
  "bread loaf": [
    "/product_photos/bread-loaf/bread_loaf1.jpg",
    "/product_photos/bread-loaf/bread_loaf2.jpg",
    "/product_photos/bread-loaf/bread_loaf3.jpg",
    "/product_photos/bread-loaf/bread_loaf4.jpg",
    "/product_photos/bread-loaf/bread_loaf5.jpg",
    "/product_photos/bread-loaf/_dsc5736.jpg"
  ],
  "cheese berliner": [
    "/product_photos/cheese-berliner/cheese_berliner1.jpg",
    "/product_photos/cheese-berliner/cheese_berliner2.jpg",
    "/product_photos/cheese-berliner/cheese_berliner3.jpg",
    "/product_photos/cheese-berliner/cheese_berliner4.jpg",
    "/product_photos/cheese-berliner/cheese_berliner5.jpg"
  ],
  "chocolate berliner": [
    "/product_photos/chocolate_berliner/chocolate_berliner1-2.jpg",
    "/product_photos/chocolate_berliner/chocolate_berliner1.jpg",
    "/product_photos/chocolate_berliner/chocolate_berliner2.jpg",
    "/product_photos/chocolate_berliner/chocolate_berliner3.jpg",
    "/product_photos/chocolate_berliner/chocolate_berliner4.jpg",
    "/product_photos/chocolate_berliner/_dsc5825.jpg"
  ],
  "dips platter": [
    "/product_photos/dips-platter/dips1.jpg"
  ],
  "focaccia": [
    "/product_photos/focaccia/focaccia1.jpg",
    "/product_photos/focaccia/focaccia2.jpg",
    "/product_photos/focaccia/focaccia3.jpg",
    "/product_photos/focaccia/_dsc5958.jpg"
  ],
  "hummus": [
    "/product_photos/hummus/hummus1.jpg",
    "/product_photos/hummus/hummus2.jpg",
    "/product_photos/hummus/hummus3.jpg",
    "/product_photos/hummus/hummus4.jpg"
  ],
  "korean": [
    "/product_photos/kbuns/kbuns1.jpg",
    "/product_photos/kbuns/kbuns2.jpg",
    "/product_photos/kbuns/kbuns3.jpg",
    "/product_photos/kbuns/kbuns4.jpg",
    "/product_photos/kbuns/kbuns5.jpg",
    "/product_photos/kbuns/kbuns6.jpg",
    "/product_photos/kbuns/kbuns7.jpg"
  ],
  "mango berliner": [
    "/product_photos/mango_berliner/mango_berliner1.jpg",
    "/product_photos/mango_berliner/mango_berliner2.jpg",
    "/product_photos/mango_berliner/_dsc5904.jpg"
  ],
  "mango jar": [
    "/product_photos/mango_jar_cake/mango_jar_cake1(1).jpg",
    "/product_photos/mango_jar_cake/mango_jar_cake1.jpg",
    "/product_photos/mango_jar_cake/mango_jar_cake2.jpg",
    "/product_photos/mango_jar_cake/mango_jar_cake3.jpg",
    "/product_photos/mango_jar_cake/_dsc5869-2.jpg"
  ],
  "muhammara": [
    "/product_photos/muhammara/muhammara1.jpg",
    "/product_photos/muhammara/muhammara2.jpg",
    "/product_photos/muhammara/muhammara3.jpg"
  ],
  "pesto": [
    "/product_photos/pesto/pesto1.jpg",
    "/product_photos/pesto/pesto2.jpg"
  ],
  "quiche": [
    "/product_photos/quiche/quiche1.jpg",
    "/product_photos/quiche/quiche2.jpg",
    "/product_photos/quiche/quiche3.jpg",
    "/product_photos/quiche/quiche4.jpg",
    "/product_photos/quiche/quiche5.jpg",
    "/product_photos/quiche/quiche6.jpg",
    "/product_photos/quiche/quiche7.jpg",
    "/product_photos/quiche/quiche8.jpg"
  ],
  "sourdough": [
    "/product_photos/sourdough/sourdough1.jpg",
    "/product_photos/sourdough/sourdough3.jpg",
    "/product_photos/sourdough/sourdough4.jpg",
    "/product_photos/sourdough/sourdough5.jpg",
    "/product_photos/sourdough/sourdough6.jpg",
    "/product_photos/sourdough/sourdough8.jpg",
    "/product_photos/sourdough/_dsc5593-enhanced-nr.jpg",
    "/product_photos/sourdough/_dsc5659-2.jpg",
    "/product_photos/sourdough/_dsc5677-2.jpg",
    "/product_photos/sourdough/_dsc5677.jpg"
  ]
};

function getCarouselImagesForProduct(productName: string): string[] | null {
  const name = productName.toLowerCase();
  for (const [key, images] of Object.entries(PRODUCT_CAROUSEL_IMAGES)) {
    if (name.includes(key) && images.length > 1) {
      return images;
    }
  }
  return null;
}

export function ProductCard({ product }: { product: ProductLike }) {
  const { generateWhatsAppLink } = useWhatsApp();
  const p = normalise(product);
  
  // Directly use the actual count
  const displayEnquiriesCount = p.enquiriesCount || 0;
  
  const recentMsg = getRecentMessage(p.id);
  
  // Prefer database gallery images, fallback to hardcoded
  let carouselImages = getCarouselImagesForProduct(p.name);
  if (p.images && p.images.length > 0) {
    const allImages = [p.image, ...p.images].filter(Boolean);
    if (allImages.length > 1) {
      carouselImages = allImages;
    }
  }

  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    p.variants.length > 0 ? p.variants[0] : null
  );

  // Compute displayed price based on selected variant or base price
  function getDisplayedPrice(): string | null {
    if (!p.showPrice) return null;
    if (selectedVariant) {
      if (selectedVariant.price_label?.trim()) return selectedVariant.price_label.trim();
      if (selectedVariant.price != null) return `₹${Number(selectedVariant.price).toLocaleString("en-IN")}`;
    }
    return p.displayPrice;
  }

  // WhatsApp message: use variant-aware message if a variant is selected
  function getWhatsAppLink(): string {
    if (selectedVariant) {
      return generateWhatsAppLink(
        waMessages.productWithVariant(p.name, selectedVariant.name, selectedVariant.price)
      );
    }
    return generateWhatsAppLink(waMessages.product(p.name));
  }

  const shownPrice = getDisplayedPrice();

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-espresso border hairline transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden">
        {carouselImages ? (
          <ImageCarousel images={carouselImages} alt={p.name} />
        ) : p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-espresso flex items-center justify-center">
            <span className="text-ivory-muted/30 text-sm">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/20 to-transparent pointer-events-none z-20" />

        {/* Most Popular badge — only for featured products */}
        {p.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500/95 text-white text-[0.58rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg z-20">
            <Flame className="size-3 fill-white" />
            Most Popular
          </div>
        )}

        {/* Regular tag badge */}
        {p.tag && !p.isFeatured && (
          <span className="absolute top-4 left-4 eyebrow !text-cocoa bg-gold px-3 py-1 rounded-full !text-[0.6rem] z-20">
            {p.tag}
          </span>
        )}

        {/* Social proof ticker — bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <Clock className="size-3 text-gold shrink-0" />
          <span className="text-[0.6rem] text-cream/90 truncate">{recentMsg}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="eyebrow !text-gold/70 !text-[0.6rem]">{p.category}</p>
        <h3 className="mt-2 font-display text-xl text-cream leading-snug">
          {p.name}
        </h3>

        {/* Variant selector — shown when product has variants */}
        {p.variants.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.variants.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedVariant(v)}
                aria-pressed={selectedVariant?.name === v.name}
                className={`text-[0.62rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                  selectedVariant?.name === v.name
                    ? "bg-gold text-cocoa border-gold"
                    : "border-cream/20 text-ivory-muted hover:border-gold/50 hover:text-cream"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {/* Price — dynamic based on selected variant */}
        {shownPrice && (
          <p className="mt-2 font-display text-gold text-lg leading-none">
            {shownPrice}
          </p>
        )}

        <p className="mt-2 text-sm text-ivory-muted leading-relaxed line-clamp-2">
          {p.blurb}
        </p>

        {/* Enquiries count social proof */}
        {displayEnquiriesCount > 5 && (
          <div className="mt-3 flex items-center gap-1.5">
            <Users className="size-3.5 text-gold" />
            <span className="text-[0.65rem] text-ivory-muted/80">
              {displayEnquiriesCount} people enquired
            </span>
            {p.isFeatured && (
              <Star className="size-3 text-gold fill-gold ml-auto" />
            )}
          </div>
        )}

        {p.diet.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.diet.map((d: string) => (
              <span
                key={d}
                className="text-[0.6rem] uppercase tracking-widest px-2 py-0.5 rounded-full border hairline text-ivory-muted"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (p.id) publicProductsApi.enquire(p.id).catch(console.error);
            }}
            className="text-[0.68rem] font-bold uppercase tracking-widest text-cocoa bg-gold hover:bg-cream px-8 py-2.5 rounded-full shadow-md transition-colors"
          >
            {p.variants.length > 0 && selectedVariant
              ? `Order: ${selectedVariant.name} →`
              : "Enquire →"}
          </a>
        </div>
        <p className="mt-3 text-[0.68rem] text-ivory-muted/70 text-center">{p.prep}</p>
      </div>
    </article>
  );
}
