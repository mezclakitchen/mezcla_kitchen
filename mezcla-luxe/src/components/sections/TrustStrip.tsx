import { Sprout, BadgeCheck, Flame } from "lucide-react";

const items = [
  { 
    icon: Flame, 
    title: "Small Batches, Always Fresh", 
    desc: "Nothing is pre-made or held over. Every loaf, cake and grazing spread is prepared after you order, in limited batches, so quality never gets stretched thin." 
  },
  { 
    icon: Sprout, 
    title: "Ingredients We Stand Behind", 
    desc: "Couverture chocolate, extra virgin olive oil, fresh herbs, quality cheeses. We choose ingredients for flavour first; we avoid shortcuts." 
  },
  { 
    icon: BadgeCheck, 
    title: "100% Eggless, FSSAI Licensed", 
    desc: "Every item at Mezcla is eggless and vegetarian, made in an FSSAI-licensed kitchen. Trusted for birthdays, everyday orders and events alike." 
  }
];

export function TrustStrip() {
  return (
    <section className="bg-espresso border-y hairline py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-luxe grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
        {items.map((i, index) => (
          <div 
            key={i.title}
            className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-cocoa/40 border border-white/15 hover:border-white/30 shadow-sm"
          >
            <div className="p-4 bg-cocoa/80 rounded-full mb-6 ring-1 ring-gold/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <i.icon className="size-7 text-gold" strokeWidth={1.5} />
            </div>
            <h4 className="font-display text-2xl text-cream mb-4 tracking-wide">{i.title}</h4>
            {i.desc && (
              <p className="text-sm text-ivory-muted/80 leading-relaxed max-w-[280px]">
                {i.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
