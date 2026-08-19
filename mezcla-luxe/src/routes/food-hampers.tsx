import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { usePublicProductsByCategory, usePublicGallery } from "@/hooks/usePublicApi";
import { ProductCard } from "@/components/ui-custom/ProductCard";
import { FAQSection } from "@/components/sections/FAQSection";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { X, Sparkles, Gift, Clock, CheckCircle2, Minus, Heart } from "lucide-react";
import foodHampersImg from "@/assets/cat-food-hampers.jpg";

export const Route = createFileRoute("/food-hampers")({
  head: () => ({
    meta: [
      { title: "Food Gift Hampers in Bangalore — Festive, Corporate & Custom | Mezcla" },
      { name: "description", content: "Artisanal food hampers filled with handcrafted breads, dips, bakes and treats. Perfect for festive gifting, client appreciation and special occasions in Bangalore." },
      { property: "og:image", content: foodHampersImg },
    ],
    links: [{ rel: "canonical", href: "/food-hampers" }],
  }),
  component: FoodHampersPage,
});

const hamperStyles = [
  { t: "Festive Hamper", d: "Seasonal bakes, artisan jars and handcrafted treats — beautifully boxed for Diwali, Christmas and Eid." },
  { t: "Corporate Gift Hamper", d: "Thoughtfully curated, branded gifting for clients, teams and milestones. Minimum 10 units." },
  { t: "Wellness Hamper", d: "Granola, sourdough crackers, dips and wholesome bakes for the health-conscious." },
  { t: "Baker's Hamper", d: "An indulgent assortment of our finest breads, spreads and jars — for the bread lover." },
  { t: "Anniversary / Occasion Box", d: "A luxe, personalised selection for birthdays, anniversaries and thank-yous." },
  { t: "Custom Hamper", d: "Build it from scratch. Choose your items, size and packaging. We handle the rest." },
];

const includes = [
  "All products freshly made and packed on the day",
  "Beautiful, premium kraft or white box packaging",
  "Personalised card or note on request",
  "Delivery across South & Central Bangalore",
];
const notIncluded = [
  "Outstation delivery (available at extra cost on request)",
  "Orders below minimum for corporate hampers",
  "Same-day orders (3 days notice required)",
];

function FoodHampersPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data, isLoading } = usePublicProductsByCategory("food-hampers");
  const items: any[] = data?.data ?? [];

  const { data: galleryData } = usePublicGallery("hampers");
  const gallery = galleryData?.data ?? [];
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "Festive Hamper",
    quantity: "1–5 hampers",
    budget: "₹1,000 – ₹2,000",
    diet: "No restriction",
    date: "",
    notes: "",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Hi Mezcla! I'd like to order Food Hampers.\n\n` +
      `Type: ${form.type}\nQuantity: ${form.quantity}\nBudget per hamper: ${form.budget}\n` +
      `Dietary: ${form.diet}\nRequired Date: ${form.date}\n\nNotes: ${form.notes}`;
    window.open(generateWhatsAppLink(msg), "_blank");
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-espresso overflow-hidden min-h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          <div className="hidden lg:block bg-gradient-to-r from-espresso via-espresso/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-espresso/80 lg:hidden z-10" />
          <div className="absolute inset-0 lg:left-[40%]">
            <img src={foodHampersImg} alt="Food Gift Hampers" className="size-full object-cover opacity-50 lg:opacity-90" />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-espresso to-transparent" />
          </div>
        </div>
        <div className="container-luxe relative z-20 w-full pt-40 pb-24 lg:py-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
              <Gift className="size-3" />
              Thoughtfully Curated
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
              Gifts they'll <br />
              <span className="italic text-gold font-light">actually remember.</span>
            </h1>
            <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Artisanal hampers filled with handcrafted treats—perfect for festive gifting, client appreciation and every special occasion.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#order" className="px-8 py-4 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                Order a Hamper
              </a>
              <a href="#styles" className="px-8 py-4 border border-white/20 text-cream hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-xs rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                View Styles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-cocoa border-b border-white/5">
        <div className="container-luxe py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:p-8 md:p-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: <Gift className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Custom", label: "Fully Customisable" },
              { icon: <Clock className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "3 Days", label: "Advance Notice" },
              { icon: <Heart className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Personal", label: "Card Included" },
              { icon: <Sparkles className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Fresh", label: "Made to Order" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-0">
                {m.icon}
                <p className="font-display text-2xl text-cream mb-1">{m.val}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hamper Styles */}
      <section id="styles" className="bg-cocoa py-24 md:py-32 border-y border-white/5">
        <div className="container-luxe">
          <SectionHeader eyebrow="Hamper Styles" title="A hamper for every occasion." dark />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {hamperStyles.map((s) => (
              <div key={s.t} className="rounded-3xl bg-espresso border border-white/5 p-6 sm:p-8 md:p-10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 group">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gold/70 mb-4">Style</p>
                <h3 className="font-display text-2xl text-cream group-hover:text-gold transition-colors">{s.t}</h3>
                <p className="mt-4 text-ivory-muted/80 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-luxe grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-white border border-gold/20 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-32 text-gold-deep" /></div>
            <div className="relative z-10">
              <p className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs font-bold uppercase tracking-widest text-gold-deep mb-6">Included</p>
              <h3 className="font-display text-3xl md:text-4xl text-ink">What's in every hamper</h3>
              <ul className="mt-10 space-y-5">
                {includes.map((i) => (
                  <li key={i} className="flex gap-4 text-base md:text-lg text-ink-muted items-start">
                    <CheckCircle2 className="size-6 text-gold-deep shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-ink/[0.02] border border-border">
            <p className="inline-block px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold uppercase tracking-widest text-ink-muted/80 mb-6">Honest Note</p>
            <h3 className="font-display text-3xl md:text-4xl text-ink/80">Good to know</h3>
            <ul className="mt-10 space-y-5">
              {notIncluded.map((i) => (
                <li key={i} className="flex gap-4 text-base md:text-lg text-ink-muted/70 items-start">
                  <Minus className="size-6 text-ink/20 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Products */}
      {items.length > 0 && (
        <section className="bg-cream text-ink pb-24">
          <div className="container-luxe">
            <SectionHeader eyebrow="Ready to Gift" title="Our curated hampers." align="center" />
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-2xl bg-white border border-border shadow-soft animate-pulse h-80" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Order Form */}
      <section id="order" className="bg-espresso py-24 md:py-32">
        <div className="container-luxe max-w-4xl">
          <div className="text-center mb-16">
            <p className="eyebrow !text-gold mb-4">Concierge Order</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream">Build your hamper.</h2>
          </div>
          <form onSubmit={onSubmit} className="bg-cocoa/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <Field label="Hamper Type">
                <select value={form.type} onChange={(e) => update("type", e.target.value)} className="luxe-input">
                  {["Festive Hamper", "Corporate Gift Hamper", "Wellness Hamper", "Baker's Hamper", "Anniversary / Occasion Box", "Custom Hamper"].map((o) => (
                    <option key={o} className="bg-cocoa">{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Quantity">
                <select value={form.quantity} onChange={(e) => update("quantity", e.target.value)} className="luxe-input">
                  {["1–5 hampers", "5–10 hampers", "10–25 hampers", "25–50 hampers", "50+ hampers"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Budget per Hamper">
                <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="luxe-input">
                  {["₹500 – ₹1,000", "₹1,000 – ₹2,000", "₹2,000 – ₹5,000", "₹5,000+"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Dietary Requirements">
                <select value={form.diet} onChange={(e) => update("diet", e.target.value)} className="luxe-input">
                  {["No restriction", "Eggless", "Vegetarian", "Vegan", "Mixed"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Required Date">
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="luxe-input" required />
              </Field>
              <Field label="Notes (personalisation, occasion, etc.)" full>
                <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} className="luxe-input" placeholder="Any message, theme or special inclusions?" />
              </Field>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 pt-6">
                <button type="submit" className="w-full sm:w-auto px-10 py-5 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                  Send Order via WhatsApp
                </button>
                <p className="text-xs text-ivory-muted/50 uppercase tracking-widest">We confirm within 24 hours.</p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-cocoa py-24 md:py-32 border-y border-white/5">
          <div className="container-luxe">
            <SectionHeader eyebrow="Gallery" title="Past hampers & gift boxes." align="center" dark />
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-12">
              {gallery.map((img: any, i: number) => (
                <button key={i} onClick={() => setActiveImg(img.url)} className="block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-lg border border-white/5 hover:border-gold/30 transition-all duration-500 group">
                  <img src={img.url} alt={img.caption || "Hamper"} loading="lazy" className="w-full group-hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection category="hampers" />

      <style>{`
        .luxe-input { width:100%; padding:1rem 1.25rem; border-radius:1rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); color:var(--color-cream); font-size:0.95rem; transition:all 0.3s ease; }
        .luxe-input::placeholder { color:rgba(255,255,255,0.2); }
        .luxe-input:focus { outline:none; border-color:var(--color-gold); background:rgba(255,255,255,0.05); box-shadow:0 0 0 1px var(--color-gold); }
      `}</style>

      {activeImg && (
        <div className="fixed inset-0 z-[60] bg-espresso/95 backdrop-blur-sm grid place-items-center p-6" onClick={() => setActiveImg(null)}>
          <button className="absolute top-6 right-6 text-cream/50 hover:text-gold p-2 transition-colors"><X className="size-8" /></button>
          <img src={activeImg} alt="Preview" className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl ring-1 ring-white/10" />
        </div>
      )}
    </>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-ivory-muted/60 block mb-3 pl-2">{label}</span>
      {children}
    </label>
  );
}
