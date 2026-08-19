import { Instagram } from "lucide-react";
import { site } from "@/lib/site";
const imgs = [
  "/product_photos/sourdough/_dsc5593-enhanced-nr.jpg",
  "/product_photos/dips-platter/dips1.jpg",
  "/product_photos/mango_jar_cake/_dsc5869-2.jpg",
  "/product_photos/focaccia/_dsc5958.jpg",
  "/product_photos/quiche/quiche4.jpg",
  "/product_photos/chocolate_berliner/_dsc5825.jpg"
];

export function InstagramPreview() {
  return (
    <section className="bg-cream text-ink py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-lg">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1]">
              Join our <br />
              <span className="italic text-gold">community.</span>
            </h2>
            <p className="mt-4 text-ink/60 text-sm md:text-base leading-relaxed">
              Tag us in your Mezcla moments and stay updated with our latest seasonal creations and behind-the-scenes magic.
            </p>
          </div>
          <a 
            href={site.instagram} 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center gap-5 p-3 pr-8 rounded-full bg-white shadow-xl shadow-cocoa/5 border hairline hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-3.5 bg-cocoa text-cream rounded-full group-hover:bg-gold transition-colors">
              <Instagram className="size-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-bold text-ink/50 uppercase tracking-widest mb-0.5">Follow Us On Instagram</span>
              <span className="font-display text-xl text-ink group-hover:text-gold transition-colors">@mezclakitchen</span>
            </div>
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {imgs.map((src, idx) => (
            <a key={idx} href={site.instagram} target="_blank" rel="noreferrer"
              className="group relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
              <img src={src} alt="Instagram preview" loading="lazy" className="size-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-cocoa/0 group-hover:bg-cocoa/40 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-500 grid place-items-center">
                <Instagram className="size-8 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-50 group-hover:scale-100" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
