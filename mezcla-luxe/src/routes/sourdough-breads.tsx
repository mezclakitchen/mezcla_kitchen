import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProductsByCategory } from "@/hooks/usePublicApi";
import breads from "@/assets/cat-breads-new.jpg";

export const Route = createFileRoute("/sourdough-breads")({
  head: () => ({
    meta: [
      { title: "Sourdough Bread in Bangalore | Mezcla — Wednesday Bake" },
      {
        name: "description",
        content:
          "Long-fermented sourdough loaves available every Wednesday in Maida or Whole Wheat — Classic, Olive Rosemary Garlic, Cheddar Jalapeño, Turmeric Walnut & Pumpkin Seeds. Order by Monday.",
      },
      { property: "og:image", content: breads },
    ],
    links: [{ rel: "canonical", href: "/sourdough-breads" }],
  }),
  component: SourdoughBreadsPage,
});

function SourdoughBreadsPage() {
  const { data, isLoading } = usePublicProductsByCategory("sourdough-breads");
  const items: any[] = data?.data ?? [];
  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={breads} alt="" className="absolute inset-0 size-full object-cover opacity-40" width={1024} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/40" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Available every Wednesday</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Sourdough <span className="italic text-gold">Breads</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            Long-fermented, slow-crafted sourdough loaves available in Maida and Whole Wheat. Baked fresh every Wednesday — orders must be placed by Monday.
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
            <p className="text-center text-ink-muted py-12">Sourdough loaves coming soon — order by Monday for Wednesday bake!</p>
          )}
        </div>
      </section>
    </>
  );
}
