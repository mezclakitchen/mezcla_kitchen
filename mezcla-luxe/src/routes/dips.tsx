import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProductsByCategory } from "@/hooks/usePublicApi";
import dips from "@/assets/cat-dips.jpg";

export const Route = createFileRoute("/dips")({
  head: () => ({
    meta: [
      { title: "Fresh Hummus, Muhammara & Mezze Dips in Bangalore | Mezcla" },
      { name: "description", content: "Small-batch hummus, muhammara and seasonal mezze dips — jarred fresh, delivered in Bangalore." },
      { property: "og:image", content: dips },
    ],
    links: [{ rel: "canonical", href: "/dips" }],
  }),
  component: DipsPage,
});

function DipsPage() {
  const { data, isLoading } = usePublicProductsByCategory("dips");
  const items: any[] = data?.data ?? [];
  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={dips} alt="" className="absolute inset-0 size-full object-cover opacity-40" width={1024} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/40" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Freshly jarred · EVOO only</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Dips &amp; <span className="italic text-gold">mezze</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            Freshly prepared in small batches using only Extra Virgin Olive Oil. Hummus, muhammara, Italian basil pesto, tzatziki, labneh and onion balsamic jam — perfect for grazing boards, sandwiches, pastas or warm bread.
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
            <p className="text-center text-ink-muted py-12">More dips coming soon!</p>
          )}
        </div>
      </section>
    </>
  );
}
