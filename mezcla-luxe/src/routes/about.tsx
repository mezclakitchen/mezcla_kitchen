import { createFileRoute, Link } from "@tanstack/react-router";
import grazing from "@/assets/cat-grazing-tables.jpg";
import chefPhoto from "@/assets/chef-monali.jpg";
import { waMessages, site as fallbackSite } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { usePublicContactInfo } from "@/hooks/usePublicApi";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Leaf, Clock, Heart, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mezcla — A Home Kitchen in Bangalore" },
      { name: "description", content: "Mezcla is a small Bangalore home kitchen baking sourdough, jarring fresh mezze and curating hampers and grazing tables for the people you love." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data } = usePublicContactInfo();
  const contact = data?.data ?? {};
  const fssai = contact.fssai || fallbackSite.fssai;
  const serviceAreas = contact.service_areas || fallbackSite.serviceAreas;

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
              src={grazing}
              alt="Inside the Mezcla kitchen"
              className="size-full object-cover opacity-50 lg:opacity-90"
            />
            {/* Soft fade on the edge */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-espresso to-transparent" />
          </div>
        </div>

        <div className="container-luxe relative z-20 w-full pt-40 pb-24 lg:py-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
              <Heart className="size-3" />
              Our Story
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
              A kitchen built <br />
              <span className="italic text-gold font-light">on intention.</span>
            </h1>
            
            <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              <em>Mezcla</em> means a mindful blend. Every loaf, every jar, and every hamper begins with a small idea: that food, when made with care, can hold a memory.
            </p>
            
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#founder" className="px-8 py-4 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                Read Our Story
              </a>
              <Link to="/contact" className="px-8 py-4 border border-white/20 text-cream hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-xs rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Say Hello
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER SECTION ═══ */}
      <section id="founder" className="bg-cocoa relative overflow-hidden border-b border-white/5">

        {/* Large background quote watermark */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 opacity-[0.03] pointer-events-none select-none pr-8">
          <span className="font-display text-[28rem] leading-none text-gold">"</span>
        </div>

        {/* ── TOP LABEL ── */}
        <div className="container-luxe pt-24 md:pt-32 pb-0 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold/30" />
            <p className="text-gold text-[0.65rem] font-bold uppercase tracking-[0.35em]">Meet the Founder</p>
            <div className="h-px w-12 bg-gold/30" />
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="container-luxe max-w-7xl relative z-10 mt-12 pb-24 md:pb-36">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-0 lg:gap-16 items-center">

            {/* ── LEFT: Photo ── */}
            <div className="relative flex justify-center lg:justify-start mb-12 lg:mb-0">
              {/* Subtle glow */}
              <div className="absolute -inset-6 rounded-[3rem] bg-gold/5 blur-3xl pointer-events-none" />

              <div className="relative w-full max-w-[380px] lg:max-w-none">
                {/* Photo */}
                <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
                  <img
                    src={chefPhoto}
                    alt="Monali Shah — Founder of Mezcla Kitchen"
                    className="w-full h-[560px] lg:h-[680px] object-cover object-top"
                  />
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cocoa/90 via-cocoa/40 to-transparent" />
                </div>

                {/* Name plate below the image */}
                <div className="mt-5 flex flex-col items-center text-center">
                  <p className="font-display text-2xl text-cream leading-tight">Monali Shah</p>
                  <div className="flex items-center justify-center gap-3 mt-1.5">
                    <div className="h-px w-6 bg-gold/60" />
                    <p className="text-gold text-[0.65rem] font-semibold uppercase tracking-[0.25em]">Founder · Mezcla Kitchen</p>
                    <div className="h-px w-6 bg-gold/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Story ── */}
            <div className="flex flex-col justify-center">

              {/* Headline */}
              <h2 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-cream leading-[1.08] tracking-tight mb-10">
                The story behind <br className="hidden lg:block" />
                <span className="italic text-gold font-light">every bite.</span>
              </h2>

              {/* Story paragraphs */}
              <div className="space-y-6 text-ivory-muted/85 leading-[1.85] text-base md:text-[1.05rem] font-light">
                <p>
                  Mezcla was founded by <span className="text-cream font-medium">Monali Shah</span>, a food entrepreneur who believes that great food has the power to bring people together and create meaningful memories.
                </p>
                <p>
                  After spending years in the corporate world, Monali found herself increasingly drawn to the creativity, connection, and joy that food brings into people's lives. What began as a passion for hosting and experimenting with flavours gradually evolved into Mezcla — a brand built around thoughtful food experiences, artisanal products, and beautifully curated gatherings.
                </p>
                <p>
                  Today, Monali combines her business acumen with her love for food to create experiences that feel personal, memorable, and effortless. From handcrafted sourdough breads and desserts to grazing tables, catering, and custom hampers, every Mezcla offering is rooted in quality, attention to detail, and genuine hospitality.
                </p>
                <p>
                  For Monali, Mezcla is about more than food. It's about <em className="text-cream not-italic">celebrating milestones</em>, fostering connections, and helping people create moments worth remembering. Every menu, table, and hamper is thoughtfully designed with the belief that the best experiences are often built around sharing good food with good company.
                </p>
              </div>

              {/* Gold closing quote */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="font-display text-xl md:text-2xl text-gold italic leading-snug">
                  "Thank you for letting my kitchen be a part of your celebrations."
                </p>
                <p className="mt-3 text-ivory-muted/50 text-xs uppercase tracking-[0.25em] font-medium">— Monali Shah</p>
              </div>

              {/* CTA */}
              <div className="mt-10 flex justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:bg-cream transition-all duration-300 hover:-translate-y-1"
                >
                  Say Hello <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Core Values (Bento Grid) */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeader eyebrow="Why Mezcla" title="We don't do shortcuts." align="center" />
          
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="md:col-span-2 p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="relative z-10">
                <div className="size-12 rounded-full bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                  <Clock className="size-5 text-gold-deep" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-ink leading-snug">Slow Methods</h3>
                <p className="mt-4 text-ink-muted leading-relaxed max-w-md">
                  We believe in long fermentation and considered recipes. Good things take time, which is why everything we make is prepared fresh to order in small batches. No inventory shelves.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 group">
              <div className="size-12 rounded-full bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                <Leaf className="size-5 text-gold-deep" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-ink">Honest Ingredients</h3>
              <p className="mt-3 text-ink-muted text-sm leading-relaxed">
                Real butter, real chocolate, real fruit. We never use preservatives or artificial shortcuts.
              </p>
            </div>

            <div className="p-6 sm:p-8 md:p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 group">
              <div className="size-12 rounded-full bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                <Shield className="size-5 text-gold-deep" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-ink">FSSAI Certified</h3>
              <p className="mt-3 text-ink-muted text-sm leading-relaxed">
                {fssai}. We maintain strict hygiene, sourcing, and packaging standards in our kitchen.
              </p>
            </div>

            <div className="md:col-span-2 p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-ink border border-ink hover:border-gold-deep/50 transition-all duration-500 flex flex-col justify-center items-start text-cream">
              <h3 className="font-display text-2xl lg:text-3xl">Personal Service</h3>
              <p className="mt-4 text-ivory-muted/80 leading-relaxed max-w-md">
                Every single order is handled by a real human. We don't automate our care. We deliver when promised, across {serviceAreas}, because we know these moments can't wait.
              </p>
              <a href={generateWhatsAppLink(waMessages.menu)} target="_blank" rel="noreferrer" className="mt-8 px-8 py-4 bg-gold-deep text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(184,134,11,0.2)] hover:bg-white hover:text-ink transition-all duration-300 hover:-translate-y-1">
                Say Hello on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-espresso py-24 md:py-32 text-center border-t border-white/5">
        <div className="container-luxe max-w-2xl">
          <p className="eyebrow !text-gold mb-4">Taste the intention</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Ready to order?</h2>
          <p className="mt-6 text-ivory-muted text-lg leading-relaxed">
            Browse our menu for fresh bakes, mezze jars, and curated gifts. We bake fresh every morning.
          </p>
          <a
            href={generateWhatsAppLink(waMessages.menu)}
            target="_blank"
            rel="noreferrer"
            className="mt-10 px-10 py-5 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-cream transition-all duration-300 hover:-translate-y-1 inline-block"
          >
            Explore the Menu
          </a>
        </div>
      </section>
    </>
  );
}
