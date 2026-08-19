import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs as localFaqs } from "@/data/faq";
import { usePublicFaqs } from "@/hooks/usePublicApi";

export function FAQSection({ 
  dark = false, 
  category,
  customFaqs,
  title = <>Frequently <br /> <span className="italic">asked.</span></>,
  subtitle = "Everything you need to know about ordering from Mezcla—from handcrafted breads and desserts to grazing tables, workshops and deliveries across Bangalore. If your question isn't answered below, we're just a message away",
}: { 
  dark?: boolean; 
  category?: string;
  customFaqs?: { q: string; a: string }[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const { data } = usePublicFaqs(category);
  const apiItems: any[] = data?.data ?? [];

  // Use customFaqs if provided, else API, else local default
  const items = customFaqs 
    ? customFaqs
    : apiItems.length > 0
      ? apiItems.map((f: any) => ({ q: f.question, a: f.answer }))
      : localFaqs;

  return (
    <section className={`${dark ? "bg-cocoa border-t border-white/5" : "bg-cream text-ink border-t border-ink/5"} py-24 md:py-32`}>
      {/* AEO FAQ Schema */}
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.a,
                },
              })),
            }),
          }}
        />
      )}
      <div className="container-luxe">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24 items-start">
          
          {/* Header Side - Sticky on desktop */}
          <div className="lg:sticky lg:top-32">
            {/* <p className={`eyebrow ${dark ? "!text-gold" : "!text-gold-deep"}`}>Good To Know</p> */}
            <h2 className={`mt-4 font-display text-4xl md:text-5xl lg:text-6xl ${dark ? "text-cream" : "text-ink"} leading-[1.1]`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`mt-6 text-sm md:text-base leading-relaxed max-w-sm ${dark ? "text-ivory-muted/90" : "text-ink/60"}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Accordion Side */}
          <div className="flex flex-col border-t border-white/5">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div 
                  key={i} 
                  className={`group border-b ${dark ? "border-white/10" : "border-ink/10"} overflow-hidden`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full py-8 flex items-center justify-between gap-6 text-left transition-colors duration-300 outline-none"
                  >
                    <span className={`font-display text-xl md:text-2xl transition-colors duration-300 ${isOpen ? (dark ? "text-gold" : "text-gold-deep") : (dark ? "text-cream group-hover:text-gold" : "text-ink group-hover:text-gold-deep")}`}>
                      {f.q}
                    </span>
                    <div className={`p-2 rounded-full border transition-all duration-300 shrink-0 ${isOpen ? (dark ? "border-gold text-gold bg-gold/10" : "border-gold-deep text-gold-deep bg-gold-deep/10") : (dark ? "border-white/10 text-white/50 group-hover:border-gold/50 group-hover:text-gold/50" : "border-ink/10 text-ink/50 group-hover:border-gold-deep/50 group-hover:text-gold-deep/50")}`}>
                      {isOpen ? <Minus className="size-4" strokeWidth={1.5} /> : <Plus className="size-4" strokeWidth={1.5} />}
                    </div>
                  </button>
                  <div 
                    className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className={`overflow-hidden text-sm md:text-base leading-relaxed ${dark ? "text-ivory-muted/90" : "text-ink/70"}`}>
                      <p className="max-w-2xl pt-2">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}

