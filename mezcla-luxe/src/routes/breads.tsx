import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProductsByCategory } from "@/hooks/usePublicApi";
import breads from "@/assets/cat-breads.jpg";

export const Route = createFileRoute("/breads")({
  head: () => ({
    meta: [
      { title: "Artisan Breads in Bangalore | Mezcla" },
      { name: "description", content: "Slow-fermented sourdough (available every Wednesday), speciality sandwich breads, focaccia, pita, kulcha, baguette and more — freshly baked in small batches in Bangalore." },
      { property: "og:image", content: breads },
    ],
    links: [{ rel: "canonical", href: "/breads" }],
  }),
  component: BreadsPage,
});

function BreadsPage() {
  const { data, isLoading } = usePublicProductsByCategory("breads");
  const items: any[] = data?.data ?? [];
  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={breads} alt="" className="absolute inset-0 size-full object-cover opacity-40" width={1024} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/40" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Made the slow way</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Artisan <span className="italic text-gold">breads</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            Long-fermented sourdough (available every Wednesday) and a range of speciality breads — Japanese milk bread, focaccia, pita, kulcha, baguette and more. All baked fresh to order.
          </p>
        </div>
      </section>
      <section className="bg-cream text-ink py-16">
        <div className="container-luxe">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-border shadow-soft animate-pulse h-80" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-center text-ink-muted py-12">More breads coming soon!</p>
          )}
        </div>
      </section>
    </>
  );
}

