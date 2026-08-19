import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProducts, usePublicCategories } from "@/hooks/usePublicApi";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Menu — Sourdough, Speciality Breads, Dips & Bakes | Mezcla Bangalore" },
      {
        name: "description",
        content:
          "Sourdough breads (available every Wednesday), speciality breads, handcrafted dips & mezze, artisan bakes & desserts, and celebration cakes — made fresh in our Bangalore kitchen. Order 2–3 days in advance on WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "sourdough bread Bangalore, speciality bread Bangalore, hummus Bangalore, pesto Bangalore, Korean cream cheese buns Bangalore, quiche Bangalore, celebration cake Bangalore, artisan bakery Bangalore, fresh dips Bangalore",
      },
      { property: "og:title", content: "Mezcla Menu — Artisan Breads, Dips & Bakes, Bangalore" },
      { property: "og:description", content: "Sourdough (Wed bake), speciality breads, mezze dips, artisan bakes and celebration cakes — handcrafted in Bangalore. Order on WhatsApp." },
    ],
    links: [{ rel: "canonical", href: "https://mezclakitchen.in/products" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Mezcla Menu",
          "description": "Sourdough breads, speciality breads, handcrafted dips & mezze, artisan bakes & desserts, and celebration cakes.",
          "url": "https://mezclakitchen.in/products",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "item": { "@type": "Product", "name": "Sourdough Bread" } },
            { "@type": "ListItem", "position": 2, "item": { "@type": "Product", "name": "Speciality Bread" } },
            { "@type": "ListItem", "position": 3, "item": { "@type": "Product", "name": "Other Bakes & Desserts" } },
            { "@type": "ListItem", "position": 4, "item": { "@type": "Product", "name": "Handcrafted Dips & Mezze" } },
            { "@type": "ListItem", "position": 5, "item": { "@type": "Product", "name": "Cakes" } }
          ]
        }),
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const [active, setActive] = useState<string>("all");

  const { data: catData } = usePublicCategories();
  const { data: prodData, isLoading } = usePublicProducts(
    active === "all" ? { limit: 100 } : { category: active, limit: 100 }
  );

  const categories = (catData?.data ?? []).filter((c: any) => 
    !["hampers", "grazing-tables", "catering"].includes(c.slug)
  );
  const filters = [
    { label: "All", slug: "all" },
    ...categories.map((c: any) => ({ label: c.name, slug: c.slug }))
  ];

  const visible: any[] = prodData?.data ?? [];

  return (
    <>
      <section className="bg-cocoa pt-16 pb-12 border-b hairline">
        <div className="container-luxe max-w-3xl">
          <p className="eyebrow">Our menu</p>
          <h1 className="mt-5 font-display text-4xl sm:text-4xl md:text-6xl text-cream leading-tight">
            What we're <span className="italic text-gold">making</span> this week.
          </h1>
          <p className="mt-5 text-ivory-muted text-base md:text-lg leading-relaxed">
            Sourdough breads, speciality loaves, handcrafted dips, artisan bakes and celebration cakes — made fresh in our Bangalore kitchen. Sourdough available every Wednesday; order by Monday.
          </p>
        </div>
      </section>

      <section className="bg-cream text-ink py-12 md:py-16">
        <div className="container-luxe">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => setActive(f.slug)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-colors ${
                    active === f.slug
                      ? "bg-cocoa text-cream border-cocoa"
                      : "border-border hover:border-cocoa"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <a
              href={generateWhatsAppLink(waMessages.menu)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-cocoa underline underline-offset-4 hover:text-gold-deep"
            >
              Ask for this week's menu →
            </a>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-border shadow-soft animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {visible.length === 0 && (
                <p className="text-center text-ink-muted py-16">
                  Nothing in this category yet — drop us a WhatsApp, we may have it on our weekly bake.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
