import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProductsByCategory } from "@/hooks/usePublicApi";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import cake from "@/assets/p-cake.jpg";

export const Route = createFileRoute("/cakes")({
  head: () => ({
    meta: [
      { title: "Custom Celebration Cakes in Bangalore | Mezcla" },
      {
        name: "description",
        content:
          "Handcrafted eggless celebration cakes using premium ingredients — no artificial colours or flavouring. Custom flavours, homemade fruit compotes and couverture chocolate. Made to order in Bangalore.",
      },
      { property: "og:image", content: cake },
    ],
    links: [{ rel: "canonical", href: "/cakes" }],
  }),
  component: CakesPage,
});

function CakesPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data, isLoading } = usePublicProductsByCategory("cakes");
  const items: any[] = data?.data ?? [];
  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={cake} alt="" className="absolute inset-0 size-full object-cover opacity-30" width={1024} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/40" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Handcrafted & Eggless</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Celebration <span className="italic text-gold">Cakes</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            From elegant minimal cakes to fully customised celebration cakes — crafted with premium ingredients and natural flavours. No artificial colours. No shortcuts. Flavour comes first, always.
          </p>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="bg-cocoa/5 border-y border-border py-10">
        <div className="container-luxe max-w-3xl text-center">
          <p className="font-display text-lg md:text-2xl text-ink leading-relaxed">
            "Our cakes are made with real ingredients — homemade fruit compotes, couverture chocolate and fresh seasonal produce. Every cake is designed to let the ingredients shine."
          </p>
          <a
            href={generateWhatsAppLink("Hi! I'd like to inquire about a custom celebration cake from Mezcla. Could you share more details?")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Enquire About a Custom Cake →
          </a>
        </div>
      </section>

      <section className="bg-cream text-ink py-16">
        <div className="container-luxe">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-border shadow-soft animate-pulse h-80" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-ink-muted">Share your vision with us and we'll bring it to life.</p>
              <a
                href={generateWhatsAppLink("Hi! I'd like to order a custom celebration cake from Mezcla.")}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cocoa text-cream text-sm font-medium hover:opacity-90 transition"
              >
                WhatsApp Us →
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
