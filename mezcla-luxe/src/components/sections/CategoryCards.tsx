import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { categories } from "@/data/categories";

export function CategoryCards() {
  return (
    <section className="bg-cream text-ink py-24 md:py-32">
      <div className="container-luxe">
        <SectionHeader
          eyebrow="What we make"
          title="Crafted for everyday moments and special occasions. "
          subtitle="From naturally fermented sourdough and handcrafted desserts to celebration cakes, grazing tables and seasonal catering, every order is made fresh in our artisanal kitchen in Bangalore."
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={c.to}
              className="group relative overflow-hidden rounded-3xl bg-cocoa aspect-[4/5] block"
            >
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={1024}
                height={1280}
                className={`absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out ${c.imageClassName || "object-center group-hover:scale-110"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/40 to-transparent" />
              <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-end text-cream">
                <p className="eyebrow">{c.eyebrow}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-ivory-muted max-w-xs leading-relaxed">
                  {c.sub}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-gold text-sm tracking-wide">
                  {c.cta}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/products" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 shadow-xl shadow-gold/10">
            View Full Menu
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
