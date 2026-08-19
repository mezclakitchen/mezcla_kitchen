import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicFeaturedProducts } from "@/hooks/usePublicApi";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function PopularThisWeek() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data, isLoading } = usePublicFeaturedProducts(8);
  const featured: any[] = data?.data ?? [];

  return (
    <section className="bg-cocoa py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="From the kitchen"
            title="Customer Favourites"
            subtitle="A few of the things we love to make — and our regulars keep coming back for."
            dark
          />
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gold md:pb-3">
            Made fresh · Order 2–3 days prior
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-espresso border hairline animate-pulse h-72" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ivory-muted mb-6">Fresh bakes coming soon — ask us on WhatsApp!</p>
            <a href={generateWhatsAppLink(waMessages.menu)} target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center gap-2">
              <WhatsAppIcon className="size-4" />
              Ask for this week's menu
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

