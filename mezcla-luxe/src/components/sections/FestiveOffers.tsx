import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { usePublicProducts, usePublicHomepageContent } from "@/hooks/usePublicApi";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export function FestiveOffers() {
  const { data: homeData, isLoading: settingsLoading } = usePublicHomepageContent();
  const settings = homeData?.data ?? {};

  // Fetch products tagged as festive
  const { data, isLoading } = usePublicProducts({ tag: "festive", limit: 4 });
  const items: any[] = data?.data ?? [];

  // Hide section completely if explicitly disabled in admin dashboard
  if (settings.festive_enabled === "false") {
    return null;
  }

  if (!isLoading && items.length === 0) {
    return null; // hide section if no special offers / hampers are created
  }

  const title = settings.festive_title || "Festive & Special Offers";
  const subtitle = settings.festive_subtitle || "Thoughtfully curated Hampers & Gifting options, handcrafted for celebrations and special occasions.";
  const ctaText = settings.festive_cta_text || "Explore Festive Edit";
  const ctaLink = settings.festive_cta_link || "/festive";

  return (
    <section className="bg-espresso text-cream py-24 md:py-32 border-b border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-luxe relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Limited Editions"
            title={title}
            subtitle={subtitle}
            dark
          />
          <Link
            to={ctaLink}
            className="group inline-flex items-center gap-2 text-gold text-sm tracking-widest uppercase font-bold md:pb-3 hover:text-cream transition-colors"
          >
            {ctaText}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-cocoa/40 border border-white/5 animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
