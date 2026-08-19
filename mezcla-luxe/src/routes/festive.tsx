import { createFileRoute } from "@tanstack/react-router";
import festive from "@/assets/festive-hero.jpg";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { SubscribeSection } from "@/components/sections/SubscribeSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Sparkles, CalendarHeart, Gift, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/festive")({
  head: () => ({
    meta: [
      { title: "Festive Hampers & Limited Editions | Mezcla Bangalore" },
      { name: "description", content: "Small-batch festive hampers and gifting for Diwali, Christmas, Eid, New Year and wedding season. Reserve early — 3–4 weeks lead time for bulk." },
      { property: "og:image", content: festive },
    ],
    links: [{ rel: "canonical", href: "/festive" }],
  }),
  component: FestivePage,
});

function FestivePage() {
  const { generateWhatsAppLink } = useWhatsApp();
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-espresso overflow-hidden min-h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          {/* Left: dark gradient to blend text */}
          <div className="hidden lg:block bg-gradient-to-r from-espresso via-espresso/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-espresso/80 lg:hidden z-10" />
          
          {/* Right: Image */}
          <div className="absolute inset-0 lg:left-[40%]">
            <img
              src={festive}
              alt="Festive luxury hampers"
              className="size-full object-cover opacity-50 lg:opacity-90"
            />
            {/* Soft fade on the edge */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-espresso to-transparent" />
          </div>
        </div>

        <div className="container-luxe relative z-20 w-full pt-40 pb-24 lg:py-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
              <Sparkles className="size-3" />
              The Festive Edit
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
              Limited editions <br />
              <span className="italic text-gold font-light">for festive moments.</span>
            </h1>
            
            <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Released in small batches each season — Diwali, Christmas, Eid, New Year and
              wedding season. Designed to be remembered.
            </p>
            
            <div className="mt-12 flex flex-wrap gap-4">
              <a href={generateWhatsAppLink(waMessages.menu)} target="_blank" rel="noreferrer" className="px-8 py-4 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-cream transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                Request Festive Menu <ArrowRight className="size-4" strokeWidth={2} />
              </a>
              <a href="#editions" className="px-8 py-4 border border-white/20 text-cream hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-xs rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                View Editions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-cocoa border-b border-white/5 relative z-30">
        <div className="container-luxe py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:p-8 md:p-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-0">
              <Sparkles className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />
              <p className="font-display text-2xl text-cream mb-1">Small Batches</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">Artisanal Production</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 pt-10 md:pt-0">
              <CalendarHeart className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />
              <p className="font-display text-2xl text-cream mb-1">Seasonal</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">Curated Drops</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 pt-10 md:pt-0">
              <Gift className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />
              <p className="font-display text-2xl text-cream mb-1">50 MOQ</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">Bulk & Corporate</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 pt-10 md:pt-0">
              <Clock className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />
              <p className="font-display text-2xl text-cream mb-1">3–4 Weeks</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">Volume Lead Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Editions */}
      <section id="editions" className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeader eyebrow="This Season" title="Featured festive collections." align="center" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              ["Diwali Glow", "Truffles, dry fruits, a small bake, considered card."],
              ["Christmas Velvet", "Brownies, granola jar, hot-cocoa mix, hand-tied."],
              ["Eid Mubarak", "Sweet & savoury jars, dates, a personal note."],
              ["New Year Noir", "A dark, refined edit for quiet new-year wishes."],
              ["Wedding Welcome", "Per-guest welcome boxes — bulk pricing."],
              ["Corporate Festive", "Branded, scalable, MOQ 50 · 3–4 weeks lead time."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-3xl bg-white border border-border p-6 sm:p-8 md:p-10 shadow-soft hover:shadow-xl hover:border-gold-deep/30 transition-all duration-500 group flex flex-col justify-between">
                <div>
                  <p className="inline-block px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold uppercase tracking-widest text-gold-deep mb-6">Edition 0{i + 1}</p>
                  <h3 className="font-display text-2xl text-ink group-hover:text-gold-deep transition-colors">{t}</h3>
                  <p className="mt-4 text-ink-muted leading-relaxed">{d}</p>
                </div>
                <a
                  href={generateWhatsAppLink(`Hi Mezcla, I'd love to know more about the ${t} hamper.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 px-6 py-3 bg-gold-deep text-white font-bold uppercase tracking-widest text-[0.65rem] rounded-full shadow-md hover:bg-ink hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2 w-fit"
                >
                  Enquire Now <ArrowRight className="size-3" strokeWidth={2} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SubscribeSection />
      <FAQSection />
    </>
  );
}
