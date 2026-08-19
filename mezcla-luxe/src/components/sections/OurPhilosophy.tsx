import { Sparkles, ArrowRight } from "lucide-react";
import { ImageCarousel } from "@/components/ui-custom/ImageCarousel";

const PHILOSOPHY_IMAGES = [
  "/product_photos/sourdough/_dsc5593-enhanced-nr.jpg",
  "/product_photos/sourdough/_dsc5659-2.jpg",
  "/product_photos/dips-platter/dips1.jpg",
  "/product_photos/focaccia/_dsc5958.jpg"
];

export function OurPhilosophy() {
  return (
    <section className="bg-cocoa border-b hairline py-20 md:py-32 overflow-hidden">
      <div className="container-luxe">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Side */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl group">
            <ImageCarousel 
              images={PHILOSOPHY_IMAGES} 
              alt="Artisan Baking Process"
            />
            {/* Subtle dark gradient overlay for mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent pointer-events-none z-10" />
            
            {/* Single line text at the bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-espresso/80 backdrop-blur-md px-6 py-4 border-t border-white/10 flex items-center justify-center gap-3 z-20">
              <Sparkles className="size-4 text-gold shrink-0" />
              <p className="text-sm text-cream tracking-wide">
                <span className="font-semibold">Made Fresh to Order </span> 
                <span className="text-ivory-muted ml-2">— Patience is our primary ingredient.</span>
              </p>
            </div>
          </div>

          {/* Text Side */}
          <div className="flex flex-col justify-center">
            <p className="eyebrow !text-gold mb-4">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1] mb-6">
              We don't just make food—<br />
              <span className="italic text-gold/90">we create moments that bring people together.</span>
            </h2>
            
            <div className="space-y-6 text-ivory-muted/90 text-sm md:text-base leading-relaxed max-w-lg">
              <p>
                At Mezcla, we believe that the most memorable moments are shared around good food. Whether it's a quiet breakfast with fresh sourdough, a birthday celebrated with cake, or friends gathered around a beautifully curated grazing table, every bite has the power to create lasting memories. 
              </p>
              <p>
                That's why everything we make is handcrafted fresh in small batches, using thoughtfully sourced ingredients and meticulous attention to detail. We never use preservatives or shortcuts—just honest food, made with care.
              </p>
              <p>
                From everyday indulgences to life's biggest celebrations, our purpose is simple: to create food that's worth gathering around.
              </p>
            </div>

            <div className="mt-10">
              <a 
                href="/products" 
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cocoa bg-gold hover:bg-cream px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore the Menu
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
