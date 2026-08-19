import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProductsByCategory } from "@/hooks/usePublicApi";
import bakes from "@/assets/cat-bakes-new.jpg";

export const Route = createFileRoute("/seasonal-special")({
  head: () => ({
    meta: [
      { title: "Seasonal Specials in Bangalore | Mezcla" },
      { name: "description", content: "Limited seasonal creations—handcrafted fresh each season with the finest ingredients. Available for a short time only." },
      { property: "og:image", content: bakes },
    ],
    links: [{ rel: "canonical", href: "/seasonal-special" }],
  }),
  component: SeasonalSpecialPage,
});

function SeasonalSpecialPage() {
  const { data, isLoading } = usePublicProductsByCategory("seasonal-special");
  const items: any[] = data?.data ?? [];
  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={bakes} alt="" className="absolute inset-0 size-full object-cover opacity-40" width={1024} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/40" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Limited Edition</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Seasonal <span className="italic text-gold">Specials</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            Limited seasonal creations—handcrafted fresh each season with the finest ingredients. Available for a short time only, so don't miss out.
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
            <p className="text-center text-ink-muted py-12">New seasonal specials coming soon—check back shortly!</p>
          )}
        </div>
      </section>
    </>
  );
}
