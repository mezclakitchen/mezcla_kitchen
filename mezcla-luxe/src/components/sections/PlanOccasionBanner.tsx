import { Link } from "@tanstack/react-router";

export function PlanOccasionBanner() {
  return (
    <section className="bg-cream text-ink py-24 md:py-32">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-3xl bg-cocoa text-cream min-h-[28rem] grid lg:grid-cols-2">
          <div className="relative">
            <img src="/product_photos/dips-platter/dips1.jpg" alt="Luxury grazing spread" loading="lazy" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/40 to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="relative p-10 md:p-16 flex flex-col justify-center">
            <p className="eyebrow">Curated Experiences</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
              <span className="italic text-gold">Celebrate, Gather & Create</span>
            </h2>
            <p className="mt-5 text-ivory-muted max-w-md leading-relaxed">
            Whether you're planning an intimate celebration, a corporate gathering, a beautifully styled grazing table or a hands-on pizza workshop, we create thoughtfully curated experiences centred around great food and meaningful connections.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/plan-event" className="btn-gold">Plan Your Event</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
