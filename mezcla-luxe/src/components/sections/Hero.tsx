import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, Wheat, Sprout, Gift } from "lucide-react";
import heroDipsImg from "@/assets/hero/hero-dips.jpg";
import heroHummusImg from "@/assets/hero/hero-hummus.jpg";
import heroPestoImg from "@/assets/hero/hero-pesto.jpg";
import { waMessages, site } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { usePublicHomepageContent } from "@/hooks/usePublicApi";

export function Hero() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data: homepageData } = usePublicHomepageContent();
  const homepage = homepageData?.data || {};
  
  // We use our custom 3-image layout instead of the single CMS image

  return (
    <section className="relative overflow-hidden">
      <div className="container-luxe relative grid lg:grid-cols-12 gap-12 lg:gap-8 pt-8 lg:pt-10 pb-24 lg:pb-32">
        <div className="lg:col-span-6 flex flex-col justify-center relative z-10">
          <p className="eyebrow reveal">HANDCRAFTED • EGGLESS • MADE IN BANGALORE</p>
          <h1 className="reveal reveal-delay-1 mt-6 font-display text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1] text-cream">
            {homepage.hero_title || "Every gathering ,"}
            <span className="block italic text-gold">{homepage.hero_subtitle || "deserves good food."}</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-7 max-w-xl text-base md:text-lg leading-relaxed text-ivory-muted">
            At Mezcla, we create handcrafted breads, celebration cakes, artisanal desserts and beautifully curated grazing experiences. Everything is made fresh to order in small batches using thoughtfully sourced ingredients—because memorable moments deserve memorable food.
          </p>

          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-3">
            <a
              href={generateWhatsAppLink(waMessages.menu)}
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
            >
              <WhatsAppIcon className="size-4" />
              {homepage.hero_cta_primary || "See Menu on WhatsApp"}
            </a>
            <Link to="/grazing-tables" className="btn-ghost-gold">
              {homepage.hero_cta_secondary || "Plan a Grazing Table"}
            </Link>
          </div>

        </div>

        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-[65vh] lg:h-[75vh] min-h-[400px]">
            {/* Main Image (DIPS) */}
            <div className="row-span-2 relative overflow-hidden rounded-3xl border hairline shadow-luxe group">
              <img
                src={heroDipsImg}
                alt="Dips Platter"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-transparent to-transparent opacity-70" />
              
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <div className="glass-dark inline-flex rounded-2xl pl-3 pr-5 py-2.5 items-center gap-3 shadow-xl backdrop-blur-md border-l-2 border-gold/50 transition-transform group-hover:translate-x-2">
                  <span className="grid place-items-center size-9 rounded-full bg-gold/10 text-gold shrink-0">
                    <Wheat strokeWidth={1.5} className="size-4" />
                  </span>
                  <span className="text-[0.7rem] sm:text-[0.75rem] uppercase tracking-widest text-cream font-semibold">100% Artisan Made</span>
                </div>
              </div>
            </div>

            {/* Top Right Image (HUMMUS) */}
            <div className="relative overflow-hidden rounded-3xl border hairline shadow-luxe group">
              <img
                src={heroHummusImg}
                alt="Hummus"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="glass-dark inline-flex rounded-2xl pl-2.5 pr-4 py-2 items-center gap-2.5 shadow-xl backdrop-blur-md border-l-2 border-gold/50 transition-transform group-hover:translate-x-2">
                  <span className="grid place-items-center size-7 sm:size-8 rounded-full bg-gold/10 text-gold shrink-0">
                    <Sprout strokeWidth={1.5} className="size-3.5 sm:size-4" />
                  </span>
                  <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest text-cream font-semibold">Fresh Ingredients</span>
                </div>
              </div>
            </div>

            {/* Bottom Right Image (PESTO) */}
            <div className="relative overflow-hidden rounded-3xl border hairline shadow-luxe group">
              <img
                src={heroPestoImg}
                alt="Pesto"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="glass-dark inline-flex rounded-2xl pl-2.5 pr-4 py-2 items-center gap-2.5 shadow-xl backdrop-blur-md border-l-2 border-gold/50 transition-transform group-hover:translate-x-2">
                  <span className="grid place-items-center size-7 sm:size-8 rounded-full bg-gold/10 text-gold shrink-0">
                    <Gift strokeWidth={1.5} className="size-3.5 sm:size-4" />
                  </span>
                  <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest text-cream font-semibold">Curated Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
